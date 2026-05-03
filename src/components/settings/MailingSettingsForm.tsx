'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateUserSettings } from '@/actions/userSettingsActions';

type Props = {
  defaults: { mailingFrom: string };
};

export function MailingSettingsForm({ defaults }: Props) {
  const router = useRouter();
  const [from, setFrom] = useState(defaults.mailingFrom);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const save = async () => {
    setSaving(true);
    setMessage(null);
    const res = await updateUserSettings({
      mailing: { from: from.trim() === '' ? null : from.trim() },
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
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      <div>
        <label htmlFor="mailingFrom" className="block text-sm font-medium text-gray-700 mb-1">
          Adresse d’expédition des campagnes
        </label>
        <input
          id="mailingFrom"
          type="text"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          placeholder="ex. Marie Dupont <booking@votredomaine.com>"
          autoComplete="off"
        />
        <p className="mt-2 text-xs text-gray-500 space-y-1">
          <span className="block">
            Laissez vide pour utiliser l’expéditeur défini sur le serveur (<code className="bg-gray-100 px-1 rounded">EMAIL_FROM</code>).
          </span>
          <span className="block">
            Sinon : une adresse email seule, ou le format <strong>Nom &lt;email@domaine&gt;</strong>. Le domaine doit être{' '}
            <a
              href="https://resend.com/docs/dashboard/domains/introduction"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              vérifié dans Resend
            </a>
            .
          </span>
        </p>
      </div>

      {message && (
        <p className={`text-sm ${message.type === 'ok' ? 'text-green-600' : 'text-red-600'}`}>{message.text}</p>
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
