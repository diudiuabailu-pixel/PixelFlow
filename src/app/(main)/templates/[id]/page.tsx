import Link from "next/link";
import { ArrowLeft, Copy, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockTemplates } from "@/lib/mock-data";

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const template = mockTemplates.find((t) => t.id === id);

  if (!template) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-gray-500">模板不存在</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/templates"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="h-4 w-4" />
        返回模板库
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-5">
        {/* Preview */}
        <div className="lg:col-span-3">
          <div className="aspect-video overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-violet-50 to-purple-100">
            <div className="flex h-full items-center justify-center">
              <Sparkles className="h-16 w-16 text-violet-200" />
            </div>
          </div>
          <div className="mt-6">
            <h3 className="font-semibold text-gray-900">输出样例</h3>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center"
                >
                  <Sparkles className="h-6 w-6 text-gray-300" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="lg:col-span-2">
          <Badge>{template.category}</Badge>
          <h1 className="mt-3 text-2xl font-bold text-gray-900">
            {template.name}
          </h1>
          <p className="mt-2 text-gray-600">{template.description}</p>

          <div className="mt-6 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">适用场景</h3>
              <p className="mt-1 text-sm text-gray-700">
                {template.tags.join("、")}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">使用模型</h3>
              <div className="mt-1 flex gap-1.5">
                {template.models.map((m) => (
                  <Badge key={m} variant="secondary">
                    {m}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">输入说明</h3>
              <p className="mt-1 text-sm text-gray-700">
                输入文字描述或上传参考图片，调整参数后即可生成
              </p>
            </div>
          </div>

          <div className="mt-8">
            <Link href="/workspace">
              <Button size="lg" className="w-full gap-2">
                <Copy className="h-4 w-4" />
                Clone 到工作空间
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
