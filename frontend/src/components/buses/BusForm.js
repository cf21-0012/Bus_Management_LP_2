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
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { getBusById, createBus, updateBus } from '../../services/api';

const BusForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    busNumber: '',
    model: '',
    capacity: '',
    year: new Date().getFullYear(),
    status: 'Active'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBus = async () => {
      if (isEditMode) {
        try {
          setLoading(true);
          const data = await getBusById(id);
          setFormData(data);
          setLoading(false);
        } catch (err) {
          setError('Error al cargar los datos del autobús');
          setLoading(false);
          console.error(err);
        }
      }
    };

    fetchBus();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'capacity' || name === 'year' ? parseInt(value, 10) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (isEditMode) {
        await updateBus(id, formData);
      } else {
        await createBus(formData);
      }
      
      setLoading(false);
      navigate('/buses');
    } catch (err) {
      setError(`Error al ${isEditMode ? 'actualizar' : 'crear'} el autobús`);
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
    <Container maxWidth="md">
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isEditMode ? 'Editar Autobús' : 'Agregar Autobús'}
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="busNumber"
                label="Número de Autobús"
                value={formData.busNumber}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="model"
                label="Modelo"
                value={formData.model}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="capacity"
                label="Capacidad"
                type="number"
                value={formData.capacity}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="year"
                label="Año"
                type="number"
                value={formData.year}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
                inputProps={{ min: 1990, max: new Date().getFullYear() + 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="status-label">Estado</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Estado"
                >
                  <MenuItem value="Active">Activo</MenuItem>
                  <MenuItem value="Maintenance">Mantenimiento</MenuItem>
                  <MenuItem value="Out of Service">Fuera de Servicio</MenuItem>
                </Select>
              </FormControl>
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
                  onClick={() => navigate('/buses')}
                >
                  Cancelar
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default BusForm;