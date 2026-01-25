import { requireAuth } from '@/lib/auth/utils';
import { getUserSettings } from '@/actions/userSettingsActions';
import { getMailTemplates } from '@/actions/mailTemplateActions';
import { SettingsNav } from '@/components/settings/SettingsNav';
import { RelancesSettingsForm } from '@/components/settings/RelancesSettingsForm';

export default async function RelancesSettingsPage() {
  await requireAuth();
  const [settingsRes, templatesRes] = await Promise.all([
    getUserSettings(),
    getMailTemplates(),
  ]);

  const settings = settingsRes.success ? settingsRes.data : null;
  const templates = templatesRes.success && templatesRes.data
    ? templatesRes.data.templates.map((t) => ({ id: t.id, name: t.name }))
    : [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <SettingsNav current="/settings/relances" />
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Paramètres de relances</h1>
        <p className="text-gray-600 text-sm">
          Valeurs par défaut utilisées pour les nouvelles campagnes quand vous activez les relances. Chaque campagne peut les surcharger.
        </p>
      </div>
      <RelancesSettingsForm
        defaults={{
          firstDelayDays: settings?.relanceFirstDelayDays ?? '',
          nextDelayDays: settings?.relanceNextDelayDays ?? '',
          max: settings?.relanceMax ?? '',
          templateId: settings?.relanceTemplateId ?? '',
        }}
        templates={templates}
      />
    </div>
  );
}
