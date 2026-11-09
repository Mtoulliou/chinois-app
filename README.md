# Révisions chinois

Application de révision de mandarin (LV2) : parcours de leçons en îlots (médailles or à 100 %), exercices à 3 niveaux, contrôle de leçon, révision espacée et des erreurs, collection de caractères (sombre, jade, or) avec apprentissage de l'écriture, flamme de série quotidienne (ordre des traits), thème clair et sombre. Interface en français, pensée pour le mobile.

**App en ligne : https://mtoulliou.github.io/chinois-app/**

La progression est enregistrée dans le navigateur (`localStorage`). Le code de transfert, dans l'onglet Paramètres, permet de déplacer sa progression d'un appareil à l'autre.

## Contenu du dépôt
| Chemin | Rôle |
|---|---|
| `index.html` | L'application complète (un seul fichier) |
| `manifest.webmanifest`, `sw.js`, `icons/` | Installation sur l'écran d'accueil et mode hors ligne |
| `design/maquettes/` | Maquettes Claude Design de la refonte |
| `cours/` | Le cours de chinois LV2 en Markdown |
| `docs/` | Décisions de design, fonctionnalités, historique |
| `CLAUDE.md` | Consignes pour travailler avec Claude Code |

## Installer sur le téléphone
- **Android (Chrome)** : menu ⋮ → « Installer l'application » (ou « Ajouter à l'écran d'accueil »).
- **iPhone (Safari)** : bouton Partager → « Sur l'écran d'accueil ».

Une fois ouverte une première fois en ligne, l'app fonctionne hors ligne.

## Signaler un bug ou proposer une idée
Dans l'app : Paramètres → « Aide et retours ». Un formulaire d'issue GitHub s'ouvre déjà rempli (il faut un compte GitHub). On peut aussi [ouvrir une issue](https://github.com/Mtoulliou/chinois-app/issues/new/choose) directement.

## Développer
```
python3 -m http.server 8000
```
Puis ouvrir http://localhost:8000. Branche `dev` pour travailler, `main` pour la prod.

## Crédits
Tracé et ordre des traits : [Hanzi Writer](https://chanind.github.io/hanzi-writer) (MIT) et ses données de traits.
