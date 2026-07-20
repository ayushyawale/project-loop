"use client";

import { useMemo } from "react";
import { getThemeStats, getThemeTrend } from "@/lib/simulated-ai";

export default function ThemesPage() {
  const themeStats = useMemo(() => getThemeStats(), []);
  const trends = useMemo(() => getThemeTrend(), []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Themes</p>
        <h2 className="text-3xl font-semibold text-white">Theme clustering and trends</h2>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <h3 className="mb-4 text-lg font-semibold">Theme counts</h3>
          <div className="space-y-3">
            {themeStats.map((theme) => (
              <div key={theme.name} className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>{theme.name}</span>
                  <span>{theme.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <h3 className="mb-4 text-lg font-semibold">Trend view</h3>
          <div className="space-y-3">
            {trends.map((entry) => (
              <div key={entry.name} className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>{entry.name}</span>
                  <span>{entry.count} mentions</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
