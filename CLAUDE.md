# Révisions chinois

App web de révision de mandarin (LV2), en français. **Un seul fichier : `index.html`** (HTML + CSS + JS, sans build, sans dépendance à installer).

## Commandes
- Lancer en local : `python3 -m http.server 8000` puis http://localhost:8000
- Pas de build. **Audit du contenu : `tools/run-audit.sh`** (navigateur sans écran ; code 0 = aucune erreur). À lancer avant toute livraison qui touche au vocabulaire, aux thèmes, aux leçons, aux phrases ou aux séries. Pour le reste, vérifier à la main sur mobile 390 px, clair et sombre.

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
- Parcours en chapitres et séries : un **chapitre** = un thème, ou plusieurs thèmes courts fusionnés (moins de `MIN_CHAPTER`=6 mots : rejoint le précédent, ou le suivant s'il ouvre la leçon). Mots répartis en groupes équilibrés de 8 au plus (`splitGroups`). Par groupe : **Découverte** (cartes de présentation, hors des 20 questions, puis 20 questions), **Renforcement**, **Révision** (mélange du groupe et des précédents) ; puis une série **Phrases** et une série **Défi** (erreurs du chapitre). Toutes les séries font `SER_LEN`=20 questions. Scores par identifiant stable dans `state.ser[chapitre][g1a, g1b, g1m, …, p, h]` (`lvVer`=3). Série validée à 80 % ; or à 100 %. Aucun pourcentage sur le parcours ni dans la feuille d'un chapitre. Le chapitre porte le nom de son premier thème : ne jamais renommer un thème.
- **Sauter des modules** : le **Défi** de chaque chapitre et le **contrôle** de chaque leçon sont toujours ouverts (même chapitre ou leçon verrouillé, `serOpen`, `ctlOpen`). Défi réussi (≥ 80 %) = toutes les séries du chapitre validées (or si 100 %). Contrôle réussi = toutes les séries de la leçon validées (or si 20/20) et leçon suivante ouverte. Une leçon ou un chapitre déjà validé compte comme ouvert (`lessonOpen`, `chapOpen`). `curSeries` suit l'ordre normal (`serSeq`).
- Toutes les séries d'une leçon validées → contrôle (30 questions jusqu'à 45 mots, sinon 40 ; 90 % requis (18/20), `CTL_PASS`, note sur 20 conservée) → leçon suivante.
- Échelle de difficulté d'un mot (`mkQ`) : QCM à 2 choix → QCM à 4 choix (sens inverse) → écrire le français → QCM de ton (2 puis 4 versions de la même syllabe, `toneVariants`) → écrire le pinyin. Rappel rapproché : une question ratée revient 3 ou 4 questions plus loin à la place d'une question prévue (max 4 par série, hors de la note).
- Révision : tout le vocabulaire accessible sans verrou.
- Écriture : 3 étapes (observer, guidé, mémoire), maîtrisé après 2 tracés de mémoire sans faute, séries de 8. Accessible depuis l'onglet **Collection**.
- Collection : caractère **jade** = la série Renforcement du groupe d'un mot le contenant est validée (`wordLearned`) ET aucune erreur en cours sur ces mots ; **à corriger** si une erreur reste ; **or** = jade + écriture maîtrisée. Niveau **or** = 100 %, contrôle or = 20/20.
- Séries (apprentissage, contrôle, série libre, écriture) : jamais reprises. Quitter par la croix ou fermer l'app annule la série (`state.run` et `state.wrun` sont remis à null au chargement). Ne pas réintroduire de sauvegarde de série en cours.
- Flamme : `state.days` (date locale). Compte une série **réussie** : série d'apprentissage ≥ 80 %, contrôle réussi, révision/à réviser ≥ 10/20, écriture avec au moins la moitié sans faute.
- Révision espacée : `state.srs[id]={b,d}`, intervalles `SRS_INT`. Seuls les éléments du cours (`BYID`) sont suivis, pas les phrases générées.
- Mots enseignés (règle impérative) : tout mot d'une phrase (série Phrases, contrôle, phrase générée, complément) doit être un `W` du même thème ou d'un thème précédent (`taughtDict`, `phraseOk`, `allKnown`, `segmentWords`). Pronoms de base 我你他她们 connus d'office. Si une phrase contient un mot jamais enseigné, l'ajouter en `W(...)` dans le même thème (pas de doublon : un mot = un seul `W`). L'ordre des thèmes dans `LESSONS` compte : le vocabulaire avant les structures. Ne jamais renommer un thème ni un id de leçon (clés de la progression).
- Fenêtre d'installation (`installPopup`) : s'ouvre à chaque démarrage dans le navigateur d'un téléphone, avant tout (même avant l'introduction du premier lancement), jamais dans l'app installée (`isStandalone`). Pas de limite de fréquence voulue.
- Tout nouvel état persistant doit être ajouté à `freshState`, `exportCode` et `importCode`.

## Workflow Git
- `main` = prod (Pages déploie à chaque push). `dev` = travail. Une feature = une branche `feature/nom` depuis `dev`, PR vers `dev`, puis `dev` → `main`.
- Ne jamais pousser directement sur `main` pour une feature. Commits petits et clairs.
- Ne jamais mettre de secret dans le repo (repo public).
