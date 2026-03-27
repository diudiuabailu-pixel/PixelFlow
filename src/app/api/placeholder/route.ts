import { NextRequest, NextResponse } from "next/server";

// Deterministic pseudo-random from seed string
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function rand(seed: number, i: number): number {
  const x = Math.sin(seed + i * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

const palettes = [
  ["#7C3AED", "#A78BFA", "#C4B5FD", "#EDE9FE", "#4C1D95"], // violet
  ["#EC4899", "#F472B6", "#FBCFE8", "#FDF2F8", "#9D174D"], // pink
  ["#F59E0B", "#FBBF24", "#FDE68A", "#FFFBEB", "#92400E"], // amber
  ["#10B981", "#34D399", "#A7F3D0", "#ECFDF5", "#065F46"], // emerald
  ["#3B82F6", "#60A5FA", "#BFDBFE", "#EFF6FF", "#1E3A8A"], // blue
  ["#EF4444", "#F87171", "#FECACA", "#FEF2F2", "#991B1B"], // red
  ["#8B5CF6", "#C084FC", "#E9D5FF", "#FAF5FF", "#5B21B6"], // purple
  ["#06B6D4", "#22D3EE", "#A5F3FC", "#ECFEFF", "#155E75"], // cyan
];

function generateAbstract(w: number, h: number, seed: number, pal: string[]): string {
  let shapes = "";
  const count = 5 + (seed % 8);
  for (let i = 0; i < count; i++) {
    const r = rand(seed, i);
    const cx = r * w;
    const cy = rand(seed, i + 50) * h;
    const rx = 30 + rand(seed, i + 100) * Math.min(w, h) * 0.4;
    const ry = 30 + rand(seed, i + 150) * Math.min(w, h) * 0.3;
    const color = pal[i % pal.length];
    const opacity = 0.3 + rand(seed, i + 200) * 0.5;
    shapes += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${color}" opacity="${opacity}"/>`;
  }
  return shapes;
}

function generateGeometric(w: number, h: number, seed: number, pal: string[]): string {
  let shapes = "";
  const cols = 4 + (seed % 3);
  const rows = 3 + (seed % 3);
  const cellW = w / cols;
  const cellH = h / rows;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      const color = pal[i % pal.length];
      const opacity = 0.2 + rand(seed, i) * 0.6;
      const x = c * cellW;
      const y = r * cellH;
      if (rand(seed, i + 300) > 0.5) {
        shapes += `<rect x="${x + 4}" y="${y + 4}" width="${cellW - 8}" height="${cellH - 8}" rx="8" fill="${color}" opacity="${opacity}"/>`;
      } else {
        shapes += `<circle cx="${x + cellW / 2}" cy="${y + cellH / 2}" r="${Math.min(cellW, cellH) / 2 - 6}" fill="${color}" opacity="${opacity}"/>`;
      }
    }
  }
  return shapes;
}

function generateWaves(w: number, h: number, seed: number, pal: string[]): string {
  let shapes = "";
  const layers = 4 + (seed % 4);
  for (let i = 0; i < layers; i++) {
    const y0 = h * 0.3 + i * (h * 0.15);
    const amp = 20 + rand(seed, i + 400) * 40;
    const freq = 1 + rand(seed, i + 500) * 3;
    let d = `M0,${y0}`;
    for (let x = 0; x <= w; x += 10) {
      const y = y0 + Math.sin((x / w) * Math.PI * freq + i) * amp;
      d += ` L${x},${y}`;
    }
    d += ` L${w},${h} L0,${h} Z`;
    const color = pal[i % pal.length];
    const opacity = 0.3 + rand(seed, i + 600) * 0.4;
    shapes += `<path d="${d}" fill="${color}" opacity="${opacity}"/>`;
  }
  return shapes;
}

function generateLandscape(w: number, h: number, seed: number, pal: string[]): string {
  let shapes = "";
  // Sky gradient
  shapes += `<rect width="${w}" height="${h * 0.6}" fill="${pal[2]}" opacity="0.5"/>`;
  // Sun/moon
  const sunX = w * 0.3 + rand(seed, 700) * w * 0.4;
  shapes += `<circle cx="${sunX}" cy="${h * 0.25}" r="${30 + rand(seed, 701) * 30}" fill="${pal[1]}" opacity="0.7"/>`;
  // Mountains
  for (let i = 0; i < 3; i++) {
    const peakX = w * 0.1 + rand(seed, 710 + i) * w * 0.8;
    const peakY = h * 0.3 + rand(seed, 720 + i) * h * 0.15;
    const baseW = 100 + rand(seed, 730 + i) * 200;
    shapes += `<polygon points="${peakX},${peakY} ${peakX - baseW},${h * 0.7} ${peakX + baseW},${h * 0.7}" fill="${pal[4]}" opacity="${0.4 + i * 0.15}"/>`;
  }
  // Ground
  shapes += `<rect y="${h * 0.65}" width="${w}" height="${h * 0.35}" fill="${pal[4]}" opacity="0.3"/>`;
  return shapes;
}

// GET /api/placeholder?w=512&h=512&style=abstract&seed=hello
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const w = parseInt(searchParams.get("w") || "512");
  const h = parseInt(searchParams.get("h") || "512");
  const style = searchParams.get("style") || "abstract";
  const seedStr = searchParams.get("seed") || "default";
  const text = searchParams.get("text");

  const seed = hash(seedStr);
  const pal = palettes[seed % palettes.length];

  // Background
  const bgColor = pal[3];

  let shapes = "";
  switch (style) {
    case "geometric":
      shapes = generateGeometric(w, h, seed, pal);
      break;
    case "waves":
      shapes = generateWaves(w, h, seed, pal);
      break;
    case "landscape":
      shapes = generateLandscape(w, h, seed, pal);
      break;
    default:
      shapes = generateAbstract(w, h, seed, pal);
  }

  // Optional text overlay
  const textSvg = text
    ? `<text x="50%" y="92%" font-family="system-ui" font-size="14" fill="${pal[4]}" text-anchor="middle" dominant-baseline="middle" opacity="0.6">${text}</text>`
    : "";

  const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${bgColor}"/>
  ${shapes}
  ${textSvg}
</svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000",
    },
  });
}
