from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)  # Habilitar CORS para todas las rutas

# Configuración de la base de datos PostgreSQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:password@localhost/bus_management'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Modelos
class Bus(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    busNumber = db.Column(db.String(20), unique=True, nullable=False)
    model = db.Column(db.String(50), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    year = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), nullable=False)
    schedules = db.relationship('Schedule', backref='bus', lazy=True, cascade="all, delete-orphan")

class Route(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    routeName = db.Column(db.String(100), nullable=False)
    origin = db.Column(db.String(100), nullable=False)
    destination = db.Column(db.String(100), nullable=False)
    distance = db.Column(db.Float, nullable=False)
    schedules = db.relationship('Schedule', backref='route', lazy=True, cascade="all, delete-orphan")

class Schedule(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    busId = db.Column(db.Integer, db.ForeignKey('bus.id'), nullable=False)
    routeId = db.Column(db.Integer, db.ForeignKey('route.id'), nullable=False)
    departureTime = db.Column(db.DateTime, nullable=False)
    arrivalTime = db.Column(db.DateTime, nullable=False)
    reservations = db.relationship('Reservation', backref='schedule', lazy=True, cascade="all, delete-orphan")

class Reservation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    scheduleId = db.Column(db.Integer, db.ForeignKey('schedule.id'), nullable=False)
    passengerName = db.Column(db.String(100), nullable=False)
    seatNumber = db.Column(db.Integer, nullable=False)
    reservationDate = db.Column(db.Date, nullable=False)

# Crear las tablas en la base de datos
with app.app_context():
    db.create_all()

# Rutas para Autobuses
@app.route('/buses', methods=['GET'])
def get_buses():
    buses = Bus.query.all()
    result = []
    for bus in buses:
        bus_data = {
            'id': bus.id,
            'busNumber': bus.busNumber,
            'model': bus.model,
            'capacity': bus.capacity,
            'year': bus.year,
            'status': bus.status
        }
        result.append(bus_data)
    return jsonify(result)

@app.route('/buses/<int:id>', methods=['GET'])
def get_bus(id):
    bus = Bus.query.get_or_404(id)
    return jsonify({
        'id': bus.id,
        'busNumber': bus.busNumber,
        'model': bus.model,
        'capacity': bus.capacity,
        'year': bus.year,
        'status': bus.status
    })

@app.route('/buses', methods=['POST'])
def create_bus():
    data = request.get_json()
    new_bus = Bus(
        busNumber=data['busNumber'],
        model=data['model'],
        capacity=data['capacity'],
        year=data['year'],
        status=data['status']
    )
    db.session.add(new_bus)
    db.session.commit()
    return jsonify({
        'id': new_bus.id,
        'busNumber': new_bus.busNumber,
        'model': new_bus.model,
        'capacity': new_bus.capacity,
        'year': new_bus.year,
        'status': new_bus.status
    }), 201

@app.route('/buses/<int:id>', methods=['PUT'])
def update_bus(id):
    bus = Bus.query.get_or_404(id)
    data = request.get_json()
    
    bus.busNumber = data.get('busNumber', bus.busNumber)
    bus.model = data.get('model', bus.model)
    bus.capacity = data.get('capacity', bus.capacity)
    bus.year = data.get('year', bus.year)
    bus.status = data.get('status', bus.status)
    
    db.session.commit()
    return jsonify({
        'id': bus.id,
        'busNumber': bus.busNumber,
        'model': bus.model,
        'capacity': bus.capacity,
        'year': bus.year,
        'status': bus.status
    })

@app.route('/buses/<int:id>', methods=['DELETE'])
def delete_bus(id):
    bus = Bus.query.get_or_404(id)
    db.session.delete(bus)
    db.session.commit()
    return jsonify({'message': 'Bus deleted successfully'})

# Rutas para Rutas
@app.route('/routes', methods=['GET'])
def get_routes():
    routes = Route.query.all()
    result = []
    for route in routes:
        route_data = {
            'id': route.id,
            'routeName': route.routeName,
            'origin': route.origin,
            'destination': route.destination,
            'distance': route.distance
        }
        result.append(route_data)
    return jsonify(result)

@app.route('/routes/<int:id>', methods=['GET'])
def get_route(id):
    route = Route.query.get_or_404(id)
    return jsonify({
        'id': route.id,
        'routeName': route.routeName,
        'origin': route.origin,
        'destination': route.destination,
        'distance': route.distance
    })

@app.route('/routes', methods=['POST'])
def create_route():
    data = request.get_json()
    new_route = Route(
        routeName=data['routeName'],
        origin=data['origin'],
        destination=data['destination'],
        distance=data['distance']
    )
    db.session.add(new_route)
    db.session.commit()
    return jsonify({
        'id': new_route.id,
        'routeName': new_route.routeName,
        'origin': new_route.origin,
        'destination': new_route.destination,
        'distance': new_route.distance
    }), 201

@app.route('/routes/<int:id>', methods=['PUT'])
def update_route(id):
    route = Route.query.get_or_404(id)
    data = request.get_json()
    
    route.routeName = data.get('routeName', route.routeName)
    route.origin = data.get('origin', route.origin)
    route.destination = data.get('destination', route.destination)
    route.distance = data.get('distance', route.distance)
    
    db.session.commit()
    return jsonify({
        'id': route.id,
        'routeName': route.routeName,
        'origin': route.origin,
        'destination': route.destination,
        'distance': route.distance
    })

@app.route('/routes/<int:id>', methods=['DELETE'])
def delete_route(id):
    route = Route.query.get_or_404(id)
    db.session.delete(route)
    db.session.commit()
    return jsonify({'message': 'Route deleted successfully'})

# Rutas para Horarios
@app.route('/schedules', methods=['GET'])
def get_schedules():
    schedules = Schedule.query.all()
    result = []
    for schedule in schedules:
        schedule_data = {
            'id': schedule.id,
            'busId': schedule.busId,
            'routeId': schedule.routeId,
            'departureTime': schedule.departureTime.isoformat(),
            'arrivalTime': schedule.arrivalTime.isoformat(),
            'bus': {
                'id': schedule.bus.id,
                'busNumber': schedule.bus.busNumber
            },
            'route': {
                'id': schedule.route.id,
                'routeName': schedule.route.routeName,
                'origin': schedule.route.origin,
                'destination': schedule.route.destination
            }
        }
        result.append(schedule_data)
    return jsonify(result)

@app.route('/schedules/<int:id>', methods=['GET'])
def get_schedule(id):
    schedule = Schedule.query.get_or_404(id)
    return jsonify({
        'id': schedule.id,
        'busId': schedule.busId,
        'routeId': schedule.routeId,
        'departureTime': schedule.departureTime.isoformat(),
        'arrivalTime': schedule.arrivalTime.isoformat(),
        'bus': {
            'id': schedule.bus.id,
            'busNumber': schedule.bus.busNumber
        },
        'route': {
            'id': schedule.route.id,
            'routeName': schedule.route.routeName,
            'origin': schedule.route.origin,
            'destination': schedule.route.destination
        }
    })

@app.route('/schedules', methods=['POST'])
def create_schedule():
    data = request.get_json()
    departure_time = datetime.fromisoformat(data['departureTime'])
    arrival_time = datetime.fromisoformat(data['arrivalTime'])
    
    new_schedule = Schedule(
        busId=data['busId'],
        routeId=data['routeId'],
        departureTime=departure_time,
        arrivalTime=arrival_time
    )
    db.session.add(new_schedule)
    db.session.commit()
    return jsonify({
        'id': new_schedule.id,
        'busId': new_schedule.busId,
        'routeId': new_schedule.routeId,
        'departureTime': new_schedule.departureTime.isoformat(),
        'arrivalTime': new_schedule.arrivalTime.isoformat()
    }), 201

@app.route('/schedules/<int:id>', methods=['PUT'])
def update_schedule(id):
    schedule = Schedule.query.get_or_404(id)
    data = request.get_json()
    
    if 'busId' in data:
        schedule.busId = data['busId']
    if 'routeId' in data:
        schedule.routeId = data['routeId']
    if 'departureTime' in data:
        schedule.departureTime = datetime.fromisoformat(data['departureTime'])
    if 'arrivalTime' in data:
        schedule.arrivalTime = datetime.fromisoformat(data['arrivalTime'])
    
    db.session.commit()
    return jsonify({
        'id': schedule.id,
        'busId': schedule.busId,
        'routeId': schedule.routeId,
        'departureTime': schedule.departureTime.isoformat(),
        'arrivalTime': schedule.arrivalTime.isoformat()
    })

@app.route('/schedules/<int:id>', methods=['DELETE'])
def delete_schedule(id):
    schedule = Schedule.query.get_or_404(id)
    db.session.delete(schedule)
    db.session.commit()
    return jsonify({'message': 'Schedule deleted successfully'})

# Rutas para Reservas
@app.route('/reservations', methods=['GET'])
def get_reservations():
    reservations = Reservation.query.all()
    result = []
    for reservation in reservations:
        reservation_data = {
            'id': reservation.id,
            'scheduleId': reservation.scheduleId,
            'passengerName': reservation.passengerName,
            'seatNumber': reservation.seatNumber,
            'reservationDate': reservation.reservationDate.isoformat(),
            'schedule': {
                'departureTime': reservation.schedule.departureTime.isoformat(),
                'arrivalTime': reservation.schedule.arrivalTime.isoformat(),
                'bus': {
                    'busNumber': reservation.schedule.bus.busNumber
                },
                'route': {
                    'routeName': reservation.schedule.route.routeName,
                    'origin': reservation.schedule.route.origin,
                    'destination': reservation.schedule.route.destination
                }
            }
        }
        result.append(reservation_data)
    return jsonify(result)

@app.route('/reservations/<int:id>', methods=['GET'])
def get_reservation(id):
    reservation = Reservation.query.get_or_404(id)
    return jsonify({
        'id': reservation.id,
        'scheduleId': reservation.scheduleId,
        'passengerName': reservation.passengerName,
        'seatNumber': reservation.seatNumber,
        'reservationDate': reservation.reservationDate.isoformat(),
        'schedule': {
            'departureTime': reservation.schedule.departureTime.isoformat(),
            'arrivalTime': reservation.schedule.arrivalTime.isoformat(),
            'bus': {
                'busNumber': reservation.schedule.bus.busNumber
            },
            'route': {
                'routeName': reservation.schedule.route.routeName,
                'origin': reservation.schedule.route.origin,
                'destination': reservation.schedule.route.destination
            }
        }
    })

@app.route('/reservations', methods=['POST'])
def create_reservation():
    data = request.get_json()
    reservation_date = datetime.fromisoformat(data['reservationDate']).date()
    
    new_reservation = Reservation(
        scheduleId=data['scheduleId'],
        passengerName=data['passengerName'],
        seatNumber=data['seatNumber'],
        reservationDate=reservation_date
    )
    db.session.add(new_reservation)
    db.session.commit()
    return jsonify({
        'id': new_reservation.id,
        'scheduleId': new_reservation.scheduleId,
        'passengerName': new_reservation.passengerName,
        'seatNumber': new_reservation.seatNumber,
        'reservationDate': new_reservation.reservationDate.isoformat()
    }), 201

@app.route('/reservations/<int:id>', methods=['DELETE'])
def delete_reservation(id):
    reservation = Reservation.query.get_or_404(id)
    db.session.delete(reservation)
    db.session.commit()
    return jsonify({'message': 'Reservation deleted successfully'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)