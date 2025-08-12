# AIDPI - DPI Testing Tool

A web application to test Deep Packet Inspection (DPI) limitations from Roskomnadzor and provide solutions to overcome these issues.

## Features

- Test connection to potentially blocked resources
- Check DNS resolution for domains
- Detect DPI-based blocking
- Provide recommendations for circumventing DPI restrictions
- User-friendly interface for running tests

## Technologies

- **Backend**: Node.js, Express
- **Frontend**: React, Material-UI
- **Network Testing**: Axios, raw-socket

## Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/aidpi.git
   cd aidpi
   ```

2. Install dependencies
   ```
   npm run install-all
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   PORT=8080
   NODE_ENV=development
   ```

### Running the Application

#### Development Mode

Run both the backend and frontend concurrently:
```
npm run dev-all
```

Or run them separately:
```
# Backend only
npm run dev

# Frontend only
npm run client
```

#### Production Mode

1. Build the client
   ```
   cd client && npm run build
   ```

2. Start the server
   ```
   npm start
   ```

#### Docker Mode

##### Production Mode

The application can be run in a Docker container without installing any dependencies locally.

1. Build and start the container using Docker Compose:
   ```
   docker compose up -d
   ```

2. Or build and run the Docker container manually:
   ```
   docker build -t aidpi .
   docker run -p 8080:8080 -d aidpi
   ```

3. Access the application at http://localhost:8080

##### Development Mode

For local development with hot-reloading:

1. Run the application using the development Docker Compose configuration:
   ```
   ./docker-dev.sh
   ```
   or
   ```
   docker compose -f docker-compose.dev.yml up --build
   ```

2. Access the client at http://localhost:3000 and the server at http://localhost:8080

3. Changes to the code will automatically trigger rebuilds thanks to volume mounting

### Deployment

#### Local Deployment

Use the provided deployment script:
```
./deploy.sh
```

#### Remote Server Deployment

1. Create a production environment file:
   ```
   cp .env.production.sample .env.production
   # Edit .env.production with your settings
   ```

2. Deploy to a remote server:
   ```
   ./remote-deploy.sh user@your-server-ip
   ```

3. For servers with a domain name, use the provided nginx configuration:
   ```
   # On your server
   sudo cp nginx.conf /etc/nginx/sites-available/aidpi
   sudo ln -s /etc/nginx/sites-available/aidpi /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

## How It Works

1. **Connection Testing**: The application attempts to connect to potentially blocked resources and analyzes the response.

2. **DNS Testing**: Checks if DNS resolution is being manipulated or blocked.

3. **DPI Detection**: Uses various techniques to detect if Deep Packet Inspection is being used to block or monitor connections.

4. **Circumvention Methods**: Provides information about methods to bypass DPI restrictions, including VPNs, Tor, DNS over HTTPS, and more.

## Disclaimer

This tool is created for educational purposes only. Always comply with local laws and regulations when using internet services. The developers are not responsible for any misuse of this application.

## License

MIT