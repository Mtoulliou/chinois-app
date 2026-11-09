# Révisions chinois

App web de révision de mandarin (LV2), en français. **Un seul fichier : `index.html`** (HTML + CSS + JS, sans build, sans dépendance à installer).

## Commandes
- Lancer en local : `python3 -m http.server 8000` puis http://localhost:8000
- Pas de build, pas de tests automatisés (vérifier à la main sur mobile 390 px, clair et sombre).

## Structure
- `index.html` : l'app (prod = branche `main`, publiée sur GitHub Pages).
- `manifest.webmanifest`, `sw.js`, `icons/` : installation sur l'écran d'accueil et hors-ligne. **Changer `VERSION` dans `sw.js`** si on renomme ou ajoute un fichier à mettre en cache (liste `SHELL`).
- `design/maquettes/` : maquettes Claude Design (`*.dc.html`) + `canvas.json`. Référence visuelle, non publiée comme app. Elles réclament un `support.js` du moteur Design, donc elles ne s'ouvrent pas seules.
- `cours/cours-chinois-lv2.md` : le cours (source du vocabulaire).
- `docs/` : décisions de design, fonctionnalités, historique. Lire avant de changer une règle.

## Conventions
- Code : tout dans `index.html`. Thème par variables CSS `:root` (jade `#256E5E`), clair + sombre.
- Police : Noto Serif SC (caractères), Source Sans 3 (interface). Cible tactile ≥ 44 px.
- Données : `LESSONS` (≈ ligne 616) liste leçons et thèmes ; le vocabulaire vient de la fonction qui remplit `V`.
- Sauvegarde : `localStorage` clé `revisions-chinois-v1`. La synchro `window.claude` ne sert que dans l'artefact claude.ai, elle doit rester sans effet ailleurs.
- Écriture des caractères : bibliothèque Hanzi Writer (MIT) intégrée, avec les données de traits de 242 caractères embarquées (`HANZI_DATA`).

## Règles métier (ne pas casser)
- Un niveau est validé à 80 %. Les thèmes se débloquent dans l'ordre.
- Tous les niveaux d'une leçon validés → contrôle (16/20 requis) → leçon suivante.
- Révision : tout le vocabulaire accessible sans verrou.
- Écriture : 3 étapes (observer, guidé, mémoire), maîtrisé après 2 tracés de mémoire sans faute, séries de 8. Accessible depuis l'onglet **Collection**.
- Collection : caractère **jade** = niveau 2 (`LEARN_LV`) du thème d'un mot qui le contient validé ET aucune erreur en cours sur ces mots ; **à corriger** si une erreur reste ; **or** = jade + écriture maîtrisée. Niveau **or** = 100 %, contrôle or = 20/20.
- Flamme : `state.days` (date locale). Compte une série **réussie** : niveau ≥ 80 %, contrôle réussi, révision/à réviser ≥ 10/20, écriture avec au moins la moitié sans faute.
- Révision espacée : `state.srs[id]={b,d}`, intervalles `SRS_INT`. Seuls les éléments du cours (`BYID`) sont suivis, pas les phrases générées.
- Tout nouvel état persistant doit être ajouté à `freshState`, `exportCode` et `importCode`.

## Workflow Git
- `main` = prod (Pages déploie à chaque push). `dev` = travail. Une feature = une branche `feature/nom` depuis `dev`, PR vers `dev`, puis `dev` → `main`.
- Ne jamais pousser directement sur `main` pour une feature. Commits petits et clairs.
- Ne jamais mettre de secret dans le repo (repo public).
