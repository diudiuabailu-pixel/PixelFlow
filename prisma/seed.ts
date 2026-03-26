import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const templates = [
  {
    name: "电商商品主图",
    description: "一键生成高质量电商商品展示图，支持多种风格和背景",
    category: "电商",
    models: JSON.stringify(["FLUX.1", "SDXL"]),
    tags: JSON.stringify(["电商", "商品图", "白底图"]),
    canvasData: JSON.stringify({
      nodes: [
        { id: "input-1", type: "textInput", position: { x: 50, y: 200 }, data: { label: "商品描述", value: "" } },
        { id: "gen-1", type: "imageGen", position: { x: 400, y: 150 }, data: { label: "图像生成", model: "FLUX.1", status: "idle" } },
        { id: "output-1", type: "output", position: { x: 750, y: 200 }, data: { label: "输出", type: "image", url: null } },
      ],
      edges: [
        { id: "e1", source: "input-1", target: "gen-1", animated: true },
        { id: "e2", source: "gen-1", target: "output-1", animated: true },
      ],
    }),
  },
  {
    name: "社交媒体封面",
    description: "快速生成适配各平台尺寸的社交媒体封面图",
    category: "社交媒体",
    models: JSON.stringify(["FLUX.1"]),
    tags: JSON.stringify(["封面", "小红书", "抖音"]),
  },
  {
    name: "短视频片头",
    description: "AI 生成短视频开场动画，多种风格可选",
    category: "视频",
    models: JSON.stringify(["Kling", "FLUX.1"]),
    tags: JSON.stringify(["视频", "片头", "动画"]),
  },
  {
    name: "品牌广告海报",
    description: "输入品牌信息和风格，生成专业广告海报",
    category: "广告",
    models: JSON.stringify(["SDXL", "FLUX.1"]),
    tags: JSON.stringify(["广告", "海报", "品牌"]),
  },
  {
    name: "分镜脚本可视化",
    description: "将文字脚本转化为分镜画面，快速预览影片效果",
    category: "影视",
    models: JSON.stringify(["FLUX.1", "SDXL"]),
    tags: JSON.stringify(["分镜", "影视", "脚本"]),
  },
  {
    name: "AI 写真照",
    description: "上传参考图，生成多种风格的 AI 写真",
    category: "人像",
    models: JSON.stringify(["FLUX.1"]),
    tags: JSON.stringify(["写真", "人像", "风格化"]),
  },
  {
    name: "Logo 概念设计",
    description: "输入品牌名称和调性，生成多组 Logo 概念方案",
    category: "设计",
    models: JSON.stringify(["SDXL"]),
    tags: JSON.stringify(["Logo", "设计", "品牌"]),
  },
  {
    name: "产品宣传视频",
    description: "从产品图自动生成短视频宣传片",
    category: "视频",
    models: JSON.stringify(["Kling"]),
    tags: JSON.stringify(["视频", "宣传", "产品"]),
  },
  {
    name: "插画风格转换",
    description: "将照片或图片转换为插画、水彩、油画等艺术风格",
    category: "设计",
    models: JSON.stringify(["SDXL", "FLUX.1"]),
    tags: JSON.stringify(["插画", "风格转换", "艺术"]),
  },
  {
    name: "电商详情页组图",
    description: "批量生成电商详情页场景图和细节图",
    category: "电商",
    models: JSON.stringify(["FLUX.1", "SDXL"]),
    tags: JSON.stringify(["电商", "详情页", "批量"]),
  },
  {
    name: "YouTube 缩略图",
    description: "生成高点击率的 YouTube 视频缩略图",
    category: "社交媒体",
    models: JSON.stringify(["FLUX.1"]),
    tags: JSON.stringify(["YouTube", "缩略图", "封面"]),
  },
  {
    name: "概念艺术场景",
    description: "生成影视级概念艺术场景图，适合创意探索",
    category: "影视",
    models: JSON.stringify(["SDXL", "FLUX.1"]),
    tags: JSON.stringify(["概念艺术", "场景", "影视"]),
  },
];

async function main() {
  console.log("Seeding templates...");
  for (const tpl of templates) {
    await prisma.template.create({ data: tpl });
  }
  console.log(`Seeded ${templates.length} templates.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
