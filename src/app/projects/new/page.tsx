import { requireAuth } from '@/lib/auth/utils';
import { CreateProjectForm } from '@/components/projects/CreateProjectForm';

export default async function NewProjectPage() {
  // Vérifier l'authentification (redirige si non authentifié)
  await requireAuth();

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Créer un nouveau projet</h1>
      <CreateProjectForm />
    </div>
  );
}
