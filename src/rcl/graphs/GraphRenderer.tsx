import { AnalysisEnum } from "@/lib/analyses";
import BarGraph from "./BarGraph";
import LineGraph from "./LineGraph";
import { DataSeries } from "./graphs";
import { Graphs } from "@/lib/analyses";

const graphMap = {
  [AnalysisEnum.LOCChanged]: BarGraph,
  [AnalysisEnum.LOCAdded]: BarGraph,
  [AnalysisEnum.LOCRemoved]: BarGraph,
  [AnalysisEnum.ReleaseCandidates]: LineGraph,
};
interface Props {
  series: DataSeries;
  className?: string
}

const GraphRenderer = ({ series, className = "" }: Props) => {
  const GraphComponent = graphMap[series.analysis];

  return (<div className={className}>
    <GraphComponent
      series={series}
      xLabel={Graphs[series.analysis].xLabel}
      yLabel={Graphs[series.analysis].yLabel}
    />
  </div>);
}

export default GraphRenderer;
