/**
 * One-off: builds the 3 icon "download all" packs shown at the top of the
 * Brand Identity page's Iconography section, and uploads them to the
 * `brand-assets` collection (titles must match BrandIdentityView.tsx's
 * `iconPacks` lookup exactly):
 *   - "Icon Set — Static SVG (as shown)"        — the 48 files as-is, zipped
 *   - "Icon Set — Animated SVG Pack"             — same icons, each with the
 *     matching CSS @keyframes from brand-icon-animations.ts baked in via an
 *     embedded <style>, so the animation plays when the SVG is opened on
 *     its own (not just inside this admin page)
 *   - "Icon Set — Animated GIF Pack (Transparent)" — one transparent
 *     animated GIF per icon (24 frames / 4s loop), each frame rendered by
 *     sharp from a static SVG snapshot with the recipe's transform baked
 *     into the frame (sharp/librsvg has no CSS-animation support, so the
 *     GIF path can't reuse the animated-SVG files directly), then encoded
 *     with gifenc. GIF only supports 1-bit alpha, so anti-aliased edges
 *     are binarized — an inherent GIF limitation, not a bug.
 *
 * Run once via: set -a && source .env.local && set +a && npx tsx payload/build-icon-download-packs.ts
 */
import { getPayload } from "payload";
import { execFileSync } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import sharp from "sharp";
import gifenc from "gifenc";
import config from "../payload.config";
import { ICON_ANIMATIONS, ANIMATION_KEYFRAMES, sampleSvgTransform } from "./brand-icon-animations";

const ICON_DIR = path.join(process.cwd(), "public/icons/brand");
const ICON_COUNT = 48;
const GIF_FRAMES = 24;
const GIF_FRAME_DELAY_MS = Math.round(4000 / GIF_FRAMES);
const GIF_SIZE = 160;

function iconPath(n: number) {
  return path.join(ICON_DIR, `RN_ICON_BLUE_${n}.svg`);
}

function parseIcon(svg: string) {
  const viewBoxMatch = svg.match(/viewBox="([\d.\s-]+)"/);
  const [, , vbW, vbH] = (viewBoxMatch?.[1] ?? "0 0 100 100").split(/\s+/).map(Number);
  const inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
  return { inner, width: vbW, height: vbH, viewBox: viewBoxMatch?.[1] ?? `0 0 ${vbW} ${vbH}` };
}

function buildAnimatedSvg(n: number): string {
  const original = fs.readFileSync(iconPath(n), "utf8");
  const { inner, viewBox } = parseIcon(original);
  const recipe = ICON_ANIMATIONS[n] ?? "pulse";
  const style = `<style>@keyframes a{${ANIMATION_KEYFRAMES[recipe]}} .a{transform-box:fill-box;transform-origin:center;animation:a 4s ease-in-out infinite;}</style>`;
  return `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">${style}<g class="a">${inner}</g></svg>`;
}

async function buildAnimatedGif(n: number): Promise<Buffer> {
  const { quantize, applyPalette, GIFEncoder } = gifenc;
  const original = fs.readFileSync(iconPath(n), "utf8");
  const { inner, width, height } = parseIcon(original);
  const recipe = ICON_ANIMATIONS[n] ?? "pulse";
  const cx = width / 2;
  const cy = height / 2;

  const gif = GIFEncoder();

  for (let f = 0; f < GIF_FRAMES; f++) {
    const t = f / GIF_FRAMES;
    const { transform, opacity } = sampleSvgTransform(recipe, t, cx, cy);
    const frameSvg = `<svg width="${GIF_SIZE}" height="${GIF_SIZE}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg"><g transform="${transform}" opacity="${opacity}">${inner}</g></svg>`;

    const { data, info } = await sharp(Buffer.from(frameSvg))
      .resize(GIF_SIZE, GIF_SIZE, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const palette = quantize(data, 64, { format: "rgba4444", oneBitAlpha: true });
    const index = applyPalette(data, palette, "rgba4444");
    const transparentIndex = palette.findIndex((c: number[]) => c[3] === 0);

    gif.writeFrame(index, info.width, info.height, {
      palette,
      delay: GIF_FRAME_DELAY_MS,
      transparent: transparentIndex !== -1,
      transparentIndex: transparentIndex !== -1 ? transparentIndex : 0,
      repeat: 0,
    });
  }

  gif.finish();
  return Buffer.from(gif.bytes());
}

function zipDir(sourceDir: string, zipName: string): Buffer {
  const outPath = path.join(os.tmpdir(), `rn-icon-pack-${Date.now()}-${zipName}`);
  if (fs.existsSync(outPath)) fs.rmSync(outPath);
  const files = fs.readdirSync(sourceDir);
  execFileSync("zip", ["-X", "-r", outPath, ...files], { cwd: sourceDir, stdio: "pipe" });
  const buf = fs.readFileSync(outPath);
  fs.rmSync(outPath);
  return buf;
}

async function upload(payload: Awaited<ReturnType<typeof getPayload>>, title: string, description: string, filename: string, buffer: Buffer) {
  // Replace if it already exists, so re-running this script updates the pack.
  const existing = await payload.find({ collection: "brand-assets", where: { title: { equals: title } }, limit: 1 });
  if (existing.docs[0]) {
    await payload.delete({ collection: "brand-assets", id: existing.docs[0].id });
  }
  await payload.create({
    collection: "brand-assets",
    data: { title, category: "icons", description },
    file: { data: buffer, mimetype: "application/zip", name: filename, size: buffer.length },
  });
  console.log(`✓ Uploaded: ${title} (${(buffer.length / 1024 / 1024).toFixed(2)}MB)`);
}

async function run() {
  const payload = await getPayload({ config });

  // 1. Static SVG, as shown on the page.
  console.log("Building static SVG pack...");
  const staticZip = zipDir(ICON_DIR, "RN-Icon-Set-Static.zip");
  await upload(payload, "Icon Set — Static SVG (as shown)", "The 48 blue icons exactly as shown on this page.", "RN-Icon-Set-Static.zip", staticZip);

  // 2. Animated SVG pack — self-contained, animation embedded per file.
  console.log("Building animated SVG pack...");
  const animSvgDir = fs.mkdtempSync(path.join(os.tmpdir(), "rn-icon-anim-svg-"));
  for (let n = 1; n <= ICON_COUNT; n++) {
    fs.writeFileSync(path.join(animSvgDir, `RN-Icon-${n}.svg`), buildAnimatedSvg(n));
  }
  const animSvgZip = zipDir(animSvgDir, "RN-Icon-Set-Animated.zip");
  fs.rmSync(animSvgDir, { recursive: true });
  await upload(payload, "Icon Set — Animated SVG Pack", "Same 48 icons with the looping animation embedded — plays when opened directly, no extra CSS needed.", "RN-Icon-Set-Animated.zip", animSvgZip);

  // 3. Animated GIF pack — transparent background.
  console.log("Building animated GIF pack (this takes a while)...");
  const gifDir = fs.mkdtempSync(path.join(os.tmpdir(), "rn-icon-anim-gif-"));
  for (let n = 1; n <= ICON_COUNT; n++) {
    const buf = await buildAnimatedGif(n);
    fs.writeFileSync(path.join(gifDir, `RN-Icon-${n}.gif`), buf);
    if (n % 8 === 0) console.log(`  ...${n}/${ICON_COUNT} GIFs rendered`);
  }
  const gifZip = zipDir(gifDir, "RN-Icon-Set-Animated-GIF.zip");
  fs.rmSync(gifDir, { recursive: true });
  await upload(payload, "Icon Set — Animated GIF Pack (Transparent)", "One transparent animated GIF per icon, 4s loop.", "RN-Icon-Set-Animated-GIF.zip", gifZip);

  console.log("\nDone.");
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
