import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import ConnectionTest from './pages/ConnectionTest';
import DnsTest from './pages/DnsTest';
import DpiTest from './pages/DpiTest';
import PacketTest from './pages/PacketTest';
import CircumventionMethods from './pages/CircumventionMethods';
import About from './pages/About';

// Create a theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Header />
          <main className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/connection-test" element={<ConnectionTest />} />
              <Route path="/dns-test" element={<DnsTest />} />
              <Route path="/dpi-test" element={<DpiTest />} />
              <Route path="/packet-test" element={<PacketTest />} />
              <Route path="/circumvention-methods" element={<CircumventionMethods />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;