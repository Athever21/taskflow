# TaskFlow

A Kanban-style project management app. Built as a learning project to explore Laravel, React, and Docker.

> ⚠️ Work in progress — core board functionality works, some features are incomplete.

## Stack

**Backend** — Laravel 13, Sanctum (cookie auth), MySQL 8, Redis  
**Frontend** — React 19, TypeScript, Vite, Tailwind CSS v4, React Query, Zustand, dnd-kit  
**Infrastructure** — Docker Compose, Nginx, PHP 8.3-FPM

## Features

- [x] Cookie-based authentication (HttpOnly session, no localStorage)
- [x] Projects with color labels
- [x] Kanban board — To Do / In Progress / Done / Cancelled
- [x] Drag and drop with optimistic UI updates
- [x] Task priorities, due dates, overdue indicators
- [x] Comments on tasks
- [ ] Filters by priority / assignee
- [ ] Multi-user / team support
- [ ] Activity log

## Getting Started

**Prerequisites:** Docker Desktop, Git Bash (Windows) or bash (Mac/Linux)

```bash
git clone https://github.com/your-username/taskflow.git
cd taskflow

# First time setup — scaffolds Laravel + React, boots all containers
chmod +x setup.sh && ./setup.sh
```

Once running:

| Service | URL |
|---|---|
| React app | http://localhost:5173 |
| Laravel API | http://localhost:8000 |
| MySQL | localhost:3307 |

Run migrations and seed sample data:

```bash
make migrate
# or with fresh seed data:
make artisan CMD="migrate:fresh --seed"
```

Default test account: `test@test.com` / `password`

## Daily Development

```bash
make up       # start all containers
make down     # stop all containers
make shell    # bash inside Laravel container
make logs     # tail logs from all containers

# Examples
make artisan CMD="make:model Foo -m"
make composer CMD="require spatie/laravel-query-builder"
```

## Project Structure

```
taskflow/
├── backend/          # Laravel API
│   ├── app/Http/
│   │   ├── Controllers/Api/
│   │   ├── Requests/
│   │   └── Resources/
│   ├── app/Models/
│   └── routes/api.php
├── frontend/         # React + Vite
│   └── src/
│       ├── api/      # axios calls per resource
│       ├── hooks/    # React Query wrappers
│       ├── stores/   # Zustand (auth)
│       ├── components/
│       └── pages/
├── nginx/
├── docker/
└── docker-compose.yml
```

## Notes

- Windows users: run scripts in Git Bash, not CMD
- HMR works via polling (`usePolling: true` in vite.config.ts) — required for Docker on Windows
- Session auth uses Sanctum stateful SPA mode — the frontend must be on the same domain or a configured stateful domain