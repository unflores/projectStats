import { AvailableAnalysisEnum, Processor } from "../types";
import * as util from "util";
import { exec, execSync } from "child_process";

export const asyncExec = util.promisify(exec);

const mainBranchNames = ["main", "master"];

// extract commitsTraverser
class LOCLanguagesProcessor implements Processor {
  absPath: string;
  languageRegexes: { language: string; regex: string }[];
  projectDir: string;
  constructor(
    absPath: string,
    projectDir: string,
    languageRegexes: { language: string; regex: string }[]
  ) {
    this.absPath = absPath;
    this.projectDir = projectDir;
    this.languageRegexes = languageRegexes;
  }

  analyses() {
    return [AvailableAnalysisEnum.LOCLanguage];
  }

  command(command: "branchName" | "loc" | "findLoc") {
    const commands = {
      branchName: "rev-parse --abbrev-ref HEAD",
      loc: "log --pretty=oneline --no-merges | awk -F\" \" '{print $1}'",
      findLoc: `find ${this.absPath}/${this.projectDir} -name '*.ts*' | xargs wc -l`,
    };
    return commands[command];
  }

  async buildOccurances() {
    const currentBranchName = execSync(`git -C ${this.absPath} ${this.command("branchName")}`);
    if (mainBranchNames.includes(currentBranchName.toString().trim())) {
      // This sucks so much, make a common Application error class to handle this.
      throw new Error(`The repo is not on the main branch, change it from ${currentBranchName}`);
    }

    const commitsResponse = await asyncExec(
      `git -C ${this.absPath} ${this.command("loc")}`,
      { maxBuffer: 10 * 1024 * 1024 } // Bad temp idea
    );
    const commits = commitsResponse.stdout.toString().trim().split("\n");

    const commitsTraversed = 0;
    while (commitsTraversed <= commits.length) {
      const commitHash = commits[commitsTraversed];
      execSync(`git -C ${this.absPath} checkout ${commitHash}`);
      const locResponse = execSync(this.command("findLoc"));
      const loc = locResponse.toString().trim().split("\n");

      // add to occurances
      // increment commitsTraversed
    }

    return [];
  }
}

export default LOCLanguagesProcessor;
