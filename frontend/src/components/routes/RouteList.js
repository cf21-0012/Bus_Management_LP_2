import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRoutes, deleteRoute } from '../../services/api';

const RouteList = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const data = await getRoutes();
      setRoutes(data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar las rutas');
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta ruta?')) {
      try {
        await deleteRoute(id);
        setMessage('Ruta eliminada con éxito');
        fetchRoutes();
      } catch (err) {
        setError('Error al eliminar la ruta');
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
          <h2>Lista de Rutas</h2>
          <Link to="/routes/add" className="btn btn-primary">Agregar Ruta</Link>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}
          
          {routes.length === 0 ? (
            <p>No hay rutas registradas.</p>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Origen</th>
                    <th>Destino</th>
                    <th>Distancia (km)</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {routes.map((route) => (
                    <tr key={route.id}>
                      <td>{route.routeName}</td>
                      <td>{route.origin}</td>
                      <td>{route.destination}</td>
                      <td>{route.distance}</td>
                      <td className="actions">
                        <Link to={`/routes/edit/${route.id}`} className="btn btn-secondary">Editar</Link>
                        <button 
                          onClick={() => handleDelete(route.id)} 
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

export default RouteList;