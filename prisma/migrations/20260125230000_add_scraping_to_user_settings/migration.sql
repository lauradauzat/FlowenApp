-- AlterTable (Story 10.1: paramètres scraping)
ALTER TABLE "user_settings" ADD COLUMN "scraping_auto_update_enabled" BOOLEAN;
ALTER TABLE "user_settings" ADD COLUMN "scraping_default_frequency" TEXT;
