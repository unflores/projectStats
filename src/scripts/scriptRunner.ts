import logger from "@/lib/logger";

type CleanupFunction = () => Promise<void>;

export const runScript = async (main: () => Promise<void>, cleanup?: CleanupFunction) => {
  // Handle SIGINT (Ctrl+C) and SIGTERM
  const handleExit = async () => {
    logger.log("Received termination signal, cleaning up...");
    if (cleanup) {
      try {
        await cleanup();
        logger.log("Cleanup completed");
      } catch (error) {
        logger.error("Error during cleanup:", error);
      }
    }
    process.exit(0);
  };

  process.on("SIGINT", handleExit);
  process.on("SIGTERM", handleExit);

  try {
    await main();

    logger.log("Done !");
    process.exit(0);
  } catch (error) {
    logger.error(error);
    if (cleanup) {
      try {
        await cleanup();
        logger.log("Cleanup completed");
      } catch (cleanupError) {
        logger.error("Error during cleanup:", cleanupError);
      }
    }
    process.exit(1);
  }
};
