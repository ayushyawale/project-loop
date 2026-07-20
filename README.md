# Project LOOP

Project LOOP is a polished full-stack demo inspired by the Zidio internship brief. It presents a multi-tenant feedback intelligence experience with:

- a workspace-style dashboard
- a feedback inbox with search, filters, pagination, and status workflow
- theme clustering and trend views
- a grounded Ask LOOP experience over seeded feedback
- saved Voice-of-Customer reports

## Stack

- Next.js 16 + TypeScript
- Tailwind CSS
- Recharts
- Lucide icons

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Demo credentials

- Admin: admin@northstar.dev / demo-admin
- Analyst: analyst@northstar.dev / demo-analyst
- Viewer: viewer@northstar.dev / demo-viewer

## Project structure

- app/(app) contains the authenticated product pages
- lib/demo-store.ts holds seeded demo data and simple state mutations
- lib/seed-data.ts includes the initial workspace, users, feedback, themes, and report seeds

## Notes

This repository implements a strong front-end and product experience to match the LOOP brief. It uses seeded demo data rather than a live database because the current workspace does not include a hosted Postgres/Anthropic setup.
