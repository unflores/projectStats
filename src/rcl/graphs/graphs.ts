import { AnalysisEnum } from "@/lib/analyses";

export type DataSeries = {
  color: string;
  analysis: AnalysisEnum; // I don't like that the bar and line graph are dependent on the AnalysisEnum via DataSeries
  data: {
    x: string | number;
    y: number;
  }[];
};
