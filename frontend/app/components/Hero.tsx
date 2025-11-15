import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white px-4 py-20 dark:bg-gray-900 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl">
          주말에 구축하고,
          <br />
          <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
            수백만으로 확장하세요
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-400 sm:text-xl">
          포털은 애플리케이션을 구축하기 위한 현대적인 플랫폼입니다. 인증, API, 파일 저장소 등을 포함하여
          프로젝트를 시작하세요.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/signup"
            className="rounded-lg bg-gradient-to-r from-green-400 to-green-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:from-green-500 hover:to-green-700 hover:shadow-xl"
          >
            프로젝트 시작하기
          </Link>
          <Link
            href="/docs"
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-900 transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          >
            문서
          </Link>
        </div>
        <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          세계에서 가장 혁신적인 기업들이 신뢰합니다
        </p>
      </div>
    </section>
  );
}

