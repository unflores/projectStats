import { execSync } from "child_process";
import CommandLine from "./CommandLine";

jest.mock("child_process", () => ({
  execSync: jest.fn(),
}));

describe("CommandLine", () => {
  let commandLine: CommandLine;
  const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;

  beforeEach(() => {
    mockExecSync.mockReset();
    commandLine = new CommandLine("/abs/path", "project-dir");
  });

  describe("checkout", () => {
    it("injects the variables to git", () => {
      mockExecSync.mockReturnValue(Buffer.from(""));

      commandLine.checkout("feature-branch");

      expect(mockExecSync).toHaveBeenCalledWith("git -C /abs/path checkout feature-branch");
    });
  });

  describe("getBranchName", () => {
    it("injects the variables to git", () => {
      mockExecSync.mockReturnValue(Buffer.from("main\n"));

      const result = commandLine.getBranchName();

      expect(result).toBe("main");
      expect(mockExecSync).toHaveBeenCalledWith("git -C /abs/path rev-parse --abbrev-ref HEAD");
    });

    it("returns the current branch name", () => {
      mockExecSync.mockReturnValue(Buffer.from("main\n"));

      const result = commandLine.getBranchName();

      expect(result).toBe("main");
    });
  });

  describe("getCommits", () => {
    it("injects the variables to git", () => {
      mockExecSync.mockReturnValue(Buffer.from(""));

      commandLine.getCommits();

      expect(mockExecSync).toHaveBeenCalledWith('git -C /abs/path log --format="%H %ai"');
    });

    it("returns commit objects", () => {
      const mockOutput = "abc123 2024-03-20 10:00:00 +0000\n" + "def456 2024-03-19 09:00:00 +0000";
      mockExecSync.mockReturnValue(Buffer.from(mockOutput));

      const result = commandLine.getCommits();

      expect(result).toEqual([
        { hash: "abc123", createdAt: "2024-03-20 10:00:00 +0000" },
        { hash: "def456", createdAt: "2024-03-19 09:00:00 +0000" },
      ]);
    });
  });

  describe("getLoc", () => {
    it("injects the variables to git", () => {
      mockExecSync.mockReturnValue(Buffer.from(""));

      commandLine.getLoc("*.ts*");

      expect(mockExecSync).toHaveBeenCalledWith(
        `find /abs/path/project-dir -name '*.ts*' | xargs wc -l | tail -n1 | awk '{print $1}'`
      );
    });

    it("returns lines of code count", () => {
      mockExecSync.mockReturnValue(Buffer.from("1234"));

      const result = commandLine.getLoc("*.ts*");

      expect(result).toEqual(1234);
    });
  });
});
