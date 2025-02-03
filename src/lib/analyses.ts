import day from "./day";

export enum AnalysisEnum {
  ReleaseCandidates = "ReleaseCandidates",
  LOCChanged = "LOCChanged",
  LOCAdded = "LOCAdded",
  LOCRemoved = "LOCRemoved",
}

export const Graphs: Record<AnalysisEnum, { transform: (counts: Counts) => Counts }> = {
  [AnalysisEnum.ReleaseCandidates]: {
    transform: toCoalescedCounts,
  },
  [AnalysisEnum.LOCChanged]: {
    transform: toMonthlyBucketedCounts,
  },
  [AnalysisEnum.LOCAdded]: {
    transform: toMonthlyBucketedCounts,
  },
  [AnalysisEnum.LOCRemoved]: {
    transform: toMonthlyBucketedCounts,
  },
};

type Counts = Array<{ date: string; count: number }>;

function buildZeroedMonths(currentDate: string, nextDate: string, size: number) {
  const currentday = day(currentDate);
  const nextDay = day(nextDate);
  const zeroedMonths: Counts = [];

  for (let month = 1; month <= size; month++) {
    if (nextDay.date() === 1 && month === size) {
      break;
    }
    zeroedMonths.push({
      date: currentday.utc().add(month, "month").startOf("month").toISOString(),
      count: 0,
    });
  }
  return zeroedMonths;
}

export function toMonthlyBucketedCounts(counts: Counts) {
  return counts.reduce<Counts>((bucketedCounts, count) => {
    count.date = day(count.date).startOf("month").format("YYYY-MM");

    const [theBucketedCounts, lastCount] = [
      bucketedCounts.slice(0, bucketedCounts.length - 1),
      bucketedCounts.slice(bucketedCounts.length - 1)[0],
    ];

    if (lastCount === undefined) {
      return [count];
    }
    lastCount.date = day(lastCount.date).startOf("month").format("YYYY-MM");

    if (lastCount.date === count.date) {
      return [...theBucketedCounts, { ...count, count: count.count + lastCount.count }];
    }
    return [...theBucketedCounts, lastCount, count];
  }, []);
}

export function toCoalescedCounts(counts: Counts) {
  return counts.reduce<Counts>((coalescedCounts, count) => {
    const lastCount = coalescedCounts[coalescedCounts.length - 1];

    if (lastCount === undefined) {
      return [count];
    }

    const monthDiff = day(count.date)
      .startOf("month")
      .diff(day(lastCount.date).startOf("month"), "month");
    if (monthDiff > 0) {
      const zeroedMonths =
        monthDiff > 1 ? buildZeroedMonths(lastCount.date, count.date, monthDiff) : [];
      return [...coalescedCounts, ...zeroedMonths, count];
    }

    return [...coalescedCounts, { ...count, count: count.count + lastCount.count }];
  }, []);
}
