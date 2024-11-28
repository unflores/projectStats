import useSWR from "swr";
import { EndpointResponse } from "./types";
import { buildQueryString, ClientError, httpFetcher, injectParams } from "./urls";

type ReplaceableParam = string | number | undefined | null;

const useGet = <T>(
  path: string,
  {
    path: pathParams,
    query: queryParams,
  }: { path?: Record<string, ReplaceableParam>; query?: Record<string, ReplaceableParam> }
) => {
  const queryString = buildQueryString(queryParams ?? {});
  const { injectedPath, allPathVarsReplaced } = injectParams(path, pathParams ?? {});

  const res = useSWR<T, ClientError>(
    allPathVarsReplaced ? `${injectedPath}${queryString}` : null,
    httpFetcher
  );
  const { data, error, isLoading } = res;
  console.log({ data, error, isLoading });
  return res;
};

export default useGet;

// need to test fail case
// loading state
// error state
// user errors and server errors => critical vs non-critical?
// usage
/*
const { data, error, isLoading} = useGet(
  '/api/projects/[projectId]/',
  {path: {projectId: 1}, params: {analysisType: 'test', frame: 'weekly'}}
)
  */
