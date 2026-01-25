'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  createScrapingSource,
  updateScrapingSource,
} from '@/actions/scrapingSourceActions';
import { ScrapingSourceType } from '@prisma/client';

type ScrapingSourceFormProps =
  | {
      mode: 'create';
      initialValues?: undefined;
      defaultFrequency?: string | null;
    }
  | {
      mode: 'edit';
      initialValues: {
        id: string;
        name: string;
        type: ScrapingSourceType;
        url?: string | null;
        selectors?: Record<string, unknown> | null;
        apiKey?: string | null;
        frequency?: string | null;
        isActive: boolean;
      };
      defaultFrequency?: undefined;
    };

export function ScrapingSourceForm(props: ScrapingSourceFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = props.mode === 'edit';
  const initial = isEdit ? props.initialValues : undefined;
  const defaultFreq = !isEdit && 'defaultFrequency' in props ? props.defaultFrequency : undefined;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const payload = {
      name: (formData.get('name') as string).trim(),
      type: formData.get('type') as ScrapingSourceType,
      url: (formData.get('url') as string | null) || undefined,
      selectors: formData.get('selectors')
        ? JSON.parse(formData.get('selectors') as string)
        : undefined,
      apiKey: (formData.get('apiKey') as string | null) || undefined,
      frequency: (formData.get('frequency') as string | null) || undefined,
      isActive: formData.get('isActive') === 'true',
    };

    const result = isEdit
      ? await updateScrapingSource({ id: initial!.id, ...payload })
      : await createScrapingSource(payload);

    if (result.success && result.data) {
      router.refresh();
    } else {
      setError(result.error?.message || 'Une erreur est survenue');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Nom de la source *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          defaultValue={initial?.name ?? ''}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Ex: Bandsintown, Songkick, API personnalisée..."
        />
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
          Type de source *
        </label>
        <select
          id="type"
          name="type"
          required
          defaultValue={initial?.type ?? ''}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Sélectionner un type</option>
          <option value="WEBSITE">Site web (scraping)</option>
          <option value="API">API externe</option>
          <option value="CUSTOM">Source personnalisée</option>
        </select>
      </div>

      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
          URL
        </label>
        <input
          type="url"
          id="url"
          name="url"
          defaultValue={initial?.url ?? ''}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="https://www.exemple.com"
        />
        <p className="mt-1 text-xs text-gray-500">
          URL de base pour le scraping ou endpoint de l&apos;API
        </p>
      </div>

      <div>
        <label
          htmlFor="selectors"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Sélecteurs (JSON)
        </label>
        <textarea
          id="selectors"
          name="selectors"
          rows={4}
          defaultValue={
            initial?.selectors ? JSON.stringify(initial.selectors, null, 2) : ''
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
          placeholder='{"name": ".venue-name", "address": ".venue-address"}'
        />
        <p className="mt-1 text-xs text-gray-500">
          Sélecteurs CSS/XPath au format JSON (pour sources WEBSITE)
        </p>
      </div>

      <div>
        <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
          Clé API
        </label>
        <input
          type="password"
          id="apiKey"
          name="apiKey"
          defaultValue={initial?.apiKey ?? ''}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Votre clé API (optionnel)"
        />
        <p className="mt-1 text-xs text-gray-500">
          Clé API pour les sources de type API (optionnel)
        </p>
      </div>

      <div>
        <label
          htmlFor="frequency"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Fréquence de scraping
        </label>
        <select
          id="frequency"
          name="frequency"
          defaultValue={initial?.frequency ?? defaultFreq ?? ''}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Manuel</option>
          <option value="daily">Quotidien</option>
          <option value="weekly">Hebdomadaire</option>
          <option value="monthly">Mensuel</option>
        </select>
      </div>

      {isEdit && (
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            defaultChecked={initial?.isActive ?? false}
            value="true"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
            Source activée
          </label>
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? isEdit
              ? 'Enregistrement...'
              : 'Création...'
            : isEdit
              ? 'Enregistrer les modifications'
              : 'Créer la source'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
