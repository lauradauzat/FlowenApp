'use client';

import { useEffect, useState } from 'react';
import { getUserScrapingJobsAction } from '@/actions/scrapingActions';
import { ScrapingJobStatus } from './ScrapingJobStatus';

type ScrapingJob = {
  id: string;
  type: string;
  status: string;
  resultCount?: number | null;
  errorMessage?: string | null;
  startedAt?: Date | null;
  completedAt?: Date | null;
  createdAt: Date;
  source?: {
    id: string;
    name: string;
  } | null;
};

type ScrapingJobsListProps = {
  type?: 'VENUES' | 'CONTACTS';
  limit?: number;
};

export function ScrapingJobsList({ type = 'VENUES', limit = 10 }: ScrapingJobsListProps) {
  const [jobs, setJobs] = useState<ScrapingJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    setIsLoading(true);
    const result = await getUserScrapingJobsAction({ type, limit });

    if (result.success && result.data) {
      setJobs(result.data.jobs);
      setError(null);
    } else {
      setError(result.error?.message || 'Erreur lors de la récupération des jobs');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchJobs();

    // Rafraîchir automatiquement toutes les 3 secondes pour les jobs en cours
    const interval = setInterval(() => {
      fetchJobs();
    }, 3000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, limit]);

  if (isLoading) {
    return <div className="text-sm text-gray-600">Chargement des jobs...</div>;
  }

  if (error) {
    return (
      <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
        {error}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-sm text-gray-500 text-center py-4">
        Aucun job de scraping pour le moment.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div
          key={job.id}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="font-medium text-gray-900">
                Scraping de {job.type === 'VENUES' ? 'salles' : 'contacts'}
              </div>
              {job.source && (
                <div className="text-sm text-gray-600">Source: {job.source.name}</div>
              )}
              <div className="text-xs text-gray-500 mt-1">
                Créé le {new Date(job.createdAt).toLocaleString('fr-FR')}
              </div>
            </div>
          </div>

          <ScrapingJobStatus jobId={job.id} autoRefresh={true} />
        </div>
      ))}
    </div>
  );
}
