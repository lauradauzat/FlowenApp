'use client';

import { useState, useEffect } from 'react';

type ColumnMappingProps = {
  headers: string[];
  type: 'contacts' | 'venues';
  onComplete: (mapping: Record<string, string>) => void;
  onCancel: () => void;
};

const CONTACT_FIELDS = [
  { key: 'firstName', label: 'Prénom', required: true },
  { key: 'lastName', label: 'Nom', required: true },
  { key: 'email', label: 'Email', required: false },
  { key: 'phone', label: 'Téléphone', required: false },
  { key: 'role', label: 'Rôle', required: false },
  { key: 'notes', label: 'Notes', required: false },
];

const VENUE_FIELDS = [
  { key: 'name', label: 'Nom', required: true },
  { key: 'address', label: 'Adresse', required: false },
  { key: 'region', label: 'Région', required: false },
  { key: 'website', label: 'Site web', required: false },
  { key: 'capacity', label: 'Capacité', required: false },
  { key: 'style', label: 'Style', required: false },
  { key: 'notes', label: 'Notes', required: false },
];

export function ColumnMapping({ headers, type, onComplete, onCancel }: ColumnMappingProps) {
  const fields = type === 'contacts' ? CONTACT_FIELDS : VENUE_FIELDS;
  const [mapping, setMapping] = useState<Record<string, string>>({});

  // Auto-détection basique : chercher des correspondances par nom
  useEffect(() => {
    const autoMapping: Record<string, string> = {};
    fields.forEach((field) => {
      const match = headers.find(
        (header) =>
          header.toLowerCase().includes(field.key.toLowerCase()) ||
          header.toLowerCase().includes(field.label.toLowerCase())
      );
      if (match) {
        autoMapping[field.key] = match;
      }
    });
    setMapping(autoMapping);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headers, type]);

  const handleMappingChange = (fieldKey: string, header: string) => {
    setMapping((prev) => ({
      ...prev,
      [fieldKey]: header,
    }));
  };

  const handleSubmit = () => {
    // Vérifier que les champs requis sont mappés
    const requiredFields = fields.filter((f) => f.required);
    const missingFields = requiredFields.filter((f) => !mapping[f.key]);

    
    if (missingFields.length > 0) {
      alert(
        `Veuillez mapper les champs requis : ${missingFields.map((f) => f.label).join(', ')}`
      );
      return;
    }

    onComplete(mapping);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Mapping des colonnes</h3>
      <p className="text-sm text-gray-600">
        Associez chaque champ de la base de données à une colonne de votre fichier CSV.
      </p>

      <div className="space-y-3">
        {fields.map((field) => (
          <div key={field.key} className="flex items-center gap-4">
            <label className="w-32 text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              value={mapping[field.key] || ''}
              onChange={(e) => handleMappingChange(field.key, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- Sélectionner une colonne --</option>
              {headers.map((header) => (
                <option key={header} value={header}>
                  {header}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Continuer
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Annuler
        </button>
      </div>
    </div>
  );
}
