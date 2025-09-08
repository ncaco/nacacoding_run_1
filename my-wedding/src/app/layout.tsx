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
  title: {
    default: "우리의 결혼식 초대장",
    template: "%s | 우리의 결혼식",
  },
  description: "소중한 분들을 우리 결혼식에 초대합니다.",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "우리의 결혼식 초대장",
    description: "소중한 분들을 우리 결혼식에 초대합니다.",
    type: "website",
    url: "/",
    images: [
      {
        url: "/next.svg",
        width: 1200,
        height: 630,
        alt: "우리의 결혼식",
      },
    ],
    locale: "ko_KR",
    siteName: "우리의 결혼식",
  },
  twitter: {
    card: "summary_large_image",
    title: "우리의 결혼식 초대장",
    description: "소중한 분들을 우리 결혼식에 초대합니다.",
    images: ["/next.svg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/manifest.webmanifest",
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
