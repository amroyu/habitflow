import Link from 'next/link'
import { Navbar } from '@/components/navbar'

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      <main className="container mx-auto px-6 py-24">
        {/* Hero Section */}
        <section className="text-center mb-32 max-w-4xl mx-auto">
          <h1 className="text-[64px] leading-[1.1] font-normal mb-6 text-gray-900 dark:text-white">
            Track Your Goals & Break Bad Habits
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
            Set and track your 5-year goals, manage daily habits, and transform your life
            with our powerful goal management system.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/dashboard"
              className="px-6 py-2.5 text-sm font-medium rounded-lg text-white bg-[#0F172A] hover:bg-gray-800 transition-colors duration-200"
            >
              Get Started
            </Link>
            <Link
              href="/about"
              className="px-6 py-2.5 text-sm font-medium rounded-lg text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 transition-colors duration-200"
            >
              Learn More
            </Link>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="p-6 rounded-xl bg-white border border-gray-100 hover:border-gray-200 transition-all duration-200">
            <h3 className="text-lg font-medium mb-2 text-gray-900">Track DO's</h3>
            <p className="text-sm text-gray-500">
              Set and track positive goals you want to achieve
            </p>
          </div>
          <div className="p-6 rounded-xl bg-white border border-gray-100 hover:border-gray-200 transition-all duration-200">
            <h3 className="text-lg font-medium mb-2 text-gray-900">Monitor DON'Ts</h3>
            <p className="text-sm text-gray-500">
              Break bad habits and track your progress
            </p>
          </div>
          <div className="p-6 rounded-xl bg-white border border-gray-100 hover:border-gray-200 transition-all duration-200">
            <h3 className="text-lg font-medium mb-2 text-gray-900">Smart Tracking</h3>
            <p className="text-sm text-gray-500">
              Track progress with customizable time periods
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
