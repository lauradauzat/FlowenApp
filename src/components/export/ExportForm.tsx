'use client';

import { useState } from 'react';

type ExportType = 'contacts' | 'venues';

const CONTACT_FIELDS = [
  { key: 'firstName', label: 'Prénom', default: true },
  { key: 'lastName', label: 'Nom', default: true },
  { key: 'email', label: 'Email', default: true },
  { key: 'phone', label: 'Téléphone', default: true },
  { key: 'role', label: 'Rôle', default: true },
  { key: 'notes', label: 'Notes', default: false },
  { key: 'status', label: 'Statut', default: true },
  { key: 'venues', label: 'Salles liées', default: false },
];

const VENUE_FIELDS = [
  { key: 'name', label: 'Nom', default: true },
  { key: 'address', label: 'Adresse', default: true },
  { key: 'region', label: 'Région', default: true },
  { key: 'website', label: 'Site web', default: true },
  { key: 'capacity', label: 'Capacité', default: true },
  { key: 'style', label: 'Style', default: false },
  { key: 'notes', label: 'Notes', default: false },
  { key: 'status', label: 'Statut', default: true },
  { key: 'contacts', label: 'Contacts liés', default: false },
];

export function ExportForm() {
  const [exportType, setExportType] = useState<ExportType>('contacts');
  const [selectedFields, setSelectedFields] = useState<string[]>(
    CONTACT_FIELDS.filter((f) => f.default).map((f) => f.key)
  );
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [regionFilter, setRegionFilter] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [includeRelations, setIncludeRelations] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fields = exportType === 'contacts' ? CONTACT_FIELDS : VENUE_FIELDS;

  const handleTypeChange = (type: ExportType) => {
    setExportType(type);
    const newFields = type === 'contacts' ? CONTACT_FIELDS : VENUE_FIELDS;
    const defaultFields = newFields.filter((f) => f.default).map((f) => f.key);
    setSelectedFields(defaultFields);
    setStatusFilter('');
    setRegionFilter('');
    setRoleFilter('');
  };

  const handleFieldToggle = (fieldKey: string) => {
    setSelectedFields((prev) =>
      prev.includes(fieldKey) ? prev.filter((f) => f !== fieldKey) : [...prev, fieldKey]
    );
  };

  const handleExport = async () => {
    if (selectedFields.length === 0) {
      setError('Veuillez sélectionner au moins un champ à exporter');
      return;
    }

    setIsExporting(true);
    setError(null);

    try {
      // Construire l'URL de l'API
      const params = new URLSearchParams({
        type: exportType,
        fields: selectedFields.join(','),
        includeRelations: includeRelations.toString(),
      });

      if (statusFilter) {
        params.append('status', statusFilter);
      }
      if (regionFilter) {
        params.append('region', regionFilter);
      }
      if (roleFilter) {
        params.append('role', roleFilter);
      }

      const url = `/api/export/csv?${params.toString()}`;

      // Télécharger le fichier
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'export');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${exportType}_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de l\'export');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="exportType" className="block text-sm font-medium text-gray-700 mb-2">
          Type de données à exporter
        </label>
        <select
          id="exportType"
          value={exportType}
          onChange={(e) => handleTypeChange(e.target.value as ExportType)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="contacts">Contacts</option>
          <option value="venues">Salles</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Champs à exporter
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {fields.map((field) => (
            <label key={field.key} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedFields.includes(field.key)}
                onChange={() => handleFieldToggle(field.key)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{field.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-2">
            Filtrer par statut
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tous les statuts</option>
            <option value="ACTIVE">Actifs</option>
            <option value="ARCHIVED">Archivés</option>
            <option value="ERROR">Avec erreurs</option>
          </select>
        </div>

        {exportType === 'venues' && (
          <div>
            <label htmlFor="regionFilter" className="block text-sm font-medium text-gray-700 mb-2">
              Filtrer par région
            </label>
            <input
              type="text"
              id="regionFilter"
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              placeholder="Ex: Île-de-France"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}

        {exportType === 'contacts' && (
          <div>
            <label htmlFor="roleFilter" className="block text-sm font-medium text-gray-700 mb-2">
              Filtrer par rôle
            </label>
            <input
              type="text"
              id="roleFilter"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              placeholder="Ex: Programmateur"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="includeRelations"
          checked={includeRelations}
          onChange={(e) => setIncludeRelations(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="includeRelations" className="ml-2 block text-sm text-gray-700">
          Inclure les connexions relationnelles ({exportType === 'contacts' ? 'salles' : 'contacts'}{' '}
          liés)
        </label>
      </div>

      <div className="pt-4">
        <button
          type="button"
          onClick={handleExport}
          disabled={isExporting || selectedFields.length === 0}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? 'Export en cours...' : 'Exporter en CSV'}
        </button>
      </div>
    </div>
  );
}
