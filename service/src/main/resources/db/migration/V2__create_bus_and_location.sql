-- V2__create_bus_and_location.sql

CREATE TYPE bus_status AS ENUM ('ACTIVE', 'MAINTENANCE');

CREATE TABLE bus
(
    bus_id  UUID PRIMARY KEY DEFAULT uuidv7(),
    owner_id    UUID NOT NULL REFERENCES users (user_id)    ON DELETE RESTRICT,
    registration_number VARCHAR(20) NOT NULL UNIQUE,
    vehicle_number VARCHAR(20) NOT NULL UNIQUE,
    price_per_km    NUMERIC(10, 2)  NOT NULL CHECK ( price_per_km > 0 ),
    -- seat_layout stores the physical configuration of the bus as JSON.
    -- Example: {"type": "2+2", "rows": 10, "left_cols": ["A","B"], "right_cols": ["C","D"]}
    -- The SeatLayoutGenerator service reads this and produces seat names like 1A, 1B, 1C...
    seat_layout JSONB   NOT NULL,
    status bus_status   NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP    WITH TIME ZONE  DEFAULT now(),
    updated_at TIMESTAMP    WITH TIME ZONE  DEFAULT now()
);

CREATE INDEX idx_bus_owner ON bus(owner_id);
CREATE INDEX idx_bus_status ON bus(status);

CREATE TABLE location
(
    location_id UUID PRIMARY KEY DEFAULT uuidv7(),
    location_name VARCHAR(150) NOT NULL,
    latitude      NUMERIC(10, 7),
    longitude     NUMERIC(10, 7),
    created_at  TIMESTAMP   WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_location_name ON location(location_name);