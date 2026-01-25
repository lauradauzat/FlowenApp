'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateUserSettings } from '@/actions/userSettingsActions';

type Props = {
  defaults: {
    firstDelayDays: number | string;
    nextDelayDays: number | string;
    max: number | string;
    templateId: string;
  };
  templates: Array<{ id: string; name: string }>;
};

export function RelancesSettingsForm({ defaults, templates }: Props) {
  const router = useRouter();
  const [first, setFirst] = useState(String(defaults.firstDelayDays ?? ''));
  const [next, setNext] = useState(String(defaults.nextDelayDays ?? ''));
  const [max, setMax] = useState(String(defaults.max ?? ''));
  const [templateId, setTemplateId] = useState(defaults.templateId ?? '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const save = async () => {
    setSaving(true);
    setMessage(null);
    const res = await updateUserSettings({
      relance: {
        firstDelayDays: first === '' ? null : parseInt(first, 10),
        nextDelayDays: next === '' ? null : parseInt(next, 10),
        max: max === '' ? null : parseInt(max, 10),
        templateId: templateId || null,
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
      <div className="space-y-4">
        <div>
          <label htmlFor="first" className="block text-sm font-medium text-gray-700 mb-1">
            Délai avant 1<sup>re</sup> relance (jours)
          </label>
          <input
            id="first"
            type="number"
            min={0}
            value={first}
            onChange={(e) => setFirst(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            placeholder="ex. 7"
          />
        </div>
        <div>
          <label htmlFor="next" className="block text-sm font-medium text-gray-700 mb-1">
            Délai entre relances suivantes (jours)
          </label>
          <input
            id="next"
            type="number"
            min={0}
            value={next}
            onChange={(e) => setNext(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            placeholder="ex. 5"
          />
        </div>
        <div>
          <label htmlFor="max" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre max de relances
          </label>
          <input
            id="max"
            type="number"
            min={0}
            value={max}
            onChange={(e) => setMax(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            placeholder="ex. 3"
          />
        </div>
        <div>
          <label htmlFor="template" className="block text-sm font-medium text-gray-700 mb-1">
            Template de relance par défaut
          </label>
          <select
            id="template"
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="">Même que l&apos;envoi initial (à choisir par campagne)</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
      </div>
      {message && (
        <p className={`mt-4 text-sm ${message.type === 'ok' ? 'text-green-600' : 'text-red-600'}`}>
          {message.text}
        </p>
      )}
      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="mt-6 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? 'Enregistrement…' : 'Enregistrer'}
      </button>
    </div>
  );
}
