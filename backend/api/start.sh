#!/bin/bash

echo "🚀 Starting VoiceCraft Market API..."

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "📝 Please update .env with your configuration before running the server."
    exit 1
fi

# Build the application
echo "🔨 Building application..."
go build -o bin/server .

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build successful"

# Run the server
echo "🎯 Starting server..."
./bin/server
