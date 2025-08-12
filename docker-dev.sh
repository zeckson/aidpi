#!/bin/bash

# Script to run AIDPI application locally in Docker development mode

echo "Starting AIDPI in Docker development mode..."

# Build and start Docker containers in development mode
docker compose -f docker-compose.dev.yml down
docker compose -f docker-compose.dev.yml up --build

# The script will keep running until the containers are stopped with Ctrl+C