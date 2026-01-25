-- CreateTable
CREATE TABLE "contact_venues" (
    "id" TEXT NOT NULL,
    "contact_id" TEXT NOT NULL,
    "venue_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_venues_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "contact_venues_contact_id_idx" ON "contact_venues"("contact_id");

-- CreateIndex
CREATE INDEX "contact_venues_venue_id_idx" ON "contact_venues"("venue_id");

-- CreateIndex
CREATE UNIQUE INDEX "contact_venues_contact_id_venue_id_key" ON "contact_venues"("contact_id", "venue_id");

-- AddForeignKey
ALTER TABLE "contact_venues" ADD CONSTRAINT "contact_venues_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_venues" ADD CONSTRAINT "contact_venues_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "venues"("id") ON DELETE CASCADE ON UPDATE CASCADE;
