import { z } from "zod";
import projectConfigJson from "../config.json";
import { ProcessorName } from "./types";
import ReleaseCandidatesProcessor from "./processors/ReleaseCandidatesProcessor";

const projectConfigSchema = z.record(
  z.object({
    github: z
      .object({
        authToken: z.string(),
        repo: z.string(),
        repoOwner: z.string(),
      })
      .optional(),
    git: z
      .object({
        absDirectory: z.string(),
      })
      .optional(),
  })
);

export function buildProcessor(processorName: string, projectName: string) {
  const config = projectConfigSchema.parse(projectConfigJson);
  const projectConfig = config[projectName];

  if (projectConfig === undefined) {
    throw new Error(`Project ${projectName} not found in config.json`);
  }

  switch (processorName) {
    case ProcessorName.ReleaseCandidates:
      if (projectConfig.git === undefined) {
        throw new Error(`Project ${projectName} has no git config`);
      }
      return new ReleaseCandidatesProcessor(projectConfig.git.absDirectory);
    default:
      throw new Error(`Processor ${processorName} not found`);
  }
}
