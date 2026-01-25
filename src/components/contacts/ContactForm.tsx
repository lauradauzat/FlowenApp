'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createContact, updateContact } from '@/actions/contactActions';
import type { ContactFieldKey, FicheFieldConfig } from '@/lib/ficheFields';
import { CONTACT_FIELD_KEYS } from '@/lib/ficheFields';

const CONTACT_LABELS: Record<ContactFieldKey, string> = {
  firstName: 'Prénom',
  lastName: 'Nom',
  email: 'Email',
  phone: 'Téléphone',
  role: 'Rôle',
  notes: 'Notes',
};

const CONTACT_PLACEHOLDERS: Record<ContactFieldKey, string> = {
  firstName: 'Ex: Marie',
  lastName: 'Ex: Dupont',
  email: 'exemple@domaine.com',
  phone: '+33 6 12 34 56 78',
  role: 'Programmateur, Manager, Booking Agent...',
  notes: 'Infos utiles sur ce contact (disponibilités, préférences, historique, etc.)',
};

type ContactFormPropsBase = {
  fieldConfig?: Record<ContactFieldKey, FicheFieldConfig>;
  onSuccess?: () => void;
};
type ContactFormProps =
  | (ContactFormPropsBase & { mode: 'create'; initialValues?: undefined })
  | (ContactFormPropsBase & {
      mode: 'edit';
      initialValues: {
        id: string;
        firstName: string;
        lastName: string;
        email?: string | null;
        phone?: string | null;
        role?: string | null;
        notes?: string | null;
      };
    });

export function ContactForm(props: ContactFormProps) {
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
      firstName: (formData.get('firstName') as string).trim(),
      lastName: (formData.get('lastName') as string).trim(),
      email: (formData.get('email') as string | null) || undefined,
      phone: (formData.get('phone') as string | null) || undefined,
      role: (formData.get('role') as string | null) || undefined,
      notes: (formData.get('notes') as string | null) || undefined,
    };

    const result = isEdit
      ? await updateContact({ id: initial!.id, ...payload })
      : await createContact(payload);

    if (result.success && result.data) {
      // Si onSuccess est fourni (mode édition sur page de détail), l'appeler
      if (props.onSuccess) {
        props.onSuccess();
        router.refresh();
      } else {
        // Sinon, rediriger vers la liste (mode création ou édition depuis liste)
        router.push('/contacts');
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

      {CONTACT_FIELD_KEYS.map((key) => {
        if (cfg && !cfg[key]?.visible) return null;
        const required = cfg ? cfg[key].required : key === 'firstName' || key === 'lastName';
        const rawDef = isEdit ? (initial as Record<string, unknown>)[key] : cfg?.[key]?.defaultValue;
        const def = rawDef != null && rawDef !== '' ? String(rawDef) : '';
        const isNotes = key === 'notes';
        return (
          <div key={key}>
            <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-2">
              {CONTACT_LABELS[key]}
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
                placeholder={CONTACT_PLACEHOLDERS[key]}
              />
            ) : (
              <input
                type={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'}
                id={key}
                name={key}
                required={required}
                defaultValue={def}
                className={inputClass}
                placeholder={CONTACT_PLACEHOLDERS[key]}
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
              : 'Créer le contact'}
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

