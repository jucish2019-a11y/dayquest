/**
 * DayQuest Icon Generator - Node.js
 * Generates 192x192 and 512x512 PNG icons with no dependencies
 * Run: node generate-icons.js
 */

const fs = require("fs");
const zlib = require("zlib");

// Minimal PNG encoder (no dependencies)
function createPNG(width, height, pixels) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;  // bit depth
  ihdrData[9] = 6;  // color type: RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdr = makeChunk("IHDR", ihdrData);

  // IDAT chunk (image data)
  const rawRows = [];
  for (let y = 0; y < height; y++) {
    const row = Buffer.alloc(width * 4 + 1);
    row[0] = 0; // filter: none
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const pi = y * width * 4 + x * 4;
      row[i + 1] = pixels[pi];     // R
      row[i + 2] = pixels[pi + 1]; // G
      row[i + 3] = pixels[pi + 2]; // B
      row[i + 4] = pixels[pi + 3]; // A
    }
    rawRows.push(row);
  }
  const rawData = Buffer.concat(rawRows);
  const compressed = zlib.deflateSync(rawData);
  const idat = makeChunk("IDAT", compressed);

  // IEND chunk
  const iend = makeChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

function makeChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  const typeBuf = Buffer.from(type, "ascii");

  const crcData = Buffer.concat([typeBuf, data]);
  const crc = crc32(crcData);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc, 0);

  return Buffer.concat([length, typeBuf, data, crcBuf]);
}

// CRC32 table
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

// Draw the DayQuest icon
function drawIcon(size) {
  const pixels = Buffer.alloc(size * size * 4);
  const cx = size / 2;
  const cy = size / 2;

  // Helper to set a pixel
  function setPixel(x, y, r, g, b, a) {
    if (x < 0 || x >= size || y < 0 || y >= size) return;
    const i = (y * size + x) * 4;
    pixels[i] = r;
    pixels[i + 1] = g;
    pixels[i + 2] = b;
    pixels[i + 3] = a;
  }

  // Helper: draw filled circle
  function fillCircle(cx2, cy2, radius, r, g, b, a) {
    for (let y = Math.floor(cy2 - radius); y <= Math.ceil(cy2 + radius); y++) {
      for (let x = Math.floor(cx2 - radius); x <= Math.ceil(cx2 + radius); x++) {
        const dx = x - cx2;
        const dy = y - cy2;
        if (dx * dx + dy * dy <= radius * radius) {
          setPixel(x, y, r, g, b, a);
        }
      }
    }
  }

  // Helper: draw rounded rectangle background
  function fillRoundedRect(rx, ry, rw, rh, radius, r, g, b, a) {
    for (let y = Math.floor(ry); y < Math.ceil(ry + rh); y++) {
      for (let x = Math.floor(rx); x < Math.ceil(rx + rw); x++) {
        let inside = false;
        // Main rectangle (excluding corners)
        if (x >= rx + radius && x < rx + rw - radius && y >= ry && y < ry + rh) inside = true;
        if (y >= ry + radius && y < ry + rh - radius && x >= rx && x < rx + rw) inside = true;
        // Corner circles
        const corners = [
          [rx + radius, ry + radius],
          [rx + rw - radius, ry + radius],
          [rx + radius, ry + rh - radius],
          [rx + rw - radius, ry + rh - radius]
        ];
        for (const [ccx, ccy] of corners) {
          const dx = x - ccx;
          const dy = y - ccy;
          if (dx * dx + dy * dy <= radius * radius) inside = true;
        }
        if (inside) setPixel(x, y, r, g, b, a);
      }
    }
  }

  // Draw gradient background
  const padding = size * 0.05;
  const radius = size * 0.18;
  const bgX = padding;
  const bgY = padding;
  const bgW = size - padding * 2;
  const bgH = size - padding * 2;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (x - cx) / (bgW / 2);
      const dy = (y - cy) / (bgH / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= 1) {
        // Gradient from center to edge
        const t = dist;
        const r = Math.round(26 + (13 - 26) * t);
        const g = Math.round(26 + (13 - 26) * t);
        const b = Math.round(46 + (20 - 46) * t);
        setPixel(x, y, r, g, b, 255);
      }
    }
  }

  // Draw rounded rectangle border
  const borderThickness = Math.max(2, size * 0.015);
  const borderColor = [180, 74, 255, Math.round(255 * 0.4)];

  // Outer glow
  const glowSize = Math.max(4, size * 0.04);
  for (let g = glowSize; g >= 1; g--) {
    const alpha = Math.round(255 * 0.15 * (1 - g / glowSize));
    drawRoundedRectOutline(bgX - g, bgY - g, bgW + g * 2, bgH + g * 2, radius + g, 180, 74, 255, alpha);
  }

  // Main border
  drawRoundedRectOutline(bgX, bgY, bgW, bgH, radius, ...borderColor);

  // Draw sword icon in the center
  drawSword(pixels, size, cx, cy, size * 0.55);

  return pixels;
}

function drawRoundedRectOutline(pixels, size, rx, ry, rw, rh, radius, r, g, b, a) {
  for (let y = Math.floor(ry); y < Math.ceil(ry + rh); y++) {
    for (let x = Math.floor(rx); x < Math.ceil(rx + rw); x++) {
      // Check if on the outline
      const inside = isInsideRoundedRect(x, y, rx, ry, rw, rh, radius);
      if (!inside) continue;

      // Check if adjacent to outside
      const neighbors = [[x-1,y],[x+1,y],[x,y-1],[x,y+1]];
      const hasOutside = neighbors.some(([nx, ny]) => !isInsideRoundedRect(nx, ny, rx, ry, rw, rh, radius));
      if (hasOutside) {
        const i = (y * size + x) * 4;
        if (i >= 0 && i < pixels.length - 3) {
          pixels[i] = r;
          pixels[i + 1] = g;
          pixels[i + 2] = b;
          pixels[i + 3] = a;
        }
      }
    }
  }
}

function isInsideRoundedRect(x, y, rx, ry, rw, rh, radius) {
  // Main rectangle areas
  if (x >= rx + radius && x < rx + rw - radius && y >= ry && y < ry + rh) return true;
  if (y >= ry + radius && y < ry + rh - radius && x >= rx && x < rx + rw) return true;

  // Corner circles
  const corners = [
    [rx + radius, ry + radius],
    [rx + rw - radius, ry + radius],
    [rx + radius, ry + rh - radius],
    [rx + rw - radius, ry + rh - radius]
  ];
  for (const [ccx, ccy] of corners) {
    const dx = x - ccx;
    const dy = y - ccy;
    if (dx * dx + dy * dy <= radius * radius) return true;
  }
  return false;
}

function drawSword(pixels, size, cx, cy, swordSize) {
  const s = swordSize / 100;

  function setPixel(x, y, r, g, b, a) {
    const px = Math.round(x);
    const py = Math.round(y);
    if (px < 0 || px >= size || py < 0 || py >= size) return;
    const i = (py * size + px) * 4;
    if (i < 0 || i >= pixels.length - 3) return;
    pixels[i] = r;
    pixels[i + 1] = g;
    pixels[i + 2] = b;
    pixels[i + 3] = a;
  }

  function drawLine(x1, y1, x2, y2, r, g, b, a, thickness) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const steps = Math.ceil(len * 2);

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = x1 + dx * t;
      const y = y1 + dy * t;

      for (let ty = -thickness; ty <= thickness; ty++) {
        for (let tx = -thickness; tx <= thickness; tx++) {
          if (tx * tx + ty * ty <= thickness * thickness) {
            setPixel(x + tx, y + ty, r, g, b, a);
          }
        }
      }
    }
  }

  function fillPolygon(points, r, g, b, a) {
    const minX = Math.floor(Math.min(...points.map(p => p[0])));
    const maxX = Math.ceil(Math.max(...points.map(p => p[0])));
    const minY = Math.floor(Math.min(...points.map(p => p[1])));
    const maxY = Math.ceil(Math.max(...points.map(p => p[1])));

    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        if (pointInPolygon(x, y, points)) {
          setPixel(x, y, r, g, b, a);
        }
      }
    }
  }

  function pointInPolygon(x, y, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0], yi = polygon[i][1];
      const xj = polygon[j][0], yj = polygon[j][1];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) {
        inside = !inside;
      }
    }
    return inside;
  }

  // Blade (silver)
  const bladeThickness = Math.max(2, 8 * s);
  fillPolygon([
    [cx, cy - 40 * s],
    [cx - bladeThickness, cy + 15 * s],
    [cx + bladeThickness, cy + 15 * s]
  ], 224, 224, 232, 255);

  // Blade shine
  fillPolygon([
    [cx, cy - 38 * s],
    [cx - 2 * s, cy - 10 * s],
    [cx, cy - 10 * s]
  ], 255, 255, 255, 40);

  // Crossguard (purple)
  fillPolygon([
    [cx - 25 * s, cy + 15 * s],
    [cx - 25 * s, cy + 22 * s],
    [cx + 25 * s, cy + 22 * s],
    [cx + 25 * s, cy + 15 * s]
  ], 180, 74, 255, 255);

  // Crossguard curve (approximate with thicker line)
  drawLine(cx - 25 * s, cy + 15 * s, cx, cy + 10 * s, 180, 74, 255, 255, Math.max(2, 3 * s));
  drawLine(cx, cy + 10 * s, cx + 25 * s, cy + 15 * s, 180, 74, 255, 255, Math.max(2, 3 * s));

  // Handle (brown)
  const handleThickness = Math.max(2, 6 * s);
  fillPolygon([
    [cx - handleThickness, cy + 22 * s],
    [cx + handleThickness, cy + 22 * s],
    [cx + handleThickness, cy + 40 * s],
    [cx - handleThickness, cy + 40 * s]
  ], 139, 111, 71, 255);

  // Pommel (purple circle)
  const pommelR = Math.max(3, 8 * s);
  for (let y = cy + 44 * s - pommelR; y <= cy + 44 * s + pommelR; y++) {
    for (let x = cx - pommelR; x <= cx + pommelR; x++) {
      const dx = x - cx;
      const dy = y - (cy + 44 * s);
      if (dx * dx + dy * dy <= pommelR * pommelR) {
        setPixel(x, y, 180, 74, 255, 255);
      }
    }
  }
}

// Generate and save
function generate() {
  console.log("Generating DayQuest icons...");

  // 192x192
  const pixels192 = drawIcon(192);
  const png192 = createPNG(192, 192, pixels192);
  fs.writeFileSync("icon-192.png", png192);
  console.log("  icon-192.png created");

  // 512x512
  const pixels512 = drawIcon(512);
  const png512 = createPNG(512, 512, pixels512);
  fs.writeFileSync("icon-512.png", png512);
  console.log("  icon-512.png created");

  console.log("Done! Place both icons in the dayquest root directory.");
}

generate();
