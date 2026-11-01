#!/usr/bin/env node
/**
 * Photo pipeline for Betri Bílar.
 *
 *   1. Save photos into /photos-inbox, named after a slot id, e.g. `hero-workshop.jpg`.
 *      Slot ids and what each should show: src/content/photo-slots.json
 *   2. Run `npm run photos`.
 *
 * Each photo is cropped to its slot's aspect ratio (smart crop), given a light, consistent
 * grade (slightly lower saturation, a touch more contrast — no content is changed),
 * resized, and written to public/images/<folder>/<slot id>.jpg.
 * src/content/photo-manifest.json is updated so the website picks the photo up.
 *
 * Optional: `npm run photos -- --no-grade` keeps original colours.
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const inbox = path.join(root, "photos-inbox");
const slots = JSON.parse(await fs.readFile(path.join(root, "src/content/photo-slots.json"), "utf8"));
const manifestPath = path.join(root, "src/content/photo-manifest.json");
const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8").catch(() => "{}"));
const grade = !process.argv.includes("--no-grade");
const MAX_WIDTH = 2400;
const exts = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".tif", ".tiff"];

const files = await fs.readdir(inbox).catch(() => []);
let done = 0;
const unknown = [];

for (const file of files) {
  const ext = path.extname(file).toLowerCase();
  if (!exts.includes(ext)) continue;
  const id = path.basename(file, path.extname(file));
  const slot = slots.find((s) => s.id === id);
  if (!slot) { unknown.push(file); continue; }

  const [aw, ah] = slot.aspect;
  const input = sharp(path.join(inbox, file)).rotate(); // respect EXIF orientation
  const meta = await input.metadata();
  const srcW = meta.autoOrient?.width ?? meta.width;
  const width = Math.min(MAX_WIDTH, srcW ?? MAX_WIDTH);
  const height = Math.round((width * ah) / aw);

  let img = input.resize(width, height, { fit: "cover", position: sharp.strategy.attention });
  if (grade) img = img.modulate({ saturation: 0.86 }).linear(1.07, -7);

  const outDir = path.join(root, "public/images", slot.folder);
  await fs.mkdir(outDir, { recursive: true });
  const outFile = path.join(outDir, `${slot.id}.jpg`);
  await img.clone().jpeg({ quality: 82, mozjpeg: true, progressive: true }).toFile(outFile);

  const blurBuf = await img.clone().resize(16).webp({ quality: 40 }).toBuffer();
  manifest[slot.id] = {
    src: `/images/${slot.folder}/${slot.id}.jpg`,
    width,
    height,
    blur: `data:image/webp;base64,${blurBuf.toString("base64")}`,
  };
  if (width < 1200) console.warn(`! ${file}: only ${width}px wide — may look soft on large screens.`);
  console.log(`✓ ${file} → public/images/${slot.folder}/${slot.id}.jpg (${width}×${height})`);
  done++;
}

await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
if (unknown.length) console.warn(`Skipped (no matching slot id): ${unknown.join(", ")}`);
const missing = slots.filter((s) => !manifest[s.id]).map((s) => s.id);
console.log(`\n${done} photo(s) processed. ${missing.length ? `Still empty: ${missing.join(", ")}` : "All slots filled."}`);
