'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  updateProjectSchedule,
  applySuggestedStepDates,
} from '@/actions/projectActions';

type Props = {
  projectId: string;
  startDate: Date | null;
  endDate: Date | null;
  /** Jours de travail équivalent / semaine (0,5–7) ; null = défaut 3 côté suggestion */
  weeklyDedicatedDays: number | null;
};

function toInputDate(d: Date | null): string {
  if (!d) return '';
  const x = new Date(d);
  const y = x.getFullYear();
  const m = String(x.getMonth() + 1).padStart(2, '0');
  const day = String(x.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function weeklyToInput(n: number | null): string {
  if (n == null || !Number.isFinite(n)) return '3';
  return String(Math.min(7, Math.max(0.5, n)));
}

export function ProjectSchedulePanel({
  projectId,
  startDate,
  endDate,
  weeklyDedicatedDays,
}: Props) {
  const router = useRouter();
  const [start, setStart] = useState(toInputDate(startDate));
  const [end, setEnd] = useState(toInputDate(endDate));
  const [weekly, setWeekly] = useState(weeklyToInput(weeklyDedicatedDays));
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [capacityWarning, setCapacityWarning] = useState<string | null>(null);
  const [busy, setBusy] = useState<'save' | 'suggest' | null>(null);

  useEffect(() => {
    setStart(toInputDate(startDate));
    setEnd(toInputDate(endDate));
    setWeekly(weeklyToInput(weeklyDedicatedDays));
  }, [startDate, endDate, weeklyDedicatedDays]);

  const saveDates = async () => {
    setBusy('save');
    setMsg(null);
    setCapacityWarning(null);
    const w = parseFloat(weekly.replace(',', '.'));
    const res = await updateProjectSchedule({
      projectId,
      startDate: start === '' ? null : start,
      endDate: end === '' ? null : end,
      weeklyDedicatedDays: Number.isFinite(w) ? Math.min(7, Math.max(0.5, w)) : null,
    });
    setBusy(null);
    if (res.success) {
      setMsg({ type: 'ok', text: 'Dates du projet enregistrées.' });
      router.refresh();
    } else {
      setMsg({ type: 'err', text: res.error?.message ?? 'Erreur' });
    }
  };

  const suggest = async () => {
    setBusy('suggest');
    setMsg(null);
    setCapacityWarning(null);
    const res = await applySuggestedStepDates({ projectId });
    setBusy(null);
    if (res.success) {
      const warn =
        res.data && typeof res.data === 'object' && 'warning' in res.data && res.data.warning
          ? String(res.data.warning)
          : null;
      setCapacityWarning(warn);
      setMsg({
        type: 'ok',
        text: `Dates suggérées appliquées (${res.data?.updated ?? 0} étape(s)). Vous pouvez les ajuster ci-dessous.`,
      });
      router.refresh();
    } else {
      setMsg({ type: 'err', text: res.error?.message ?? 'Erreur' });
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 space-y-4">
      <h2 className="text-xl font-semibold">Calendrier du projet</h2>
      <p className="text-sm text-gray-600">
        Définissez la date de début (référence pour les suggestions). Avec une <strong>fin prévue</strong>, les dates
        cibles sont réparties sur la fenêtre selon les durées estimées. Le <strong>rythme hebdomadaire</strong> calibre
        le mode sans fin et sert à signaler si la charge dépasse ce que la période permet.
      </p>
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label htmlFor="proj-start" className="block text-xs font-medium text-gray-700 mb-1">
            Date de début
          </label>
          <input
            id="proj-start"
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="proj-end" className="block text-xs font-medium text-gray-700 mb-1">
            Fin prévue (optionnel)
          </label>
          <input
            id="proj-end"
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1 min-w-[12rem] self-end">
          <label htmlFor="proj-weekly" className="text-xs font-medium text-gray-700">
            Jours / semaine dédiés au projet
          </label>
          <input
            id="proj-weekly"
            type="number"
            min={0.5}
            max={7}
            step={0.5}
            value={weekly}
            onChange={(e) => setWeekly(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm w-28"
            title="Entre 0,5 et 7 jours équivalents de travail par semaine"
          />
          <p className="text-xs text-gray-500">
            Sans fin prévue : étale les étapes. Avec une fin : signale si la charge dépasse la capacité estimée.
          </p>
        </div>
        <button
          type="button"
          onClick={saveDates}
          disabled={busy !== null}
          className="px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-900 disabled:opacity-50"
        >
          {busy === 'save' ? '…' : 'Enregistrer les dates'}
        </button>
        <button
          type="button"
          onClick={suggest}
          disabled={busy !== null}
          className="px-4 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 disabled:opacity-50"
          title="Utilise les dates et le rythme hebdomadaire déjà enregistrés sur le projet"
        >
          {busy === 'suggest' ? '…' : 'Suggérer les dates des étapes'}
        </button>
      </div>
      {msg && <p className={`text-sm ${msg.type === 'ok' ? 'text-green-600' : 'text-red-600'}`}>{msg.text}</p>}
      {capacityWarning && (
        <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded px-3 py-2">{capacityWarning}</p>
      )}
    </div>
  );
}
