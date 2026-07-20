import { seedData } from "@/lib/seed-data";
import type { Feedback, FeedbackSentiment, FeedbackStatus, Report, Theme, User, Workspace } from "@/lib/types";

export interface DemoState {
  currentUserId: string | null;
  workspaces: Workspace[];
  users: User[];
  feedback: Feedback[];
  themes: Theme[];
  reports: Report[];
}

const state: DemoState = {
  currentUserId: null,
  workspaces: seedData.workspaces.map((item) => ({ ...item })),
  users: seedData.users.map((item) => ({ ...item })),
  feedback: seedData.feedback.map((item) => ({ ...item })),
  themes: seedData.themes.map((item) => ({ ...item })),
  reports: seedData.reports.map((item) => ({ ...item })),
};

export function resetDemoStore() {
  state.currentUserId = null;
  state.workspaces = seedData.workspaces.map((item) => ({ ...item }));
  state.users = seedData.users.map((item) => ({ ...item }));
  state.feedback = seedData.feedback.map((item) => ({ ...item }));
  state.themes = seedData.themes.map((item) => ({ ...item }));
  state.reports = seedData.reports.map((item) => ({ ...item }));
}

export function setCurrentUser(userId: string | null) {
  state.currentUserId = userId;
}

export function getDemoState() {
  return state;
}

export function getCurrentUser() {
  return state.users.find((user) => user.id === state.currentUserId) ?? null;
}

export function getVisibleFeedback(params: {
  search?: string;
  channel?: string;
  sentiment?: FeedbackSentiment | "ALL";
  theme?: string;
  status?: FeedbackStatus | "ALL";
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}) {
  const search = params.search?.toLowerCase() ?? "";
  const filtered = state.feedback.filter((item) => {
    const matchesSearch = search.length === 0 || item.content.toLowerCase().includes(search);
    const matchesChannel = !params.channel || params.channel === "ALL" || item.channel === params.channel;
    const matchesSentiment = !params.sentiment || params.sentiment === "ALL" || item.sentiment === params.sentiment;
    const matchesTheme = !params.theme || params.theme === "ALL" || item.themes.includes(params.theme);
    const matchesStatus = !params.status || params.status === "ALL" || item.status === params.status;
    const matchesStart = !params.startDate || new Date(item.createdAt) >= new Date(params.startDate);
    const matchesEnd = !params.endDate || new Date(item.createdAt) <= new Date(params.endDate);
    return matchesSearch && matchesChannel && matchesSentiment && matchesTheme && matchesStatus && matchesStart && matchesEnd;
  });

  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 6;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  return {
    items: filtered.slice((safePage - 1) * pageSize, safePage * pageSize),
    page: safePage,
    pageSize,
    totalPages,
    totalItems: filtered.length,
  };
}

export function createFeedback(input: Partial<Feedback>) {
  const themeNames = input.themes?.length ? input.themes : ["General"];
  const created: Feedback = {
    id: `fb-${Date.now()}`,
    content: input.content ?? "",
    channel: input.channel ?? "Manual",
    sourceRef: input.sourceRef ?? `manual-${Date.now()}`,
    customerLabel: input.customerLabel ?? "New customer",
    sentiment: input.sentiment ?? "NEU",
    sentimentScore: input.sentimentScore ?? 0,
    status: input.status ?? "NEW",
    createdAt: new Date().toISOString(),
    workspaceId: state.workspaces[0]?.id ?? "workspace-demo",
    themes: themeNames,
    featureArea: input.featureArea ?? "General",
    rationale: input.rationale ?? "Classified from simulated ingestion.",
  };
  state.feedback.unshift(created);
  return created;
}

export function importFeedbackRows(rows: Array<Partial<Feedback>>) {
  const imported = rows.map((row) => createFeedback(row));
  return imported;
}

export function simulateChannel(channel: string) {
  const samples = [
    { content: `New feedback from ${channel}: team wants faster export workflows.`, channel, sourceRef: `${channel.toLowerCase()}-seed`, customerLabel: "Demo customer", sentiment: "POS" as FeedbackSentiment, sentimentScore: 0.74, themes: ["Analytics"], featureArea: "Exports", rationale: "Simulated channel ingestion" },
    { content: `Another ${channel} note: mobile navigation still feels clumsy during the first run.`, channel, sourceRef: `${channel.toLowerCase()}-seed-2`, customerLabel: "Demo customer", sentiment: "NEG" as FeedbackSentiment, sentimentScore: -0.78, themes: ["Mobile"], featureArea: "Navigation", rationale: "Simulated channel ingestion" },
    { content: `The ${channel} channel surfaced a request for clearer setup guidance.`, channel, sourceRef: `${channel.toLowerCase()}-seed-3`, customerLabel: "Demo customer", sentiment: "NEU" as FeedbackSentiment, sentimentScore: 0.15, themes: ["Onboarding"], featureArea: "Getting started", rationale: "Simulated channel ingestion" },
  ];
  const created = samples.map((row) => createFeedback(row));
  return created;
}

export function updateFeedbackStatus(id: string, status: FeedbackStatus) {
  const item = state.feedback.find((entry) => entry.id === id);
  if (item) item.status = status;
  return item ?? null;
}

export function reclassifyFeedback(id: string) {
  const item = state.feedback.find((entry) => entry.id === id);
  if (!item) return null;
  item.sentiment = item.sentiment === "NEG" ? "POS" : "NEG";
  item.sentimentScore = item.sentiment === "NEG" ? -0.6 : 0.7;
  item.rationale = `Re-classified by the simulated AI engine for ${item.channel}.`;
  return item;
}

export function getAnalytics() {
  const totalItems = state.feedback.length;
  const negativeItems = state.feedback.filter((item) => item.sentiment === "NEG").length;
  const newItems = state.feedback.filter((item) => item.status === "NEW").length;
  const topThemes = state.themes
    .map((theme) => ({
      name: theme.name,
      count: state.feedback.filter((item) => item.themes.includes(theme.name)).length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);
  const volume = state.feedback.reduce<Record<string, number>>((acc, item) => {
    const day = item.createdAt.slice(0, 10);
    acc[day] = (acc[day] ?? 0) + 1;
    return acc;
  }, {});
  const sentimentBreakdown = [
    { name: "Positive", value: state.feedback.filter((item) => item.sentiment === "POS").length },
    { name: "Neutral", value: state.feedback.filter((item) => item.sentiment === "NEU").length },
    { name: "Negative", value: negativeItems },
  ];
  return {
    totalItems,
    negativePercent: Math.round((negativeItems / totalItems) * 100),
    newItems,
    topThemes,
    volume,
    sentimentBreakdown,
  };
}

export function answerQuestion(question: string) {
  const normalized = question.toLowerCase();
  const candidateItems = state.feedback.filter((item) => normalized.includes(item.featureArea.toLowerCase()) || item.content.toLowerCase().includes(normalized));
  const sources = candidateItems.slice(0, 3);
  const answer = sources.length
    ? `Based on the current workspace feedback, ${normalized.includes("onboarding") ? "onboarding friction remains the biggest theme" : "the strongest signal is around product clarity and setup pain"}. The most relevant evidence includes ${sources.map((item) => item.content).join(" | ")}`
    : "I could not find enough matching feedback in the current workspace to answer confidently.";
  return { answer, sources };
}

export function createReport() {
  const analytics = getAnalytics();
  const report: Report = {
    id: `report-${Date.now()}`,
    title: "Simulated VoC report",
    periodStart: "2025-02-10",
    periodEnd: "2025-02-24",
    contentJson: JSON.stringify({ summary: `Top themes: ${analytics.topThemes.map((theme) => theme.name).join(", ")}`, themes: analytics.topThemes.map((theme) => theme.name), quotes: state.feedback.slice(0, 3).map((item) => item.content) }),
    createdAt: new Date().toISOString(),
    workspaceId: state.workspaces[0]?.id ?? "workspace-demo",
    generatedBy: state.currentUserId ?? "admin-1",
  };
  state.reports.unshift(report);
  return report;
}

export function buildReportNarrative() {
  const latest = state.reports[0];
  if (!latest) return "No report generated yet.";
  const parsed = JSON.parse(latest.contentJson);
  return parsed.summary || "No report generated yet.";
}

export function getReports() {
  return state.reports;
}
