/*
  Warnings:

  - You are about to drop the column `gameId` on the `Lobby` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[inviteCode]` on the table `Lobby` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `gameMode` to the `Lobby` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gameTitle` to the `Lobby` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inviteCode` to the `Lobby` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxPlayers` to the `Lobby` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Lobby` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lobby" DROP COLUMN "gameId",
ADD COLUMN     "gameMode" TEXT NOT NULL,
ADD COLUMN     "gameTitle" TEXT NOT NULL,
ADD COLUMN     "inviteCode" TEXT NOT NULL,
ADD COLUMN     "maxPlayers" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Lobby_inviteCode_key" ON "Lobby"("inviteCode");
