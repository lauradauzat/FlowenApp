'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { startVenueScraping, startContactScraping } from '@/actions/scrapingActions';
import type { ScrapingJobType } from '@prisma/client';

type StartScrapingButtonProps = {
  type?: ScrapingJobType;
  sourceId?: string;
  sourceName?: string;
};

export function StartScrapingButton({
  type = 'VENUES',
  sourceId,
  sourceName,
}: StartScrapingButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    setIsLoading(true);
    setError(null);

    const result =
      type === 'CONTACTS'
        ? await startContactScraping({ sourceId })
        : await startVenueScraping({ sourceId });

    if (result.success && result.data) {
      router.refresh();
      // Optionnel : rediriger vers la page des jobs ou afficher un message de succès
    } else {
      setError(result.error?.message || 'Une erreur est survenue');
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleStart}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading
          ? 'Lancement...'
          : sourceName
            ? `Scraper depuis ${sourceName}`
            : type === 'CONTACTS'
              ? 'Lancer le scraping des contacts'
              : 'Lancer le scraping des salles'}
      </button>
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
