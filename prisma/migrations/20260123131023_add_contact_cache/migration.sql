-- CreateTable
CREATE TABLE "public_contact_cache" (
    "id" TEXT NOT NULL,
    "source_id" TEXT NOT NULL,
    "source_url" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "public_contact_cache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "public_contact_cache_source_id_idx" ON "public_contact_cache"("source_id");

-- CreateIndex
CREATE INDEX "public_contact_cache_expires_at_idx" ON "public_contact_cache"("expires_at");

-- AddForeignKey
ALTER TABLE "public_contact_cache" ADD CONSTRAINT "public_contact_cache_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "scraping_sources"("id") ON DELETE CASCADE ON UPDATE CASCADE;
