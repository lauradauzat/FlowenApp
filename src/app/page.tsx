import { getUserId } from '@/lib/auth/utils';
import { prisma } from '@/lib/prisma/client';
import Link from 'next/link';
import { getNextSteps } from '@/lib/projects/projectUtils';
import { redirect } from 'next/navigation';
import { getDashboardCampaigns, getRecentResponses } from '@/actions/campaignActions';
import { getUserSettings } from '@/actions/userSettingsActions';
import { RefreshDashboardButton } from '@/components/dashboard/RefreshDashboardButton';

const PROJECT_TYPE_LABELS: Record<string, string> = { EP: 'EP', ALBUM: 'Album', TOURNEE: 'Tournée', SINGLE: 'Single' };

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

  const settingsRes = await getUserSettings();
  const dash = settingsRes.success ? settingsRes.data : null;
  const limitNextSteps = dash?.dashboardLimitNextSteps ?? 5;
  const limitCampaigns = dash?.dashboardLimitCampaigns ?? 5;
  const limitResponses = dash?.dashboardLimitResponses ?? 5;
  const showNextSteps = dash?.dashboardShowNextSteps ?? true;
  const showResponses = dash?.dashboardShowResponses ?? true;
  const showCampaigns = dash?.dashboardShowCampaigns ?? true;
  const showMesProjets = dash?.dashboardShowMesProjets ?? true;
  
  const [projects, campaignsRes, responsesRes] = await Promise.all([
    getUserProjects(userId),
    getDashboardCampaigns(limitCampaigns),
    getRecentResponses(limitResponses),
  ]);
  const nextSteps = getNextSteps(projects);
  const topNextSteps = nextSteps.slice(0, limitNextSteps);
  const dashboardCampaigns = campaignsRes.success ? campaignsRes.data : [];
  const recentResponses = responsesRes.success ? responsesRes.data : [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tableau de bord</h1>
          <p className="text-gray-600">Bienvenue sur Flowen App</p>
        </div>
        <RefreshDashboardButton />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section Prochaines étapes (config: dashboardShowNextSteps, dashboardLimitNextSteps) */}
        <div className="lg:col-span-2">
          {showNextSteps && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Prochaines étapes</h2>
                {nextSteps.length > limitNextSteps && (
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

              {nextSteps.length > limitNextSteps && (
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
          )}

          {/* Epic 8 Story 8.4: Nouvelles réponses (config: dashboardShowResponses, dashboardLimitResponses) */}
          {showResponses && recentResponses.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Nouvelles réponses</h2>
                <Link href="/campaigns" className="text-sm text-blue-600 hover:text-blue-700 underline">
                  Voir les campagnes
                </Link>
              </div>
              <div className="space-y-3">
                {recentResponses.map((r) => (
                  <Link
                    key={r.id}
                    href={`/campaigns/${r.campaignId}`}
                    className="block p-3 border border-gray-200 rounded hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-sm">{r.contactName} — {r.venueName}</span>
                      <span className={`px-1.5 py-0.5 rounded text-xs ${
                        r.type === 'POSITIVE' ? 'bg-green-100 text-green-800' : r.type === 'NEGATIVE' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {r.type === 'POSITIVE' ? 'Positif' : r.type === 'NEGATIVE' ? 'Négatif' : 'Neutre'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {r.campaignName} · {r.receivedAt.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {r.isDateObtained && <span className="text-green-600 ml-1">✓ Date obtenue</span>}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Epic 8 Story 8.3: Campagnes en cours (config: dashboardShowCampaigns, dashboardLimitCampaigns) */}
          {showCampaigns && dashboardCampaigns.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Campagnes en cours</h2>
                <Link href="/campaigns" className="text-sm text-blue-600 hover:text-blue-700 underline">
                  Voir tout
                </Link>
              </div>
              <div className="space-y-3">
                {dashboardCampaigns.map((c) => (
                  <Link
                    key={c.id}
                    href={`/campaigns/${c.id}`}
                    className="block p-3 border border-gray-200 rounded hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-medium text-sm">{c.name}</span>
                        <span className={`ml-2 px-1.5 py-0.5 rounded text-xs ${
                          c.status === 'RUNNING' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {c.status === 'RUNNING' ? 'En cours' : 'Terminée'}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Envois: {c.stats.sent}/{c.stats.total} · Réponses: {c.stats.responses}
                      {c.stats.failed > 0 && <span className="text-red-600"> · {c.stats.failed} échec{c.stats.failed > 1 ? 's' : ''}</span>}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Section Mes projets (8.1) + Actions rapides + Statistiques (config: dashboardShowMesProjets) */}
        <div className="space-y-6">
          {/* Story 8.1: Vue d'ensemble projets */}
          {showMesProjets && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Mes projets</h2>
                {projects.length > 0 && (
                  <Link href="/projects" className="text-sm text-blue-600 hover:text-blue-700 underline">
                    Voir tout
                  </Link>
                )}
              </div>
              {projects.length === 0 ? (
                <p className="text-sm text-gray-500 mb-3">Aucun projet</p>
              ) : (
                <div className="space-y-2">
                  {projects.slice(0, 3).map((p) => (
                    <Link
                      key={p.id}
                      href={`/projects/${p.id}`}
                      className="block p-2 border border-gray-100 rounded hover:border-blue-200 hover:bg-blue-50/50 transition-colors"
                    >
                      <span className="font-medium text-sm">{p.name}</span>
                      <span className="ml-2 text-xs text-gray-500">{PROJECT_TYPE_LABELS[p.type] ?? p.type}</span>
                    </Link>
                  ))}
                </div>
              )}
              {projects.length === 0 && (
                <Link href="/projects/new" className="text-sm text-blue-600 hover:text-blue-700 underline">
                  Créer un projet
                </Link>
              )}
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Actions rapides</h2>
            <div className="space-y-3">
              <Link
                href="/projects/new"
                className="block w-full px-4 py-2 bg-blue-600 text-white text-center rounded-md hover:bg-blue-700 transition-colors"
              >
                Créer un projet
              </Link>
              <Link
                href="/campaigns/new"
                className="block w-full px-4 py-2 bg-blue-600 text-white text-center rounded-md hover:bg-blue-700 transition-colors"
              >
                Nouvelle campagne
              </Link>
              <Link
                href="/projects"
                className="block w-full px-4 py-2 bg-gray-100 text-gray-700 text-center rounded-md hover:bg-gray-200 transition-colors"
              >
                Voir mes projets
              </Link>
              <Link
                href="/campaigns"
                className="block w-full px-4 py-2 bg-gray-100 text-gray-700 text-center rounded-md hover:bg-gray-200 transition-colors"
              >
                Voir les campagnes
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
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
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
              <div className="flex justify-between">
                <span className="text-gray-600">Campagnes en cours</span>
                <span className="font-semibold">{dashboardCampaigns.filter((c) => c.status === 'RUNNING').length}</span>
              </div>
              {recentResponses.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Dernières réponses</span>
                  <span className="font-semibold">{recentResponses.length}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
