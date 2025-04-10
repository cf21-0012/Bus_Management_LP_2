import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import RouteIcon from '@mui/icons-material/Route';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { getBuses, getRoutes, getSchedules, getReservations } from '../services/api';

const Dashboard = () => {
  const [counts, setCounts] = useState({
    buses: 0,
    routes: 0,
    schedules: 0,
    reservations: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [buses, routes, schedules, reservations] = await Promise.all([
          getBuses(),
          getRoutes(),
          getSchedules(),
          getReservations()
        ]);

        setCounts({
          buses: buses.length,
          routes: routes.length,
          schedules: schedules.length,
          reservations: reservations.length
        });
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los datos del dashboard');
        setLoading(false);
        console.error(err);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
  }

  const dashboardItems = [
    {
      title: 'Autobuses',
      count: counts.buses,
      icon: <DirectionsBusIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      link: '/buses',
      color: '#bbdefb'
    },
    {
      title: 'Rutas',
      count: counts.routes,
      icon: <RouteIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      link: '/routes',
      color: '#c8e6c9'
    },
    {
      title: 'Horarios',
      count: counts.schedules,
      icon: <AccessTimeIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      link: '/schedules',
      color: '#fff9c4'
    },
    {
      title: 'Reservas',
      count: counts.reservations,
      icon: <ConfirmationNumberIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      link: '/reservations',
      color: '#ffccbc'
    }
  ];

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {dashboardItems.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.title}>
            <Card sx={{ height: '100%', bgcolor: item.color }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Box sx={{ mb: 2 }}>
                  {item.icon}
                </Box>
                <Typography variant="h5" component="h2" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="h3" component="div" sx={{ mb: 2, fontWeight: 'bold' }}>
                  {item.count}
                </Typography>
                <Button 
                  variant="contained" 
                  component={RouterLink} 
                  to={item.link}
                  fullWidth
                >
                  Ver {item.title}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Dashboard;