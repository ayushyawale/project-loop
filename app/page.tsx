import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.18),_transparent_48%),linear-gradient(135deg,_#020617,_#111827)] px-6 py-12 text-white">
      <div className="max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl shadow-black/40">
        <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Project LOOP</p>
        <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">AI Customer-Feedback Intelligence Platform</h1>
        <p className="mt-5 text-lg leading-8 text-slate-300">
          LOOP turns scattered feedback into themes, sentiment, trends, and grounded answers. This demo delivers a polished full-stack experience with a multi-role workspace shell and real seeded data.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/dashboard" className="rounded-full bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-500">Open dashboard</Link>
          <Link href="/inbox" className="rounded-full border border-slate-700 px-5 py-3 font-semibold text-slate-200 transition hover:bg-slate-800">View inbox</Link>
        </div>
        <div className="mt-8 grid gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-sm text-slate-300 sm:grid-cols-3">
          <div><p className="font-semibold text-white">Demo roles</p><p>Admin · Analyst · Viewer</p></div>
          <div><p className="font-semibold text-white">Core features</p><p>Inbox, filters, dashboard, reports</p></div>
          <div><p className="font-semibold text-white">AI features</p><p>Classification, themes, Ask LOOP</p></div>
        </div>
      </div>
    </main>
  );
}
