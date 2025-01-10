import { AnalysisEnum } from "@/lib/analyses";
import BarGraph from "./BarGraph";
import LineGraph from "./LineGraph";
import { DataSeries } from "./graphs";

const graphMap = {
  [AnalysisEnum.LOCChanged]: BarGraph,
  [AnalysisEnum.LOCAdded]: BarGraph,
  [AnalysisEnum.LOCRemoved]: BarGraph,
  [AnalysisEnum.ReleaseCandidates]: LineGraph,
};

const Graphs = {
  [AnalysisEnum.ReleaseCandidates]: {
    color: "#b55400",
    xLabel: "Date",
    yLabel: "RCs",
  },
  [AnalysisEnum.LOCChanged]: {
    color: "#b55400",
    xLabel: "Date",
    yLabel: "Changes",
  },
  [AnalysisEnum.LOCAdded]: {
    color: "#00b554",
    xLabel: "Date",
    yLabel: "Lines Added",
  },
  [AnalysisEnum.LOCRemoved]: {
    color: "#00b554",
    xLabel: "Date",
    yLabel: "Lines Removed",
  },
};

const graphStyle = (analysis: AnalysisEnum) => {
  const style = Graphs[analysis];

  return style ? style : { color: "#00b554", xLabel: 'x', yLabel: 'y' }
}

interface Props {
  series: DataSeries;
  className?: string
}

const GraphRenderer = ({ series, className = "" }: Props) => {
  const GraphComponent = graphMap[series.analysis];

  return (<div className={className}>
    <GraphComponent
      series={series}
      color={graphStyle(series.analysis).color}
      xLabel={graphStyle(series.analysis).xLabel}
      yLabel={graphStyle(series.analysis).yLabel}
    />
  </div>);
}

export default GraphRenderer;
