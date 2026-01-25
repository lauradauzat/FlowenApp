import { z } from 'zod';

export const updateUserSettingsSchema = z.object({
  relance: z
    .object({
      firstDelayDays: z.number().int().min(0).optional().nullable(),
      nextDelayDays: z.number().int().min(0).optional().nullable(),
      max: z.number().int().min(0).optional().nullable(),
      templateId: z.string().optional().nullable(),
    })
    .optional(),
  dashboard: z
    .object({
      limitNextSteps: z.number().int().min(1).max(20).optional().nullable(),
      limitCampaigns: z.number().int().min(1).max(20).optional().nullable(),
      limitResponses: z.number().int().min(1).max(20).optional().nullable(),
      showNextSteps: z.boolean().optional().nullable(),
      showResponses: z.boolean().optional().nullable(),
      showCampaigns: z.boolean().optional().nullable(),
      showMesProjets: z.boolean().optional().nullable(),
    })
    .optional(),
  scraping: z
    .object({
      autoUpdateEnabled: z.boolean().optional().nullable(),
      defaultFrequency: z.union([z.enum(['daily', 'weekly', 'monthly']), z.literal('')]).optional().nullable(),
    })
    .optional(),
  // Story 10.3: fiches contact/venue
  fiche: z
    .object({
      contact: z
        .record(z.string(), z.object({
          visible: z.boolean(),
          required: z.boolean(),
          defaultValue: z.union([z.string(), z.number(), z.null()]).optional(),
        }))
        .optional(),
      venue: z
        .record(z.string(), z.object({
          visible: z.boolean(),
          required: z.boolean(),
          defaultValue: z.union([z.string(), z.number(), z.null()]).optional(),
        }))
        .optional(),
    })
    .optional(),
});
