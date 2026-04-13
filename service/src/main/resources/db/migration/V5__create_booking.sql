-- V5__create_booking.sql

CREATE TYPE booking_status AS ENUM ('CONFIRMED', 'CANCELED');

CREATE TABLE booking
(
    booking_id UUID PRIMARY KEY DEFAULT uuidv7(),
    trip_id UUID NOT NULL REFERENCES trip(trip_id) ON DELETE RESTRICT,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    trip_seat_id UUID NOT NULL REFERENCES trip_seat(trip_seat_id) ON DELETE RESTRICT,

    boarding_stop_id UUID NOT NULL REFERENCES location(location_id) ON DELETE RESTRICT,
    dropoff_stop_id UUID NOT NULL REFERENCES location(location_id) ON DELETE RESTRICT,

    boarding_seq INTEGER NOT NULL,
    dropoff_seq INTEGER NOT NULL,
    CHECK ( dropoff_seq > boarding_seq ),

    total_price NUMERIC(10, 2) NOT NULL CHECK (total_price > 0),

    booking_code VARCHAR(8) UNIQUE,

    qr_code_path VARCHAR(500),
    ticket_pdf_path VARCHAR(500),

    payment_txn_id VARCHAR(100),

    did_board BOOLEAN,

    status booking_status NOT NULL DEFAULT 'CONFIRMED',
    booked_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_booking_overlap ON booking (trip_seat_id,boarding_seq,dropoff_seq) WHERE status = 'CONFIRMED';
CREATE INDEX idx_booking_trip ON booking (trip_id);
CREATE INDEX idx_booking_user ON booking (user_id);
CREATE INDEX idx_booking_code ON booking (booking_code);