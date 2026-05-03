'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addProjectStep } from '@/actions/projectActions';

type ParentOption = { id: string; name: string };

type Props = {
  projectId: string;
  /** Étapes racine pouvant servir de parent à une sous-tâche */
  parentOptions: ParentOption[];
};

export function AddStepForm({ projectId, parentOptions }: Props) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState<string>('');
  const [estDays, setEstDays] = useState('');
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    const est = estDays === '' ? null : parseInt(estDays, 10);
    if (estDays !== '' && (Number.isNaN(est) || est < 0)) {
      setMsg({ type: 'err', text: 'Nombre de jours invalide' });
      setSaving(false);
      return;
    }
    const res = await addProjectStep({
      projectId,
      name: name.trim(),
      parentStepId: parentId === '' ? null : parentId,
      estimatedDays: est,
    });
    setSaving(false);
    if (res.success) {
      setName('');
      setParentId('');
      setEstDays('');
      setMsg({ type: 'ok', text: 'Étape ajoutée.' });
      router.refresh();
    } else {
      setMsg({ type: 'err', text: res.error?.message ?? 'Erreur' });
    }
  };

  return (
    <form onSubmit={submit} className="border border-dashed border-gray-300 rounded-lg p-4 space-y-3 bg-gray-50/50">
      <h3 className="text-sm font-semibold text-gray-800">Ajouter une étape</h3>
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs text-gray-600 mb-1">Nom</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
            placeholder="Nouvelle étape"
            required
          />
        </div>
        <div className="min-w-[140px]">
          <label className="block text-xs text-gray-600 mb-1">Sous étape de</label>
          <select
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
          >
            <option value="">— Étape principale —</option>
            {parentOptions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className="w-24">
          <label className="block text-xs text-gray-600 mb-1">Jours est.</label>
          <input
            type="number"
            min={0}
            max={365}
            value={estDays}
            onChange={(e) => setEstDays(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
            placeholder="—"
          />
        </div>
        <button
          type="submit"
          disabled={saving || !name.trim()}
          className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? '…' : 'Ajouter'}
        </button>
      </div>
      {msg && <p className={`text-xs ${msg.type === 'ok' ? 'text-green-600' : 'text-red-600'}`}>{msg.text}</p>}
    </form>
  );
}
