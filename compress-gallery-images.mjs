/**
 * Compress gallery images in-place using Sharp
 * Run: node compress-gallery-images.mjs
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.join(__dirname, 'public', 'images', 'generated');

const files = fs.readdirSync(DIR).filter(f => f.startsWith('gallery-') && f.endsWith('.webp'));

console.log(`Compressing ${files.length} gallery images...\n`);

for (const file of files) {
  const filepath = path.join(DIR, file);
  const before = fs.statSync(filepath).size;
  const tmp = filepath + '.tmp';

  await sharp(filepath)
    .resize(1280, 720, { fit: 'cover', position: 'centre' })
    .webp({ quality: 75 })
    .toFile(tmp);

  fs.renameSync(tmp, filepath);
  const after = fs.statSync(filepath).size;
  const saving = (((before - after) / before) * 100).toFixed(0);
  console.log(`  ${file}`);
  console.log(`    ${(before/1024).toFixed(0)} KB → ${(after/1024).toFixed(0)} KB  (-${saving}%)`);
}

console.log('\n✅ Done.');
