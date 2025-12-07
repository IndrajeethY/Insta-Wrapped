.PHONY: help build frontend backend run clean test install

# Default target
help:
	@echo "InstaWrapped - Build Commands"
	@echo ""
	@echo "make build     - Build frontend and backend"
	@echo "make frontend  - Build only frontend"
	@echo "make backend   - Build only backend"
	@echo "make run       - Build and run server"
	@echo "make clean     - Clean build artifacts"
	@echo "make install   - Install dependencies"
	@echo "make test      - Test the server"

# Install all dependencies
install:
	@echo "📦 Installing frontend dependencies..."
	npm install
	@echo "📦 Installing Go dependencies..."
	go mod download
	@echo "✓ Dependencies installed"

# Build frontend
frontend:
	@echo "🔨 Building frontend..."
	npm run build
	@echo "✓ Frontend built"

# Build backend
backend:
	@echo "🔨 Building backend..."
	go build -o server .
	@echo "✓ Backend built"

# Build everything
build: frontend backend
	@echo "✓ Build complete"

# Run the server
run: build
	@echo "🚀 Starting server..."
	@echo "📱 Open http://localhost:8080"
	./server

# Clean build artifacts
clean:
	@echo "🧹 Cleaning build artifacts..."
	rm -f server
	rm -rf dist
	rm -rf videos/*.mp4
	@echo "✓ Clean complete"

# Test the server
test:
	@echo "🧪 Testing API endpoints..."
	@echo ""
	@echo "Testing follower API..."
	@curl -s http://localhost:8080/api/followers/test | python3 -m json.tool || echo "Server not running?"
	@echo ""
	@echo "Testing video generation API..."
	@curl -s -X POST http://localhost:8080/api/generate-video -H "Content-Type: application/json" -d '{"stats":{"year":2025}}' | python3 -m json.tool || echo "Server not running?"
