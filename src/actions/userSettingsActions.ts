'use server';

import type { FicheFieldConfig } from '@/lib/ficheFields';
import { prisma } from '@/lib/prisma/client';
import { requireAuth } from '@/lib/auth/utils';
import { updateUserSettingsSchema } from '@/lib/validations/userSettings';

type ActionResult<T> = {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
};

export type UserSettingsData = {
  relanceFirstDelayDays: number | null;
  relanceNextDelayDays: number | null;
  relanceMax: number | null;
  relanceTemplateId: string | null;
  dashboardLimitNextSteps: number;
  dashboardLimitCampaigns: number;
  dashboardLimitResponses: number;
  dashboardShowNextSteps: boolean;
  dashboardShowResponses: boolean;
  dashboardShowCampaigns: boolean;
  dashboardShowMesProjets: boolean;
  scrapingAutoUpdateEnabled: boolean;
  scrapingDefaultFrequency: string | null;
  /** Story 10.3: config champs fiche contact (clé = fieldKey) */
  ficheContactFields: Record<string, FicheFieldConfig> | null;
  /** Story 10.3: config champs fiche venue */
  ficheVenueFields: Record<string, FicheFieldConfig> | null;
};

const DEFAULTS: UserSettingsData = {
  relanceFirstDelayDays: null,
  relanceNextDelayDays: null,
  relanceMax: null,
  relanceTemplateId: null,
  dashboardLimitNextSteps: 5,
  dashboardLimitCampaigns: 5,
  dashboardLimitResponses: 5,
  dashboardShowNextSteps: true,
  dashboardShowResponses: true,
  dashboardShowCampaigns: true,
  dashboardShowMesProjets: true,
  scrapingAutoUpdateEnabled: true,
  scrapingDefaultFrequency: null,
  ficheContactFields: null,
  ficheVenueFields: null,
};

function toFicheFields(value: unknown): Record<string, FicheFieldConfig> | null {
  if (value == null) return null;
  if (typeof value !== 'object' || Array.isArray(value)) return null;
  return value as Record<string, FicheFieldConfig>;
}

function toData(row: {
  relanceFirstDelayDays: number | null;
  relanceNextDelayDays: number | null;
  relanceMax: number | null;
  relanceTemplateId: string | null;
  dashboardLimitNextSteps: number | null;
  dashboardLimitCampaigns: number | null;
  dashboardLimitResponses: number | null;
  dashboardShowNextSteps: boolean | null;
  dashboardShowResponses: boolean | null;
  dashboardShowCampaigns: boolean | null;
  dashboardShowMesProjets: boolean | null;
  scrapingAutoUpdateEnabled: boolean | null;
  scrapingDefaultFrequency: string | null;
  ficheContactFields?: unknown;
  ficheVenueFields?: unknown;
} | null): UserSettingsData {
  if (!row) return DEFAULTS;
  return {
    relanceFirstDelayDays: row.relanceFirstDelayDays,
    relanceNextDelayDays: row.relanceNextDelayDays,
    relanceMax: row.relanceMax,
    relanceTemplateId: row.relanceTemplateId,
    dashboardLimitNextSteps: row.dashboardLimitNextSteps ?? DEFAULTS.dashboardLimitNextSteps,
    dashboardLimitCampaigns: row.dashboardLimitCampaigns ?? DEFAULTS.dashboardLimitCampaigns,
    dashboardLimitResponses: row.dashboardLimitResponses ?? DEFAULTS.dashboardLimitResponses,
    dashboardShowNextSteps: row.dashboardShowNextSteps ?? DEFAULTS.dashboardShowNextSteps,
    dashboardShowResponses: row.dashboardShowResponses ?? DEFAULTS.dashboardShowResponses,
    dashboardShowCampaigns: row.dashboardShowCampaigns ?? DEFAULTS.dashboardShowCampaigns,
    dashboardShowMesProjets: row.dashboardShowMesProjets ?? DEFAULTS.dashboardShowMesProjets,
    scrapingAutoUpdateEnabled: row.scrapingAutoUpdateEnabled ?? DEFAULTS.scrapingAutoUpdateEnabled,
    scrapingDefaultFrequency: row.scrapingDefaultFrequency ?? DEFAULTS.scrapingDefaultFrequency,
    ficheContactFields: toFicheFields(row.ficheContactFields),
    ficheVenueFields: toFicheFields(row.ficheVenueFields),
  };
}

export async function getUserSettings(): Promise<ActionResult<UserSettingsData>> {
  try {
    const userId = await requireAuth();
    const row = await prisma.userSettings.findUnique({
      where: { userId },
    });
    return { success: true, data: toData(row) };
  } catch (e) {
    console.error('getUserSettings:', e);
    return { success: false, error: { code: 'ERROR', message: 'Impossible de charger les paramètres' } };
  }
}

export async function updateUserSettings(input: unknown): Promise<ActionResult<void>> {
  try {
    const userId = await requireAuth();
    const parsed = updateUserSettingsSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: { code: 'VALIDATION_ERROR', message: parsed.error.message } };
    }

    const rel = parsed.data.relance;
    const dash = parsed.data.dashboard;
    const scrap = parsed.data.scraping;
    const fiche = parsed.data.fiche;

    const data: Record<string, unknown> = {};
    if (fiche) {
      if (fiche.contact !== undefined) data.ficheContactFields = fiche.contact;
      if (fiche.venue !== undefined) data.ficheVenueFields = fiche.venue;
    }
    if (rel) {
      if (rel.firstDelayDays !== undefined) data.relanceFirstDelayDays = rel.firstDelayDays;
      if (rel.nextDelayDays !== undefined) data.relanceNextDelayDays = rel.nextDelayDays;
      if (rel.max !== undefined) data.relanceMax = rel.max;
      if (rel.templateId !== undefined) data.relanceTemplateId = rel.templateId || null;
    }
    if (dash) {
      if (dash.limitNextSteps !== undefined) data.dashboardLimitNextSteps = dash.limitNextSteps;
      if (dash.limitCampaigns !== undefined) data.dashboardLimitCampaigns = dash.limitCampaigns;
      if (dash.limitResponses !== undefined) data.dashboardLimitResponses = dash.limitResponses;
      if (dash.showNextSteps !== undefined) data.dashboardShowNextSteps = dash.showNextSteps;
      if (dash.showResponses !== undefined) data.dashboardShowResponses = dash.showResponses;
      if (dash.showCampaigns !== undefined) data.dashboardShowCampaigns = dash.showCampaigns;
      if (dash.showMesProjets !== undefined) data.dashboardShowMesProjets = dash.showMesProjets;
    }
    if (scrap) {
      if (scrap.autoUpdateEnabled !== undefined) data.scrapingAutoUpdateEnabled = scrap.autoUpdateEnabled;
      if (scrap.defaultFrequency !== undefined) data.scrapingDefaultFrequency = scrap.defaultFrequency === '' ? null : (scrap.defaultFrequency || null);
    }

    if (Object.keys(data).length === 0) {
      return { success: true };
    }

    await prisma.userSettings.upsert({
      where: { userId },
      create: { userId, ...(data as object) },
      update: data as object,
    });
    return { success: true };
  } catch (e) {
    console.error('updateUserSettings:', e);
    return { success: false, error: { code: 'ERROR', message: 'Impossible d’enregistrer les paramètres' } };
  }
}
