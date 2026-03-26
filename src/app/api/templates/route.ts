import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/templates - 获取模板列表
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const search = searchParams.get("q");

  const templates = await prisma.template.findMany({
    where: {
      ...(category && category !== "全部" ? { category } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search } },
              { description: { contains: search } },
              { tags: { contains: search } },
            ],
          }
        : {}),
    },
    orderBy: { usageCount: "desc" },
  });

  // Parse JSON fields for client
  const parsed = templates.map((t) => ({
    ...t,
    models: JSON.parse(t.models),
    tags: JSON.parse(t.tags),
  }));

  return NextResponse.json(parsed);
}
