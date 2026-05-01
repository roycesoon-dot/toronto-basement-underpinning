import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const API_KEY = '93b42d676cf92bdccb02aebba3d7bdbd';
const BASE_URL = 'https://api.nanobananaapi.ai/api/v1/nanobanana';
const OUTPUT_DIR = path.join(__dirname, 'public', 'images', 'generated');
const POLL_INTERVAL = 4000;
const MAX_WAIT = 180000;

const PROMPT = 'Real job site interior photograph of a Toronto basement underpinning in progress, two workers in casual work clothes and hard hats crouching on a crushed stone gravel floor, orange Delta MS dimple board membrane covering the full height of the concrete block foundation walls with clearly visible raised circular dome dimple texture pattern across the entire surface, white Schedule 35 PVC perforated drainage pipe laid along the base of the wall in crushed stone, white PVC pipe fittings and elbows visible, thick bed of angular crushed limestone gravel covering the entire floor, three yellow contractor buckets scattered on the gravel, work light illuminating the corner, exposed wooden floor joists above, low ceiling height, confined rectangular basement space, slightly hazy dusty air, authentic Toronto construction site, photorealistic documentary photograph, wide angle';

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

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
  if (!taskId) throw new Error(`No taskId in response: ${JSON.stringify(json)}`);
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
  throw new Error('Timed out waiting for image');
}

async function downloadImage(url, filepath) {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Download failed: ${resp.status}`);
  const buf = Buffer.from(await resp.arrayBuffer());
  fs.writeFileSync(filepath, buf);
  return buf.length;
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const filepath = path.join(OUTPUT_DIR, 'test-underpinning-jobsite.webp');

  console.log('Submitting image generation request...');
  const taskId = await submitTask(PROMPT);
  console.log(`Task ID: ${taskId}`);
  console.log('Generating (polling every 4s)');

  const imageUrl = await pollTask(taskId);
  console.log(`\nImage ready: ${imageUrl}`);

  console.log('Downloading...');
  const bytes = await downloadImage(imageUrl, filepath);
  console.log(`\nSaved: ${filepath} (${(bytes / 1024).toFixed(1)} KB)`);
  console.log('\nDone! Check public/images/generated/test-underpinning-jobsite.webp');
}

main().catch(err => {
  console.error('\nError:', err.message);
  process.exit(1);
});
