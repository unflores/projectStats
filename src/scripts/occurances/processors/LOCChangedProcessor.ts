import { AvailableAnalysisEnum, Processor } from "../types";
import * as util from "util";
import { exec } from "child_process";
import moment from "moment";

export const asyncExec = util.promisify(exec);

const type = AvailableAnalysisEnum.LOCChanged;
class ReleaseCandidatesProcessor implements Processor {
  absPath: string;

  constructor(absPath: string) {
    this.absPath = absPath;
  }

  analyses() {
    return [
      AvailableAnalysisEnum.LOCChanged,
      AvailableAnalysisEnum.LOCAdded,
      AvailableAnalysisEnum.LOCRemoved,
    ];
  }

  async buildOccurances() {
    const logs = await asyncExec(
      `git -C ${this.absPath} log --numstat --pretty=format:"%H %ct" -- '*.ts' '*.tsx' | awk 'NF == 2 {hash=$1; time=$2} NF ==3 {added+=$1; removed+=$2} /^$/ {print added, removed, time, hash; added=0; removed=0}'`,
      { maxBuffer: 10 * 1024 * 1024 } // Bad temp idea
    );

    //clean
    const occurances = (logs.stdout as string)
      .trim()
      .split("\n")
      .map((line) => line.split(" "))
      .flatMap(([added, removed, time, hash]) => [
        {
          type,
          count: Number.parseInt(added) - Number.parseInt(removed),
          id: hash.trim(),
          occurredAt: moment.unix(Number.parseInt(time)).toISOString(),
        },
        {
          type: AvailableAnalysisEnum.LOCAdded,
          count: Number.parseInt(added),
          id: hash.trim(),
          occurredAt: moment.unix(Number.parseInt(time)).toISOString(),
        },
        {
          type: AvailableAnalysisEnum.LOCRemoved,
          count: Number.parseInt(removed),
          id: hash.trim(),
          occurredAt: moment.unix(Number.parseInt(time)).toISOString(),
        },
      ])
      .filter((commit) => commit.id !== "");

    return occurances;
  }
}

export default ReleaseCandidatesProcessor;
