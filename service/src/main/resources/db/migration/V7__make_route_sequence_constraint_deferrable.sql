-- Drop the existing immediate constraint
ALTER TABLE route_stop DROP CONSTRAINT uq_route_sequence;

-- Re-add as deferrable so PostgreSQL checks it at transaction commit,
-- not per-row during the UPDATE. This allows shiftSequencesDown to
-- temporarily have duplicate sequence numbers mid-transaction.
ALTER TABLE route_stop
ADD CONSTRAINT uq_route_sequence
UNIQUE (route_id, sequence_order)
DEFERRABLE INITIALLY DEFERRED;