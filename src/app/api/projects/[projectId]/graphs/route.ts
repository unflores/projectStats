import { AnalysisEnum, Graphs } from "@/lib/analyses";
import { apiValidator } from "@/lib/apiHooks/urls";
import moment from "moment";
import { type NextRequest } from "next/server";
import z from "zod";
import projectQueries from "@/queries/projectQueries";
import occuranceQueries from "@/queries/occurances/countsQueries";
import { jsonResponse, type JsonResponse } from "@/lib/apiResponses";

const getParamsValidator = z.object({
  projectId: z.coerce.number(),
  analysisType: z.nativeEnum(AnalysisEnum),
});

type FoundOccuranceCounts = {
  [key: string]: { count: number; date: Date }[];
};

const toLine = (
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

  const project = await projectQueries.findWithAnalysesBy({
    id: query.projectId,
    analysisType: query.analysisType,
  });

  const queryPromises = project.analyses.map((analysis) =>
    occuranceQueries
      .findCounts(analysis.id, "fiveYears")
      .then((result) => ({ [analysis.type as AnalysisEnum]: result }))
  );
  const occuranceCounts = (await Promise.all(queryPromises)).reduce((acc, curr) => {
    return { ...acc, ...curr };
  }, {});

  return jsonResponse(toLine(project, occuranceCounts));
}
