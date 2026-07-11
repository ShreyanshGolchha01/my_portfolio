# My Portfolio

A personal developer portfolio website built with **Next.js (App Router)**, **TypeScript**, and **React**.

## Project Description

This project is a responsive portfolio site that showcases profile information, projects, blogs, GitHub activity visuals, and personal stats in a clean single-page experience. The home page is rendered via modular components under `components/portfolio`, making the UI easy to maintain and extend.

## Tech Stack

- Next.js `16.1.6`
- React `19.2.3`
- TypeScript
- ESLint

## Features

- Component-based portfolio layout
- Dedicated content modules for:
  - Home content
  - Blogs content
  - Footer actions
  - Site header
  - GitHub graph image section
  - Stats panel
- Centralized portfolio data file (`components/portfolio/data.ts`)

## Project Structure

```text
.
├── app/
│   └── page.tsx
├── components/
│   └── portfolio/
│       ├── blogs-content.tsx
│       ├── data.ts
│       ├── footer-actions.tsx
│       ├── github-graph-image.tsx
│       ├── home-content.tsx
│       ├── silly-stats-panel.tsx
│       └── site-header.tsx
├── public/
├── package.json
└── tsconfig.json
```

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Available Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run start` — Start production server
- `npm run lint` — Run lint checks

## Deployment

You can deploy this Next.js application on any platform that supports Node.js, such as Vercel.