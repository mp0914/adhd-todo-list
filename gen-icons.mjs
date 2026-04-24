// Generates PWA icons: 512x512, 192x192, 180x180 (Apple)
import sharp from 'sharp';
import { mkdir } from 'fs/promises';

await mkdir('icons', { recursive: true });

// Full-bleed paw print icon — designed to fill the entire square
// Safe zone (inner 80%) covers the paw; background bleeds to edges
function makeSVG(size) {
  const s = size;
  const cx = s / 2;

  // Scale factor from 512 base
  const k = s / 512;

  // Paw colours
  const bg = '#0f0e17';
  const pad = '#ff8906';
  const padInner = '#c8660a';

  // Main central pad
  const mpx = cx, mpy = 310 * k;
  const mprx = 112 * k, mpry = 96 * k;

  // 4 toe pads (top of main pad)
  const toes = [
    { x: 168 * k, y: 190 * k, rx: 62 * k, ry: 54 * k },
    { x: 232 * k, y: 158 * k, rx: 56 * k, ry: 50 * k },
    { x: 292 * k, y: 158 * k, rx: 56 * k, ry: 50 * k },
    { x: 356 * k, y: 190 * k, rx: 62 * k, ry: 54 * k },
  ];

  const toeEls = toes.map(t =>
    `<ellipse cx="${t.x.toFixed(1)}" cy="${t.y.toFixed(1)}" rx="${t.rx.toFixed(1)}" ry="${t.ry.toFixed(1)}" fill="${pad}"/>
     <ellipse cx="${(t.x - t.rx * 0.18).toFixed(1)}" cy="${(t.y - t.ry * 0.25).toFixed(1)}" rx="${(t.rx * 0.38).toFixed(1)}" ry="${(t.ry * 0.32).toFixed(1)}" fill="${padInner}" opacity="0.55"/>`
  ).join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  <rect width="${s}" height="${s}" fill="${bg}"/>
  <!-- toe pads -->
  ${toeEls}
  <!-- main pad -->
  <ellipse cx="${mpx.toFixed(1)}" cy="${mpy.toFixed(1)}" rx="${mprx.toFixed(1)}" ry="${mpry.toFixed(1)}" fill="${pad}"/>
  <ellipse cx="${(mpx - mprx * 0.18).toFixed(1)}" cy="${(mpy - mpry * 0.22).toFixed(1)}" rx="${(mprx * 0.4).toFixed(1)}" ry="${(mpry * 0.34).toFixed(1)}" fill="${padInner}" opacity="0.5"/>
</svg>`;
}

const sizes = [
  { size: 512, file: 'icons/icon-512.png' },
  { size: 192, file: 'icons/icon-192.png' },
  { size: 180, file: 'icons/icon-180.png' }, // Apple touch icon
];

for (const { size, file } of sizes) {
  const svg = Buffer.from(makeSVG(size));
  await sharp(svg).png().toFile(file);
  console.log(`✓  ${file}`);
}

console.log('\nDone! Icons saved to /icons/');
