import winston, { level } from "winston";

const customLevelOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    verbose: 5,
    debug: 6,
  },
  colors: {
    fatal: "red",
    error: "orange",
    warning: "yellow",
    info: "blue",
    http: "grey",
    verbose: "white",
    debug: "green",
  },
};
const devLogger = winston.createLogger({
  level: customLevelOptions.levels,
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevelOptions.colors }),
        winston.format.simple()
      ),
    }),
  ],
});

const prodLogger = winston.createLogger({
  level: customLevelOptions.levels,
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevelOptions.colors }),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: "./errors.log",
      level: "error",
      format: winston.format.simple(),
    }),
  ],
});

const loggerLevels = {
  production: prodLogger,
  development: devLogger,
};

export function addLogger(req, res, next) {
  req.logger = loggerLevels[`${process.env.NODE_ENV}`];
  next();
}
