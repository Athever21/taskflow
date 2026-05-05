# Taskflow dev shortcuts
# Usage: make up | make shell | make migrate | etc.

.PHONY: up down build shell artisan migrate fresh logs

## Start all containers (build if needed)
up:
	docker compose up -d --build

## Stop all containers
down:
	docker compose down

## Rebuild images without cache
build:
	docker compose build --no-cache

## Open bash inside the Laravel app container
shell:
	docker compose exec app bash

## Run any artisan command: make artisan CMD="make:model Foo -m"
artisan:
	docker compose exec app php artisan $(CMD)

## Run pending migrations
migrate:
	docker compose exec app php artisan migrate

## Wipe DB and re-seed
fresh:
	docker compose exec app php artisan migrate:fresh --seed

## Tail logs from all containers
logs:
	docker compose logs -f

## Run composer: make composer CMD="require spatie/laravel-query-builder"
composer:
	docker compose exec app composer $(CMD)

## Run npm inside frontend container: make npm CMD="install axios"
npm:
	docker compose exec frontend npm $(CMD)