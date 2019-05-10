BEGIN;

-- psql -h ec2-54-235-208-103.compute-1.amazonaws.com -U mutdgftgfhyqfq -d d2qvu6rdo8jrdq -f seeds/seed.tables.sql
-- psql -U postgres -d munchstats -f seeds/seed.tables.sql

TRUNCATE
  "user", "meal", "ingredients", "events";

INSERT INTO "user" ("id", "username", "name", "password")
VALUES
  (
    1,
    'test',
    'Test User',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  ),
  (2,
    'admin',
    'Nom Nom',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  );

INSERT INTO "meal" ("id", "name", "user_id", "total_calorie", "total_fat", "total_carbs", "total_protein")
VALUES
  (1, 'Example Breakfast', 1, 350, 12, 3, 20),
  (2, 'Example Lunch', 1, 500, 20, 10, 15),
  (3, 'Example Dinner', 1, 600, 30, 5, 5),
  (4, 'Example Brunch', 1, 700, 22, 15, 30),
  (5, 'Example Breakfast', 2, 350, 12, 3, 20),
  (6, 'Example Lunch', 2, 500, 20, 10, 15),
  (7, 'Example Dinner', 2, 600, 30, 5, 5),
  (8, 'Example Brunch', 2, 700, 22, 15, 30);

INSERT INTO "ingredients" ("id", "name", "meal_id", "unit")
VALUES
  (1, 'Example Ingredient 1', 1, 'kg'),
  (2, 'Example Ingredient 2', 1, 'L'),
  (3, 'Example Ingredient 3', 1, 'lbs'),
  (4, 'Example Ingredient 4', 1, 'g');

INSERT INTO "events" ("id", "user_id", "name", "date", "tag", "calories", "protein", "fat", "carbs")
VALUES
  (1, 1, 'monday breakfast', '2019-05-06 09:00:00', 'breakfast', 350, 12, 3, 20),
  (2, 1, 'monday lunch', '2019-05-06 13:00:00', 'lunch', 500, 20, 10, 15),
  (3, 1, 'easter brunch', '2019-04-29 09:00:00', 'brunch', 700, 22, 15, 30),
  (4, 1, 'monday dinner', '2019-05-06 20:00:00', 'dinner', 600, 30, 5, 5),
  (5, 1, 'christmas dinner', '2018-12-25 19:00:00', 'dinner', 1000, 40, 15, 40),
  (6, 1, 'tuesday breakfast', '2019-05-07 09:00:00', 'breakfast', 350, 12, 3, 20),
  (7, 1, 'sunday brunch', '2019-05-05 09:00:00', 'brunch', 500, 30, 15, 25),
  (8, 1, 'sunday dinner', '2019-05-05 19:00:00', 'dinner', 600, 30, 5, 5),
  (9, 1, 'tuesday lunch', '2019-05-07 13:00:00', 'lunch', 500, 20, 10, 15),
  (10, 1, 'tuesday dinner', '2019-05-07 20:00:00', 'dinner', 600, 30, 5, 5),
  (11, 1, 'wednesday breakfast', '2019-05-08 09:00:00', 'breakfast', 350, 12, 3, 20),
  (12, 1, 'wednesday lunch', '2019-05-08 13:00:00', 'lunch', 500, 20, 10, 15),
  (13, 1, 'wednesday dinner', '2019-05-08 20:00:00', 'dinner', 600, 30, 5, 5),
  (14, 1, 'thursday breakfast', '2019-05-09 09:00:00', 'breakfast', 350, 12, 3, 20),
  (15, 1, 'thursday lunch', '2019-05-09 13:00:00', 'lunch', 500, 20, 10, 15),
  (16, 1, 'thursday dinner', '2019-05-09 20:00:00', 'dinner', 600, 30, 5, 5),
  (17, 1, 'friday breakfast', '2019-05-10 09:00:00', 'breakfast', 350, 12, 3, 20),
  (18, 1, 'friday lunch', '2019-05-10 13:00:00', 'lunch', 500, 20, 10, 15),
  (19, 2, 'monday breakfast', '2019-05-06 09:00:00', 'breakfast', 350, 12, 3, 20),
  (20, 2, 'monday lunch', '2019-05-06 13:00:00', 'lunch', 500, 20, 10, 15),
  (21, 2, 'monday dinner', '2019-05-06 20:00:00', 'dinner', 600, 30, 5, 5),
  (22, 2, 'tuesday breakfast', '2019-04-29 09:00:00', 'breakfast', 350, 12, 3, 20),
  (23, 2, 'tuesday lunch', '2019-05-07 13:00:00', 'lunch', 500, 20, 10, 15),
  (24, 2, 'tuesday dinner', '2019-05-07 20:00:00', 'dinner', 600, 30, 5, 5),
  (25, 2, 'wednesday breakfast', '2019-05-08 09:00:00', 'breakfast', 350, 12, 3, 20),
  (26, 2, 'wednesday lunch', '2019-05-08 13:00:00', 'lunch', 500, 20, 10, 15),
  (27, 2, 'wednesday dinner', '2019-05-08 20:00:00', 'dinner', 600, 30, 5, 5),
  (28, 2, 'thursday breakfast', '2019-05-09 09:00:00', 'breakfast', 350, 12, 3, 20),
  (29, 2, 'thursday lunch', '2019-05-09 13:00:00', 'lunch', 500, 20, 10, 15),
  (30, 2, 'thursday dinner', '2019-05-09 20:00:00', 'dinner', 600, 30, 5, 5),
  (31, 2, 'friday breakfast', '2019-05-10 09:00:00', 'breakfast', 350, 12, 3, 20),
  (32, 2, 'friday lunch', '2019-05-10 13:00:00', 'lunch', 500, 20, 10, 15);

SELECT setval('events_id_seq', (SELECT MAX(id) from "events"));
SELECT setval('ingredients_id_seq', (SELECT MAX(id) from "ingredients"));
SELECT setval('meal_id_seq', (SELECT MAX(id) from "meal"));
SELECT setval('user_id_seq', (SELECT MAX(id) from "user"));

COMMIT;