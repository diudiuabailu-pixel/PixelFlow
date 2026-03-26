import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getProvider } from "@/lib/models/registry";

// POST /api/generate - 发起生成任务
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { type, prompt, model, params, projectId } = await req.json();

  if (!type || !prompt || !model) {
    return NextResponse.json(
      { error: "缺少必要参数: type, prompt, model" },
      { status: 400 }
    );
  }

  // 获取模型提供者
  const provider = getProvider(model);
  if (!provider) {
    return NextResponse.json(
      { error: `模型不可用: ${model}` },
      { status: 400 }
    );
  }

  // 预检额度
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user || user.credits < provider.creditCost) {
    return NextResponse.json(
      {
        error: "积分不足",
        required: provider.creditCost,
        current: user?.credits ?? 0,
      },
      { status: 402 }
    );
  }

  // 创建生成记录
  const generation = await prisma.generation.create({
    data: {
      type,
      prompt,
      model,
      params: JSON.stringify(params || {}),
      status: "running",
      creditCost: provider.creditCost,
      userId: session.user.id,
      projectId: projectId || null,
    },
  });

  // 执行生成（异步但在本请求中等待，MVP 阶段简化处理）
  try {
    let result;
    if (type === "image" && provider.generateImage) {
      result = await provider.generateImage({
        prompt,
        ...params,
      });
    } else if (type === "video" && provider.generateVideo) {
      result = await provider.generateVideo({
        prompt,
        ...params,
      });
    } else {
      throw new Error(`模型 ${model} 不支持 ${type} 类型生成`);
    }

    if (result.success) {
      // 扣减积分 + 更新记录
      await prisma.$transaction([
        prisma.generation.update({
          where: { id: generation.id },
          data: {
            status: "success",
            outputUrl: result.outputUrl,
            creditCost: result.creditCost,
          },
        }),
        prisma.user.update({
          where: { id: session.user.id },
          data: { credits: { decrement: result.creditCost } },
        }),
      ]);

      return NextResponse.json({
        id: generation.id,
        status: "success",
        outputUrl: result.outputUrl,
        creditCost: result.creditCost,
        creditsRemaining: user.credits - result.creditCost,
      });
    } else {
      // 生成失败，不扣积分
      await prisma.generation.update({
        where: { id: generation.id },
        data: { status: "failed", errorMsg: result.error },
      });

      return NextResponse.json(
        {
          id: generation.id,
          status: "failed",
          error: result.error,
        },
        { status: 500 }
      );
    }
  } catch (err) {
    await prisma.generation.update({
      where: { id: generation.id },
      data: {
        status: "failed",
        errorMsg: err instanceof Error ? err.message : "unknown error",
      },
    });

    return NextResponse.json(
      {
        id: generation.id,
        status: "failed",
        error: err instanceof Error ? err.message : "生成失败",
      },
      { status: 500 }
    );
  }
}
