"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  MoreHorizontal,
  Trash2,
  Copy,
  FolderOpen,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockProjects } from "@/lib/mock-data";
import type { Project } from "@/lib/store";

export default function WorkspacePage() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const filtered = projects.filter(
    (p) =>
      !searchQuery ||
      p.name.includes(searchQuery) ||
      p.description.includes(searchQuery)
  );

  function handleNewProject() {
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: `新项目 ${projects.length + 1}`,
      description: "点击编辑项目描述",
      thumbnail: "/placeholder.svg",
      updatedAt: new Date().toISOString().slice(0, 10),
      status: "draft",
    };
    setProjects([newProject, ...projects]);
  }

  function handleDelete(id: string) {
    setProjects(projects.filter((p) => p.id !== id));
    setMenuOpen(null);
  }

  function handleDuplicate(id: string) {
    const original = projects.find((p) => p.id === id);
    if (!original) return;
    const dup: Project = {
      ...original,
      id: `proj-${Date.now()}`,
      name: `${original.name} (副本)`,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    setProjects([dup, ...projects]);
    setMenuOpen(null);
  }

  const statusMap: Record<string, { label: string; variant: "default" | "success" | "secondary" }> = {
    draft: { label: "草稿", variant: "secondary" },
    active: { label: "进行中", variant: "success" },
    archived: { label: "已归档", variant: "default" },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workspace</h1>
          <p className="mt-1 text-sm text-gray-500">管理你的创作项目</p>
        </div>
        <div className="flex gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="搜索项目..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={handleNewProject} className="gap-1 shrink-0">
            <Plus className="h-4 w-4" />
            新建项目
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">全部项目</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{projects.length}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">进行中</p>
          <p className="mt-1 text-2xl font-bold text-violet-600">
            {projects.filter((p) => p.status === "active").length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">草稿</p>
          <p className="mt-1 text-2xl font-bold text-gray-500">
            {projects.filter((p) => p.status === "draft").length}
          </p>
        </div>
      </div>

      {/* Project Grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* New Project Card */}
        <button
          onClick={handleNewProject}
          className="flex aspect-[4/3] flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400 transition-colors hover:border-violet-400 hover:bg-violet-50 hover:text-violet-500"
        >
          <Plus className="h-10 w-10" />
          <span className="mt-2 text-sm font-medium">新建项目</span>
        </button>

        {filtered.map((project) => (
          <div
            key={project.id}
            className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg"
          >
            <Link href={`/canvas/${project.id}`}>
              <div className="aspect-[4/3] bg-gradient-to-br from-violet-50 to-purple-100 flex items-center justify-center">
                <FolderOpen className="h-12 w-12 text-violet-200" />
              </div>
            </Link>
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {project.name}
                  </h3>
                  <p className="mt-0.5 text-sm text-gray-500 truncate">
                    {project.description}
                  </p>
                </div>
                <div className="relative ml-2">
                  <button
                    onClick={() =>
                      setMenuOpen(menuOpen === project.id ? null : project.id)
                    }
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                  {menuOpen === project.id && (
                    <div className="absolute right-0 top-8 z-10 w-36 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                      <button
                        onClick={() => handleDuplicate(project.id)}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        复制
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        删除
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <Badge variant={statusMap[project.status].variant}>
                  {statusMap[project.status].label}
                </Badge>
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="h-3 w-3" />
                  {project.updatedAt}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && projects.length > 0 && (
        <div className="mt-20 text-center">
          <Sparkles className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-4 text-gray-500">没有匹配的项目</p>
        </div>
      )}
    </div>
  );
}
