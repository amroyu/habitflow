import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-6xl font-bold tracking-tight">
          Track Your Goals & Break Bad Habits
        </h1>
        <p className="mt-6 text-xl text-muted-foreground">
          Set and track your 5-year goals, manage daily habits, and transform your life
          with our powerful goal management system.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="rounded-md bg-primary px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-primary/90"
          >
            Get Started
          </Link>
          <Link
            href="/about"
            className="rounded-md border border-gray-300 px-6 py-3 text-lg font-semibold text-gray-900 shadow-sm hover:bg-gray-50"
          >
            Learn More
          </Link>
        </div>
      </div>

      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <h3 className="text-xl font-semibold">Track DO's</h3>
          <p className="mt-2 text-muted-foreground">
            Set and track positive goals you want to achieve
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold">Monitor DON'Ts</h3>
          <p className="mt-2 text-muted-foreground">
            Break bad habits and track your progress
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold">Smart Tracking</h3>
          <p className="mt-2 text-muted-foreground">
            Track progress with customizable time periods
          </p>
        </div>
      </div>
    </div>
  )
}
