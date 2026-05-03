import { z } from 'zod';

/**
 * Valide l'en-tête From pour Resend : email seul ou « Affichage <email@domaine> ».
 * Chaîne vide ou espaces → null (utiliser EMAIL_FROM côté serveur).
 */
export function validateAndNormalizeMailingFrom(
  input: string | null | undefined
): { ok: true; value: string | null } | { ok: false; message: string } {
  if (input == null || typeof input !== 'string') return { ok: true, value: null };
  const t = input.trim();
  if (!t) return { ok: true, value: null };
  if (t.length > 255) {
    return { ok: false, message: "L'expéditeur ne peut pas dépasser 255 caractères." };
  }

  let addr: string;
  const lt = t.lastIndexOf('<');
  const gt = t.lastIndexOf('>');
  if (lt !== -1 && gt > lt) {
    addr = t.slice(lt + 1, gt).trim();
  } else {
    addr = t;
  }

  const parsed = z.string().email().safeParse(addr);
  if (!parsed.success) {
    return {
      ok: false,
      message:
        'Adresse email d’expéditeur invalide. Utilisez une adresse vérifiée dans Resend, ou le format « Nom <email@domaine> ».',
    };
  }
  return { ok: true, value: t };
}
