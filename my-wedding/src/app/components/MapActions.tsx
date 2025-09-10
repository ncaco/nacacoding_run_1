type Props = {
  kakaoUrl?: string;
  naverUrl?: string;
};

export default function MapActions({ kakaoUrl, naverUrl }: Props) {
  return (
    <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row gap-2">
      {kakaoUrl && (
        <a
          href={kakaoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 sm:h-10 px-3 sm:px-4 items-center justify-center rounded-full bg-[#fae100] text-black text-xs sm:text-sm"
        >
          카카오맵 열기
        </a>
      )}
      {naverUrl && (
        <a
          href={naverUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 sm:h-10 px-3 sm:px-4 items-center justify-center rounded-full bg-[#03c75a] text-white text-xs sm:text-sm"
        >
          네이버지도 열기
        </a>
      )}
    </div>
  );
}


