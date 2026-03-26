import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET /api/generations - 获取生成历史
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type"); // image | video
  const status = searchParams.get("status"); // success | failed | pending
  const projectId = searchParams.get("projectId");
  const limit = parseInt(searchParams.get("limit") || "50");

  const generations = await prisma.generation.findMany({
    where: {
      userId: session.user.id,
      ...(type ? { type } : {}),
      ...(status ? { status } : {}),
      ...(projectId ? { projectId } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return NextResponse.json(generations);
}
