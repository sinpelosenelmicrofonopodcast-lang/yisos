import { Resend } from "resend";

let resendClient: Resend | null = null;

function getResendClient() {
  if (resendClient) {
    return resendClient;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return null;
  }

  resendClient = new Resend(apiKey);
  return resendClient;
}

export async function sendTransactionalEmail({
  to,
  subject,
  html
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const resend = getResendClient();

  if (!resend) {
    return { ok: false, message: "Resend not configured" };
  }

  const from = process.env.RESEND_FROM_EMAIL || "YISOS CIGARS <noreply@yisoscigars.com>";

  const { error } = await resend.emails.send({
    from,
    to,
    subject,
    html
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  return { ok: true, message: "Sent" };
}
