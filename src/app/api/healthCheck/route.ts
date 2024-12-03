import { jsonResponse, JsonResponse } from "@/lib/apiResponses";
import prisma from "@/lib/db";

export async function GET(): Promise<JsonResponse<{ status: string }>> {
  // We'll just verify that we are actually connected to the db
  await prisma.project.findFirst();

  return jsonResponse({ status: "ok" });
}
