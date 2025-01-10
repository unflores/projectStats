export enum AnalysisEnum {
  ReleaseCandidates = "ReleaseCandidates",
  LOCChanged = "LOCChanged",
  LOCAdded = "LOCAdded",
  LOCRemoved = "LOCRemoved",
}

export const Graphs = {
  [AnalysisEnum.ReleaseCandidates]: {
    transform: toCoalescedCounts,
  },
  [AnalysisEnum.LOCChanged]: {
    transform: toMonthlyCounts,
  },
  [AnalysisEnum.LOCAdded]: {
    transform: toMonthlyCounts,
  },
  [AnalysisEnum.LOCRemoved]: {
    transform: toMonthlyCounts,
  },
};

type Counts = Array<{ date: Date; count: number }>;
export function toMonthlyCounts(counts: Counts) {
  return counts.reduce<Counts>((monthlyCounts, count) => {
    const lastCount = monthlyCounts[monthlyCounts.length - 1];
    const previousCounts = monthlyCounts.slice(0, -1);
    if (!lastCount) {
      return [count];
    }

    if (lastCount.date.getMonth() < count.date.getMonth()) {
      return [...previousCounts, lastCount, count];
    } else {
      return [...previousCounts, count];
    }
  }, []);
}

export function toCoalescedCounts(counts: Counts) {
  return counts.reduce<Counts>((coalescedCounts, count) => {
    const lastCount = coalescedCounts[coalescedCounts.length - 1];

    if (lastCount === undefined) {
      return [count];
    }

    if (lastCount.date.getMonth() < count.date.getMonth()) {
      if (count.date.getMonth() - lastCount.date.getMonth() > 1) {
        return [
          ...coalescedCounts,
          {
            date: new Date(lastCount.date.getFullYear(), lastCount.date.getMonth() + 1, 1),
            count: 0,
          },
          count,
        ];
      } else {
        return [...coalescedCounts, count];
      }
    } else {
      return [...coalescedCounts, { ...count, count: count.count + lastCount.count }];
    }
  }, []);
}
