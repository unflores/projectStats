import { AvailableAnalysisEnum, Processor } from "../types";
import * as util from "util";
import { exec, execSync } from "child_process";

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

  command(command: "branchName" | "loc" | "findLoc") {
    const commands = {
      branchName: "rev-parse --abbrev-ref HEAD",
      loc: "log --pretty=oneline --no-merges | awk -F\" \" '{print $1}'",
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

    // if (!mainBranchNames.includes(currentBranchName)) {
    //   // This sucks so much, make a common Application error class to handle this.
    //   throw new Error(`The repo is not on the main branch, change it from ${currentBranchName}`);
    // }
    this.mainBranchName = currentBranchName;

    const commitsResponse = await asyncExec(
      `git -C ${this.absPath} ${this.command("loc")}`,
      { maxBuffer: 10 * 1024 * 1024 } // Bad temp idea
    );
    const commits = commitsResponse.stdout.toString().trim().split("\n");

    const commitsTraversed = 0;
    try {
      while (commitsTraversed <= commits.length) {
        const commitHash = commits[commitsTraversed];
        execSync(`git -C ${this.absPath} checkout ${commitHash}`);
        const locResponse = execSync(this.command("findLoc"));

        const loc = locResponse.toString().trim().split("\n");

        // add to occurances
        // increment commitsTraversed
      }
    } catch (error) {
      console.error(error);
      // this doesn't work for ctrl + c, it must be in process.on
      execSync(`git -C ${this.absPath} checkout ${mainBranchName}`);
    } finally {
      // Ensure we always return to the main branch, even if interrupted
      execSync(`git -C ${this.absPath} checkout ${mainBranchName}`);
    }
    execSync(`git -C ${this.absPath} checkout ${mainBranchName}`);
    return [];
  }
}

export default LOCLanguagesProcessor;
