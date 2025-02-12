/*
  Warnings:

  - A unique constraint covering the columns `[project_id,type,segment]` on the table `analyses` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "analyses_project_id_type_key";

-- AlterTable
ALTER TABLE "analyses" ADD COLUMN     "segment" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "analyses_project_id_type_segment_key" ON "analyses"("project_id", "type", "segment");
