import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBuses, deleteBus } from '../../services/api';

const BusList = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const data = await getBuses();
      setBuses(data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar los autobuses');
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este autobús?')) {
      try {
        await deleteBus(id);
        setMessage('Autobús eliminado con éxito');
        fetchBuses();
      } catch (err) {
        setError('Error al eliminar el autobús');
        console.error(err);
      }
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2>Lista de Autobuses</h2>
          <Link to="/buses/add" className="btn btn-primary">Agregar Autobús</Link>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}
          
          {buses.length === 0 ? (
            <p>No hay autobuses registrados.</p>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Número</th>
                    <th>Modelo</th>
                    <th>Capacidad</th>
                    <th>Año</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {buses.map((bus) => (
                    <tr key={bus.id}>
                      <td>{bus.busNumber}</td>
                      <td>{bus.model}</td>
                      <td>{bus.capacity}</td>
                      <td>{bus.year}</td>
                      <td>{bus.status}</td>
                      <td className="actions">
                        <Link to={`/buses/edit/${bus.id}`} className="btn btn-secondary">Editar</Link>
                        <button 
                          onClick={() => handleDelete(bus.id)} 
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

export default BusList;