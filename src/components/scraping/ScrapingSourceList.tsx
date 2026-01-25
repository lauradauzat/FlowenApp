'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toggleScrapingSource, deleteScrapingSource, testScrapingSource } from '@/actions/scrapingSourceActions';
import { ScrapingSourceType } from '@prisma/client';

type ScrapingSource = {
  id: string;
  name: string;
  type: ScrapingSourceType;
  url?: string | null;
  isActive: boolean;
  frequency?: string | null;
  lastScrapedAt?: Date | null;
  createdAt: Date;
};

type ScrapingSourceListProps = {
  sources: ScrapingSource[];
};

function getTypeLabel(type: ScrapingSourceType): string {
  switch (type) {
    case 'WEBSITE':
      return 'Site web';
    case 'API':
      return 'API';
    case 'CUSTOM':
      return 'Personnalisée';
    default:
      return type;
  }
}

function getFrequencyLabel(frequency: string | null | undefined): string {
  if (!frequency) return 'Manuel';
  switch (frequency) {
    case 'daily':
      return 'Quotidien';
    case 'weekly':
      return 'Hebdomadaire';
    case 'monthly':
      return 'Mensuel';
    default:
      return frequency;
  }
}

export function ScrapingSourceList({ sources }: ScrapingSourceListProps) {
  const router = useRouter();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = async (id: string) => {
    setProcessingId(id);
    setError(null);

    const result = await toggleScrapingSource({ id });

    if (result.success) {
      router.refresh();
    } else {
      setError(result.error?.message || 'Une erreur est survenue');
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette source ?')) {
      return;
    }

    setProcessingId(id);
    setError(null);

    const result = await deleteScrapingSource({ id });

    if (result.success) {
      router.refresh();
    } else {
      setError(result.error?.message || 'Une erreur est survenue');
      setProcessingId(null);
    }
  };

  const handleTest = async (id: string) => {
    setProcessingId(id);
    setError(null);

    const result = await testScrapingSource({ id });

    if (result.success && result.data) {
      alert(result.data.message);
    } else {
      setError(result.error?.message || 'Une erreur est survenue lors du test');
    }

    setProcessingId(null);
  };

  if (sources.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Aucune source de scraping configurée.</p>
        <p className="text-sm mt-2">
          Créez votre première source pour commencer à importer des données automatiquement.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {sources.map((source) => (
          <div
            key={source.id}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{source.name}</h3>
                  <span
                    className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                      source.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {source.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {getTypeLabel(source.type)}
                  </span>
                </div>

                <div className="text-sm text-gray-600 space-y-1">
                  {source.url && (
                    <div>
                      <span className="font-medium">URL:</span> {source.url}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Fréquence:</span>{' '}
                    {getFrequencyLabel(source.frequency)}
                  </div>
                  {source.lastScrapedAt && (
                    <div>
                      <span className="font-medium">Dernier scraping:</span>{' '}
                      {new Date(source.lastScrapedAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <Link
                  href={`/settings/scraping/${source.id}/edit`}
                  className="px-3 py-1.5 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Modifier
                </Link>
                <button
                  type="button"
                  onClick={() => handleTest(source.id)}
                  disabled={processingId === source.id}
                  className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processingId === source.id ? 'Test...' : 'Tester'}
                </button>
                <button
                  type="button"
                  onClick={() => handleToggle(source.id)}
                  disabled={processingId === source.id}
                  className={`px-3 py-1.5 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                    source.isActive
                      ? 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500'
                      : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
                  }`}
                >
                  {processingId === source.id
                    ? '...'
                    : source.isActive
                      ? 'Désactiver'
                      : 'Activer'}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(source.id)}
                  disabled={processingId === source.id}
                  className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
