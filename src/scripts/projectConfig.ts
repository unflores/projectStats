import { z } from "zod";

// This is a user provided config file, so require it dynamically
// eslint-disable-next-line @typescript-eslint/no-require-imports
const projectConfigJson = require("./projects.json");
// todo: when this file isn't present, it should fail gracefully, throw an error that makes sense

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
    languages: z.array(z.string()).optional(),
    projectDir: z.string().optional(),
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

  languageRegexes(projectName: string): { language: string; regex: string | undefined }[] {
    return (this.config[projectName]?.languages || []).map((language) => {
      if (language === "typescript") {
        return { language, regex: ".tsx?" };
      } else if (language === "ruby") {
        return { language, regex: ".rb" };
      }
      return { language, regex: undefined };
    });
  }

  projectDir(projectName: string) {
    return this.config[projectName]?.projectDir ?? "";
  }

  projects() {
    return Object.keys(this.config);
  }
}

let instance: ProjectConfig | null = null;

export const buildConfig = (configJson: unknown = projectConfigJson) => {
  instance = new ProjectConfig(configJson);
  return instance;
};

export const fetchConfig = () => {
  if (instance === null) {
    throw new Error(`Project Config not loaded.`);
  }
  return instance;
};
