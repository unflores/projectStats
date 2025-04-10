import useSWR from "swr";
import { buildQueryString, ClientError, httpFetcher, injectParams } from "./urls";

type ReplaceableParam = string | number | undefined | null;

/*******
Expected use:

const { data, error, isLoading} = useGet(
  '/api/projects/[projectId]/',
  {path: {projectId: 1}, params: {analysisType: 'test', frame: 'weekly'}}
);
******/
const useGet = <T>(
  path: string,
  {
    path: pathParams,
    query: queryParams,
  }: { path?: Record<string, ReplaceableParam>; query?: Record<string, ReplaceableParam> } = {}
) => {
  const queryString = buildQueryString(queryParams ?? {});
  const { injectedPath, allPathVarsReplaced } = injectParams(path, pathParams ?? {});

  const res = useSWR<T, ClientError>(
    allPathVarsReplaced ? `${injectedPath}${queryString}` : null,
    httpFetcher
  );

  return res;
};

export default useGet;
