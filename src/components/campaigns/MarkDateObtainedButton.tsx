'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createTourDate, updateCampaignResponse } from '@/actions/campaignActions';

type ProjectOption = { id: string; name: string };

export function MarkDateObtainedButton({
  responseId,
  campaignId,
  contactId,
  venueId,
  projects,
}: {
  responseId: string;
  campaignId: string;
  contactId: string;
  venueId: string;
  projects: ProjectOption[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projectId, setProjectId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId.trim()) {
      setError('Choisissez un projet.');
      return;
    }
    setLoading(true);
    setError(null);
    const tourRes = await createTourDate({
      projectId,
      campaignId,
      campaignResponseId: responseId,
      contactId,
      venueId,
      date: new Date(date),
      notes: notes.trim() || null,
    });
    if (!tourRes.success) {
      setError(tourRes.error?.message ?? 'Erreur');
      setLoading(false);
      return;
    }
    const updRes = await updateCampaignResponse({ id: responseId, isDateObtained: true });
    setLoading(false);
    if (updRes.success) {
      setOpen(false);
      router.refresh();
    } else {
      setError(updRes.error?.message ?? 'Erreur');
    }
  };

  return (
    <div className="mt-2">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-xs text-green-700 hover:text-green-800 hover:underline"
        >
          Marquer date obtenue
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="mt-2 p-3 border border-gray-200 rounded-lg bg-gray-50 space-y-2">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div>
            <label className="block text-xs text-gray-600 mb-1">Projet</label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
              required
            >
              <option value="">— Choisir —</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Notes (optionnel)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
              placeholder="Notes"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            <button
              type="button"
              onClick={() => { setOpen(false); setError(null); }}
              className="px-2 py-1 text-gray-600 text-xs hover:underline"
            >
              Annuler
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
