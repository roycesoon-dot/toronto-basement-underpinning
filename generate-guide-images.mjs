import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const API_KEY = '93b42d676cf92bdccb02aebba3d7bdbd';
const BASE_URL = 'https://api.nanobananaapi.ai/api/v1/nanobanana';
const OUTPUT_DIR = path.join(__dirname, 'public', 'images', 'guides');
const POLL_INTERVAL = 4000;
const MAX_WAIT = 180000;
const DELAY_BETWEEN = 2000;

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const IMAGES = [
  // architectural-drawings-basement-underpinning
  ['guide-architectural-drawings-hero.webp', 'Structural engineer reviewing large stamped underpinning drawings spread across a drafting desk in a Toronto office, detailed technical blueprints with footing dimensions visible, professional natural lighting, photorealistic editorial quality'],
  ['guide-architectural-drawings-content.webp', 'Close-up of underpinning footing section detail drawing on white paper showing pin sequence numbers and footing dimensions annotated in pencil, clean professional technical document, photorealistic'],

  // basement-ceiling-height-requirements
  ['guide-ceiling-height-hero.webp', 'Contractor in hard hat measuring ceiling height in unfinished Toronto basement with yellow measuring tape against concrete wall, showing low 6 foot 6 inch clearance, documentary photography style, natural lighting'],
  ['guide-ceiling-height-content.webp', 'Side by side Toronto basement comparison, left side showing original low ceiling with exposed joists, right side showing new raised height after underpinning with pot lights, photorealistic real estate photography'],

  // basement-finishing-after-underpinning
  ['guide-finishing-after-hero.webp', 'Bright modern finished Toronto basement living space with 8 foot ceiling, recessed pot lights, luxury vinyl flooring, neutral grey walls, open concept layout, professional interior photography, warm lighting'],
  ['guide-finishing-after-content.webp', 'Toronto basement during finishing phase showing new drywall on underpinned walls, ceiling joists freshly framed, electrical rough-in visible, construction progress photography'],

  // basement-finishing-cost-ontario
  ['guide-finishing-cost-hero.webp', 'Ontario homeowner and contractor sitting at kitchen table reviewing detailed basement finishing quote documents, both engaged and professional, warm natural lighting, photorealistic'],
  ['guide-finishing-cost-content.webp', 'Unfinished Ontario basement with framed walls ready for drywall, egress window installed, electrical panel visible, clean construction site, wide angle photography'],

  // basement-finishing-process-timeline
  ['guide-finishing-timeline-hero.webp', 'Toronto basement renovation in full progress showing multiple trades simultaneously, framing and electrical rough-in underway, organized professional construction site, documentary photography'],
  ['guide-finishing-timeline-content.webp', 'Detailed project schedule pinned to construction site wall showing basement finishing phase breakdown by week, pen and ruler visible, professional planning photography'],

  // battery-backup-sump-pumps-explained
  ['guide-battery-backup-hero.webp', 'Brand new battery backup sump pump system installed in clean Toronto basement pit, modern AC to DC switchover control panel mounted on wall beside primary pump, professional plumbing photography'],
  ['guide-battery-backup-content.webp', 'Close-up of sump pump battery backup unit showing alarm indicator lights, float switch connections and sealed maintenance-free battery, clean white background, product photography style'],

  // city-of-toronto-building-permit
  ['guide-permit-hero.webp', 'Professional applicant submitting building permit drawings at City of Toronto Building Division counter, staff reviewing documents, government office interior, documentary photography style'],
  ['guide-permit-content.webp', 'Official City of Toronto building permit placard posted in protective sleeve at residential construction site entrance, daylight, photorealistic documentary'],

  // foundation-crack-repair-vs-underpinning
  ['guide-crack-vs-underpin-hero.webp', 'Structural engineer in safety gear carefully assessing active horizontal crack in Toronto concrete block basement wall using measurement gauge tool, focused professional work, photorealistic'],
  ['guide-crack-vs-underpin-content.webp', 'Completed polyurethane crack injection repair on Toronto poured concrete wall showing sealed ports and clean finish, before and after close-up comparison style, photorealistic'],

  // foundation-cracks-that-need-repair
  ['guide-foundation-cracks-hero.webp', 'Dramatic close-up of horizontal crack running across concrete block basement wall in Toronto home showing lateral displacement and soil pressure damage, natural light, photorealistic'],
  ['guide-foundation-cracks-content.webp', 'Toronto basement wall showing three different crack types labeled, stair-step crack in block, vertical crack in poured concrete, and horizontal bowing section, educational documentary style'],

  // foundation-repair-cost-ontario
  ['guide-foundation-repair-cost-hero.webp', 'Ontario homeowner reviewing foundation repair quote with structural engineer contractor, detailed line-item estimate visible on paper, professional home consultation, warm natural lighting, photorealistic'],
  ['guide-foundation-repair-cost-content.webp', 'Side by side showing small crack injection kit on left versus large underpinning excavation on right in Toronto basement, scale comparison for cost context, documentary photography'],

  // how-long-does-basement-waterproofing-last
  ['guide-waterproofing-lifespan-hero.webp', 'Well-maintained interior waterproofing system in clean Toronto basement showing intact dimple membrane on wall and clear drain channel at floor, 10 years old and still performing, photorealistic'],
  ['guide-waterproofing-lifespan-content.webp', 'Waterproofing technician performing annual maintenance inspection in Toronto basement, checking drain channel flow and testing sump pump, professional service photography'],

  // interior-basement-waterproofing-cost-ontario
  ['guide-waterproofing-cost-hero.webp', 'Ontario homeowner receiving waterproofing quote from contractor in basement, both reviewing detailed proposal, professional consultation photography, natural basement lighting'],
  ['guide-waterproofing-cost-content.webp', 'Waterproofing crew actively installing drain channel and dimple membrane in Toronto basement, two workers visible with tools, professional construction photography'],

  // interior-vs-exterior-waterproofing
  ['guide-interior-vs-exterior-hero.webp', 'Exterior foundation waterproofing excavation showing full depth exposure of Toronto home foundation wall with black membrane being applied, excavator visible, documentary photography'],
  ['guide-interior-vs-exterior-content.webp', 'Toronto basement interior showing freshly installed dimple membrane on foundation wall with new drain channel at floor, clean professional installation, photorealistic'],

  // interior-waterproofing-process
  ['guide-waterproofing-process-hero.webp', 'Toronto waterproofing crew using concrete saw to cut perimeter channel in basement slab, sparks visible, safety gear worn, professional construction photography, dramatic lighting'],
  ['guide-waterproofing-process-content.webp', 'Open perimeter trench in Toronto basement showing new perforated drain pipe being laid in gravel bed before membrane installation, close-up construction photography'],

  // is-basement-underpinning-safe
  ['guide-underpinning-safe-hero.webp', 'Professional underpinning crew safely working in open pin section with proper shoring visible, structural engineer supervising, safety helmets and vests, photorealistic construction documentary'],
  ['guide-underpinning-safe-content.webp', 'Structural engineer on site closely inspecting freshly poured underpinning pin section concrete before sign-off, measuring tape and clipboard, professional construction photography'],

  // legal-basement-apartment-requirements-toronto
  ['guide-legal-apartment-hero.webp', 'Finished legal basement apartment in Toronto with egress window letting in natural light, full ceiling height, separate entrance door visible, professional real estate photography'],
  ['guide-legal-apartment-content.webp', 'New egress window installation in Toronto basement showing code-compliant window well and dimensions, construction phase, natural daylight, photorealistic'],

  // signs-basement-needs-waterproofing
  ['guide-signs-waterproofing-hero.webp', 'Toronto basement wall showing active water seepage stains, white chalky efflorescence mineral deposits, and peeling paint indicating waterproofing failure, documentary close-up photography'],
  ['guide-signs-waterproofing-content.webp', 'Toronto basement floor with standing water pooling along perimeter wall after heavy rain, showing severity of drainage failure, documentary photography'],

  // signs-sump-pump-needs-replacement
  ['guide-signs-sump-hero.webp', 'Failed corroded sump pump removed from basement pit showing rust damage and deteriorated float switch, laid on concrete floor for inspection, close-up professional photography'],
  ['guide-signs-sump-content.webp', 'Plumber testing old sump pump in open pit showing worn components, running diagnostic with flashlight, professional service photography, Toronto basement'],

  // toronto-basement-flooding-subsidy
  ['guide-flooding-subsidy-hero.webp', 'Backwater valve being professionally installed in Toronto basement main drain line, plumber visible working in open access pit, documentary construction photography'],
  ['guide-flooding-subsidy-content.webp', 'Completed backwater valve installation in Toronto main drain showing new valve, cleanout access cap and pipe labeling, professional plumbing photography'],

  // underground-plumbing-during-underpinning
  ['guide-underground-plumbing-hero.webp', 'Licensed plumber installing new white PVC drain lines in open basement trench during Toronto underpinning project, visible pipe layout and fittings, professional construction photography'],
  ['guide-underground-plumbing-content.webp', 'New bathroom rough-in with white PVC toilet flange and shower drain stub positioned in open basement floor before concrete slab pour, photorealistic construction photography'],

  // underpinning-legal-basement-apartment-toronto
  ['guide-underpinning-legal-apt-hero.webp', 'Toronto semi-detached home with legal basement apartment side entrance, clean exterior, professional real estate photography, afternoon lighting, attractive curb appeal'],
  ['guide-underpinning-legal-apt-content.webp', 'Bright legal basement apartment interior showing full ceiling height living area, egress windows with natural light, modern finishes, professional real estate photography'],

  // underpinning-semi-detached-toronto
  ['guide-semi-detached-hero.webp', 'Row of Toronto Victorian semi-detached brick homes on residential street showing shared party walls, mature trees, professional real estate photography, golden hour'],
  ['guide-semi-detached-content.webp', 'Underpinning crew carefully working in Toronto semi-detached basement adjacent to shared party wall with protective shoring boards installed, safety first, construction photography'],

  // underpinning-vs-bench-footing
  ['guide-vs-bench-hero.webp', 'Concrete bench footing being formed and poured in Toronto basement showing stepped ledge construction method, workers visible, construction documentary photography'],
  ['guide-vs-bench-content.webp', 'Toronto basement showing completed bench footing perimeter ledge with new lower floor level visible, clean concrete work, wide angle construction photography'],

  // waterproofing-during-underpinning
  ['guide-waterproofing-underpinning-hero.webp', 'Combined waterproofing and underpinning crew working in Toronto basement with open perimeter trench, drain channel installation underway while underpinning pins are visible, documentary photography'],
  ['guide-waterproofing-underpinning-content.webp', 'Interior drain channel and dimple membrane being installed simultaneously with underpinning work in Toronto basement, organized professional construction site'],

  // what-to-expect-basement-underpinning
  ['guide-what-to-expect-hero.webp', 'Toronto homeowner meeting with underpinning contractor in basement reviewing architectural drawings together, friendly professional consultation, natural lighting, photorealistic'],
  ['guide-what-to-expect-content.webp', 'Pre-construction site protection in Toronto home, furniture removed from basement, floors and walls covered in protective sheeting, organized staging area, documentary photography'],
];

async function post(url, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    };
    const req = https.request(options, (res) => {
      let raw = '';
      res.on('data', (c) => raw += c);
      res.on('end', () => resolve(JSON.parse(raw)));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function get(url) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${API_KEY}` },
    };
    const req = https.request(options, (res) => {
      let raw = '';
      res.on('data', (c) => raw += c);
      res.on('end', () => resolve(JSON.parse(raw)));
    });
    req.on('error', reject);
    req.end();
  });
}

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    proto.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        downloadFile(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        fs.writeFileSync(dest, Buffer.concat(chunks));
        resolve();
      });
    }).on('error', reject);
  });
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function generateImage(filename, prompt) {
  const filepath = path.join(OUTPUT_DIR, filename);

  if (fs.existsSync(filepath) && fs.statSync(filepath).size > 1000) {
    console.log(`  SKIP (exists): ${filename}`);
    return true;
  }

  // Submit task
  const submitRes = await post(`${BASE_URL}/generate`, {
    prompt,
    type: 'TEXTTOIAMGE',
    numImages: 1,
  });

  const taskId = submitRes?.data?.taskId;
  if (!taskId) {
    console.error(`  FAIL submit: ${filename}`, JSON.stringify(submitRes));
    return false;
  }

  // Poll
  const deadline = Date.now() + MAX_WAIT;
  while (Date.now() < deadline) {
    await sleep(POLL_INTERVAL);
    const pollRes = await get(`${BASE_URL}/record-info?taskId=${taskId}`);
    const task = pollRes?.data || pollRes;
    const flag = task?.successFlag;

    if (flag === 1) {
      const imgUrl = task?.response?.resultImageUrl;
      if (!imgUrl) { console.error(`  FAIL no URL: ${filename}`); return false; }
      await downloadFile(imgUrl, filepath);
      console.log(`  OK: ${filename}`);
      return true;
    } else if (flag === 2 || flag === 3) {
      console.error(`  FAIL generate (flag ${flag}): ${filename}`);
      return false;
    }
    // flag 0 = still generating
  }

  console.error(`  TIMEOUT: ${filename}`);
  return false;
}

async function main() {
  console.log(`Generating ${IMAGES.length} guide images → ${OUTPUT_DIR}\n`);
  let success = 0;
  let fail = 0;

  for (let i = 0; i < IMAGES.length; i++) {
    const [filename, prompt] = IMAGES[i];
    console.log(`[${i + 1}/${IMAGES.length}] ${filename}`);
    const ok = await generateImage(filename, prompt);
    if (ok) success++; else fail++;
    if (i < IMAGES.length - 1) await sleep(DELAY_BETWEEN);
  }

  console.log(`\nDone. ${success} generated, ${fail} failed.`);
  if (fail > 0) console.log('Re-run the script to retry failed images (existing files are skipped).');
}

main().catch(console.error);
