"use client";

import { Handle, Position, type NodeProps, useReactFlow } from "@xyflow/react";
import { Type } from "lucide-react";
import { useCallback } from "react";

export function TextInputNode({ id, data }: NodeProps) {
  const { updateNodeData } = useReactFlow();
  const d = data as { label: string; value: string };

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateNodeData(id, { value: e.target.value });
    },
    [id, updateNodeData]
  );

  return (
    <div className="w-56 rounded-xl border-2 border-blue-300 bg-white shadow-sm">
      <div className="flex items-center gap-2 rounded-t-xl bg-blue-50 px-3 py-2">
        <Type className="h-4 w-4 text-blue-600" />
        <span className="text-xs font-semibold text-blue-700">{d.label}</span>
      </div>
      <div className="p-3">
        <textarea
          className="w-full resize-none rounded-lg border border-gray-200 p-2 text-xs placeholder:text-gray-400 focus:border-blue-300 focus:outline-none"
          rows={3}
          placeholder="输入 Prompt..."
          value={d.value || ""}
          onChange={onChange}
        />
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !border-2 !border-blue-400 !bg-white"
      />
    </div>
  );
}
