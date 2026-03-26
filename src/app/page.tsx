import Link from "next/link";
import {
  Zap,
  Layers,
  Play,
  Image,
  Video,
  ArrowRight,
  Sparkles,
  Workflow,
  Copy,
  ShoppingBag,
  Film,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Layers,
    title: "多模型聚合",
    description: "一个平台接入多个 AI 图像和视频模型，无需切换工具",
  },
  {
    icon: Workflow,
    title: "节点式工作流",
    description: "拖拽连线构建创作流程，从输入到输出一气呵成",
  },
  {
    icon: Copy,
    title: "模板复用",
    description: "从模板起步，一键 Clone，不必从零开始",
  },
  {
    icon: Sparkles,
    title: "无限画布",
    description: "在无限画布上自由创作，管理你的所有节点和流程",
  },
];

const useCases = [
  {
    icon: ShoppingBag,
    title: "电商运营",
    description: "批量生成商品主图、详情页、广告素材",
  },
  {
    icon: Film,
    title: "内容创作者",
    description: "短视频封面、YouTube 缩略图、社交媒体内容",
  },
  {
    icon: Palette,
    title: "设计 / 影视",
    description: "分镜预览、概念设计、风格探索",
  },
];

const capabilities = [
  { icon: Image, label: "AI 图像生成" },
  { icon: Video, label: "AI 视频生成" },
  { icon: Workflow, label: "工作流编排" },
];

const faqs = [
  {
    q: "PixelFlow 和 Midjourney / ComfyUI 有什么不同？",
    a: "PixelFlow 聚合多个模型，提供低门槛的工作流和模板系统。不需要学复杂节点，也不限于单一模型。",
  },
  {
    q: "免费用户可以使用哪些功能？",
    a: "免费用户每月获得 50 积分，可体验图像生成、模板使用和基础工作流。",
  },
  {
    q: "支持哪些 AI 模型？",
    a: "目前支持 FLUX.1、SDXL 等图像模型和 Kling 等视频模型，更多模型持续接入中。",
  },
  {
    q: "我的创作数据安全吗？",
    a: "所有数据使用 HTTPS 加密传输，生成结果仅本人可见（除非主动分享）。",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">PixelFlow</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">登录</Button>
            </Link>
            <Link href="/login">
              <Button size="sm">免费开始</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-purple-50" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-sm text-violet-700">
              <Sparkles className="h-4 w-4" />
              AI 原生视觉创作工作台
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              一个画布，所有模型
              <br />
              <span className="text-violet-600">完整工作流</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              从脚本到画面，从模板到工作流。不再在 5~10 个 AI 工具之间切换，
              PixelFlow 让你在浏览器里完成从创意到成品的全部过程。
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/login">
                <Button size="lg" className="gap-2">
                  免费开始创作 <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/explore">
                <Button variant="outline" size="lg">
                  浏览作品
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="border-y border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16">
            {capabilities.map((cap) => (
              <div key={cap.label} className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100">
                  <cap.icon className="h-5 w-5 text-violet-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">{cap.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">核心能力</h2>
            <p className="mt-4 text-gray-600">
              PixelFlow 不只是生成工具，而是完整的视觉创作系统
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-gray-200 bg-white p-8 transition-shadow hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100">
                  <feature.icon className="h-6 w-6 text-violet-600" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">使用场景</h2>
            <p className="mt-4 text-gray-600">
              无论你是电商运营、内容创作者还是设计师，PixelFlow 都能帮你提效
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-3">
            {useCases.map((uc) => (
              <div key={uc.title} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600">
                  <uc.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{uc.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{uc.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Preview */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              丰富模板，即刻开始
            </h2>
            <p className="mt-4 text-gray-600">
              从模板起步，无需从空白画布开始，一键 Clone 到你的工作空间
            </p>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {[
              "电商商品主图",
              "社交媒体封面",
              "短视频片头",
              "品牌广告海报",
              "分镜脚本可视化",
              "AI 写真照",
              "Logo 概念设计",
              "产品宣传视频",
            ].map((name) => (
              <div
                key={name}
                className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-gray-200 bg-gray-100 transition-all hover:shadow-md"
              >
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-violet-50 to-purple-100">
                  <Play className="h-8 w-8 text-violet-300" />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <p className="text-sm font-medium text-white">{name}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/templates">
              <Button variant="outline" size="lg" className="gap-2">
                查看所有模板 <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="bg-violet-600 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            准备好开始创作了吗？
          </h2>
          <p className="mt-4 text-lg text-violet-100">
            免费注册即可获得 50 积分，体验 AI 图像和视频生成
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="bg-white text-violet-600 hover:bg-violet-50">
                免费开始
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                查看定价
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            常见问题
          </h2>
          <div className="mt-12 space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900">{faq.q}</h3>
                <p className="mt-2 text-sm text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-violet-600">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-900">PixelFlow</span>
          </div>
          <div className="mt-4 flex items-center justify-center gap-6 text-sm text-gray-500">
            <Link href="/pricing" className="hover:text-gray-700">定价</Link>
            <Link href="#" className="hover:text-gray-700">隐私政策</Link>
            <Link href="#" className="hover:text-gray-700">服务条款</Link>
          </div>
          <p className="mt-4 text-sm text-gray-400">
            &copy; 2026 PixelFlow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
