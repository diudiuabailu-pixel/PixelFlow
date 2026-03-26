"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Download, Sparkles } from "lucide-react";

export function OutputNode({ data }: NodeProps) {
  const d = data as { label: string; type: string; url: string | null };

  return (
    <div className="w-56 rounded-xl border-2 border-green-300 bg-white shadow-sm">
      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !border-2 !border-green-400 !bg-white"
      />
      <div className="flex items-center gap-2 rounded-t-xl bg-green-50 px-3 py-2">
        <Download className="h-4 w-4 text-green-600" />
        <span className="text-xs font-semibold text-green-700">{d.label}</span>
      </div>
      <div className="p-3">
        <div className="flex aspect-square items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
          {d.url ? (
            <img src={d.url} alt="Output" className="h-full w-full rounded-lg object-cover" />
          ) : (
            <div className="text-center">
              <Sparkles className="mx-auto h-8 w-8 text-gray-300" />
              <p className="mt-1 text-xs text-gray-400">等待生成</p>
            </div>
          )}
        </div>
        <button className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50">
          <Download className="h-3 w-3" />
          下载
        </button>
      </div>
    </div>
  );
}
