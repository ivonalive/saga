-- Database name should be: giphy_search_favorites

-- Categories table:
CREATE TABLE "categories" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR (100) NOT NULL
);

-- Default categories. You may change these. 🙂
INSERT INTO "categories"
  ("name")
  VALUES
  ('wild'),
  ('uproarious'),
  ('poignant'),
  ('felicitous'),
  ('whimsical');

-- Favorites table:
CREATE TABLE "favorites" (
  "id" SERIAL PRIMARY KEY,
  "url" VARCHAR (255) NOT NULL,
  "title" VARCHAR (255) NOT NULL
);

-- Join table for favorite categories (many-to-many relationship):
CREATE TABLE "favorite_categories" (
  "id" SERIAL PRIMARY KEY,
  "favorite_id" INTEGER NOT NULL REFERENCES "favorites"("id") ON DELETE CASCADE,
  "category_id" INTEGER NOT NULL REFERENCES "categories"("id") ON DELETE CASCADE,
  UNIQUE ("favorite_id", "category_id")
);

-- You'll need a "favorites" table for storing each instance of
-- a Giphy image that has been "favorited."
-- Each favorite image can be assigned one of the existing
-- categories via foreign key. This is a one-to-many relationship:
--    One favorite has one category.
--    One category can be had by many favorites.
