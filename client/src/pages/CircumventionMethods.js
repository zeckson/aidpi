import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography,
  Box,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert
} from '@mui/material';

const CircumventionMethods = () => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const response = await axios.get('/api/circumvention-methods');
        setMethods(response.data.methods);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load circumvention methods');
      } finally {
        setLoading(false);
      }
    };

    fetchMethods();
  }, []);

  const getEffectivenessColor = (effectiveness) => {
    switch (effectiveness) {
      case 'High':
        return 'success';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'error';
      default:
        return 'default';
    }
  };

  const getComplexityColor = (complexity) => {
    switch (complexity) {
      case 'High':
        return 'error';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Circumvention Methods
      </Typography>
      
      <Typography variant="body1" paragraph>
        Here are several methods that can help you bypass DPI restrictions and access blocked content.
        Each method has different levels of effectiveness, complexity, and use cases.
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      ) : (
        <Box sx={{ mt: 3 }}>
          {methods.map((method) => (
            <Card key={method.id} sx={{ mb: 3 }}>
              <CardHeader
                title={method.name}
                action={
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip 
                      label={`Effectiveness: ${method.effectiveness}`} 
                      color={getEffectivenessColor(method.effectiveness)}
                      size="small"
                    />
                    <Chip 
                      label={`Complexity: ${method.complexity}`} 
                      color={getComplexityColor(method.complexity)}
                      size="small"
                    />
                  </Box>
                }
              />
              <Divider />
              <CardContent>
                <Typography variant="body1" paragraph>
                  {method.description}
                </Typography>
                
                <Typography variant="subtitle1" gutterBottom>
                  Examples:
                </Typography>
                <List dense>
                  {method.examples.map((example, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={example} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          ))}

          <Paper elevation={1} sx={{ p: 3, mt: 4, backgroundColor: '#f8f9fa' }}>
            <Typography variant="h6" gutterBottom>
              Important Disclaimer
            </Typography>
            <Typography variant="body2">
              The information provided here is for educational purposes only. Always comply with local laws and regulations 
              when using internet services. The developers of this tool are not responsible for any misuse of this information.
            </Typography>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default CircumventionMethods;