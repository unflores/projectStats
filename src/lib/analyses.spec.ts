import { toCoalescedCounts } from "./analyses";

describe("toCoalescedCounts", () => {
  it("adds counts of previous day to the next day in same month", () => {
    const counts = [
      { date: new Date("2024-01-01"), count: 41 },
      { date: new Date("2024-01-02"), count: 1 },
    ];
    const coalescedCounts = toCoalescedCounts(counts);

    expect(coalescedCounts[0].count).toEqual(41);
    expect(coalescedCounts[1].count).toEqual(42);
  });

  it("does NOT add count of previous day to the next day in new month", () => {
    const counts = [
      { date: new Date("2024-01-01"), count: 41 },
      { date: new Date("2024-02-01"), count: 1 },
    ];
    const coalescedCounts = toCoalescedCounts(counts);

    expect(coalescedCounts[0].count).toEqual(41);
    expect(coalescedCounts[1].count).toEqual(1);
  });

  it("does NOT reset count of first of month when a month has a value on the first of the month", () => {
    const counts = [
      { date: new Date("2024-01-01"), count: 41 },
      { date: new Date("2024-03-01"), count: 1 },
    ];
    const coalescedCounts = toCoalescedCounts(counts);
    expect(coalescedCounts[0].count).toEqual(41);
    expect(coalescedCounts[1].count).toEqual(0);
    expect(coalescedCounts[2].count).toEqual(1);
  });

  it("resets count of first of month when a month is skipped", () => {
    const counts = [
      { date: new Date("2024-01-01"), count: 41 },
      { date: new Date("2024-03-10"), count: 1 },
    ];
    const coalescedCounts = toCoalescedCounts(counts);
    expect(coalescedCounts[0].count).toEqual(41);
    expect(coalescedCounts[1].count).toEqual(0);
    expect(coalescedCounts[2].count).toEqual(0);
    expect(coalescedCounts[3].count).toEqual(1);
  });

  it("sets count to 0 for multiple missing months", () => {
    const counts = [
      { date: new Date("2024-01-01"), count: 41 },
      { date: new Date("2024-04-10"), count: 1 },
    ];

    const coalescedCounts = toCoalescedCounts(counts);
    expect(coalescedCounts[0].count).toEqual(41);
    expect(coalescedCounts[1].count).toEqual(0);
    expect(coalescedCounts[2].count).toEqual(0);
    expect(coalescedCounts[3].count).toEqual(0);
    expect(coalescedCounts[4].count).toEqual(1);
  });
});
