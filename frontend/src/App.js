import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Importar componentes
import BusList from './components/buses/BusList';
import BusForm from './components/buses/BusForm';
import RouteList from './components/routes/RouteList';
import RouteForm from './components/routes/RouteForm';
import ScheduleList from './components/schedules/ScheduleList';
import ScheduleForm from './components/schedules/ScheduleForm';
import ReservationList from './components/reservations/ReservationList';
import ReservationForm from './components/reservations/ReservationForm';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="navbar-brand">Sistema de Gestión de Autobuses</div>
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/" className="nav-link">Inicio</Link>
            </li>
            <li className="nav-item">
              <Link to="/buses" className="nav-link">Autobuses</Link>
            </li>
            <li className="nav-item">
              <Link to="/routes" className="nav-link">Rutas</Link>
            </li>
            <li className="nav-item">
              <Link to="/schedules" className="nav-link">Horarios</Link>
            </li>
            <li className="nav-item">
              <Link to="/reservations" className="nav-link">Reservas</Link>
            </li>
          </ul>
        </nav>

        <div className="container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/buses" element={<BusList />} />
            <Route path="/buses/add" element={<BusForm />} />
            <Route path="/buses/edit/:id" element={<BusForm />} />
            <Route path="/routes" element={<RouteList />} />
            <Route path="/routes/add" element={<RouteForm />} />
            <Route path="/routes/edit/:id" element={<RouteForm />} />
            <Route path="/schedules" element={<ScheduleList />} />
            <Route path="/schedules/add" element={<ScheduleForm />} />
            <Route path="/schedules/edit/:id" element={<ScheduleForm />} />
            <Route path="/reservations" element={<ReservationList />} />
            <Route path="/reservations/add" element={<ReservationForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;