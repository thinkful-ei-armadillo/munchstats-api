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

INSERT INTO "meal" ("id", "name", "user_id")
VALUES
  (1, 'Example Meal 1', 1);

INSERT INTO "ingredient" ("id", "name", "meal_id")
VALUES
  (1, 'Example Ingredient 1', 1),
  (2, 'Example Ingredient 2', 1),
  (3, 'Example Ingredient 3', 1),
  (4, 'Example Ingredient 4', 1);

COMMIT;