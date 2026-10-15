#!/usr/bin/env bash
# Installe une copie figée de la garde anti-malware dans les hooks git locaux
# (post-checkout et post-merge).
#
# Volontairement PAS de hooks versionnés ni de core.hooksPath : ils exécuteraient le code
# de la branche qu'on vient de récupérer, donc celui d'une branche piégée. La copie figée
# dans .git/hooks est voulue ; relancez ce script pour la mettre à jour.
set -u

racine="$(git rev-parse --show-toplevel)" || exit 1
cd "$racine" || exit 1
hooks="$(cd "$(git rev-parse --git-path hooks)" 2>/dev/null && pwd)" || { mkdir -p "$(git rev-parse --git-path hooks)"; hooks="$(cd "$(git rev-parse --git-path hooks)" && pwd)"; }

source=""
for candidat in scripts/garde-malware.js scripts/garde-malware.cjs; do
    [ -f "$candidat" ] && source="$candidat" && break
done
[ -n "$source" ] || { echo "garde introuvable dans scripts/" >&2; exit 1; }

# Même extension que la source : un .js sous un package.json "type": "module" serait lu en ESM.
copie="$hooks/$(basename "$source")"
cp "$source" "$copie"

marqueur="# garde-malware : copie figée (scripts/installer-garde.sh)"
for hook in post-checkout post-merge; do
    cible="$hooks/$hook"
    if [ -e "$cible" ] && ! grep -qF "$marqueur" "$cible"; then
        continue # hook existant qui n'est pas la garde : on n'y touche pas
    fi
    cat > "$cible" <<EOF
#!/bin/sh
$marqueur
node "$copie" --racine "\$(git rev-parse --show-toplevel)"
exit 0
EOF
    chmod +x "$cible"
    echo "✅ hook $hook installé"
done
