# Historique et organisation

## D'où vient le projet
| Source d'origine | Devenu |
|---|---|
| Artefact « Révisions chinois » (version à jour de l'app) | `index.html` |
| Artefact « Révisions chinois, refonte » (canvas Claude Design) | `design/maquettes/` |
| Document « Cours de chinois LV2 (mandarin) » | `cours/cours-chinois-lv2.md` |
| Conversations (app, design, cours) | Non exportables automatiquement : voir note |

Mise au propre le 2026-11-09.

## Note sur les conversations
Les trois conversations Claude (app, design, cours) ne sont pas lisibles depuis Claude Code. Ces documents sont reconstruits à partir des artefacts et du code. Pour compléter, demander dans chaque conversation un résumé de sortie (décisions, bugs connus, prochaines étapes) et le coller ici.

## Organisation de travail
- Réfléchir et décider : chat Claude. Coder : Claude Code, sur une branche.
- `main` = prod (GitHub Pages), `dev` = intégration, `feature/*` = une feature.
- Les artefacts ne servent qu'à prototyper ; ce qui est validé est porté dans le dépôt.
