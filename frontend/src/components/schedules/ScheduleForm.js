import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Paper, 
  Grid, 
  MenuItem,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { getScheduleById, createSchedule, updateSchedule, getBuses, getRoutes } from '../../services/api';

const ScheduleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    busId: '',
    routeId: '',
    departureTime: new Date(),
    arrivalTime: new Date(new Date().getTime() + 60 * 60 * 1000) // 1 hour later
  });
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [busesData, routesData] = await Promise.all([
          getBuses(),
          getRoutes()
        ]);
        
        setBuses(busesData);
        setRoutes(routesData);

        if (isEditMode) {
          const scheduleData = await getScheduleById(id);
          setFormData({
            ...scheduleData,
            departureTime: new Date(scheduleData.departureTime),
            arrivalTime: new Date(scheduleData.arrivalTime)
          });
        }
        
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los datos');
        setLoading(false);
        console.error(err);
      }
    };

    fetchData();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'busId' || name === 'routeId' ? parseInt(value, 10) : value
    });
  };

  const handleDateChange = (name) => (newValue) => {
    setFormData({
      ...formData,
      [name]: newValue
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar que la hora de llegada sea posterior a la de salida
    if (formData.arrivalTime <= formData.departureTime) {
      setError('La hora de llegada debe ser posterior a la hora de salida');
      return;
    }
    
    try {
      setLoading(true);
      
      // Convertir fechas a formato ISO para enviar al servidor
      const dataToSend = {
        ...formData,
        departureTime: formData.departureTime.toISOString(),
        arrivalTime: formData.arrivalTime.toISOString()
      };
      
      if (isEditMode) {
        await updateSchedule(id, dataToSend);
      } else {
        await createSchedule(dataToSend);
      }
      setLoading(false);
      navigate('/schedules');
    } catch (err) {
      setError(`Error al ${isEditMode ? 'actualizar' : 'crear'} el horario`);
      setLoading(false);
      console.error(err);
    }
  };

  if (loading && isEditMode) {
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
            {isEditMode ? 'Editar Horario' : 'Agregar Horario'}
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="bus-label">Autobús</InputLabel>
                  <Select
                    labelId="bus-label"
                    id="busId"
                    name="busId"
                    value={formData.busId}
                    onChange={handleChange}
                    label="Autobús"
                    required
                  >
                    <MenuItem value="" disabled>
                      Seleccionar Autobús
                    </MenuItem>
                    {buses.map((bus) => (
                      <MenuItem key={bus.id} value={bus.id}>
                        {bus.busNumber} - {bus.model} ({bus.status})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="route-label">Ruta</InputLabel>
                  <Select
                    labelId="route-label"
                    id="routeId"
                    name="routeId"
                    value={formData.routeId}
                    onChange={handleChange}
                    label="Ruta"
                    required
                  >
                    <MenuItem value="" disabled>
                      Seleccionar Ruta
                    </MenuItem>
                    {routes.map((route) => (
                      <MenuItem key={route.id} value={route.id}>
                        {route.routeName} ({route.origin} - {route.destination})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <DateTimePicker
                  label="Hora de Salida"
                  value={formData.departureTime}
                  onChange={handleDateChange('departureTime')}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: "normal",
                      required: true
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DateTimePicker
                  label="Hora de Llegada"
                  value={formData.arrivalTime}
                  onChange={handleDateChange('arrivalTime')}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: "normal",
                      required: true
                    }
                  }}
                  minDateTime={formData.departureTime}
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
                    onClick={() => navigate('/schedules')}
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

export default ScheduleForm;