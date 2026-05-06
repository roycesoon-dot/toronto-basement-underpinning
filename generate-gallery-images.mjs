/**
 * NanoBanana gallery image generator for TBU
 * Run: node generate-gallery-images.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API_KEY = '93b42d676cf92bdccb02aebba3d7bdbd';
const BASE_URL = 'https://api.nanobananaapi.ai/api/v1/nanobanana';
const OUTPUT_DIR = path.join(__dirname, 'public', 'images', 'generated');
const POLL_INTERVAL = 4000;
const MAX_WAIT = 180000;

const images = [
  {
    filename: 'gallery-annex-victorian-underpinning.webp',
    prompt: 'Interior of a Toronto Victorian semi-detached basement during underpinning, staged pin-section excavation visible along the concrete foundation wall, fresh poured concrete in completed pins, wood shoring, construction lighting, realistic job-site photo',
  },
  {
    filename: 'gallery-scarborough-bungalow-underpinning.webp',
    prompt: 'Toronto basement underpinning job site, completed concrete pin sections poured directly beneath and flush against the base of an existing brick foundation wall, new concrete footing extensions visible tight to the wall at floor level, sequential pin excavations still open beside completed ones, dirt floor, construction lighting, realistic job-site photography',
  },
  {
    filename: 'gallery-north-york-underpinning-pour.webp',
    prompt: 'Concrete being poured into a formed underpinning pin section in a Toronto basement, worker in safety gear guiding concrete from a chute, wet concrete visible, foundation wall in background, realistic construction photo',
  },
  {
    filename: 'gallery-etobicoke-weeping-tile-waterproofing.webp',
    prompt: 'Interior basement waterproofing installation in a Toronto home, Delta-MS dimpled plastic membrane installed against the concrete foundation wall, new weeping tile trench at the footing visible, construction lighting, realistic job-site photo',
  },
  {
    filename: 'gallery-mississauga-sump-battery-backup.webp',
    prompt: 'Sealed circular sump pit in a Toronto basement with the lid partially removed showing a primary sump pump and a battery backup pump side by side inside the pit, clean white ABS piping, realistic interior photo',
  },
  {
    filename: 'gallery-east-york-walkout-excavation.webp',
    prompt: 'Walkout basement excavation in progress at a Toronto brick home, rectangular opening freshly cut through the exterior brick foundation wall, structural steel I-beam lintel installed horizontally spanning the top of the opening, excavated stairwell pit dug in the earth outside the house, construction debris and dirt visible around the opening, realistic job-site photo taken from outside looking at the foundation wall',
  },
  {
    filename: 'gallery-oakville-walkout-retaining-wall.webp',
    prompt: 'Completed walkout basement entrance at a suburban Toronto home, view from outside looking down concrete steps descending below grade into a sunken stairwell, poured concrete retaining walls on both sides, a solid grey steel door set into the brick foundation wall at the bottom of the stairs, brick siding of the house visible above at grade level, metal handrail on one side, realistic exterior residential photo',
  },
  {
    filename: 'gallery-leslieville-basement-suite.webp',
    prompt: 'Finished modern basement suite in a Toronto home, open-concept layout with LVP flooring, white drywall, pot lights, small kitchen area visible in background, bright and clean, realistic interior photography',
  },
  {
    filename: 'gallery-rexdale-basement-apartment.webp',
    prompt: 'Completed basement apartment in a Toronto home with a separate side entrance door, small kitchen with white cabinets and laminate countertops, 4-piece bathroom doorway visible, LVP flooring, realistic interior photo',
  },
  {
    filename: 'gallery-midtown-crack-injection.webp',
    prompt: 'Polyurethane crack injection being performed on a poured concrete basement foundation wall in Toronto, injection ports epoxied along a vertical crack, technician in safety gear holding injection gun, realistic construction photo',
  },
  {
    filename: 'gallery-brampton-foundation-parging.webp',
    prompt: 'Freshly applied parging coat on a concrete block foundation wall exterior in Toronto, smooth grey mortar finish covering the block surface, waterproof coating being applied, realistic construction photography',
  },
  {
    filename: 'gallery-beaches-underpinning-finished.webp',
    prompt: 'Completed finished basement suite in a Toronto home after underpinning, modern open-plan layout with pot lights, LVP flooring, framed walls painted white, egress window letting in natural light, realistic interior photo',
  },
];

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
  fs.writeFileSync(filepath, buf);
  return buf.length;
}

async function generateOne(img, index) {
  const dest = path.join(OUTPUT_DIR, img.filename);
  if (fs.existsSync(dest)) {
    console.log(`[${index+1}/${images.length}] Already exists, skipping: ${img.filename}`);
    return;
  }
  console.log(`\n[${index+1}/${images.length}] Generating: ${img.filename}`);
  const taskId = await submitTask(img.prompt);
  console.log(`  taskId: ${taskId} — polling`);
  const imageUrl = await pollTask(taskId);
  console.log(`\n  Downloading...`);
  const bytes = await downloadImage(imageUrl, dest);
  console.log(`  ✓ Saved (${(bytes/1024).toFixed(1)} KB) → ${img.filename}`);
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`Generating ${images.length} gallery images into ${OUTPUT_DIR}\n`);
  for (let i = 0; i < images.length; i++) {
    try {
      await generateOne(images[i], i);
    } catch (err) {
      console.error(`  ✗ Failed: ${images[i].filename} — ${err.message}`);
    }
    if (i < images.length - 1) await sleep(2000);
  }
  console.log('\n✅ Done.');
}

main().catch(err => { console.error('Fatal:', err.message); process.exit(1); });
