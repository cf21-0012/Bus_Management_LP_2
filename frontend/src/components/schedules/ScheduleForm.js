import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getScheduleById, createSchedule, updateSchedule, getBuses, getRoutes } from '../../services/api';

const ScheduleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    busId: '',
    routeId: '',
    departureTime: '',
    arrivalTime: ''
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
          // Convertir las fechas ISO a formato local para los inputs datetime-local
          const departureTime = new Date(scheduleData.departureTime).toISOString().slice(0, 16);
          const arrivalTime = new Date(scheduleData.arrivalTime).toISOString().slice(0, 16);
          
          setFormData({
            ...scheduleData,
            departureTime,
            arrivalTime
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar que la hora de llegada sea posterior a la de salida
    if (new Date(formData.arrivalTime) <= new Date(formData.departureTime)) {
      setError('La hora de llegada debe ser posterior a la hora de salida');
      return;
    }
    
    try {
      setLoading(true);
      if (isEditMode) {
        await updateSchedule(id, formData);
      } else {
        await createSchedule(formData);
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
    return <div>Cargando...</div>;
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>{isEditMode ? 'Editar Horario' : 'Agregar Horario'}</h2>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="busId" className="form-label">Autobús</label>
            <select
              id="busId"
              name="busId"
              className="form-control"
              value={formData.busId}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar Autobús</option>
              {buses.map((bus) => (
                <option key={bus.id} value={bus.id}>
                  {bus.busNumber} - {bus.model} ({bus.status})
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="routeId" className="form-label">Ruta</label>
            <select
              id="routeId"
              name="routeId"
              className="form-control"
              value={formData.routeId}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar Ruta</option>
              {routes.map((route) => (
                <option key={route.id} value={route.id}>
                  {route.routeName} ({route.origin} - {route.destination})
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="departureTime" className="form-label">Hora de Salida</label>
            <input
              type="datetime-local"
              id="departureTime"
              name="departureTime"
              className="form-control"
              value={formData.departureTime}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="arrivalTime" className="form-label">Hora de Llegada</label>
            <input
              type="datetime-local"
              id="arrivalTime"
              name="arrivalTime"
              className="form-control"
              value={formData.arrivalTime}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => navigate('/schedules')}
              style={{ marginLeft: '10px' }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleForm;