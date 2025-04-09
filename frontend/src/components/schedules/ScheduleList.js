import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSchedules, deleteSchedule } from '../../services/api';

const ScheduleList = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

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

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este horario?')) {
      try {
        await deleteSchedule(id);
        setMessage('Horario eliminado con éxito');
        fetchSchedules();
      } catch (err) {
        setError('Error al eliminar el horario');
        console.error(err);
      }
    }
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
          <h2>Lista de Horarios</h2>
          <Link to="/schedules/add" className="btn btn-primary">Agregar Horario</Link>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}
          
          {schedules.length === 0 ? (
            <p>No hay horarios registrados.</p>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Autobús</th>
                    <th>Ruta</th>
                    <th>Salida</th>
                    <th>Llegada</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map((schedule) => (
                    <tr key={schedule.id}>
                      <td>{schedule.bus.busNumber}</td>
                      <td>{schedule.route.routeName} ({schedule.route.origin} - {schedule.route.destination})</td>
                      <td>{formatDateTime(schedule.departureTime)}</td>
                      <td>{formatDateTime(schedule.arrivalTime)}</td>
                      <td className="actions">
                        <Link to={`/schedules/edit/${schedule.id}`} className="btn btn-secondary">Editar</Link>
                        <button 
                          onClick={() => handleDelete(schedule.id)} 
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

export default ScheduleList;