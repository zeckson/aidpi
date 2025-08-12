#!/bin/bash

# Remote deployment script for AIDPI application
# Usage: ./remote-deploy.sh user@your-server-ip

if [ -z "$1" ]; then
  echo "Error: Please provide the remote server address"
  echo "Usage: ./remote-deploy.sh user@your-server-ip"
  exit 1
fi

REMOTE_SERVER=$1
REMOTE_DIR="/opt/aidpi"

echo "Deploying AIDPI to $REMOTE_SERVER..."

# Create a deployment package
echo "Creating deployment package..."
tar --exclude='node_modules' --exclude='client/node_modules' --exclude='.git' -czf aidpi-deploy.tar.gz .

# Ensure the remote directory exists
ssh $REMOTE_SERVER "mkdir -p $REMOTE_DIR"

# Copy files to the remote server
echo "Copying files to remote server..."
scp aidpi-deploy.tar.gz $REMOTE_SERVER:$REMOTE_DIR/
scp docker-compose.yml $REMOTE_SERVER:$REMOTE_DIR/
scp Dockerfile $REMOTE_SERVER:$REMOTE_DIR/
scp .env.production $REMOTE_SERVER:$REMOTE_DIR/.env.production

# Extract and deploy on the remote server
echo "Deploying on remote server..."
ssh $REMOTE_SERVER "cd $REMOTE_DIR && \
  tar -xzf aidpi-deploy.tar.gz && \
  docker compose down && \
  docker compose up --build -d"

# Clean up local deployment package
rm aidpi-deploy.tar.gz

echo "Deployment complete! Application is running on $REMOTE_SERVER"