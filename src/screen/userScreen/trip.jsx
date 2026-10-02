

import { Link } from 'react-router-dom';

function Trip() {
  return (
    <div className="min-h-full bg-slate-50 p-5 text-slate-800 sm:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
            Your travel plans
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">My trips</h1>
          <p className="mt-2 text-sm text-slate-500">
            Keep your destinations, budget, and travel ideas together.
          </p>
        </header>
        <section className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-2xl">
            ✈
          </div>
          <h2 className="mt-4 text-lg font-bold">Your next trip starts here</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            You do not have any trips planned yet. Explore a destination to start
            collecting ideas for your next getaway.
          </p>
          <Link
            className="mt-5 inline-flex rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800"
            to="/explore"
          >
            Explore destinations
          </Link>
        </section>
      </div>
    </div>
  );
}

export default Trip;