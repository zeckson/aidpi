import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  CardActions, 
  Button,
  Grid,
  Paper
} from '@mui/material';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import DnsIcon from '@mui/icons-material/Dns';
import SecurityIcon from '@mui/icons-material/Security';
import VpnLockIcon from '@mui/icons-material/VpnLock';
import DataUsageIcon from '@mui/icons-material/DataUsage';

const Home = () => {
  const testCards = [
    {
      title: 'Connection Test',
      description: 'Test your connection to potentially blocked resources and check if your ISP is restricting access.',
      icon: <NetworkCheckIcon fontSize="large" color="primary" />,
      link: '/connection-test'
    },
    {
      title: 'DNS Test',
      description: 'Check if your DNS requests are being manipulated or blocked by your ISP or government.',
      icon: <DnsIcon fontSize="large" color="primary" />,
      link: '/dns-test'
    },
    {
      title: 'DPI Test',
      description: 'Detect if Deep Packet Inspection is being used to monitor or block your internet traffic.',
      icon: <SecurityIcon fontSize="large" color="primary" />,
      link: '/dpi-test'
    },
    {
      title: 'Packet Test',
      description: 'Check if your client connection has packet limitations that might be causing connection issues.',
      icon: <DataUsageIcon fontSize="large" color="primary" />,
      link: '/packet-test'
    },
    {
      title: 'Circumvention Methods',
      description: 'Learn about methods to bypass DPI restrictions and access blocked content safely.',
      icon: <VpnLockIcon fontSize="large" color="primary" />,
      link: '/circumvention-methods'
    }
  ];

  return (
    <Box sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4, backgroundColor: '#f8f9fa' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          DPI Testing Tool
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Test your connection for Deep Packet Inspection limitations and find ways to overcome them
        </Typography>
        <Typography variant="body1" paragraph>
          This tool helps you identify if your internet connection is being monitored or restricted 
          through Deep Packet Inspection (DPI) techniques, commonly used by Roskomnadzor and other 
          regulatory bodies. Run tests to check your connection and discover methods to bypass restrictions.
        </Typography>
      </Paper>

      <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Available Tests
      </Typography>

      <Grid container spacing={3}>
        {testCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
                {card.icon}
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {card.title}
                </Typography>
                <Typography>
                  {card.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  color="primary" 
                  component={RouterLink} 
                  to={card.link}
                >
                  Run Test
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 6, mb: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Disclaimer: This tool is for educational purposes only. Always comply with local laws and regulations.
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;