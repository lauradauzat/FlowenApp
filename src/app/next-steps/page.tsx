import { requireAuth } from '@/lib/auth/utils';
import { prisma } from '@/lib/prisma/client';
import Link from 'next/link';
import { getNextSteps } from '@/lib/projects/projectUtils';

async function getUserProjects(userId: string) {
  return prisma.project.findMany({
    where: { userId },
    include: {
      steps: {
        orderBy: {
          order: 'asc',
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

function formatDate(date: Date | null): string {
  if (!date) return 'Pas de date prévue';
  
  const now = new Date();
  const stepDate = new Date(date);
  const diffDays = Math.floor((stepDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return `${Math.abs(diffDays)} jour${Math.abs(diffDays) > 1 ? 's' : ''} de retard`;
  } else if (diffDays === 0) {
    return 'Aujourd\'hui';
  } else if (diffDays === 1) {
    return 'Demain';
  } else if (diffDays <= 7) {
    return `Dans ${diffDays} jours`;
  } else {
    return stepDate.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
}

export default async function NextStepsPage() {
  const userId = await requireAuth();
  const projects = await getUserProjects(userId);
  const nextSteps = getNextSteps(projects);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Prochaines étapes</h1>
        <p className="text-gray-600">
          {nextSteps.length === 0
            ? 'Aucune étape à accomplir'
            : `${nextSteps.length} étape${nextSteps.length > 1 ? 's' : ''} à accomplir`}
        </p>
      </div>

      {nextSteps.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-gray-500 mb-4">Toutes vos étapes sont complétées ! 🎉</p>
          <Link
            href="/projects"
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Voir mes projets
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {nextSteps.map((nextStep) => {
            const step = nextStep.step;
            const project = step.project;
            const isOverdue = step.plannedDate && new Date(step.plannedDate) < new Date();

            return (
              <Link
                key={step.id}
                href={`/projects/${project.id}`}
                className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{step.name}</h3>
                      <span className="text-xs text-gray-500">#{step.order}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Projet: <span className="font-medium">{project.name}</span>
                    </p>
                    <div className="flex items-center gap-4 text-xs">
                      <span className={`${isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                        📅 {formatDate(step.plannedDate)}
                        {isOverdue && ' ⚠️'}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          step.status === 'IN_PROGRESS'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {step.status === 'IN_PROGRESS' ? 'En cours' : 'À faire'}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 text-gray-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
