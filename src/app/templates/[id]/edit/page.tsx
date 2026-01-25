import { requireAuth } from '@/lib/auth/utils';
import { getMailTemplate } from '@/actions/mailTemplateActions';
import { MailTemplateForm } from '@/components/templates/MailTemplateForm';
import { notFound } from 'next/navigation';

export default async function EditTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuth();

  const { id } = await params;
  const result = await getMailTemplate(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const template = result.data;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Modifier le template</h1>
      <MailTemplateForm
        mode="edit"
        initialValues={{
          id: template.id,
          name: template.name,
          subject: template.subject,
          body: template.body,
          variants: template.variants,
        }}
      />
    </div>
  );
}
