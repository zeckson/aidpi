import React from 'react';
import {
  Typography,
  Box,
  Paper,
  Divider,
  Link
} from '@mui/material';

const About = () => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        About AIDPI
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          What is AIDPI?
        </Typography>
        <Typography variant="body1" paragraph>
          AIDPI (Analysis of Internet DPI) is a web application designed to test Deep Packet Inspection (DPI) 
          limitations imposed by regulatory bodies like Roskomnadzor. It helps users understand if their 
          internet connection is being monitored or restricted and provides information about potential 
          solutions to overcome these limitations.
        </Typography>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h6" gutterBottom>
          What is DPI?
        </Typography>
        <Typography variant="body1" paragraph>
          Deep Packet Inspection (DPI) is an advanced method of examining and managing network traffic. 
          It goes beyond the basic inspection of packet headers to analyze the data portion (payload) of 
          packets as they pass an inspection point. DPI can identify, classify, reroute, or block packets 
          with specific data or code payloads that conventional packet filtering cannot detect.
        </Typography>
        <Typography variant="body1" paragraph>
          Regulatory bodies like Roskomnadzor in Russia use DPI to implement internet censorship by 
          blocking access to specific websites, services, or content deemed illegal or undesirable 
          according to local laws.
        </Typography>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h6" gutterBottom>
          Features of AIDPI
        </Typography>
        <ul>
          <li>
            <Typography variant="body1">
              <strong>Connection Testing:</strong> Check if you can access potentially blocked resources
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              <strong>DNS Testing:</strong> Verify if DNS resolution is being manipulated
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              <strong>DPI Detection:</strong> Identify if DPI is being used to monitor or block your connections
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              <strong>Circumvention Methods:</strong> Learn about ways to bypass DPI restrictions
            </Typography>
          </li>
        </ul>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h6" gutterBottom>
          Disclaimer
        </Typography>
        <Typography variant="body1" paragraph>
          This tool is created for educational purposes only. The information provided is intended to 
          help users understand internet censorship technologies and their implications. Always comply 
          with local laws and regulations when using internet services.
        </Typography>
        <Typography variant="body1">
          The developers of AIDPI are not responsible for any misuse of this application or the 
          information it provides.
        </Typography>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h6" gutterBottom>
          Open Source
        </Typography>
        <Typography variant="body1">
          AIDPI is an open-source project. You can contribute to its development or report issues on 
          <Link href="https://github.com/yourusername/aidpi" target="_blank" rel="noopener" sx={{ ml: 1 }}>
            GitHub
          </Link>.
        </Typography>
      </Paper>
    </Box>
  );
};

export default About;