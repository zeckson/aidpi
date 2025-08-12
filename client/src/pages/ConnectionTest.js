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
  Divider
} from '@mui/material';

const ConnectionTest = () => {
  const [url, setUrl] = useState('https://rutracker.org');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await axios.get(`/api/test-connection?url=${encodeURIComponent(url)}`);
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
        Connection Test
      </Typography>
      
      <Typography variant="body1" paragraph>
        This test checks if you can connect to potentially blocked resources. 
        Enter a URL to test if it's accessible from your current connection.
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="URL to test"
            variant="outlined"
            fullWidth
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            sx={{ mb: 2 }}
            required
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Test Connection'}
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
            Test Results
          </Typography>
          
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" component="div">
              Status: 
              <Box component="span" sx={{ 
                fontWeight: 'bold',
                color: result.accessible ? 'success.main' : 'error.main'
              }}>
                {result.accessible ? 'Accessible' : 'Blocked'}
              </Box>
            </Typography>
          </Box>
          
          {result.status && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">
                HTTP Status Code: {result.status}
              </Typography>
            </Box>
          )}
          
          <Alert 
            severity={result.accessible ? "success" : "warning"}
            sx={{ mt: 2 }}
          >
            {result.message}
          </Alert>
          
          {!result.accessible && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="body1" gutterBottom>
                Possible reasons for connection failure:
              </Typography>
              <ul>
                <li>The resource is blocked by your ISP or government</li>
                <li>DPI (Deep Packet Inspection) is being used to filter your traffic</li>
                <li>DNS-level blocking is in place</li>
                <li>The server might be down or unreachable</li>
              </ul>
              <Typography variant="body2" sx={{ mt: 2 }}>
                Try checking our <Button href="/circumvention-methods" size="small">Circumvention Methods</Button> for ways to bypass these restrictions.
              </Typography>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default ConnectionTest;