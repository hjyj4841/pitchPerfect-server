/*
  Warnings:

  - You are about to alter the column `spotify_code` on the `album` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE `album` MODIFY `spotify_code` VARCHAR(100) NOT NULL;
