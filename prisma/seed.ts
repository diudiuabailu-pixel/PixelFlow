import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function makeCanvas(prompt: string, model = "FLUX.1", type: "image" | "video" = "image") {
  const genType = type === "video" ? "videoGen" : "imageGen";
  const genModel = type === "video" ? "Kling" : model;
  return JSON.stringify({
    nodes: [
      {
        id: "input-1",
        type: "textInput",
        position: { x: 50, y: 200 },
        data: { label: "文本输入", value: prompt },
      },
      {
        id: "gen-1",
        type: genType,
        position: { x: 400, y: 150 },
        data: { label: type === "video" ? "视频生成" : "图像生成", model: genModel, status: "idle" },
      },
      {
        id: "output-1",
        type: "output",
        position: { x: 750, y: 200 },
        data: { label: "输出", type, url: null },
      },
    ],
    edges: [
      { id: "e1", source: "input-1", target: "gen-1", animated: true },
      { id: "e2", source: "gen-1", target: "output-1", animated: true },
    ],
  });
}

const templates = [
  // === 电商 (5) ===
  {
    name: "电商商品主图",
    description: "一键生成高质量电商商品展示图，白底/场景图多种风格",
    category: "电商",
    models: JSON.stringify(["FLUX.1", "SDXL"]),
    tags: JSON.stringify(["电商", "商品图", "白底图"]),
    canvasData: makeCanvas(
      "Professional product photography, a sleek wireless headphone on a clean white background, soft studio lighting, commercial product shot, 8k, ultra detailed"
    ),
  },
  {
    name: "电商详情页场景图",
    description: "生成商品在使用场景中的生活化展示图",
    category: "电商",
    models: JSON.stringify(["FLUX.1", "SDXL"]),
    tags: JSON.stringify(["电商", "详情页", "场景图"]),
    canvasData: makeCanvas(
      "Lifestyle product photography, a minimalist leather bag placed on a wooden cafe table, warm afternoon light streaming through window, cozy atmosphere, editorial style, high quality"
    ),
  },
  {
    name: "电商广告横幅",
    description: "生成促销活动横幅图，适配各电商平台尺寸",
    category: "电商",
    models: JSON.stringify(["FLUX.1"]),
    tags: JSON.stringify(["电商", "广告", "横幅", "促销"]),
    canvasData: makeCanvas(
      "E-commerce sale banner design, modern gradient background in purple and orange, floating product boxes with glow effects, bold typography space, festive atmosphere, clean layout"
    ),
  },
  {
    name: "商品包装展示",
    description: "展示产品包装设计的 3D 渲染效果图",
    category: "电商",
    models: JSON.stringify(["SDXL"]),
    tags: JSON.stringify(["电商", "包装", "3D"]),
    canvasData: makeCanvas(
      "3D product packaging mockup, a premium skincare bottle with elegant label design, marble surface, soft pink and gold color scheme, luxury brand aesthetic, studio lighting, photorealistic render",
      "SDXL"
    ),
  },
  {
    name: "电商促销海报",
    description: "双十一/618 等大促活动海报模板",
    category: "电商",
    models: JSON.stringify(["FLUX.1"]),
    tags: JSON.stringify(["电商", "海报", "促销", "大促"]),
    canvasData: makeCanvas(
      "Vibrant shopping festival poster, explosive red and gold color scheme, gift boxes and confetti flying, dynamic composition, Chinese shopping festival style, bold energy, festive celebration"
    ),
  },
  // === 社交媒体 (5) ===
  {
    name: "小红书封面图",
    description: "生成小红书爆款风格封面，高颜值排版",
    category: "社交媒体",
    models: JSON.stringify(["FLUX.1"]),
    tags: JSON.stringify(["小红书", "封面", "社交媒体"]),
    canvasData: makeCanvas(
      "Aesthetic flat lay photography for social media, a beautiful brunch setup with avocado toast, fresh flowers, latte art, morning sunlight, pastel color palette, Instagram style, top-down view"
    ),
  },
  {
    name: "YouTube 缩略图",
    description: "生成高点击率的视频缩略图，吸引眼球的构图",
    category: "社交媒体",
    models: JSON.stringify(["FLUX.1"]),
    tags: JSON.stringify(["YouTube", "缩略图", "封面"]),
    canvasData: makeCanvas(
      "Eye-catching YouTube thumbnail, dramatic lighting, vibrant saturated colors, a person with shocked expression looking at a glowing futuristic screen, bold contrast, cinematic mood, attention grabbing"
    ),
  },
  {
    name: "Instagram 帖子",
    description: "生成适配 Instagram 方形比例的精美图片",
    category: "社交媒体",
    models: JSON.stringify(["FLUX.1", "SDXL"]),
    tags: JSON.stringify(["Instagram", "帖子", "方形"]),
    canvasData: makeCanvas(
      "Beautiful Instagram post, golden hour landscape photography, a serene lake reflecting mountains and sunset sky, warm tones, dreamy atmosphere, travel photography, square composition"
    ),
  },
  {
    name: "微信公众号封面",
    description: "适配公众号文章的横版封面图",
    category: "社交媒体",
    models: JSON.stringify(["FLUX.1"]),
    tags: JSON.stringify(["微信", "公众号", "封面"]),
    canvasData: makeCanvas(
      "Clean tech blog header image, abstract geometric shapes in blue and white gradient, minimalist modern design, digital technology concept, soft light, corporate professional style, wide aspect ratio"
    ),
  },
  {
    name: "短视频封面",
    description: "抖音/快手竖版视频封面，吸睛设计",
    category: "社交媒体",
    models: JSON.stringify(["FLUX.1"]),
    tags: JSON.stringify(["短视频", "抖音", "封面"]),
    canvasData: makeCanvas(
      "Vertical short video cover, trendy street fashion portrait, neon city lights background, dynamic pose, urban night photography style, bold colors, Gen-Z aesthetic, vertical composition"
    ),
  },
  // === 创意 (5) ===
  {
    name: "概念艺术场景",
    description: "生成影视级概念艺术场景图，适合创意探索",
    category: "创意",
    models: JSON.stringify(["SDXL", "FLUX.1"]),
    tags: JSON.stringify(["概念艺术", "场景", "影视"]),
    canvasData: makeCanvas(
      "Epic concept art, a floating cyberpunk city above clouds at sunset, massive airships and bridges connecting towers, volumetric lighting, matte painting style, cinematic wide shot, sci-fi atmosphere, highly detailed, artstation trending",
      "SDXL"
    ),
  },
  {
    name: "角色设计",
    description: "生成原创角色概念设计图",
    category: "创意",
    models: JSON.stringify(["FLUX.1"]),
    tags: JSON.stringify(["角色", "设计", "概念"]),
    canvasData: makeCanvas(
      "Character concept design sheet, a futuristic female warrior with glowing cyan armor, multiple angles and poses, clean white background, detailed weapon design, anime meets realistic style, professional character turnaround"
    ),
  },
  {
    name: "风景壁纸",
    description: "生成超高画质的风景壁纸",
    category: "创意",
    models: JSON.stringify(["FLUX.1", "SDXL"]),
    tags: JSON.stringify(["风景", "壁纸", "高清"]),
    canvasData: makeCanvas(
      "Breathtaking landscape wallpaper, northern lights aurora borealis over a crystal clear lake in Norway, snow-capped mountains, perfect reflection on water surface, long exposure photography, 8k ultra HD, National Geographic quality"
    ),
  },
  {
    name: "抽象艺术",
    description: "生成独特的抽象艺术作品",
    category: "创意",
    models: JSON.stringify(["SDXL"]),
    tags: JSON.stringify(["抽象", "艺术", "装饰"]),
    canvasData: makeCanvas(
      "Abstract modern art, flowing liquid marble texture in deep blue, gold and white, organic shapes, elegant swirling patterns, luxury art print, high resolution, suitable for wall art, contemporary gallery style",
      "SDXL"
    ),
  },
  {
    name: "分镜脚本可视化",
    description: "将文字脚本转化为分镜画面预览",
    category: "创意",
    models: JSON.stringify(["FLUX.1"]),
    tags: JSON.stringify(["分镜", "影视", "脚本"]),
    canvasData: makeCanvas(
      "Film storyboard frame, a detective standing in a rain-soaked alley at night, dramatic low angle shot, neon signs reflecting in puddles, noir lighting, cinematic composition, movie still quality, 35mm film grain"
    ),
  },
];

async function main() {
  console.log("Clearing existing templates...");
  await prisma.template.deleteMany();

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
