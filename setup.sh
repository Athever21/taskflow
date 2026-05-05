#!/usr/bin/env bash
set -e

echo "▶ Checking Docker is running..."
docker info > /dev/null 2>&1 || { echo "Docker not running. Start Docker Desktop first."; exit 1; }

# MSYS_NO_PATHCONV=1 stops Git Bash from mangling /d/foo paths into D:\foo
# With this set, $(pwd) works correctly as-is for Docker volume mounts
export MSYS_NO_PATHCONV=1
DOCKER_PWD=$(pwd)

echo "  Working directory: ${DOCKER_PWD}"

# ── Root .env ─────────────────────────────────────────────────────
if [ ! -f .env ]; then cp .env.example .env; echo "  ✔ Created .env"; fi
set -a && source .env && set +a

# ── Laravel scaffold ──────────────────────────────────────────────
echo ""
if [ -f "backend/artisan" ]; then
  echo "▶ backend/ already scaffolded — skipping"
else
  echo "▶ Scaffolding Laravel in ./backend ..."
  # Clean via Docker so root-owned files from previous runs are properly removed
  mkdir -p backend
  docker run --rm -v "${DOCKER_PWD}/backend:/app" alpine sh -c "rm -rf /app/* /app/.[!.]*"

  docker run --rm \
    -v "${DOCKER_PWD}/backend:/app" \
    -w /app \
    composer:2.7 \
    composer create-project laravel/laravel . --prefer-dist --quiet

  cat > backend/.env << LARAVEL_ENV
APP_NAME=${APP_NAME}
APP_ENV=${APP_ENV}
APP_KEY=
APP_DEBUG=${APP_DEBUG}
APP_URL=${APP_URL}

LOG_CHANNEL=stack
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=${DB_DATABASE}
DB_USERNAME=${DB_USERNAME}
DB_PASSWORD=${DB_PASSWORD}

REDIS_HOST=redis
REDIS_PORT=6379

CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis

SANCTUM_STATEFUL_DOMAINS=localhost:${FRONTEND_PORT}
SESSION_DOMAIN=localhost
FRONTEND_URL=http://localhost:${FRONTEND_PORT}
LARAVEL_ENV

  # Fix permissions: composer runs as root, PHP-FPM runs as uid 1000
  docker run --rm \
    -v "${DOCKER_PWD}/backend:/app" \
    alpine \
    sh -c "chown -R 1000:1000 /app && chmod -R 775 /app/storage /app/bootstrap/cache"

  echo "  ✔ Laravel scaffolded"
fi

# ── React scaffold ────────────────────────────────────────────────
echo ""
if [ -f "frontend/index.html" ]; then
  echo "▶ frontend/ already scaffolded — skipping"
else
  echo "▶ Scaffolding React + TypeScript in ./frontend ..."
  mkdir -p frontend
  docker run --rm -v "${DOCKER_PWD}/frontend:/app" alpine sh -c "rm -rf /app/* /app/.[!.]*"

  docker run --rm \
    -v "${DOCKER_PWD}/frontend:/app" \
    node:20-alpine \
    sh -c "cd /tmp && npm create vite@latest taskflow -- --template react-ts --yes && cp -r taskflow/. /app/ && rm -rf taskflow"

  echo "VITE_API_URL=${VITE_API_URL}" > frontend/.env

  cat > frontend/Dockerfile << 'DOCKERFILE'
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
DOCKERFILE

  echo "  ✔ React scaffolded"
fi

# ── Frontend deps ─────────────────────────────────────────────────
echo ""
if [ -d "frontend/node_modules" ]; then
  echo "▶ node_modules/ exists — skipping npm install"
else
  echo "▶ Installing frontend dependencies..."

  docker run --rm -v "${DOCKER_PWD}/frontend:/app" -w /app node:20-alpine \
    npm install \
      axios \
      @tanstack/react-query @tanstack/react-query-devtools \
      zustand \
      @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities \
      react-router-dom \
      clsx

  docker run --rm -v "${DOCKER_PWD}/frontend:/app" -w /app node:20-alpine \
    npm install -D tailwindcss @tailwindcss/vite

  echo "  ✔ Frontend deps installed"
fi

# ── Boot containers ───────────────────────────────────────────────
echo ""
echo "▶ Building and starting containers..."
docker compose up -d --build

echo ""
echo "▶ Waiting for DB to be healthy..."
sleep 10

docker compose exec app php artisan key:generate
docker compose exec app php artisan storage:link

echo ""
echo "════════════════════════════════════════"
echo "  ✅  TaskFlow is ready!"
echo ""
echo "  API    →  http://localhost:${NGINX_PORT}"
echo "  React  →  http://localhost:${FRONTEND_PORT}"
echo "  DB     →  localhost:${DB_EXTERNAL_PORT}  (${DB_USERNAME} / ${DB_PASSWORD})"
echo "════════════════════════════════════════"