-- CreateEnum
CREATE TYPE "DataSource" AS ENUM ('SCRAPING', 'API', 'CSV', 'MANUAL');

-- AlterTable
ALTER TABLE "contacts" ADD COLUMN "data_source" "DataSource" NOT NULL DEFAULT 'MANUAL';

-- AlterTable
ALTER TABLE "venues" ADD COLUMN "data_source" "DataSource" NOT NULL DEFAULT 'MANUAL';
