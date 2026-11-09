# Fonctionnalités

## Présentes (dans `index.html`)
- **7 leçons** : Se présenter, Qui suis-je, Goûts et loisirs, Ma famille, Ma journée, L'heure, Mon samedi (leçons 1 à 6 et 8 du cours ; il n'y a pas de leçon 7 dans l'app).
- **Parcours** : thèmes en îlots, 4 niveaux par thème (découverte QCM, reconnaissance pinyin→français, production français→pinyin avec tons, phrases), validation à 80 %.
- **Contrôle de leçon** : 20 questions mélangées, 16/20 pour valider.
- **Révision** : série libre, « Mes erreurs » (badge du nombre d'erreurs), choix d'une leçon ou de toutes.
- **Écriture** : tracé des caractères avec Hanzi Writer, 3 étapes, suivi de maîtrise.
- **Paramètres** : afficher les caractères, thème clair/sombre/système, code de transfert de progression, remise à zéro.
- **Sauvegarde** : `localStorage` ; synchro Claude seulement dans l'artefact.
- **Hors-ligne** : enregistrement d'un service worker `sw.js` s'il existe avec un `manifest` (aucun des deux n'est dans le dépôt pour l'instant).

## Idées / à faire
- [ ] Ajouter `manifest.webmanifest`, icônes et `sw.js` (installable + hors-ligne).
- [ ] Leçon 7 si le cours en ajoute une.
- [ ] Séparer les données (vocabulaire) du code dans `data/` quand le fichier deviendra trop gros (≈ 785 Ko aujourd'hui, dont Hanzi Writer).
- [ ] Vérifier que les données de traits (jsdelivr) fonctionnent hors ligne.
