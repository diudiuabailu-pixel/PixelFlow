import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET /api/user/credits - 获取当前用户积分信息
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      credits: true,
      plan: true,
      _count: {
        select: {
          generations: true,
          projects: true,
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "用户不存在" }, { status: 404 });
  }

  const planLimits: Record<string, number> = {
    free: 50,
    pro: 500,
    pro_plus: 2000,
  };

  return NextResponse.json({
    credits: user.credits,
    plan: user.plan,
    maxCredits: planLimits[user.plan] || 50,
    totalGenerations: user._count.generations,
    totalProjects: user._count.projects,
  });
}
