import React from 'react';
import { Box, Container, Typography, Link, Divider } from '@mui/material';
import { DirectionsBus as DirectionsBusIcon } from '@mui/icons-material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 3,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'center', sm: 'flex-start' },
          textAlign: { xs: 'center', sm: 'left' },
          mb: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, sm: 0 }, pt: {  xs: 2, sm: 0 }}}>
            <DirectionsBusIcon sx={{ fontSize: 24, mr: 1 }} />
            <Typography variant="h6" component="div">
              Sistema de Gestión de Autobuses
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ mb: 2 }}>
              Solución completa para la gestión eficiente de flotas de autobuses, rutas, horarios y reservas.
                </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            gap: 3,
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <Link href="/" color="inherit" underline="hover">Inicio</Link>
            <Link href="/buses" color="inherit" underline="hover">Autobuses</Link>
            <Link href="/routes" color="inherit" underline="hover">Rutas</Link>
            <Link href="/schedules" color="inherit" underline="hover">Horarios</Link>
            <Link href="/reservations" color="inherit" underline="hover">Reservas</Link>
          </Box>
        </Box>
        
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', my: 2 }} />
        
        <Typography variant="body2" align="center">
          &copy; {currentYear} Sistema de Gestión de Autobuses
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;