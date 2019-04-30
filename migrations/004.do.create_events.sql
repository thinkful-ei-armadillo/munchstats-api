CREATE TABLE "events" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER REFERENCES "user"(id),
  "name" TEXT NOT NULL,
  "date" TIMESTAMP NOT NULL DEFAULT now(),
  "tag" TEXT NOT NULL,
  "calories" INTEGER DEFAULT 0,
  "protein" INTEGER DEFAULT 0,
  "fat" INTEGER DEFAULT 0,
  "carbs" INTEGER DEFAULT 0
);