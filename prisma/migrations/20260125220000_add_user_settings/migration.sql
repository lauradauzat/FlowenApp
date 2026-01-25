-- CreateTable
CREATE TABLE "user_settings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "relance_first_delay_days" INTEGER,
    "relance_next_delay_days" INTEGER,
    "relance_max" INTEGER,
    "relance_template_id" TEXT,
    "dashboard_limit_next_steps" INTEGER,
    "dashboard_limit_campaigns" INTEGER,
    "dashboard_limit_responses" INTEGER,
    "dashboard_show_next_steps" BOOLEAN,
    "dashboard_show_responses" BOOLEAN,
    "dashboard_show_campaigns" BOOLEAN,
    "dashboard_show_mes_projets" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_settings_user_id_key" ON "user_settings"("user_id");

-- AddForeignKey
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
