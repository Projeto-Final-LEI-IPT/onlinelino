const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceFolder = 'C:/onlinelino/src/server/public/img/backoffice/roteiro';

fs.readdir(sourceFolder, (err, files) => {
  if (err) throw err;

  files.forEach(file => {
    const ext = path.extname(file).toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.bmp', '.JPG'].includes(ext)) {
      const inputPath = path.join(sourceFolder, file);
      const outputPath = path.join(sourceFolder, path.parse(file).name + '.webp');

      sharp(inputPath)
        .webp({ quality: 80 })
        .toFile(outputPath)
        .then(() => console.log(`✅ ${file} convertido para WebP`))
        .catch(err => console.error(`❌ Erro ao converter ${file}:`, err));
    }
  });
});
