import { notFound } from 'next/navigation';
import { requireAuth } from '@/lib/auth/utils';
import { prisma } from '@/lib/prisma/client';
import { ScrapingSourceForm } from '@/components/scraping/ScrapingSourceForm';

async function getScrapingSource(id: string, userId: string) {
  return prisma.scrapingSource.findFirst({
    where: {
      id,
      userId,
    },
  });
}

export default async function EditScrapingSourcePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const userId = await requireAuth();
  const { id } = await params;

  const source = await getScrapingSource(id, userId);

  if (!source) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Modifier la source</h1>
        <p className="text-gray-600">Modifiez les paramètres de cette source de scraping</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <ScrapingSourceForm
          mode="edit"
          initialValues={{
            id: source.id,
            name: source.name,
            type: source.type,
            url: source.url,
            selectors: source.selectors as Record<string, unknown> | null,
            apiKey: source.apiKey,
            frequency: source.frequency,
            isActive: source.isActive,
          }}
        />
      </div>
    </div>
  );
}
