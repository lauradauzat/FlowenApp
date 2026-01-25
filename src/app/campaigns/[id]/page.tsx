import Link from 'next/link';
import { requireAuth } from '@/lib/auth/utils';
import { getCampaign, getCampaignFilterOptions, getCampaignSends } from '@/actions/campaignActions';
import { getMailTemplates } from '@/actions/mailTemplateActions';
import { getUserSettings } from '@/actions/userSettingsActions';
import { notFound } from 'next/navigation';
import { CampaignDetail } from '@/components/campaigns/CampaignDetail';

export default async function CampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuth();
  const { id } = await params;
  const [campRes, optsRes, templatesRes, settingsRes] = await Promise.all([
    getCampaign(id),
    getCampaignFilterOptions(),
    getMailTemplates(),
    getUserSettings(),
  ]);

  if (!campRes.success || !campRes.data) notFound();
  const campaign = campRes.data;
  const filterOptions = optsRes.success ? optsRes.data : { regions: [], styles: [] };
  const mailTemplates = templatesRes.success && templatesRes.data ? templatesRes.data.templates.map((t) => ({ id: t.id, name: t.name })) : [];
  const settings = settingsRes.success ? settingsRes.data : null;
  const relanceDefaults = settings
    ? {
        firstDelayDays: settings.relanceFirstDelayDays,
        nextDelayDays: settings.relanceNextDelayDays,
        max: settings.relanceMax,
        templateId: settings.relanceTemplateId,
      }
    : undefined;

  type SendsData = Extract<Awaited<ReturnType<typeof getCampaignSends>>, { success: true }>['data'];
  let sends: SendsData | undefined = undefined;
  if (campaign.status !== 'DRAFT') {
    const s = await getCampaignSends(id);
    if (s.success && s.data) sends = s.data;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <p className="mb-4">
        <Link href="/campaigns" className="text-blue-600 hover:underline">
          ← Campagnes
        </Link>
      </p>
      <CampaignDetail
        campaign={campaign}
        filterOptions={filterOptions}
        initialSends={sends}
        mailTemplates={mailTemplates}
        relanceDefaults={relanceDefaults}
      />
    </div>
  );
}
