CREATE TABLE "players"(
    "id" INTEGER,
    "first_name" TEXT UNIQUE,
    "last_name" TEXT UNIQUE,
    "min_number" INTEGER,
    "admin" INTEGER DEFAULT(0),
    PRIMARY KEY("id")
);

CREATE TABLE "numbers"(
    "id" INTEGER,
    "player_id" INTEGER ,
    "left" INTEGER,
    "right" INTEGER ,
    "front" INTEGER,
    "back" INTEGER,
    "total" INTEGER,
    "duration" INTEGER CHECK("duration" IN (15,30,45,60)),
    "date" DEFAULT(DATE('now')),
    PRIMARY KEY ("id"),
    FOREIGN KEY ("player_id") REFERENCES "players"("id")
);

CREATE TRIGGER set_total
AFTER INSERT ON "numbers"
FOR EACH ROW
BEGIN
    UPDATE "numbers"
    SET total = NEW.left + NEW.right + NEW.front + NEW.back
    WHERE id = NEW.id;
END;



CREATE VIEW IF NOT EXISTS number_views 
AS
SELECT p."first_name",p."last_name",p."id",n."right",n."left",n."front",n."back",n."duration",p."min_number",n."total",n."date" 
FROM "players" p 
JOIN "numbers" n
ON p."id" == n."player_id" ;

CREATE INDEX IF NOT EXISTS first_and_last ON "players" (first_name,last_name);
