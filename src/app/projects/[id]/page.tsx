import { notFound } from 'next/navigation';
import { requireAuth } from '@/lib/auth/utils';
import { prisma } from '@/lib/prisma/client';
import { StepCard } from '@/components/projects/StepCard';
import { PersonalDataForm } from '@/components/projects/PersonalDataForm';
import { ProjectTimeline } from '@/components/projects/ProjectTimeline';
import {
  calculateProjectStatus,
  calculateProjectProgress,
  getProjectStatusLabel,
  getProjectStatusBadgeClasses,
} from '@/lib/projects/projectUtils';

async function getProject(projectId: string, userId: string) {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId, // Multi-tenancy : filtrer par userId
    },
    include: {
      steps: {
        orderBy: {
          order: 'asc',
        },
      },
      personalData: true,
    },
  });

  return project;
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const userId = await requireAuth();
  const { id } = await params;
  const project = await getProject(id, userId);

  if (!project) {
    notFound();
  }

  const projectStatus = calculateProjectStatus(project.steps);
  const progress = calculateProjectProgress(project.steps);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
            <p className="text-gray-600">Type: {project.type}</p>
          </div>
          <span className={getProjectStatusBadgeClasses(projectStatus)}>
            {getProjectStatusLabel(projectStatus)}
          </span>
        </div>

        {/* Visualisation de la progression */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Progression du projet</h2>
              <p className="text-sm text-gray-600">
                {progress.completed} sur {progress.total} étape{progress.total > 1 ? 's' : ''} complétée{progress.completed > 1 ? 's' : ''}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{progress.percentage}%</div>
              <div className="text-xs text-gray-600">complété</div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
              style={{ width: `${progress.percentage}%` }}
            >
              {progress.percentage > 10 && (
                <span className="text-xs font-medium text-white">
                  {progress.percentage}%
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-4 text-xs text-gray-600 mt-3">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>{project.steps.filter((s) => s.status === 'COMPLETED').length} terminée{project.steps.filter((s) => s.status === 'COMPLETED').length > 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>{project.steps.filter((s) => s.status === 'IN_PROGRESS').length} en cours</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-gray-300" />
              <span>{project.steps.filter((s) => s.status === 'TODO').length} à faire</span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline visuelle */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-6">Timeline du projet</h2>
        <ProjectTimeline
          steps={project.steps}
          startDate={project.startDate}
          endDate={project.endDate}
        />
      </div>

      {/* Liste des étapes avec actions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Gérer les étapes</h2>
        <div className="space-y-3">
          {project.steps.map((step) => (
            <StepCard key={step.id} step={step} />
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Données personnelles</h2>
        <p className="text-sm text-gray-600 mb-4">
          Ajoutez vos informations pour les campagnes de booking et la communication.
        </p>
        <PersonalDataForm
          projectId={project.id}
          initialData={
            project.personalData
              ? {
                  bio: project.personalData.bio,
                  photos: project.personalData.photos,
                  videos: project.personalData.videos,
                  socialLinks:
                    project.personalData.socialLinks &&
                    typeof project.personalData.socialLinks === 'object' &&
                    !Array.isArray(project.personalData.socialLinks)
                      ? (project.personalData.socialLinks as { [key: string]: unknown })
                      : null,
                }
              : undefined
          }
        />
      </div>
    </div>
  );
}
