-- V4__add_stop_flags.sql
--
-- Adds is_boarding_point and is_dropping_point to route_stop.
--
-- Why: At the application layer, the booking endpoint must reject requests like
-- "board at the final stop" or "drop off at the origin". Storing these as DB
-- columns (with sensible defaults) lets us enforce this at the data layer too,
-- and keeps the booking query self-contained without extra app logic.
--
-- Default TRUE for both: most intermediate stops allow boarding AND dropping.
-- The owner can set is_boarding_point = FALSE on the last stop, and
-- is_dropping_point = FALSE on the first stop when creating the route.

ALTER TABLE route_stop
    ADD COLUMN is_boarding_point BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN is_dropping_point BOOLEAN NOT NULL DEFAULT TRUE;

-- Partial index: quickly find all valid boarding stops for a given route.
-- Used by the booking service to validate the traveler's chosen boarding location.
CREATE INDEX idx_route_stop_boarding ON route_stop(route_id) WHERE is_boarding_point = TRUE;
CREATE INDEX idx_route_stop_dropping ON route_stop(route_id) WHERE is_dropping_point = TRUE;