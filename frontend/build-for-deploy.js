// Script pour préparer le déploiement
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Préparation du déploiement du frontend...');

try {
  // Vérifier que toutes les dépendances sont installées
  console.log('📦 Installation des dépendances...');
  execSync('npm install', { stdio: 'inherit' });

  // Définir la variable d'environnement pour l'API
  console.log('🔧 Configuration de l\'API URL...');
  process.env.REACT_APP_API_URL = 'https://campus-connect-api.onrender.com/api';

  // Créer le build de production
  console.log('🏗️ Création du build de production...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('✅ Build terminé avec succès!');
  console.log('📂 Les fichiers de build sont prêts dans le dossier "build"');
  console.log('🌐 Vous pouvez maintenant déployer ces fichiers sur Render');

} catch (error) {
  console.error('❌ Erreur lors de la préparation du déploiement:', error.message);
  process.exit(1);
}
