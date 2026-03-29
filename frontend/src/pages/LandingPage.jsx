import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen text-slate-100">
      <header className="border-b border-slate-800/80 bg-slate-950/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-400 text-sm font-semibold text-slate-950">SB</span>
            <h1 className="truncate text-lg font-bold text-white sm:text-xl">SkillBarter</h1>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <Link to="/auth" className="secondary-button px-3 py-2 sm:px-4">
              Login
            </Link>
            <Link to="/auth" className="primary-button px-3 py-2 sm:px-4">
              Start
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div className="max-w-3xl">
            <p className="section-label">Skill exchange platform</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Exchange skills without money
            </h2>
            <p className="mt-5 max-w-2xl text-base text-slate-300 sm:text-lg">
              Learn from other people by sharing what you already know. Offer one skill,
              request another, and manage everything in one clean dashboard.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link to="/auth" className="primary-button text-center">
                Get Started
              </Link>
              <Link to="/auth" className="secondary-button text-center">
                Login
              </Link>
            </div>
          </div>

          <div className="surface-card p-5 sm:p-8">
            <div className="rounded-3xl bg-slate-950 p-5 text-white sm:p-6">
              <p className="text-sm text-slate-400">Live workflow</p>
              <h3 className="mt-3 text-xl font-semibold sm:text-2xl">React in exchange for UI Design</h3>
              <p className="mt-3 text-sm text-slate-400">
                Request a swap, get accepted, and move into a private message thread to plan the exchange.
              </p>
            </div>
            <div className="mt-4 grid gap-4 sm:mt-5 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-950/80 p-5">
                <p className="text-sm text-slate-400">Requests tracked</p>
                <p className="mt-3 text-3xl font-bold text-white">3 states</p>
                <p className="mt-1 text-sm text-slate-400">Pending, accepted, rejected</p>
              </div>
              <div className="rounded-2xl bg-slate-950/80 p-5">
                <p className="text-sm text-slate-400">Contact flow</p>
                <p className="mt-3 text-3xl font-bold text-white">1 click</p>
                <p className="mt-1 text-sm text-slate-400">Chat opens after acceptance</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-4 sm:mt-16 md:grid-cols-3">
          <div className="soft-card p-6">
            <p className="text-sm font-medium text-white">1. Create profile</p>
            <p className="mt-2 text-sm text-slate-400">Add your bio, what you can teach, and what you want to learn.</p>
          </div>
          <div className="soft-card p-6">
            <p className="text-sm font-medium text-white">2. Find people</p>
            <p className="mt-2 text-sm text-slate-400">Browse all users in the feed and send a simple swap request.</p>
          </div>
          <div className="soft-card p-6">
            <p className="text-sm font-medium text-white">3. Start the exchange</p>
            <p className="mt-2 text-sm text-slate-400">Accept requests, open chat, and plan the next step together.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
