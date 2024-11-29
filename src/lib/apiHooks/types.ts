import type { NextApiResponse } from "next";

export type UserErrorResponse = {
  error: {
    path: string;
    message: string;
  }[];
};
export type EndpointResponse<T = undefined> = UserErrorResponse | T;

export type APIResponse<T = undefined> = NextApiResponse<EndpointResponse<T>>;
