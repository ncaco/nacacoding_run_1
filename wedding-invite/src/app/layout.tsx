import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Serif_KR } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const displaySerif = Noto_Serif_KR({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "우리 결혼합니다 | 김하준 ❤ 박서연",
  description: "김하준 ❤ 박서연 결혼식 초대장입니다. 함께해 주시면 감사하겠습니다.",
  openGraph: {
    title: "우리 결혼합니다 | 김하준 ❤ 박서연",
    description:
      "김하준 ❤ 박서연 결혼식 초대장입니다. 일시: 2025-11-22(토) 오후 1시 30분, 장소: 서울 강남구 삼성로 123 라움 웨딩홀.",
    url: "https://example.com",
    type: "website",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "김하준 ❤ 박서연 결혼식 초대장",
      },
    ],
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
      <body className={`${geistSans.variable} ${geistMono.variable} ${displaySerif.variable} antialiased`}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
