import { requireAuth } from '@/lib/auth/utils';
import { ContactForm } from '@/components/contacts/ContactForm';

export default async function NewContactPage() {
  await requireAuth();

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Créer un nouveau contact</h1>
      <ContactForm mode="create" />
    </div>
  );
}

