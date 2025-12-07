const features = [
  {
    title: '인증',
    description: '사용자 회원가입과 로그인을 추가하고, 역할 기반 접근 제어로 데이터를 보호하세요.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
    ),
  },
  {
    title: '파일 저장소',
    description: '문서부터 미디어 파일까지 모든 파일 유형을 안전한 접근 제어와 함께 저장하세요.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    title: 'RESTful API',
    description: '데이터베이스를 자동 CRUD 작업이 포함된 RESTful API로 즉시 변환하세요.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    title: '사이트 관리',
    description: '다양한 구성과 설정으로 여러 사이트를 관리하세요.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
        />
      </svg>
    ),
  },
  {
    title: '메뉴 관리',
    description: '사이트를 위한 부모-자식 관계를 가진 계층적 메뉴를 생성하세요.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    ),
  },
  {
    title: '로깅',
    description: '포괄적인 로깅 시스템으로 애플리케이션 이벤트를 추적하고 모니터링하세요.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
];

export default function Features() {
  return (
    <section className="bg-white px-4 py-24 dark:bg-gray-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl lg:text-5xl">
            구축에 필요한 모든 것
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300">
            하나 또는 모두 사용하세요. 최고의 제품들. 플랫폼으로 통합되었습니다.
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-xl dark:border-gray-700/50 dark:bg-gray-900/50 dark:hover:border-gray-600/50 dark:hover:shadow-gray-900/50"
            >
              {/* 호버 시 배경 그라데이션 */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-gray-800/30"></div>
              
              <div className="relative">
                <div className="mb-6 inline-flex rounded-xl border border-gray-200 bg-gray-50 p-3 text-gray-900 transition-all group-hover:border-gray-300 group-hover:bg-gray-100 group-hover:scale-110 dark:border-gray-700/50 dark:bg-gray-800/50 dark:text-gray-100 dark:group-hover:border-gray-600/50 dark:group-hover:bg-gray-700/50">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">{feature.title}</h3>
                <p className="mt-3 leading-relaxed text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
