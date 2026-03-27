<div align="center">

# Ansh Modi — Portfolio

**Full Stack Developer · Remote · Available for Work**

A premium, production-grade portfolio built with Next.js 16, GSAP, and a custom Express backend — deployed globally on Vercel + Render.

[![Live Site](https://img.shields.io/badge/Live%20Site-anshmodi.com-FB460D?style=for-the-badge&logo=vercel&logoColor=white)](https://www.anshmodi.com)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://main-portfolio-pvub.onrender.com/api/health)
[![GitHub](https://img.shields.io/badge/GitHub-Anshmodi03-181717?style=for-the-badge&logo=github)](https://github.com/Anshmodi03)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-ansh--modi-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/ansh-modi-/)

</div>

---

## Overview

This is not a template — every detail is custom-built. GSAP powers every animation, shadcn/ui (base-ui variant) drives all interactive elements, and a Node.js/Express backend handles contact form submissions with MongoDB persistence and email delivery via Resend.

**No WebGL. No Three.js. No particle systems.** Just fast, precise, performant web.

---

## Tech Stack

### Frontend

| Category | Technology |
|---|---|
| Framework | Next.js 16.1 (App Router, Turbopack) |
| Language | TypeScript 5 + React 19 |
| Styling | TailwindCSS v4 + CSS custom properties |
| UI Primitives | shadcn/ui (base-ui variant) |
| Animations | GSAP 3.14 — ScrollTrigger, SplitText, DrawSVG, ScrambleText, MotionPath |
| Smooth Scroll | Lenis 1.3 synced with GSAP ScrollTrigger |
| Forms | react-hook-form + Zod validation |
| Toasts | Sonner |
| Icons | Lucide React |
| Fonts | Space Grotesk (headings) · Geist Mono (code/mono) |

### Backend

| Category | Technology |
|---|---|
| Runtime | Node.js 20 |
| Framework | Express.js 5 |
| Language | TypeScript 5 |
| Database | MongoDB Atlas via Mongoose 9 |
| Email | Resend (HTTP API, domain verified) |
| Security | Helmet · CORS · express-rate-limit · express-validator |

### Infrastructure

| Service | Purpose |
|---|---|
| Vercel | Frontend hosting, Edge Network, ISR |
| Render | Backend hosting (Node.js web service) |
| MongoDB Atlas | Contact form persistence |
| Resend | Transactional email (domain: anshmodi.com) |
| UptimeRobot | Backend keepalive ping every 5 min |

---

## Project Structure

```
Main Portfolio/
├── frontend/                   # Next.js 16 app
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx      # Fonts, metadata, global providers
│   │   │   ├── page.tsx        # Section composition
│   │   │   ├── icon.svg        # Custom AM favicon (auto-detected by Next.js)
│   │   │   └── api/
│   │   │       ├── contact/    # Proxy → Express backend
│   │   │       └── github/     # GitHub stats (ISR, 1h revalidate)
│   │   ├── components/
│   │   │   ├── sections/       # 14 page sections (00-Preloader → 13-WorkTogether)
│   │   │   └── ui/             # shadcn primitives + custom components
│   │   ├── lib/
│   │   │   ├── data.ts         # All portfolio content (typed)
│   │   │   ├── gsap.ts         # GSAP plugin registration + Lenis sync
│   │   │   └── utils.ts        # cn(), clamp()
│   │   ├── providers/
│   │   │   └── LenisProvider.tsx
│   │   └── styles/
│   │       └── globals.css     # Design tokens, @keyframes, base reset
│   ├── public/
│   │   ├── project/            # Project screenshots
│   │   ├── certificates/       # Experience certificates (PDF)
│   │   └── resume/             # Resume PDF
│   └── .env                    # BACKEND_URL (gitignored)
│
└── backend/                    # Express.js API
    ├── src/
    │   ├── index.ts            # App entry, MongoDB connect, middleware stack
    │   ├── controllers/
    │   │   └── contactController.ts  # Save to DB + send email via Resend
    │   ├── middleware/
    │   │   ├── cors.ts         # Origin allow-list (server-to-server allowed)
    │   │   ├── rateLimit.ts    # 10 req / 15 min per IP on /api/contact
    │   │   └── validation.ts   # express-validator rules
    │   ├── models/
    │   │   └── Contact.ts      # Mongoose schema
    │   └── routes/
    │       └── contact.ts
    └── .env                    # Secrets (gitignored)
```

---

## Sections

| # | Section | Description |
|---|---|---|
| 00 | Preloader | Name reveal + curtain wipe (~2.75s GSAP timeline) |
| 01 | Hero | Role headline, terminal widget, CTAs, tech strip |
| 02 | Marquee | Scrolling tech stack ticker |
| 03 | About | Bio, stat cards, SpinButton CTAs |
| 04 | Skills | Categorised skill grid with level indicators |
| 05 | Projects | 4 featured sticky-scroll project cards |
| 10 | Cinematic | Canvas image sequence + GSAP end-state reveal |
| 06 | Experience | Editorial numbered stack — MissionT5, NullClass |
| 07 | Exploring | Magic bento grid (ML, AI, DevOps, Blockchain…) |
| 08 | Process | 2×2 card grid — Discovery → Design → Build → Deliver |
| 09 | Contact | Editorial 2-column form + info panel |
| 11 | GitHub Stats | Live data via ISR route (50 repos, language breakdown) |
| 12 | Services | Service offerings |
| 13 | Work Together | Final CTA section |

---

## Local Development

### Prerequisites

- Node.js 20+
- MongoDB Atlas URI
- Resend API key (for email in production)

### 1. Clone

```bash
git clone https://github.com/Anshmodi03/main-portfolio.git
cd main-portfolio
```

### 2. Backend

```bash
cd backend
npm install

# Create .env
cp .env.example .env   # or create manually — see variables below
```

**`backend/.env`**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/portfolio
RESEND_API_KEY=re_xxxxxxxxxxxx
EMAIL_FROM=Portfolio Contact <contact@yourdomain.com>
RECEIVER_EMAIL=you@youremail.com
FRONTEND_URL=http://localhost:3000
```

```bash
npm run dev       # ts-node watch mode
```

### 3. Frontend

```bash
cd frontend
npm install

# Create .env
echo "BACKEND_URL=http://localhost:5000" > .env
```

```bash
npm run dev       # Next.js on http://localhost:3000
```

---

## Environment Variables

### Frontend

| Variable | Required | Description |
|---|---|---|
| `BACKEND_URL` | Yes | Express backend URL |

### Backend

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (Render sets this automatically) |
| `NODE_ENV` | Yes | `development` or `production` |
| `MONGODB_URI` | Yes | MongoDB Atlas connection string — app exits if missing |
| `RESEND_API_KEY` | Yes | Resend API key — email silently skipped if unset |
| `EMAIL_FROM` | No | Sender address (defaults to `onboarding@resend.dev`) |
| `RECEIVER_EMAIL` | Yes | Inbox that receives contact form submissions |
| `FRONTEND_URL` | Yes | Vercel URL for CORS allow-list — no trailing slash |

---

## Deployment

### Backend → Render

| Setting | Value |
|---|---|
| Build Command | `npm install --include=dev && npm run build` |
| Start Command | `npm start` |
| Environment | Add all backend env vars in Render dashboard |

### Frontend → Vercel

| Setting | Value |
|---|---|
| Framework | Next.js (auto-detected) |
| Environment | Add `BACKEND_URL=https://<render-service>.onrender.com` |

**UptimeRobot:** Add an HTTP monitor for `https://<render-service>.onrender.com/api/health` at 5-minute intervals to prevent Render free-tier cold starts.

---

## Design System

All design tokens live in `frontend/src/styles/globals.css` as CSS custom properties.

```css
--bg-base:       #080808   /* page background          */
--bg-surface:    #111111   /* cards, alt sections      */
--accent:        #fb460d   /* flame orange-red (brand) */
--text-primary:  #f5f5f5
--text-muted:    #888888
--font-heading:  "Space Grotesk", system-ui
--font-mono:     "Geist Mono", monospace
```

**Rule:** All layout, spacing, and colour → Tailwind utilities in JSX. `globals.css` contains only tokens, `@keyframes`, GSAP start states, and the base reset.

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check — returns status, timestamp, uptime |
| `POST` | `/api/contact` | Submit contact form (rate-limited: 10 req / 15 min) |

**`POST /api/contact` — request body:**
```json
{
  "name": "string (2–100 chars)",
  "email": "valid email",
  "subject": "string (3–200 chars)",
  "message": "string (10–2000 chars)"
}
```

---

<div align="center">

Built by **Ansh Modi** · [anshmodi.com](https://www.anshmodi.com) · [LinkedIn](https://www.linkedin.com/in/ansh-modi-/) · [GitHub](https://github.com/Anshmodi03)

</div>
