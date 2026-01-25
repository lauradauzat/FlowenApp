-- CreateEnum
CREATE TYPE "ScrapingSourceType" AS ENUM ('WEBSITE', 'API', 'CUSTOM');

-- CreateTable
CREATE TABLE "scraping_sources" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ScrapingSourceType" NOT NULL,
    "url" TEXT,
    "selectors" JSONB,
    "api_key" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "frequency" TEXT,
    "last_scraped_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scraping_sources_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "scraping_sources_user_id_idx" ON "scraping_sources"("user_id");

-- CreateIndex
CREATE INDEX "scraping_sources_is_active_idx" ON "scraping_sources"("is_active");

-- AddForeignKey
ALTER TABLE "scraping_sources" ADD CONSTRAINT "scraping_sources_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
