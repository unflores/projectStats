type ConsoleLogType = typeof console.log;
type ConsoleLogArgs = Parameters<ConsoleLogType>;
const logger = {
  ...console,
  // Defaults to showing all the data of a json object
  long: (...args: ConsoleLogArgs) => args.forEach((arg) => console.dir(arg, { depth: null })),
  debug: (...args: ConsoleLogArgs) => args.forEach((arg) => console.dir(arg, { depth: null })),
};

export default logger;
