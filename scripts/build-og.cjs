// Builds the link-preview image (Discord, Twitter/X, iMessage...) at public/og.jpg.
//
// The home page backdrop photo, tinted violet and darkened like the site hero,
// with the UKCW mark floating in the middle and the brand wave lines along the bottom.
//
//   npm run og           (or: node scripts/build-og.cjs)
//
// Re-run after changing public/brand/hero-scene.webp or public/brand/logo.png.

const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");

const root = path.join(__dirname, "..");
const W = 1200;
const H = 630;
const LOGO = 300; // rendered logo size in px

/** The logo PNG has a dark background baked in; lift just the mark (white type, violet bird) off it. */
async function keyedLogo() {
  const size = 160 * 3; // upscale first so the keyed edges stay smooth
  const { data, info } = await sharp(path.join(root, "public/brand/logo.png"))
    .resize(size, size, { kernel: "lanczos3" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const smooth = (e0, e1, x) => {
    const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
    return t * t * (3 - 2 * t);
  };

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    const sat = max ? (max - min) / max : 0;
    // Bright pixels (white CW and waves) or vivid violet (the bird) stay; the dark backdrop goes.
    const keep = Math.max(smooth(0.34, 0.58, lum), smooth(0.35, 0.55, max / 255) * smooth(0.4, 0.62, sat));
    data[i + 3] = Math.round(255 * keep);
  }

  return sharp(data, { raw: info }).resize(LOGO, LOGO).png().toBuffer();
}

(async () => {
  // 1. Photo, cropped to 1.91:1 and dimmed.
  const photo = await sharp(path.join(root, "public/brand/hero-scene.webp"))
    .resize(W, H, { fit: "cover", position: "centre" })
    .modulate({ brightness: 0.72, saturation: 0.85 })
    .toBuffer();

  // 2. Violet wash: a fully tinted copy laid over the photo at partial opacity.
  const tinted = await sharp(photo).tint("#6a4ae0").ensureAlpha(0.42).png().toBuffer();

  // 3. Light and shade: overall dim, vignette, glow behind the logo, fade at the bottom, brand waves.
  const overlay = Buffer.from(`
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="vignette" cx="50%" cy="46%" r="75%">
          <stop offset="0%" stop-color="#0c0b10" stop-opacity="0.15"/>
          <stop offset="60%" stop-color="#0c0b10" stop-opacity="0.55"/>
          <stop offset="100%" stop-color="#0c0b10" stop-opacity="0.9"/>
        </radialGradient>
        <radialGradient id="glow" cx="50%" cy="46%" r="30%">
          <stop offset="0%" stop-color="#8e6cff" stop-opacity="0.55"/>
          <stop offset="55%" stop-color="#8e6cff" stop-opacity="0.18"/>
          <stop offset="100%" stop-color="#8e6cff" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="55%" stop-color="#0c0b10" stop-opacity="0"/>
          <stop offset="100%" stop-color="#0c0b10" stop-opacity="0.85"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="#0c0b10" fill-opacity="0.25"/>
      <rect width="100%" height="100%" fill="url(#vignette)"/>
      <rect width="100%" height="100%" fill="url(#glow)"/>
      <rect width="100%" height="100%" fill="url(#fade)"/>
      <g fill="none" stroke="#8e6cff" stroke-width="2">
        <path d="M0 548C180 500 390 494 600 532s430 60 600 14" stroke-opacity="0.75"/>
        <path d="M0 570C180 522 390 516 600 554s430 60 600 14" stroke-opacity="0.45"/>
        <path d="M0 592C180 544 390 538 600 576s430 60 600 14" stroke-opacity="0.22"/>
      </g>
    </svg>`);

  // 4. Logo with a soft shadow so it lifts off the scene.
  const logo = await keyedLogo();
  const shadow = await sharp(logo).ensureAlpha().linear([0, 0, 0, 0.7], [0, 0, 0, 0]).blur(14).png().toBuffer();
  const left = Math.round((W - LOGO) / 2);
  const top = Math.round(H * 0.46 - LOGO / 2);

  const jpg = await sharp(photo)
    .composite([
      { input: tinted },
      { input: overlay },
      { input: shadow, left, top: top + 8 },
      { input: logo, left, top },
    ])
    .jpeg({ quality: 86, mozjpeg: true })
    .toBuffer();

  const out = path.join(root, "public/og.jpg");
  fs.writeFileSync(out, jpg);
  console.log(`public/og.jpg  ${W}x${H}  ${(jpg.length / 1024).toFixed(0)} KB`);
})();
