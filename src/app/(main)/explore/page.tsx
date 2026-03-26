"use client";

import { useState, useEffect, useCallback } from "react";
import { Heart, Search, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { fetchExploreWorks } from "@/lib/api";
import { mockExploreWorks } from "@/lib/mock-data";

const categories = ["全部", "图像", "视频"];

interface ExploreWork {
  id: string;
  title: string;
  prompt?: string;
  author: string;
  thumbnail: string | null;
  category: string;
  model?: string;
  likes?: number;
}

export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState("全部");
  const [searchQuery, setSearchQuery] = useState("");
  const [works, setWorks] = useState<ExploreWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);

  const loadWorks = useCallback(async () => {
    setLoading(true);
    try {
      const data = (await fetchExploreWorks(activeCategory, searchQuery)) as ExploreWork[];
      if (data.length === 0 && !searchQuery && activeCategory === "全部") {
        // No real data yet — show mock data as showcase
        setWorks(mockExploreWorks as ExploreWork[]);
        setUsingMock(true);
      } else {
        setWorks(data);
        setUsingMock(false);
      }
    } catch {
      // API error fallback to mock
      setWorks(mockExploreWorks as ExploreWork[]);
      setUsingMock(true);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(loadWorks, 300);
    return () => clearTimeout(timer);
  }, [loadWorks]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Explore</h1>
          <p className="mt-1 text-sm text-gray-500">
            发现优秀作品，获取创作灵感
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="搜索作品..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Categories */}
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

      {usingMock && (
        <div className="mt-4 rounded-lg bg-violet-50 px-4 py-2 text-sm text-violet-600">
          展示示例作品 — 开始创作后，你的公开作品将出现在这里
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="mt-20 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
        </div>
      )}

      {/* Works Grid */}
      {!loading && (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {works.map((work) => (
            <div
              key={work.id}
              className="group cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:shadow-lg"
            >
              <div className="relative aspect-square bg-gradient-to-br from-violet-50 to-purple-100">
                {work.thumbnail ? (
                  <img
                    src={work.thumbnail}
                    alt={work.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="h-12 w-12 text-violet-200" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
                <div className="absolute right-3 top-3">
                  <Badge variant="secondary">{work.category}</Badge>
                </div>
                {work.model && (
                  <div className="absolute left-3 top-3">
                    <Badge variant="outline" className="bg-white/80 text-xs">
                      {work.model}
                    </Badge>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{work.title}</h3>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-gray-500">{work.author}</span>
                  {work.likes !== undefined && (
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                      <Heart className="h-4 w-4" />
                      {work.likes}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && works.length === 0 && (
        <div className="mt-20 text-center">
          <Sparkles className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-4 text-gray-500">没有找到匹配的作品</p>
        </div>
      )}
    </div>
  );
}
