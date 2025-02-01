import prisma from "@/lib/db";
import moment from "moment";
import { TimeFrames, timeFrameToTimes } from "./utils";
import { AnalysisEnum } from "@/lib/analyses";

async function findCountsById(analysisId: number, timeframe: TimeFrames) {
  const times = timeFrameToTimes[timeframe];

  return (await prisma.$queryRaw`
    SELECT
      DATE(occurred_at)::text as date,
      SUM(amount)::INT as count,
      a.id
    FROM occurances o
    JOIN analyses a on o.analysis_id = a.id
    WHERE a.id = ${analysisId} and o.occurred_at > ${moment().subtract(times.span.amount, times.span.frame).toDate()}
    GROUP BY DATE(occurred_at), a.id
    ORDER BY date asc
  `) as { count: number; date: string }[];
}

export default {
  async findCounts(analyses: { id: number; type: AnalysisEnum; timeframe: TimeFrames }[]) {
    const queryPromises = analyses.map((analysis) =>
      findCountsById(analysis.id, "fiveYears").then((result) => ({
        [analysis.type as AnalysisEnum]: result,
      }))
    );

    const occuranceCounts = (await Promise.all(queryPromises)).reduce((acc, curr) => {
      return { ...acc, ...curr };
    }, {});
    return occuranceCounts;
  },
};
