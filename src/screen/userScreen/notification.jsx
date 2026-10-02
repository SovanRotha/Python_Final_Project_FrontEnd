

function Notification() {
  return (
    <div className="min-h-full bg-slate-50 p-5 text-slate-800 sm:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
            Updates
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">Notifications</h1>
          <p className="mt-2 text-sm text-slate-500">
            Important updates about your travel workspace.
          </p>
        </header>
        <section className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-700">
            <span aria-hidden="true" className="text-xl">✓</span>
          </div>
          <h2 className="mt-4 text-lg font-bold">You’re all caught up</h2>
          <p className="mt-2 text-sm text-slate-500">
            New trip reminders and updates will appear here.
          </p>
        </section>
      </div>
    </div>
  );
}

export default Notification;