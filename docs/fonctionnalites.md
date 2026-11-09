# Fonctionnalités

## Présentes (dans `index.html`)
- **7 leçons** : Se présenter, Qui suis-je, Goûts et loisirs, Ma famille, Ma journée, L'heure, Mon samedi (leçons 1 à 6 et 8 du cours ; la leçon 7 manque dans le cours).
- **Parcours** : thèmes en îlots, nombre de niveaux variable selon le thème : 5 nouveaux mots par niveau (QCM) plus tous les mots des niveaux précédents (pinyin→français, français→pinyin), puis un niveau final de phrases. Validation à 80 %. Aucun pourcentage affiché sur le parcours ni dans la feuille du thème.
- **Contrôle de leçon** : 20 questions mélangées, 16/20 pour valider.
- **Révision** : série libre, « Mes erreurs » (badge du nombre d'erreurs), choix d'une leçon ou de toutes.
- **Collection** (remplace l'onglet Écriture) : tableau des 228 caractères du cours. Sombre = pas appris, jade = appris, or = appris et tracé de mémoire maîtrisé, pointillés = à corriger. Séries d'écriture de 8 (jade pas encore or en priorité), écriture par leçon, détail par caractère. Tracé avec Hanzi Writer, données de traits intégrées (hors ligne).
- **Médailles or** : un niveau à 100 % passe en or (étoile), un thème dont tous les niveaux sont en or est « parfait », un contrôle à 20/20 est en or.
- **Flamme** (en haut à droite) : une série réussie par jour. Jade pleine = fait aujourd'hui, pointillés = en attente, grise = éteinte. Au clic : record, semaine, calendrier mensuel.
- **Révision espacée** : chaque réponse planifie le rappel (1, 2, 4, 8, 16, 32 jours). Carte « À réviser aujourd'hui » dans Révision, bandeau sur Leçons, pastille sur l'onglet et sur l'icône de l'app installée.
- **Retour immédiat** : animation, vibration (Android) et son, réglables dans Paramètres (vibration oui, son non par défaut).
- **Compétences** : « Tu sais maintenant… » à la fin d'un thème ou d'une leçon ; encouragements de fin (« plus que 2 réponses », « un sans-faute passe en or »).
- **Paramètres** : afficher les caractères, thème clair/sombre/système, code de transfert de progression, remise à zéro.
- **Aide et retours** (Paramètres) : « Signaler un bug » et « Demander une fonctionnalité » ouvrent un formulaire d'issue GitHub prérempli (version, mode installé ou navigateur, taille d'écran, navigateur). Formulaires dans `.github/ISSUE_TEMPLATE/`. Pas de jeton ni d'envoi automatique : l'utilisateur relit puis valide, avec un compte GitHub.
- **Sauvegarde** : `localStorage` ; synchro Claude seulement dans l'artefact.
- **Installable et hors ligne** : `manifest.webmanifest`, `sw.js` (réseau d'abord, cache en secours, polices mises en cache) et `icons/` (习 blanc sur jade). Ajoutable à l'écran d'accueil sur Android et iOS.

## Mots enseignés avant les phrases
Les niveaux de mots d'un thème présentent tous ses mots (par groupes de 5) ; le niveau de phrases ne contient que des mots déjà enseignés. Mots ajoutés le 09/11/2026 pour respecter cette règle : 好, 吗, 呢, 多大, 几岁, 记得, 还 (leçon 1), 不 (pays), 英语, 德语 (langues), 怎么写, 王, 小明, 饭. Leçon 3 : Loisirs, Nourriture et boissons, puis Aimer et demander.

## Ajouter du contenu
Procédure complète, formats et règles : [`PROMPT-ajout-contenu.md`](PROMPT-ajout-contenu.md). Contrôle automatique : `tools/run-audit.sh`.

## Phrases générées
Chaque thème avec générateur (`TEMPLATES` dans `index.html`) crée des phrases qui réutilisent le vocabulaire des leçons précédentes : nationalités, langues, famille, activités, heures. Générateurs ajoutés le 09/11/2026 : Pronoms (avec 你们), Nombres (personnes, mois, numéros de téléphone), Qui est-ce ?, Membres de la famille, La journée de Xiaoming, Dire l'heure. Seul « Caractères et vocabulaire » n'en a pas (3 mots seulement).
Pour ajouter un générateur : une entrée `{th, subj, make(s,p)}` dans `TEMPLATES` ; tester qu'une réponse canonique est jugée juste (`gradePy`, `gradeFr`).

## Idées / à faire
- [ ] Retours sans compte GitHub : nécessiterait un petit service intermédiaire (ex. Cloudflare Worker) qui garde un jeton ; à éviter tant que l'app reste perso (spam, maintenance).
- [ ] Séparer les données (vocabulaire) du code dans `data/` quand le fichier deviendra trop gros (≈ 785 Ko aujourd'hui, dont Hanzi Writer).
- [ ] Compléter le cours (leçon 7 manquante) puis ajouter la leçon dans `LESSONS`.
