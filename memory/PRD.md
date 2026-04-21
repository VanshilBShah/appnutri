# NutriLoop App – Product Requirements (MVP)

## Overview
Mobile companion app for the NutriLoop brand — a regenerative packaging brand whose packaging dissolves into nutrients in soil/water. The app helps customers dissolve packaging correctly, track their regenerative impact, and stay engaged with circular-economy content.

## Brand
- Primary: Forest Green `#1E4A2F`
- Secondary: Seaweed Green `#5F7F4D`
- Text: Eco Black `#222222`, Muted `#5C5C5C`
- Background: Warm off-white `#F9F8F6`
- Typography: Montserrat (Regular, Medium, SemiBold, Bold, Black)
- Tone: Calm, natural, optimistic, earth-first

## Core Features (MVP)
- **Home** — greeting + hero impact card (packages dissolved, CO₂ saved, water saved, soil fed) + day streak + eco-garden progress + recent activity list.
- **Dissolve Guide** — scan placeholder, search, category chips, material cards; material detail with nutrients released and step-by-step dissolution instructions; "Mark as dissolved" action updates backend stats.
- **Eco-Garden** — gamified level visualization with plant hero, progress bar to next stage, and growth ladder (Seed → Grove).
- **Learn** — featured + list of articles on circular design, material science, and soil health; article detail view.
- **Profile** — avatar, points, rank, lifetime dissolved; active challenges with progress; badges grid (unlocked/locked).

## Backend Endpoints (FastAPI)
- `GET /api/stats` • `GET /api/activities` • `GET /api/profile`
- `GET /api/articles` • `GET /api/articles/{id}`
- `GET /api/materials` • `GET /api/materials/{id}`
- `GET /api/challenges` • `GET /api/badges`
- `POST /api/dissolve` → logs a dissolve, bumps stats/garden progress/activity

## Navigation
Expo Router with bottom tabs (Home, Dissolve, Garden, Learn, Profile) + stack screens `/article/[id]`, `/material/[id]`.

## Not in scope (MVP)
Auth, real camera scanning, AI suggestions, push notifications, social sharing.
