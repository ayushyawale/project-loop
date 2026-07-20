"use client";

import { useState } from "react";
import { answerQuestion } from "@/lib/demo-store";

export default function AskPage() {
  const [question, setQuestion] = useState("What are users saying about onboarding?");
  const [answer, setAnswer] = useState<string | null>(null);
  const [sources, setSources] = useState<Array<{ content: string }>>([]);

  const handleAsk = () => {
    const result = answerQuestion(question);
    setAnswer(result.answer);
    setSources(result.sources);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Ask LOOP</p>
        <h2 className="text-3xl font-semibold text-white">Grounded Q&A over your feedback</h2>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
        <textarea value={question} onChange={(event) => setQuestion(event.target.value)} className="min-h-24 w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-white" />
        <button onClick={handleAsk} className="mt-3 rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white">Ask LOOP</button>
      </div>
      {answer && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <h3 className="text-lg font-semibold text-white">Answer</h3>
          <p className="mt-2 text-sm leading-7 text-slate-300">{answer}</p>
          <div className="mt-4 space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Grounding evidence</p>
            {sources.map((source) => (
              <div key={source.content} className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-sm text-slate-300">
                {source.content}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
