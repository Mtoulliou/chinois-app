# Fonctionnalités

## Présentes (dans `index.html`)
- **7 leçons** : Se présenter, Qui suis-je, Goûts et loisirs, Ma famille, Ma journée, L'heure, Mon samedi (leçons 1 à 6 et 8 du cours ; la leçon 7 manque dans le cours).
- **Parcours** : thèmes en îlots, 4 niveaux par thème (découverte QCM, reconnaissance pinyin→français, production français→pinyin avec tons, phrases), validation à 80 %.
- **Contrôle de leçon** : 20 questions mélangées, 16/20 pour valider.
- **Révision** : série libre, « Mes erreurs » (badge du nombre d'erreurs), choix d'une leçon ou de toutes.
- **Écriture** : tracé avec Hanzi Writer, 3 étapes (observer, guidé, mémoire), 242 caractères dont les données de traits sont intégrées au fichier (hors ligne). Bandeau « En travaux » affiché : pas encore testé au doigt sur téléphone.
- **Paramètres** : afficher les caractères, thème clair/sombre/système, code de transfert de progression, remise à zéro.
- **Sauvegarde** : `localStorage` ; synchro Claude seulement dans l'artefact.
- **Hors-ligne** : enregistrement d'un service worker `sw.js` s'il existe avec un `manifest` (aucun des deux n'est dans le dépôt pour l'instant).

## Idées / à faire
- [ ] Ajouter `manifest.webmanifest`, icônes et `sw.js` (installable + hors-ligne).
- [ ] Séparer les données (vocabulaire) du code dans `data/` quand le fichier deviendra trop gros (≈ 785 Ko aujourd'hui, dont Hanzi Writer).
- [ ] Tester l'onglet Écriture au doigt sur un vrai téléphone, puis retirer le bandeau « En travaux ».
- [ ] Compléter le cours (leçon 7 manquante) puis ajouter la leçon dans `LESSONS`.
- [ ] Retrouver `build.py` / `site/` des anciennes versions si on veut les réutiliser (non repris ici).
