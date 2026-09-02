/**
 * One-off: populates the `brand-assets` collection from the curated,
 * final-deliverable subset of the Drive brand folder (excludes raw AI
 * image-generation exploration, per-digit masking working files, and
 * unsorted stock photography — see CLAUDE.md for the full brand folder
 * inventory). Large same-category folders (icons, numerals, logo format
 * packs, LinkedIn assets, A4 letterhead, presentation backgrounds) are
 * bundled into single zip downloads instead of one row per file — far
 * more convenient to actually download than hundreds of individual rows.
 *
 * Run once via: set -a && source .env.local && set +a && npx tsx payload/upload-brand-assets.ts
 */
import { getPayload } from "payload";
import { execFileSync } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import config from "../payload.config";
import type { BrandAsset } from "./payload-types";

const BRAND_DIR =
  "/Users/omer/Library/CloudStorage/GoogleDrive-contact@omersilverman.com/My Drive/01_Workflow/H2O/REAL NUMBERS/REAL NUMBERS BRANDING";

type ZipEntry = {
  kind: "zip";
  title: string;
  category: BrandAsset["category"];
  description?: string;
  /** Source directory to zip (relative to BRAND_DIR). */
  sourceDir: string;
  /** Only include files matching these extensions (lowercase, no dot). Omit for all files. */
  extensions?: string[];
  /** Exclude files whose basename matches any of these (case-insensitive substrings). */
  exclude?: string[];
  zipName: string;
};

type FileEntry = {
  kind: "file";
  title: string;
  category: BrandAsset["category"];
  description?: string;
  /** Source file (relative to BRAND_DIR). */
  sourceFile: string;
};

type Entry = ZipEntry | FileEntry;

const DEFAULT_EXCLUDE = [".ds_store", ".rtf", ".gdoc", ".gsheet", ".gslides", ".tmp"];

const ENTRIES: Entry[] = [
  // Logos & Marks
  { kind: "zip", title: "Logo Marks — SVG Pack", category: "logos", sourceDir: "LOGO/SVG", zipName: "RN-Logo-Marks-SVG.zip", description: "Wordmark, symbol, badge, and star marks in SVG." },
  { kind: "zip", title: "Logo Marks — PNG Pack", category: "logos", sourceDir: "LOGO/PNG", zipName: "RN-Logo-Marks-PNG.zip", description: "Wordmark, symbol, badge, and star marks in PNG." },
  { kind: "zip", title: "Logo Marks — JPG Pack", category: "logos", sourceDir: "LOGO/JPG", zipName: "RN-Logo-Marks-JPG.zip", description: "Wordmark, symbol, badge, and star marks in JPG." },
  { kind: "zip", title: "Logo Animation Pack", category: "logos", sourceDir: "LOGO/ANIMATION", zipName: "RN-Logo-Animation.zip", description: "Animated counter wordmark — SVG + GIF." },
  { kind: "zip", title: "Logo Animation — Video Renders", category: "logos", sourceDir: "LOGO/VIDEO SAGIR", zipName: "RN-Logo-Animation-Video.zip", description: "Rendered MP4 versions of the counter animation." },

  // Iconography
  { kind: "zip", title: "Brand Icon Set — SVG (4 colors)", category: "icons", sourceDir: "BRAND ELEMENTS/ICONS", extensions: ["svg"], zipName: "RN-Icon-Set-SVG.zip", description: "48 icons × 4 brand colors (blue, red, black, off-white)." },

  // Numerals & Compositions
  { kind: "zip", title: "Numeral Badges — SVG", category: "numerals", sourceDir: "BRAND ELEMENTS/NUMBERS/SINGLE NUMBER", extensions: ["svg"], zipName: "RN-Numeral-Badges-SVG.zip", description: "Digit badges 0–9, 4 colors × 5 styles (solid, outline, circled variants)." },
  { kind: "zip", title: "Number Compositions — SVG", category: "numerals", sourceDir: "BRAND ELEMENTS/NUMBERS/COMPOSITIONS", zipName: "RN-Number-Compositions-SVG.zip", description: "Abstract line-art number compositions used as decorative texture." },

  // Colors
  { kind: "zip", title: "Brand Color Reference Pack", category: "colors", sourceDir: "COLORS", zipName: "RN-Brand-Colors.zip", description: "PDF reference, Adobe .ase swatch, .ai file, and SVG swatches." },

  // Fonts
  { kind: "file", title: "TASA Orbiter — Font Family", category: "fonts", sourceFile: "FONTS/ENG/tasa-orbiter.zip", description: "Primary brand typeface (Latin), all weights, TTF/WOFF/WOFF2." },

  // Photography
  { kind: "file", title: "Website Photography — 01", category: "photography", sourceFile: "BRAND ELEMENTS/IMAGERY/WEBSITE IMAGES/RN_IMG_001.jpg" },

  // Animations
  { kind: "zip", title: "Number Morph Animation — SVG Pack", category: "animations", sourceDir: "BRAND ELEMENTS/ANIMATIONS/RN ANIMATION", zipName: "RN-Number-Morph-Animation.zip" },
  { kind: "file", title: "Composition Animation — MP4", category: "animations", sourceFile: "BRAND ELEMENTS/ANIMATIONS/rn-comp-1.mp4" },

  // Templates & Documents
  { kind: "file", title: "Proposal Template — PDF", category: "documents", sourceFile: "BRAND DELIVERABLES/Price Proposal Template - RN/Real Numbers - Proposal Template.pdf" },
  { kind: "file", title: "Proposal Template — Word", category: "documents", sourceFile: "BRAND DELIVERABLES/Price Proposal Template - RN/Real Numbers - Proposal Template.docx" },
  { kind: "file", title: "Presentation Template — PDF", category: "documents", sourceFile: "BRAND DELIVERABLES/PRESENTATION/RN PRES TEMPLATE.pdf" },
  { kind: "zip", title: "Presentation — Background Images", category: "documents", sourceDir: "BRAND DELIVERABLES/PRESENTATION/BACKGROUNDS", zipName: "RN-Presentation-Backgrounds.zip" },
  { kind: "zip", title: "A4 Letterhead — Full Pack", category: "documents", sourceDir: "BRAND DELIVERABLES/A4 PAPER", exclude: [".tmp"], zipName: "RN-A4-Letterhead.zip", description: "PDF, JPG, Illustrator source, and watermark assets." },

  // Social & Email Signatures
  { kind: "file", title: "Email Signature — Word Template", category: "social", sourceFile: "BRAND DELIVERABLES/EMAIL SIGNATURE/RN EMAIL SIGNATURE TEMPLATE.docx" },
  { kind: "file", title: "Email Signature — Animated Logo (GIF)", category: "social", sourceFile: "BRAND DELIVERABLES/EMAIL SIGNATURE/RN_LOGO_A_COUNTER_4S_ANIMATION_CUSTOM_NUMBERS_UPRIGHT.gif" },
  { kind: "zip", title: "Outlook Signature — Install Pack", category: "social", sourceDir: "OUTLOOK SIGNATURE TEMPLATE", exclude: ["real numbers outlook signature/"], zipName: "RN-Outlook-Signature.zip", description: "Ready-to-install Outlook signature (HTML + install instructions)." },
  { kind: "zip", title: "LinkedIn Assets — Full Pack", category: "social", sourceDir: "BRAND DELIVERABLES/SOCIAL ASSETS/LINKEDIN", zipName: "RN-LinkedIn-Assets.zip", description: "Profile logos, page covers, employee covers, and badge." },
];

function shouldExclude(filePath: string, extraExclude?: string[]) {
  const lower = filePath.toLowerCase();
  return [...DEFAULT_EXCLUDE, ...(extraExclude ?? [])].some((needle) => lower.includes(needle));
}

function listFilesRecursive(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFilesRecursive(full));
    else out.push(full);
  }
  return out;
}

function buildZip(entry: ZipEntry): string {
  const sourceAbs = path.join(BRAND_DIR, entry.sourceDir);
  const allFiles = listFilesRecursive(sourceAbs);
  const relFiles = allFiles
    .map((f) => path.relative(sourceAbs, f))
    .filter((rel) => !shouldExclude(rel, entry.exclude))
    .filter((rel) => !entry.extensions || entry.extensions.includes(path.extname(rel).slice(1).toLowerCase()));

  if (relFiles.length === 0) throw new Error(`No files matched for zip: ${entry.title}`);

  const outPath = path.join(os.tmpdir(), `rn-brand-${Date.now()}-${entry.zipName}`);
  if (fs.existsSync(outPath)) fs.rmSync(outPath);
  // -X: no extra file attributes (deterministic-ish), relative paths only.
  execFileSync("zip", ["-X", "-r", outPath, ...relFiles], { cwd: sourceAbs, stdio: "pipe" });
  console.log(`  zipped ${relFiles.length} files -> ${entry.zipName}`);
  return outPath;
}

function mimeFor(filename: string): string {
  const ext = path.extname(filename).slice(1).toLowerCase();
  const map: Record<string, string> = {
    zip: "application/zip",
    pdf: "application/pdf",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    md: "text/markdown",
    gif: "image/gif",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    svg: "image/svg+xml",
    mp4: "video/mp4",
  };
  return map[ext] || "application/octet-stream";
}

async function run() {
  const payload = await getPayload({ config });
  let ok = 0;
  let failed = 0;

  for (const entry of ENTRIES) {
    try {
      let filePath: string;
      let cleanupTemp = false;

      if (entry.kind === "zip") {
        console.log(`Zipping: ${entry.title}`);
        filePath = buildZip(entry);
        cleanupTemp = true;
      } else {
        filePath = path.join(BRAND_DIR, entry.sourceFile);
        if (!fs.existsSync(filePath)) throw new Error(`File not found: ${entry.sourceFile}`);
      }

      const buffer = fs.readFileSync(filePath);
      const filename = entry.kind === "zip" ? entry.zipName : path.basename(entry.sourceFile);

      await payload.create({
        collection: "brand-assets",
        data: { title: entry.title, category: entry.category, description: entry.description },
        file: { data: buffer, mimetype: mimeFor(filename), name: filename, size: buffer.length },
      });

      console.log(`✓ Uploaded: ${entry.title} (${(buffer.length / 1024 / 1024).toFixed(1)}MB)`);
      ok++;

      if (cleanupTemp) fs.rmSync(filePath);
    } catch (err) {
      console.error(`✗ Failed: ${entry.title} —`, err instanceof Error ? err.message : err);
      failed++;
    }
  }

  console.log(`\nDone. ${ok} uploaded, ${failed} failed.`);
  process.exit(failed > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
