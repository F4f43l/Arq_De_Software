// infra/mailer/NodemailerMailer.ts
import nodemailer from "nodemailer";
import { injectable } from "inversify";
import { Mailer } from "../domain/Mailer";

@injectable()
export class NodemailerMailer implements Mailer {
  private transporter: any;
  

  constructor() {
    if (process.env.APP_ENV === "dev") {
      nodemailer.createTestAccount().then(account => {
        this.transporter = nodemailer.createTransport({
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure,
          auth: {
            user: account.user,
            pass: account.pass
          }
        });
      });
    } else {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    }
  }

  async send(to: string, subject: string, body: string): Promise<void> {
    const info = await this.transporter.sendMail({
      to,
      subject,
      text: body
    });

    if (process.env.APP_ENV === "dev") {
      console.log("Preview:", nodemailer.getTestMessageUrl(info));
    }
  }
}
