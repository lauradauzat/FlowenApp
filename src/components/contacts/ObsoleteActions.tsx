'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { markContactAsValid, archiveContact } from '@/actions/contactActions';

type ObsoleteActionsProps = {
  contactId: string;
};

export function ObsoleteActions({ contactId }: ObsoleteActionsProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [action, setAction] = useState<'validate' | 'archive' | null>(null);

  const handleMarkAsValid = async () => {
    setIsProcessing(true);
    setError(null);
    setAction('validate');

    const result = await markContactAsValid({ id: contactId });

    if (result.success) {
      router.refresh();
    } else {
      setError(result.error?.message || 'Une erreur est survenue');
      setIsProcessing(false);
    }
  };

  const handleArchive = async () => {
    setIsProcessing(true);
    setError(null);
    setAction('archive');

    const result = await archiveContact({ id: contactId });

    if (result.success) {
      router.refresh();
    } else {
      setError(result.error?.message || 'Une erreur est survenue');
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <svg
          className="h-5 w-5 text-yellow-600 mr-2 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-yellow-800 mb-2">
            Ce contact est marqué comme obsolète
          </h3>
          <p className="text-sm text-yellow-700 mb-3">
            L&apos;email de ce contact a rebondi ou est invalide. Vous pouvez corriger les
            informations ou archiver ce contact.
          </p>

          {error && (
            <div className="mb-3 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-wrap gap-2 items-center">
            <button
              type="button"
              onClick={handleMarkAsValid}
              disabled={isProcessing}
              className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing && action === 'validate'
                ? 'Validation...'
                : 'Marquer comme valide'}
            </button>
            <button
              type="button"
              onClick={handleArchive}
              disabled={isProcessing}
              className="px-4 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing && action === 'archive' ? 'Archivage...' : 'Archiver'}
            </button>
            <span className="text-sm text-yellow-700">
              Utilisez le formulaire d&apos;édition ci-dessous pour corriger les informations
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
