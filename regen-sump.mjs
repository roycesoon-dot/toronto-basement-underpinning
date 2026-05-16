/**
 * Regenerate just the sump pump image with corrected prompt
 * Run: node regen-sump.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API_KEY = '93b42d676cf92bdccb02aebba3d7bdbd';
const BASE_URL = 'https://api.nanobananaapi.ai/api/v1/nanobanana';
const OUTPUT_DIR = path.join(__dirname, 'public', 'images', 'generated');
const POLL_INTERVAL = 4000;
const MAX_WAIT = 180000;

const target = {
  filename: 'gallery-mississauga-sump-battery-backup.webp',
  prompt:
    'Real job-site photo inside an unfinished Toronto basement, round black plastic sump basin set flush into a grey concrete floor with the lid removed, yellow cast-iron Zoeller primary sump pump sitting inside the basin at the bottom, white PVC discharge pipe rising vertically from the pit up the concrete block wall, black rectangular battery backup controller box mounted on the wall above the pit with wires running down to a backup pump head inside the basin, dim construction lighting, realistic interior plumbing photo',
};

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function submitTask(prompt) {
  const resp = await fetch(`${BASE_URL}/generate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt, type: 'TEXTTOIAMGE', numImages: 1 }),
  });
  const json = await resp.json();
  if (!resp.ok || json.code !== 200) throw new Error(`Submit failed: ${JSON.stringify(json)}`);
  const taskId = json.data?.taskId;
  if (!taskId) throw new Error(`No taskId: ${JSON.stringify(json)}`);
  return taskId;
}

async function pollTask(taskId) {
  const deadline = Date.now() + MAX_WAIT;
  while (Date.now() < deadline) {
    await sleep(POLL_INTERVAL);
    const resp = await fetch(`${BASE_URL}/record-info?taskId=${taskId}`, {
      headers: { 'Authorization': `Bearer ${API_KEY}` },
    });
    const json = await resp.json();
    const task = json.data || json;
    if (task.successFlag === 1) return task.response?.resultImageUrl;
    if (task.successFlag === 2 || task.successFlag === 3) throw new Error(`Generation failed (flag=${task.successFlag})`);
    process.stdout.write('.');
  }
  throw new Error('Timed out');
}

async function downloadImage(url, filepath) {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Download failed: ${resp.status}`);
  const buf = Buffer.from(await resp.arrayBuffer());
  // Compress in-place (read → sharp → write)
  const compressed = await sharp(buf)
    .resize(1280, 720, { fit: 'cover', position: 'centre' })
    .webp({ quality: 75 })
    .toBuffer();
  fs.writeFileSync(filepath, compressed);
  return compressed.length;
}

async function main() {
  const dest = path.join(OUTPUT_DIR, target.filename);
  console.log(`Generating: ${target.filename}`);
  const taskId = await submitTask(target.prompt);
  console.log(`taskId: ${taskId} — polling`);
  const imageUrl = await pollTask(taskId);
  console.log(`\nDownloading + compressing...`);
  const bytes = await downloadImage(imageUrl, dest);
  console.log(`✓ Done (${(bytes / 1024).toFixed(1)} KB) → ${target.filename}`);
}

main().catch(err => { console.error('Fatal:', err.message); process.exit(1); });
