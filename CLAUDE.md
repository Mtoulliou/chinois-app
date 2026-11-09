# Révisions chinois

App web de révision de mandarin (LV2), en français. **Un seul fichier : `index.html`** (HTML + CSS + JS, sans build, sans dépendance à installer).

## Commandes
- Lancer en local : `python3 -m http.server 8000` puis http://localhost:8000
- Pas de build. **Audit du contenu : `tools/run-audit.sh`** (navigateur sans écran ; code 0 = aucune erreur). À lancer avant toute livraison qui touche au vocabulaire, aux thèmes, aux leçons, aux phrases ou aux niveaux. Pour le reste, vérifier à la main sur mobile 390 px, clair et sombre.

## Structure
- `index.html` : l'app (prod = branche `main`, publiée sur GitHub Pages).
- `manifest.webmanifest`, `sw.js`, `icons/` : installation sur l'écran d'accueil et hors-ligne. **Changer `VERSION` dans `sw.js`** si on renomme ou ajoute un fichier à mettre en cache (liste `SHELL`).
- `design/maquettes/` : maquettes Claude Design (`*.dc.html`) + `canvas.json`. Référence visuelle, non publiée comme app. Elles réclament un `support.js` du moteur Design, donc elles ne s'ouvrent pas seules.
- `cours/cours-chinois-lv2.md` : le cours (source du vocabulaire).
- `docs/` : décisions de design, fonctionnalités, historique. Lire avant de changer une règle.
- `tools/` : `run-audit.sh` + `audit.js` (contrôle du contenu). `docs/PROMPT-ajout-contenu.md` : prompt à utiliser pour ajouter des mots, thèmes ou leçons (procédure complète, formats, règles).

## Conventions
- Code : tout dans `index.html`. Thème par variables CSS `:root` (jade `#256E5E`), clair + sombre.
- Police : Noto Serif SC (caractères), Source Sans 3 (interface). Cible tactile ≥ 44 px.
- Données : `LESSONS` (≈ ligne 616) liste leçons et thèmes ; le vocabulaire vient de la fonction qui remplit `V`.
- Sauvegarde : `localStorage` clé `revisions-chinois-v1`. La synchro `window.claude` ne sert que dans l'artefact claude.ai, elle doit rester sans effet ailleurs.
- Écriture des caractères : bibliothèque Hanzi Writer (MIT) intégrée, avec les données de traits de 242 caractères embarquées (`HANZI_DATA`).

## Règles métier (ne pas casser)
- Niveaux variables par thème : N mots → `ceil(N/5)` niveaux de mots (5 nouveaux mots en QCM puis TOUS les mots précédents) + 1 niveau de phrases (`levelsOf`, `levelNew`, `LV_NEW`). Scores rangés par identifiant stable `w1…`, `p` dans `state.lv[thème]` (`lvVer` = 2). Un niveau est validé à 80 %. Les thèmes se débloquent dans l'ordre. Aucun pourcentage n'est affiché sur le parcours ni dans la feuille d'un thème.
- Tous les niveaux d'une leçon validés → contrôle (16/20 requis) → leçon suivante.
- Révision : tout le vocabulaire accessible sans verrou.
- Écriture : 3 étapes (observer, guidé, mémoire), maîtrisé après 2 tracés de mémoire sans faute, séries de 8. Accessible depuis l'onglet **Collection**.
- Collection : caractère **jade** = le niveau de mots qui introduit un mot le contenant est validé (`wordLearned`) ET aucune erreur en cours sur ces mots ; **à corriger** si une erreur reste ; **or** = jade + écriture maîtrisée. Niveau **or** = 100 %, contrôle or = 20/20.
- Séries (niveau, contrôle, série libre, écriture) : jamais reprises. Quitter par la croix ou fermer l'app annule la série (`state.run` et `state.wrun` sont remis à null au chargement). Ne pas réintroduire de sauvegarde de série en cours.
- Flamme : `state.days` (date locale). Compte une série **réussie** : niveau ≥ 80 %, contrôle réussi, révision/à réviser ≥ 10/20, écriture avec au moins la moitié sans faute.
- Révision espacée : `state.srs[id]={b,d}`, intervalles `SRS_INT`. Seuls les éléments du cours (`BYID`) sont suivis, pas les phrases générées.
- Mots enseignés (règle impérative) : tout mot d'une phrase (niveau de phrases, contrôle, phrase générée, complément) doit être un `W` du même thème ou d'un thème précédent (`taughtDict`, `phraseOk`, `allKnown`, `segmentWords`). Pronoms de base 我你他她们 connus d'office. Si une phrase contient un mot jamais enseigné, l'ajouter en `W(...)` dans le même thème (pas de doublon : un mot = un seul `W`). L'ordre des thèmes dans `LESSONS` compte : le vocabulaire avant les structures. Ne jamais renommer un thème ni un id de leçon (clés de la progression).
- Premier lancement : l'introduction (`INTRO`) passe avant tout ; la fenêtre d'installation (`installPopup`) ne doit jamais s'afficher pendant l'introduction ni dans l'app installée (`startupIntro`, `isStandalone`).
- Tout nouvel état persistant doit être ajouté à `freshState`, `exportCode` et `importCode`.

## Workflow Git
- `main` = prod (Pages déploie à chaque push). `dev` = travail. Une feature = une branche `feature/nom` depuis `dev`, PR vers `dev`, puis `dev` → `main`.
- Ne jamais pousser directement sur `main` pour une feature. Commits petits et clairs.
- Ne jamais mettre de secret dans le repo (repo public).
