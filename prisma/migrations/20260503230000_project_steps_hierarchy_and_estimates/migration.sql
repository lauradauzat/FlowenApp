-- AlterTable: hiérarchie étapes + durée estimée (suggestions de dates)
ALTER TABLE "project_steps" ADD COLUMN "estimated_days" INTEGER;
ALTER TABLE "project_steps" ADD COLUMN "parent_step_id" TEXT;

CREATE INDEX "project_steps_parent_step_id_idx" ON "project_steps"("parent_step_id");

ALTER TABLE "project_steps" ADD CONSTRAINT "project_steps_parent_step_id_fkey" FOREIGN KEY ("parent_step_id") REFERENCES "project_steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;
