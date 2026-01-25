-- AlterTable (Story 10.3: paramètres fiches contact/venue)
ALTER TABLE "user_settings" ADD COLUMN "fiche_contact_fields" JSONB;
ALTER TABLE "user_settings" ADD COLUMN "fiche_venue_fields" JSONB;
