import type { Metadata } from "next";
import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";

import "./globals.css";

const bodyFont = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body"
});

const displayFont = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-display"
});

export const metadata: Metadata = {
  title: "PapaLevel",
  description: "아빠 되기 프로젝트를 위한 실행 중심 모바일 웹앱"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${bodyFont.variable} ${displayFont.variable} font-body text-ink antialiased`}>
        {children}
      </body>
    </html>
  );
}
