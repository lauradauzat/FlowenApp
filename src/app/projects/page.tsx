import { requireAuth } from '@/lib/auth/utils';
import { prisma } from '@/lib/prisma/client';
import Link from 'next/link';
import { ProjectType } from '@prisma/client';
import {
  calculateProjectStatus,
  calculateProjectProgress,
  getProjectStatusLabel,
  getProjectStatusBadgeClasses,
} from '@/lib/projects/projectUtils';

async function getProjects(userId: string) {
  return prisma.project.findMany({
    where: { userId },
    include: {
      steps: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

function getTypeLabel(type: ProjectType): string {
  const labels: Record<ProjectType, string> = {
    EP: 'EP',
    ALBUM: 'Album',
    TOURNEE: 'Tournée',
    SINGLE: 'Single',
  };
  return labels[type] || type;
}

export default async function ProjectsPage() {
  const userId = await requireAuth();
  const projects = await getProjects(userId);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mes projets</h1>
        <Link
          href="/projects/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Créer un nouveau projet
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Vous n&apos;avez pas encore de projet.</p>
          <Link
            href="/projects/new"
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Créer votre premier projet
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const projectStatus = calculateProjectStatus(project.steps);
            const progress = calculateProjectProgress(project.steps);
            return (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl font-semibold text-gray-900 flex-1 pr-2">
                    {project.name}
                  </h2>
                  <div className="flex flex-col gap-1 items-end">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                      {getTypeLabel(project.type)}
                    </span>
                    <span className={getProjectStatusBadgeClasses(projectStatus)}>
                      {getProjectStatusLabel(projectStatus)}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                    <span className="font-medium">Progression</span>
                    <span className="font-semibold">{progress.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    {progress.completed} sur {progress.total} étape{progress.total > 1 ? 's' : ''} complétée{progress.completed > 1 ? 's' : ''}
                  </p>
                </div>

                {(project.startDate || project.endDate) && (
                  <div className="pt-3 border-t border-gray-100">
                    {project.startDate && (
                      <p className="text-xs text-gray-500 mb-1">
                        <span className="font-medium">Début:</span>{' '}
                        {new Date(project.startDate).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    )}
                    {project.endDate && (
                      <p className="text-xs text-gray-500">
                        <span className="font-medium">Fin:</span>{' '}
                        {new Date(project.endDate).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
