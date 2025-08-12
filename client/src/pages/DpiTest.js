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

const DpiTest = () => {
  const [host, setHost] = useState('rutracker.org');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await axios.get(`/api/test-dpi?host=${encodeURIComponent(host)}`);
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
        DPI Test
      </Typography>
      
      <Typography variant="body1" paragraph>
        This test checks if Deep Packet Inspection (DPI) is being used to monitor or block your connections.
        Enter a host to test if DPI-based blocking is affecting your access to it.
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Host to test"
            variant="outlined"
            fullWidth
            value={host}
            onChange={(e) => setHost(e.target.value)}
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
            {loading ? <CircularProgress size={24} /> : 'Test DPI Blocking'}
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
            DPI Test Results
          </Typography>
          
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" component="div">
              Host: <strong>{result.host}</strong>
            </Typography>
            <Typography variant="subtitle1" component="div" sx={{ mt: 1 }}>
              Status: 
              <Box component="span" sx={{ 
                fontWeight: 'bold',
                color: !result.isDpiBlocked ? 'success.main' : 'error.main'
              }}>
                {!result.isDpiBlocked ? 'No DPI Blocking Detected' : 'DPI Blocking Detected'}
              </Box>
            </Typography>
          </Box>
          
          {result.statusCode && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">
                HTTP Status Code: {result.statusCode}
              </Typography>
            </Box>
          )}
          
          <Alert 
            severity={!result.isDpiBlocked ? "success" : "warning"}
            sx={{ mt: 2 }}
          >
            {result.message}
          </Alert>
          
          {result.isDpiBlocked && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="body1" gutterBottom>
                What is DPI Blocking?
              </Typography>
              <Typography variant="body2" paragraph>
                Deep Packet Inspection (DPI) is a type of data processing that examines in detail the contents 
                of the data being sent over a network, beyond just checking packet headers. It can be used to 
                block specific websites, services, or protocols.
              </Typography>
              
              <Typography variant="body1" gutterBottom>
                Common signs of DPI blocking:
              </Typography>
              <ul>
                <li>Connection resets when accessing certain websites</li>
                <li>Extremely slow loading times for specific sites</li>
                <li>Some websites work with HTTPS but not with HTTP</li>
                <li>VPN connections being disrupted</li>
              </ul>
              
              <Typography variant="body2" sx={{ mt: 2 }}>
                Check our <Button href="/circumvention-methods" size="small">Circumvention Methods</Button> for ways to bypass DPI blocking.
              </Typography>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default DpiTest;