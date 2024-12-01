/*
  Warnings:

  - You are about to drop the column `createdAt` on the `analyses` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `analyses` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `analyses` table. All the data in the column will be lost.
  - You are about to drop the column `analysisId` on the `occurances` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `occurances` table. All the data in the column will be lost.
  - You are about to drop the column `occurredAt` on the `occurances` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `occurances` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `projects` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[project_id,type]` on the table `analyses` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[analysis_id,external_id]` on the table `occurances` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `project_id` to the `analyses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `analyses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `analysis_id` to the `occurances` table without a default value. This is not possible if the table is not empty.
  - Added the required column `external_id` to the `occurances` table without a default value. This is not possible if the table is not empty.
  - Added the required column `occurred_at` to the `occurances` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `occurances` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "analyses" DROP CONSTRAINT "analyses_projectId_fkey";

-- DropForeignKey
ALTER TABLE "occurances" DROP CONSTRAINT "occurances_analysisId_fkey";

-- DropIndex
DROP INDEX "analyses_projectId_idx";

-- DropIndex
DROP INDEX "analyses_projectId_type_key";

-- DropIndex
DROP INDEX "occurances_analysisId_idx";

-- DropIndex
DROP INDEX "occurances_occurredAt_idx";

-- AlterTable
ALTER TABLE "analyses" DROP COLUMN "createdAt",
DROP COLUMN "projectId",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "project_id" INTEGER NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "occurances" DROP COLUMN "analysisId",
DROP COLUMN "createdAt",
DROP COLUMN "occurredAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "analysis_id" INTEGER NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "external_id" TEXT NOT NULL,
ADD COLUMN     "occurred_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "analyses_project_id_idx" ON "analyses"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "analyses_project_id_type_key" ON "analyses"("project_id", "type");

-- CreateIndex
CREATE INDEX "occurances_occurred_at_idx" ON "occurances"("occurred_at");

-- CreateIndex
CREATE INDEX "occurances_analysis_id_idx" ON "occurances"("analysis_id");

-- CreateIndex
CREATE UNIQUE INDEX "occurances_analysis_id_external_id_key" ON "occurances"("analysis_id", "external_id");

-- AddForeignKey
ALTER TABLE "analyses" ADD CONSTRAINT "analyses_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "occurances" ADD CONSTRAINT "occurances_analysis_id_fkey" FOREIGN KEY ("analysis_id") REFERENCES "analyses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
