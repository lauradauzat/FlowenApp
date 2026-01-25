/**
 * Service d'envoi d'emails via Resend.
 * Dépendances: RESEND_API_KEY, EMAIL_FROM (ex: "Flowen <onboarding@resend.dev>")
 * Voir .env.example
 */

export type SendEmailParams = {
  to: string;
  subject: string;
  body: string; // texte brut
};

export type SendEmailResult = { ok: true } | { ok: false; error: string };

export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? 'Flowen <onboarding@resend.dev>';

  if (!apiKey || apiKey === '') {
    return {
      ok: false,
      error:
        'RESEND_API_KEY manquant. Ajoutez RESEND_API_KEY et EMAIL_FROM dans .env. Voir la doc Resend.',
    };
  }

  try {
    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: params.to,
      subject: params.subject,
      text: params.body,
    });
    if (error) {
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erreur inconnue';
    return { ok: false, error: msg };
  }
}

export function isEmailConfigured(): boolean {
  return !!(process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== '');
}
