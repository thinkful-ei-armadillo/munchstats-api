BEGIN;

-- psql -h ec2-54-235-208-103.compute-1.amazonaws.com -U mutdgftgfhyqfq -d d2qvu6rdo8jrdq -f seeds/seed.tables.sql
-- psql -U postgres -d munchstats -f seeds/seed.tables.sql

TRUNCATE
  "user", "meal", "ingredients", "events";

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

INSERT INTO "events" ("id", "user_id", "name", "date", "tag")
VALUES
  (1, 1, 'monday breakfast', '2019-04-29 09:00:00', 'breakfast'),
  (2, 1, 'monday lunch', '2019-04-29 13:00:00', 'lunch'),
  (3, 1, 'easter brunch', '2019-04-29 09:00:00', 'brunch'),
  (4, 1, 'monday dinner', '2019-04-29 20:00:00', 'dinner'),
  (5, 1, 'christmas dinner', '2018-12-25 19:00:00', 'dinner'),
  (6, 1, 'tuesday breakfast', '2019-04-30 09:00:00', 'breakfast'),
  (7, 1, 'sunday brunch', '2019-04-28 09:00:00', 'brunch');

COMMIT;