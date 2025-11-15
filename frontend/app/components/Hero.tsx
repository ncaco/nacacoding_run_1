import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white px-4 py-20 dark:bg-gray-900 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl">
          Build in a weekend,
          <br />
          <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
            Scale to millions
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-400 sm:text-xl">
          Portal is the modern platform for building applications. Start your project with
          authentication, APIs, file storage, and more.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/signup"
            className="rounded-lg bg-gradient-to-r from-green-400 to-green-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:from-green-500 hover:to-green-700 hover:shadow-xl"
          >
            Start your project
          </Link>
          <Link
            href="/docs"
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-900 transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          >
            Documentation
          </Link>
        </div>
        <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          Trusted by the world&apos;s most innovative companies
        </p>
      </div>
    </section>
  );
}

