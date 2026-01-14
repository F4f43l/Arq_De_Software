// infra/container.ts
import { Container } from "inversify";
import { TYPES } from "../types";
import { Logger } from "../domain/Logger";
import { Mailer } from "../domain/Mailer";
import { ReportService } from "../domain/ReportService";
import { WinstonLogger } from "./WinstonLogger";
import { NodemailerMailer } from "./NodemailerMailer";
import { ReportServiceImpl } from "../domain/ReportServiceImpl";

const container = new Container();

container.bind<Logger>(TYPES.Logger).to(WinstonLogger).inSingletonScope();
container.bind<Mailer>(TYPES.Mailer).to(NodemailerMailer).inSingletonScope();
container.bind<ReportService>(TYPES.ReportService).to(ReportServiceImpl);

export { container };
