import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/explore - 获取公开画廊作品（成功的生成记录）
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const q = searchParams.get("q");
  const limit = parseInt(searchParams.get("limit") || "40");

  // 查询成功的生成记录作为公开作品
  const generations = await prisma.generation.findMany({
    where: {
      status: "success",
      outputUrl: { not: null },
      ...(category && category !== "全部"
        ? { type: category === "视频" ? "video" : "image" }
        : {}),
      ...(q
        ? {
            OR: [
              { prompt: { contains: q } },
              { model: { contains: q } },
            ],
          }
        : {}),
    },
    include: {
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  const works = generations.map((gen) => ({
    id: gen.id,
    title: gen.prompt.length > 20 ? gen.prompt.slice(0, 20) + "..." : gen.prompt,
    prompt: gen.prompt,
    author: gen.user.name || gen.user.email.split("@")[0],
    thumbnail: gen.outputUrl,
    category: gen.type === "video" ? "视频" : "图像",
    model: gen.model,
    createdAt: gen.createdAt,
  }));

  return NextResponse.json(works);
}
