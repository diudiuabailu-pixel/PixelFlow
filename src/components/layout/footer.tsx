import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Logo size={32} className="rounded-lg" />
              <span className="text-lg font-bold text-gray-900">PixelFlow</span>
            </Link>
            <p className="mt-3 text-sm text-gray-500">
              AI 原生的视觉创作工作台
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">产品</h3>
            <ul className="mt-3 space-y-2">
              <li><Link href="/explore" className="text-sm text-gray-500 hover:text-gray-700">Explore</Link></li>
              <li><Link href="/templates" className="text-sm text-gray-500 hover:text-gray-700">Templates</Link></li>
              <li><Link href="/pricing" className="text-sm text-gray-500 hover:text-gray-700">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">资源</h3>
            <ul className="mt-3 space-y-2">
              <li><Link href="#" className="text-sm text-gray-500 hover:text-gray-700">帮助中心</Link></li>
              <li><Link href="#" className="text-sm text-gray-500 hover:text-gray-700">API 文档</Link></li>
              <li><Link href="#" className="text-sm text-gray-500 hover:text-gray-700">更新日志</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">关于</h3>
            <ul className="mt-3 space-y-2">
              <li><Link href="#" className="text-sm text-gray-500 hover:text-gray-700">关于我们</Link></li>
              <li><Link href="#" className="text-sm text-gray-500 hover:text-gray-700">隐私政策</Link></li>
              <li><Link href="#" className="text-sm text-gray-500 hover:text-gray-700">服务条款</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 text-center">
          <p className="text-sm text-gray-400">&copy; 2026 PixelFlow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
