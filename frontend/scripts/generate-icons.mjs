/**
 * EOF Digital Library — App Icon Generator
 * ─────────────────────────────────────────
 * Converts public/icon.svg → PNG icons for all required platforms.
 *
 * Usage:
 *   npm install --save-dev sharp       (one-time setup)
 *   node scripts/generate-icons.mjs
 *
 * Output → public/icons/icon-{size}.png
 */

import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = resolve(__dirname, '..');
const SVG_PATH  = resolve(ROOT, 'public', 'icon.svg');
const OUT_DIR   = resolve(ROOT, 'public', 'icons');

mkdirSync(OUT_DIR, { recursive: true });

const SIZES = [
  // ── Favicon / browser ──────────────────────────────────────────────
  { size: 16,   name: 'icon-16'   },
  { size: 32,   name: 'icon-32'   },
  { size: 48,   name: 'icon-48'   },

  // ── Android / PWA ──────────────────────────────────────────────────
  { size: 72,   name: 'icon-72'   },
  { size: 96,   name: 'icon-96'   },
  { size: 128,  name: 'icon-128'  },
  { size: 144,  name: 'icon-144'  },
  { size: 192,  name: 'icon-192'  },  // Maskable — PWA home screen
  { size: 256,  name: 'icon-256'  },
  { size: 512,  name: 'icon-512'  },  // PWA splash

  // ── iOS / iPadOS ───────────────────────────────────────────────────
  { size: 20,   name: 'icon-20'   },  // Notification @1x
  { size: 40,   name: 'icon-40'   },  // Notification @2x / Spotlight @1x
  { size: 58,   name: 'icon-58'   },  // Settings @2x (iPhone)
  { size: 60,   name: 'icon-60'   },  // Home screen @1x
  { size: 80,   name: 'icon-80'   },  // Spotlight @2x
  { size: 87,   name: 'icon-87'   },  // Settings @3x
  { size: 120,  name: 'icon-120'  },  // Home screen @2x (iPhone)
  { size: 152,  name: 'icon-152'  },  // Home screen @2x (iPad)
  { size: 167,  name: 'icon-167'  },  // Home screen @2x (iPad Pro)
  { size: 180,  name: 'icon-180'  },  // Home screen @3x (iPhone)
  { size: 1024, name: 'icon-1024' },  // App Store submission ← required

  // ── macOS ──────────────────────────────────────────────────────────
  { size: 16,   name: 'mac-16'    },
  { size: 32,   name: 'mac-32'    },
  { size: 64,   name: 'mac-64'    },
  { size: 128,  name: 'mac-128'   },
  { size: 256,  name: 'mac-256'   },
  { size: 512,  name: 'mac-512'   },
  { size: 1024, name: 'mac-1024'  },

  // ── Windows ────────────────────────────────────────────────────────
  { size: 44,   name: 'win-44'    },
  { size: 50,   name: 'win-50'    },
  { size: 150,  name: 'win-150'   },
  { size: 310,  name: 'win-310'   },
];

const svgBuffer = readFileSync(SVG_PATH);

let passed = 0, failed = 0;

for (const { size, name } of SIZES) {
  const out = resolve(OUT_DIR, `${name}.png`);
  try {
    await sharp(svgBuffer)
      .resize(size, size, { fit: 'contain', background: { r: 13, g: 13, b: 13, alpha: 1 } })
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toFile(out);
    console.log(`  ✓  ${name}.png  (${size}×${size})`);
    passed++;
  } catch (err) {
    console.error(`  ✗  ${name}.png — ${err.message}`);
    failed++;
  }
}

console.log(`\n  Generated ${passed} icons${failed ? `, ${failed} failed` : ''} → public/icons/`);
