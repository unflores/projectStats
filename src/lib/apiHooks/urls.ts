import { isNil } from "@/lib/utils";
import type { infer as ZodInfer, ZodSchema } from "zod";

type ReplaceableParam = string | number | undefined | null;

// As Next has file structure like /api/projects/[projectId]/, it makes sense
// to keep that structure to easily find the usage and to remain coherent
// path will be the next path and then it will expect url params with the same key
// to replace the next tokens.
export const injectParams = (path: string, urlParams: Record<string, ReplaceableParam>) => {
  let injectedPath = path;
  let allPathVarsReplaced = true;
  Object.entries(urlParams).forEach(([key, value]) => {
    if (!injectedPath.includes(`[${key}]`) || isNil(value)) {
      allPathVarsReplaced = false;
      return;
    }

    injectedPath = injectedPath.replace(`[${key}]`, `${value}`);
  });

  // I should maybe raise an exception for this...
  if (injectedPath.match(/\[[^\]]+\]/) !== null) {
    allPathVarsReplaced = false;
  }

  return { injectedPath, allPathVarsReplaced };
};

export const buildQueryString = (params: Record<string, string | number | undefined | null>) => {
  if (Object.values(params).length === 0) {
    return "";
  }

  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    queryParams.append(key, value?.toString() ?? "");
  });
  return `?${queryParams.toString()}`;
};

export const httpFetcher = async (input: RequestInfo, init?: RequestInit | undefined) => {
  const res = await fetch(input, init);

  if (res.ok) {
    return res.json();
  }

  if (res.status === 400) {
    const response = (await res.json()) as { error: ErrorExplained[] };
    throw new ClientError("A client error occurred", response.error);
  } else {
    // This is a critical error and should be treated differently
    throw new ClientError("A server error occurred", [
      { path: "server", message: "An unknown error occurred." },
    ]);
  }
};

type ErrorExplained = {
  path: string; // ideally a dot-separated list of strings ex: project.title.missing
  message: string; // plain-text fallback
};

export class ClientError extends Error {
  public details: ErrorExplained[];

  constructor(message: string, details: ErrorExplained[]) {
    super(message);

    this.details = details;
  }
}

export const apiValidator = <T extends ZodSchema>(validator: T) => {
  return {
    validate: (json: unknown) => {
      const resp = validator.safeParse(json);
      if (resp.error?.issues) {
        const error = resp.error.issues.map(({ path, message }) => ({
          path: path.join("."),
          message,
        }));
        return { error };
      } else {
        return { data: resp.data as ZodInfer<T> };
      }
    },
  };
};
