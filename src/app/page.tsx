"use client";
import Card from "@/rcl/atoms/Card";
import Title from "@/rcl/atoms/Title";
import LineGraph from "@/rcl/graphs/LineGraph";



const lines = [
  {
    id: "Monolith",
    color: "hsl(220,78%,50%)",
    data: [
      { x: '2024-01', y: 1 },
      { x: '2024-02', y: 20 },
      { x: '2024-03', y: 5 },
      { x: '2024-04', y: 8 },
      { x: '2024-05', y: 11 },
    ],
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen p-5">
      <Card>
        <Title level={1}>RC Frequency</Title>
        <LineGraph className="h-[400px]" lines={lines} xLabel="Date" yLabel="Release Candidates" />
      </Card>
    </div>
  );
}
