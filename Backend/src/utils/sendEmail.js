import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { logger } from './logger.js';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!env.email.host || !env.email.user || !env.email.pass) return null;

  transporter = nodemailer.createTransport({
    host: env.email.host,
    port: env.email.port,
    secure: env.email.port === 465,
    auth: { user: env.email.user, pass: env.email.pass },
  });
  return transporter;
}

/**
 * Fire-and-forget email send. Never throws - a mail provider outage must not
 * block enquiry creation or make an enquiry "disappear" from the admin's point of view.
 */
export async function sendEmailSafe({ to, subject, html, text }) {
  const t = getTransporter();
  if (!t) {
    logger.warn(`Email not sent (provider not configured): ${subject} -> ${to}`);
    return { sent: false, reason: 'email_not_configured' };
  }

  try {
    const info = await t.sendMail({
      from: env.email.from,
      to,
      subject,
      html,
      text,
    });
    return { sent: true, messageId: info.messageId };
  } catch (err) {
    logger.error(`Email send failed: ${err.message}`);
    return { sent: false, reason: err.message };
  }
}
