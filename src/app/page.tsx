import { getUserId } from '@/lib/auth/utils';
import { prisma } from '@/lib/prisma/client';
import Link from 'next/link';
import { getNextSteps } from '@/lib/projects/projectUtils';
import { redirect } from 'next/navigation';

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
  if (!date) return 'Pas de date';
  
  const now = new Date();
  const stepDate = new Date(date);
  const diffDays = Math.floor((stepDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return `${Math.abs(diffDays)}j de retard`;
  } else if (diffDays === 0) {
    return 'Aujourd\'hui';
  } else if (diffDays === 1) {
    return 'Demain';
  } else if (diffDays <= 7) {
    return `Dans ${diffDays}j`;
  } else {
    return stepDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  }
}

export default async function Home() {
  const userId = await getUserId();
  
  // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  if (!userId) {
    redirect('/login');
  }
  
  const projects = await getUserProjects(userId);
  const nextSteps = getNextSteps(projects);
  const topNextSteps = nextSteps.slice(0, 5); // Top 5 des prochaines étapes

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tableau de bord</h1>
        <p className="text-gray-600">Bienvenue sur Flowen App</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section Prochaines étapes */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Prochaines étapes</h2>
              {nextSteps.length > 5 && (
                <Link
                  href="/next-steps"
                  className="text-sm text-blue-600 hover:text-blue-700 underline"
                >
                  Voir tout ({nextSteps.length})
                </Link>
              )}
            </div>

            {topNextSteps.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Toutes vos étapes sont complétées ! 🎉</p>
                <Link
                  href="/projects"
                  className="text-blue-600 hover:text-blue-700 underline mt-2 inline-block"
                >
                  Voir mes projets
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {topNextSteps.map((nextStep) => {
                  const step = nextStep.step;
                  const project = step.project;
                  const isOverdue = step.plannedDate && new Date(step.plannedDate) < new Date();

                  return (
                    <Link
                      key={step.id}
                      href={`/projects/${project.id}`}
                      className="block p-3 border border-gray-200 rounded hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{step.name}</span>
                            <span className="text-xs text-gray-500">#{step.order}</span>
                          </div>
                          <p className="text-xs text-gray-600 mb-1">
                            {project.name}
                          </p>
                          <div className="flex items-center gap-2 text-xs">
                            <span className={isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'}>
                              📅 {formatDate(step.plannedDate)}
                              {isOverdue && ' ⚠️'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {nextSteps.length > 5 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link
                  href="/next-steps"
                  className="block text-center text-sm text-blue-600 hover:text-blue-700 underline"
                >
                  Voir toutes les prochaines étapes ({nextSteps.length})
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Section Actions rapides */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Actions rapides</h2>
            <div className="space-y-3">
              <Link
                href="/projects/new"
                className="block w-full px-4 py-2 bg-blue-600 text-white text-center rounded-md hover:bg-blue-700 transition-colors"
              >
                Créer un projet
              </Link>
              <Link
                href="/projects"
                className="block w-full px-4 py-2 bg-gray-100 text-gray-700 text-center rounded-md hover:bg-gray-200 transition-colors"
              >
                Voir mes projets
              </Link>
              <Link
                href="/next-steps"
                className="block w-full px-4 py-2 bg-gray-100 text-gray-700 text-center rounded-md hover:bg-gray-200 transition-colors"
              >
                Prochaines étapes
              </Link>
            </div>
          </div>

          {/* Statistiques rapides */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Statistiques</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Projets actifs</span>
                <span className="font-semibold">{projects.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Étapes à faire</span>
                <span className="font-semibold">{nextSteps.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
