import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "郭耀薇 Aria | ToB 大客户销售",
  description:
    "郭耀薇（Aria）的个人简历网站，求职意向为 TOB 大客户销售。",
  keywords: [
    "郭耀薇",
    "ARIA",
    "TOB大客户销售",
    "B2B Sales",
    "Business Development",
    "Key Account",
  ],
  authors: [{ name: "郭耀薇" }],
  openGraph: {
    title: "郭耀薇 Aria | ToB 大客户销售",
    description: "郭耀薇（Aria）的个人简历网站。",
    type: "website",
    locale: "zh_CN",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4f4f1",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
