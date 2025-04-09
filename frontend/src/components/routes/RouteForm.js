import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRouteById, createRoute, updateRoute } from '../../services/api';

const RouteForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    routeName: '',
    origin: '',
    destination: '',
    distance: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoute = async () => {
      if (isEditMode) {
        try {
          setLoading(true);
          const data = await getRouteById(id);
          setFormData(data);
          setLoading(false);
        } catch (err) {
          setError('Error al cargar los datos de la ruta');
          setLoading(false);
          console.error(err);
        }
      }
    };

    fetchRoute();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'distance' ? parseFloat(value) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isEditMode) {
        await updateRoute(id, formData);
      } else {
        await createRoute(formData);
      }
      setLoading(false);
      navigate('/routes');
    } catch (err) {
      setError(`Error al ${isEditMode ? 'actualizar' : 'crear'} la ruta`);
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
        <h2>{isEditMode ? 'Editar Ruta' : 'Agregar Ruta'}</h2>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="routeName" className="form-label">Nombre de la Ruta</label>
            <input
              type="text"
              id="routeName"
              name="routeName"
              className="form-control"
              value={formData.routeName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="origin" className="form-label">Origen</label>
            <input
              type="text"
              id="origin"
              name="origin"
              className="form-control"
              value={formData.origin}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="destination" className="form-label">Destino</label>
            <input
              type="text"
              id="destination"
              name="destination"
              className="form-control"
              value={formData.destination}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="distance" className="form-label">Distancia (km)</label>
            <input
              type="number"
              id="distance"
              name="distance"
              className="form-control"
              value={formData.distance}
              onChange={handleChange}
              required
              min="0"
              step="0.1"
            />
          </div>
          
          <div className="form-group">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => navigate('/routes')}
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

export default RouteForm;