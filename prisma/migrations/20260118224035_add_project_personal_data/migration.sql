-- CreateTable
CREATE TABLE "project_personal_data" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "bio" TEXT,
    "photos" TEXT[],
    "videos" TEXT[],
    "socialLinks" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_personal_data_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "project_personal_data_project_id_key" ON "project_personal_data"("project_id");

-- CreateIndex
CREATE INDEX "project_personal_data_project_id_idx" ON "project_personal_data"("project_id");

-- AddForeignKey
ALTER TABLE "project_personal_data" ADD CONSTRAINT "project_personal_data_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
