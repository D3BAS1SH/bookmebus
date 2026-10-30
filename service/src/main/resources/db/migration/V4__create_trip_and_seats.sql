-- V4__create_trip_and_seats.sql

CREATE TYPE trip_status AS ENUM ( 'SCHEDULED', 'IN_TRANSIT', 'COMPLETED', 'CANCELED' );

CREATE TABLE trip
(
    trip_id UUID PRIMARY KEY DEFAULT uuidv7(),
    bus_id UUID NOT NULL REFERENCES bus(bus_id) ON DELETE RESTRICT,
    route_id UUID NOT NULL REFERENCES route(route_id) ON DELETE RESTRICT,
    driver_id UUID NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    departure_time TIMESTAMP WITH TIME ZONE NOT NULL,
    expected_duration_min INTEGER NOT NULL CHECK ( expected_duration_min > 0 ),
    status trip_status NOT NULL DEFAULT 'SCHEDULED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_trip_bus ON trip (bus_id);
CREATE INDEX idx_trip_route ON trip (route_id);
CREATE INDEX idx_trip_driver ON trip (driver_id);
CREATE INDEX idx_trip_status ON trip (status);

CREATE INDEX idx_trip_route_departure ON trip (route_id, departure_time);

CREATE TABLE trip_seat
(
    trip_seat_id UUID PRIMARY KEY DEFAULT uuidv7(),
    trip_id UUID NOT NULL REFERENCES trip(trip_id) ON DELETE CASCADE,
    seat_number VARCHAR(10) NOT NULL,
    -- Optimistic lock version — starts at 0, incremented on each booking attempt
    version INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

    CONSTRAINT uq_trip_seat UNIQUE (trip_id,seat_number)
);

CREATE INDEX idx_trip_seat_trip ON trip_seat(trip_id);