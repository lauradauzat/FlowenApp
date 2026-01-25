'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateUserSettings } from '@/actions/userSettingsActions';

type Props = {
  defaults: {
    limitNextSteps: number;
    limitCampaigns: number;
    limitResponses: number;
    showNextSteps: boolean;
    showResponses: boolean;
    showCampaigns: boolean;
    showMesProjets: boolean;
  };
};

export function DashboardSettingsForm({ defaults }: Props) {
  const router = useRouter();
  const [limitNextSteps, setLimitNextSteps] = useState(defaults.limitNextSteps);
  const [limitCampaigns, setLimitCampaigns] = useState(defaults.limitCampaigns);
  const [limitResponses, setLimitResponses] = useState(defaults.limitResponses);
  const [showNextSteps, setShowNextSteps] = useState(defaults.showNextSteps);
  const [showResponses, setShowResponses] = useState(defaults.showResponses);
  const [showCampaigns, setShowCampaigns] = useState(defaults.showCampaigns);
  const [showMesProjets, setShowMesProjets] = useState(defaults.showMesProjets);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const save = async () => {
    setSaving(true);
    setMessage(null);
    const res = await updateUserSettings({
      dashboard: {
        limitNextSteps,
        limitCampaigns,
        limitResponses,
        showNextSteps,
        showResponses,
        showCampaigns,
        showMesProjets,
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
      <h3 className="font-medium text-gray-900 mb-3">Sections affichées</h3>
      <div className="space-y-2 mb-6">
        {[
          { id: 'showNextSteps', label: 'Prochaines étapes', value: showNextSteps, set: setShowNextSteps },
          { id: 'showResponses', label: 'Nouvelles réponses', value: showResponses, set: setShowResponses },
          { id: 'showCampaigns', label: 'Campagnes en cours', value: showCampaigns, set: setShowCampaigns },
          { id: 'showMesProjets', label: 'Mes projets', value: showMesProjets, set: setShowMesProjets },
        ].map(({ id, label, value, set }) => (
          <label key={id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => set(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm">{label}</span>
          </label>
        ))}
      </div>

      <h3 className="font-medium text-gray-900 mb-3">Nombre d’éléments par section</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <label htmlFor="limitNextSteps" className="block text-sm text-gray-600 mb-1">Prochaines étapes</label>
          <input
            id="limitNextSteps"
            type="number"
            min={1}
            max={20}
            value={limitNextSteps}
            onChange={(e) => setLimitNextSteps(parseInt(e.target.value, 10) || 5)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="limitCampaigns" className="block text-sm text-gray-600 mb-1">Campagnes</label>
          <input
            id="limitCampaigns"
            type="number"
            min={1}
            max={20}
            value={limitCampaigns}
            onChange={(e) => setLimitCampaigns(parseInt(e.target.value, 10) || 5)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="limitResponses" className="block text-sm text-gray-600 mb-1">Nouvelles réponses</label>
          <input
            id="limitResponses"
            type="number"
            min={1}
            max={20}
            value={limitResponses}
            onChange={(e) => setLimitResponses(parseInt(e.target.value, 10) || 5)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>
      </div>

      {message && (
        <p className={`text-sm mb-4 ${message.type === 'ok' ? 'text-green-600' : 'text-red-600'}`}>
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
  );
}
