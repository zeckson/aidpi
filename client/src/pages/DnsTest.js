import React, { useState } from 'react';
import axios from 'axios';
import {
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';

const DnsTest = () => {
  const [domain, setDomain] = useState('rutracker.org');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await axios.get(`/api/test-dns?domain=${encodeURIComponent(domain)}`);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        DNS Test
      </Typography>
      
      <Typography variant="body1" paragraph>
        This test checks if DNS resolution for a domain is being manipulated or blocked.
        Enter a domain name to test its DNS resolution from your current connection.
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Domain to test"
            variant="outlined"
            fullWidth
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.com"
            sx={{ mb: 2 }}
            required
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Test DNS Resolution'}
          </Button>
        </form>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {result && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            DNS Test Results
          </Typography>
          
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" component="div">
              Domain: <strong>{result.domain}</strong>
            </Typography>
            <Typography variant="subtitle1" component="div" sx={{ mt: 1 }}>
              Status: 
              <Box component="span" sx={{ 
                fontWeight: 'bold',
                color: result.resolved ? 'success.main' : 'error.main'
              }}>
                {result.resolved ? 'Resolved Successfully' : 'Resolution Failed'}
              </Box>
            </Typography>
          </Box>
          
          {result.ips && result.ips.length > 0 ? (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" gutterBottom>
                Resolved IP Addresses:
              </Typography>
              <List dense>
                {result.ips.map((ip, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={ip} />
                  </ListItem>
                ))}
              </List>
            </Box>
          ) : (
            <Alert severity="warning" sx={{ mb: 2 }}>
              No IP addresses were returned for this domain.
            </Alert>
          )}
          
          <Alert 
            severity={result.resolved ? "success" : "warning"}
            sx={{ mt: 2 }}
          >
            {result.message}
          </Alert>
          
          {!result.resolved && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="body1" gutterBottom>
                Possible reasons for DNS resolution failure:
              </Typography>
              <ul>
                <li>DNS-level blocking by your ISP or government</li>
                <li>The domain does not exist or has been taken down</li>
                <li>Your DNS server might be manipulating the results</li>
                <li>Network connectivity issues</li>
              </ul>
              <Typography variant="body2" sx={{ mt: 2 }}>
                Try using alternative DNS servers like Cloudflare (1.1.1.1) or Google (8.8.8.8), or check our <Button href="/circumvention-methods" size="small">Circumvention Methods</Button> for more solutions.
              </Typography>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default DnsTest;