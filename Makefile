# Garde anti-malware : lit le dépôt comme du texte, avant tout lancement du projet.
.PHONY: garde garde-branches garde-installer test-garde
garde:
	node ./scripts/garde-malware.js

garde-branches:
	node ./scripts/garde-malware.js --branches

garde-installer:
	bash ./scripts/installer-garde.sh

test-garde: garde
	node --test ./scripts/garde-malware.test.js
