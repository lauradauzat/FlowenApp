import { prisma } from '@/lib/prisma/client';
import { ScrapingJobType, ScrapingJobStatus } from '@prisma/client';

/**
 * Crée un nouveau job de scraping
 */
export async function createScrapingJob(
  userId: string,
  type: ScrapingJobType,
  sourceId?: string
) {
  return prisma.scrapingJob.create({
    data: {
      userId,
      type,
      sourceId: sourceId || undefined,
      status: 'PENDING',
    },
  });
}

/**
 * Récupère un job de scraping par son ID
 */
export async function getScrapingJob(jobId: string, userId: string) {
  return prisma.scrapingJob.findFirst({
    where: {
      id: jobId,
      userId, // Multi-tenancy : s'assurer que l'utilisateur est propriétaire
    },
    include: {
      source: true,
    },
  });
}

/**
 * Met à jour le statut d'un job
 */
export async function updateJobStatus(
  jobId: string,
  status: ScrapingJobStatus,
  data?: {
    resultCount?: number;
    errorMessage?: string;
    startedAt?: Date;
    completedAt?: Date;
  }
) {
  const updateData: {
    status: ScrapingJobStatus;
    resultCount?: number;
    errorMessage?: string;
    startedAt?: Date;
    completedAt?: Date;
  } = {
    status,
  };

  if (data?.resultCount !== undefined) {
    updateData.resultCount = data.resultCount;
  }
  if (data?.errorMessage !== undefined) {
    updateData.errorMessage = data.errorMessage;
  }
  if (data?.startedAt !== undefined) {
    updateData.startedAt = data.startedAt;
  }
  if (data?.completedAt !== undefined) {
    updateData.completedAt = data.completedAt;
  }

  return prisma.scrapingJob.update({
    where: { id: jobId },
    data: updateData,
  });
}

/**
 * Récupère tous les jobs de scraping d'un utilisateur
 */
export async function getUserScrapingJobs(
  userId: string,
  options?: {
    type?: ScrapingJobType;
    status?: ScrapingJobStatus;
    limit?: number;
  }
) {
  const where: {
    userId: string;
    type?: ScrapingJobType;
    status?: ScrapingJobStatus;
  } = {
    userId,
  };

  if (options?.type) {
    where.type = options.type;
  }
  if (options?.status) {
    where.status = options.status;
  }

  return prisma.scrapingJob.findMany({
    where,
    include: {
      source: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: options?.limit || 50,
  });
}
