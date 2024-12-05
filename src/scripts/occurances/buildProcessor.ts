import LOCChangeProcessor from "./processors/LOCChangedProcessor";
import ReleaseCandidatesProcessor from "./processors/ReleaseCandidatesProcessor";
import { AvailableProcessorEnum } from "./types";
import { fetchConfig } from "@/scripts/projectConfig";

export function buildProcessor(processorName: string, projectName: string) {
  const projectConfig = fetchConfig();

  switch (processorName) {
    case AvailableProcessorEnum.ReleaseCandidates: {
      const gitConfig = projectConfig.git(projectName);

      if (gitConfig === undefined) {
        throw new Error(`Project ${projectName} has no git config`);
      }

      return new ReleaseCandidatesProcessor(gitConfig.absDirectory);
    }
    case AvailableProcessorEnum.LOCChanged: {
      const gitConfig = projectConfig.git(projectName);

      if (gitConfig === undefined) {
        throw new Error(`Project ${projectName} has no git config`);
      }

      return new LOCChangeProcessor(gitConfig.absDirectory);
    }
    default:
      throw new Error(`Processor ${processorName} not found`);
  }
}
