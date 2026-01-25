'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCampaign } from '@/actions/campaignActions';

type Tpl = { id: string; name: string };
type Proj = { id: string; name: string };

export function CampaignNewForm({
  templates,
  projects,
}: {
  templates: Tpl[];
  projects: Proj[];
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = (formData.get('name') as string)?.trim();
    const mailTemplateId = formData.get('mailTemplateId') as string;
    const projectId = (formData.get('projectId') as string) || undefined;
    if (!name || !mailTemplateId) {
      setError('Nom et template requis.');
      setIsSubmitting(false);
      return;
    }
    const res = await createCampaign({
      name,
      mailTemplateId,
      projectId: projectId === '' ? null : projectId,
    });
    if (res.success && res.data) {
      router.push(`/campaigns/${res.data.id}`);
      router.refresh();
    } else {
      setError(!res.success && res.error?.message ? res.error.message : 'Erreur');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Nom de la campagne *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ex: Tournée octobre 2026"
        />
      </div>

      <div>
        <label htmlFor="mailTemplateId" className="block text-sm font-medium text-gray-700 mb-2">
          Template *
        </label>
        <select
          id="mailTemplateId"
          name="mailTemplateId"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">— Choisir —</option>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 mb-2">
          Projet (optionnel)
        </label>
        <select
          id="projectId"
          name="projectId"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Aucun</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500">Pour associer les dates obtenues à un projet.</p>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isSubmitting ? 'Création...' : 'Créer et configurer les destinataires'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
