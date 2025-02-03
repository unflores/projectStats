import { runScript } from "../scriptRunner";
import { Command } from "commander";
import { z } from "zod";
import { AvailableProcessorEnum } from "./types";
import { buildProcessor } from "./buildProcessor";
import logger from "@/lib/logger";
import prisma from "@/lib/db";
import { buildConfig } from "@/scripts/projectConfig";

const projectConfig = buildConfig();

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

  await prisma.analysis.createMany({
    data: processor.analyses().map((analysis) => ({
      type: analysis,
      projectId: project.id,
    })),
    skipDuplicates: true,
  });

  const analyses = await prisma.analysis.findMany({
    where: {
      type: { in: processor.analyses() },
      projectId: project.id,
    },
  });

  const results = await prisma.occurance.createMany({
    data: occurances
      .map(({ occurredAt, amount, id, type }) => ({
        externalId: id,
        analysisId: analyses.find(({ type: persistedType }) => persistedType === type)?.id,
        occurredAt,
        amount,
      }))
      .filter((occuranceData) => occuranceData.analysisId !== undefined) as unknown as {
      externalId: string;
      analysisId: number;
      occurredAt: string;
      amount: number;
    },
    skipDuplicates: true,
  });

  logger.log({ parsed: occurances.length, imported: results.count });
};

runScript(main);
