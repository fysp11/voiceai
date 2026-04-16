.PHONY: help dev dev-up dev-down dev-logs prod prod-up prod-down prod-logs build clean

help:
	@echo "VoiceAI Docker Commands:"
	@echo "  make dev-up       - Start development server"
	@echo "  make dev-logs    - View development logs"
	@echo "  make dev-down   - Stop development server"
	@echo "  make prod-up    - Start production server"
	@echo "  make prod-logs  - View production logs"
	@echo "  make prod-down - Stop production server"
	@echo "  make clean      - Remove containers and volumes"

dev:
	docker compose --profile dev up -d --build

dev-up:
	docker compose --profile dev up -d --build

dev-down:
	docker compose --profile dev down

dev-logs:
	docker compose --profile dev logs -f

prod:
	docker compose --profile prod up -d --build

prod-up:
	docker compose --profile prod up -d --build

prod-down:
	docker compose --profile prod down

prod-logs:
	docker compose --profile prod logs -f

build:
	docker compose build

clean:
	docker compose down -v --remove-orphans