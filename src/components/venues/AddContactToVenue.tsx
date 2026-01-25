'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { addContactToVenue } from '@/actions/contactVenueActions';
import { getContacts } from '@/actions/contactActions';

type Contact = {
  id: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  role?: string | null;
};

type AddContactToVenueProps = {
  venueId: string;
  onContactAdded?: () => void;
};

export function AddContactToVenue({ venueId, onContactAdded }: AddContactToVenueProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedContactId, setSelectedContactId] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      loadContacts();
    }
  }, [isOpen]);

  const loadContacts = async () => {
    setIsLoading(true);
    try {
      const result = await getContacts();
      if (result.success && result.data) {
        setContacts(result.data.contacts);
      }
    } catch (err) {
      console.error('Error loading contacts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedContactId) return;

    setIsSubmitting(true);
    setError(null);

    const result = await addContactToVenue({
      contactId: selectedContactId,
      venueId,
    });

    if (result.success) {
      setIsOpen(false);
      setSelectedContactId('');
      router.refresh();
      onContactAdded?.();
    } else {
      setError(result.error?.message || 'Une erreur est survenue');
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Ajouter un contact
      </button>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Ajouter un contact à cette salle</h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="contactId" className="block text-sm font-medium text-gray-700 mb-2">
            Sélectionner un contact
          </label>
          {isLoading ? (
            <p className="text-sm text-gray-500">Chargement des contacts...</p>
          ) : contacts.length === 0 ? (
            <p className="text-sm text-gray-500 mb-2">Aucun contact disponible.</p>
          ) : (
            <select
              id="contactId"
              name="contactId"
              required
              value={selectedContactId}
              onChange={(e) => setSelectedContactId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Sélectionner un contact</option>
              {contacts.map((contact) => (
                <option key={contact.id} value={contact.id}>
                  {contact.firstName} {contact.lastName.toUpperCase()}
                  {contact.role && ` - ${contact.role}`}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSubmitting || !selectedContactId || contacts.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Ajout...' : 'Ajouter'}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setSelectedContactId('');
              setError(null);
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
