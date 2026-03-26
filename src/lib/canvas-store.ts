import { create } from "zustand";
import { generateContent } from "@/lib/api";

interface CanvasStore {
  nodeStatuses: Record<string, string>; // nodeId -> idle | running | success | failed
  nodeOutputs: Record<string, string | null>; // nodeId -> outputUrl
  setNodeStatus: (nodeId: string, status: string) => void;
  setNodeOutput: (nodeId: string, url: string | null) => void;
  runGeneration: (params: {
    nodeId: string;
    type: "image" | "video";
    prompt: string;
    model: string;
    projectId?: string;
  }) => Promise<void>;
}

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  nodeStatuses: {},
  nodeOutputs: {},

  setNodeStatus: (nodeId, status) =>
    set((s) => ({
      nodeStatuses: { ...s.nodeStatuses, [nodeId]: status },
    })),

  setNodeOutput: (nodeId, url) =>
    set((s) => ({
      nodeOutputs: { ...s.nodeOutputs, [nodeId]: url },
    })),

  runGeneration: async ({ nodeId, type, prompt, model, projectId }) => {
    const { setNodeStatus, setNodeOutput } = get();
    setNodeStatus(nodeId, "running");
    try {
      const result = await generateContent({
        type,
        prompt,
        model: model === "FLUX.1" ? "flux-1" : model.toLowerCase(),
        projectId,
      });
      if (result.status === "success" && result.outputUrl) {
        setNodeStatus(nodeId, "success");
        setNodeOutput(nodeId, result.outputUrl);
      } else {
        setNodeStatus(nodeId, "failed");
      }
    } catch {
      setNodeStatus(nodeId, "failed");
    }
  },
}));
