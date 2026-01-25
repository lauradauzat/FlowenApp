-- CreateEnum
CREATE TYPE "VenueStatus" AS ENUM ('ACTIVE', 'ARCHIVED', 'ERROR');

-- CreateTable
CREATE TABLE "venues" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "capacity" INTEGER,
    "style" TEXT,
    "region" TEXT,
    "website" TEXT,
    "notes" TEXT,
    "status" "VenueStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "venues_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "venues_user_id_idx" ON "venues"("user_id");

-- AddForeignKey
ALTER TABLE "venues" ADD CONSTRAINT "venues_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
