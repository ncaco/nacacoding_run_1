import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

const plans = [
  {
    name: '무료',
    price: '₩0',
    period: '월',
    description: '개인 프로젝트와 소규모 애플리케이션에 적합합니다.',
    features: [
      '최대 10,000 API 요청/월',
      '1GB 파일 저장소',
      '기본 인증 기능',
      '커뮤니티 지원',
      '1개 사이트',
    ],
    cta: '무료로 시작하기',
    ctaLink: '/signup',
    popular: false,
  },
  {
    name: '프로',
    price: '₩29,000',
    period: '월',
    description: '성장하는 비즈니스를 위한 전문가 플랜입니다.',
    features: [
      '최대 100,000 API 요청/월',
      '10GB 파일 저장소',
      '고급 인증 기능',
      '우선 지원',
      '최대 5개 사이트',
      '고급 분석',
      '사용자 정의 도메인',
    ],
    cta: '프로 플랜 시작하기',
    ctaLink: '/signup?plan=pro',
    popular: true,
  },
  {
    name: '엔터프라이즈',
    price: '맞춤형',
    period: '',
    description: '대규모 조직을 위한 맞춤형 솔루션입니다.',
    features: [
      '무제한 API 요청',
      '무제한 파일 저장소',
      '모든 기능',
      '전담 지원',
      '무제한 사이트',
      'SLA 보장',
      '맞춤형 통합',
      '온프레미스 옵션',
    ],
    cta: '영업팀에 문의하기',
    ctaLink: '/contact',
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white px-4 py-20 dark:bg-gray-900 sm:px-6 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl">
              간단하고 투명한
              <br />
              <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                가격 정책
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-400 sm:text-xl">
              모든 플랜에는 무료 체험 기간이 포함되어 있습니다. 언제든지 취소할 수 있습니다.
            </p>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="bg-gray-50 px-4 py-20 dark:bg-gray-800 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-3">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className={`relative rounded-2xl bg-white p-8 shadow-lg transition-all hover:shadow-xl dark:bg-gray-900 dark:shadow-gray-800/50 ${
                    plan.popular ? 'ring-2 ring-green-500 lg:scale-105' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-gradient-to-r from-green-400 to-green-600 px-4 py-1 text-sm font-semibold text-white">
                        인기
                      </span>
                    </div>
                  )}
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                    <div className="mt-4 flex items-baseline justify-center">
                      <span className="text-5xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                      {plan.period && (
                        <span className="ml-2 text-lg text-gray-600 dark:text-gray-400">/{plan.period}</span>
                      )}
                    </div>
                    <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">{plan.description}</p>
                  </div>
                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <svg
                          className="h-5 w-5 flex-shrink-0 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={plan.ctaLink}
                    className={`mt-8 block w-full rounded-lg px-4 py-3 text-center text-base font-semibold transition-all ${
                      plan.popular
                        ? 'bg-gradient-to-r from-green-400 to-green-600 text-white hover:from-green-500 hover:to-green-700'
                        : 'border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-white px-4 py-20 dark:bg-gray-900 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              자주 묻는 질문
            </h2>
            <div className="mt-12 space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  무료 플랜에 제한이 있나요?
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  무료 플랜은 개인 프로젝트와 소규모 애플리케이션에 충분합니다. 더 많은 기능이 필요하시면 언제든지 업그레이드할 수 있습니다.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  언제든지 플랜을 변경할 수 있나요?
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  네, 언제든지 플랜을 업그레이드하거나 다운그레이드할 수 있습니다. 변경 사항은 즉시 적용됩니다.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  환불 정책은 어떻게 되나요?
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  모든 플랜에는 30일 무료 체험 기간이 포함되어 있습니다. 만족하지 않으시면 언제든지 취소할 수 있으며 환불을 받으실 수 있습니다.
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

