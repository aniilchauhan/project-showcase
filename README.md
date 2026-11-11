# DevShowcase

A personal portfolio and project showcase with an AI assistant, a CMS-style admin dashboard, and live GitHub stats for each project.

Built with React 19, TypeScript, Vite, Tailwind CSS v4, Firebase and the Gemini API.

## Features

- **Project gallery** with category filters (Mobile, Web, AI, SaaS, E-commerce) and detail pages with galleries, tech stack and links
- **"Ask Anil" AI chatbot** that answers visitor questions about my background and projects, powered by Gemini
- **Admin dashboard** (Firebase Auth) to add, edit and feature projects, with AI-generated short and full descriptions
- **Live GitHub stats** (stars, forks, language, last update) pulled from the GitHub API per project
- **Dark / light theme**, smooth animations (Motion), and analytics charts (Recharts)
- **Locked-down Firestore rules**: deny-by-default, admin-only writes

## Tech stack

| Area | Tools |
| --- | --- |
| UI | React 19, TypeScript, Tailwind CSS v4, Motion, Lucide icons |
| Routing | React Router v7 |
| Backend | Express (dev server), Firebase Auth + Firestore |
| AI | Google Gemini (`@google/genai`) |
| Build | Vite 6, tsx |

## Project structure

```
src/
  pages/        Home, Projects, ProjectDetails, Contact, Login, AdminDashboard
  components/   Navbar, Footer, ProjectCard, Chatbot, admin/ProjectModal
  hooks/        useAuth, useProjects, useTheme
  services/     aiService (Gemini), githubService (GitHub API)
  lib/          firebase, tracking, utils
server.ts       Express + Vite dev server
firestore.rules Firestore security rules
```

## Run locally

**Prerequisites:** Node.js 20+

```bash
npm install
cp .env.example .env.local   # then add your GEMINI_API_KEY
npm run dev
```

Other scripts: `npm run build`, `npm run preview`, `npm run lint` (type-check).

## License

[MIT](LICENSE) © Anil Chauhan
