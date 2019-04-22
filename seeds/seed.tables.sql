-- psql -U ympvduylgwhsww -d dbcuctrd0h2fok -f seeds/seed.tables.sql

BEGIN;

TRUNCATE
  "user";

INSERT INTO "user" ("id", "username", "name", "password")
VALUES
  (
    1,
    'admin',
    'Nom Nom',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  );