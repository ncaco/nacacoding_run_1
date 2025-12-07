'use client';

export default function PortalLoading() {
  return (
    <>
      {/* 라이트모드 로딩 화면 */}
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50/30 backdrop-blur-sm dark:hidden">
        <div className="flex flex-col items-center gap-6">
          {/* 귀여운 로고 애니메이션 - 라이트모드 */}
          <div className="relative">
            {/* 바운스 애니메이션 배경 원 - 라이트모드 */}
            <div className="absolute inset-0 animate-ping rounded-full bg-green-300/30"></div>
            <div className="absolute inset-0 animate-pulse rounded-full bg-green-200/40"></div>
            
            {/* 메인 로고 - 라이트모드: 밝고 부드러운 그린 */}
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-green-400 via-green-500 to-emerald-500 shadow-xl shadow-green-400/40 animate-bounce-slow">
              <span className="text-4xl font-bold text-white drop-shadow-lg">P</span>
            </div>
            
            {/* 주변 회전하는 점들 - 라이트모드: 밝은 그린 */}
            <div className="absolute -top-2 -left-2 h-3 w-3 animate-bounce rounded-full bg-green-400 shadow-md [animation-delay:75ms]"></div>
            <div className="absolute -top-2 -right-2 h-3 w-3 animate-bounce rounded-full bg-emerald-500 shadow-md [animation-delay:150ms]"></div>
            <div className="absolute -bottom-2 -left-2 h-3 w-3 animate-bounce rounded-full bg-green-400 shadow-md [animation-delay:300ms]"></div>
            <div className="absolute -bottom-2 -right-2 h-3 w-3 animate-bounce rounded-full bg-emerald-500 shadow-md [animation-delay:500ms]"></div>
          </div>

          {/* 로딩 메시지 - 라이트모드 */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-lg font-semibold text-gray-800 animate-pulse">
              잠시만 기다려주세요
            </p>
            <p className="text-sm text-gray-600">
              멋진 경험을 준비하고 있어요
            </p>
          </div>

          {/* 진행 바 - 라이트모드 */}
          <div className="relative w-48 overflow-hidden rounded-full bg-gray-200 shadow-inner">
            <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-green-400 via-green-500 to-emerald-500">
              <div className="loading-bar h-full w-1/3 rounded-full bg-white/50"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 다크모드 로딩 화면 */}
      <div className="fixed inset-0 z-[100] hidden items-center justify-center bg-black dark:flex dark:bg-gray-900">
        <div className="flex flex-col items-center gap-6 dark:bg-gray-900">
          {/* 귀여운 로고 애니메이션 - 다크모드 */}
          <div className="relative">
            {/* 바운스 애니메이션 배경 원 - 다크모드: 네온 효과 */}
            <div className="absolute inset-0 animate-ping rounded-full bg-green-500/15"></div>
            <div className="absolute inset-0 animate-pulse rounded-full bg-green-400/10"></div>
            
            {/* 메인 로고 - 다크모드: 네온 그린 효과 */}
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 via-emerald-500 to-green-400 shadow-2xl shadow-green-500/70 ring-2 ring-green-500/40 animate-bounce-slow">
              <span className="text-4xl font-bold text-white drop-shadow-[0_0_10px_rgba(34,197,94,0.9)]">P</span>
            </div>
            
            {/* 주변 회전하는 점들 - 다크모드: 네온 그린 */}
            <div className="absolute -top-2 -left-2 h-3 w-3 animate-bounce rounded-full bg-green-400 shadow-[0_0_10px_rgba(34,197,94,0.7)] [animation-delay:75ms]"></div>
            <div className="absolute -top-2 -right-2 h-3 w-3 animate-bounce rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.7)] [animation-delay:150ms]"></div>
            <div className="absolute -bottom-2 -left-2 h-3 w-3 animate-bounce rounded-full bg-green-400 shadow-[0_0_10px_rgba(34,197,94,0.7)] [animation-delay:300ms]"></div>
            <div className="absolute -bottom-2 -right-2 h-3 w-3 animate-bounce rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.7)] [animation-delay:500ms]"></div>
          </div>

          {/* 로딩 메시지 - 다크모드 */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-lg font-semibold text-gray-50 animate-pulse">
              잠시만 기다려주세요
            </p>
            <p className="text-sm text-gray-300">
              멋진 경험을 준비하고 있어요
            </p>
          </div>

          {/* 진행 바 - 다크모드: 네온 효과 */}
          <div className="relative w-48 overflow-hidden rounded-full bg-gray-900 shadow-inner">
            <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-green-500 via-emerald-500 to-green-400 shadow-[0_0_10px_rgba(34,197,94,0.5)]">
              <div className="loading-bar h-full w-1/3 rounded-full bg-white/20"></div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        
        @keyframes slide {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(200%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        
        .loading-bar {
          animation: slide 1.5s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
