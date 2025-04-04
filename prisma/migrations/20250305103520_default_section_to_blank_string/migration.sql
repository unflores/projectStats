/*
  Warnings:

  - Made the column `segment` on table `analyses` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "analyses" ALTER COLUMN "segment" SET NOT NULL,
ALTER COLUMN "segment" SET DEFAULT '';
