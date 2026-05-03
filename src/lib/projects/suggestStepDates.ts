/**
 * Suggestions de dates prévues :
 * - Avec **date de fin** : répartition **proportionnelle** aux durées estimées sur la fenêtre [début, fin].
 * - **Jours / semaine** : sert au mode **sans fin** (calendrier = jours de travail / rythme) et au **signal** si la charge dépasse la capacité avant la deadline.
 */

export type StepForSuggestion = {
  id: string;
  order: number;
  estimatedDays: number | null;
};

export type SuggestPlanInput = {
  steps: StepForSuggestion[];
  start: Date;
  end: Date | null;
  /** Jours de travail équivalent par semaine calendaire (défaut 3, plage 0,5–7) */
  weeklyDedicatedDays: number;
};

const DEFAULT_EST = 3;
const DEFAULT_WEEKLY = 3;
const MS_DAY = 86400000;

export function clampWeeklyDedicatedDays(n: number): number {
  if (!Number.isFinite(n) || n < 0.5) return 0.5;
  if (n > 7) return 7;
  return n;
}

function startOfLocalDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function addCalendarDays(d: Date, days: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

/** Nombre de jours calendaires entre deux dates (inclus, min 1). */
export function calendarDaysInclusive(start: Date, end: Date): number {
  const a = startOfLocalDay(start).getTime();
  const b = startOfLocalDay(end).getTime();
  const raw = Math.floor((b - a) / MS_DAY) + 1;
  return Math.max(1, raw);
}

/**
 * Avec deadline : une date cible par étape, répartie sur [start, end] selon la charge estimée.
 * Sans deadline : enchaîne des blocs calendaires `ceil((estimé / rythme) * 7)` jours.
 */
export function suggestPlannedDatesForProject(input: SuggestPlanInput): {
  dates: Map<string, Date>;
  warning?: string;
} {
  const d = clampWeeklyDedicatedDays(
    input.weeklyDedicatedDays > 0 ? input.weeklyDedicatedDays : DEFAULT_WEEKLY
  );
  const sorted = [...input.steps].sort((a, b) => a.order - b.order);
  if (sorted.length === 0) return { dates: new Map() };

  const weights = sorted.map((s) => Math.max(1, s.estimatedDays ?? DEFAULT_EST));
  const W = weights.reduce((a, b) => a + b, 0);
  const cumEnd: number[] = [];
  let c = 0;
  for (const w of weights) {
    c += w;
    cumEnd.push(c);
  }

  const start0 = startOfLocalDay(input.start);
  const dates = new Map<string, Date>();

  if (input.end && startOfLocalDay(input.end).getTime() >= start0.getTime()) {
    const spanDays = calendarDaysInclusive(input.start, input.end);
    const capacityWork = (spanDays / 7) * d;
    let warning: string | undefined;
    if (W > capacityWork * 1.02) {
      warning = `La charge estimée (~${Math.round(W)} j. de travail) dépasse ce que permettent la date de fin et ${d} j. dédiés/semaine (~${Math.round(capacityWork)} j. « absorbables » sur la période). Serrez les durées, allongez la fenêtre ou augmentez le rythme hebdomadaire.`;
    }

    const maxOffset = Math.max(0, spanDays - 1);
    let lastDue = start0;
    for (let i = 0; i < sorted.length; i++) {
      const ratio = cumEnd[i] / W;
      let offsetDays = Math.min(maxOffset, Math.round(maxOffset * ratio));
      let due = startOfLocalDay(addCalendarDays(start0, offsetDays));
      if (due.getTime() < lastDue.getTime()) due = lastDue;
      dates.set(sorted[i].id, due);
      lastDue = due;
    }

    return { dates, warning };
  }

  let pos = start0;
  for (let i = 0; i < sorted.length; i++) {
    const w = weights[i];
    const calDays = Math.max(1, Math.ceil((w / d) * 7));
    const due = addCalendarDays(pos, calDays - 1);
    dates.set(sorted[i].id, startOfLocalDay(due));
    pos = addCalendarDays(pos, calDays);
  }
  return { dates };
}

/** @deprecated Préférer suggestPlannedDatesForProject — conservé pour tests / compat. */
export function suggestPlannedDatesByOrder(steps: StepForSuggestion[], baseStart: Date): Map<string, Date> {
  return suggestPlannedDatesForProject({
    steps,
    start: baseStart,
    end: null,
    weeklyDedicatedDays: DEFAULT_WEEKLY,
  }).dates;
}
