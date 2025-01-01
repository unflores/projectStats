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
