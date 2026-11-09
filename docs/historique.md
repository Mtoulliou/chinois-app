# Historique du projet

Mise au propre le 2026-11-09. Les résumés ci-dessous viennent des conversations « App chinois » et « Design chinois ». Le contenu du cours vient uniquement du document « Cours de chinois LV2 » (`cours/`), sans historique de conversation.

## Origine des fichiers
| Source d'origine | Devenu |
|---|---|
| Artefact « Révisions chinois » (app à jour) | `index.html` |
| Artefact « Révisions chinois, refonte » (canvas Claude Design) | `design/maquettes/` |
| Document « Cours de chinois LV2 (mandarin) » | `cours/cours-chinois-lv2.md` |

## 1. App chinois (conversation de développement)

**Demande de départ:** une app mobile pour réviser le vocabulaire, avec trois exercices tirés au hasard (français, caractères, pinyin).
**Cahier des charges:** séries de 20, phrases du cours, erreurs sauvegardées, note et récapitulatif final. Claude a posé 4 questions avant de coder: saisie des caractères, règle sur les tons, tolérance en français, ajout du vocabulaire.

### Règles de correction (toujours valables)
- Barre `ā á ǎ à ü` qui place le ton sur la bonne voyelle.
- Ton faux sur une syllabe juste = demi-point.
- En français: accents, majuscules et articles ignorés, faute de frappe tolérée, bouton « J'avais juste » pour valider soi-même.
- Chaque série reprend jusqu'à 8 erreurs. Un élément sort de la liste après 3 bonnes réponses d'affilée.
- Heures générées au hasard: formes équivalentes acceptées (半 = 三十分, 一刻 = 十五分).
- Dernière chance: 3 erreurs de la série reviennent à la fin.
- Autant de chances d'apparaître en français qu'en pinyin (10 questions de chaque sens par série, depuis le 30/10/2026).

### Chronologie
1. V1: 98 mots et 22 phrases tirés du cours, au format artefact.
2. Tri par thème, sélection des thèmes avant une série, icône d'accueil, thèmes repliables, accueil simplifié.
3. Thèmes regroupés par leçon (1 à 4), leçons 3 et 4 ajoutées. Phrases générées à partir du vocabulaire, grammaticalement correctes. Série de 10 mots + 10 phrases.
4. Préparation GitHub Pages: sources communes (`style.css`, `vocab.js`, `app.js`) et `build.py` produisant l'artefact et un dossier `site/` (manifest, service worker hors ligne, icône 习 sur fond vert, README). *Remplacé le 09/11/2026 par `manifest.webmanifest`, `sw.js` et `icons/` écrits directement pour le `index.html` unique, sans `build.py`.*
5. Code de transfert (« Copier mon code » / « Coller un code ») pour passer sa progression d'une version à l'autre. Filtre par type d'exercice.
6. Leçons 5 (Ma journée) et 6 (L'heure). L'ancienne leçon 3 devient la leçon 2 « Qui suis-je ». 239 → 364 éléments.
7. Les caractères sortent des exercices (affichés au-dessus du pinyin, pour information). Descriptions au-dessus de « Traduire » supprimées.
8. 08/11/2026: leçon 8 « Mon samedi » (100 éléments, 7 thèmes), 469 éléments. **La leçon 7 manque encore dans le cours.** Variantes générées: dates, météo, 想, 在 et 去, rendez-vous, prix. Pièges gérés: 两块, bú rè, mois avant le jour.
9. Révision par thème (onglets « Séries » et « Par thème »): mini-cours de 2 à 4 règles pour chacun des 32 thèmes, tableau de vocabulaire, phrases modèles, quiz (tous les mots + 5 phrases), dernière chance, note sur 20.
10. Reconstruction à partir des maquettes, 4 onglets (Leçons, Révision, Écriture, Paramètres). Onglet Écriture avec Hanzi Writer, 3 étapes (Observer, Guidé, Mémoire), 242 caractères disponibles hors ligne. Testé au doigt sur téléphone le 09/11/2026: OK, bandeau « En travaux » retiré.

## 2. Design chinois (08/11/2026)

**Objectif:** préparer la refonte avant GitHub Pages, via des maquettes Claude Design.
**Demande:** barre de navigation en bas, niveaux type Duolingo, progression gratifiante, page Révision.

### Choix
- Niveaux de difficulté croissante, **pas de gamification** (exclus: XP, streak, mascotte, confettis, badges, classement), identité visuelle conservée: jade `#256E5E`, fond `#F2F5F3`, Noto Serif SC + Source Sans 3, sceau 复习, format iPhone 390 × 844.
- Structure: leçon → thèmes → 4 niveaux par thème → contrôle de fin de leçon.
- 4 niveaux: Découverte (QCM), Reconnaissance (pinyin → français), Production (pinyin avec tons), Phrases.
- Seuils: 80 % pour valider un niveau, 16/20 pour le contrôle.
- Parcours en îlots en serpentin, bandeau fixe (leçon en cours + progression). États d'un îlot: validé, en cours, disponible, verrouillé. Le contrôle est un grand îlot à drapeau.
- Niveau 1 de chaque thème ouvert dès le départ; carte « Leçon 5 » verrouillée; caractères en second plan sous le pinyin; pastille rouge sur Révision = nombre d'erreurs.
- Paramètres: afficher les caractères, ajouter des exercices sur les caractères, thème Clair / Sombre / Système.
- **Règle:** il faut finir un thème pour débloquer le suivant, mais tout reste accessible dans Révision.
- Onglet Écriture, par leçon: accueil avec « Reprendre », page leçon (série de 8, filtre), fin de série. 3 étapes: Observer (animation), Guidé (modèle grisé), Mémoire (grille vide, indice après 2 traits ratés). Mots redoublés (妈妈, 哥哥) = un seul caractère; phrases exclues.
- Le sélecteur de leçon d'Écriture est repris dans Révision. Bandeau jaune « En travaux » en haut d'Écriture. Ordre de la barre: Leçons, Révision, Écriture, Paramètres.
- Idées pour plus tard: audio lu par le téléphone, onglet Lexique.

### Résultat
Canvas de 19 écrans + planche de composants, puis 7 écrans Écriture et 5 écrans en thème sombre: 29 maquettes dans `design/maquettes/`.

### Point de passage vers la prod
La conversation s'est arrêtée à « Pousse en prod »: Claude ne pouvait pas créer le dépôt. Elle annonçait que la progression Claude ne passerait pas sur le site; or **le code de transfert de l'app (Paramètres) le permet.**

## Organisation de travail
- Réfléchir et décider: chat Claude. Coder: Claude Code, sur une branche.
- `main` = prod (GitHub Pages), `dev` = intégration, `feature/*` = une feature.
- Les artefacts ne servent qu'à prototyper; ce qui est validé est porté dans le dépôt.
