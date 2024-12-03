import { AnalysisEnum } from "@/lib/analyses";
import { apiValidator } from "@/lib/apiHooks/urls";
import moment from "moment";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { type NextRequest } from "next/server";
import z from "zod";
import projectQueries from "@/queries/projectQueries";
import occuranceQueries from "@/queries/occurances/countsQueries";
import { jsonResponse, type JsonResponse } from "@/lib/apiResponses";
import { toCoalescedCounts } from "@/queries/occurances/utils";

const getParamsValidator = z.object({
  projectId: z.coerce.number(),
  analysisType: z.nativeEnum(AnalysisEnum),
});

type FoundOccuranceCounts = Awaited<ReturnType<typeof occuranceQueries.findCounts>>;

const toLine = (
  project: Awaited<ReturnType<typeof projectQueries.findWithAnalysesBy>>,
  occuranceCounts: FoundOccuranceCounts
) => {
  return project?.analyses.map((analysis) => ({
    analysis: analysis.type,
    data: occuranceCounts.map(({ count, date }) => ({
      x: moment(date).format("YYYY-MM-DD"),
      y: count,
    })),
  }));
};

export type GraphResponse = ReturnType<typeof toLine>;
type GetParams = { params: { projectId: number } };

export async function GET(
  req: NextRequest,
  { params }: GetParams
): Promise<JsonResponse<GraphResponse>> {
  const searchParams = Object.fromEntries(req.nextUrl.searchParams);

  const { error, data: query } = apiValidator(getParamsValidator).validate({
    ...params,
    ...searchParams,
  });

  if (error) {
    return jsonResponse({ error }, 400);
  }

  let project;
  try {
    project = await projectQueries.findWithAnalysesBy({
      id: query.projectId,
      analysisType: query.analysisType,
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      return jsonResponse(
        { error: [{ path: "project", message: "Could not find ressource." }] },
        404
      );
    }
    throw e;
  }
  const occuranceCounts = await occuranceQueries.findCounts(project.analyses[0].id, "fiveYears");
  return jsonResponse(toLine(project, toCoalescedCounts(occuranceCounts)));
}
