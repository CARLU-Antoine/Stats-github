# Stats-Github

Une application web moderne construite avec **React.js** (frontend) et **Symfony** (backend) permettant à n'importe quel utilisateur de visualiser les **statistiques de ses dépôts GitHub** : nombre de **vues**, de **clones**, et bien plus encore, le tout affiché avec des **graphiques interactifs** via la librairie **Highcharts.js**.

---

## ✨ Fonctionnalités

- 🔐 **Connexion sécurisée via token GitHub personnel**
- 📊 Visualisation :
  - Statistiques de **vues** (nombre total, uniques, historiques)
  - Statistiques de **clones** (nombre total, uniques, historiques)
- 📁 Liste de tous vos dépôts GitHub (publics et privés)
- 🔄 Données affichées **du plus récent au plus ancien dépôt**
- 📈 Graphiques dynamiques et responsives avec **Highcharts**
- ⚡ Interface fluide avec React.js (hooks & composants modernes)

---

## 🔧 Technologies utilisées

### Frontend
- [React.js](https://reactjs.org/)
- [Axios](https://axios-http.com/) pour les requêtes API
- [Highcharts.js](https://www.highcharts.com/) pour les visualisations
- CSS

### Backend
- [Symfony 6](https://symfony.com/)
- [HttpClient](https://symfony.com/doc/current/http_client.html) pour l'accès à l'API GitHub
- Création des endpoints
- Sécurité via **token GitHub** stocké temporairement côté backend

---

## 🚀 Lancement du projet

### Prérequis
- PHP 8.1+
- Node.js 18+
- Composer
- GitHub personal access token (avec permissions `repo` et `read:traffic`)

### 🔙 Backend (Symfony)

```bash
cd backend/
composer install
php bin/console server:run


🔜 Frontend (React)

cd frontend/
npm install
npm run dev