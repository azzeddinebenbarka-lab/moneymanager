/**
 * Script d'optimisation des images pour réduire la taille de l'APK
 * Utilise sharp pour compresser les images sans perte de qualité visible
 * 
 * Installation : npm install --save-dev sharp
 * Usage : node scripts/optimize-images.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '..', 'assets', 'images');
const outputDir = path.join(__dirname, '..', 'assets', 'images-optimized');

// Créer le dossier de sortie s'il n'existe pas
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Configuration pour chaque type d'image
const imageConfigs = {
  'icon.png': { width: 1024, height: 1024, quality: 90 },
  'adaptive-icon.png': { width: 1024, height: 1024, quality: 90 },
  'splash-icon.png': { width: 1284, height: 2778, quality: 85 },
  'notification-icon.png': { width: 96, height: 96, quality: 90 },
  'favicon.png': { width: 48, height: 48, quality: 90 },
};

async function optimizeImage(filename, config) {
  const inputPath = path.join(imagesDir, filename);
  const outputPath = path.join(outputDir, filename);

  if (!fs.existsSync(inputPath)) {
    console.log(`⚠️  ${filename} n'existe pas, ignoré`);
    return;
  }

  const beforeSize = fs.statSync(inputPath).size;

  await sharp(inputPath)
    .resize(config.width, config.height, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 0 }
    })
    .png({ quality: config.quality, compressionLevel: 9 })
    .toFile(outputPath);

  const afterSize = fs.statSync(outputPath).size;
  const reduction = ((1 - afterSize / beforeSize) * 100).toFixed(1);

  console.log(`✅ ${filename}: ${(beforeSize / 1024).toFixed(1)} KB → ${(afterSize / 1024).toFixed(1)} KB (${reduction}% de réduction)`);
}

async function optimizeAllImages() {
  console.log('🎨 Optimisation des images...\n');

  for (const [filename, config] of Object.entries(imageConfigs)) {
    try {
      await optimizeImage(filename, config);
    } catch (error) {
      console.error(`❌ Erreur lors de l'optimisation de ${filename}:`, error.message);
    }
  }

  console.log('\n✅ Optimisation terminée !');
  console.log(`📁 Images optimisées disponibles dans : ${outputDir}`);
  console.log('📝 Remplacez manuellement les images dans assets/images/ par celles optimisées');
}

optimizeAllImages().catch(console.error);
