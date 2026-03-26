import Link from "next/link";
import {
  User,
  CreditCard,
  Clock,
  Zap,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">个人中心</h1>

      {/* Profile Card */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-100">
            <User className="h-8 w-8 text-violet-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">创作者</h2>
            <p className="text-sm text-gray-500">user@example.com</p>
            <Badge className="mt-1">Free Plan</Badge>
          </div>
        </div>
      </div>

      {/* Credits */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100">
              <Zap className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">剩余积分</p>
              <p className="text-sm text-gray-500">本月重置日：下月 1 日</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-violet-600">35</p>
            <p className="text-sm text-gray-400">/ 50</p>
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
          <div className="h-full w-[70%] rounded-full bg-violet-500" />
        </div>
        <div className="mt-4 flex gap-3">
          <Link href="/pricing" className="flex-1">
            <Button variant="outline" className="w-full gap-1">
              <ArrowRight className="h-4 w-4" />
              升级套餐
            </Button>
          </Link>
          <Button className="flex-1 gap-1">
            <CreditCard className="h-4 w-4" />
            充值积分
          </Button>
        </div>
      </div>

      {/* Usage Stats */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="flex items-center gap-2 font-semibold text-gray-900">
          <Clock className="h-5 w-5 text-gray-400" />
          使用统计
        </h3>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-500">本月生成图片</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">12</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-500">本月生成视频</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">1</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-500">项目数</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">3</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-500">消耗积分</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">15</p>
          </div>
        </div>
      </div>

      {/* Account */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="font-semibold text-gray-900">账户设置</h3>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
            <span className="text-sm text-gray-700">修改密码</span>
            <Button variant="ghost" size="sm">修改</Button>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
            <span className="text-sm text-gray-700">通知设置</span>
            <Button variant="ghost" size="sm">设置</Button>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
            <span className="text-sm text-red-600">删除账户</span>
            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
              删除
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
