// infra/logger/WinstonLogger.ts
import { createLogger, format, transports } from "winston";
import { injectable } from "inversify";
import { Logger } from "../domain/Logger";

@injectable()
export class WinstonLogger implements Logger {
  private logger;

  constructor() {
    const isDev = process.env.APP_ENV === "dev";

    this.logger = createLogger({
      level: "info",
      format: format.combine(
        format.timestamp(),
        isDev ? format.colorize() : format.json()
      ),
      transports: [
        isDev
          ? new transports.Console()
          : new transports.File({ filename: "app.log" })
      ]
    });
  }

  info(msg: string) {
    this.logger.info(msg);
  }

  warn(msg: string) {
    this.logger.warn(msg);
  }

  error(msg: string) {
    this.logger.error(msg);
  }
}
