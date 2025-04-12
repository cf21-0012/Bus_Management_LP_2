import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer'; 
import Dashboard from './components/Dashboard';
import BusList from './components/buses/BusList';
import BusForm from './components/buses/BusForm';
import RouteList from './components/routes/RouteList';
import RouteForm from './components/routes/RouteForm';
import ScheduleList from './components/schedules/ScheduleList';
import ScheduleForm from './components/schedules/ScheduleForm';
import ReservationList from './components/reservations/ReservationList';
import ReservationForm from './components/reservations/ReservationForm';

const theme = createTheme({
  palette: {
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
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      marginBottom: '1rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/buses" element={<BusList />} />
              <Route path="/buses/add" element={<BusForm />} />
              <Route path="/buses/edit/:id" element={<BusForm />} />
              <Route path="/routes" element={<RouteList />} />
              <Route path="/routes/add" element={<RouteForm />} />
              <Route path="/routes/edit/:id" element={<RouteForm />} />
              <Route path="/schedules" element={<ScheduleList />} />
              <Route path="/schedules/add" element={<ScheduleForm />} />
              <Route path="/schedules/edit/:id" element={<ScheduleForm />} />
              <Route path="/reservations" element={<ReservationList />} />
              <Route path="/reservations/add" element={<ReservationForm />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;