// Script pour vérifier les imports dans tous les fichiers
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Fonction pour parcourir récursivement un répertoire
async function walkDir(dir, fileList = []) {
  const files = await readdir(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = await stat(filePath);
    
    if (stats.isDirectory()) {
      fileList = await walkDir(filePath, fileList);
    } else if (stats.isFile() && (file.endsWith('.js') || file.endsWith('.jsx'))) {
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

// Fonction pour vérifier les imports incomplets
async function checkImports(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    
    // Recherche des imports incomplets
    const importRegex = /import\s+.*\s+from\s+['"]\.\.\/[^'"]*['"]/g;
    const matches = content.match(importRegex);
    
    if (matches) {
      console.log(`Fichier avec imports potentiellement problématiques: ${filePath}`);
      matches.forEach(match => console.log(`  ${match}`));
    }
  } catch (error) {
    console.error(`Erreur lors de la lecture du fichier ${filePath}:`, error);
  }
}

// Fonction principale
async function main() {
  try {
    const srcDir = path.resolve(__dirname);
    console.log(`Vérification des imports dans ${srcDir}...`);
    
    const files = await walkDir(srcDir);
    console.log(`Trouvé ${files.length} fichiers JS/JSX`);
    
    for (const file of files) {
      await checkImports(file);
    }
    
    console.log('Vérification terminée');
  } catch (error) {
    console.error('Erreur:', error);
  }
}

main();
