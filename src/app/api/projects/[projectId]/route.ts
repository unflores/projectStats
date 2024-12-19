import { apiValidator } from "@/lib/apiHooks/urls";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { type NextRequest } from "next/server";
import z from "zod";
import projectQueries from "@/queries/projectQueries";
import { jsonResponse, type JsonResponse } from "@/lib/apiResponses";

const getParamsValidator = z.object({
  projectId: z.coerce.number(),
});

const toProject = (project: Awaited<ReturnType<typeof projectQueries.findById>>) => {
  return { id: project.id, name: project.name };
};

export type ProjectResponse = ReturnType<typeof toProject>;
type GetParams = { params: { projectId: number } };
export async function GET(
  req: NextRequest,
  { params }: GetParams
): Promise<JsonResponse<ProjectResponse>> {
  const searchParams = Object.fromEntries(req.nextUrl.searchParams);

  const { error, data: query } = apiValidator(getParamsValidator).validate({
    ...params,
    ...searchParams,
  });

  if (error) {
    return jsonResponse({ error }, 400);
  }

  const project = await projectQueries.findById(query.projectId);

  return jsonResponse(toProject(project));
}
