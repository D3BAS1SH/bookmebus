-- V3__create_route_and_stops.sql

CREATE TABLE route
(
    route_id UUID PRIMARY KEY DEFAULT uuidv7(),
    owner_id UUID NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    route_name VARCHAR(150) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_route_owner ON route(owner_id);

-- ---------------------------------------------------------------------------
-- route_stop: ONE ROW PER STOP — not arrays on a single row.
--
-- Why this matters: the overlap booking query compares integer sequence
-- numbers. Arrays on a single row make that query impossible in SQL.
--
-- Example for route "Bhubaneswar → Cuttack → Paradeep":
--   (route_id, location_id=BBS,  sequence_order=1, distance_from_origin=0)
--   (route_id, location_id=CTC,  sequence_order=2, distance_from_origin=25)
--   (route_id, location_id=PRDP, sequence_order=3, distance_from_origin=95)
-- ---------------------------------------------------------------------------

CREATE TABLE route_stop
(
    route_stop_id UUID PRIMARY KEY DEFAULT uuidv7(),
    route_id UUID NOT NULL REFERENCES route(route_id) ON DELETE CASCADE,
    location_id UUID NOT NULL REFERENCES location(location_id) ON DELETE RESTRICT,
    sequence_order INTEGER NOT NULL CHECK ( sequence_order > 0 ),
    distance_from_origin NUMERIC(10, 2) NOT NULL CHECK ( distance_from_origin >= 0 ),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CONSTRAINT uq_route_sequence UNIQUE (route_id, sequence_order)
);

CREATE INDEX idx_route_stop_route ON route_stop(route_id);
CREATE INDEX idx_route_stop_location ON route_stop(location_id);