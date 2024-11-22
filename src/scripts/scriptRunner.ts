import logger from "@/lib/logger";

export const runScript = async (main: () => Promise<void>) => {
  try {
    await main();

    logger.log("Done !");
    process.exit(0);
  } catch (error) {
    logger.error(error);

    process.exit(1);
  }
};
