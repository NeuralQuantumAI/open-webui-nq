# VibeCaaS UI Makefile
# Provides convenient commands for development, testing, and deployment

.PHONY: help install dev build test lint format clean docker-build docker-deploy

# Default target
help:
	@echo "VibeCaaS UI - Available Commands:"
	@echo ""
	@echo "Development:"
	@echo "  install     Install all dependencies"
	@echo "  dev         Start development server"
	@echo "  build       Build the application"
	@echo ""
	@echo "Testing:"
	@echo "  test        Run all tests"
	@echo "  test-frontend Run frontend tests"
	@echo "  test-backend  Run backend tests"
	@echo "  test-coverage Run tests with coverage"
	@echo ""
	@echo "Code Quality:"
	@echo "  lint        Lint all code"
	@echo "  lint-fix    Fix linting issues"
	@echo "  format      Format all code"
	@echo "  format-check Check code formatting"
	@echo "  type-check  Run type checking"
	@echo "  check       Run all quality checks"
	@echo ""
	@echo "Docker:"
	@echo "  docker-build    Build all Docker images"
	@echo "  docker-deploy   Deploy with Docker Compose"
	@echo "  docker-clean    Clean Docker resources"
	@echo ""
	@echo "Utilities:"
	@echo "  clean       Clean build artifacts"
	@echo "  setup       Initial project setup"

# Development commands
install:
	@echo "Installing dependencies..."
	npm ci
	cd backend && pip install -e .
	cd backend && pip install --group dev -e .

dev:
	@echo "Starting development server..."
	npm run dev

build:
	@echo "Building application..."
	npm run build

# Testing commands
test: test-frontend test-backend

test-frontend:
	@echo "Running frontend tests..."
	npm run test

test-backend:
	@echo "Running backend tests..."
	cd backend && pytest -v

test-coverage:
	@echo "Running tests with coverage..."
	npm run test:coverage
	cd backend && pytest --cov=open_webui --cov-report=html --cov-report=term

# Code quality commands
lint:
	@echo "Linting code..."
	npm run lint
	cd backend && ruff check .

lint-fix:
	@echo "Fixing linting issues..."
	npm run lint:fix
	cd backend && ruff check . --fix

format:
	@echo "Formatting code..."
	npm run format
	cd backend && black .
	cd backend && isort .

format-check:
	@echo "Checking code formatting..."
	npm run format:check
	cd backend && black --check .
	cd backend && isort --check-only .

type-check:
	@echo "Running type checks..."
	npm run type-check
	cd backend && mypy . --ignore-missing-imports

check: lint format-check type-check
	@echo "All quality checks passed!"

# Docker commands
docker-build:
	@echo "Building Docker images..."
	./docker/build.sh all

docker-deploy:
	@echo "Deploying with Docker Compose..."
	./docker/deploy.sh deploy

docker-clean:
	@echo "Cleaning Docker resources..."
	docker system prune -f
	docker volume prune -f

# Utility commands
clean:
	@echo "Cleaning build artifacts..."
	rm -rf build/
	rm -rf dist/
	rm -rf .svelte-kit/
	rm -rf node_modules/.vite/
	rm -rf coverage/
	cd backend && find . -type d -name "__pycache__" -exec rm -rf {} +
	cd backend && find . -type f -name "*.pyc" -delete

setup: install
	@echo "Setting up project..."
	cp .env.production .env
	@echo "Please edit .env file with your configuration"
	@echo "Setup complete!"

# CI/CD simulation
ci-frontend: install lint format-check type-check build test-frontend
	@echo "Frontend CI checks passed!"

ci-backend: install lint format-check type-check test-backend
	@echo "Backend CI checks passed!"

ci-all: ci-frontend ci-backend
	@echo "All CI checks passed!"