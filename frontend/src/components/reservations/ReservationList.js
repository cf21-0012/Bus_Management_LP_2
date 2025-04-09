import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getReservations, deleteReservation } from '../../services/api';

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

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
        setMessage('Reserva eliminada con éxito');
        fetchReservations();
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
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2>Lista de Reservas</h2>
          <Link to="/reservations/add" className="btn btn-primary">Agregar Reserva</Link>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}
          
          {reservations.length === 0 ? (
            <p>No hay reservas registradas.</p>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Pasajero</th>
                    <th>Asiento</th>
                    <th>Fecha de Reserva</th>
                    <th>Ruta</th>
                    <th>Autobús</th>
                    <th>Salida</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((reservation) => (
                    <tr key={reservation.id}>
                      <td>{reservation.passengerName}</td>
                      <td>{reservation.seatNumber}</td>
                      <td>{formatDate(reservation.reservationDate)}</td>
                      <td>{reservation.schedule.route.routeName}</td>
                      <td>{reservation.schedule.bus.busNumber}</td>
                      <td>{formatDateTime(reservation.schedule.departureTime)}</td>
                      <td className="actions">
                        <button 
                          onClick={() => handleDelete(reservation.id)} 
                          className="btn btn-danger"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationList;