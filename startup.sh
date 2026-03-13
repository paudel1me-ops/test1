#!/bin/bash

# Vehicle Telemetry System - Startup Script

set -e

echo "=================================="
echo "Vehicle Telemetry System Setup"
echo "=================================="
echo ""

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}Docker is not installed. Starting local development setup...${NC}"
    LOCAL_MODE=true
else
    echo -e "${BLUE}Docker found. Using Docker Compose...${NC}"
    LOCAL_MODE=false
fi

if [ "$LOCAL_MODE" = false ]; then
    echo ""
    echo -e "${BLUE}Starting all services with Docker Compose...${NC}"
    echo ""
    
    # Check if docker-compose is installed
    if ! command -v docker-compose &> /dev/null; then
        echo -e "${YELLOW}docker-compose not found, trying 'docker compose' ...${NC}"
        DOCKER_COMPOSE="docker compose"
    else
        DOCKER_COMPOSE="docker-compose"
    fi
    
    # Start services
    $DOCKER_COMPOSE up -d
    
    echo ""
    echo -e "${GREEN}✓ Services started!${NC}"
    echo ""
    echo "Access points:"
    echo "  - Frontend: ${BLUE}http://localhost:3000${NC}"
    echo "  - Backend:  ${BLUE}http://localhost:8000${NC}"
    echo "  - Kafka:    ${BLUE}localhost:9092${NC}"
    echo ""
    echo "View logs:"
    echo "  - All:      $DOCKER_COMPOSE logs -f"
    echo "  - Backend:  $DOCKER_COMPOSE logs -f backend"
    echo "  - Frontend: $DOCKER_COMPOSE logs -f frontend"
    echo ""
    echo "Stop services:"
    echo "  $DOCKER_COMPOSE down"
    echo ""
else
    echo ""
    echo -e "${YELLOW}Setting up local development environment...${NC}"
    echo ""
    
    # Backend setup
    echo -e "${BLUE}Installing backend dependencies...${NC}"
    cd backend
    
    if [ ! -d "venv" ]; then
        echo "Creating virtual environment..."
        python3 -m venv venv
    fi
    
    source venv/bin/activate
    pip install -r requirements.txt
    
    echo -e "${GREEN}✓ Backend setup complete${NC}"
    echo ""
    
    # Frontend setup
    echo -e "${BLUE}Installing frontend dependencies...${NC}"
    cd ../frontend
    
    if [ ! -d "node_modules" ]; then
        npm install
    fi
    
    echo -e "${GREEN}✓ Frontend setup complete${NC}"
    echo ""
    
    echo -e "${YELLOW}To start the services, run:${NC}"
    echo ""
    echo "  Terminal 1 (Backend):"
    echo "    cd backend"
    echo "    source venv/bin/activate"
    echo "    uvicorn app.main:app --reload"
    echo ""
    echo "  Terminal 2 (Frontend):"
    echo "    cd frontend"
    echo "    npm start"
    echo ""
fi

echo -e "${GREEN}Setup complete!${NC}"
