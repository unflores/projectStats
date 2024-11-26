-- CreateTable
CREATE TABLE "projects" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analysis" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "analysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "occurances" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "analysisId" INTEGER NOT NULL,

    CONSTRAINT "occurances_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "analysis_projectId_idx" ON "analysis"("projectId");

-- CreateIndex
CREATE INDEX "occurances_occurredAt_idx" ON "occurances"("occurredAt");

-- CreateIndex
CREATE INDEX "occurances_analysisId_idx" ON "occurances"("analysisId");

-- AddForeignKey
ALTER TABLE "analysis" ADD CONSTRAINT "analysis_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "occurances" ADD CONSTRAINT "occurances_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "analysis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
