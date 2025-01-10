import day from "./day";

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
    transform: (counts: Counts) => counts,
  },
  [AnalysisEnum.LOCAdded]: {
    transform: (counts: Counts) => counts,
  },
  [AnalysisEnum.LOCRemoved]: {
    transform: (counts: Counts) => counts,
  },
};

type Counts = Array<{ date: Date; count: number }>;

function buildZeroedMonths(currentDate: Date, nextDate: Date, size: number) {
  const currentday = day(currentDate);
  const nextDay = day(nextDate);
  const zeroedMonths: Counts = [];

  for (let month = 1; month <= size; month++) {
    if (nextDay.date() === 1 && month === size) {
      break;
    }
    zeroedMonths.push({
      date: currentday.utc().add(month, "month").startOf("month").toDate(),
      count: 0,
    });
  }
  return zeroedMonths;
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
          ...buildZeroedMonths(
            lastCount.date,
            count.date,
            count.date.getMonth() - lastCount.date.getMonth()
          ),
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
