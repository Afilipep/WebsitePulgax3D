@echo off
echo 🚀 Pulgax 3D Store - One-Click Deployment
echo ==========================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed or not in PATH
    echo Please install Docker Desktop from https://docker.com
    echo.
    pause
    exit /b 1
)

echo ✅ Docker found
echo.

REM Check if Docker Compose is available
docker compose version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose is not available
    echo Please update Docker Desktop to latest version
    echo.
    pause
    exit /b 1
)

echo ✅ Docker Compose found
echo.

echo 🏗️  Building and starting all services...
echo This may take a few minutes on first run...
echo.

REM Build and start all services
docker compose up --build -d

if errorlevel 1 (
    echo ❌ Deployment failed
    echo Check the error messages above
    pause
    exit /b 1
)

echo.
echo ✅ Deployment successful!
echo.
echo 🌐 Your services are now running:
echo   Frontend:  http://localhost
echo   Backend:   http://localhost:8000
echo   API Docs:  http://localhost:8000/docs
echo   MongoDB:   localhost:27017
echo.
echo 👤 To access admin panel:
echo   1. Go to http://localhost/admin
echo   2. Click "Create admin account"
echo   3. Fill in your details
echo   4. Start managing your store!
echo.
echo 📊 To view logs: docker compose logs -f
echo 🛑 To stop:      docker compose down
echo.
pause