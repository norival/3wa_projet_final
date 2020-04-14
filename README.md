# Projet 3WA

## Descritpion

Projet de fin d'étude pour la 3W Academy. Ce projet consiste en site web
personel, en suivant une architecture CMS.

### Back-end

Le back-end est réalisé avec Symfony, version 5. J'ai essayé de suivre les
principes REST API pour la gestion du contenu. Cette gestion se structure de la
sorte :

- Le contenu (content): c'est l'unité de base du CMS, il peut contenir n'importe quoi et
  ses données sont stockées sous forme de JSON dans la base de données.
- Les assets : comme le contenu, mais sont destinées à stocker les fichiers
  binaires, etc. (images, ...)
- Les collections : elles sont un regoupement de contenu et d'assets destinées
  à être vues ensembles et peuvent être rendues dans un même template

### Administration du site

Pour la partie administration du site, j'ai décidé de tenter de faire
une SPA en javascript, sans utiliser de framework, afin d'approfondir ma
connaissance du javascript. L'interface est fonctionnelle mais n'est pas très
ergonomique, le projet est un peu expérimental et m'a surtout permis
d'apprendre de nombreux concepts en javascript. J'ai suivi un design pattern
MVC pour cette application, avec trois classes principales : `AdminController`,
`AdminModel`, `AdminView`. Ces trois composantes communiquent entre elles par
l'intermédiaire de callbacks.

La gestion des utilisateurs, des assets et les statistiques du site ne sont pas
encore implémentées, leurs liens ne fonctionnent donc pas.
