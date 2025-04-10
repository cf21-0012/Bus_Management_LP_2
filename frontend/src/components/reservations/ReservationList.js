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
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { getReservations, deleteReservation } from '../../services/api';

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const data = await getReservations();
      setReservations(data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar las reservas');
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta reserva?')) {
      try {
        await deleteReservation(id);
        fetchReservations(); // Recargar la lista después de eliminar
      } catch (err) {
        setError('Error al eliminar la reserva');
        console.error(err);
      }
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString();
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
          Reservas
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          component={RouterLink}
          to="/reservations/add"
        >
          Agregar Reserva
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {reservations.length === 0 ? (
        <Alert severity="info">No hay reservas registradas</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Pasajero</TableCell>
                <TableCell>Asiento</TableCell>
                <TableCell>Fecha de Reserva</TableCell>
                <TableCell>Ruta</TableCell>
                <TableCell>Salida</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell>{reservation.passengerName}</TableCell>
                  <TableCell>{reservation.seatNumber}</TableCell>
                  <TableCell>{formatDate(reservation.reservationDate)}</TableCell>
                  <TableCell>
                    {reservation.schedule.route.routeName} 
                    ({reservation.schedule.route.origin} - {reservation.schedule.route.destination})
                  </TableCell>
                  <TableCell>{formatDateTime(reservation.schedule.departureTime)}</TableCell>
                  <TableCell align="center">
                    <IconButton 
                      color="error" 
                      onClick={() => handleDelete(reservation.id)}
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

export default ReservationList;