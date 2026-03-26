import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// POST /api/projects/:id/duplicate - 复制项目
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { id } = await params;
  const source = await prisma.project.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!source) {
    return NextResponse.json({ error: "项目不存在" }, { status: 404 });
  }

  const project = await prisma.project.create({
    data: {
      name: `${source.name} (副本)`,
      description: source.description,
      canvasData: source.canvasData,
      status: "draft",
      userId: session.user.id,
    },
  });

  return NextResponse.json(project);
}
