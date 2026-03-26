"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  MoreHorizontal,
  Trash2,
  Copy,
  FolderOpen,
  Clock,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  fetchProjects,
  createProject,
  deleteProject,
} from "@/lib/api";

interface ProjectItem {
  id: string;
  name: string;
  description: string;
  status: string;
  updatedAt: string;
}

export default function WorkspacePage() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProjects = useCallback(async () => {
    try {
      const data = (await fetchProjects()) as ProjectItem[];
      setProjects(data);
    } catch {
      // Not logged in or error — show empty state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const filtered = projects.filter(
    (p) =>
      !searchQuery ||
      p.name.includes(searchQuery) ||
      p.description.includes(searchQuery)
  );

  async function handleNewProject() {
    try {
      const project = (await createProject({
        name: `新项目 ${projects.length + 1}`,
      })) as ProjectItem;
      router.push(`/canvas/${project.id}`);
    } catch {
      // If not logged in, redirect to login
      router.push("/login");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteProject(id);
      setProjects(projects.filter((p) => p.id !== id));
    } catch {
      // ignore
    }
    setMenuOpen(null);
  }

  const statusMap: Record<
    string,
    { label: string; variant: "default" | "success" | "secondary" }
  > = {
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
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {projects.length}
          </p>
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

      {loading ? (
        <div className="mt-20 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
        </div>
      ) : (
        <>
          {/* Project Grid */}
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                          setMenuOpen(
                            menuOpen === project.id ? null : project.id
                          )
                        }
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      {menuOpen === project.id && (
                        <div className="absolute right-0 top-8 z-10 w-36 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
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
                    <Badge
                      variant={
                        statusMap[project.status]?.variant ?? "secondary"
                      }
                    >
                      {statusMap[project.status]?.label ?? project.status}
                    </Badge>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="h-3 w-3" />
                      {new Date(project.updatedAt).toLocaleDateString()}
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

          {projects.length === 0 && (
            <div className="mt-12 text-center">
              <Sparkles className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-4 text-gray-500">还没有项目</p>
              <p className="mt-1 text-sm text-gray-400">
                从模板开始，或新建一个空白项目
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Link href="/templates">
                  <Button variant="outline">浏览模板</Button>
                </Link>
                <Button onClick={handleNewProject}>新建项目</Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
