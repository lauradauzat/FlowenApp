'use client';

import { useState } from 'react';
import { VenueForm } from './VenueForm';

type Venue = {
  id: string;
  name: string;
  address?: string | null;
  capacity?: number | null;
  style?: string | null;
  region?: string | null;
  website?: string | null;
  notes?: string | null;
};

type EditableVenueSectionProps = {
  venue: Venue;
};

export function EditableVenueSection({ venue }: EditableVenueSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSuccess = () => {
    setShowSuccess(true);
    setIsEditing(false);
    // Masquer le message de succès après 4 secondes
    setTimeout(() => {
      setShowSuccess(false);
    }, 4000);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Modifier cette salle</h2>
        {!isEditing && !showSuccess && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Modifier
          </button>
        )}
      </div>

      {showSuccess && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg
              className="h-5 w-5 text-green-600 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p className="text-green-800 font-medium">
              Les modifications ont été enregistrées avec succès !
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="ml-auto text-green-600 hover:text-green-800"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {isEditing && (
        <div>
          <div className="mb-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Annuler l&apos;édition
            </button>
          </div>
          <VenueForm
            mode="edit"
            initialValues={{
              id: venue.id,
              name: venue.name,
              address: venue.address,
              capacity: venue.capacity,
              style: venue.style,
              region: venue.region,
              website: venue.website,
              notes: venue.notes,
            }}
            onSuccess={handleSuccess}
          />
        </div>
      )}

      {!isEditing && !showSuccess && (
        <p className="text-sm text-gray-500">
          Cliquez sur &quot;Modifier&quot; pour éditer les informations de cette salle.
        </p>
      )}
    </div>
  );
}
