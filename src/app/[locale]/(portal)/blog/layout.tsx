import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "博客 - StoneArk 外汇交易员培训",
  description: "StoneArk 专业外汇交易员培训平台官方博客 - 分享交易知识、市场分析和学习资源。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
