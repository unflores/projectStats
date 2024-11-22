import { runScript } from "../scriptRunner";
import { Command } from "commander";
import { z } from "zod";
import { ProcessorName } from "./types";
import { buildProcessor } from "./buildProcessor";

const program = new Command();
program.version("0.0.1");
program.option("-p --processorName <string>", "processor name");
program.option("-n --projectName <string>", "project name");
program.parse(process.argv);

const response = z
  .object({
    processorName: z.enum(Object.keys(ProcessorName) as [string, ...string[]], {
      errorMap: () => ({
        message: `Invalid processor name. Possible values: (${Object.keys(ProcessorName).join("|")})`,
      }),
    }),
    projectName: z.string({
      errorMap: () => ({ message: "Project name is required" }),
    }),
  })
  .safeParse(program.opts());

if (response.error) {
  console.error("Validation errors:");
  console.log(response.error);
  response.error.issues.forEach((issue) => {
    console.error(`--${issue.path.join("")} `, issue.message);
  });
  process.exit(1);
}

const { processorName, projectName } = response.data;

const main = async () => {
  const processor = buildProcessor(processorName, projectName);
  const occurances = await processor.buildOccurances();
};

runScript(main);
