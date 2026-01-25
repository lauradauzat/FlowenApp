'use client';

import { useEffect, useState } from 'react';
import { getScrapingJobStatus } from '@/actions/scrapingActions';

type ScrapingJobStatusProps = {
  jobId: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
};

type JobStatus = {
  id: string;
  status: string;
  resultCount?: number | null;
  errorMessage?: string | null;
  startedAt?: Date | null;
  completedAt?: Date | null;
  source?: {
    id: string;
    name: string;
  } | null;
};

function getStatusLabel(status: string): string {
  switch (status) {
    case 'PENDING':
      return 'En attente';
    case 'RUNNING':
      return 'En cours';
    case 'COMPLETED':
      return 'Terminé';
    case 'FAILED':
      return 'Échoué';
    default:
      return status;
  }
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'RUNNING':
      return 'bg-blue-100 text-blue-800';
    case 'COMPLETED':
      return 'bg-green-100 text-green-800';
    case 'FAILED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function ScrapingJobStatus({
  jobId,
  autoRefresh = true,
  refreshInterval = 2000,
}: ScrapingJobStatusProps) {
  const [job, setJob] = useState<JobStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    const result = await getScrapingJobStatus({ jobId });

    if (result.success && result.data) {
      setJob(result.data);
      setIsLoading(false);
      setError(null);
    } else {
      setError(result.error?.message || 'Erreur lors de la récupération du statut');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();

    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchStatus();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId, autoRefresh, refreshInterval]);


  if (isLoading) {
    return (
      <div className="text-sm text-gray-600">Chargement du statut...</div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
        {error}
      </div>
    );
  }

  if (!job) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
            job.status
          )}`}
        >
          {getStatusLabel(job.status)}
        </span>
        {job.source && (
          <span className="text-sm text-gray-600">Source: {job.source.name}</span>
        )}
      </div>

      {job.status === 'RUNNING' && (
        <div className="text-sm text-gray-600">Scraping en cours...</div>
      )}

      {job.status === 'COMPLETED' && (
        <div className="text-sm text-green-700">
          ✓ {job.resultCount || 0} salle(s) importée(s) avec succès
        </div>
      )}

      {job.status === 'FAILED' && job.errorMessage && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded">
          Erreur: {job.errorMessage}
        </div>
      )}

      {job.startedAt && (
        <div className="text-xs text-gray-500">
          Début: {new Date(job.startedAt).toLocaleString('fr-FR')}
        </div>
      )}

      {job.completedAt && (
        <div className="text-xs text-gray-500">
          Fin: {new Date(job.completedAt).toLocaleString('fr-FR')}
        </div>
      )}
    </div>
  );
}
