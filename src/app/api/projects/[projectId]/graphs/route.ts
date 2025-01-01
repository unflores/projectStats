import { Graphs } from "@/lib/analyses";
import { apiValidator } from "@/lib/apiHooks/urls";
import moment from "moment";
import { type NextRequest } from "next/server";
import z from "zod";
import projectQueries from "@/queries/projectQueries";
import occuranceQueries from "@/queries/occurances/countsQueries";
import { jsonResponse, type JsonResponse } from "@/lib/apiResponses";

const getParamsValidator = z.object({
  projectId: z.coerce.number(),
});

type FoundOccuranceCounts = {
  [key: string]: { count: number; date: Date }[];
};

const toGraphs = (
  project: Awaited<ReturnType<typeof projectQueries.findWithAnalysesBy>>,
  occuranceCounts: FoundOccuranceCounts
) => {
  return project.analyses.map((analysis) => ({
    analysis: analysis.type,
    data: Graphs[analysis.type]
      .transform(occuranceCounts[analysis.type])
      .map(({ count, date }) => ({
        x: moment(date).format("YYYY-MM-DD"),
        y: count,
      })),
  }));
};

export type GraphResponse = ReturnType<typeof toGraphs>;
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

  const project = await projectQueries.findWithAnalysesBy({
    id: query.projectId,
  });

  const occuranceCounts = await occuranceQueries.findCounts(
    project.analyses.map(({ id, type }) => ({ id, type, timeframe: "fiveYears" }))
  );

  return jsonResponse(toGraphs(project, occuranceCounts));
}
