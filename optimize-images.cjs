/**
 * Image Optimization Script
 * - Convert all profile photos (PNG/JPG/JPEG) to WebP (quality 82, max 800px width)
 * - Write to both assets/photos/ and public/photos/
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ASSETS_PHOTOS = path.join(__dirname, 'assets', 'photos');
const PUBLIC_PHOTOS = path.join(__dirname, 'public', 'photos');

// Profile photos that are actually used
const PROFILE_PHOTOS = [
  'amal-amazouz',
  'elhoussine-essmami',
  'salah-eddine-mimouni',
  'tarik-el-abbadi',
  'ayoub-es-samlali',
  'yassmine-boudial',
  'wafae-lamsabni',
  'zakaria-mouchtati',
  'youssef-amazouz',
];

async function convertPhotos() {
  for (const name of PROFILE_PHOTOS) {
    // Find the source file (could be .png, .jpg, .jpeg)
    let srcFile = null;
    for (const ext of ['.png', '.jpg', '.jpeg']) {
      const candidate = path.join(ASSETS_PHOTOS, name + ext);
      if (fs.existsSync(candidate)) {
        srcFile = candidate;
        break;
      }
    }
    if (!srcFile) {
      console.log(`⚠️  Source not found for: ${name}`);
      continue;
    }

    const outName = name + '.webp';
    const outAssets = path.join(ASSETS_PHOTOS, outName);
    const outPublic = path.join(PUBLIC_PHOTOS, outName);

    console.log(`🔄 Converting: ${path.basename(srcFile)} → ${outName}`);

    await sharp(srcFile)
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(outAssets);

    // Copy to public/photos as well
    fs.copyFileSync(outAssets, outPublic);

    const origSize = fs.statSync(srcFile).size;
    const newSize = fs.statSync(outAssets).size;
    const savings = ((1 - newSize / origSize) * 100).toFixed(1);
    console.log(`   ✅ ${(origSize / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB (${savings}% smaller)`);
  }
}

// Also convert logo-mark.png to WebP for apple-touch-icon fallback
async function convertLogoMark() {
  const src = path.join(__dirname, 'assets', 'logo-mark.png');
  const pubSrc = path.join(__dirname, 'public', 'logo-mark.png');
  if (fs.existsSync(src)) {
    const out = path.join(__dirname, 'assets', 'logo-mark.webp');
    const pubOut = path.join(__dirname, 'public', 'logo-mark.webp');
    console.log(`\n🔄 Converting: logo-mark.png → logo-mark.webp`);
    await sharp(src)
      .resize({ width: 512, withoutEnlargement: true })
      .webp({ quality: 90 })
      .toFile(out);
    fs.copyFileSync(out, pubOut);
    const origSize = fs.statSync(src).size;
    const newSize = fs.statSync(out).size;
    const savings = ((1 - newSize / origSize) * 100).toFixed(1);
    console.log(`   ✅ ${(origSize / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB (${savings}% smaller)`);
  }
}

async function main() {
  console.log('🚀 Starting image optimization...\n');
  await convertPhotos();
  await convertLogoMark();
  console.log('\n✨ All images optimized!');
}

main().catch(console.error);
