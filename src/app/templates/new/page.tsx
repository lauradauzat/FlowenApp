import { requireAuth } from '@/lib/auth/utils';
import { MailTemplateForm } from '@/components/templates/MailTemplateForm';

export default async function NewTemplatePage() {
  await requireAuth();

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Créer un template de mailing</h1>
      <MailTemplateForm mode="create" />
    </div>
  );
}
