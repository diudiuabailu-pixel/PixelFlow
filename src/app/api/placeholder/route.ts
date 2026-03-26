import { NextRequest, NextResponse } from "next/server";

// GET /api/placeholder - Dev mode placeholder image generator
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const w = parseInt(searchParams.get("w") || "512");
  const h = parseInt(searchParams.get("h") || "512");
  const text = searchParams.get("text") || "PixelFlow";

  const svg = `
    <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:0.2" />
          <stop offset="100%" style="stop-color:#a855f7;stop-opacity:0.3" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)" />
      <text x="50%" y="45%" font-family="system-ui" font-size="24" fill="#8b5cf6" text-anchor="middle" dominant-baseline="middle">${text}</text>
      <text x="50%" y="55%" font-family="system-ui" font-size="14" fill="#a1a1aa" text-anchor="middle" dominant-baseline="middle">${w}x${h}</text>
    </svg>
  `.trim();

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000",
    },
  });
}
