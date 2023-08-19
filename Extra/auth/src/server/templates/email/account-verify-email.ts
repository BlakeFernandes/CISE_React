import type { Options } from "nodemailer/lib/mailer";
import BaseEmail from "./base-email";

export type VerifyEmailData = {
  user: {
    name?: string | null;
    email: string;
  };
  verificationEmailLink: string;
};

export default class AccountVerifyEmail extends BaseEmail {
  private readonly verifyEmailData: VerifyEmailData;

  constructor(verifyEmailData: VerifyEmailData) {
    super();
    this.verifyEmailData = verifyEmailData;
  }

  protected getMailerOptions(): Options {
    return {
      to: this.verifyEmailData.user.email,
      subject: "Verify your email",
      text: `Hi ${
        this.verifyEmailData.user.name ?? this.verifyEmailData.user.email
      }! Please verify your email by clicking on the following link: ${
        this.verifyEmailData.verificationEmailLink
      }`,
    };
  }
}
