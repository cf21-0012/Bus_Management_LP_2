const API_URL = 'http://localhost:5000';

// Funciones para autobuses
export const getBuses = async () => {
  const response = await fetch(`${API_URL}/buses`);
  if (!response.ok) {
    throw new Error('Error al obtener autobuses');
  }
  return response.json();
};

export const getBusById = async (id) => {
  const response = await fetch(`${API_URL}/buses/${id}`);
  if (!response.ok) {
    throw new Error('Error al obtener el autobús');
  }
  return response.json();
};

export const createBus = async (busData) => {
  const response = await fetch(`${API_URL}/buses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(busData),
  });
  if (!response.ok) {
    throw new Error('Error al crear el autobús');
  }
  return response.json();
};

export const updateBus = async (id, busData) => {
  const response = await fetch(`${API_URL}/buses/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(busData),
  });
  if (!response.ok) {
    throw new Error('Error al actualizar el autobús');
  }
  return response.json();
};

export const deleteBus = async (id) => {
  const response = await fetch(`${API_URL}/buses/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Error al eliminar el autobús');
  }
  return response.json();
};

// Funciones para rutas
export const getRoutes = async () => {
  const response = await fetch(`${API_URL}/routes`);
  if (!response.ok) {
    throw new Error('Error al obtener rutas');
  }
  return response.json();
};

export const getRouteById = async (id) => {
  const response = await fetch(`${API_URL}/routes/${id}`);
  if (!response.ok) {
    throw new Error('Error al obtener la ruta');
  }
  return response.json();
};

export const createRoute = async (routeData) => {
  const response = await fetch(`${API_URL}/routes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(routeData),
  });
  if (!response.ok) {
    throw new Error('Error al crear la ruta');
  }
  return response.json();
};

export const updateRoute = async (id, routeData) => {
  const response = await fetch(`${API_URL}/routes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(routeData),
  });
  if (!response.ok) {
    throw new Error('Error al actualizar la ruta');
  }
  return response.json();
};

export const deleteRoute = async (id) => {
  const response = await fetch(`${API_URL}/routes/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Error al eliminar la ruta');
  }
  return response.json();
};

// Funciones para horarios
export const getSchedules = async () => {
  const response = await fetch(`${API_URL}/schedules`);
  if (!response.ok) {
    throw new Error('Error al obtener horarios');
  }
  return response.json();
};

export const getScheduleById = async (id) => {
  const response = await fetch(`${API_URL}/schedules/${id}`);
  if (!response.ok) {
    throw new Error('Error al obtener el horario');
  }
  return response.json();
};

export const createSchedule = async (scheduleData) => {
  const response = await fetch(`${API_URL}/schedules`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(scheduleData),
  });
  if (!response.ok) {
    throw new Error('Error al crear el horario');
  }
  return response.json();
};

export const updateSchedule = async (id, scheduleData) => {
  const response = await fetch(`${API_URL}/schedules/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(scheduleData),
  });
  if (!response.ok) {
    throw new Error('Error al actualizar el horario');
  }
  return response.json();
};

export const deleteSchedule = async (id) => {
  const response = await fetch(`${API_URL}/schedules/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Error al eliminar el horario');
  }
  return response.json();
};

// Funciones para reservas
export const getReservations = async () => {
  const response = await fetch(`${API_URL}/reservations`);
  if (!response.ok) {
    throw new Error('Error al obtener reservas');
  }
  return response.json();
};

export const getReservationById = async (id) => {
  const response = await fetch(`${API_URL}/reservations/${id}`);
  if (!response.ok) {
    throw new Error('Error al obtener la reserva');
  }
  return response.json();
};

export const createReservation = async (reservationData) => {
  const response = await fetch(`${API_URL}/reservations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reservationData),
  });
  if (!response.ok) {
    throw new Error('Error al crear la reserva');
  }
  return response.json();
};

export const deleteReservation = async (id) => {
  const response = await fetch(`${API_URL}/reservations/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Error al eliminar la reserva');
  }
  return response.json();
};