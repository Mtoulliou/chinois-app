# Fonctionnalités

## Présentes (dans `index.html`)
- **7 leçons** : Se présenter, Qui suis-je, Goûts et loisirs, Ma famille, Ma journée, L'heure, Mon samedi (leçons 1 à 6 et 8 du cours ; la leçon 7 manque dans le cours).
- **Parcours** : thèmes en îlots, 4 niveaux par thème (découverte QCM, reconnaissance pinyin→français, production français→pinyin avec tons, phrases), validation à 80 %.
- **Contrôle de leçon** : 20 questions mélangées, 16/20 pour valider.
- **Révision** : série libre, « Mes erreurs » (badge du nombre d'erreurs), choix d'une leçon ou de toutes.
- **Écriture** : tracé avec Hanzi Writer, 3 étapes (observer, guidé, mémoire), 242 caractères dont les données de traits sont intégrées au fichier (hors ligne). Bandeau « En travaux » affiché : pas encore testé au doigt sur téléphone.
- **Paramètres** : afficher les caractères, thème clair/sombre/système, code de transfert de progression, remise à zéro.
- **Sauvegarde** : `localStorage` ; synchro Claude seulement dans l'artefact.
- **Installable et hors ligne** : `manifest.webmanifest`, `sw.js` (réseau d'abord, cache en secours, polices mises en cache) et `icons/` (习 blanc sur jade). Ajoutable à l'écran d'accueil sur Android et iOS.

## Idées / à faire
- [ ] Séparer les données (vocabulaire) du code dans `data/` quand le fichier deviendra trop gros (≈ 785 Ko aujourd'hui, dont Hanzi Writer).
- [ ] Tester l'onglet Écriture au doigt sur un vrai téléphone, puis retirer le bandeau « En travaux ».
- [ ] Compléter le cours (leçon 7 manquante) puis ajouter la leçon dans `LESSONS`.
