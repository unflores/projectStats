import LOCLanguagesProcessor from "./LOCLanguagesProcessor";
import { AvailableAnalysisEnum } from "./../types";
import moment from "moment";
import CommandLine from "../CommandLine";
describe("LOCLanguagesProcessor", () => {
  let mockCommandLine: CommandLine;
  let processor: LOCLanguagesProcessor;

  beforeEach(() => {
    mockCommandLine = {
      getBranchName: jest.fn().mockReturnValue("main"),
      checkout: jest.fn(),
      getCommits: jest.fn(),
      getLoc: jest.fn().mockReturnValue(100),
    } as unknown as CommandLine;
    processor = new LOCLanguagesProcessor(mockCommandLine, [
      { language: "typescript", regex: "*.ts" },
    ]);
  });

  it("raises error when not on main branch", async () => {
    (mockCommandLine.getBranchName as jest.Mock).mockReturnValue("feature-branch");

    await expect(processor.buildOccurances()).rejects.toThrow(
      "The repo is not on the main branch, change it from feature-branch"
    );
  });

  it("creates occurances for every 10 commits", async () => {
    const mockCommits = Array(11)
      .fill(null)
      .map((_, index) => ({
        hash: `hash${index}`,
        createdAt: new Date(2024, 0, index + 1),
      }));

    (mockCommandLine.getCommits as jest.Mock).mockReturnValue(mockCommits);
    const occurances = await processor.buildOccurances();
    expect(occurances).toHaveLength(2);

    expect(occurances[0]).toEqual({
      type: AvailableAnalysisEnum.LOCLanguage,
      id: "hash0",
      amount: 100,
      section: "typescript",
      occurredAt: moment(mockCommits[0].createdAt).toISOString(),
    });

    expect(occurances[1]).toEqual({
      type: AvailableAnalysisEnum.LOCLanguage,
      id: "hash10",
      amount: 100,
      section: "typescript",
      occurredAt: moment(mockCommits[10].createdAt).toISOString(),
    });
  });

  it("calls cleanup when error occurs during processing", async () => {
    (mockCommandLine.getCommits as jest.Mock).mockReturnValue([
      { hash: "hash1", createdAt: new Date() },
    ]);
    (mockCommandLine.getLoc as jest.Mock).mockImplementation(() => {
      throw new Error("Test error");
    });

    await processor.buildOccurances();

    expect(mockCommandLine.checkout).toHaveBeenCalledWith("main");
  });

  it("calls cleanup after successful processing", async () => {
    (mockCommandLine.getCommits as jest.Mock).mockReturnValue([
      { hash: "hash1", createdAt: new Date() },
    ]);

    await processor.buildOccurances();

    expect(mockCommandLine.checkout).toHaveBeenCalledWith("main");
  });
});
