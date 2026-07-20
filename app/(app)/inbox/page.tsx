"use client";

import { useMemo, useState } from "react";
import { getVisibleFeedback, updateFeedbackStatus } from "@/lib/demo-store";
import type { FeedbackSentiment, FeedbackStatus } from "@/lib/types";

const statusOptions = ["NEW", "REVIEWED", "ACTIONED"] as const;
const sentimentOptions = ["ALL", "POS", "NEU", "NEG"] as const;

type InboxFilterState = {
  channel: string;
  sentiment: FeedbackSentiment | "ALL";
  theme: string;
  status: FeedbackStatus | "ALL";
};

export default function InboxPage() {
  const [search, setSearch] = useState("");
  const [channel, setChannel] = useState("ALL");
  const [sentiment, setSentiment] = useState<InboxFilterState["sentiment"]>("ALL");
  const [theme, setTheme] = useState("ALL");
  const [status, setStatus] = useState<InboxFilterState["status"]>("ALL");
  const [page, setPage] = useState(1);
  const result = useMemo(() => getVisibleFeedback({ search, channel, sentiment, theme, status, page, pageSize: 6 }), [search, channel, sentiment, theme, status, page]);

  const handleStatusChange = (id: string, nextStatus: string) => {
    updateFeedbackStatus(id, nextStatus as typeof statusOptions[number]);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Inbox</p>
        <h2 className="text-3xl font-semibold text-white">Feedback inbox</h2>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search feedback" className="rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-white" />
        <select value={channel} onChange={(event) => setChannel(event.target.value)} className="rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-white">
          <option value="ALL">All channels</option>
          <option value="Support ticket">Support ticket</option>
          <option value="App Store">App Store</option>
          <option value="NPS survey">NPS survey</option>
          <option value="Sales call">Sales call</option>
          <option value="Community post">Community post</option>
        </select>
        <select value={sentiment} onChange={(event) => setSentiment(event.target.value as InboxFilterState["sentiment"])} className="rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-white">
          <option value="ALL">All sentiment</option>
          <option value="POS">Positive</option>
          <option value="NEU">Neutral</option>
          <option value="NEG">Negative</option>
        </select>
        <select value={theme} onChange={(event) => setTheme(event.target.value)} className="rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-white">
          <option value="ALL">All themes</option>
          <option value="Onboarding">Onboarding</option>
          <option value="Analytics">Analytics</option>
          <option value="Authentication">Authentication</option>
          <option value="Billing">Billing</option>
          <option value="Mobile">Mobile</option>
        </select>
        <select value={status} onChange={(event) => setStatus(event.target.value as InboxFilterState["status"])} className="rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-white">
          <option value="ALL">All status</option>
          <option value="NEW">New</option>
          <option value="REVIEWED">Reviewed</option>
          <option value="ACTIONED">Actioned</option>
        </select>
      </div>
      <div className="space-y-3">
        {result.items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm text-slate-400">{item.channel} · {item.customerLabel}</p>
                <p className="mt-1 text-lg font-medium text-white">{item.content}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-300">
                  {item.themes.map((theme) => <span key={theme} className="rounded-full border border-slate-700 px-2 py-1">{theme}</span>)}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <select defaultValue={item.status} onChange={(event) => handleStatusChange(item.id, event.target.value)} className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white">
                  {statusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
                <p className="text-sm text-slate-400">Sentiment: {item.sentiment}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between text-sm text-slate-400">
        <p>Showing {result.items.length} of {result.totalItems} items</p>
        <div className="flex gap-2">
          <button onClick={() => setPage((page) => Math.max(1, page - 1))} className="rounded-full border border-slate-700 px-3 py-2">Previous</button>
          <button onClick={() => setPage((page) => Math.min(result.totalPages, page + 1))} className="rounded-full border border-slate-700 px-3 py-2">Next</button>
        </div>
      </div>
    </div>
  );
}
