@echo off
echo 🚀 Starting VoiceCraft Market API...

REM Check if .env file exists
if not exist ".env" (
    echo ⚠️  .env file not found. Creating from .env.example...
    copy .env.example .env
    echo 📝 Please update .env with your configuration before running the server.
    exit /b 1
)

REM Build the application
echo 🔨 Building application...
go build -o bin/server.exe .

if %errorlevel% neq 0 (
    echo ❌ Build failed
    exit /b 1
)

echo ✅ Build successful

REM Run the server
echo 🎯 Starting server...
bin\server.exe
