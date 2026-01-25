'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createVenue, updateVenue } from '@/actions/venueActions';
import type { VenueFieldKey, FicheFieldConfig } from '@/lib/ficheFields';
import { VENUE_FIELD_KEYS } from '@/lib/ficheFields';

const VENUE_LABELS: Record<VenueFieldKey, string> = {
  name: 'Nom de la salle',
  address: 'Adresse',
  capacity: 'Capacité',
  style: 'Style musical',
  region: 'Région / Ville',
  website: 'Site web',
  notes: 'Notes',
};

const VENUE_PLACEHOLDERS: Record<VenueFieldKey, string> = {
  name: 'Ex: Le Bataclan',
  address: 'Ex: 50 Boulevard Voltaire, 75011 Paris',
  capacity: 'Ex: 500',
  style: 'Ex: Rock, Electro, Jazz...',
  region: 'Ex: Paris, Lyon, Marseille...',
  website: 'https://www.exemple.com',
  notes: 'Infos utiles sur cette salle (disponibilités, tarifs, historique, etc.)',
};

type VenueFormPropsBase = {
  fieldConfig?: Record<VenueFieldKey, FicheFieldConfig>;
  onSuccess?: () => void;
};
type VenueFormProps =
  | (VenueFormPropsBase & { mode: 'create'; initialValues?: undefined })
  | (VenueFormPropsBase & {
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
    });

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

  const cfg = props.fieldConfig;
  const inputClass =
    'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>
      )}

      {VENUE_FIELD_KEYS.map((key) => {
        if (cfg && !cfg[key]?.visible) return null;
        const required = cfg ? cfg[key].required : key === 'name';
        const rawDef = isEdit ? (initial as Record<string, unknown>)[key] : cfg?.[key]?.defaultValue;
        const isCapacity = key === 'capacity';
        const isNotes = key === 'notes';
        const def = isCapacity
          ? (typeof rawDef === 'number' ? rawDef : '')
          : rawDef != null && rawDef !== ''
            ? String(rawDef)
            : '';

        return (
          <div key={key}>
            <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-2">
              {VENUE_LABELS[key]}
              {required ? ' *' : ''}
            </label>
            {isNotes ? (
              <textarea
                id={key}
                name={key}
                required={required}
                defaultValue={def}
                rows={4}
                className={inputClass}
                placeholder={VENUE_PLACEHOLDERS[key]}
              />
            ) : (
              <input
                type={isCapacity ? 'number' : key === 'website' ? 'url' : 'text'}
                id={key}
                name={key}
                required={required}
                min={isCapacity ? 1 : undefined}
                defaultValue={def}
                className={inputClass}
                placeholder={VENUE_PLACEHOLDERS[key]}
              />
            )}
          </div>
        );
      })}

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
