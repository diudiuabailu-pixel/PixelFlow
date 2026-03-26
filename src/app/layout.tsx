import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PixelFlow - AI 原生的视觉创作工作台",
  description:
    "从脚本到画面，从模板到工作流，一个画布搞定。多模型聚合 + 无限画布 + 节点式工作流 + 模板复用。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
