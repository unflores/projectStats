import LOCChangeProcessor from "./processors/LOCChangedProcessor";
import ReleaseCandidatesProcessor from "./processors/ReleaseCandidatesProcessor";
import LOCLanguagesProcessor from "./processors/LOCLanguagesProcessor";
import { AvailableProcessorEnum, Processor } from "./types";
import { fetchConfig } from "@/scripts/projectConfig";

export function buildProcessor(processorName: string, projectName: string): Processor {
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
    case AvailableProcessorEnum.LOCLanguage: {
      const gitConfig = projectConfig.git(projectName);
      const languageRegexes = projectConfig.languageRegexes(projectName);
      if (gitConfig === undefined) {
        throw new Error(`Project ${projectName} has no git config`);
      }

      return new LOCLanguagesProcessor(
        gitConfig.absDirectory,
        projectConfig.projectDir(projectName),
        languageRegexes
      );
    }
    default:
      throw new Error(`Processor ${processorName} not found`);
  }
}
