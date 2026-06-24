# M-MOTORS FRONTEND

Ce projet est le frontend de l’application M-Motors.
Il permet la gestion des utilisateurs, véhicules, dossiers de location et documents.

L’application est développée en HTML, CSS et JavaScript vanilla, en communication avec une API Flask sécurisée par JWT.



# STACK TECHNIQUE

- HTML5
- CSS3
- JavaScript (Vanilla)
- Fetch API
- JWT (stocké dans localStorage)
- Cypress (tests end-to-end)



# CONFIGURATION API

Le frontend communique avec une API REST.


# En local
js:
const API_BASE = "http://127.0.0.1:5001/api/v1";


# En production (VPS)
js:
const API_BASE = "/api/v1";


# AUTHENTIFICATION
L’authentification est basée sur JWT.

Le token est stocké dans localStorage
Il est envoyé automatiquement dans les requêtes API
L’accès aux pages protégées est contrôlé via un guard


# STRUCTURE DU PROJET
/views        → Pages HTML
/static       → CSS et JavaScript
/templates    → Navbar / Footer
/cypress      → Tests E2E


# FONCTIONNALITÉS
Authentification (login / register)
Gestion des utilisateurs
Gestion des véhicules
Création et suivi des dossiers
Upload et consultation de documents
Dashboard utilisateur et admin


# TESTS CYPRESS
Les tests couvrent les scénarios principaux :

Login utilisateur
Création d’un dossier
Consultation des dossiers et documents

Commande pour lancer les tests :
bash:
npx cypress open

ou en mode headless :
npx cypress run


# LANCEMENT DU PROJET
Il suffit d’ouvrir le fichier :

index.html

ou via un serveur local (Go Live Server / VS Code).


# AUTEUR
Projet réalisé dans le cadre de la formation bachelor developpeur d'Application Python.

Projet réalisé par Mr Derrouiche Badreddine.

