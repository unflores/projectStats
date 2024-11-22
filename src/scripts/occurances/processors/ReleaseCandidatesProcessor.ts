import { Processor, ProcessorName } from "../types";
import * as util from "util";
import { exec } from "child_process";
import logger from "@/lib/logger";

export const asyncExec = util.promisify(exec);

class ReleaseCandidatesProcessor implements Processor {
  absPath: string;

  constructor(absPath: string) {
    this.absPath = absPath;
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
        type: ProcessorName.ReleaseCandidates,
        id: vals[0].trim(),
        timestamp: vals[1],
      }))
      .filter((commit) => commit.id !== "");
    logger.debug({ occurances });
    return occurances;
  }
}

export default ReleaseCandidatesProcessor;
