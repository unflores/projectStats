export enum AnalysisEnum {
  ReleaseCandidates = "ReleaseCandidates",
  LOCChanged = "LOCChanged",
  LOCAdded = "LOCAdded",
  LOCRemoved = "LOCRemoved",
}

export const Graphs = {
  [AnalysisEnum.ReleaseCandidates]: {
    type: "line" as const,
    transform: toCoalescedCounts,
  },
  [AnalysisEnum.LOCChanged]: {
    type: "bar" as const,
    transform: (counts: Counts) => counts,
  },
  [AnalysisEnum.LOCAdded]: {
    type: "bar" as const,
    transform: (counts: Counts) => counts,
  },
  [AnalysisEnum.LOCRemoved]: {
    type: "bar" as const,
    transform: (counts: Counts) => counts,
  },
};

type Counts = Array<{ date: Date; count: number }>;

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
