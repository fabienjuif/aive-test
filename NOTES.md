1. [18:00] Lire le projet, comprendre le besoin, chercher les ressources nécessaires

- video api js => https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Video_and_audio_APIs
  - Le but est de voir comment bien synchroniser la video avec la position de la boite / les boites
  - Les instructions demandent une utilisation de D3
    - Pourquoi pas mais je me demande pour l'instant pourquoi un simple canvas ne ferait pas l'affaire
    - Je pense commencer comme ça
- a noter que je ne vais pas faire de test pour aller plus vite mais dans la vrai vie j'aurais au moins fait un cypress (e2e)
  - par contre pour l'instant je n'ai pas trop idée de comment bien tester une video et une frame en particulier avec cypress :)
- idem dans la vrai vie peut être que j'aurais utiliser un state manager (@fabienjuif/myrtille ?? :D), mais la je vais faire au plus simple => React pur

2. [18:05] bootstrapping appli

- yarn create react-app
- prettier
- je vais faire du css pure et pas de sass ni de css module

3. [18:10] jouer avec la video pour réagir à son avancement (récupérer le currentTime)

- j'ai trouvé qu'on pouvait faire un onTimeUpdate que je vais utiliser plutot qu'une ref
- je vais faire le choix pour simplifier parce que je ne pense pas que ce soit l'objectif du test, d'importer le json dans les sources plutôt que de le fetch

  videoHeight: 720
  videoWidth: 1280

- je pense avoir pigé comment est structuré le jdd
- les box doivent être calculé toutes les 166ms (en gros)
  **Par contre je ne vois pas de detection de voiture contrairement à ce qui est sous entendu dans les instructions**
- j'ajoute un TODO: pour voir pour optimiser la data representation est speed up l'accès à la donnée éventuellement

4. [18:30] premier draft avec un canvas

5. [19:00] premier poc ok avec canvas (pause)

6. [20:14] reprise - installation et utilisation d3

7. [21:00] pause

8. [9:30] reprise du projet utilisation de requestAnimationFrame et un peu d'interpolation via range et domain de d3

9. [10:00] remise au propre du projet

- Je fais le choix de ne pas faire de sous composant ici pour garder la structure simple
- Je me questionne sur l'utilisation de d3 ici, je pense que j'aurais pu faire la même chose en react pur et canvas pur + interpolation via une lib tiers (ou d3 juste pour ça), mais ça montre un peu l'utilisation de d3, comme c'est demandé.

10. [10:30] deploiement

- utilisation de gh-pages
- j'ai modifié un peu le code pour inclure l'image en path relatif (ça simplifie un peu)

11. [10:45] fin
