import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Paper, 
  Grid, 
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { getSchedules, createReservation } from '../../services/api';

const ReservationForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    scheduleId: '',
    passengerName: '',
    seatNumber: '',
    reservationDate: new Date()
  });
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        const data = await getSchedules();
        setSchedules(data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los horarios');
        setLoading(false);
        console.error(err);
      }
    };

    fetchSchedules();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'scheduleId' || name === 'seatNumber' ? parseInt(value, 10) : value
    });
  };

  const handleDateChange = (newValue) => {
    setFormData({
      ...formData,
      reservationDate: newValue
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const dataToSend = {
        ...formData,
        reservationDate: formData.reservationDate.toISOString()
      };
      
      await createReservation(dataToSend);
      setLoading(false);
      navigate('/reservations');
    } catch (err) {
      setError('Error al crear la reserva');
      setLoading(false);
      console.error(err);
    }
  };

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString();
  };

  if (loading && schedules.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="md">
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Agregar Reserva
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="schedule-label">Horario</InputLabel>
                  <Select
                    labelId="schedule-label"
                    id="scheduleId"
                    name="scheduleId"
                    value={formData.scheduleId}
                    onChange={handleChange}
                    label="Horario"
                    required
                  >
                    <MenuItem value="" disabled>
                      Seleccionar Horario
                    </MenuItem>
                    {schedules.map((schedule) => (
                      <MenuItem key={schedule.id} value={schedule.id}>
                        {schedule.route.routeName} ({schedule.route.origin} - {schedule.route.destination}) - 
                        Autobús: {schedule.bus.busNumber} - 
                        Salida: {formatDateTime(schedule.departureTime)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="passengerName"
                  label="Nombre del Pasajero"
                  value={formData.passengerName}
                  onChange={handleChange}
                  fullWidth
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="seatNumber"
                  label="Número de Asiento"
                  type="number"
                  value={formData.seatNumber}
                  onChange={handleChange}
                  fullWidth
                  required
                  margin="normal"
                  inputProps={{ min: 1, max: 50 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Fecha de Reserva"
                  value={formData.reservationDate}
                  onChange={handleDateChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: "normal",
                      required: true
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    disabled={loading}
                  >
                    {loading ? 'Guardando...' : 'Guardar'}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/reservations')}
                  >
                    Cancelar
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default ReservationForm;