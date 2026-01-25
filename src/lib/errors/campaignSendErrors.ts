/**
 * Epic 9: Catégorise les erreurs d'envoi de campagne et suggère des actions.
 */

export type ErrorCategory = 'corrigeable' | 'temporaire' | 'definitif';

export type CategorizedError = {
  type: ErrorCategory;
  label: string;
  suggestion: string;
};

const PATTERNS: Array<{
  test: (msg: string) => boolean;
  type: ErrorCategory;
  label: string;
  suggestion: string;
}> = [
  {
    test: (m) => /invalid|invalide|invalid (email|address|recipient)|email.*invalid/i.test(m),
    type: 'corrigeable',
    label: 'Adresse email invalide',
    suggestion: 'Vérifiez l’adresse du contact et corrigez-la dans la fiche contact.',
  },
  {
    test: (m) => /not found|introuvable|domain|domaine|does not exist|n'existe pas/i.test(m),
    type: 'corrigeable',
    label: 'Domaine ou destinataire introuvable',
    suggestion: 'Vérifiez l’adresse email du contact. Le domaine ou la boîte mail n’existe peut‑être plus.',
  },
  {
    test: (m) => /reject|refus|refused|blocked|bloqué|bounce|rebond/i.test(m),
    type: 'definitif',
    label: 'Refus ou rebond',
    suggestion: 'L’adresse refuse les mails ou la boîte est pleine. Essayez une autre adresse ou contactez le destinataire autrement.',
  },
  {
    test: (m) => /rate|quota|limit|limite|too many|trop de/i.test(m),
    type: 'temporaire',
    label: 'Limite ou quota dépassé',
    suggestion: 'Attendez quelques heures ou vérifiez les limites de votre fournisseur d’emails (ex. Resend).',
  },
  {
    test: (m) => /timeout|timed out|délai|expir/i.test(m),
    type: 'temporaire',
    label: 'Délai dépassé',
    suggestion: 'Le serveur du destinataire a mis trop de temps à répondre. Réessayez plus tard.',
  },
  {
    test: (m) => /smtp|server|serveur|unavailable|indisponible|connection|connexion/i.test(m),
    type: 'temporaire',
    label: 'Problème serveur ou connexion',
    suggestion: 'Problème côté serveur SMTP ou chez le destinataire. Réessayez plus tard.',
  },
  {
    test: (m) => /unauthorized|auth|api key|clé api|credentials/i.test(m),
    type: 'definitif',
    label: 'Erreur de configuration (API / envoi)',
    suggestion: 'Vérifiez RESEND_API_KEY et la configuration d’envoi dans les paramètres.',
  },
];

const DEFAULT: CategorizedError = {
  type: 'temporaire',
  label: 'Erreur d’envoi',
  suggestion: 'Consultez le message d’erreur. Vous pouvez réessayer ou corriger l’adresse du contact.',
};

export function categorizeSendError(errorMessage: string | null): CategorizedError {
  if (!errorMessage || !errorMessage.trim()) return DEFAULT;
  const m = errorMessage.trim();
  for (const { test, type, label, suggestion } of PATTERNS) {
    if (test(m)) return { type, label, suggestion };
  }
  return DEFAULT;
}
