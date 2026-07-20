"use client";

import { useMemo } from "react";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import { getAnalytics } from "@/lib/demo-store";

const COLORS = ["#22c55e", "#3b82f6", "#ef4444"];

export default function DashboardPage() {
  const analytics = useMemo(() => getAnalytics(), []);
  const volumeEntries = Object.entries(analytics.volume).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Analytics</p>
          <h2 className="text-3xl font-semibold text-white">Customer feedback dashboard</h2>
        </div>
        <div className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300">
          Workspace: Northstar Labs
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <p className="text-sm text-slate-400">Total items</p>
          <p className="mt-2 text-3xl font-semibold">{analytics.totalItems}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <p className="text-sm text-slate-400">Negative %</p>
          <p className="mt-2 text-3xl font-semibold">{analytics.negativePercent}%</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <p className="text-sm text-slate-400">New this week</p>
          <p className="mt-2 text-3xl font-semibold">{analytics.newItems}</p>
        </div>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <h3 className="mb-4 text-lg font-semibold">Volume over time</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeEntries}>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="value" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <h3 className="mb-6 text-lg font-semibold">Sentiment breakdown</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={analytics.sentimentBreakdown} dataKey="value" nameKey="name" innerRadius={50} outerRadius={100} paddingAngle={2}>
                  {analytics.sentimentBreakdown.map((entry, index) => (
                    <Cell key={`${entry.name}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
        <h3 className="mb-4 text-lg font-semibold">Top themes</h3>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {analytics.topThemes.map((theme) => (
            <div key={theme.name} className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
              <p className="text-sm text-slate-400">{theme.name}</p>
              <p className="mt-2 text-2xl font-semibold text-white">{theme.count} items</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
