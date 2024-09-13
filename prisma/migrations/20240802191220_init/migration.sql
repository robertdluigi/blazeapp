/*
  Warnings:

  - You are about to drop the column `message` on the `Subscriber` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Subscriber` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Subscriber" DROP COLUMN "message",
DROP COLUMN "name";
