export type Role = "ADMIN" | "ANALYST" | "VIEWER";
export type FeedbackStatus = "NEW" | "REVIEWED" | "ACTIONED";
export type FeedbackSentiment = "POS" | "NEU" | "NEG";

export interface Workspace {
  id: string;
  name: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  workspaceId: string;
}

export interface Feedback {
  id: string;
  content: string;
  channel: string;
  sourceRef: string;
  customerLabel: string;
  sentiment: FeedbackSentiment;
  sentimentScore: number;
  status: FeedbackStatus;
  createdAt: string;
  workspaceId: string;
  themes: string[];
  featureArea: string;
  rationale: string;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  color: string;
  workspaceId: string;
}

export interface Report {
  id: string;
  title: string;
  periodStart: string;
  periodEnd: string;
  contentJson: string;
  createdAt: string;
  workspaceId: string;
  generatedBy: string;
}

export interface AppData {
  workspaces: Workspace[];
  users: User[];
  feedback: Feedback[];
  themes: Theme[];
  reports: Report[];
}
