import { describe, it, expect } from 'vitest';
import {
  suggestPlannedDatesByOrder,
  suggestPlannedDatesForProject,
  calendarDaysInclusive,
  clampWeeklyDedicatedDays,
} from '@/lib/projects/suggestStepDates';

describe('clampWeeklyDedicatedDays', () => {
  it('borne entre 0,5 et 7', () => {
    expect(clampWeeklyDedicatedDays(0)).toBe(0.5);
    expect(clampWeeklyDedicatedDays(10)).toBe(7);
    expect(clampWeeklyDedicatedDays(3)).toBe(3);
  });
});

describe('calendarDaysInclusive', () => {
  it('compte les jours calendaires inclus', () => {
    expect(
      calendarDaysInclusive(new Date('2026-06-01'), new Date('2026-06-01'))
    ).toBe(1);
    expect(
      calendarDaysInclusive(new Date('2026-06-01'), new Date('2026-06-10'))
    ).toBe(10);
  });
});

describe('suggestPlannedDatesByOrder (sans date de fin)', () => {
  it('étale les étapes selon durées estimées et rythme hebdo par défaut (3 j./sem.)', () => {
    const base = new Date('2026-06-01T12:00:00');
    const map = suggestPlannedDatesByOrder(
      [
        { id: 'a', order: 1, estimatedDays: 2 },
        { id: 'b', order: 2, estimatedDays: 3 },
      ],
      base
    );
    // ceil(2/3*7)=5 j. cal. → échéance jour 5 ; puis ceil(3/3*7)=7
    expect(map.get('a')?.toDateString()).toBe(new Date('2026-06-05').toDateString());
    expect(map.get('b')?.toDateString()).toBe(new Date('2026-06-12').toDateString());
  });

  it('utilise 3 jours par défaut si durée absente', () => {
    const base = new Date('2026-01-10');
    const map = suggestPlannedDatesByOrder([{ id: 'x', order: 1, estimatedDays: null }], base);
    const d = map.get('x');
    expect(d).toBeDefined();
    expect(d?.toDateString()).toBe(new Date('2026-01-16').toDateString());
  });
});

describe('suggestPlannedDatesForProject (avec date de fin)', () => {
  it('répartit proportionnellement sur la fenêtre', () => {
    const { dates, warning } = suggestPlannedDatesForProject({
      steps: [
        { id: 'a', order: 1, estimatedDays: 1 },
        { id: 'b', order: 2, estimatedDays: 1 },
        { id: 'c', order: 3, estimatedDays: 1 },
      ],
      start: new Date('2026-06-01'),
      end: new Date('2026-06-10'),
      weeklyDedicatedDays: 3,
    });
    expect(warning).toBeUndefined();
    expect(dates.get('a')?.toDateString()).toBe(new Date('2026-06-04').toDateString());
    expect(dates.get('b')?.toDateString()).toBe(new Date('2026-06-07').toDateString());
    expect(dates.get('c')?.toDateString()).toBe(new Date('2026-06-10').toDateString());
  });

  it('garde des dates d’échéance non décroissantes', () => {
    const { dates } = suggestPlannedDatesForProject({
      steps: [
        { id: 'a', order: 1, estimatedDays: 1 },
        { id: 'b', order: 2, estimatedDays: 1 },
      ],
      start: new Date('2026-01-01'),
      end: new Date('2026-01-02'),
      weeklyDedicatedDays: 7,
    });
    const da = dates.get('a')!.getTime();
    const db = dates.get('b')!.getTime();
    expect(db).toBeGreaterThanOrEqual(da);
  });

  it('signale une surcharge si la charge dépasse la capacité estimée', () => {
    const steps = Array.from({ length: 8 }, (_, i) => ({
      id: `s${i}`,
      order: i + 1,
      estimatedDays: 10,
    }));
    const { warning } = suggestPlannedDatesForProject({
      steps,
      start: new Date('2026-03-01'),
      end: new Date('2026-03-07'),
      weeklyDedicatedDays: 1,
    });
    expect(warning).toBeDefined();
    expect(warning).toMatch(/charge estimée/i);
  });
});
