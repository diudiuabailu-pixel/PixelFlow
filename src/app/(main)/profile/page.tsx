"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  User,
  CreditCard,
  Clock,
  Zap,
  ArrowRight,
  LogOut,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchUserCredits } from "@/lib/api";

interface CreditsInfo {
  credits: number;
  plan: string;
  maxCredits: number;
  totalGenerations: number;
  totalProjects: number;
}

const planLabels: Record<string, string> = {
  free: "Free Plan",
  pro: "Pro Plan",
  pro_plus: "Pro+ Plan",
};

export default function ProfilePage() {
  const { data: session } = useSession();
  const [credits, setCredits] = useState<CreditsInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserCredits()
      .then((data) => setCredits(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
      </div>
    );
  }

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
            <h2 className="text-lg font-semibold text-gray-900">
              {session?.user?.name || "创作者"}
            </h2>
            <p className="text-sm text-gray-500">
              {session?.user?.email || "未登录"}
            </p>
            <Badge className="mt-1">
              {planLabels[credits?.plan || "free"] || "Free Plan"}
            </Badge>
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
            <p className="text-3xl font-bold text-violet-600">
              {credits?.credits ?? 0}
            </p>
            <p className="text-sm text-gray-400">
              / {credits?.maxCredits ?? 50}
            </p>
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-violet-500 transition-all"
            style={{
              width: `${Math.min(100, ((credits?.credits ?? 0) / (credits?.maxCredits ?? 50)) * 100)}%`,
            }}
          />
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
            <p className="text-sm text-gray-500">生成次数</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {credits?.totalGenerations ?? 0}
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-500">项目数</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {credits?.totalProjects ?? 0}
            </p>
          </div>
        </div>
      </div>

      {/* Account */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="font-semibold text-gray-900">账户</h3>
        <div className="mt-4">
          <Button
            variant="outline"
            className="w-full gap-2 text-red-500 hover:text-red-600"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="h-4 w-4" />
            退出登录
          </Button>
        </div>
      </div>
    </div>
  );
}
