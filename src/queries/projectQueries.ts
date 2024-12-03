import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";

export default {
  async findById(id: number) {
    return await prisma.project.findFirstOrThrow({
      where: { id },
    });
  },
  async findWithAnalysesBy({
    analysisType,
    ...filters
  }: {
    analysisType: string;
  } & Prisma.ProjectWhereInput) {
    return await prisma.project.findFirstOrThrow({
      where: {
        ...filters,
        analyses: analysisType ? { some: { type: analysisType } } : undefined,
      },
      include: { analyses: true },
    });
  },
};
