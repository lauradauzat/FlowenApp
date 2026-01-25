'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { archiveContact, restoreContact } from '@/actions/contactActions';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

type ArchiveButtonProps = {
  contactId: string;
  isArchived: boolean;
};

export function ArchiveButton({ contactId, isArchived }: ArchiveButtonProps) {
  const router = useRouter();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleArchive = async () => {
    setIsProcessing(true);
    setError(null);

    const result = await archiveContact({ id: contactId });

    if (result.success) {
      setIsConfirmOpen(false);
      router.refresh();
    } else {
      setError(result.error?.message || 'Une erreur est survenue');
      setIsProcessing(false);
    }
  };

  const handleRestore = async () => {
    setIsProcessing(true);
    setError(null);

    const result = await restoreContact({ id: contactId });

    if (result.success) {
      router.refresh();
    } else {
      setError(result.error?.message || 'Une erreur est survenue');
      setIsProcessing(false);
    }
  };

  if (isArchived) {
    return (
      <div>
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <button
          type="button"
          onClick={handleRestore}
          disabled={isProcessing}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Restauration...' : 'Restaurer'}
        </button>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      <button
        type="button"
        onClick={() => setIsConfirmOpen(true)}
        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
      >
        Archiver
      </button>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Archiver ce contact"
        message="Êtes-vous sûr de vouloir archiver ce contact ? Il ne sera plus visible dans vos listes actives par défaut, mais vous pourrez le restaurer à tout moment."
        confirmLabel="Archiver"
        cancelLabel="Annuler"
        variant="danger"
        onConfirm={handleArchive}
        onCancel={() => {
          setIsConfirmOpen(false);
          setError(null);
        }}
      />
    </div>
  );
}
