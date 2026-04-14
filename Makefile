.PHONY: install dev backend frontend test docker-build docker-up docker-down

install:
	cd backend && pip install -r requirements.txt
	cd frontend && npm install

dev:
	@echo "Starting development environment..."
	@echo "Running backend on port 8000 and frontend on port 3000..."
	@# We run them in the background and wait for both
	cd backend && uvicorn main:app --reload --port 8000 & \
	cd frontend && npm run dev -- -p 3000 & \
	wait

backend:
	cd backend && uvicorn main:app --reload --port 8000

frontend:
	cd frontend && npm run dev -- -p 3000

test:
	@echo "Running backend tests with coverage..."
	cd backend && python3 -m pytest tests/ -v --cov=. --cov-report=term-missing

docker-build:
	@echo "Building docker images..."
	docker compose build

docker-up:
	@echo "Starting services via Docker..."
	docker compose up -d

docker-down:
	@echo "Stopping Docker services..."
	docker compose down

capture-demo:
	@echo "Installing Playwright and running demo capture..."
	pip3 install playwright
	python3 -m playwright install chromium
	python3 scripts/capture_demo.py
