// Contact form handler for gibson-nyendwa-portfolio.
// Runtime: Node.js 20.x on AWS Lambda. The AWS SDK v3 is built into the runtime, so no bundling.
// Triggered by an API Gateway HTTP API route: POST /contact
//
// Environment variables (set in the Lambda console):
//   TO_EMAIL     where enquiries land                 e.g. info@gcmarketingsupport.co
//   FROM_EMAIL   SES-verified sender                  e.g. info@gcmarketingsupport.co
//   ALLOW_ORIGIN the site origin                      e.g. https://main.dbthjbi29n1oo.amplifyapp.com
//
// Protections: field validation and length limits, a honeypot field, a minimum fill time,
// and API Gateway throttling (set on the route). No credentials live in the frontend.

import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

const ses = new SESv2Client({});
const TO = process.env.TO_EMAIL;
const FROM = process.env.FROM_EMAIL;
const ORIGIN = process.env.ALLOW_ORIGIN || "*";

const LIMITS = { name: 100, email: 254, phone: 30, type: 60, message: 2000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+\d][\d\s().-]{6,29}$/;

const respond = (statusCode, body) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": ORIGIN,
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST,OPTIONS"
  },
  body: JSON.stringify(body)
});

const clean = (v, max) => String(v ?? "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max);

export const handler = async (event) => {
  if (event.requestContext?.http?.method === "OPTIONS") return respond(204, {});

  let data;
  try { data = JSON.parse(event.body || "{}"); } catch { return respond(400, { ok: false, error: "Could not read the message." }); }

  // Honeypot: real visitors never see or fill the Company field.
  if (data.company) return respond(200, { ok: true });

  // Minimum fill time: under three seconds is a bot.
  const started = Number(data.started || 0);
  if (!started || Date.now() - started < 3000) return respond(400, { ok: false, error: "Please take a moment and try again." });

  const name = clean(data.name, LIMITS.name);
  const email = clean(data.email, LIMITS.email);
  const phone = clean(data.phone, LIMITS.phone);
  const type = clean(data.type, LIMITS.type);
  const message = clean(data.message, LIMITS.message);

  if (name.length < 2) return respond(400, { ok: false, error: "Please enter your name." });
  if (!EMAIL_RE.test(email)) return respond(400, { ok: false, error: "Please enter a valid email address." });
  if (phone && !PHONE_RE.test(phone)) return respond(400, { ok: false, error: "That does not look like a phone number." });
  if (message.length < 10) return respond(400, { ok: false, error: "Please write at least a sentence." });
  // Header injection guard: no line breaks in anything that touches a header.
  if (/[\r\n]/.test(name) || /[\r\n]/.test(email)) return respond(400, { ok: false, error: "Invalid characters in name or email." });

  const subject = `Portfolio enquiry from ${name}${type ? ` (${type})` : ""}`;
  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : null,
    type ? `About: ${type}` : null,
    ``,
    message,
    ``,
    `Sent from the portfolio contact form at ${new Date().toISOString()}`
  ].filter(l => l !== null).join("\n");

  try {
    await ses.send(new SendEmailCommand({
      FromEmailAddress: FROM,
      Destination: { ToAddresses: [TO] },
      ReplyToAddresses: [email],
      Content: { Simple: { Subject: { Data: subject, Charset: "UTF-8" }, Body: { Text: { Data: text, Charset: "UTF-8" } } } }
    }));
    return respond(200, { ok: true });
  } catch (err) {
    console.error("SES send failed", err?.name, err?.message);
    return respond(502, { ok: false, error: "The message could not be sent right now. Please email me directly." });
  }
};
