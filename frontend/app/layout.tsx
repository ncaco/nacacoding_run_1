import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: '포털 - 주말에 구축하고, 수백만으로 확장하세요',
  description: '포털은 애플리케이션을 구축하기 위한 현대적인 플랫폼입니다. 인증, API, 파일 저장소 등을 포함하여 프로젝트를 시작하세요.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
          <Toaster 
            position="top-right" 
            richColors 
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
