CREATE TABLE "ingredients" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "meal_id" INTEGER REFERENCES "meal"(id),
  "total_calorie" INTEGER DEFAULT 0,
  "total_fat" INTEGER DEFAULT 0,
  "total_carbs" INTEGER DEFAULT 0,
  "total_protein" INTEGER DEFAULT 0
);