import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

const blogPosts = [
  {
    title: '포털 v1.0 출시: 새로운 시작',
    excerpt: '포털의 첫 번째 공식 버전이 출시되었습니다. 개발자들이 빠르게 애플리케이션을 구축할 수 있도록 설계되었습니다.',
    author: '포털 팀',
    date: '2025년 1월 15일',
    category: '공지사항',
    href: '/blog/portal-v1-release',
  },
  {
    title: '인증 시스템 구축 가이드',
    excerpt: '포털의 인증 시스템을 사용하여 안전한 사용자 인증을 구현하는 방법을 알아보세요.',
    author: '개발팀',
    date: '2025년 1월 10일',
    category: '튜토리얼',
    href: '/blog/authentication-guide',
  },
  {
    title: 'RESTful API 모범 사례',
    excerpt: '포털을 사용하여 RESTful API를 설계하고 구현하는 모범 사례를 공유합니다.',
    author: '기술팀',
    date: '2025년 1월 5일',
    category: '기술',
    href: '/blog/restful-api-best-practices',
  },
  {
    title: '파일 저장소 성능 최적화',
    excerpt: '대용량 파일을 효율적으로 관리하고 성능을 최적화하는 방법을 알아보세요.',
    author: '인프라팀',
    date: '2024년 12월 28일',
    category: '기술',
    href: '/blog/file-storage-optimization',
  },
  {
    title: '다중 사이트 관리 전략',
    excerpt: '하나의 포털 인스턴스로 여러 사이트를 효율적으로 관리하는 방법을 소개합니다.',
    author: '제품팀',
    date: '2024년 12월 20일',
    category: '가이드',
    href: '/blog/multi-site-management',
  },
  {
    title: '보안 강화: 모범 사례',
    excerpt: '포털 애플리케이션의 보안을 강화하기 위한 모범 사례와 권장 사항을 공유합니다.',
    author: '보안팀',
    date: '2024년 12월 15일',
    category: '보안',
    href: '/blog/security-best-practices',
  },
];

const categories = ['전체', '공지사항', '튜토리얼', '기술', '가이드', '보안'];

export default function BlogPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white px-4 py-20 dark:bg-gray-900 sm:px-6 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl">
              포털
              <br />
              <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                블로그
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-400 sm:text-xl">
              최신 소식, 튜토리얼, 그리고 포털을 사용하여 애플리케이션을 구축하는 팁을 확인하세요.
            </p>
          </div>
        </section>

        {/* Categories */}
        <section className="border-b border-gray-200 bg-gray-50 px-4 py-6 dark:border-gray-800 dark:bg-gray-800 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-green-500 hover:text-green-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-green-500 dark:hover:text-green-400"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="bg-gray-50 px-4 py-20 dark:bg-gray-800 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {blogPosts.map((post, index) => (
                <article
                  key={index}
                  className="group rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-gray-900 dark:shadow-gray-800/50"
                >
                  <div className="mb-4">
                    <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 transition-colors group-hover:text-green-600 dark:text-white dark:group-hover:text-green-400">
                    <Link href={post.href}>{post.title}</Link>
                  </h3>
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{post.excerpt}</p>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-400 to-green-600"></div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{post.author}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{post.date}</p>
                      </div>
                    </div>
                    <Link
                      href={post.href}
                      className="text-sm font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300"
                    >
                      읽기 →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="bg-white px-4 py-20 dark:bg-gray-900 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-xl bg-gradient-to-r from-green-50 to-white p-8 dark:from-gray-800 dark:to-gray-900">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">뉴스레터 구독</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  최신 소식과 업데이트를 이메일로 받아보세요.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <input
                    type="email"
                    placeholder="이메일 주소를 입력하세요"
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 sm:max-w-md"
                  />
                  <button className="rounded-lg bg-gradient-to-r from-green-400 to-green-600 px-6 py-3 font-semibold text-white transition-all hover:from-green-500 hover:to-green-700">
                    구독하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

