'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createVenue, updateVenue } from '@/actions/venueActions';

type VenueFormProps =
  | {
      mode: 'create';
      initialValues?: undefined;
      onSuccess?: () => void;
    }
  | {
      mode: 'edit';
      initialValues: {
        id: string;
        name: string;
        address?: string | null;
        capacity?: number | null;
        style?: string | null;
        region?: string | null;
        website?: string | null;
        notes?: string | null;
      };
      onSuccess?: () => void;
    };

export function VenueForm(props: VenueFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = props.mode === 'edit';
  const initial = isEdit ? props.initialValues : undefined;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const payload = {
      name: (formData.get('name') as string).trim(),
      address: (formData.get('address') as string | null) || undefined,
      capacity: formData.get('capacity')
        ? parseInt(formData.get('capacity') as string, 10)
        : undefined,
      style: (formData.get('style') as string | null) || undefined,
      region: (formData.get('region') as string | null) || undefined,
      website: (formData.get('website') as string | null) || undefined,
      notes: (formData.get('notes') as string | null) || undefined,
    };

    const result = isEdit
      ? await updateVenue({ id: initial!.id, ...payload })
      : await createVenue(payload);

    if (result.success && result.data) {
      // Si onSuccess est fourni (mode édition sur page de détail), l'appeler
      if (props.onSuccess) {
        props.onSuccess();
        router.refresh();
      } else {
        // Sinon, rediriger vers la liste (mode création ou édition depuis liste)
        router.push('/venues');
        router.refresh();
      }
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
          Nom de la salle *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          defaultValue={initial?.name ?? ''}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Ex: Le Bataclan"
        />
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
          Adresse
        </label>
        <input
          type="text"
          id="address"
          name="address"
          defaultValue={initial?.address ?? ''}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Ex: 50 Boulevard Voltaire, 75011 Paris"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
            Capacité
          </label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            min="1"
            defaultValue={initial?.capacity ?? ''}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ex: 500"
          />
        </div>

        <div>
          <label htmlFor="style" className="block text-sm font-medium text-gray-700 mb-2">
            Style musical
          </label>
          <input
            type="text"
            id="style"
            name="style"
            defaultValue={initial?.style ?? ''}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ex: Rock, Electro, Jazz..."
          />
        </div>
      </div>

      <div>
        <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
          Région / Ville
        </label>
        <input
          type="text"
          id="region"
          name="region"
          defaultValue={initial?.region ?? ''}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Ex: Paris, Lyon, Marseille..."
        />
      </div>

      <div>
        <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
          Site web
        </label>
        <input
          type="url"
          id="website"
          name="website"
          defaultValue={initial?.website ?? ''}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="https://www.exemple.com"
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          defaultValue={initial?.notes ?? ''}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Infos utiles sur cette salle (disponibilités, tarifs, historique, etc.)"
        />
      </div>

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
              : 'Créer la salle'}
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
