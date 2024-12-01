/*
  Warnings:

  - A unique constraint covering the columns `[projectId,type]` on the table `analyses` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `projects` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "analyses_projectId_type_key" ON "analyses"("projectId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "projects_name_key" ON "projects"("name");
