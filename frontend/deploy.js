// Script de déploiement simplifié pour Render
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Préparation du déploiement sur Render...');

// Vérifier si le dossier build existe et le supprimer si c'est le cas
const buildDir = path.join(__dirname, 'build');
if (fs.existsSync(buildDir)) {
  console.log('🗑️ Suppression du dossier build existant...');
  fs.rmSync(buildDir, { recursive: true, force: true });
}

try {
  // Créer un fichier .env.production.local pour définir l'URL de l'API
  console.log('🔧 Configuration de l\'URL de l\'API...');
  fs.writeFileSync(
    path.join(__dirname, '.env.production.local'),
    'REACT_APP_API_URL=https://campus-connect-api.onrender.com/api\n'
  );

  // Installer les dépendances
  console.log('📦 Installation des dépendances...');
  execSync('npm install', { stdio: 'inherit', cwd: __dirname });

  // Créer le build de production
  console.log('🏗️ Création du build de production...');
  execSync('npm run build', { stdio: 'inherit', cwd: __dirname });

  console.log('✅ Build terminé avec succès!');
  console.log('📂 Les fichiers de build sont prêts dans le dossier "build"');
  console.log('🌐 Vous pouvez maintenant déployer ces fichiers sur Render');

} catch (error) {
  console.error('❌ Erreur lors de la préparation du déploiement:', error.message);
  process.exit(1);
}
