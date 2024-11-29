type ErrorExplainedResponse = { error: { path: string; message: string }[] };
// Allow for a response with the principal data type or an ExplainedError format
export type JsonResponse<T> = Response & { __payloadType: T | ErrorExplainedResponse };

// jsonResponse Takes in an object and affirms the type of its data payload
export function jsonResponse<T>(data: T, status: number = 200): JsonResponse<T> {
  const response = new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
    status,
  });
  // This is a hack that adds an uneeded/unused attribute which allows us to
  // affirm the payload
  return Object.assign(response, { __payloadType: undefined as unknown as T });
}
