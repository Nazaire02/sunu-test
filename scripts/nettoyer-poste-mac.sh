#!/usr/bin/env bash
# Nettoie un poste macOS des indicateurs connus du loader Node.js (incidents 09/2026 et 10/2026).
# Agit UNIQUEMENT sur les indicateurs connus : processus de l'implant, lignes de crontab,
# faux LaunchAgents, fichiers de l'implant, exécution automatique des tâches d'éditeur.
# Sortie : ⛔ et code 1 si quelque chose a été trouvé (et nettoyé), sinon ✅ et code 0.
#
# NETTOYER_SANS_SYSTEME=1 : n'agit que sur les fichiers de $HOME (pas de kill, crontab ni launchctl).
# Utile pour tester le script avec un HOME factice.
set -u

TROUVE=0
SANS_SYSTEME="${NETTOYER_SANS_SYSTEME:-0}"
signaler() { TROUVE=1; echo "⛔ $*"; }

# Indicateurs, découpés pour que ce script ne se signale pas lui-même.
IPS="194\.11\.226\.41|193\.247\.144\.38"
PROC_IOC="node -e global\[|tg14""xq|Request\._""V|NSPaste""board|runtime""dev-link|com\.apple\.icon""services\.store/Catalog""Data|Caches/com\.apple\.software""update/"
CONTENT_IOC="tg14""xq|runtime""dev-link|VSCode""Updater|SSTAR_API""_BASE|Caches/com\.apple\.software""update|com\.apple\.icon""services\.store|$IPS"

# 1. Processus de l'implant et processus connectés aux IP connues
if [ "$SANS_SYSTEME" != "1" ]; then
    pids=$(ps -axww -o pid=,command= | grep -E "$PROC_IOC" | grep -v grep | awk '{print $1}')
    pids="$pids $(lsof -nP -iTCP 2>/dev/null | grep -E "$IPS" | awk 'NR>0{print $2}')"
    for pid in $pids; do
        [ -n "$pid" ] && [ "$pid" != "$$" ] || continue
        signaler "processus $pid : $(ps -o command= -p "$pid" 2>/dev/null | cut -c1-120)"
        kill -9 "$pid" 2>/dev/null
    done

    # 2. Crontab : retire les lignes suspectes, garde les autres
    if crontab -l >/dev/null 2>&1; then
        actuelle=$(crontab -l 2>/dev/null)
        suspectes=$(printf '%s\n' "$actuelle" | grep -E "$CONTENT_IOC|$PROC_IOC|@reboot.*(node|python|osascript|curl)")
        if [ -n "$suspectes" ]; then
            signaler "crontab : $(printf '%s' "$suspectes" | tr '\n' ' ')"
            printf '%s\n' "$actuelle" | grep -vE "$CONTENT_IOC|$PROC_IOC|@reboot.*(node|python|osascript|curl)" | crontab -
        fi
    fi
fi

# 3. Faux LaunchAgents (par nom exact ou par contenu pointant vers l'implant)
for dir in "$HOME/Library/LaunchAgents" "/Library/LaunchAgents" "/Library/LaunchDaemons"; do
    [ -d "$dir" ] || continue
    for plist in "$dir"/*.plist; do
        [ -f "$plist" ] || continue
        nom=$(basename "$plist")
        case "$nom" in
            com.apple.softwareupdate.agent.plist|com.apple.softwareupdate.background.plist|com.VSCodeUpdater*.plist) faux=1 ;;
            *) faux=0; grep -qE "$CONTENT_IOC" "$plist" 2>/dev/null && faux=1 ;;
        esac
        [ "$faux" = 1 ] || continue
        signaler "LaunchAgent : $plist"
        if [ "$SANS_SYSTEME" != "1" ]; then
            case "$dir" in
                "$HOME"/*) launchctl bootout "gui/$(id -u)" "$plist" 2>/dev/null ;;
                *) sudo -n launchctl bootout system "$plist" 2>/dev/null ;;
            esac
        fi
        rm -f "$plist" 2>/dev/null || signaler "impossible de supprimer $plist (droits administrateur ?)"
    done
done

# 4. Fichiers de l'implant
for chemin in \
    "$HOME/Library/Application Support/VSCodeUpdater" \
    "$HOME/VSCodeUpdater.log" \
    "$HOME/Library/Caches/com.apple.iconservices.store" \
    "$HOME/Library/Caches/com.apple.softwareupdate" \
    "$HOME/.config/runtimedev-link" \
    "$HOME/.local/share/runtimedev-link"; do
    if [ -e "$chemin" ]; then
        signaler "fichier de l'implant : $chemin"
        rm -rf "$chemin"
    fi
done

# ~/.node_modules seulement s'il ne déclare que axios et/ou socket.io-client
if [ -f "$HOME/.node_modules/package.json" ]; then
    deps=$(tr -d ' \n' < "$HOME/.node_modules/package.json" | sed -n 's/.*"dependencies":{\([^}]*\)}.*/\1/p' | tr ',' '\n' | sed 's/"\([^"]*\)".*/\1/' | grep -vE '^(axios|socket\.io-client)$' | grep -c .)
    if [ "$deps" = "0" ]; then
        signaler "dépendances de l'implant : $HOME/.node_modules"
        rm -rf "$HOME/.node_modules"
    fi
fi

# 5. Fichiers de démarrage du shell : signalés seulement (à corriger à la main)
for rc in "$HOME/.zshrc" "$HOME/.zprofile" "$HOME/.zshenv" "$HOME/.bash_profile" "$HOME/.profile"; do
    [ -f "$rc" ] && grep -nE "$CONTENT_IOC|$PROC_IOC" "$rc" 2>/dev/null | while read -r ligne; do
        echo "⛔ ligne suspecte dans $rc : $ligne (à retirer à la main)"
    done
    [ -f "$rc" ] && grep -qE "$CONTENT_IOC|$PROC_IOC" "$rc" 2>/dev/null && TROUVE=1
done

# 6. Désactive l'exécution automatique des tâches dans VS Code, Cursor et Windsurf
for app in Code Cursor Windsurf; do
    reglages="$HOME/Library/Application Support/$app/User/settings.json"
    [ -f "$reglages" ] || continue
    if grep -qE '"task\.allowAutomaticTasks"[[:space:]]*:[[:space:]]*"off"' "$reglages"; then
        continue
    elif grep -q '"task\.allowAutomaticTasks"' "$reglages"; then
        sed -i '' -E 's/("task\.allowAutomaticTasks"[[:space:]]*:[[:space:]]*)("[^"]*"|true|false)/\1"off"/' "$reglages"
    else
        sed -i '' -E '1,/\{/ s/\{/{\
    "task.allowAutomaticTasks": "off",/' "$reglages"
    fi
    echo "ℹ️  $app : task.allowAutomaticTasks mis à \"off\""
done

if [ "$TROUVE" = 1 ]; then
    echo "⛔ Indicateurs de compromission trouvés et nettoyés : redémarrez, relancez ce script, puis changez vos identifiants."
    exit 1
fi
echo "✅ Poste sain : aucun indicateur connu."
exit 0
