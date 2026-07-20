import Link from "next/link";
import { BarChart3, Inbox, MessageSquareText, Sparkles, UserCog } from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const links = [
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/inbox", label: "Inbox", icon: Inbox },
    { href: "/themes", label: "Themes", icon: Sparkles },
    { href: "/ask", label: "Ask LOOP", icon: MessageSquareText },
    { href: "/reports", label: "Reports", icon: UserCog },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row">
        <aside className="w-full rounded-2xl border border-slate-800 bg-slate-900/80 p-4 lg:w-72">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Project LOOP</p>
            <h1 className="mt-2 text-2xl font-semibold">Customer Feedback Intelligence</h1>
          </div>
          <nav className="space-y-2">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="flex-1 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-2xl shadow-slate-950/40 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
