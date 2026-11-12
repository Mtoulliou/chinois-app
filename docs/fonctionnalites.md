# Fonctionnalités

## Présentes (dans `index.html`)
- **7 leçons** : Se présenter, Qui suis-je, Goûts et loisirs, Ma famille, Ma journée, L'heure, Mon samedi (leçons 1 à 6 et 8 du cours ; la leçon 7 manque dans le cours).
- **Introduction** : 5 écrans (caractères, pinyin, tons, ce que l'on apprend) affichés une seule fois au premier lancement d'un nouvel utilisateur (aucune progression), « Passer » disponible, voix du téléphone sur les petits haut-parleurs. Revoir depuis Paramètres → « Revoir l'introduction ». Maquettes : canvas Claude Design « Intro au chinois ». Contenu dans `INTRO` (`index.html`).
- **Fenêtre « Ajouter à l'écran d'accueil »** : affichée immédiatement à CHAQUE ouverture dans le navigateur d'un téléphone (iPhone, iPad, Android), y compris au premier lancement AVANT l'introduction, tant que l'app n'est pas installée. Étapes adaptées au navigateur (Safari, Chrome, Samsung Internet, Firefox, Edge ; bouton « Installer » direct quand Chrome Android le permet). « Plus tard » la ferme pour la session. Jamais dans l'app installée ni sur ordinateur. Relançable depuis Paramètres.
- **Parcours** : chapitres (un thème, ou des thèmes courts fusionnés), mots répartis en groupes de 8 au plus. Par groupe : Découverte (cartes de présentation puis 20 questions), Renforcement, Révision (mélange). Puis une série Phrases et une série Défi (tes erreurs du chapitre). Toutes les séries font 20 questions, validées à 80 %. Environ 190 séries pour tout le cours.
- **Types de questions** : QCM à 2 puis 4 choix (chinois vers français et inversement), écrire le français, QCM de ton (2 puis 4 versions de la même syllabe, avec la voix du téléphone), écrire le pinyin. Un mot raté revient 3 ou 4 questions plus loin (rappel, hors note).
- **Contrôle de leçon** : 20 questions mélangées, 18/20 pour valider.
- **Révision** : série libre, « Mes erreurs » (badge du nombre d'erreurs), choix d'une leçon ou de toutes.
- **Collection** (remplace l'onglet Écriture) : tableau des 228 caractères du cours. Sombre = pas appris, jade = appris, or = appris et tracé de mémoire maîtrisé, pointillés = à corriger. Séries d'écriture de 8 (jade pas encore or en priorité), écriture par leçon, détail par caractère. Tracé avec Hanzi Writer, données de traits intégrées (hors ligne).
- **Médailles or** : une série à 100 % passe en or (étoile), un chapitre dont toutes les séries sont en or est « parfait », un contrôle parfait est en or.
- **Flamme** (en haut à droite) : une série réussie par jour. Jade pleine = fait aujourd'hui, pointillés = en attente, grise = éteinte. Au clic : record, semaine, calendrier mensuel.
- **Révision espacée** : chaque réponse planifie le rappel (1, 2, 4, 8, 16, 32 jours). Carte « À réviser aujourd'hui » dans Révision, bandeau sur Leçons, pastille sur l'onglet et sur l'icône de l'app installée.
- **Retour immédiat** : animation, vibration (Android) et son, réglables dans Paramètres (vibration oui, son non par défaut).
- **Compétences** : « Tu sais maintenant… » à la fin d'un thème ou d'une leçon ; encouragements de fin (« plus que 2 réponses », « un sans-faute passe en or »).
- **Paramètres** : afficher les caractères, thème clair/sombre/système, code de transfert de progression, remise à zéro.
- **Aide et retours** (Paramètres) : « Signaler un bug » et « Demander une fonctionnalité » ouvrent un formulaire d'issue GitHub prérempli (version, mode installé ou navigateur, taille d'écran, navigateur). Formulaires dans `.github/ISSUE_TEMPLATE/`. Pas de jeton ni d'envoi automatique : l'utilisateur relit puis valide, avec un compte GitHub.
- **Sauvegarde** : `localStorage` ; synchro Claude seulement dans l'artefact.
- **Installable et hors ligne** : `manifest.webmanifest`, `sw.js` (réseau d'abord, cache en secours, polices mises en cache) et `icons/` (习 blanc sur jade). Ajoutable à l'écran d'accueil sur Android et iOS.

## Mots enseignés avant les phrases
Les séries d'apprentissage d'un chapitre présentent tous ses mots (par groupes de 8 au plus) ; la série Phrases ne contient que des mots déjà enseignés. Mots ajoutés le 09/11/2026 pour respecter cette règle : 好, 吗, 呢, 多大, 几岁, 记得, 还 (leçon 1), 不 (pays), 英语, 德语 (langues), 怎么写, 王, 小明, 饭. Leçon 3 : Loisirs, Nourriture et boissons, puis Aimer et demander.

## Ajouter du contenu
Procédure complète, formats et règles : [`PROMPT-ajout-contenu.md`](PROMPT-ajout-contenu.md). Contrôle automatique : `tools/run-audit.sh`.

## Phrases générées
Chaque thème avec générateur (`TEMPLATES` dans `index.html`) crée des phrases qui réutilisent le vocabulaire des leçons précédentes : nationalités, langues, famille, activités, heures. Générateurs ajoutés le 09/11/2026 : Pronoms (avec 你们), Nombres (personnes, mois, numéros de téléphone), Qui est-ce ?, Membres de la famille, La journée de Xiaoming, Dire l'heure. Seul « Caractères et vocabulaire » n'en a pas (3 mots seulement).
Pour ajouter un générateur : une entrée `{th, subj, make(s,p)}` dans `TEMPLATES` ; tester qu'une réponse canonique est jugée juste (`gradePy`, `gradeFr`).

## Idées / à faire
- [ ] Retours sans compte GitHub : nécessiterait un petit service intermédiaire (ex. Cloudflare Worker) qui garde un jeton ; à éviter tant que l'app reste perso (spam, maintenance).
- [ ] Séparer les données (vocabulaire) du code dans `data/` quand le fichier deviendra trop gros (≈ 785 Ko aujourd'hui, dont Hanzi Writer).
- [ ] Compléter le cours (leçon 7 manquante) puis ajouter la leçon dans `LESSONS`.
