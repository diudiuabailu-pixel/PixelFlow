import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET /api/projects - 获取当前用户所有项目
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(projects);
}

// POST /api/projects - 创建项目
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { name, description, canvasData } = await req.json();

  const project = await prisma.project.create({
    data: {
      name: name || "新项目",
      description: description || "",
      canvasData: canvasData ? JSON.stringify(canvasData) : "{}",
      userId: session.user.id,
    },
  });

  return NextResponse.json(project);
}
