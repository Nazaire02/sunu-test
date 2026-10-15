#!/usr/bin/env node
// Garde-fou de sécurité : détecte les injections de code malveillant connues dans le dépôt.
// Lancé automatiquement avant les scripts npm de lancement (hooks pre*) et par la CI
// (.github/workflows/security-guard.yml). En cas de détection, la commande échoue (exit 1).
//
// Signatures recherchées (campagne de commits forgés observée en 2026) :
//   - code caché après une longue suite d'espaces dans un fichier de config ou de code ;
//   - scripts déguisés en polices/images (ex. public/fonts/fa-solid-700.otf) ;
//   - tâches VS Code lancées automatiquement à l'ouverture du dossier (runOn: folderOpen) ;
//   - scripts npm détournés (`node api.js && …`, exécution d'un fichier non-JS, hooks d'installation) ;
//   - code obfusqué (eval, new Function, identifiants _0x…, gros blocs base64).

import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SELF_PATH = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(SELF_PATH), "..");
const SELF = path.relative(ROOT, SELF_PATH).split(path.sep).join("/");

const IGNORED_DIRS = new Set(["node_modules", ".next", ".git", "out", "build", "dist", "coverage", ".vercel", ".expo", "vendor"]);
const CODE_EXTENSIONS = new Set([".js", ".mjs", ".cjs", ".jsx", ".ts", ".tsx", ".mts", ".cts"]);
const SKIP_LONG_LINES = /(\.min\.(js|css)|\.map|\.bundle\.js|-lock\.json|\.lock|lock\.yaml)$/i;
const MAX_LINE_LENGTH = 3000;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Scripts npm de lancement qui doivent être précédés de la vérification.
const GUARDED_SCRIPTS = ["dev", "start", "build", "start:dev", "serve", "preview", "android", "ios", "web"];
const INSTALL_HOOKS = ["preinstall", "install", "postinstall", "preuninstall", "postuninstall"];

// Signatures binaires : un fichier "police" ou "image" qui contient du texte est suspect.
const MAGIC = {
    ".woff": (b) => b.toString("latin1", 0, 4) === "wOFF",
    ".woff2": (b) => b.toString("latin1", 0, 4) === "wOF2",
    ".otf": (b) => b.toString("latin1", 0, 4) === "OTTO",
    ".ttf": (b) => b.readUInt32BE(0) === 0x00010000 || b.toString("latin1", 0, 4) === "true",
    ".eot": (b) => b.length > 35 && b[34] === 0x4c && b[35] === 0x50,
    ".png": (b) => b.readUInt32BE(0) === 0x89504e47,
    ".jpg": (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
    ".jpeg": (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
    ".gif": (b) => b.toString("latin1", 0, 4) === "GIF8",
    ".webp": (b) => b.toString("latin1", 0, 4) === "RIFF" && b.toString("latin1", 8, 12) === "WEBP",
    ".ico": (b) => b.readUInt32BE(0) === 0x00000100,
};

const NON_JS_EXEC = /\bnode\s+(?:-\S+\s+)*(?:[^\s&|;'"]*\/)?[^\s&|;'"]+\.(?:otf|ttf|woff2?|eot|svg|png|jpe?g|gif|ico|webp|css|txt|md|map)\b/i;

const TEXT_RULES = [
    { message: "Code caché après une longue suite d'espaces", test: (line) => /\S[ \t]{120,}\S/.test(line) || /^[ \t]{200,}\S/.test(line) },
    { message: "Exécution par node d'un fichier qui n'est pas du JavaScript", test: (line) => NON_JS_EXEC.test(line) },
    { message: "Signature du malware « global.i = 'A10… »", test: (line) => /global\.i\s*=\s*['"]A10/.test(line) },
];

const CODE_RULES = [
    { message: "Identifiants obfusqués (_0x…)", test: (line) => /\b_0x[0-9a-f]{4,}\b/i.test(line) },
    { message: "Appel à eval()", test: (line) => /(?<![.\w])eval\s*\(/.test(line) },
    { message: "Construction de code avec new Function()", test: (line) => /\bnew\s+Function\s*\(/.test(line) },
    { message: "Longue chaîne d'échappements hexadécimaux", test: (line) => /(?:\\x[0-9a-f]{2}){24,}/i.test(line) },
    { message: "Bloc base64 volumineux dans le code", test: (line) => /['"`][A-Za-z0-9+/]{400,}={0,2}['"`]/.test(line) },
];

const ALLOW = /security-check:\s*allow/;

const findings = [];
const report = (file, line, message) => findings.push({ file, line, message });
const toPosix = (p) => p.split(path.sep).join("/");

function listFiles() {
    const files = new Set();
    try {
        const out = execFileSync("git", ["ls-files", "-z", "--cached", "--others", "--exclude-standard"], {
            cwd: ROOT,
            encoding: "utf8",
            stdio: ["ignore", "pipe", "ignore"],
            maxBuffer: 64 * 1024 * 1024,
        });
        out.split("\0").filter(Boolean).forEach((f) => files.add(f));
    } catch {
        walk("", files);
    }
    // Les configs d'éditeur sont souvent ignorées par git : on les inspecte quand même.
    for (const dir of [".vscode", ".idea"]) walk(dir, files);
    return [...files].map(toPosix).filter((f) => !f.split("/").some((part) => IGNORED_DIRS.has(part)));
}

function walk(relDir, acc) {
    const absDir = path.join(ROOT, relDir);
    if (!existsSync(absDir)) return;
    for (const entry of readdirSync(absDir, { withFileTypes: true })) {
        if (IGNORED_DIRS.has(entry.name)) continue;
        const rel = path.join(relDir, entry.name);
        if (entry.isDirectory()) walk(rel, acc);
        else if (entry.isFile()) acc.add(rel);
    }
}

function checkFile(rel) {
    if (rel === SELF) return;
    const abs = path.join(ROOT, rel);
    if (!existsSync(abs)) return;
    const stat = statSync(abs);
    if (!stat.isFile() || stat.size === 0 || stat.size > MAX_FILE_SIZE) return;

    const buffer = readFileSync(abs);
    const ext = path.extname(rel).toLowerCase();

    const magic = MAGIC[ext];
    if (magic) {
        if (buffer.length < 12 || !magic(buffer)) report(rel, null, `Le contenu ne correspond pas à un vrai fichier ${ext} (script déguisé ?)`);
        return;
    }
    if (buffer.includes(0)) return; // autre binaire

    const text = buffer.toString("utf8");
    const isMarkdown = ext === ".md" || ext === ".mdx";
    const isCode = CODE_EXTENSIONS.has(ext) && !SKIP_LONG_LINES.test(rel);
    const rules = isMarkdown ? TEXT_RULES.slice(1) : isCode ? [...TEXT_RULES, ...CODE_RULES] : TEXT_RULES;
    const lines = text.split(/\r?\n/);

    lines.forEach((line, index) => {
        // Un commentaire « security-check: allow » sur la ligne ou celle du dessus exempte des règles d'obfuscation.
        const allowed = ALLOW.test(line) || ALLOW.test(lines[index - 1] ?? "");
        for (const rule of rules) {
            if (allowed && CODE_RULES.includes(rule)) continue;
            if (rule.test(line)) report(rel, index + 1, rule.message);
        }
        if (isCode && line.length > MAX_LINE_LENGTH) report(rel, index + 1, `Ligne de ${line.length} caractères (code minifié/obfusqué ?)`);
    });

    if (ext === ".svg" && /<script\b/i.test(text)) report(rel, null, "SVG contenant du JavaScript");

    if (/^\.(vscode|idea)\//.test(rel)) {
        lines.forEach((line, index) => {
            if (/["']?runOn["']?\s*:\s*["']folderOpen["']/.test(line)) report(rel, index + 1, "Tâche lancée automatiquement à l'ouverture du dossier (runOn: folderOpen)");
            if (/task\.allowAutomaticTasks["']?\s*:\s*(true|["']on["'])/.test(line)) report(rel, index + 1, "Exécution automatique des tâches VS Code activée");
        });
    }

    if (path.basename(rel) === "package.json") checkPackageJson(rel, text);
}

function checkPackageJson(rel, text) {
    let pkg;
    try {
        pkg = JSON.parse(text);
    } catch {
        report(rel, null, "package.json illisible");
        return;
    }
    const scripts = pkg.scripts ?? {};
    const pkgDir = path.posix.dirname(rel);
    const expectedHook = `node ${path.posix.relative(pkgDir, SELF) || SELF}`;

    for (const [name, command] of Object.entries(scripts)) {
        if (typeof command !== "string") continue;
        if (/\bnode\s+api\.js\b/.test(command)) report(rel, null, `Script "${name}" lance api.js : "${command}"`);
        if (NON_JS_EXEC.test(command)) report(rel, null, `Script "${name}" exécute un fichier non-JS : "${command}"`);
        if (/\b(curl|wget)\b[^|]*\|\s*(ba|z)?sh\b|base64\s+(-d|--decode)|\beval\b/.test(command)) report(rel, null, `Script "${name}" suspect : "${command}"`);
    }
    for (const hook of INSTALL_HOOKS) {
        if (scripts[hook]) report(rel, null, `Hook d'installation "${hook}" présent : "${scripts[hook]}"`);
    }
    for (const name of GUARDED_SCRIPTS) {
        if (scripts[name] && scripts[`pre${name}`] !== expectedHook) {
            report(rel, null, `Le script "${name}" doit être précédé de la vérification : ajoutez "pre${name}": "${expectedHook}"`);
        }
    }
}

const files = listFiles();
files.forEach(checkFile);

const inCi = process.env.GITHUB_ACTIONS === "true";
const useColor = process.stdout.isTTY && !inCi;
const paint = (code, text) => (useColor ? `\x1b[${code}m${text}\x1b[0m` : text);

if (findings.length === 0) {
    console.log(paint("32", `✔ Vérification de sécurité : aucun signe d'infection (${files.length} fichiers analysés).`));
    process.exit(0);
}

console.error(paint("1;31", `\n✖ Vérification de sécurité : ${findings.length} élément(s) suspect(s) détecté(s).\n`));
for (const { file, line, message } of findings) {
    console.error(`  ${paint("33", line ? `${file}:${line}` : file)}  ${message}`);
    if (inCi) console.log(`::error file=${file}${line ? `,line=${line}` : ""}::${message}`);
}
console.error(
    paint("31", "\nCommande bloquée. N'ouvrez pas ces fichiers dans VS Code et ne lancez pas `npm install` avant de les avoir inspectés.\n") +
        "Comparez avec une version saine (git log -p) puis supprimez le code injecté.\n",
);
process.exit(1);
