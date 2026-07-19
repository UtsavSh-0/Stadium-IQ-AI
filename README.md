# 🏟️ StadiumIQ AI

> An AI-powered Stadium Operations & Fan Experience Platform built for the FIFA World Cup 2026.

StadiumIQ AI is a GenAI-enabled web application that enhances stadium operations and improves the tournament experience for both **Operations Managers** and **Fans**. The platform combines modern UI/UX with Generative AI to provide real-time operational intelligence, intelligent navigation, multilingual assistance, crowd insights, and personalized guidance.

---

## 🌍 Problem Statement

Large sporting events such as the FIFA World Cup involve millions of visitors, making stadium management increasingly complex. Challenges include:

- Crowd congestion
- Long queues
- Difficult navigation
- Transportation coordination
- Accessibility support
- Emergency response
- Multilingual communication
- Operational decision-making

StadiumIQ AI addresses these challenges using Generative AI and intelligent dashboards.

---

# ✨ Key Features

## 👨‍💼 Operations Manager Dashboard

A centralized AI-powered command center for stadium operators.

### Features

- 📊 Live Stadium Dashboard
- 👥 Crowd Density Monitoring
- 🔥 AI Crowd Prediction
- 🚪 Smart Gate Management
- 🚗 Parking Status
- 🚌 Transportation Monitoring
- 🧑‍🤝‍🧑 Volunteer Management
- 🚑 Emergency Dashboard
- 🚨 Incident Management
- 📈 Analytics & Reports
- 🌱 Sustainability Insights
- 🤖 AI Decision Support
- 🔔 Live Notifications

---

## 🎟️ Fan Dashboard

An intelligent assistant for spectators attending the event.

### Features

- 🤖 AI Stadium Assistant
- 🪑 Find My Seat
- 🗺️ Indoor Stadium Navigation
- 🚻 Nearest Washroom
- 🍔 Food Court Finder
- 🛍️ Merchandise Locator
- 🚪 Smart Exit Recommendation
- 🚇 Transportation Guidance
- 🌍 Multilingual Support
- ♿ Accessibility Assistance
- 🚨 Emergency Help
- 🔔 Live Match Notifications

---

# 🤖 Generative AI Capabilities

- Conversational Stadium Assistant
- AI Route Recommendations
- Crowd Analysis
- Predictive Congestion Detection
- Operational Recommendations
- Incident Summarization
- Multilingual Translation
- Voice Assistance
- Context-Aware Responses
- AI Report Generation

---

# 🖥️ Tech Stack

## Frontend

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Zustand
- React Query
- Recharts
- Lucide Icons

---

## AI

- Google Gemini API / OpenAI API
- Natural Language Processing
- Prompt Engineering
- AI Recommendations

---

## UI/UX

- Glassmorphism
- Modern Dashboard
- Responsive Design
- Dark & Light Theme
- Interactive Components
- Animated Cards
- Heatmaps
- Premium SaaS Interface

---

# 📁 Project Structure

```
app/
│
├── (landing)
├── dashboard/
│   ├── operations/
│   ├── fan/
│   ├── assistant/
│   ├── navigation/
│   ├── crowd/
│   ├── analytics/
│
components/
│
├── ai/
├── analytics/
├── dashboard/
├── emergency/
├── layout/
├── map/
├── transport/
├── ui/
├── volunteer/
│
lib/
hooks/
services/
store/
types/
utils/
public/
```

---

# 🎯 Target Users

### 👨‍💼 Operations Managers

- Stadium Operators
- Security Teams
- Volunteers
- Event Organizers
- Transport Coordinators
- Emergency Response Teams

### 🎟️ Fans

- Stadium Visitors
- Families
- International Tourists
- First-time Visitors
- People with Accessibility Needs

---

# 🚀 Future Scope

- Live IoT Sensor Integration
- Real-Time CCTV AI Analytics
- Digital Stadium Twin
- Face Recognition (Privacy-Compliant)
- Smart Parking Integration
- Wearable Device Support
- Smart Ticket Validation
- AI Voice Navigation
- Predictive Crowd Simulation

---

# 💡 Why StadiumIQ AI?

StadiumIQ AI transforms traditional stadium management into an AI-assisted experience by combining operational intelligence with personalized fan support. Instead of acting as a simple chatbot, the platform provides context-aware recommendations, predictive insights, and intuitive navigation to improve safety, efficiency, and the overall tournament experience.

---

# 📸 Screenshots

> Add screenshots or demo GIFs here after completing the project.

---

# ⚡ Getting Started

## 1. Clone and install

```bash
git clone https://github.com/your-username/stadiumiq-ai.git
cd stadiumiq-ai
npm install
```

## 2. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in the values from your Supabase dashboard (Project Settings → API).
`config/env.ts` validates everything at startup and fails fast with a clear
message if something is missing.

| Variable | Scope | Required | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Public (browser) | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public (browser) | ✅ | Anon key — safe to expose, all access goes through RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server-only secret** | Optional | Bypasses RLS; only used by trusted server code (`lib/supabase/admin.ts`) |
| `SUPABASE_DB_URL` | **Server-only secret** | Optional | Direct Postgres URL for migration tooling only |
| `GEMINI_API_KEY` | **Server-only secret** | Not yet | Reserved for the Gemini integration; assistant API returns 503 until set |
| `AI_MODEL` | Server | Optional | Gemini model id (default `gemini-2.0-flash`) |
| `AI_MAX_OUTPUT_TOKENS` | Server | Optional | Cost ceiling per AI response (default `1024`) |
| `APP_URL` | Server | Optional | Base URL for absolute links/callbacks |
| `LOG_LEVEL` | Server | Optional | `debug`/`info`/`warn`/`error` |

**Rule of thumb:** anything prefixed `NEXT_PUBLIC_` ends up in the browser
bundle. Secrets must never carry that prefix. Server secrets are validated in
`config/env.ts`, which is `server-only` — importing it from a client component
fails the build instead of leaking keys.

## 3. Set up the database

Apply the migrations in `supabase/migrations/` (see the README there):

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

This creates all tables, indexes, Row Level Security policies, and the
signup trigger that provisions a profile (role `fan`) for each new user.

## 4. Run

```bash
npm run dev
```

---

# 🔐 Security Architecture

- **Auth**: Supabase Auth (email/password + Google OAuth), session cookies
  refreshed by `middleware.ts` on every request.
- **Authorization**: three layers —
  1. `middleware.ts` redirects unauthenticated users and blocks fans from
     staff routes (`/dashboard`, `/admin`, `/operations`) — UX layer.
  2. `lib/auth/guards.ts` (`requireUser` / `requireRole`) for Server
     Components and API routes — request layer.
  3. Postgres Row Level Security on every table — data layer. Even a bug in
     the layers above cannot read rows RLS forbids.
- **Roles**: `admin`, `operator`, `volunteer`, `fan`. Role changes are
  admin-only, enforced in the database by a trigger
  (`0010_prevent_role_escalation.sql`).
- **API**: every route is wrapped in `createApiHandler` (uniform error
  envelope, no stack traces to clients) and validates input with Zod
  (`lib/validation/`).
- **Headers**: `X-Frame-Options`, `nosniff`, HSTS, `Referrer-Policy`, and
  `Permissions-Policy` are set globally in `next.config.js`.

# 🤖 AI Integration Architecture (Gemini — not yet wired)

```
Browser (components/ai/*)          — no key, no SDK, cookie auth only
   │  POST /api/ai/chat
   ▼
app/api/ai/chat/route.ts           — auth (requireUser) + Zod validation
   ▼
services/ai/chat-service.ts        — prompt assembly, history caps, logging
   ▼
lib/ai/provider.ts                 — AIProvider interface; Gemini adapter goes here
   ▼
Google Gemini API                  — key read only from server env
```

Supporting modules: `prompts/system-prompts.ts` (personas + safety rules),
`types/ai-server.ts` (wire contracts), `lib/validation/ai.ts` (request
schemas). Until the adapter is implemented the endpoint returns
`503 AI_NOT_CONFIGURED` and the UI uses the local mock
(`services/ai-service.ts`).

---

# 👥 Contributors

Built for the **PromptWars – Smart Stadiums & Tournament Operations Challenge**.

---

# 📄 License

This project is developed for educational and hackathon purposes.
