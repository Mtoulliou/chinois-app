# Révisions chinois

Application de révision de mandarin (LV2) : parcours de leçons en îlots, exercices à 3 niveaux, contrôle de leçon, révision des erreurs, apprentissage de l'écriture des caractères (ordre des traits), thème clair et sombre. Interface en français, pensée pour le mobile.

**App en ligne : https://mtoulliou.github.io/chinois-app/**

La progression est enregistrée dans le navigateur (`localStorage`). Le code de transfert, dans l'onglet Paramètres, permet de déplacer sa progression d'un appareil à l'autre.

## Contenu du dépôt
| Chemin | Rôle |
|---|---|
| `index.html` | L'application complète (un seul fichier) |
| `design/maquettes/` | Maquettes Claude Design de la refonte |
| `cours/` | Le cours de chinois LV2 en Markdown |
| `docs/` | Décisions de design, fonctionnalités, historique |
| `CLAUDE.md` | Consignes pour travailler avec Claude Code |

## Développer
```
python3 -m http.server 8000
```
Puis ouvrir http://localhost:8000. Branche `dev` pour travailler, `main` pour la prod.

## Crédits
Tracé et ordre des traits : [Hanzi Writer](https://chanind.github.io/hanzi-writer) (MIT) et ses données de traits.
