import { execSync } from "child_process";

class CommandLine {
  absPath: string;
  projectDir: string;

  constructor(absPath: string, projectDir: string) {
    this.absPath = absPath;
    this.projectDir = projectDir;
  }

  checkout(branchName: string) {
    this.git(`checkout ${branchName}`);
  }

  getBranchName() {
    return this.git("rev-parse --abbrev-ref HEAD").toString().trim();
  }

  getCommits() {
    return this.git('log --format="%H %ai"')
      .toString()
      .trim()
      .split("\n")
      .map((line) => {
        const [first, ...rest] = line.split(" ");
        return { hash: first, createdAt: rest.join(" ") };
      });
  }

  getLoc(fileRegex: string) {
    // xargs will limit what it takes and thus we will end up with more than one line for total loc
    // for projects with a lot of files. This is fixed by using grep total and then summing those.
    const loc = this.run(
      `find ${this.absPath}/${this.projectDir} -name '${fileRegex}' | xargs wc -l|grep total| awk '{sum += $1} END {print sum}'`
    )
      .toString()
      .trim()
      .split("\n");

    return parseInt(loc[0]);
  }

  private run(command: string) {
    return execSync(command).toString().trim();
  }

  private git(command: string) {
    return this.run(`git -C ${this.absPath} ${command}`);
  }
}

export default CommandLine;
