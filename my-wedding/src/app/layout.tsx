import type { Metadata } from "next";
import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans_KR({
  variable: "--font-sans-kr",
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const notoSerif = Noto_Serif_KR({
  variable: "--font-serif-kr",
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
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
        className={`${notoSans.variable} ${notoSerif.variable} antialiased`}
      >
        {/* SVG 스프라이트 프리로드 */}
        <div style={{position:"absolute", width:0, height:0, overflow:"hidden"}} aria-hidden>
          {/* @ts-expect-error */}
          <img src="/icons.svg" alt="" />
        </div>
        {children}
      </body>
    </html>
  );
}
