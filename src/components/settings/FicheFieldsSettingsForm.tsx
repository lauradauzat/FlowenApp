'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateUserSettings } from '@/actions/userSettingsActions';
import type { FicheFieldConfig, ContactFieldKey, VenueFieldKey, EffectiveFicheConfig } from '@/lib/ficheFields';
import {
  CONTACT_FIELD_KEYS,
  VENUE_FIELD_KEYS,
  LOCKED_CONTACT_KEYS,
  LOCKED_VENUE_KEYS,
} from '@/lib/ficheFields';

const CONTACT_LABELS: Record<ContactFieldKey, string> = {
  firstName: 'Prénom',
  lastName: 'Nom',
  email: 'Email',
  phone: 'Téléphone',
  role: 'Rôle',
  notes: 'Notes',
};

const VENUE_LABELS: Record<VenueFieldKey, string> = {
  name: 'Nom',
  address: 'Adresse',
  capacity: 'Capacité',
  style: 'Style',
  region: 'Région',
  website: 'Site web',
  notes: 'Notes',
};

function parseDefaultValue(val: string, key: string): string | number | undefined {
  const s = String(val ?? '').trim();
  if (s === '') return undefined;
  if (key === 'capacity') {
    const n = parseInt(s, 10);
    return isNaN(n) ? undefined : n;
  }
  return s;
}

type Props = {
  defaults: EffectiveFicheConfig;
};

export function FicheFieldsSettingsForm({ defaults }: Props) {
  const router = useRouter();
  const [contact, setContact] = useState<Record<ContactFieldKey, FicheFieldConfig>>(defaults.contact);
  const [venue, setVenue] = useState<Record<VenueFieldKey, FicheFieldConfig>>(defaults.venue);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const setContactField = (k: ContactFieldKey, patch: Partial<FicheFieldConfig>) => {
    setContact((c) => ({ ...c, [k]: { ...c[k], ...patch } }));
  };
  const setVenueField = (k: VenueFieldKey, patch: Partial<FicheFieldConfig> & { defaultValue?: string | number | null }) => {
    setVenue((v) => ({ ...v, [k]: { ...v[k], ...patch } }));
  };

  const buildPayload = (): { contact: Record<string, FicheFieldConfig>; venue: Record<string, FicheFieldConfig> } => {
    const contactPayload: Record<string, FicheFieldConfig> = {};
    for (const k of CONTACT_FIELD_KEYS) {
      const v = contact[k];
      const def = parseDefaultValue(String(v.defaultValue ?? ''), k);
      contactPayload[k] = {
        visible: v.visible,
        required: v.required,
        ...(def !== undefined ? { defaultValue: def } : {}),
      };
    }
    const venuePayload: Record<string, FicheFieldConfig> = {};
    for (const k of VENUE_FIELD_KEYS) {
      const v = venue[k];
      const def = parseDefaultValue(String(v.defaultValue ?? ''), k);
      venuePayload[k] = {
        visible: v.visible,
        required: v.required,
        ...(def !== undefined ? { defaultValue: def } : {}),
      };
    }
    return { contact: contactPayload, venue: venuePayload };
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    const { contact: cp, venue: vp } = buildPayload();
    const res = await updateUserSettings({ fiche: { contact: cp, venue: vp } });
    setSaving(false);
    if (res.success) {
      setMessage({ type: 'ok', text: 'Paramètres enregistrés.' });
      router.refresh();
    } else {
      setMessage({ type: 'err', text: res.error?.message ?? 'Erreur' });
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-8">
      <section>
        <h3 className="font-medium text-gray-900 mb-3">Fiche contact</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4">Champ</th>
                <th className="text-left py-2 px-2 w-24">Visible</th>
                <th className="text-left py-2 px-2 w-28">Obligatoire</th>
                <th className="text-left py-2 pl-2">Valeur par défaut</th>
              </tr>
            </thead>
            <tbody>
              {CONTACT_FIELD_KEYS.map((k) => {
                const v = contact[k];
                const locked = LOCKED_CONTACT_KEYS.includes(k);
                return (
                  <tr key={k} className="border-b border-gray-100">
                    <td className="py-2 pr-4">{CONTACT_LABELS[k]}</td>
                    <td className="py-2 px-2">
                      <input
                        type="checkbox"
                        checked={v.visible}
                        onChange={(e) => setContactField(k, { visible: e.target.checked })}
                        disabled={locked}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="checkbox"
                        checked={v.required}
                        onChange={(e) => setContactField(k, { required: e.target.checked })}
                        disabled={locked}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="py-2 pl-2">
                      <input
                        type="text"
                        value={String(v.defaultValue ?? '')}
                        onChange={(e) => setContactField(k, { defaultValue: e.target.value || undefined })}
                        className="w-full max-w-[200px] border border-gray-300 rounded px-2 py-1 text-sm"
                        placeholder="—"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="font-medium text-gray-900 mb-3">Fiche salle</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4">Champ</th>
                <th className="text-left py-2 px-2 w-24">Visible</th>
                <th className="text-left py-2 px-2 w-28">Obligatoire</th>
                <th className="text-left py-2 pl-2">Valeur par défaut</th>
              </tr>
            </thead>
            <tbody>
              {VENUE_FIELD_KEYS.map((k) => {
                const v = venue[k];
                const locked = LOCKED_VENUE_KEYS.includes(k);
                const isCapacity = k === 'capacity';
                return (
                  <tr key={k} className="border-b border-gray-100">
                    <td className="py-2 pr-4">{VENUE_LABELS[k]}</td>
                    <td className="py-2 px-2">
                      <input
                        type="checkbox"
                        checked={v.visible}
                        onChange={(e) => setVenueField(k, { visible: e.target.checked })}
                        disabled={locked}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="checkbox"
                        checked={v.required}
                        onChange={(e) => setVenueField(k, { required: e.target.checked })}
                        disabled={locked}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="py-2 pl-2">
                      <input
                        type={isCapacity ? 'number' : 'text'}
                        value={isCapacity ? (typeof v.defaultValue === 'number' ? v.defaultValue : v.defaultValue ?? '') : String(v.defaultValue ?? '')}
                        onChange={(e) => {
                          if (isCapacity) {
                            const raw = e.target.value;
                            if (raw === '') setVenueField(k, { defaultValue: undefined });
                            else {
                              const n = parseInt(raw, 10);
                              setVenueField(k, { defaultValue: isNaN(n) ? undefined : n });
                            }
                          } else {
                            setVenueField(k, { defaultValue: e.target.value || undefined });
                          }
                        }}
                        className="w-full max-w-[200px] border border-gray-300 rounded px-2 py-1 text-sm"
                        placeholder="—"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {message && (
        <p className={`text-sm ${message.type === 'ok' ? 'text-green-600' : 'text-red-600'}`}>{message.text}</p>
      )}
      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? 'Enregistrement…' : 'Enregistrer'}
      </button>
    </div>
  );
}
