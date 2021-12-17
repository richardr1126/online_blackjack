CREATE TABLE "players" (
  "id" SERIAL UNIQUE PRIMARY KEY NOT NULL,
  "username" varchar NOT NULL,
  "email" varchar UNIQUE NOT NULL,
  "password" varchar NOT NULL,
  "wins" int DEFAULT 0,
  "losses" int DEFAULT 0,
  "games_played" int DEFAULT 0,
  "currency_owned" int DEFAULT 100,
  "currency_spent" int DEFAULT 0
);

CREATE TABLE "items" (
  "player_id" int,
  "name" varchar,
  "cost" int,
  "type" varchar,
  "imgsrc" varchar
);

ALTER TABLE "items" ADD FOREIGN KEY ("player_id") REFERENCES "players" ("id");






