import { createTransport } from "nodemailer";
import type { Options } from "nodemailer/lib/mailer";
import { serverConfig } from "~/server/config/nodemon-config";
import { APP_NAME } from "~/server/utils/constants";

export default class BaseEmail {
  protected readonly mailerOptions: Options;

  constructor() {
    this.mailerOptions = this._getMailerOptions();
  }

  public async sendEmail() {
    await createTransport(serverConfig.transport)
      .sendMail(this.mailerOptions)
      .catch((error) => {
        console.error("Error sending email: ", error);
      });
  }

  protected getMailerOptions(): Options {
    return {};
  }

  protected getDefaultMailerOptions(): Options {
    return {
      from: `${APP_NAME} <${serverConfig.from}>`,
    };
  }

  private _getMailerOptions(): Options {
    return { ...this.getDefaultMailerOptions(), ...this.getMailerOptions() };
  }
}
