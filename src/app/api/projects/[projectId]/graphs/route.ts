import { AnalysisEnum } from "@/lib/analyses";
import { apiValidator } from "@/lib/apiHooks/urls";
import prisma from "@/lib/db";
import moment from "moment";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { type NextRequest } from "next/server";
import z from "zod";

const getParamsValidator = z.object({
  projectId: z.coerce.number(),
  analysisType: z.nativeEnum(AnalysisEnum),
});

const findProject = async (id: number, analysisType: AnalysisEnum) => {
  return await prisma.project.findFirstOrThrow({
    where: {
      id,
      analysis: {
        some: {
          type: analysisType,
        },
      },
    },
    include: { analysis: true },
  });
};

const findOccuranceCounts = async (id: number) => {
  return (await prisma.$queryRaw`
    SELECT
      DATE("occurredAt") as date,
      COUNT(*)::INT as count,
      a.id
    FROM occurances o
    JOIN analyses a on o."analysisId" = a.id
    WHERE a.id = 5
    GROUP BY DATE("occurredAt"), a.id
    ORDER BY date asc
  `) as { count: number; date: Date }[];
};

type FoundProject = Awaited<ReturnType<typeof findProject>>;
type FoundOccuranceCounts = Awaited<ReturnType<typeof findOccuranceCounts>>;

const toLine = (project: FoundProject, occuranceCounts: FoundOccuranceCounts) => {
  return project?.analysis.map((analysis) => ({
    analysis: analysis.type,
    data: occuranceCounts.map(({ count, date }) => ({
      x: moment(date).format("YYYY-MM-DD"),
      y: count,
    })),
  }));
};

export type GraphResponse = ReturnType<typeof toLine>;

export async function GET(req: NextRequest, { params }: { params: { projectId: number } }) {
  const searchParams = Object.fromEntries(req.nextUrl.searchParams);

  const { error, data: query } = apiValidator(getParamsValidator).validate({
    ...params,
    ...searchParams,
  });

  if (error) {
    return Response.json({ error }, { status: 400 });
  }

  let project;
  try {
    project = await findProject(query.projectId, query.analysisType);
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      return new Response(
        JSON.stringify({ error: [{ path: "project", message: "Could not find ressource." }] }),
        { status: 404 }
      );
    }
    throw e;
  }
  const occuranceCounts = await findOccuranceCounts(project.analysis[0].id);
  return Response.json(toLine(project, occuranceCounts));
}
