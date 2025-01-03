"use client";
import Card from "@/rcl/atoms/Card";
import Title from "@/rcl/atoms/Title";
import LineGraph from "@/rcl/graphs/LineGraph";
import useGet from "@/lib/apiHooks/useGet";
import { GraphResponse } from "@/app/api/projects/[projectId]/graphs/route";
import { useParams } from "next/navigation";
import { ProjectResponse } from "@/app/api/projects/[projectId]/route";
import { Graphs } from "@/lib/analyses";

export default function Page() {
  const { projectId } = useParams()

  const { data: project, error: projectError, isLoading: projectLoading } = useGet<ProjectResponse>(
    "/api/projects/[projectId]",
    { path: { projectId: projectId as string } }
  );

  const { data: graphs, error: graphError, isLoading: graphLoading } = useGet<GraphResponse>(
    "/api/projects/[projectId]/graphs",
    { path: { projectId: projectId as string } }
  );

  if (projectLoading || graphLoading) {
    return (<></>);
  }

  if (projectError || graphError || !graphs || !project) {
    return <div>An error occurred.</div>
  }

  return (
    <>
      <Card>
        <Title level={1}>{project.name}</Title>
        <div className="flex flex-col min-h-screen p-5">
          {graphs.map(({ analysis, data }) => (
            <LineGraph key={analysis} className="h-[400px]" line={{ id: analysis, color: Graphs[analysis].color, data }} xLabel={Graphs[analysis].xLabel} yLabel={Graphs[analysis].yLabel} />
          ))}
        </div>
      </Card>
    </>
  );
}
