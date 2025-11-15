import Header from '../components/Header';
import Footer from '../components/Footer';
import Features from '../components/Features';

export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white px-4 py-20 dark:bg-gray-900 sm:px-6 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl">
              강력한 기능으로
              <br />
              <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                애플리케이션을 구축하세요
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-400 sm:text-xl">
              포털은 개발자가 빠르게 애플리케이션을 구축할 수 있도록 필요한 모든 기능을 제공합니다.
              인증부터 파일 저장소, API까지 모든 것이 통합되어 있습니다.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <Features />

        {/* Additional Features Section */}
        <section className="bg-white px-4 py-20 dark:bg-gray-900 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                더 많은 기능
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                포털은 계속해서 새로운 기능을 추가하고 있습니다.
              </p>
            </div>
            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl bg-gray-50 p-6 dark:bg-gray-800">
                <div className="mb-4 inline-flex rounded-lg bg-green-100 p-3 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">보안</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  엔터프라이즈급 보안 기능으로 데이터를 안전하게 보호하세요.
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-6 dark:bg-gray-800">
                <div className="mb-4 inline-flex rounded-lg bg-green-100 p-3 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">성능</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  최적화된 인프라로 빠르고 안정적인 성능을 제공합니다.
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-6 dark:bg-gray-800">
                <div className="mb-4 inline-flex rounded-lg bg-green-100 p-3 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">확장성</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  수백만 사용자까지 확장 가능한 아키텍처를 제공합니다.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

