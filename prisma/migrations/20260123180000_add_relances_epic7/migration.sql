-- Epic 7: Relances automatiques
-- Campaign: paramètres relance
ALTER TABLE "campaigns" ADD COLUMN "relance_enabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "campaigns" ADD COLUMN "relance_first_delay_days" INTEGER;
ALTER TABLE "campaigns" ADD COLUMN "relance_next_delay_days" INTEGER;
ALTER TABLE "campaigns" ADD COLUMN "relance_max" INTEGER;
ALTER TABLE "campaigns" ADD COLUMN "relance_template_id" TEXT;

-- CampaignSend: send_order (0 = envoi initial, 1+ = relance). DEFAULT 0 backfill les existants.
ALTER TABLE "campaign_sends" ADD COLUMN "send_order" INTEGER NOT NULL DEFAULT 0;

-- Index et FK pour relance_template_id
CREATE INDEX "campaigns_relance_template_id_idx" ON "campaigns"("relance_template_id");
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_relance_template_id_fkey" FOREIGN KEY ("relance_template_id") REFERENCES "mail_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;
