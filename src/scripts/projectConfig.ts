import { z } from "zod";

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
    language: z.string().optional(),
  })
);

class ProjectConfig {
  private config: z.infer<typeof projectConfigSchema>;

  constructor(projectConfigJson: unknown) {
    this.config = projectConfigSchema.parse(projectConfigJson);
  }

  git(projectName: string) {
    return this.config[projectName]?.git;
  }

  language(projectName: string) {
    return this.config[projectName]?.language;
  }

  fileRegex(projectName: string) {
    if (this.config[projectName]?.language === "typescript") {
      return ".tsx?";
    } else if (this.config[projectName]?.language === "ruby") {
      return ".rb";
    }
    return;
  }

  projects() {
    return Object.keys(this.config);
  }
}

let instance: ProjectConfig | null = null;

export const buildConfig = (configJson: unknown) => {
  instance = new ProjectConfig(configJson);
  return instance;
};

export const fetchConfig = () => {
  if (instance === null) {
    throw new Error(`Project Config not loaded.`);
  }
  return instance;
};
