/**
 * Helpers Prisma pour garantir le filtrage par userId (multi-tenancy)
 * 
 * CRITIQUE : Toutes les requêtes de données personnelles DOIVENT utiliser ces helpers
 * pour garantir que chaque utilisateur ne peut accéder qu'à ses propres données.
 * 
 * Pattern à suivre :
 * - Toujours passer userId en premier paramètre
 * - Toujours inclure userId dans la clause where
 * - Ne jamais faire de requête sur données personnelles sans userId
 */

import { UnauthorizedError } from "@/lib/errors";

/**
 * Exemple de helper pour récupérer des projets (sera utilisé dans Epic 2)
 * Cette fonction garantit que seuls les projets de l'utilisateur sont retournés
 * 
 * @param userId - ID de l'utilisateur (obligatoire)
 * @returns Liste des projets de l'utilisateur
 */
export async function getUserProjects(userId: string) {
  if (!userId) {
    throw new UnauthorizedError("userId est requis pour accéder aux projets");
  }

  // TODO: Implémenter quand le modèle Project sera créé dans Epic 2
  // import { prisma } from "@/lib/prisma/client";
  // return prisma.project.findMany({
  //   where: { userId },
  // });
  
  return [];
}

/**
 * Helper générique pour vérifier qu'un userId est fourni
 * Utilisé dans toutes les fonctions helper pour garantir la sécurité
 */
export function requireUserId(userId: string | null | undefined): string {
  if (!userId) {
    throw new UnauthorizedError("userId est requis pour cette opération");
  }
  return userId;
}

/**
 * Helper pour créer une clause where avec userId
 * Utile pour construire des requêtes complexes tout en garantissant le filtrage
 */
export function withUserIdFilter<T extends Record<string, unknown>>(
  userId: string,
  additionalWhere?: T
): T & { userId: string } {
  requireUserId(userId);
  return {
    ...additionalWhere,
    userId,
  } as T & { userId: string };
}

/**
 * Helper pour vérifier qu'une ressource appartient à l'utilisateur
 * Utilisé avant les opérations de modification/suppression
 * 
 * @param userId - ID de l'utilisateur
 * @param resourceUserId - ID de l'utilisateur propriétaire de la ressource
 * @throws ForbiddenError si la ressource n'appartient pas à l'utilisateur
 */
export function verifyResourceOwnership(userId: string, resourceUserId: string | null | undefined) {
  requireUserId(userId);
  if (!resourceUserId) {
    throw new UnauthorizedError("Ressource introuvable");
  }
  if (resourceUserId !== userId) {
    throw new UnauthorizedError("Vous n'avez pas accès à cette ressource");
  }
}
