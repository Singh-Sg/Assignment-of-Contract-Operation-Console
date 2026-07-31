# Contract Operations Console

A React 19 + Vite frontend for a Contract Operations Console, built against a FastAPI/PostgreSQL backend. This repository contains frontend only — no mock APIs, no fake data. All data comes from the REST/WebSocket endpoints described below.

## Table of Contents

- Tech Stack
- Prerequisites
- Setup Instructions
- Environment Variables
- Available Scripts
- Deployed URL & Evaluation Access

## Tech Stack

- React 19 + Vite
- Material UI (MUI) v6 + MUI X DataGrid + MUI Lab (Timeline)
- React Router DOM v6
- Axios
- React Hook Form + Zod
- Context API for global state (selected organization, notifications, realtime connection)
- Native WebSocket API for live updates

## Prerequisites

- Node.js v18 or later (v20 LTS recommended)
- npm v9+ (ships with Node)
- A running instance of the backend API (FastAPI + PostgreSQL) — see the backend repository for its own setup instructions
- Git

## Setup Instructions

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd contract-operations-console
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create your environment file
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with the values described in [Environment Variable] below.

4. Start the backend first. This is a frontend-only repo — the app will load but every page will show an `ErrorState`/empty data until the backend at `VITE_API_BASE_URL` is reachable.

5. Run the app
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

## Environment Variables

Create a `.env` file in the project root (see `.env.example`):


| `VITE_API_BASE_URL` | Yes | `http://localhost:8000` | Base URL of the REST API (no trailing slash) |
| `VITE_WS_BASE_URL` | Yes | `ws://localhost:8000` | Base URL for the WebSocket notifications endpoint (use `wss://` in production) |

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_BASE_URL=ws://localhost:8000
```

## Available Scripts
 `npm run dev` 
 `npm run build` 


## Deployed URL & Evaluation Access

- Deployed frontend: `<ADD_DEPLOYED_FRONTEND_URL_HERE>`
- Deployed backend / API base: `<ADD_DEPLOYED_BACKEND_URL_HERE>`





