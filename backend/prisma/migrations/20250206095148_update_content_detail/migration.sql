/*
  Warnings:

  - Made the column `contentDetail` on table `Article` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Article` MODIFY `contentDetail` TEXT NOT NULL;
