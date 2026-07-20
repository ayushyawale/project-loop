"use client";

import { useMemo, useState } from "react";
import { buildReportNarrative, createReport, getReports } from "@/lib/demo-store";

export default function ReportsPage() {
  const [reportText, setReportText] = useState("");
  const reports = useMemo(() => getReports(), []);

  const handleGenerate = () => {
    const newReport = createReport();
    setReportText(newReport.contentJson);
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Reports</p>
          <h2 className="text-3xl font-semibold text-white">Voice-of-Customer report</h2>
        </div>
        <button onClick={handleGenerate} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">Generate report</button>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
        <p className="text-sm text-slate-400">Narrative</p>
        <p className="mt-2 text-sm leading-7 text-slate-300">{buildReportNarrative()}</p>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
        <h3 className="text-lg font-semibold text-white">Saved reports</h3>
        <div className="mt-4 space-y-3">
          {reports.map((report) => (
            <div key={report.id} className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-sm text-slate-300">
              <div className="flex items-center justify-between">
                <span>{report.title}</span>
                <span>{report.createdAt.slice(0, 10)}</span>
              </div>
              <p className="mt-2 text-slate-400">{report.contentJson}</p>
            </div>
          ))}
        </div>
      </div>
      <textarea value={reportText} onChange={(event) => setReportText(event.target.value)} className="min-h-32 w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-white" placeholder="Generated report JSON will appear here" />
    </div>
  );
}
