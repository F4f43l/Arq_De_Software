import { inject, injectable } from "inversify";
import { faker } from "@faker-js/faker";
import { Logger } from "./Logger";
import { Mailer } from "./Mailer";
import { ReportService } from "./ReportService";
import { InvalidReportSizeError } from "./InvalidReportSizeError";
import { TYPES } from "../types";

@injectable()
export class ReportServiceImpl implements ReportService {
  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.Mailer) private mailer: Mailer
  ) {}

  async generateAndSend(email: string, n: number): Promise<void> {
    if (n <= 0 || n > 10) {
      throw new InvalidReportSizeError();
    }

    this.logger.info("Iniciando geração de relatório");

    const data = Array.from({ length: n }, () => ({
      nome: faker.person.fullName(),
      cidade: faker.location.city()
    }));

    const body = JSON.stringify(data, null, 2);

    await this.mailer.send(
      email,
      "Relatório Gerado",
      body
    );

    this.logger.info("Relatório enviado com sucesso");
  }
}
