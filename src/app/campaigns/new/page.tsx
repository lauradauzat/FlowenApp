import { requireAuth } from '@/lib/auth/utils';
import { getMailTemplates } from '@/actions/mailTemplateActions';
import { prisma } from '@/lib/prisma/client';
import { CampaignNewForm } from '@/components/campaigns/CampaignNewForm';

export default async function NewCampaignPage() {
  const userId = await requireAuth();
  const [tplRes, projects] = await Promise.all([
    getMailTemplates(),
    prisma.project.findMany({
      where: { userId },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
  ]);
  const templates = tplRes.success && tplRes.data ? tplRes.data.templates : [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Nouvelle campagne</h1>
      <CampaignNewForm templates={templates} projects={projects} />
    </div>
  );
}
