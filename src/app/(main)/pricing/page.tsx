import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    price: "0",
    unit: "永久免费",
    credits: "50 积分/月",
    description: "体验产品，适合轻度使用",
    features: [
      "50 积分/月（约 10 张图）",
      "基础模板访问",
      "单项目工作空间",
      "图像生成",
      "7 天历史记录",
    ],
    cta: "免费开始",
    popular: false,
  },
  {
    name: "Pro",
    price: "79",
    unit: "/月",
    credits: "500 积分/月",
    description: "个人创作者主力套餐",
    features: [
      "500 积分/月（约 100 张图）",
      "全部模板访问",
      "无限项目",
      "图像 + 视频生成",
      "30 天历史记录",
      "优先生成队列",
      "高清下载",
    ],
    cta: "升级 Pro",
    popular: true,
  },
  {
    name: "Pro+",
    price: "199",
    unit: "/月",
    credits: "2000 积分/月",
    description: "高频创作者 / 小型团队",
    features: [
      "2000 积分/月（约 400 张图）",
      "全部模板 + 优先新模板",
      "无限项目",
      "图像 + 视频生成",
      "无限历史记录",
      "最高优先级队列",
      "高清下载",
      "API 访问（即将推出）",
    ],
    cta: "升级 Pro+",
    popular: false,
  },
];

const creditsInfo = [
  { type: "图像生成", cost: "~5 积分/张", note: "取决于模型和分辨率" },
  { type: "视频生成", cost: "~20-50 积分/段", note: "取决于模型和时长" },
  { type: "按量补充", cost: "¥1/积分起", note: "随时补充，不过期" },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          简单透明的定价
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          从免费开始，按需升级。不同模型消耗不同积分，高频用户更划算。
        </p>
      </div>

      {/* Plans */}
      <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-2xl border bg-white p-8 ${
              plan.popular
                ? "border-violet-400 shadow-lg ring-1 ring-violet-400"
                : "border-gray-200"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-4 py-1 text-xs font-semibold text-white">
                最受欢迎
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
              <p className="mt-1 text-sm text-gray-500">{plan.description}</p>
            </div>
            <div className="mt-6">
              <span className="text-4xl font-bold text-gray-900">¥{plan.price}</span>
              <span className="text-sm text-gray-500">{plan.unit}</span>
            </div>
            <p className="mt-2 text-sm font-medium text-violet-600">{plan.credits}</p>
            <Link href="/login">
              <Button
                className="mt-6 w-full"
                variant={plan.popular ? "default" : "outline"}
              >
                {plan.cta}
              </Button>
            </Link>
            <ul className="mt-8 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Credits Explanation */}
      <div className="mx-auto mt-20 max-w-3xl">
        <h2 className="text-center text-xl font-bold text-gray-900">
          积分消耗说明
        </h2>
        <div className="mt-8 overflow-hidden rounded-xl border border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  类型
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  消耗
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  说明
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {creditsInfo.map((item) => (
                <tr key={item.type}>
                  <td className="px-6 py-3 text-sm font-medium text-gray-900">
                    {item.type}
                  </td>
                  <td className="px-6 py-3 text-sm text-violet-600 font-medium">
                    {item.cost}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500">{item.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
