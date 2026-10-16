import nodemailer from "nodemailer";

// Envío de mails (verificación de usuarios, etc.) por SMTP con nodemailer.
// Variables de entorno (ver .env.example):
//   MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS  (+ opcional MAIL_FROM, MAIL_SECURE)
// Si no están definidas, el sistema sigue funcionando pero sin enviar mails
// (los usuarios nuevos quedan verificados automáticamente).

export const mailConfigurado = () =>
  Boolean(process.env.MAIL_HOST && process.env.MAIL_USER && process.env.MAIL_PASS);

let transporter = null;
const obtenerTransporter = () => {
  if (!transporter) {
    const puerto = Number(process.env.MAIL_PORT || 587);
    transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: puerto,
      secure: process.env.MAIL_SECURE ? process.env.MAIL_SECURE === "true" : puerto === 465,
      auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
    });
  }
  return transporter;
};

export const enviarMail = async ({ to, subject, html }) => {
  if (!mailConfigurado()) throw new Error("El envío de mails no está configurado");
  return obtenerTransporter().sendMail({
    from: process.env.MAIL_FROM || `DuMont <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
  });
};
