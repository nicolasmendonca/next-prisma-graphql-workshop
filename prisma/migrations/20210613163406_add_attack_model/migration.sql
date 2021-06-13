-- CreateTable
CREATE TABLE "Attack" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "pokemonId" INTEGER NOT NULL,
    FOREIGN KEY ("pokemonId") REFERENCES "Pokemon" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);