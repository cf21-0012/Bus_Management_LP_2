import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBusById, createBus, updateBus } from '../../services/api';

const BusForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    busNumber: '',
    model: '',
    capacity: '',
    year: '',
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
    return <div>Cargando...</div>;
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>{isEditMode ? 'Editar Autobús' : 'Agregar Autobús'}</h2>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="busNumber" className="form-label">Número de Autobús</label>
            <input
              type="text"
              id="busNumber"
              name="busNumber"
              className="form-control"
              value={formData.busNumber}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="model" className="form-label">Modelo</label>
            <input
              type="text"
              id="model"
              name="model"
              className="form-control"
              value={formData.model}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="capacity" className="form-label">Capacidad</label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              className="form-control"
              value={formData.capacity}
              onChange={handleChange}
              required
              min="1"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="year" className="form-label">Año</label>
            <input
              type="number"
              id="year"
              name="year"
              className="form-control"
              value={formData.year}
              onChange={handleChange}
              required
              min="1900"
              max={new Date().getFullYear()}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="status" className="form-label">Estado</label>
            <select
              id="status"
              name="status"
              className="form-control"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="Active">Activo</option>
              <option value="Maintenance">En Mantenimiento</option>
              <option value="Out of Service">Fuera de Servicio</option>
            </select>
          </div>
          
          <div className="form-group">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => navigate('/buses')}
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

export default BusForm;