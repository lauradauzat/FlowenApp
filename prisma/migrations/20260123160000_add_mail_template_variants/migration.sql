-- CreateTable
CREATE TABLE "mail_template_variants" (
    "id" TEXT NOT NULL,
    "mail_template_id" TEXT NOT NULL,
    "capacity_category" TEXT,
    "region" TEXT,
    "style" TEXT,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mail_template_variants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "mail_template_variants_mail_template_id_idx" ON "mail_template_variants"("mail_template_id");

-- AddForeignKey
ALTER TABLE "mail_template_variants" ADD CONSTRAINT "mail_template_variants_mail_template_id_fkey" FOREIGN KEY ("mail_template_id") REFERENCES "mail_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
