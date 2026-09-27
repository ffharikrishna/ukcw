// Builds the white-on-dark department logos the site serves.
//
// Sources are the official SVGs in assets/department-logos/. Each one gets a
// recipe below that turns black/dark text white while keeping coloured
// elements, then it's rasterised to a trimmed transparent PNG in
// public/departments/.
//
//   npm run logos            (or: node scripts/build-logos.cjs [preview.png])
//
// After adding or replacing a logo, copy the printed width/height into
// src/lib/departments.ts.

const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");

const srcDir = path.join(__dirname, "..", "assets", "department-logos");
const outDir = path.join(__dirname, "..", "public", "departments");
const BOX = { width: 640, height: 240 }; // 2x the largest size the site renders
const WHITE = "#ffffff";

/**
 * replace     – exact colour swaps inside the SVG (fill/stroke/stop-color).
 * rootFill    – default fill for shapes with none set (they'd otherwise be black).
 * underlay    – white rectangles drawn first, for lettering knocked out of a shape.
 * strip       – regexes for elements to delete, e.g. a white background field.
 * whitenDark  – after rendering, turn near-black neutral pixels white. Used for
 *               files built from masks, where editing colours in the SVG breaks them.
 */
const recipes = {
  met: {}, // Already white lettering on a blue box.
  colp: { replace: { "#211e1e": WHITE } },
  lfb: {
    replace: { "#818a8f": WHITE },
    underlay: [
      [0.06, 0, 66.5, 66.49],
      [75.21, 0, 66.5, 66.49],
      [150.35, 0, 66.5, 66.49],
    ],
  },
  las: { whitenDark: true },
  nca: { rootFill: WHITE },
  nh: { replace: { "#19233e": WHITE, "#011e41": WHITE } },
  rnli: { strip: [/<rect[^>]*fill="#FFFFFF"[^>]*\/>/i], whitenDark: true },
  ctsfo: { whitenDark: true },
  army: { rootFill: WHITE }, // "ARMY / BE THE BEST" has no fill set; the Union Flag is kept.
  iopc: { replace: { "#7f7f7d": WHITE } },
  homeoffice: { rootFill: WHITE }, // Black wordmark has no fill set; the purple bar is kept.
  hmps: { rootFill: WHITE },
};

function applyRecipe(svg, r) {
  for (const [from, to] of Object.entries(r.replace ?? {})) {
    const re = new RegExp(`((?:fill|stroke|stop-color)\\s*[:=]\\s*["']?)${from}\\b`, "gi");
    svg = svg.replace(re, `$1${to}`);
  }
  for (const re of r.strip ?? []) svg = svg.replace(re, "");
  if (r.rootFill) svg = svg.replace(/<svg\b/, `<svg fill="${r.rootFill}"`);
  if (r.underlay) {
    const rects = r.underlay.map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${WHITE}"/>`);
    svg = svg.replace(/(<svg\b[^>]*>)/, `$1${rects.join("")}`);
  }
  return svg;
}

async function whitenDarkPixels(png) {
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    // Dark and roughly grey: black text, outlines, shading. Leaves dark reds/greens alone.
    if (max < 96 && max - min < 40) {
      data[i] = data[i + 1] = data[i + 2] = 255;
    }
  }
  return sharp(data, { raw: info }).png().toBuffer();
}

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const built = [];

  for (const [slug, recipe] of Object.entries(recipes)) {
    const file = path.join(srcDir, `${slug}.svg`);
    if (!fs.existsSync(file)) {
      console.warn(`skip ${slug}: no ${slug}.svg`);
      continue;
    }
    const svg = Buffer.from(applyRecipe(fs.readFileSync(file, "utf8"), recipe));

    const { width = 100, height = 100 } = await sharp(svg).metadata();
    // Render at just enough density to fill the box, not more.
    const scale = Math.min(BOX.width / width, BOX.height / height);
    const density = Math.max(72, Math.min(2400, Math.ceil(72 * scale * 1.5)));

    let png = await sharp(svg, { density }).png().toBuffer();
    if (recipe.whitenDark) png = await whitenDarkPixels(png);
    png = await sharp(png).trim().resize({ ...BOX, fit: "inside" }).png({ compressionLevel: 9 }).toBuffer();

    fs.writeFileSync(path.join(outDir, `${slug}.png`), png);
    const meta = await sharp(png).metadata();
    console.log(`${slug.padEnd(6)} -> ${meta.width}x${meta.height}  ${(png.length / 1024).toFixed(1)} KB`);
    built.push(png);
  }

  const preview = process.argv[2];
  if (!preview) return;

  // Contact sheet on the site background.
  const comps = await Promise.all(
    built.map(async (png, i) => ({
      input: await sharp(png).resize({ width: 220, height: 90, fit: "inside" }).toBuffer(),
      left: 20 + (i % 4) * 250,
      top: 20 + Math.floor(i / 4) * 130,
    })),
  );
  // toBuffer + writeFileSync rather than toFile: libvips can't write past Windows' MAX_PATH.
  const height = 20 + Math.ceil(built.length / 4) * 130;
  const sheet = await sharp({ create: { width: 1020, height, channels: 4, background: "#0c0b10" } })
    .composite(comps)
    .png()
    .toBuffer();
  fs.writeFileSync(preview, sheet);
})();
