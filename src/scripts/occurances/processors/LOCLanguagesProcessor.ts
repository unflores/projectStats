import { AvailableAnalysisEnum, Processor } from "../types";
import moment from "moment";
import CommandLine from "../CommandLine";

const mainBranchNames = ["main", "master"];

/** TODO:
 * Add a way to get one value per day. This will give semi idempotent data.
 * As long as the timestamps are in order, the numbers should stay the same.
 */
class LOCLanguagesProcessor implements Processor {
  commandLine: CommandLine;
  languageRegexes: { language: string; regex: string | undefined }[];
  mainBranchName: string | undefined;

  constructor(
    commandLine: CommandLine,
    languageRegexes: { language: string; regex: string | undefined }[]
  ) {
    this.commandLine = commandLine;
    this.languageRegexes = languageRegexes;
  }

  analyses() {
    return [AvailableAnalysisEnum.LOCLanguage];
  }

  async cleanup() {
    this.commandLine.checkout(this.mainBranchName || "main");
  }

  async buildOccurances() {
    const currentBranchName = this.commandLine.getBranchName();

    if (!mainBranchNames.includes(currentBranchName)) {
      // All stats should come from the main branch, otherwise data will be inconsistent
      // as you can rebase and squash etc on a feature branch but the main history _should_ be
      // stable and consistent.

      // This error should be defined higher up the chain and passed in.
      throw new Error(`The repo is not on the main branch, change it from ${currentBranchName}`);
    }
    this.mainBranchName = currentBranchName;

    const commits = this.commandLine.getCommits();

    let commitsTraversed = 0;
    const occurances: { occurredAt: string; amount: number; id: string; type: string }[] = [];
    try {
      while (commitsTraversed <= commits.length) {
        const commit = commits[commitsTraversed];
        this.commandLine.checkout(commit.hash);

        const loc = this.commandLine.getLoc("*.ts*");

        occurances.push({
          type: AvailableAnalysisEnum.LOCLanguage,
          id: commit.hash,
          amount: loc,
          occurredAt: moment(commit.createdAt).toISOString(),
        });

        commitsTraversed += 10;
      }
    } catch (error) {
      console.error(error);
      await this.cleanup();
    }
    await this.cleanup();
    return occurances;
  }
}

export default LOCLanguagesProcessor;
