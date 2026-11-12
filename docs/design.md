# Décisions de design

Source : canvas Claude Design « Révisions chinois, refonte » (`design/maquettes/`, 29 maquettes). Synthèse reconstruite à partir du canvas et du code, pas à partir de la conversation de design.

## Principes
- Mobile d'abord : largeur de référence 390 px, colonne centrée jusqu'à 520 px.
- Style « parcours d'îlots » : ronds jade avec ombre portée basse, un îlot courant entouré d'un halo.
- Cibles tactiles ≥ 44 px, texte contrasté (AA), état jamais porté par la seule couleur (icônes, libellés).
- Thème clair, sombre, ou suivi du système (Paramètres).

## Palette (clair)
| Rôle | Valeur |
|---|---|
| Fond | `#F2F5F3` |
| Surface | `#FFFFFF` |
| Texte | `#18221F` |
| Texte secondaire | `#5E6C67` |
| Jade (action) | `#256E5E`, ombre `#1A4F43`, fond doux `#DCEDE7` |
| Bon | `#22744A` / fond `#E0F1E7` |
| Erreur | `#A93434` / fond `#F6E1E1` |
| À revoir | `#9A6A12` / fond `#F6EBD3` |
| Verrouillé | `#E7ECEA` |
| Or (niveau parfait, collection) | `#C99A1D`, ombre `#8A6410`, fond doux `#F8EBC4`, texte `#2A1D00` / `#7A5806` |
| Case sombre (collection) | `#3A4642` |

Le thème sombre redéfinit les mêmes variables (`--bg #111816`, `--jade #62C2A6`, etc.) dans `index.html`.

## Typographie
- Caractères chinois : **Noto Serif SC** (500/700).
- Interface : **Source Sans 3** (400/600/700).
- Pinyin avec tons, chiffres tabulaires pour les scores.

## Écrans (par groupe du canvas)
1. **Leçons** : parcours d'îlots, bandeau de leçon collant, détail d'un thème en feuille basse, premier lancement.
2. **Exercices** : niveau 1 QCM, niveau 2 saisie français, niveau 3 saisie pinyin (avec boutons de tons), panneau de correction juste/erreur.
3. **Fins de niveau et contrôle** : niveau validé / à refaire, contrôle (intro, réussi, échoué).
4. **Révision et Paramètres** : bandeau de choix de leçon, série libre, « Mes erreurs », paramètres (caractères, thème, données).
5. **Écriture** : accueil, mots d'une leçon, 3 étapes (observer, guidé, mémoire), fin de série.
6. **Thème sombre** : 5 écrans clés.
7. **Composants** : bibliothèque des éléments.

## Règles d'interaction notées sur le canvas
- Un îlot est validé à 80 % et ouvre le suivant.
- Le 4e îlot d'un thème ouvre le 1er du thème suivant.
- Les 16 îlots validés ouvrent le contrôle (18/20 requis), qui ouvre la leçon suivante.
- Révision : tout le vocabulaire reste accessible sans verrou.
- Écriture : organisée par leçon, toutes ouvertes ; ordre et sens des traits vérifiés, indice au 2e trait raté ; maîtrisé après 2 tracés de mémoire sans faute ; série de 8, priorité aux non maîtrisés ; suivi indépendant des niveaux et des erreurs.

## Limite connue
Les `.dc.html` appellent `./support.js` (moteur Claude Design) : ouvertes seules, elles ne s'affichent pas. Les rouvrir dans Claude Design en important `canvas.json`.

## Ajouts du 09/11/2026 (hors maquettes)
- Onglet **Collection** (remplace Écriture) : grille de cases par leçon, états sombre / à corriger (pointillés jade) / jade / or.
- **Flamme** en haut à droite : pastille avec le nombre de jours ; feuille de calendrier mensuel avec jours consécutifs reliés.
- Médailles or : étoile sur fond or pour un niveau à 100 %.
- Ces écrans ne sont pas dans `design/maquettes/`.
