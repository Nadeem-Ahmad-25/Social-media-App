/*
  Warnings:

  - You are about to drop the column `email_Token` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `expires_at` on the `Token` table. All the data in the column will be lost.
  - Added the required column `expiration` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Token" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "type" TEXT NOT NULL,
    "emailToken" TEXT,
    "valid" BOOLEAN NOT NULL DEFAULT true,
    "expiration" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Token" ("created_at", "id", "type", "updated_at", "userId", "valid") SELECT "created_at", "id", "type", "updated_at", "userId", "valid" FROM "Token";
DROP TABLE "Token";
ALTER TABLE "new_Token" RENAME TO "Token";
CREATE UNIQUE INDEX "Token_emailToken_key" ON "Token"("emailToken");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
