"use client";

import { useCallback, useRef, use } from "react";
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  Panel,
  type Connection,
  type NodeTypes,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Link from "next/link";
import {
  ArrowLeft,
  Play,
  Save,
  Type,
  Image,
  Video,
  Download,
  Zap,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { TextInputNode } from "@/components/canvas/text-input-node";
import { ImageGenNode } from "@/components/canvas/image-gen-node";
import { VideoGenNode } from "@/components/canvas/video-gen-node";
import { OutputNode } from "@/components/canvas/output-node";

const nodeTypes: NodeTypes = {
  textInput: TextInputNode,
  imageGen: ImageGenNode,
  videoGen: VideoGenNode,
  output: OutputNode,
};

const initialNodes: Node[] = [
  {
    id: "input-1",
    type: "textInput",
    position: { x: 50, y: 200 },
    data: { label: "文本输入", value: "" },
  },
  {
    id: "gen-1",
    type: "imageGen",
    position: { x: 400, y: 150 },
    data: { label: "图像生成", model: "FLUX.1", status: "idle" },
  },
  {
    id: "output-1",
    type: "output",
    position: { x: 750, y: 200 },
    data: { label: "输出", type: "image", url: null },
  },
];

const initialEdges = [
  { id: "e1", source: "input-1", target: "gen-1", animated: true },
  { id: "e2", source: "gen-1", target: "output-1", animated: true },
];

const nodeCategories = [
  { type: "textInput", label: "文本输入", icon: Type },
  { type: "imageGen", label: "图像生成", icon: Image },
  { type: "videoGen", label: "视频生成", icon: Video },
  { type: "output", label: "输出", icon: Download },
];

export default function CanvasPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const idCounter = useRef(10);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
    },
    [setEdges]
  );

  function addNode(type: string) {
    idCounter.current += 1;
    const id = `node-${idCounter.current}`;
    const dataMap: Record<string, Record<string, unknown>> = {
      textInput: { label: "文本输入", value: "" },
      imageGen: { label: "图像生成", model: "FLUX.1", status: "idle" },
      videoGen: { label: "视频生成", model: "Kling", status: "idle" },
      output: { label: "输出", type: "image", url: null },
    };
    setNodes((nds) => [
      ...nds,
      {
        id,
        type,
        position: { x: 300 + Math.random() * 200, y: 100 + Math.random() * 300 },
        data: dataMap[type] || { label: type },
      },
    ]);
  }

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Toolbar */}
      <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4">
        <div className="flex items-center gap-3">
          <Link
            href="/workspace"
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex h-7 w-7 items-center justify-center rounded bg-violet-600">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-gray-900">
            项目 {projectId}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Save className="h-3.5 w-3.5" />
            保存
          </Button>
          <Button size="sm" className="gap-1">
            <Play className="h-3.5 w-3.5" />
            运行全部
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Node Panel */}
        <aside className="w-56 shrink-0 overflow-y-auto border-r border-gray-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            节点
          </p>
          <div className="mt-3 space-y-2">
            {nodeCategories.map((cat) => (
              <button
                key={cat.type}
                onClick={() => addNode(cat.type)}
                className="flex w-full items-center gap-2 rounded-lg border border-gray-200 bg-white p-3 text-sm font-medium text-gray-700 transition-colors hover:border-violet-300 hover:bg-violet-50"
              >
                <cat.icon className="h-4 w-4 text-violet-500" />
                {cat.label}
              </button>
            ))}
          </div>
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              模型
            </p>
            <div className="mt-3 space-y-2">
              {["FLUX.1", "SDXL", "Kling"].map((model) => (
                <div
                  key={model}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm"
                >
                  <div className="h-2 w-2 rounded-full bg-green-400" />
                  {model}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Center: Canvas */}
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            className="bg-gray-50"
          >
            <Controls />
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
            <Panel position="bottom-center">
              <div className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs text-gray-500 shadow-sm">
                节点: {nodes.length} | 连线: {edges.length}
              </div>
            </Panel>
          </ReactFlow>
        </div>

        {/* Right: Config Panel */}
        <aside className="w-64 shrink-0 overflow-y-auto border-l border-gray-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            配置
          </p>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-500">模型选择</label>
              <div className="mt-1 flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm">
                FLUX.1
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">图片尺寸</label>
              <div className="mt-1 grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-violet-300 bg-violet-50 px-3 py-1.5 text-center text-xs font-medium text-violet-700">
                  1024x1024
                </div>
                <div className="rounded-lg border border-gray-200 px-3 py-1.5 text-center text-xs text-gray-500">
                  768x512
                </div>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">生成步数</label>
              <input
                type="range"
                min={10}
                max={50}
                defaultValue={30}
                className="mt-1 w-full"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>10</span>
                <span>30</span>
                <span>50</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">运行状态</label>
              <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-500">
                就绪 — 点击「运行全部」开始生成
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
