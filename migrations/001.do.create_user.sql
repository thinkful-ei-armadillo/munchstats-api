CREATE TABLE "user" (
  "id" SERIAL PRIMARY KEY,
  "username" TEXT NOT NULL UNIQUE,
  "password" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "isDark" BOOLEAN DEFAULT FALSE, 
  "miami" BOOLEAN DEFAULT FALSE, 
  "calorieBudget" INTEGER, 
  "fatBudget" INTEGER, 
  "carbBudget" INTEGER, 
  "proteinBudget" INTEGER
);
