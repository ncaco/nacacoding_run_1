import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "#ffffff",
          color: "#111111",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 600,
            letterSpacing: -1,
          }}
        >
          우리의 결혼식 초대장
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 28,
            color: "#444",
          }}
        >
          2025. 10. 18 토 13:00 · 서울 강남 스카이컨벤션
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}


