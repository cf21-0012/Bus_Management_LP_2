import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBuses, getRoutes, getSchedules, getReservations } from '../services/api';

const Dashboard = () => {
  const [counts, setCounts] = useState({
    buses: 0,
    routes: 0,
    schedules: 0,
    reservations: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [buses, routes, schedules, reservations] = await Promise.all([
          getBuses(),
          getRoutes(),
          getSchedules(),
          getReservations()
        ]);

        setCounts({
          buses: buses.length,
          routes: routes.length,
          schedules: schedules.length,
          reservations: reservations.length
        });
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los datos del dashboard');
        setLoading(false);
        console.error(err);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="dashboard">
        <div className="dashboard-card">
          <div className="icon">🚌</div>
          <h2>Autobuses</h2>
          <div className="count">{counts.buses}</div>
          <Link to="/buses" className="btn btn-primary">Ver Autobuses</Link>
        </div>

        <div className="dashboard-card">
          <div className="icon">🛣️</div>
          <h2>Rutas</h2>
          <div className="count">{counts.routes}</div>
          <Link to="/routes" className="btn btn-primary">Ver Rutas</Link>
        </div>

        <div className="dashboard-card">
          <div className="icon">🕒</div>
          <h2>Horarios</h2>
          <div className="count">{counts.schedules}</div>
          <Link to="/schedules" className="btn btn-primary">Ver Horarios</Link>
        </div>

        <div className="dashboard-card">
          <div className="icon">🎫</div>
          <h2>Reservas</h2>
          <div className="count">{counts.reservations}</div>
          <Link to="/reservations" className="btn btn-primary">Ver Reservas</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;