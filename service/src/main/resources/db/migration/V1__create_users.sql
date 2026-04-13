-- V1__create_users.sql

CREATE TYPE user_role AS ENUM ('OWNER', 'DRIVER', 'TRAVELER');

CREATE TABLE users
(
    user_id   UUID    PRIMARY KEY DEFAULT uuidv7(),
    full_name   VARCHAR(100)    NOT NULL,
    email   VARCHAR(150)    NOT NULL,
    phone   VARCHAR(15)     NOT NULL,
    password_hash VARCHAR(255)  NOT NULL,
    role    user_role   NOT NULL,
    active  BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP   WITH TIME ZONE DEFAULT now(),
    updated_at  TIMESTAMP   WITH TIME ZONE DEFAULT now()
);

-- Index on email — used on every login query
CREATE INDEX idx_users_email ON users (email);

-- Index on role — used when owner queries their own buses/routes
CREATE INDEX idx_users_role ON users (role);