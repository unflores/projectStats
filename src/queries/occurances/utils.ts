import countsQueries from "./countsQueries";

export const timeFrameToTimes = {
  fiveYears: {
    span: { amount: 5, frame: "year" as const },
  },
  oneYear: {
    span: { amount: 1, frame: "year" as const },
  },
  sixMonths: {
    span: { amount: 6, frame: "month" as const },
  },
};

export type TimeFrames = keyof typeof timeFrameToTimes;

type FoundCounts = Awaited<ReturnType<typeof countsQueries.findCounts>>;

export function toCoalescedCounts(counts: FoundCounts) {
  return counts.reduce((coalescedCounts, count) => {
    const lastCount = coalescedCounts[coalescedCounts.length - 1];

    if (lastCount === undefined) {
      return [count];
    }

    if (lastCount.date.getMonth() < count.date.getMonth()) {
      return [...coalescedCounts, count];
    } else {
      return [...coalescedCounts, { ...count, count: count.count + lastCount.count }];
    }
  }, [] as FoundCounts);
}