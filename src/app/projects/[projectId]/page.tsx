"use client";
import Card from "@/rcl/atoms/Card";
import Title from "@/rcl/atoms/Title";
import LineGraph from "@/rcl/graphs/LineGraph";
import useGet from "@/lib/apiHooks/useGet";
import { AnalysisEnum } from "@/lib/analyses";
import { GraphResponse } from "@/app/api/projects/[projectId]/graphs/route";
import { useParams } from "next/navigation";

export default function Page() {
  const { projectId } = useParams()

  const { data: graphs, error, isLoading } = useGet<GraphResponse>(
    "/api/projects/[projectId]/graphs",
    { path: { projectId: projectId as string }, query: { analysisType: AnalysisEnum.ReleaseCandidates } }
  );

  if (isLoading) {
    return (<></>);
  }

  if (error || !graphs) {
    return <div>An error occurred.</div>
  }

  const lines = graphs.map(({ analysis, data }) => ({
    id: analysis,
    color: "hsl(220,78%,50%)",
    data: data
  }));

  return (
    <div className="flex flex-col min-h-screen p-5">
      <Card>
        <Title level={1}>RC Frequency</Title>
        <LineGraph className="h-[400px]" lines={lines} xLabel="Date" yLabel="Release Candidates" />
      </Card>
    </div>
  );
}
