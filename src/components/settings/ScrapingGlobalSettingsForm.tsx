'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateUserSettings } from '@/actions/userSettingsActions';

type Props = {
  autoUpdateEnabled: boolean;
  defaultFrequency: string | null;
};

export function ScrapingGlobalSettingsForm({ autoUpdateEnabled, defaultFrequency }: Props) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(autoUpdateEnabled);
  const [frequency, setFrequency] = useState(defaultFrequency ?? '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const save = async () => {
    setSaving(true);
    setMessage(null);
    const res = await updateUserSettings({
      scraping: {
        autoUpdateEnabled: enabled,
        defaultFrequency: frequency === '' ? null : frequency,
      },
    });
    setSaving(false);
    if (res.success) {
      setMessage({ type: 'ok', text: 'Paramètres enregistrés.' });
      router.refresh();
    } else {
      setMessage({ type: 'err', text: res.error?.message ?? 'Erreur' });
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Mise à jour automatique</h3>
      <p className="text-sm text-gray-600 mb-4">
        Activez ou désactivez les mises à jour automatiques des sources. La fréquence de chaque
        source (quotidienne, hebdomadaire, mensuelle, manuelle) se configure dans chaque source.
      </p>
      <div className="space-y-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="rounded border-gray-300"
          />
          <span className="text-sm">Activer les mises à jour automatiques des sources</span>
        </label>
        <div>
          <label htmlFor="scrapingDefaultFrequency" className="block text-sm text-gray-600 mb-1">
            Fréquence par défaut pour les nouvelles sources
          </label>
          <select
            id="scrapingDefaultFrequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="">Manuel (pas de mise à jour auto)</option>
            <option value="daily">Quotidien</option>
            <option value="weekly">Hebdomadaire</option>
            <option value="monthly">Mensuel</option>
          </select>
        </div>
        {message && (
          <p className={`text-sm ${message.type === 'ok' ? 'text-green-600' : 'text-red-600'}`}>
            {message.text}
          </p>
        )}
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
}
