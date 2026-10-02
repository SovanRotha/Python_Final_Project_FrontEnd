

function AIAssistant() {
  return (
    <div className="min-h-full bg-slate-50 p-5 text-slate-800 sm:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
            TripOS AI
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">Travel assistant</h1>
          <p className="mt-2 text-sm text-slate-500">
            Get help with ideas, itineraries, and travel preparation.
          </p>
        </header>
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="rounded-xl bg-indigo-50 p-5">
            <p className="font-semibold text-indigo-950">Hello! Where are you planning to go?</p>
            <p className="mt-2 text-sm text-indigo-800">
              The travel assistant is ready to help you plan a trip. AI chat
              responses are not connected yet.
            </p>
          </div>
          <label className="mt-5 block">
            <span className="sr-only">Message the travel assistant</span>
            <input
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
              disabled
              placeholder="AI chat is not connected yet"
            />
          </label>
        </section>
      </div>
    </div>
  );
}

export default AIAssistant;