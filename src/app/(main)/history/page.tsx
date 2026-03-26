"use client";

import { useState } from "react";
import {
  Search,
  Download,
  RefreshCw,
  Image,
  Video,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockHistory } from "@/lib/mock-data";

const typeFilters = ["全部", "图像", "视频"];
const statusFilters = ["全部", "成功", "失败"];

export default function HistoryPage() {
  const [typeFilter, setTypeFilter] = useState("全部");
  const [statusFilter, setStatusFilter] = useState("全部");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = mockHistory.filter((record) => {
    const matchType =
      typeFilter === "全部" ||
      (typeFilter === "图像" && record.type === "image") ||
      (typeFilter === "视频" && record.type === "video");
    const matchStatus =
      statusFilter === "全部" ||
      (statusFilter === "成功" && record.status === "success") ||
      (statusFilter === "失败" && record.status === "failed");
    const matchSearch =
      !searchQuery || record.prompt.includes(searchQuery);
    return matchType && matchStatus && matchSearch;
  });

  const statusConfig = {
    success: { icon: CheckCircle, color: "text-green-500", label: "成功", variant: "success" as const },
    failed: { icon: XCircle, color: "text-red-500", label: "失败", variant: "destructive" as const },
    pending: { icon: Clock, color: "text-yellow-500", label: "生成中", variant: "secondary" as const },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">生成历史</h1>
          <p className="mt-1 text-sm text-gray-500">
            查看和管理所有生成记录
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="搜索 Prompt..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">类型:</span>
          {typeFilters.map((f) => (
            <Button
              key={f}
              variant={typeFilter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setTypeFilter(f)}
            >
              {f}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">状态:</span>
          {statusFilters.map((f) => (
            <Button
              key={f}
              variant={statusFilter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(f)}
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      {/* History List */}
      <div className="mt-8 space-y-4">
        {filtered.map((record) => {
          const status = statusConfig[record.status];
          return (
            <div
              key={record.id}
              className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm"
            >
              {/* Preview */}
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gradient-to-br from-violet-50 to-purple-100">
                {record.type === "image" ? (
                  <Image className="h-8 w-8 text-violet-300" />
                ) : (
                  <Video className="h-8 w-8 text-violet-300" />
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">
                  {record.prompt}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {record.model}
                  </Badge>
                  <Badge variant={status.variant} className="text-xs">
                    <status.icon className={`mr-1 h-3 w-3 ${status.color}`} />
                    {status.label}
                  </Badge>
                  <span className="text-xs text-gray-400">
                    {record.createdAt}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex shrink-0 gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <RefreshCw className="h-3.5 w-3.5" />
                  重新生成
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Download className="h-3.5 w-3.5" />
                  下载
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="mt-20 text-center">
          <Sparkles className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-4 text-gray-500">没有匹配的生成记录</p>
        </div>
      )}
    </div>
  );
}
