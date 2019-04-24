BEGIN;

-- psql -U postgres -d munchstats -f seeds/seed.tables.sql

TRUNCATE
  "user", "meal", "ingredients";

INSERT INTO "user" ("id", "username", "name", "password")
VALUES
  (
    1,
    'admin',
    'Nom Nom',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  );

INSERT INTO "meal" ("id", "name", "user_id")
VALUES
  (1, 'Example Meal 1', 1);

INSERT INTO "ingredients" ("id", "name", "meal_id", "unit")
VALUES
  (1, 'Example Ingredient 1', 1, 'kg'),
  (2, 'Example Ingredient 2', 1, 'L'),
  (3, 'Example Ingredient 3', 1, 'lbs'),
  (4, 'Example Ingredient 4', 1, 'g');

COMMIT;