import { auth } from "@/lib/auth";
import { UnauthorizedError } from "@/lib/errors";

/**
 * Récupère l'ID de l'utilisateur depuis la session
 * @returns userId si authentifié, null sinon
 */
export async function getUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

/**
 * Exige que l'utilisateur soit authentifié
 * @throws UnauthorizedError si l'utilisateur n'est pas authentifié
 * @returns userId de l'utilisateur authentifié
 */
export async function requireAuth(): Promise<string> {
  const userId = await getUserId();
  if (!userId) {
    throw new UnauthorizedError("Vous devez être connecté pour accéder à cette ressource");
  }
  return userId;
}

/**
 * Vérifie si l'utilisateur est authentifié
 * @returns true si authentifié, false sinon
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await auth();
  return !!session?.user?.id;
}
