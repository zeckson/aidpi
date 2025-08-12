#!/bin/bash

# Simple deployment script for AIDPI application

# Make script executable with: chmod +x deploy.sh
# Run with: ./deploy.sh

echo "Deploying AIDPI application..."

# Pull latest changes if deploying from git
# git pull

# Build and start Docker containers
echo "Building and starting Docker containers..."
docker compose down
docker compose up --build -d

echo "Deployment complete! Application is running at http://localhost:8080"
echo "To check logs: docker compose logs -f"