import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSchedules, createReservation } from '../../services/api';

const ReservationForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    scheduleId: '',
    passengerName: '',
    seatNumber: '',
    reservationDate: new Date().toISOString().split('T')[0]
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createReservation(formData);
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
    return <div>Cargando...</div>;
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>Agregar Reserva</h2>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="scheduleId" className="form-label">Horario</label>
            <select
              id="scheduleId"
              name="scheduleId"
              className="form-control"
              value={formData.scheduleId}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar Horario</option>
              {schedules.map((schedule) => (
                <option key={schedule.id} value={schedule.id}>
                  {schedule.route.routeName} ({schedule.route.origin} - {schedule.route.destination}) - 
                  Autobús: {schedule.bus.busNumber} - 
                  Salida: {formatDateTime(schedule.departureTime)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="passengerName" className="form-label">Nombre del Pasajero</label>
            <input
              type="text"
              id="passengerName"
              name="passengerName"
              className="form-control"
              value={formData.passengerName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="seatNumber" className="form-label">Número de Asiento</label>
            <input
              type="number"
              id="seatNumber"
              name="seatNumber"
              className="form-control"
              value={formData.seatNumber}
              onChange={handleChange}
              required
              min="1"
              max="50"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="reservationDate" className="form-label">Fecha de Reserva</label>
            <input
              type="date"
              id="reservationDate"
              name="reservationDate"
              className="form-control"
              value={formData.reservationDate}
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
              onClick={() => navigate('/reservations')}
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

export default ReservationForm;