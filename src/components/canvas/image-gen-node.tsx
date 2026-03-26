"use client";

import { Handle, Position, type NodeProps, useReactFlow } from "@xyflow/react";
import { Image, Play, Loader2 } from "lucide-react";
import { useCanvasStore } from "@/lib/canvas-store";

export function ImageGenNode({ id, data }: NodeProps) {
  const d = data as { label: string; model: string; status: string };
  const { getNode, getEdges } = useReactFlow();
  const status = useCanvasStore((s) => s.nodeStatuses[id] ?? d.status);
  const runGeneration = useCanvasStore((s) => s.runGeneration);

  const statusColors: Record<string, string> = {
    idle: "bg-gray-400",
    running: "bg-yellow-400 animate-pulse",
    success: "bg-green-400",
    failed: "bg-red-400",
  };

  function handleRun() {
    // Find connected input node to get prompt
    const edges = getEdges();
    const inputEdge = edges.find((e) => e.target === id);
    let prompt = "A beautiful image";
    if (inputEdge) {
      const inputNode = getNode(inputEdge.source);
      if (inputNode?.data) {
        prompt = (inputNode.data as { value?: string }).value || prompt;
      }
    }

    runGeneration({
      nodeId: id,
      type: "image",
      prompt,
      model: d.model,
    });
  }

  const isRunning = status === "running";

  return (
    <div className="w-56 rounded-xl border-2 border-violet-300 bg-white shadow-sm">
      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !border-2 !border-violet-400 !bg-white"
      />
      <div className="flex items-center justify-between rounded-t-xl bg-violet-50 px-3 py-2">
        <div className="flex items-center gap-2">
          <Image className="h-4 w-4 text-violet-600" />
          <span className="text-xs font-semibold text-violet-700">{d.label}</span>
        </div>
        <div className={`h-2 w-2 rounded-full ${statusColors[status]}`} />
      </div>
      <div className="space-y-2 p-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">模型</span>
          <span className="font-medium text-gray-700">{d.model}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">尺寸</span>
          <span className="font-medium text-gray-700">1024x1024</span>
        </div>
        <button
          onClick={handleRun}
          disabled={isRunning}
          className="flex w-full items-center justify-center gap-1 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-700 disabled:opacity-50"
        >
          {isRunning ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Play className="h-3 w-3" />
          )}
          {isRunning ? "生成中..." : "运行"}
        </button>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !border-2 !border-violet-400 !bg-white"
      />
    </div>
  );
}
