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
  Grid,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';

const PacketTest = () => {
  const [target, setTarget] = useState('google.com');
  const [port, setPort] = useState(80);
  const [packetSize, setPacketSize] = useState(1500);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await axios.get(`/api/test-packet-limitations?target=${encodeURIComponent(target)}&port=${port}&packetSize=${packetSize}`);
      setResult(response.data.results);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePacketSizeChange = (event, newValue) => {
    setPacketSize(newValue);
  };

  const getSeverityIcon = (success) => {
    return success ? 
      <CheckCircleIcon color="success" /> : 
      <ErrorIcon color="error" />;
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Client Packet Limitation Test
      </Typography>
      
      <Typography variant="body1" paragraph>
        This test checks if your client connection has packet limitations that might affect your ability to connect to servers.
        It tests TCP connectivity, MTU size, packet loss, latency, and port accessibility.
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Target Host"
                variant="outlined"
                fullWidth
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="example.com"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="port-select-label">Port</InputLabel>
                <Select
                  labelId="port-select-label"
                  value={port}
                  label="Port"
                  onChange={(e) => setPort(e.target.value)}
                >
                  <MenuItem value={80}>80 (HTTP)</MenuItem>
                  <MenuItem value={443}>443 (HTTPS)</MenuItem>
                  <MenuItem value={22}>22 (SSH)</MenuItem>
                  <MenuItem value={21}>21 (FTP)</MenuItem>
                  <MenuItem value={25}>25 (SMTP)</MenuItem>
                  <MenuItem value={110}>110 (POP3)</MenuItem>
                  <MenuItem value={143}>143 (IMAP)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography id="packet-size-slider" gutterBottom>
                Packet Size (MTU): {packetSize} bytes
              </Typography>
              <Slider
                value={packetSize}
                onChange={handlePacketSizeChange}
                aria-labelledby="packet-size-slider"
                valueLabelDisplay="auto"
                step={100}
                marks
                min={500}
                max={9000}
              />
            </Grid>
            <Grid item xs={12}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={loading}
                fullWidth
              >
                {loading ? <CircularProgress size={24} /> : 'Test Client Packet Limitations'}
              </Button>
            </Grid>
          </Grid>
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
            Packet Limitation Test Results
          </Typography>
          
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" component="div">
              Target: <strong>{result.target}:{result.port}</strong>
            </Typography>
          </Box>
          
          <Grid container spacing={3}>
            {/* TCP Connectivity Test */}
            <Grid item xs={12} md={6}>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {getSeverityIcon(result.packetTests[0]?.success)}
                  </ListItemIcon>
                  <Typography variant="h6">TCP Connectivity</Typography>
                </Box>
                <Typography variant="body2">
                  {result.packetTests[0]?.details}
                </Typography>
              </Paper>
            </Grid>
            
            {/* MTU Test */}
            <Grid item xs={12} md={6}>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {getSeverityIcon(result.mtuTest?.success)}
                  </ListItemIcon>
                  <Typography variant="h6">MTU Test ({result.mtuTest?.packetSize} bytes)</Typography>
                </Box>
                <Typography variant="body2">
                  {result.mtuTest?.details}
                </Typography>
              </Paper>
            </Grid>
            
            {/* Latency & Packet Loss Test */}
            <Grid item xs={12} md={6}>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {result.latencyTest?.packetLoss > 5 ? 
                      <WarningIcon color="warning" /> : 
                      getSeverityIcon(result.latencyTest?.success)}
                  </ListItemIcon>
                  <Typography variant="h6">Latency & Packet Loss</Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  {result.latencyTest?.details}
                </Typography>
                {result.latencyTest?.packetLoss > 0 && (
                  <Chip 
                    label={`${result.latencyTest.packetLoss}% packet loss`} 
                    color={result.latencyTest.packetLoss > 5 ? "warning" : "success"}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                )}
                {result.latencyTest?.avgLatency && (
                  <Chip 
                    label={`${result.latencyTest.avgLatency}ms latency`} 
                    color={result.latencyTest.avgLatency > 200 ? "warning" : "success"}
                    size="small"
                  />
                )}
              </Paper>
            </Grid>
            
            {/* Firewall/Port Test */}
            <Grid item xs={12} md={6}>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {getSeverityIcon(result.firewallTest?.success)}
                  </ListItemIcon>
                  <Typography variant="h6">Port Accessibility</Typography>
                </Box>
                <Typography variant="body2">
                  {result.firewallTest?.details}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
          
          {result.recommendations && result.recommendations.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Recommendations
              </Typography>
              <List>
                {result.recommendations.map((recommendation, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <InfoIcon color="info" />
                    </ListItemIcon>
                    <ListItemText primary={recommendation} />
                  </ListItem>
                ))}
              </List>
              <Box sx={{ mt: 2 }}>
                <Button href="/circumvention-methods" color="primary">
                  View Circumvention Methods
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      )}
      
      <Paper elevation={1} sx={{ p: 3, mt: 4, backgroundColor: '#f8f9fa' }}>
        <Typography variant="h6" gutterBottom>
          Understanding Packet Limitations
        </Typography>
        <Typography variant="body2" paragraph>
          Client packet limitations can occur due to various reasons:
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText 
              primary="MTU Size Restrictions" 
              secondary="Maximum Transmission Unit (MTU) defines the largest packet size that can be transmitted. If your MTU is too small or packets are being fragmented, connections may fail."
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Packet Loss" 
              secondary="When packets are dropped during transmission, it can cause connection timeouts, slow performance, or complete failure to connect."
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Firewall/DPI Blocking" 
              secondary="Firewalls or Deep Packet Inspection systems may block certain types of packets or connections to specific ports."
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="ISP Throttling" 
              secondary="Your Internet Service Provider might be limiting certain types of traffic or connections."
            />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default PacketTest;