import { requireAuth } from '@/lib/auth/utils';
import { getUserSettings } from '@/actions/userSettingsActions';
import { SettingsNav } from '@/components/settings/SettingsNav';
import { MailingSettingsForm } from '@/components/settings/MailingSettingsForm';

export default async function MailingSettingsPage() {
  await requireAuth();
  const settingsRes = await getUserSettings();
  const settings = settingsRes.success ? settingsRes.data : null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <SettingsNav current="/settings/mailing" />
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Mailing</h1>
        <p className="text-gray-600 text-sm">
          Définissez l’expéditeur utilisé pour les envois de campagnes et les relances automatiques (via Resend).
        </p>
      </div>
      <MailingSettingsForm defaults={{ mailingFrom: settings?.mailingFrom ?? '' }} />
    </div>
  );
}
