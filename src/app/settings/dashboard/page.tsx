import { requireAuth } from '@/lib/auth/utils';
import { getUserSettings } from '@/actions/userSettingsActions';
import { SettingsNav } from '@/components/settings/SettingsNav';
import { DashboardSettingsForm } from '@/components/settings/DashboardSettingsForm';

export default async function DashboardSettingsPage() {
  await requireAuth();
  const settingsRes = await getUserSettings();
  const s = settingsRes.success ? settingsRes.data : null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <SettingsNav current="/settings/dashboard" />
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Paramètres du tableau de bord</h1>
        <p className="text-gray-600 text-sm">
          Choisissez les sections affichées sur la page d’accueil et le nombre d’éléments par bloc.
        </p>
      </div>
      <DashboardSettingsForm
        defaults={{
          limitNextSteps: s?.dashboardLimitNextSteps ?? 5,
          limitCampaigns: s?.dashboardLimitCampaigns ?? 5,
          limitResponses: s?.dashboardLimitResponses ?? 5,
          showNextSteps: s?.dashboardShowNextSteps ?? true,
          showResponses: s?.dashboardShowResponses ?? true,
          showCampaigns: s?.dashboardShowCampaigns ?? true,
          showMesProjets: s?.dashboardShowMesProjets ?? true,
        }}
      />
    </div>
  );
}
