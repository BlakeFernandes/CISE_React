import type BaseEmail from "../../templates/email/base-email";
import AccountVerifyEmail, {
  type VerifyEmailData,
} from "../../templates/email/account-verify-email";
import ForgotPasswordEmail, {
  type ForgotPasswordData,
} from "~/server/templates/email/forgot-password-email";

const sendEmail = (prepare: () => BaseEmail) => {
  return new Promise((resolve, reject) => {
    try {
      const email = prepare();
      resolve(email.sendEmail());
    } catch (e) {
      reject(console.error(`${prepare.constructor.name}.sendEmail failed`, e));
    }
  });
};

export const sendEmailVerificationLink = async (
  verificationInput: VerifyEmailData
) => {
  await sendEmail(() => new AccountVerifyEmail(verificationInput));
};

export const sendForgotPasswordLink = async (
  forgotPasswordData: ForgotPasswordData
) => {
  await sendEmail(() => new ForgotPasswordEmail(forgotPasswordData));
};
