#!/usr/bin/env bash
# Audit du contenu de l'app (vocabulaire, thèmes, leçons, phrases, niveaux).
# Usage : tools/run-audit.sh            (depuis n'importe où)
# Prérequis : python3, node, chromium / chrome (ou variable CHROME=/chemin/vers/chrome).
# Code de sortie : 0 = aucune erreur ; 1 = au moins une ERREUR ; 2 = problème d'environnement.
set -uo pipefail
cd "$(dirname "$0")/.."

CHROME="${CHROME:-$(command -v chromium || command -v chromium-browser || command -v google-chrome || command -v google-chrome-stable || true)}"
[ -n "$CHROME" ] || { echo "Chrome ou Chromium introuvable (définir CHROME=...)"; exit 2; }
command -v python3 >/dev/null || { echo "python3 introuvable"; exit 2; }

FAIL=0

# 1. Syntaxe de tous les scripts de index.html et de sw.js
python3 -I - <<'PY' || FAIL=1
import re,subprocess,sys,tempfile,os
s=open('index.html',encoding='utf-8').read()
ok=True
for i,m in enumerate(re.findall(r'<script>(.*?)</script>',s,flags=re.S)):
    f=tempfile.NamedTemporaryFile('w',suffix='.js',delete=False,encoding='utf-8');f.write(m);f.close()
    r=subprocess.run(['node','--check',f.name],capture_output=True,text=True);os.unlink(f.name)
    if r.returncode: ok=False;print('ERREUR: syntaxe du script',i,'de index.html :',r.stderr.strip().splitlines()[0] if r.stderr else '')
r=subprocess.run(['node','--check','sw.js'],capture_output=True,text=True)
if r.returncode: ok=False;print('ERREUR: syntaxe de sw.js')
if ok: print('OK: syntaxe de index.html et sw.js')
sys.exit(0 if ok else 1)
PY

# 2. Fichiers listés dans le service worker (SHELL) : ils doivent exister
python3 -I - <<'PY' || FAIL=1
import re,os,sys
t=open('sw.js',encoding='utf-8').read()
m=re.search(r'const SHELL = \[(.*?)\];',t,re.S)
files=re.findall(r'"([^"]+)"',m.group(1)) if m else []
miss=[f for f in files if f!='./' and not os.path.exists(f)]
if miss: print('ERREUR: fichiers du service worker introuvables :',', '.join(miss));sys.exit(1)
print('OK: %d fichiers du service worker présents'%len(files))
PY

# 3. Audit dans un vrai navigateur
TMP="$(mktemp -d)"
PORT="$(python3 -c 'import socket;s=socket.socket();s.bind(("127.0.0.1",0));print(s.getsockname()[1])')"
cleanup(){ [ -n "${SRV:-}" ] && kill "$SRV" 2>/dev/null; rm -rf "$TMP"; }
trap cleanup EXIT

python3 -I - "$TMP" <<'PY'
import sys
b=open('index.html',encoding='utf-8').read()
a=open('tools/audit.js',encoding='utf-8').read()
inj=('<script>setTimeout(()=>{let out;try{out=eval(%s)}catch(e){out="ERREUR: audit impossible : "+e.message}'
     'const p=document.createElement("pre");p.id="AUDIT";p.textContent=out;document.body.appendChild(p)},700)</script>')%__import__('json').dumps(a)
open(sys.argv[1]+'/audit.html','w',encoding='utf-8').write(b.replace('</body></html>',inj+'</body></html>'))
PY

python3 -m http.server "$PORT" --bind 127.0.0.1 --directory "$TMP" >/dev/null 2>&1 &
SRV=$!
sleep 1

OUT="$("$CHROME" --headless=new --no-sandbox --disable-gpu --virtual-time-budget=240000 --dump-dom "http://127.0.0.1:$PORT/audit.html" 2>/dev/null)"
REPORT="$(printf '%s' "$OUT" | python3 -I -c "
import sys,re,html
d=sys.stdin.read();m=re.search(r'<pre id=\"AUDIT\">(.*?)</pre>',d,re.S)
print(html.unescape(m.group(1)) if m else 'ERREUR: aucun rapport (la page ne s\'est pas chargée ou le script a échoué)')")"
echo "$REPORT"
echo "$REPORT" | grep -q '^ERREUR' && FAIL=1
echo
if [ "$FAIL" -eq 0 ]; then echo ">>> AUDIT RÉUSSI : aucune erreur."; else echo ">>> AUDIT ÉCHOUÉ : corriger les ERREUR ci-dessus avant de livrer."; fi
exit "$FAIL"
