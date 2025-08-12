const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const { exec } = require('child_process');
const dotenv = require('dotenv');
const net = require('net');
const dgram = require('dgram');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
}

// Test connection to a blocked resource
app.get('/api/test-connection', async (req, res) => {
  try {
    const { url } = req.query;
    const testUrl = url || 'https://rutracker.org';
    
    try {
      const response = await axios.get(testUrl, {
        timeout: 5000,
        validateStatus: () => true // Accept any status code
      });
      
      res.json({
        success: true,
        status: response.status,
        accessible: true,
        message: `Connection to ${testUrl} successful with status ${response.status}`
      });
    } catch (error) {
      res.json({
        success: false,
        accessible: false,
        error: error.message,
        message: `Connection to ${testUrl} failed: ${error.message}`
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Test DNS resolution
app.get('/api/test-dns', async (req, res) => {
  try {
    const { domain } = req.query;
    const testDomain = domain || 'rutracker.org';
    
    exec(`dig +short ${testDomain}`, (error, stdout, stderr) => {
      if (error) {
        return res.json({
          success: false,
          error: error.message,
          message: `DNS resolution for ${testDomain} failed`
        });
      }
      
      const ips = stdout.trim().split('\n').filter(ip => ip);
      
      res.json({
        success: true,
        domain: testDomain,
        ips: ips,
        resolved: ips.length > 0,
        message: ips.length > 0 
          ? `DNS resolution for ${testDomain} successful` 
          : `DNS resolution for ${testDomain} failed (no IPs returned)`
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Test packet inspection
app.get('/api/test-dpi', async (req, res) => {
  try {
    const { host } = req.query;
    const testHost = host || 'rutracker.org';
    
    // This is a simplified test - in a real app, you would need more sophisticated
    // methods to detect DPI, possibly using raw sockets or external tools
    exec(`curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 ${testHost}`, (error, stdout, stderr) => {
      const statusCode = stdout.trim();
      
      // Check if we got a connection reset or timeout
      const isDpiBlocked = error && (error.message.includes('Connection reset by peer') || 
                                    error.message.includes('Operation timed out'));
      
      res.json({
        success: !error,
        host: testHost,
        statusCode: statusCode,
        isDpiBlocked: isDpiBlocked,
        message: isDpiBlocked 
          ? `Connection to ${testHost} appears to be blocked by DPI` 
          : `Connection to ${testHost} does not appear to be blocked by DPI`
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get circumvention methods
app.get('/api/circumvention-methods', (req, res) => {
  const methods = [
    {
      id: 1,
      name: 'VPN',
      description: 'Virtual Private Network encrypts your traffic and routes it through servers in other countries.',
      effectiveness: 'High',
      complexity: 'Low to Medium',
      examples: ['NordVPN', 'ExpressVPN', 'Wireguard']
    },
    {
      id: 2,
      name: 'Tor',
      description: 'The Onion Router network routes your traffic through multiple encrypted layers.',
      effectiveness: 'High',
      complexity: 'Medium',
      examples: ['Tor Browser']
    },
    {
      id: 3,
      name: 'DNS over HTTPS/TLS',
      description: 'Encrypts DNS requests to prevent DNS-based blocking.',
      effectiveness: 'Medium',
      complexity: 'Low',
      examples: ['Cloudflare DNS (1.1.1.1)', 'Google DNS (8.8.8.8)', 'Firefox DoH settings']
    },
    {
      id: 4,
      name: 'Proxy Servers',
      description: 'Routes your traffic through an intermediary server.',
      effectiveness: 'Medium',
      complexity: 'Low',
      examples: ['SOCKS5 proxies', 'HTTP proxies']
    },
    {
      id: 5,
      name: 'Shadowsocks',
      description: 'A secure socks5 proxy designed to protect your Internet traffic.',
      effectiveness: 'High',
      complexity: 'Medium',
      examples: ['Outline', 'Shadowsocks clients']
    },
    {
      id: 6,
      name: 'TCP/IP Packet Fragmentation',
      description: 'Splitting packets into smaller fragments to bypass packet inspection systems.',
      effectiveness: 'Medium',
      complexity: 'Medium',
      examples: ['MTU manipulation', 'Packet fragmentation tools']
    },
    {
      id: 7,
      name: 'Traffic Obfuscation',
      description: 'Disguising traffic to look like regular HTTPS traffic.',
      effectiveness: 'High',
      complexity: 'Medium to High',
      examples: ['Obfs4', 'Scramblesuit', 'meek']
    }
  ];
  
  res.json({ success: true, methods });
});

// Test client packet limitations
app.get('/api/test-packet-limitations', async (req, res) => {
  try {
    const { target } = req.query;
    const testTarget = target || 'google.com';
    const port = req.query.port || 80;
    const packetSize = req.query.packetSize || 1500;
    
    // Test results object
    const results = {
      target: testTarget,
      port: port,
      packetTests: [],
      mtuTest: null,
      latencyTest: null,
      firewallTest: null,
      recommendations: []
    };
    
    // 1. Test TCP connectivity
    const tcpPromise = new Promise((resolve) => {
      const tcpTest = {
        type: 'TCP',
        success: false,
        details: ''
      };
      
      const client = new net.Socket();
      client.setTimeout(5000);
      
      client.on('connect', () => {
        tcpTest.success = true;
        tcpTest.details = `Successfully established TCP connection to ${testTarget}:${port}`;
        client.end();
        resolve(tcpTest);
      });
      
      client.on('timeout', () => {
        tcpTest.details = `Connection to ${testTarget}:${port} timed out`;
        client.destroy();
        resolve(tcpTest);
      });
      
      client.on('error', (err) => {
        tcpTest.details = `Failed to connect to ${testTarget}:${port}: ${err.message}`;
        resolve(tcpTest);
      });
      
      client.connect(port, testTarget);
    });
    
    // 2. Test MTU size
    const mtuPromise = new Promise((resolve) => {
      exec(`ping -c 1 -M do -s ${packetSize - 28} ${testTarget}`, (error, stdout, stderr) => {
        const mtuTest = {
          packetSize: packetSize,
          success: !error,
          details: ''
        };
        
        if (error) {
          if (error.message.includes('Message too long')) {
            mtuTest.details = `MTU size ${packetSize} is too large for your connection`;
            results.recommendations.push('Reduce MTU size in your network settings');
          } else if (error.message.includes('Fragmentation needed')) {
            mtuTest.details = `Path MTU discovery indicates fragmentation is needed but blocked`;
            results.recommendations.push('Enable packet fragmentation or reduce MTU size');
          } else {
            mtuTest.details = `MTU test failed: ${error.message}`;
          }
        } else {
          mtuTest.details = `Successfully sent packet with size ${packetSize} bytes`;
        }
        
        resolve(mtuTest);
      });
    });
    
    // 3. Test latency and packet loss
    const latencyPromise = new Promise((resolve) => {
      exec(`ping -c 10 ${testTarget}`, (error, stdout, stderr) => {
        const latencyTest = {
          success: !error,
          avgLatency: null,
          packetLoss: null,
          details: ''
        };
        
        if (error) {
          latencyTest.details = `Latency test failed: ${error.message}`;
        } else {
          // Parse ping output
          const output = stdout.toString();
          const packetLossMatch = output.match(/(\d+(\.\d+)?)% packet loss/);
          const avgLatencyMatch = output.match(/min\/avg\/max\/.+?\s=\s[\d\.]+\/(\d+\.\d+)/);
          
          if (packetLossMatch) {
            latencyTest.packetLoss = parseFloat(packetLossMatch[1]);
          }
          
          if (avgLatencyMatch) {
            latencyTest.avgLatency = parseFloat(avgLatencyMatch[1]);
          }
          
          latencyTest.details = `Average latency: ${latencyTest.avgLatency}ms, Packet loss: ${latencyTest.packetLoss}%`;
          
          // Add recommendations based on results
          if (latencyTest.packetLoss > 5) {
            results.recommendations.push('High packet loss detected. Consider checking your network connection or ISP quality');
          }
          
          if (latencyTest.avgLatency > 200) {
            results.recommendations.push('High latency detected. This may affect real-time applications');
          }
        }
        
        resolve(latencyTest);
      });
    });
    
    // 4. Test firewall/port blocking
    const firewallPromise = new Promise((resolve) => {
      const commonPorts = [80, 443, 22, 21, 25, 110, 143, 993, 995, 3389];
      const portToTest = commonPorts.includes(parseInt(port)) ? parseInt(port) : 443;
      
      exec(`nc -zv -w 5 ${testTarget} ${portToTest}`, (error, stdout, stderr) => {
        const firewallTest = {
          port: portToTest,
          success: !error,
          details: ''
        };
        
        if (error) {
          firewallTest.details = `Port ${portToTest} appears to be blocked`;
          results.recommendations.push(`Port ${portToTest} is blocked. Try using alternative ports or a VPN`);
        } else {
          firewallTest.details = `Port ${portToTest} is open and accessible`;
        }
        
        resolve(firewallTest);
      });
    });
    
    // Wait for all tests to complete
    const [tcpTest, mtuTest, latencyTest, firewallTest] = await Promise.all([
      tcpPromise, mtuPromise, latencyPromise, firewallPromise
    ]);
    
    results.packetTests.push(tcpTest);
    results.mtuTest = mtuTest;
    results.latencyTest = latencyTest;
    results.firewallTest = firewallTest;
    
    // Add general recommendations if issues detected
    if (!tcpTest.success || !mtuTest.success || (latencyTest.packetLoss && latencyTest.packetLoss > 0) || !firewallTest.success) {
      if (!results.recommendations.includes('Consider using a VPN to bypass network restrictions')) {
        results.recommendations.push('Consider using a VPN to bypass network restrictions');
      }
      
      if (mtuTest && !mtuTest.success) {
        results.recommendations.push('Try adjusting your MTU settings to a lower value (e.g., 1400)');
      }
    }
    
    res.json({
      success: true,
      results: results
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});