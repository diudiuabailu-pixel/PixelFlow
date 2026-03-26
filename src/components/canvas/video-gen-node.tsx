"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Video, Play } from "lucide-react";

export function VideoGenNode({ data }: NodeProps) {
  const d = data as { label: string; model: string; status: string };
  const statusColors: Record<string, string> = {
    idle: "bg-gray-400",
    running: "bg-yellow-400 animate-pulse",
    success: "bg-green-400",
    failed: "bg-red-400",
  };

  return (
    <div className="w-56 rounded-xl border-2 border-orange-300 bg-white shadow-sm">
      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !border-2 !border-orange-400 !bg-white"
      />
      <div className="flex items-center justify-between rounded-t-xl bg-orange-50 px-3 py-2">
        <div className="flex items-center gap-2">
          <Video className="h-4 w-4 text-orange-600" />
          <span className="text-xs font-semibold text-orange-700">{d.label}</span>
        </div>
        <div className={`h-2 w-2 rounded-full ${statusColors[d.status]}`} />
      </div>
      <div className="space-y-2 p-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">模型</span>
          <span className="font-medium text-gray-700">{d.model}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">时长</span>
          <span className="font-medium text-gray-700">4 秒</span>
        </div>
        <button className="flex w-full items-center justify-center gap-1 rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-orange-700">
          <Play className="h-3 w-3" />
          运行
        </button>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !border-2 !border-orange-400 !bg-white"
      />
    </div>
  );
}
