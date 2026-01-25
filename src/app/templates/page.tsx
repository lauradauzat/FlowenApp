import { requireAuth } from '@/lib/auth/utils';
import Link from 'next/link';
import { getMailTemplates } from '@/actions/mailTemplateActions';
import { MailTemplateList } from '@/components/templates/MailTemplateList';

export default async function TemplatesPage() {
  await requireAuth();

  const result = await getMailTemplates();
  const templates = result.success && result.data ? result.data.templates : [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Templates de mailing</h1>
          <p className="text-gray-600 mt-1">
            Créez et gérez des modèles de mails réutilisables pour vos campagnes de booking.
          </p>
        </div>
        <Link
          href="/templates/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Créer un template
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <MailTemplateList templates={templates} />
      </div>
    </div>
  );
}
