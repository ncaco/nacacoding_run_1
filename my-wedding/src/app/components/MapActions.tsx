type Props = {
  kakaoUrl?: string;
  naverUrl?: string;
};

export default function MapActions({ kakaoUrl, naverUrl }: Props) {
  return (
    <div className="mt-4 flex gap-2">
      {kakaoUrl && (
        <a
          href={kakaoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 px-4 items-center rounded-full bg-[#fae100] text-black text-sm"
        >
          카카오맵 열기
        </a>
      )}
      {naverUrl && (
        <a
          href={naverUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 px-4 items-center rounded-full bg-[#03c75a] text-white text-sm"
        >
          네이버지도 열기
        </a>
      )}
    </div>
  );
}


