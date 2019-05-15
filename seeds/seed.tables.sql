BEGIN;

-- psql -h ec2-54-83-192-245.compute-1.amazonaws.com -U lyievkdhcaanjz -d d8fp3g9a3ed442 -f seeds/seed.tables.sql
-- psql -U postgres -d munchstats -f seeds/seed.tables.sql

TRUNCATE
  "user", "meal", "ingredients", "events";

INSERT INTO "user" ("id", "username", "name", "password", "calorieBudget", "fatBudget", "carbBudget", "proteinBudget")
VALUES
  (
    1,
    'test',
    'Test User',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG',
    2000,
    70,
    250,
    110
  ),
  (2,
    'admin',
    'Nom Nom',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG',
    2000,
    70,
    250,
    110
  );

SELECT setval('events_id_seq', (SELECT MAX(id) from "events"));
SELECT setval('ingredients_id_seq', (SELECT MAX(id) from "ingredients"));
SELECT setval('meal_id_seq', (SELECT MAX(id) from "meal"));
SELECT setval('user_id_seq', (SELECT MAX(id) from "user"));

COMMIT;