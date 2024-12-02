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

  let project;
  try {
    project = await projectQueries.findById(query.projectId);
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      return jsonResponse(
        { error: [{ path: "project", message: "Could not find ressource." }] },
        404
      );
    }
    throw e;
  }
  return jsonResponse(toProject(project));
}
