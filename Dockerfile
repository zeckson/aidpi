FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Install Python and build dependencies for node-gyp
RUN apk add --no-cache python3 make g++ gcc

# Copy package.json files
COPY package*.json ./
COPY client/package*.json ./client/

# Install dependencies
RUN npm run install-all

# Copy project files
COPY . .

# Build React client
RUN cd client && npm run build

# Production stage
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install Python and build dependencies for node-gyp
RUN apk add --no-cache python3 make g++ gcc

# Install production dependencies only
COPY package*.json ./
RUN npm install --only=production

# Copy built client and server files
COPY --from=build /app/client/build ./client/build
COPY server.js ./
COPY .env ./

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]