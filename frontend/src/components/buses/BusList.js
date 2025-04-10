import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Button, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  IconButton,
  Box,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { getBuses, deleteBus } from '../../services/api';

const BusList = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const data = await getBuses();
      setBuses(data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar los autobuses');
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este autobús?')) {
      try {
        await deleteBus(id);
        fetchBuses(); // Recargar la lista después de eliminar
      } catch (err) {
        setError('Error al eliminar el autobús');
        console.error(err);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'activo':
        return 'success';
      case 'maintenance':
      case 'mantenimiento':
        return 'warning';
      case 'out of service':
      case 'fuera de servicio':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Autobuses
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          component={RouterLink}
          to="/buses/add"
        >
          Agregar Autobús
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {buses.length === 0 ? (
        <Alert severity="info">No hay autobuses registrados</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Número</TableCell>
                <TableCell>Modelo</TableCell>
                <TableCell>Capacidad</TableCell>
                <TableCell>Año</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {buses.map((bus) => (
                <TableRow key={bus.id}>
                  <TableCell>{bus.busNumber}</TableCell>
                  <TableCell>{bus.model}</TableCell>
                  <TableCell>{bus.capacity}</TableCell>
                  <TableCell>{bus.year}</TableCell>
                  <TableCell>
                    <Chip 
                      label={bus.status} 
                      color={getStatusColor(bus.status)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton 
                      color="primary" 
                      component={RouterLink} 
                      to={`/buses/edit/${bus.id}`}
                      aria-label="editar"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDelete(bus.id)}
                      aria-label="eliminar"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default BusList;