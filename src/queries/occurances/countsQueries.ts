import prisma from "@/lib/db";
import moment from "moment";
import { TimeFrames, timeFrameToTimes } from "./utils";

export default {
  async findCounts(analysisId: number, timeframe: TimeFrames) {
    const times = timeFrameToTimes[timeframe];

    return (await prisma.$queryRaw`
      SELECT
        DATE(occurred_at) as date,
        COUNT(*)::INT as count,
        a.id
      FROM occurances o
      JOIN analyses a on o.analysis_id = a.id
      WHERE a.id = ${analysisId} and o.occurred_at > ${moment().subtract(times.span.amount, times.span.frame).toDate()}
      GROUP BY DATE(occurred_at), a.id
      ORDER BY date asc
    `) as { count: number; date: Date }[];
  },
};
