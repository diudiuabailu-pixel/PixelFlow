"use client";

import { useState, useEffect, useCallback } from "react";
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
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { fetchGenerations } from "@/lib/api";

interface GenerationItem {
  id: string;
  type: string;
  prompt: string;
  model: string;
  status: string;
  outputUrl: string | null;
  createdAt: string;
}

const typeFilters = ["全部", "图像", "视频"];
const statusFilters = ["全部", "成功", "失败"];

export default function HistoryPage() {
  const [typeFilter, setTypeFilter] = useState("全部");
  const [statusFilter, setStatusFilter] = useState("全部");
  const [searchQuery, setSearchQuery] = useState("");
  const [records, setRecords] = useState<GenerationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const typeMap: Record<string, string> = { 图像: "image", 视频: "video" };
  const statusMap: Record<string, string> = { 成功: "success", 失败: "failed" };

  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      const data = (await fetchGenerations({
        type: typeMap[typeFilter],
        status: statusMap[statusFilter],
      })) as GenerationItem[];
      setRecords(data);
    } catch {
      // not logged in
    } finally {
      setLoading(false);
    }
  }, [typeFilter, statusFilter]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const filtered = records.filter(
    (r) => !searchQuery || r.prompt.includes(searchQuery)
  );

  const statusConfig: Record<string, { icon: typeof CheckCircle; color: string; label: string; variant: "success" | "destructive" | "secondary" }> = {
    success: { icon: CheckCircle, color: "text-green-500", label: "成功", variant: "success" },
    failed: { icon: XCircle, color: "text-red-500", label: "失败", variant: "destructive" },
    pending: { icon: Clock, color: "text-yellow-500", label: "生成中", variant: "secondary" },
    running: { icon: Clock, color: "text-yellow-500", label: "生成中", variant: "secondary" },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">生成历史</h1>
          <p className="mt-1 text-sm text-gray-500">查看和管理所有生成记录</p>
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

      {loading ? (
        <div className="mt-20 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
        </div>
      ) : (
        <>
          <div className="mt-8 space-y-4">
            {filtered.map((record) => {
              const status = statusConfig[record.status] ?? statusConfig.pending;
              return (
                <div
                  key={record.id}
                  className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm"
                >
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gradient-to-br from-violet-50 to-purple-100">
                    {record.type === "image" ? (
                      <Image className="h-8 w-8 text-violet-300" />
                    ) : (
                      <Video className="h-8 w-8 text-violet-300" />
                    )}
                  </div>
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
                        {new Date(record.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
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
              <p className="mt-4 text-gray-500">
                {records.length === 0 ? "还没有生成记录" : "没有匹配的记录"}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
