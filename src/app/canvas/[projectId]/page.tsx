"use client";

import { useCallback, useRef, use, useState, useEffect } from "react";
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  Panel,
  useReactFlow,
  ReactFlowProvider,
  type Connection,
  type NodeTypes,
  type Node,
  type Edge,
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
  Loader2,
  Check,
  PanelLeftOpen,
  PanelRightOpen,
  Settings2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { TextInputNode } from "@/components/canvas/text-input-node";
import { ImageGenNode } from "@/components/canvas/image-gen-node";
import { VideoGenNode } from "@/components/canvas/video-gen-node";
import { OutputNode } from "@/components/canvas/output-node";
import { fetchProject, updateProject } from "@/lib/api";
import { useCanvasStore } from "@/lib/canvas-store";

const nodeTypes: NodeTypes = {
  textInput: TextInputNode,
  imageGen: ImageGenNode,
  videoGen: VideoGenNode,
  output: OutputNode,
};

const defaultNodes: Node[] = [
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

const defaultEdges: Edge[] = [
  { id: "e1", source: "input-1", target: "gen-1", animated: true },
  { id: "e2", source: "gen-1", target: "output-1", animated: true },
];

const nodeCategories = [
  { type: "textInput", label: "文本输入", icon: Type },
  { type: "imageGen", label: "图像生成", icon: Image },
  { type: "videoGen", label: "视频生成", icon: Video },
  { type: "output", label: "输出", icon: Download },
];

const nodeTypeLabels: Record<string, string> = {
  textInput: "文本输入节点",
  imageGen: "图像生成节点",
  videoGen: "视频生成节点",
  output: "输出节点",
};

const modelOptions = ["FLUX.1", "SDXL", "Kling"];
const sizeOptions = ["1024x1024", "768x512", "512x768", "1280x720"];

function CanvasInner({ projectId }: { projectId: string }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(defaultNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(defaultEdges);
  const [projectName, setProjectName] = useState("项目");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [runningAll, setRunningAll] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const idCounter = useRef(10);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { getNodes, getEdges, getNode, updateNodeData } = useReactFlow();
  const runGeneration = useCanvasStore((s) => s.runGeneration);
  const nodeStatuses = useCanvasStore((s) => s.nodeStatuses);

  const selectedNode = selectedNodeId
    ? nodes.find((n) => n.id === selectedNodeId) || null
    : null;

  // Load project on mount
  useEffect(() => {
    async function loadProject() {
      try {
        const project = (await fetchProject(projectId)) as {
          name: string;
          canvasData: string;
        };
        setProjectName(project.name);
        if (project.canvasData && project.canvasData !== "{}") {
          try {
            const canvas = JSON.parse(project.canvasData);
            if (canvas.nodes?.length > 0) {
              setNodes(canvas.nodes);
              setEdges(canvas.edges || []);
              const maxId = canvas.nodes.reduce((max: number, n: Node) => {
                const num = parseInt(n.id.replace(/\D/g, "")) || 0;
                return Math.max(max, num);
              }, 0);
              idCounter.current = maxId + 1;
            }
          } catch {
            // Invalid JSON, use defaults
          }
        }
      } catch {
        // New project or not found, use defaults
      }
      setLoaded(true);
    }
    loadProject();
  }, [projectId, setNodes, setEdges]);

  // Hide sidebars on mobile by default
  useEffect(() => {
    if (window.innerWidth < 768) {
      setLeftOpen(false);
      setRightOpen(false);
    }
  }, []);

  // Auto-save (debounced 3s)
  useEffect(() => {
    if (!loaded) return;
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      saveCanvas(true);
    }, 3000);
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges, loaded]);

  async function saveCanvas(silent = false) {
    if (!silent) setSaving(true);
    try {
      const currentNodes = getNodes();
      const currentEdges = getEdges();
      const canvasData = JSON.stringify({
        nodes: currentNodes,
        edges: currentEdges,
      });
      await updateProject(projectId, { canvasData, status: "active" });
      if (!silent) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch {
      // Silently fail for auto-save
    }
    if (!silent) setSaving(false);
  }

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
        position: {
          x: 300 + Math.random() * 200,
          y: 100 + Math.random() * 300,
        },
        data: dataMap[type] || { label: type },
      },
    ]);
  }

  function deleteSelectedNode() {
    if (!selectedNodeId) return;
    setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId));
    setEdges((eds) =>
      eds.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId)
    );
    setSelectedNodeId(null);
  }

  // Run all generation nodes sequentially
  async function handleRunAll() {
    setRunningAll(true);
    const currentNodes = getNodes();
    const currentEdges = getEdges();

    const genNodes = currentNodes.filter(
      (n) => n.type === "imageGen" || n.type === "videoGen"
    );

    for (const genNode of genNodes) {
      const inputEdge = currentEdges.find((e) => e.target === genNode.id);
      let prompt = "A beautiful image";
      if (inputEdge) {
        const inputNode = getNode(inputEdge.source);
        if (inputNode?.data) {
          prompt = (inputNode.data as { value?: string }).value || prompt;
        }
      }

      const model = (genNode.data as { model?: string }).model || "FLUX.1";
      const type = genNode.type === "videoGen" ? "video" : "image";

      await runGeneration({
        nodeId: genNode.id,
        type: type as "image" | "video",
        prompt,
        model,
        projectId,
      });
    }

    setRunningAll(false);
  }

  function onNodeClick(_: React.MouseEvent, node: Node) {
    setSelectedNodeId(node.id);
    // Auto-open right panel on mobile when selecting
    if (window.innerWidth < 768 && !rightOpen) {
      setRightOpen(true);
    }
  }

  function onPaneClick() {
    setSelectedNodeId(null);
  }

  // Render the right config panel content based on selected node
  function renderConfigPanel() {
    if (!selectedNode) {
      return (
        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
          <Settings2 className="mx-auto h-8 w-8 text-gray-300" />
          <p className="mt-2 text-xs text-gray-400">点击节点查看配置</p>
        </div>
      );
    }

    const nodeType = selectedNode.type || "unknown";
    const data = selectedNode.data as Record<string, unknown>;
    const status = nodeStatuses[selectedNode.id] || (data.status as string) || "idle";

    const statusColors: Record<string, string> = {
      idle: "bg-gray-400",
      running: "bg-yellow-400 animate-pulse",
      success: "bg-green-400",
      failed: "bg-red-400",
    };
    const statusLabels: Record<string, string> = {
      idle: "就绪",
      running: "运行中",
      success: "已完成",
      failed: "失败",
    };

    return (
      <div className="mt-4 space-y-4">
        {/* Node info */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">
              {nodeTypeLabels[nodeType] || nodeType}
            </span>
            <div className="flex items-center gap-1.5">
              <div className={`h-2 w-2 rounded-full ${statusColors[status]}`} />
              <span className="text-xs text-gray-500">{statusLabels[status]}</span>
            </div>
          </div>
          <p className="mt-1 text-[10px] text-gray-400 font-mono">{selectedNode.id}</p>
        </div>

        {/* TextInput config */}
        {nodeType === "textInput" && (
          <div>
            <label className="text-xs font-medium text-gray-500">Prompt</label>
            <textarea
              className="mt-1 w-full resize-none rounded-lg border border-gray-200 p-2 text-xs focus:border-violet-300 focus:outline-none"
              rows={4}
              value={(data.value as string) || ""}
              onChange={(e) =>
                updateNodeData(selectedNode.id, { value: e.target.value })
              }
              placeholder="输入 Prompt..."
            />
          </div>
        )}

        {/* ImageGen / VideoGen config */}
        {(nodeType === "imageGen" || nodeType === "videoGen") && (
          <>
            <div>
              <label className="text-xs font-medium text-gray-500">模型</label>
              <div className="mt-1 space-y-1">
                {(nodeType === "videoGen"
                  ? ["Kling"]
                  : modelOptions.filter((m) => m !== "Kling")
                ).map((m) => (
                  <button
                    key={m}
                    onClick={() =>
                      updateNodeData(selectedNode.id, { model: m })
                    }
                    className={`flex w-full items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                      (data.model as string) === m
                        ? "border-violet-300 bg-violet-50 text-violet-700 font-medium"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <div className="h-2 w-2 rounded-full bg-green-400" />
                    {m}
                  </button>
                ))}
              </div>
            </div>
            {nodeType === "imageGen" && (
              <div>
                <label className="text-xs font-medium text-gray-500">尺寸</label>
                <div className="mt-1 grid grid-cols-2 gap-1.5">
                  {sizeOptions.map((s) => (
                    <button
                      key={s}
                      onClick={() =>
                        updateNodeData(selectedNode.id, { size: s })
                      }
                      className={`rounded-lg border px-2 py-1.5 text-[11px] transition-colors ${
                        (data.size as string || "1024x1024") === s
                          ? "border-violet-300 bg-violet-50 text-violet-700 font-medium"
                          : "border-gray-200 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Output config */}
        {nodeType === "output" && (
          <div>
            <label className="text-xs font-medium text-gray-500">输出类型</label>
            <div className="mt-1 grid grid-cols-2 gap-2">
              {["image", "video"].map((t) => (
                <button
                  key={t}
                  onClick={() =>
                    updateNodeData(selectedNode.id, { type: t })
                  }
                  className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                    (data.type as string) === t
                      ? "border-violet-300 bg-violet-50 text-violet-700 font-medium"
                      : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {t === "image" ? "图片" : "视频"}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Delete node */}
        <button
          onClick={deleteSelectedNode}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs text-red-600 transition-colors hover:bg-red-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
          删除节点
        </button>
      </div>
    );
  }

  if (!loaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Toolbar */}
      <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-2 sm:px-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 md:hidden"
            onClick={() => setLeftOpen(!leftOpen)}
          >
            <PanelLeftOpen className="h-4 w-4" />
          </button>
          <Link
            href="/workspace"
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex h-7 w-7 items-center justify-center rounded bg-violet-600">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-gray-900 truncate max-w-[120px] sm:max-w-none">
            {projectName}
          </span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => saveCanvas(false)}
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : saved ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            <span className="hidden sm:inline">
              {saving ? "保存中..." : saved ? "已保存" : "保存"}
            </span>
          </Button>
          <Button
            size="sm"
            className="gap-1"
            onClick={handleRunAll}
            disabled={runningAll}
          >
            {runningAll ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Play className="h-3.5 w-3.5" />
            )}
            <span className="hidden sm:inline">
              {runningAll ? "运行中..." : "运行全部"}
            </span>
          </Button>
          <button
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 md:hidden"
            onClick={() => setRightOpen(!rightOpen)}
          >
            <PanelRightOpen className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left: Node Panel */}
        {leftOpen && (
          <aside className="absolute md:relative z-20 h-full w-56 shrink-0 overflow-y-auto border-r border-gray-200 bg-white p-4">
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
        )}

        {/* Mobile overlay backdrop */}
        {(leftOpen || rightOpen) && (
          <div
            className="absolute inset-0 z-10 bg-black/20 md:hidden"
            onClick={() => {
              setLeftOpen(false);
              setRightOpen(false);
            }}
          />
        )}

        {/* Center: Canvas */}
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
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
        {rightOpen && (
          <aside className="absolute md:relative right-0 z-20 h-full w-64 shrink-0 overflow-y-auto border-l border-gray-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              {selectedNode ? "节点配置" : "配置"}
            </p>
            {renderConfigPanel()}

            {/* Run status always visible at bottom */}
            <div className="mt-6">
              <label className="text-xs font-medium text-gray-500">
                运行状态
              </label>
              <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-500">
                {runningAll
                  ? "⚡ 运行中 — 正在执行生成任务..."
                  : "就绪 — 点击「运行全部」开始生成"}
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

export default function CanvasPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  return (
    <ReactFlowProvider>
      <CanvasInner projectId={projectId} />
    </ReactFlowProvider>
  );
}
