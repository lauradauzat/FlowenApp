'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  deleteMailTemplate,
  duplicateMailTemplate,
} from '@/actions/mailTemplateActions';

type MailTemplate = {
  id: string;
  name: string;
  subject: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
};

type MailTemplateListProps = {
  templates: MailTemplate[];
};

export function MailTemplateList({ templates }: MailTemplateListProps) {
  const router = useRouter();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce template ?')) {
      return;
    }

    setProcessingId(id);
    setError(null);

    const result = await deleteMailTemplate({ id });

    if (result.success) {
      router.refresh();
    } else {
      setError(result.error?.message || 'Une erreur est survenue');
    }
    setProcessingId(null);
  };

  const handleDuplicate = async (id: string) => {
    setProcessingId(id);
    setError(null);

    const result = await duplicateMailTemplate({ id });

    if (result.success && result.data) {
      router.push(`/templates/${result.data.id}/edit`);
      router.refresh();
    } else {
      setError(result.error?.message || 'Une erreur est survenue lors de la duplication');
    }
    setProcessingId(null);
  };

  if (templates.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Aucun template de mailing.</p>
        <p className="text-sm mt-2">
          Créez votre premier template pour réutiliser des modèles de mails dans vos campagnes de booking.
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

      <ul className="divide-y divide-gray-200">
        {templates.map((template) => (
          <li
            key={template.id}
            className="py-4 flex items-center justify-between gap-4"
          >
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-900 truncate">{template.name}</p>
              <p className="text-sm text-gray-500 truncate">{template.subject}</p>
              <p className="text-xs text-gray-400 mt-1">
                Modifié le {new Date(template.updatedAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/templates/${template.id}/edit`}
                className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
              >
                Modifier
              </Link>
              <button
                type="button"
                onClick={() => handleDuplicate(template.id)}
                disabled={processingId === template.id}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded disabled:opacity-50"
              >
                {processingId === template.id ? '...' : 'Dupliquer'}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(template.id)}
                disabled={processingId === template.id}
                className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded disabled:opacity-50"
              >
                {processingId === template.id ? '...' : 'Supprimer'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
