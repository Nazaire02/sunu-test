# Les Tailleurs — API

Node.js 24, Express 5, Mongoose 9 et MongoDB. Les collections métier sont isolées par utilisateur authentifié. La connexion utilise le numéro ivoirien vérifié sur WhatsApp avec Twilio Programmable Messaging.

## Configuration

Copier `env.example` vers `.env`, renseigner une URI MongoDB locale ou MongoDB Atlas, les paramètres Twilio WhatsApp et un secret aléatoire généré avec `node -e "console.log(require('node:crypto').randomBytes(64).toString('hex'))"`.

MongoDB standalone est pris en charge, sans replica set. Les paiements sont enregistrés par une mise à jour atomique de la commande. Les créations de commandes sont traitées successivement par atelier dans un même processus backend ; utiliser une seule instance pour conserver cet ordre de planification. Sans transaction entre collections, un échec peut laisser un trou dans la numérotation. Si le nettoyage du brouillon échoue après la création, renvoyer la même demande termine le nettoyage sans recréer la commande. Aucun message fictif n’est disponible. Activer les destinations Côte d’Ivoire dans les paramètres Twilio et approvisionner le compte.

```sh
npm ci
npm run db:indexes
npm run dev
```

## Mobile

Dans le frontend, copier `env.example` vers `.env` et définir `EXPO_PUBLIC_API_URL=http://ADRESSE_IP_DU_MAC:4000/api/v1` pour un téléphone sur le même réseau. Redémarrer Expo après modification. Sans variable en développement, le mobile déduit l’hôte du serveur Expo. Un tunnel Expo ne publie pas automatiquement cette API.

En production, définir l’URL HTTPS réelle dans le frontend avant compilation et `PUBLIC_URL` côté API. Les données précédemment enregistrées uniquement sur le téléphone ne sont pas importées automatiquement.

## Sessions

L’access token dure au maximum quinze minutes. Le refresh token opaque est stocké sous forme de hash en base et renouvelé à chaque utilisation. Toute session expire exactement sept jours après la connexion, sans prolongation par renouvellement. Réutiliser un ancien refresh token révoque la session. La déconnexion la révoque immédiatement. Sur mobile, le refresh token utilise SecureStore ; sur le web, un cookie HttpOnly. Le web doit autoriser les cookies du domaine API ; privilégier un même site pour le frontend et l’API.

## Routes

Toutes les routes métier sont sous `/api/v1` et nécessitent un Bearer token, sauf la lecture des images qui utilise une URL signée liée à la session.

| Domaine | Routes |
| --- | --- |
| Authentification | POST `/auth/request-code`, `/auth/verify-code`, `/auth/refresh`, `/auth/logout` |
| Atelier | GET et PUT `/workshop` |
| Clients | GET et POST `/clients`, GET et PATCH `/clients/:id` |
| Commandes | GET et POST `/orders`, GET `/orders/:id`, GET `/orders/estimate` |
| Brouillon | GET, PUT et DELETE `/orders/draft` |
| Acomptes | POST `/orders/:id/payments` |
| Statut | PATCH `/orders/:id/status` |
| Photos | POST `/media` multipart champ `image`, GET `/media/:id` signé |
| Santé | GET `/health/live`, `/health/ready` |

Les listes acceptent `page` et `limit` (100 maximum). Les réponses suivent `{ data, meta? }` ou `{ error: { code, message, requestId } }`. Les commandes et paiements exigent un UUID `requestId` pour éviter les doublons lors des nouvelles tentatives. Les montants sont des entiers en francs CFA. Les photos sont converties en WebP et conservées dans MongoDB ; aucun disque applicatif persistant n’est nécessaire.

## Déploiement

Construire l’image avec `docker build -t les-tailleurs-api .` puis fournir les variables par le gestionnaire de secrets de l’hébergeur. Définir `NODE_ENV=production`, `PUBLIC_URL` en HTTPS et `CORS_ORIGINS` avec les origines web exactes. Régler `TRUST_PROXY_HOPS` selon le nombre réel de reverse proxies de confiance, sans exposer directement le serveur derrière ceux-ci. Le proxy doit accepter les envois de 5 Mo et transmettre correctement l’adresse IP.

Exécuter `npm run db:indexes` avec les mêmes variables avant la mise en service. Configurer la sonde sur `/health/ready` et sauvegarder MongoDB, qui contient aussi les photos. L’API écoute sur `0.0.0.0:$PORT` et ferme ses connexions proprement à l’arrêt. Aucun hébergeur ni compte MongoDB/Twilio n’est créé par ce projet.

## Vérifications

```sh
npm run check
npm run test:unit
npm test
```

Les tests d’intégration démarrent une instance MongoDB standalone temporaire et ne contactent pas Twilio. Ils nécessitent l’autorisation d’ouvrir des ports locaux et un binaire MongoDB disponible ou téléchargeable. `MONGOMS_SYSTEM_BINARY=/chemin/vers/mongod npm test` permet d’utiliser un binaire installé.

## Configuration WhatsApp

Configurer un expéditeur WhatsApp approuvé dans Twilio et créer un modèle de catégorie Authentication en français, avec bouton de copie du code, variable `{{1}}` pour le code et durée affichée de dix minutes. Faire approuver ce modèle par WhatsApp.

Renseigner `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_FROM` au format `whatsapp:+225...` et `TWILIO_WHATSAPP_CONTENT_SID` avec le SID `HX...` du modèle. `TWILIO_VERIFY_SERVICE_SID` n’est plus utilisé et peut être retiré des variables de déploiement. Aucun secret existant n’est modifié automatiquement.

Le backend génère six chiffres avec le générateur cryptographique Node.js et transmet ce code à l’API Messages de Twilio. Seule une empreinte HMAC liée à l’identifiant du challenge est enregistrée dans MongoDB. Le code n’est jamais renvoyé au mobile ni journalisé.

Le code expire dix minutes après génération. Un délai glissant strict de soixante secondes entre demandes est imposé en base, même après utilisation du code et entre plusieurs instances du serveur. Un renvoi invalide le code précédent. Après cinq essais incorrects, le challenge est supprimé. Une validation réussie supprime atomiquement le challenge avant l’ouverture de session, empêchant sa réutilisation. Un code expiré est refusé immédiatement, même si le nettoyage TTL de MongoDB ne l’a pas encore supprimé physiquement. Un échec d’envoi supprime le challenge ; le délai de renvoi reste appliqué.

Exécuter `npm run db:indexes` au déploiement. Les anciens challenges Twilio Verify ne sont plus utilisables : demander un nouveau code. La session conserve son expiration absolue de sept jours.

Documentation : https://www.twilio.com/docs/content/whatsappauthentication
