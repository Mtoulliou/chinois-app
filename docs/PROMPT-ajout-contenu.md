# Prompt : ajouter du vocabulaire, des thèmes ou des leçons

À coller dans Claude Code (lancé à la racine du dépôt). Remplis seulement la section **DEMANDE**, laisse le reste tel quel.
Le prompt force l'audit `tools/run-audit.sh` : rien ne doit être livré tant qu'il affiche une ERREUR.

---

````text
# DEMANDE (à remplir)

Type d'ajout : [mots dans un thème existant | nouveau thème dans une leçon existante | nouvelle leçon]
Où : [leçon et thème visés, ou "nouvelle leçon n°X « Titre »"]
Source du contenu : [texte du cours collé ci-dessous, ou chemin d'un fichier]
Contenu :
<<<
(colle ici le vocabulaire, les phrases, les points de grammaire du cours)
>>>

# RÔLE ET CONTEXTE

Tu travailles dans le dépôt de l'app « Révisions chinois » (mandarin LV2, interface française, un seul fichier `index.html`,
publiée sur GitHub Pages). Lis d'abord `CLAUDE.md`, `docs/fonctionnalites.md` et `docs/design.md`. Tu n'inventes ni sens, ni pinyin,
ni phrase de cours : tout vient de la SOURCE ci-dessus. Si une information manque ou est ambiguë (ton d'un caractère, sens, thème d'accueil),
pose la question avant de coder. Tu ne modifies pas ce qui n'est pas demandé.

# RÈGLES IMPÉRATIVES (une violation = ERREUR de l'audit)

1. **Un mot = une seule entrée `W(...)` dans toute l'app.** L'identifiant d'un élément est son premier `zh`. Jamais de doublon.
   Si le mot existe déjà plus loin dans le parcours, DÉPLACE sa ligne `W` vers le thème qui l'utilise en premier (ne la copie pas).
2. **Tout mot d'une phrase doit avoir été enseigné avant.** Chaque mot de chaque phrase (cours `P(...)`, phrases générées, compléments)
   doit être un `W` du même thème ou d'un thème PRÉCÉDENT dans l'ordre du parcours (les mots de ce thème sont tous enseignés avant son niveau de phrases).
   Seuls 我 你 他 她 们 sont connus d'office. Si une phrase contient un mot jamais enseigné (particule 呢, 吗, 不, nom propre, complément, etc.),
   AJOUTE-LE en `W` dans le thème de la phrase (ou plus tôt). Un « mot » est un mot du cours : 多大 est un mot, pas deux caractères isolés.
3. **Le vocabulaire avant les structures.** Dans une leçon, place les thèmes de vocabulaire (loisirs, nourriture…) AVANT les thèmes de structure qui les réutilisent.
4. **Jamais de renommage ni de suppression** d'un nom de thème ou d'un `id` de leçon : ce sont les clés de la progression enregistrée.
5. **Ajoute à la fin** : nouveaux mots à la fin de la liste `W` du thème, nouveaux thèmes à la fin de la liste `themes` de la leçon, nouvelles leçons à la fin de `LESSONS`.
   (Insérer au milieu décale les groupes de 5 mots et l'ordre de déblocage ; à n'utiliser que si le cours l'exige, et à signaler.)
6. **Complet ou rien** : un thème ajouté a des mots OU des phrases ET une entrée dans `RULES`, `CANDO` ; une leçon ajoutée a une entrée dans `CANDO_L`.
7. **Pas de contenu non enseigné dans les générateurs** : les listes (`ACTS`, `FOODS`, `DRINKS`, `FAM`, `COUNTRIES`, `LANGS`…) ne contiennent que des mots qui existent en `W`.

# COMMENT L'APP UTILISE LE CONTENU (à connaître avant de modifier)

- Niveaux d'un thème : un thème de N mots a `ceil(N/5)` niveaux de mots puis 1 niveau de phrases. Niveau de mots k = ses ~5 nouveaux mots en QCM,
  puis TOUS les mots des niveaux précédents (pinyin→français et français→pinyin). Un reste de moins de 3 mots est fondu dans le dernier niveau de mots.
  Un thème sans mot propre n'a que le niveau de phrases. Scores rangés par identifiant stable `w1, w2, …, p` (`state.lv[theme]`).
- Niveau de phrases : 10 phrases (cours + générées + compléments de thèmes précédents), filtrées pour que tous leurs mots soient enseignés.
- Contrôle de leçon : 20 questions sur tous les thèmes de la leçon (16/20 pour valider) ; la leçon suivante s'ouvre à la réussite du contrôle.
- Collection : un caractère devient jade quand le niveau qui introduit un mot le contenant est validé (et sans erreur en cours), or une fois tracé de mémoire.
  Seuls les caractères ayant des données de tracé (`window.HANZI_DATA`) apparaissent.
- Révision espacée et séries libres piochent dans tous les éléments `V`.

# FORMAT DES DONNÉES (dans `index.html`, zone des `T(...)`, `W(...)`, `P(...)`)

```js
T("Nom du thème");                         // doit exister dans LESSONS sinon l'app plante au chargement
W("星期天|星期日","xīngqī tiān|xīngqī rì","dimanche","Les deux formes existent : 星期天 et 星期日.");
P("你叫什么？","nǐ jiào shénme","comment t'appelles-tu ?|tu t'appelles comment","叫 + prénom : je m'appelle.");
```
- `zh` : caractères simplifiés ; plusieurs écritures séparées par `|` (la première est affichée). Phrases : ponctuation chinoise pleine chasse `。？！，`.
- `py` : pinyin avec tons (ā á ǎ à, ü), syllabes d'un mot collées (`wǒmen`, `diànhuà hàomǎ` pour les composés lisibles comme dans le reste du fichier),
  apostrophe de séparation (`shí'èr`), ton léger sans accent, majuscule pour les noms propres. Plusieurs lectures séparées par `|` ;
  si `zh` a plusieurs écritures, autant de `py`, dans le même ordre. Pas de ponctuation (sauf virgule interne comme dans les phrases existantes).
- `fr` : traductions acceptées séparées par `|`, la première est affichée ; mets les formulations naturelles (`trois|3`). Les accents, majuscules,
  articles et une faute de frappe sont déjà tolérés par la correction.
- `note` (facultatif) : une phrase courte du cours, affichée quand la réponse est fausse.
- Heures : `HEURE("三点半","sān diǎn bàn",3,30,"")` (voir les exemples du thème « Dire l'heure »).
- Respecte l'ordre : les `W` d'un thème avant ses `P`. Les mots enseignés par la phrase (ex. 多大 pour 你多大？) sont des `W` du même thème.

Autres tables à compléter dans le même fichier :
```js
const LESSONS=[ … {id:"l9",n:"Leçon 9",t:"Titre court",themes:["Thème A","Thème B"]} ];   // id nouveau et unique ; thèmes uniques dans toute l'app
const RULES={ "Thème A":["Règle 1…","Règle 2…"] };        // 2 à 4 règles du mini-cours, tirées de la source
const CANDO={ "Thème A":"dire ce que tu aimes" };         // complète « Tu sais maintenant … »
const CANDO_L={ l9:"parler de … et de …" };               // idem pour la leçon
```
Générateurs de phrases (facultatif, pour varier les niveaux de phrases) : entrées dans `TEMPLATES`
`{th:"Thème",subj:[0,1,2,3],make(s,p){…return {zh,py,fr:[…],note}}}` (voir les exemples existants et les aides `combos`, `join`, `CJ`, `SUBJ`).
Contraintes : n'utiliser que des mots enseignés au plus tard dans ce thème ; accords de genre et de nombre corrects en français ;
toutes les variantes françaises raisonnables dans `fr` ; `kind:"w"` pour un générateur de mots (ex. heures). L'app écarte d'elle-même une phrase
générée contenant un mot non enseigné, mais un générateur dont toutes les phrases sont écartées est signalé « appauvri » par l'audit : corrige les mots.

Nouveaux caractères : si l'audit signale « sans données de tracé », ajoute leur entrée (`strokes`, `medians`, `radStrokes`) à `window.HANZI_DATA`
(ligne `window.HANZI_DATA={…}`) depuis `hanzi-writer-data@2.0.1` (`https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0.1/<caractère>.json`),
sinon ils n'apparaîtront pas dans la Collection. Respecte la licence indiquée dans le fichier.

# PROCÉDURE (dans cet ordre, sans en sauter)

1. `git checkout dev && git pull`, puis `git checkout -b feature/<contenu>` (jamais de travail direct sur `main`).
2. Lance `tools/run-audit.sh` AVANT de toucher quoi que ce soit : note le résultat de départ (0 erreur attendu).
3. Analyse la SOURCE et produis un PLAN écrit, que tu me soumets avant de coder :
   - où chaque mot et chaque phrase sera placé (leçon, thème) et pourquoi ;
   - les mots qui existent déjà (à déplacer ou à réutiliser, pas à dupliquer) ;
   - pour chaque phrase, la liste de ses mots et le thème où chacun est enseigné ; les mots à AJOUTER pour que la règle 2 soit respectée ;
   - l'impact sur les niveaux (nombre de niveaux avant / après pour chaque thème touché) et sur la progression existante ;
   - les doutes à trancher.
   Attends mon accord.
4. Modifie `index.html` : `T/W/P`, `LESSONS` si besoin, `RULES`, `CANDO`, `CANDO_L`, générateurs et listes éventuels, `HANZI_DATA` si besoin.
5. Mets à jour `cours/cours-chinois-lv2.md` (source de vérité du cours) avec le nouveau contenu, dans le même style que les chapitres existants.
6. Lance `tools/run-audit.sh`. Corrige jusqu'à `RESULTAT: 0 erreur(s)`. Lis chaque AVERT : corrige-le ou explique pourquoi il est acceptable.
7. Joue le parcours dans un navigateur sans écran (ou via Chrome si disponible) : ouvre l'écran Leçons, la feuille du nouveau thème, joue le premier niveau de mots
   et le niveau de phrases du nouveau thème, ouvre le mini-cours (icône de livre), ouvre la Collection. Aucune erreur de console, aucun libellé vide.
8. Mets à jour la documentation : `docs/fonctionnalites.md` (contenu ajouté, nombre de leçons/thèmes/mots), `docs/historique.md` (une entrée datée),
   `README.md` si les chiffres y figurent, `CLAUDE.md` seulement si une règle change.
9. Si un fichier est ajouté à la liste `SHELL` de `sw.js`, incrémente `VERSION` dans `sw.js` (sinon ne touche pas à `sw.js`).
10. Commits petits et clairs. Push de la branche, PR vers `dev`, merge, puis PR `dev` → `main`, merge. Vérifie que la version en ligne
    (`https://mtoulliou.github.io/chinois-app/`) contient bien le nouveau contenu (par exemple en cherchant un de ses mots dans la page).

# CHECKLIST FINALE (tout doit être vrai)

- [ ] `tools/run-audit.sh` : 0 erreur ; chaque avertissement traité ou justifié.
- [ ] Aucun doublon de mot ; aucun mot de phrase non enseigné avant ; thèmes de vocabulaire avant thèmes de structure.
- [ ] Aucun nom de thème ni `id` de leçon existant modifié ou supprimé.
- [ ] `RULES`, `CANDO` (par thème) et `CANDO_L` (par leçon) renseignés.
- [ ] `cours/cours-chinois-lv2.md` et la documentation à jour.
- [ ] Parcours joué de bout en bout dans un navigateur : écrans Leçons, feuille du thème, niveaux de mots et de phrases, mini-cours, Collection.
- [ ] Livré par branche et PR (feature → dev → main), version en ligne vérifiée.

# CE QUE TU ME RENDS À LA FIN

Un compte rendu court : ce qui a été ajouté (nombres de mots, phrases, thèmes, leçons), les mots ajoutés ou déplacés pour respecter la règle 2,
le nombre de niveaux de chaque thème touché, le résultat final de `tools/run-audit.sh` (colle la dernière ligne et la liste des AVERT restants),
et tout point à valider de mon côté (prononciations ou traductions incertaines, choix d'emplacement).
````

---

## Compléments

### Demandes courtes types

- « Ajoute ces 6 mots au thème « Loisirs » : … » → type *mots dans un thème existant*, source = la liste.
- « Ajoute un thème « Les transports » à la leçon 8, après « Faire des achats » : … » → type *nouveau thème*.
- « Ajoute la leçon 9 « Les vacances » avec trois thèmes : … » → type *nouvelle leçon*.

### Ce que l'audit contrôle

`tools/run-audit.sh` ouvre l'app dans un navigateur sans écran, exécute `tools/audit.js` sur le vrai code et vérifie :

| Contrôle | Gravité |
|---|---|
| Syntaxe de `index.html` et `sw.js`, fichiers du service worker présents | erreur |
| Identifiants uniques ; champs `zh`, `py`, `fr` renseignés et cohérents | erreur |
| Chaque thème : contenu, `RULES`, `CANDO` ; chaque leçon : `CANDO_L` ; pas de thème en double | erreur |
| Générateurs : gabarits valides, réponse canonique jugée juste, listes couvertes par le vocabulaire | erreur / avertissement |
| Niveaux : mots répartis sans trou ni doublon, nouveaux mots en tête, cumul complet des anciens mots | erreur |
| **Aucun mot de phrase non enseigné avant** (cours, générées, compléments, contrôles) | erreur |
| Séries et contrôles se construisent ; export/import de la progression conserve tout | erreur |
| Niveaux de phrases courts, thèmes de moins de 3 mots, caractères sans données de tracé | avertissement |

### Pièges connus

- Un mot présent dans une phrase d'un thème antérieur mais enseigné plus tard : l'audit l'erreur si la phrase est exclue, l'avertit sinon.
- Modifier le contenu d'un thème déjà joué n'efface pas la progression (scores par identifiant `w1…p`), mais déplacer des mots entre thèmes peut
  faire passer un caractère de « jade » à « sombre » tant que le niveau qui l'introduit n'est pas revalidé.
- Ne pas oublier qu'un thème ajouté à une leçon déjà validée rend le contrôle de cette leçon de nouveau « ouvrable » : la leçon suivante reste ouverte (le contrôle déjà réussi compte).
