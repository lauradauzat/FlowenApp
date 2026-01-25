import { z } from 'zod';

// --- Campagne ---

export const createCampaignSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(200),
  mailTemplateId: z.string().min(1, 'Le template est requis'),
  projectId: z.string().optional().nullable(),
});

export const updateCampaignSchema = z.object({
  id: z.string().min(1, "L'identifiant est requis"),
  name: z.string().min(1).max(200).optional(),
  mailTemplateId: z.string().min(1).optional(),
  projectId: z.string().optional().nullable(),
  status: z.enum(['DRAFT', 'RUNNING', 'COMPLETED', 'PAUSED']).optional(),
  // Epic 7: relances
  relanceEnabled: z.boolean().optional(),
  relanceFirstDelayDays: z.number().int().min(0).optional().nullable(),
  relanceNextDelayDays: z.number().int().min(0).optional().nullable(),
  relanceMax: z.number().int().min(1).optional().nullable(),
  relanceTemplateId: z.string().min(1).optional().nullable(),
});

export const getCampaignSchema = z.object({ id: z.string().min(1) });

export const deleteCampaignSchema = z.object({ id: z.string().min(1) });

// --- Destinataires (filtres) ---

const capacityCategorySchema = z.enum(['petite', 'moyenne', 'grande']);

export const computeRecipientsSchema = z.object({
  campaignId: z.string().min(1).optional(), // pour mise à jour; absent = prévisualisation
  region: z.array(z.string().max(200)).optional(),
  capacityCategory: z.array(capacityCategorySchema).optional(),
  style: z.array(z.string().max(200)).optional(),
  // Si fourni, on remplace la liste par ces paires (contactId, venueId)
  recipientPairs: z
    .array(z.object({ contactId: z.string(), venueId: z.string() }))
    .optional(),
});

// --- Lancement ---

export const launchCampaignSchema = z.object({
  id: z.string().min(1, "L'identifiant de la campagne est requis"),
});

// --- Réponses ---

export const createCampaignResponseSchema = z.object({
  campaignId: z.string().min(1),
  campaignRecipientId: z.string().optional().nullable(),
  contactId: z.string().min(1),
  venueId: z.string().min(1),
  type: z.enum(['POSITIVE', 'NEGATIVE', 'NEUTRAL']),
  subject: z.string().max(500).optional().nullable(),
  content: z.string().min(1, 'Le contenu est requis').max(50000),
  receivedAt: z.coerce.date(),
});

export const updateCampaignResponseSchema = z.object({
  id: z.string().min(1),
  type: z.enum(['POSITIVE', 'NEGATIVE', 'NEUTRAL']).optional(),
  content: z.string().min(1).max(50000).optional(),
  isDateObtained: z.boolean().optional(),
});

// --- Dates de tournée ---

export const createTourDateSchema = z.object({
  projectId: z.string().min(1),
  campaignId: z.string().min(1),
  campaignResponseId: z.string().optional().nullable(),
  contactId: z.string().min(1),
  venueId: z.string().min(1),
  date: z.coerce.date(),
  notes: z.string().max(2000).optional().nullable(),
});

export const deleteTourDateSchema = z.object({ id: z.string().min(1) });

// --- Réessayer envoi ---

export const retryCampaignSendSchema = z.object({
  campaignSendId: z.string().min(1),
});

// --- Epic 7: Relances manuelles ---

export const sendManualRelancesSchema = z.object({
  campaignId: z.string().min(1),
  recipientIds: z.array(z.string().min(1)).min(1, 'Au moins un destinataire'),
  templateId: z.string().min(1).optional().nullable(),
});
