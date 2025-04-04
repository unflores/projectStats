import { AvailableAnalysisEnum, AvailableProcessorEnum, Processor } from "../types";
import * as util from "util";
import { exec } from "child_process";
import moment from "moment";

export const asyncExec = util.promisify(exec);

const type = AvailableProcessorEnum.ReleaseCandidates;
class ReleaseCandidatesProcessor implements Processor {
  absPath: string;

  constructor(absPath: string) {
    this.absPath = absPath;
  }

  analyses() {
    return [AvailableAnalysisEnum.ReleaseCandidates];
  }

  async buildOccurances() {
    const logs = await asyncExec(
      `git -C ${this.absPath} log --pretty=format:"%h_commitsep_%ad"`,
      { maxBuffer: 10 * 1024 * 1024 } // Bad temp idea
    );

    const occurances = (logs.stdout as string)
      .split("\n")
      .map((line) => line.split("_commitsep_"))
      .map((vals) => ({
        type,
        id: vals[0].trim(),
        amount: 1,
        occurredAt: moment(vals[1], "ddd MMM DD HH:mm:ss YYYY Z").format(),
      }))
      .filter((commit) => commit.id !== "");

    return occurances;
  }
}

export default ReleaseCandidatesProcessor;
