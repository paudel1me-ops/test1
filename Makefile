.PHONY: help up down logs logs-backend logs-frontend restart build build-backend build-frontend test health clean install install-backend install-frontend resume-demo

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-20s %s\n", $$1, $$2}'

# Docker Compose targets
up: ## Start all services with Docker Compose
	docker-compose up -d
	@echo "Services started! Access dashboard at http://localhost:3000"

resume-demo: ## Start/recover demo stack and verify readiness
	bash resume-demo.sh

down: ## Stop all services
	docker-compose down

logs: ## View logs from all services
	docker-compose logs -f

logs-backend: ## View backend logs
	docker-compose logs -f backend

logs-frontend: ## View frontend logs
	docker-compose logs -f frontend

restart: ## Restart all services
	docker-compose restart

build: ## Build all Docker images
	docker-compose build

build-backend: ## Build backend Docker image
	docker-compose build backend

build-frontend: ## Build frontend Docker image
	docker-compose build frontend

ps: ## Show service status
	docker-compose ps

health: ## Check health of all services
	@echo "Backend health:"
	@curl -s http://localhost:8000/health | jq . || echo "Backend not accessible"
	@echo ""
	@echo "Running services:"
	@docker-compose ps

# Local development targets
install: install-backend install-frontend ## Install all dependencies locally

install-backend: ## Install backend dependencies
	cd backend && python -m venv venv && . venv/bin/activate && pip install -r requirements.txt
	@echo "Backend dependencies installed"

install-frontend: ## Install frontend dependencies
	cd frontend && npm install
	@echo "Frontend dependencies installed"

run-backend: ## Run backend locally
	cd backend && . venv/bin/activate && uvicorn app.main:app --reload

run-frontend: ## Run frontend locally
	cd frontend && npm start

# Kafka commands
kafka-console: ## View Kafka messages
	docker-compose exec kafka kafka-console-consumer \
		--bootstrap-server kafka:9092 \
		--topic vehicle-telemetry \
		--from-beginning \
		--max-messages 20

kafka-topics: ## List all Kafka topics
	docker-compose exec kafka kafka-topics --bootstrap-server kafka:9092 --list

kafka-describe: ## Describe vehicle-telemetry topic
	docker-compose exec kafka kafka-topics \
		--bootstrap-server kafka:9092 \
		--describe \
		--topic vehicle-telemetry

# Testing targets
test: ## Test API endpoints
	@echo "Testing backend health..."
	@curl -s http://localhost:8000/health | jq .
	@echo "\nTesting vehicle list..."
	@curl -s http://localhost:8000/vehicles | jq .
	@echo "\nTesting telemetry endpoint..."
	@curl -s http://localhost:8000/telemetry/VEHICLE_000 | jq .
	@echo "\nTesting stats..."
	@curl -s http://localhost:8000/stats | jq .

# Utility targets
clean: ## Remove all containers and volumes
	docker-compose down -v
	@echo "All containers and volumes removed"

clean-frontend: ## Clean frontend dependencies and build
	cd frontend && rm -rf node_modules build .env.local

clean-backend: ## Clean backend dependencies
	cd backend && rm -rf venv __pycache__ .env.local

reset: clean up ## Reset entire system (down + up)

shell-backend: ## Open shell in backend container
	docker-compose exec backend bash

shell-frontend: ## Open shell in frontend container
	docker-compose exec frontend sh

shell-kafka: ## Open shell in kafka container
	docker-compose exec kafka bash

# Setup targets
setup: ## Full setup (choose docker or local)
	@bash startup.sh

env-backend: ## Create backend .env from template
	@if [ ! -f backend/.env ]; then cp backend/.env.example backend/.env && echo "Created backend/.env"; fi

env-frontend: ## Create frontend .env from template
	@if [ ! -f frontend/.env ]; then cp frontend/.env.example frontend/.env && echo "Created frontend/.env"; fi

envs: env-backend env-frontend ## Create all .env files from templates

# Info targets
info: ## Show system information
	@echo "Project: Vehicle Telemetry to Kafka to React"
	@echo "Version: 1.0.0"
	@echo ""
	@echo "Services:"
	@docker-compose ps
	@echo ""
	@echo "Key URLs:"
	@echo "  - Frontend: http://localhost:3000"
	@echo "  - Backend:  http://localhost:8000"
	@echo "  - Kafka:    localhost:9092"
	@echo ""
	@echo "Documentation:"
	@echo "  - Main README: README.md"
	@echo "  - Quick Ref:   QUICK_REFERENCE.md"
	@echo ""
	@echo "Common commands:"
	@echo "  make up          # Start all services"
	@echo "  make down        # Stop all services"
	@echo "  make logs        # View logs"
	@echo "  make test        # Test API endpoints"
	@echo "  make help        # Show this help"
