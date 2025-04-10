// URL base de la API
const API_URL = 'http://localhost:5000';

// Función auxiliar para manejar las respuestas de fetch
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'Error de servidor'
    }));
    throw new Error(error.message || 'Error en la solicitud');
  }
  return response.json();
};

// Funciones para autobuses
export const getBuses = async () => {
  const response = await fetch(`${API_URL}/buses`);
  return handleResponse(response);
};

export const getBusById = async (id) => {
  const response = await fetch(`${API_URL}/buses/${id}`);
  return handleResponse(response);
};

export const createBus = async (busData) => {
  const response = await fetch(`${API_URL}/buses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(busData),
  });
  return handleResponse(response);
};

export const updateBus = async (id, busData) => {
  const response = await fetch(`${API_URL}/buses/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(busData),
  });
  return handleResponse(response);
};

export const deleteBus = async (id) => {
  const response = await fetch(`${API_URL}/buses/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};

// Funciones para rutas
export const getRoutes = async () => {
  const response = await fetch(`${API_URL}/routes`);
  return handleResponse(response);
};

export const getRouteById = async (id) => {
  const response = await fetch(`${API_URL}/routes/${id}`);
  return handleResponse(response);
};

export const createRoute = async (routeData) => {
  const response = await fetch(`${API_URL}/routes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(routeData),
  });
  return handleResponse(response);
};

export const updateRoute = async (id, routeData) => {
  const response = await fetch(`${API_URL}/routes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(routeData),
  });
  return handleResponse(response);
};

export const deleteRoute = async (id) => {
  const response = await fetch(`${API_URL}/routes/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};

// Funciones para horarios
export const getSchedules = async () => {
  const response = await fetch(`${API_URL}/schedules`);
  return handleResponse(response);
};

export const getScheduleById = async (id) => {
  const response = await fetch(`${API_URL}/schedules/${id}`);
  return handleResponse(response);
};

export const createSchedule = async (scheduleData) => {
  const response = await fetch(`${API_URL}/schedules`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(scheduleData),
  });
  return handleResponse(response);
};

export const updateSchedule = async (id, scheduleData) => {
  const response = await fetch(`${API_URL}/schedules/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(scheduleData),
  });
  return handleResponse(response);
};

export const deleteSchedule = async (id) => {
  const response = await fetch(`${API_URL}/schedules/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};

// Funciones para reservas
export const getReservations = async () => {
  const response = await fetch(`${API_URL}/reservations`);
  return handleResponse(response);
};

export const getReservationById = async (id) => {
  const response = await fetch(`${API_URL}/reservations/${id}`);
  return handleResponse(response);
};

export const createReservation = async (reservationData) => {
  const response = await fetch(`${API_URL}/reservations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reservationData),
  });
  return handleResponse(response);
};

export const updateReservation = async (id, reservationData) => {
  const response = await fetch(`${API_URL}/reservations/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reservationData),
  });
  return handleResponse(response);
};

export const deleteReservation = async (id) => {
  const response = await fetch(`${API_URL}/reservations/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};