"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Sparkles, Eye, Copy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { fetchTemplates, cloneTemplate } from "@/lib/api";

interface TemplateItem {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  models: string[];
  tags: string[];
}

const categories = [
  "全部",
  "电商",
  "社交媒体",
  "视频",
  "广告",
  "影视",
  "人像",
  "设计",
];

export default function TemplatesPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("全部");
  const [searchQuery, setSearchQuery] = useState("");
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cloning, setCloning] = useState<string | null>(null);

  const loadTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const data = (await fetchTemplates(activeCategory, searchQuery)) as TemplateItem[];
      setTemplates(data);
    } catch {
      // fallback empty
    } finally {
      setLoading(false);
    }
  }, [activeCategory, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(loadTemplates, 300);
    return () => clearTimeout(timer);
  }, [loadTemplates]);

  async function handleClone(templateId: string) {
    setCloning(templateId);
    try {
      const project = (await cloneTemplate(templateId)) as { id: string };
      router.push(`/canvas/${project.id}`);
    } catch {
      router.push("/login");
    } finally {
      setCloning(null);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
          <p className="mt-1 text-sm text-gray-500">
            从模板起步，一键 Clone 到工作空间
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="搜索模板..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={activeCategory === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="mt-20 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
        </div>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg"
              >
                <div className="relative aspect-video bg-gradient-to-br from-violet-50 to-purple-100">
                  {tpl.thumbnail ? (
                    <img src={tpl.thumbnail} alt={tpl.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="h-10 w-10 text-violet-200" />
                    </div>
                  )}
                  <div className="absolute right-3 top-3">
                    <Badge>{tpl.category}</Badge>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900">{tpl.name}</h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {tpl.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {tpl.models.map((model) => (
                      <Badge key={model} variant="secondary" className="text-xs">
                        {model}
                      </Badge>
                    ))}
                    {tpl.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Link href={`/templates/${tpl.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        预览
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      className="flex-1 gap-1"
                      disabled={cloning === tpl.id}
                      onClick={() => handleClone(tpl.id)}
                    >
                      {cloning === tpl.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      Clone
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {templates.length === 0 && (
            <div className="mt-20 text-center">
              <Sparkles className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-4 text-gray-500">没有找到匹配的模板</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
