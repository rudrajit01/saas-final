export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-400">Welcome back</p>
        <h1 className="text-3xl font-bold text-white">Overview</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-5">
          <p className="text-sm text-slate-400">Total Tasks</p>
          <h2 className="mt-2 text-3xl font-bold text-white">24</h2>
        </div>

        <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-5">
          <p className="text-sm text-slate-400">Completed</p>
          <h2 className="mt-2 text-3xl font-bold text-white">18</h2>
        </div>

        <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-5">
          <p className="text-sm text-slate-400">Projects</p>
          <h2 className="mt-2 text-3xl font-bold text-white">5</h2>
        </div>

        <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-5">
          <p className="text-sm text-slate-400">Focus Hours</p>
          <h2 className="mt-2 text-3xl font-bold text-white">6.5h</h2>
        </div>
      </div>
    </div>
  );
}