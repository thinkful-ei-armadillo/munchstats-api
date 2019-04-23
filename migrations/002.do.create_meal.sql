CREATE TABLE "meal" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "user_id" INTEGER REFERENCES "user"(id),
  "total_calorie" INTEGER DEFAULT 0,
  "total_fat" INTEGER DEFAULT 0,
  "total_carbs" INTEGER DEFAULT 0,
  "total_protein" INTEGER DEFAULT 0,
  "rating" INTEGER DEFAULT 0
);