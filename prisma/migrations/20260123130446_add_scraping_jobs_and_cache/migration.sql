-- CreateEnum
CREATE TYPE "ScrapingJobType" AS ENUM ('VENUES', 'CONTACTS');

-- CreateEnum
CREATE TYPE "ScrapingJobStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "scraping_jobs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "source_id" TEXT,
    "type" "ScrapingJobType" NOT NULL,
    "status" "ScrapingJobStatus" NOT NULL DEFAULT 'PENDING',
    "result_count" INTEGER,
    "error_message" TEXT,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scraping_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public_venue_cache" (
    "id" TEXT NOT NULL,
    "source_id" TEXT NOT NULL,
    "source_url" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "public_venue_cache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "scraping_jobs_user_id_idx" ON "scraping_jobs"("user_id");

-- CreateIndex
CREATE INDEX "scraping_jobs_status_idx" ON "scraping_jobs"("status");

-- CreateIndex
CREATE INDEX "scraping_jobs_source_id_idx" ON "scraping_jobs"("source_id");

-- CreateIndex
CREATE INDEX "public_venue_cache_source_id_idx" ON "public_venue_cache"("source_id");

-- CreateIndex
CREATE INDEX "public_venue_cache_expires_at_idx" ON "public_venue_cache"("expires_at");

-- AddForeignKey
ALTER TABLE "scraping_jobs" ADD CONSTRAINT "scraping_jobs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scraping_jobs" ADD CONSTRAINT "scraping_jobs_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "scraping_sources"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public_venue_cache" ADD CONSTRAINT "public_venue_cache_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "scraping_sources"("id") ON DELETE CASCADE ON UPDATE CASCADE;
