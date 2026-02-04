@echo off
cd /d "%~dp0"
echo Starting Pulgax 3D Store Backend (Simple JSON Storage)...
echo Current directory: %CD%
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Python is not installed or not in PATH
    echo Please install Python from https://python.org
    pause
    exit /b 1
)

echo Installing basic dependencies...
python -m pip install fastapi uvicorn pydantic email-validator bcrypt pyjwt

echo.
echo Starting FastAPI server with JSON file storage...
echo No MongoDB required - data will be stored in JSON files
echo.
echo Server will be available at: http://localhost:8000
echo API documentation at: http://localhost:8000/docs
echo.

python server_simple.py

pause