import SendmailTransport from "nodemailer/lib/sendmail-transport";
import SMTPConnection from "nodemailer/lib/smtp-connection";
import SMTPTransport from "nodemailer/lib/smtp-transport";

function detectTransport(): SMTPTransport | SMTPTransport.Options | SendmailTransport.Options | string  {
  if (process.env.EMAIL_SERVER_HOST) {
    const port = parseInt(process.env.EMAIL_SERVER_PORT ?? "");
    const transport = {
      host: process.env.EMAIL_SERVER_HOST,
      port,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
      secure: port === 465,
      tls: {
        rejectUnauthorized: process.env.NODE_ENV ? false : true,
      },
    };

    return transport;
  }

  return {
    sendmail: true,
    newline: "unix",
    path: "/usr/sbin/sendmail",
  };
}

export const serverConfig = {
    transport: detectTransport(),
    from: process.env.EMAIL_FROM,
  };
  