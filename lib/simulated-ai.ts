import { seedData } from "@/lib/seed-data";

const feedback = seedData.feedback;
const themes = seedData.themes;
const reports = seedData.reports;

export function getThemeStats() {
  const counts = new Map<string, number>();
  feedback.forEach((item) => {
    item.themes.forEach((theme) => {
      counts.set(theme, (counts.get(theme) ?? 0) + 1);
    });
  });
  return Array.from(counts.entries()).map(([name, value]) => ({ name, value }));
}

export function getDashboardSummary() {
  const totalItems = feedback.length;
  const neg = feedback.filter((item) => item.sentiment === "NEG").length;
  const newCount = feedback.filter((item) => item.status === "NEW").length;
  const negativePct = Math.round((neg / totalItems) * 100);
  return { totalItems, negativePct, newCount };
}

export function getThemeTrend() {
  return themes.map((theme) => ({
    name: theme.name,
    count: feedback.filter((item) => item.themes.includes(theme.name)).length,
  }));
}

export function buildReportNarrative() {
  const summary = reports[0]?.contentJson ? JSON.parse(reports[0].contentJson) : {};
  return summary.summary || "Weekly report generated from seeded feedback.";
}
