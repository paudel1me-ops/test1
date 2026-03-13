@echo off
REM Vehicle Telemetry System - Startup Script for Windows

echo ==================================
echo Vehicle Telemetry System Setup
echo ==================================
echo.

REM Check if Docker is installed
where docker >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Docker found. Using Docker Compose...
    set LOCAL_MODE=false
) else (
    echo Docker is not installed. Starting local development setup...
    set LOCAL_MODE=true
)

if "%LOCAL_MODE%"=="false" (
    echo.
    echo Starting all services with Docker Compose...
    echo.
    
    REM Check if docker-compose is installed
    where docker-compose >nul 2>nul
    if %ERRORLEVEL% NEQ 0 (
        echo Using 'docker compose' instead...
        set DOCKER_COMPOSE=docker compose
    ) else (
        set DOCKER_COMPOSE=docker-compose
    )
    
    REM Start services
    call %DOCKER_COMPOSE% up -d
    
    echo.
    echo Services started!
    echo.
    echo Access points:
    echo   - Frontend: http://localhost:3000
    echo   - Backend:  http://localhost:8000
    echo   - Kafka:    localhost:9092
    echo.
    echo View logs:
    echo   - All:      %DOCKER_COMPOSE% logs -f
    echo   - Backend:  %DOCKER_COMPOSE% logs -f backend
    echo   - Frontend: %DOCKER_COMPOSE% logs -f frontend
    echo.
    echo Stop services:
    echo   %DOCKER_COMPOSE% down
    echo.
) else (
    echo.
    echo Setting up local development environment...
    echo.
    
    REM Backend setup
    echo Installing backend dependencies...
    cd backend
    
    if not exist "venv" (
        echo Creating virtual environment...
        python -m venv venv
    )
    
    call venv\Scripts\activate.bat
    pip install -r requirements.txt
    
    echo Backend setup complete
    echo.
    
    REM Frontend setup
    echo Installing frontend dependencies...
    cd ..\frontend
    
    if not exist "node_modules" (
        call npm install
    )
    
    echo Frontend setup complete
    echo.
    
    echo To start the services, run:
    echo.
    echo   Terminal 1 (Backend):
    echo     cd backend
    echo     venv\Scripts\activate.bat
    echo     uvicorn app.main:app --reload
    echo.
    echo   Terminal 2 (Frontend):
    echo     cd frontend
    echo     npm start
    echo.
)

echo Setup complete!
pause
