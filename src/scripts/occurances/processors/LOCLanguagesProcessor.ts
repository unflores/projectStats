import { AvailableAnalysisEnum, Processor } from "../types";
import * as util from "util";
import { exec, execSync } from "child_process";
import moment from "moment";

export const asyncExec = util.promisify(exec);

const mainBranchNames = ["main", "master"];

// extract commitsTraverser
class LOCLanguagesProcessor implements Processor {
  absPath: string;
  languageRegexes: { language: string; regex: string | undefined }[];
  projectDir: string;
  mainBranchName: string | undefined;

  constructor(
    absPath: string,
    projectDir: string,
    languageRegexes: { language: string; regex: string | undefined }[]
  ) {
    this.absPath = absPath;
    this.projectDir = projectDir;
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
    execSync(`git -C ${this.absPath} checkout ${this.mainBranchName}`);
  }

  async buildOccurances() {
    const currentBranchName = execSync(`git -C ${this.absPath} ${this.command("branchName")}`)
      .toString()
      .trim();

    if (!mainBranchNames.includes(currentBranchName)) {
      // All stats should come from the main branch, otherwise data will be inconsistent
      // as you can rebase and squash etc on a feature branch but the main history _should_ be
      // stable and consistent.

      // This error should be defined higher up the chain and passed in.
      throw new Error(`The repo is not on the main branch, change it from ${currentBranchName}`);
    }
    this.mainBranchName = currentBranchName;

    const commitsResponse = await asyncExec(
      `git -C ${this.absPath} ${this.command("commits")}`,
      { maxBuffer: 10 * 1024 * 1024 } // Bad temp idea
    );

    // Todo, give commits array a commit hash and a time so the occurance can be properly stored
    const commits = commitsResponse.stdout
      .toString()
      .trim()
      .split("\n")
      .map((line) => {
        const [first, ...rest] = line.split(" ");
        return { hash: first, createdAt: rest.join(" ") };
      });

    let commitsTraversed = 0;
    const occurances: { occurredAt: string; amount: number; id: string; type: string }[] = [];
    try {
      while (commitsTraversed <= commits.length) {
        const commit = commits[commitsTraversed];
        execSync(`git -C ${this.absPath} checkout ${commit.hash}`);
        const locResponse = execSync(this.command("findLoc"));

        const loc = locResponse.toString().trim().split("\n");

        occurances.push({
          type: AvailableAnalysisEnum.LOCLanguage,
          id: commit.hash,
          amount: parseInt(loc[0]),
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
