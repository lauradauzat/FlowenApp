import { prisma } from '@/lib/prisma/client';
import { getEffectiveFicheConfig } from '@/lib/ficheFields';

/** Charge la config effective des fiches pour un utilisateur (Server Actions uniquement). */
export async function loadEffectiveFicheConfig(userId: string) {
  const row = await prisma.userSettings.findUnique({
    where: { userId },
    select: { ficheContactFields: true, ficheVenueFields: true },
  });
  return getEffectiveFicheConfig(row?.ficheContactFields ?? null, row?.ficheVenueFields ?? null);
}
