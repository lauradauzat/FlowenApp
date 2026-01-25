-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('DRAFT', 'RUNNING', 'COMPLETED', 'PAUSED');

-- CreateEnum
CREATE TYPE "SendStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');

-- CreateEnum
CREATE TYPE "ResponseType" AS ENUM ('POSITIVE', 'NEGATIVE', 'NEUTRAL');

-- CreateTable
CREATE TABLE "campaigns" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mail_template_id" TEXT NOT NULL,
    "project_id" TEXT,
    "status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_recipients" (
    "id" TEXT NOT NULL,
    "campaign_id" TEXT NOT NULL,
    "contact_id" TEXT NOT NULL,
    "venue_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campaign_recipients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_sends" (
    "id" TEXT NOT NULL,
    "campaign_recipient_id" TEXT NOT NULL,
    "status" "SendStatus" NOT NULL DEFAULT 'PENDING',
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "sent_at" TIMESTAMP(3),
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campaign_sends_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_responses" (
    "id" TEXT NOT NULL,
    "campaign_id" TEXT NOT NULL,
    "campaign_recipient_id" TEXT,
    "contact_id" TEXT NOT NULL,
    "venue_id" TEXT NOT NULL,
    "type" "ResponseType" NOT NULL,
    "subject" TEXT,
    "content" TEXT NOT NULL,
    "received_at" TIMESTAMP(3) NOT NULL,
    "is_date_obtained" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campaign_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tour_dates" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "campaign_id" TEXT NOT NULL,
    "campaign_response_id" TEXT,
    "contact_id" TEXT NOT NULL,
    "venue_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tour_dates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "campaigns_user_id_idx" ON "campaigns"("user_id");
CREATE INDEX "campaigns_status_idx" ON "campaigns"("status");
CREATE INDEX "campaigns_mail_template_id_idx" ON "campaigns"("mail_template_id");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_recipients_campaign_id_contact_id_venue_id_key" ON "campaign_recipients"("campaign_id", "contact_id", "venue_id");
CREATE INDEX "campaign_recipients_campaign_id_idx" ON "campaign_recipients"("campaign_id");
CREATE INDEX "campaign_recipients_contact_id_idx" ON "campaign_recipients"("contact_id");
CREATE INDEX "campaign_recipients_venue_id_idx" ON "campaign_recipients"("venue_id");

-- CreateIndex
CREATE INDEX "campaign_sends_campaign_recipient_id_idx" ON "campaign_sends"("campaign_recipient_id");

-- CreateIndex
CREATE INDEX "campaign_responses_campaign_id_idx" ON "campaign_responses"("campaign_id");
CREATE INDEX "campaign_responses_contact_id_idx" ON "campaign_responses"("contact_id");
CREATE INDEX "campaign_responses_venue_id_idx" ON "campaign_responses"("venue_id");

-- CreateIndex
CREATE INDEX "tour_dates_user_id_idx" ON "tour_dates"("user_id");
CREATE INDEX "tour_dates_project_id_idx" ON "tour_dates"("project_id");
CREATE INDEX "tour_dates_campaign_id_idx" ON "tour_dates"("campaign_id");
CREATE INDEX "tour_dates_contact_id_idx" ON "tour_dates"("contact_id");
CREATE INDEX "tour_dates_venue_id_idx" ON "tour_dates"("venue_id");

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_mail_template_id_fkey" FOREIGN KEY ("mail_template_id") REFERENCES "mail_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_recipients" ADD CONSTRAINT "campaign_recipients_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "campaign_recipients" ADD CONSTRAINT "campaign_recipients_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "campaign_recipients" ADD CONSTRAINT "campaign_recipients_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "venues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_sends" ADD CONSTRAINT "campaign_sends_campaign_recipient_id_fkey" FOREIGN KEY ("campaign_recipient_id") REFERENCES "campaign_recipients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_responses" ADD CONSTRAINT "campaign_responses_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "campaign_responses" ADD CONSTRAINT "campaign_responses_campaign_recipient_id_fkey" FOREIGN KEY ("campaign_recipient_id") REFERENCES "campaign_recipients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "campaign_responses" ADD CONSTRAINT "campaign_responses_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "campaign_responses" ADD CONSTRAINT "campaign_responses_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "venues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tour_dates" ADD CONSTRAINT "tour_dates_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "tour_dates" ADD CONSTRAINT "tour_dates_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "tour_dates" ADD CONSTRAINT "tour_dates_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "tour_dates" ADD CONSTRAINT "tour_dates_campaign_response_id_fkey" FOREIGN KEY ("campaign_response_id") REFERENCES "campaign_responses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "tour_dates" ADD CONSTRAINT "tour_dates_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "tour_dates" ADD CONSTRAINT "tour_dates_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "venues"("id") ON DELETE CASCADE ON UPDATE CASCADE;
