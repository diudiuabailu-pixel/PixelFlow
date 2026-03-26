import { create } from "zustand";

export interface Project {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  updatedAt: string;
  status: "draft" | "active" | "archived";
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  models: string[];
  tags: string[];
}

export interface GenerationRecord {
  id: string;
  projectId: string;
  type: "image" | "video";
  prompt: string;
  model: string;
  outputUrl: string;
  createdAt: string;
  status: "success" | "failed" | "pending";
}

interface AppState {
  projects: Project[];
  templates: Template[];
  history: GenerationRecord[];
  addProject: (project: Project) => void;
  removeProject: (id: string) => void;
  addHistoryRecord: (record: GenerationRecord) => void;
}

export const useAppStore = create<AppState>((set) => ({
  projects: [],
  templates: [],
  history: [],
  addProject: (project) =>
    set((state) => ({ projects: [project, ...state.projects] })),
  removeProject: (id) =>
    set((state) => ({ projects: state.projects.filter((p) => p.id !== id) })),
  addHistoryRecord: (record) =>
    set((state) => ({ history: [record, ...state.history] })),
}));
