import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "우리 결혼합니다 | 김OO ❤ 박OO",
  description: "김OO ❤ 박OO 결혼식 초대장입니다. 함께해 주시면 감사하겠습니다.",
  openGraph: {
    title: "우리 결혼합니다 | 김OO ❤ 박OO",
    description:
      "김OO ❤ 박OO 결혼식 초대장입니다. 일시: 2025-10-18(토) 오후 1시, 장소: 서울시 OO구 OO홀.",
    url: "https://example.com",
    type: "website",
  },
  metadataBase: new URL("https://example.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
