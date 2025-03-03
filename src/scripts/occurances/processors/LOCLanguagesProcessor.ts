import { AvailableAnalysisEnum, Processor } from "../types";
import * as util from "util";
import { exec, execSync } from "child_process";
import moment from "moment";
import CommandLine from "../CommandLine";

export const asyncExec = util.promisify(exec);

const mainBranchNames = ["main", "master"];

// extract commitsTraverser
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

  command(command: "branchName" | "commits" | "findLoc") {
    const commands = {
      branchName: "rev-parse --abbrev-ref HEAD",
      commits: 'log --format="%H %ai"',
      findLoc: `find ${this.absPath}/${this.projectDir} -name '*.ts*' | xargs wc -l | tail -n1 | awk '{print $1}'`,
    };
    return commands[command];
  }

  async cleanup() {
    this.commandLine.checkoutBranch(this.mainBranchName || "main");
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
        this.commandLine.checkoutBranch(commit.hash);

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
