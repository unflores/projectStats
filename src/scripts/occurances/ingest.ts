import { runScript } from "../scriptRunner";
import { Command } from "commander";
import { z } from "zod";
import { AvailableProcessorEnum } from "./types";
import { buildProcessor } from "./buildProcessor";
import logger from "@/lib/logger";
import prisma from "@/lib/db";
import { buildConfig } from "@/scripts/projectConfig";
// This is a user provided config file, so require it dynamically
// eslint-disable-next-line @typescript-eslint/no-require-imports
const projectConfigJson = require("../config.json");

const projectConfig = buildConfig(projectConfigJson);

const program = new Command();
program.version("0.0.1");
program.option("-p --processorName <string>", "processor name");
program.option("-n --projectName <string>", "project name");
program.parse(process.argv);

const response = z
  .object({
    processorName: z.enum(Object.keys(AvailableProcessorEnum) as [string, ...string[]], {
      errorMap: () => ({
        message: `Invalid processor name. Possible values: (${Object.keys(AvailableProcessorEnum).join("|")})`,
      }),
    }),
    projectName: z.string({
      errorMap: () => ({
        message: `Project name is required. Possible values: (${projectConfig.projects().join("|")})`,
      }),
    }),
  })
  .safeParse(program.opts());

if (response.error) {
  logger.error("Validation errors:");

  response.error.errors.forEach((error) => {
    logger.error(
      `--${error.path.join("")} `,
      error.message,
      `Received: ${(error as unknown as { received: string }).received}` // this is annoying but the attribute is there...
    );
  });
  process.exit(1);
}

const { processorName, projectName } = response.data;

const main = async () => {
  const processor = buildProcessor(processorName, projectName);
  const occurances = await processor.buildOccurances();

  const project = await prisma.project.upsert({
    where: {
      name: projectName,
    },
    update: {},
    create: { name: projectName },
  });

  const analysis = await prisma.analysis.upsert({
    where: {
      projectId_type: {
        projectId: project.id,
        type: processorName,
      },
    },
    update: {},
    create: { type: processorName, projectId: project.id },
  });

  await prisma.occurance.createMany({
    data: occurances.map(({ occurredAt, id }) => ({
      externalId: id,
      analysisId: analysis.id,
      occurredAt,
    })),
    skipDuplicates: true,
  });
};

runScript(main);
