import type { Options } from "nodemailer/lib/mailer";
import BaseEmail from "./base-email";

export type ForgotPasswordData = {
  user: {
    name?: string | null;
    email: string;
  };
  resetLink: string;
};

export default class ForgotPasswordEmail extends BaseEmail {
  private forgotPasswordData: ForgotPasswordData;

  constructor(verifyEmailData: ForgotPasswordData) {
    super();
    this.forgotPasswordData = verifyEmailData;
  }

  protected getMailerOptions(): Options {
    return {
      to: this.forgotPasswordData.user.email,
      subject: "Reset your password",
      text: `Hi ${
        this.forgotPasswordData.user.name ?? this.forgotPasswordData.user.email
      }! Please verify your email by clicking on the following link: ${
        this.forgotPasswordData.resetLink
      }`,
    };
  }
}
