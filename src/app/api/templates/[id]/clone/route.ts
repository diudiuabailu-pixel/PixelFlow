import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// POST /api/templates/:id/clone - Clone 模板到用户工作空间
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { id } = await params;
  const template = await prisma.template.findUnique({ where: { id } });
  if (!template) {
    return NextResponse.json({ error: "模板不存在" }, { status: 404 });
  }

  // 创建项目并复制画布数据
  const project = await prisma.project.create({
    data: {
      name: `${template.name} (从模板创建)`,
      description: template.description,
      canvasData: template.canvasData,
      status: "active",
      userId: session.user.id,
    },
  });

  // 更新模板使用计数
  await prisma.template.update({
    where: { id },
    data: { usageCount: { increment: 1 } },
  });

  return NextResponse.json(project);
}
