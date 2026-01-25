import { StepStatus } from '@prisma/client';

export type ProjectStatus = 'en_attente' | 'en_cours' | 'termine';

export interface ProjectProgress {
  completed: number;
  total: number;
  percentage: number;
}

/**
 * Calcule le statut d'un projet basé sur les statuts de ses étapes
 * - "termine" : toutes les étapes sont COMPLETED
 * - "en_cours" : au moins une étape est IN_PROGRESS ou COMPLETED (mais pas toutes)
 * - "en_attente" : toutes les étapes sont TODO
 */
export function calculateProjectStatus(
  steps: Array<{ status: StepStatus }>
): ProjectStatus {
  if (steps.length === 0) {
    return 'en_attente';
  }

  const completedCount = steps.filter((s) => s.status === 'COMPLETED').length;
  const inProgressCount = steps.filter((s) => s.status === 'IN_PROGRESS').length;

  // Si toutes les étapes sont complétées
  if (completedCount === steps.length) {
    return 'termine';
  }

  // Si au moins une étape est en cours ou complétée (mais pas toutes)
  if (completedCount > 0 || inProgressCount > 0) {
    return 'en_cours';
  }

  // Sinon, toutes les étapes sont à faire
  return 'en_attente';
}

/**
 * Calcule la progression d'un projet (nombre d'étapes complétées vs total)
 */
export function calculateProjectProgress(
  steps: Array<{ status: StepStatus }>
): ProjectProgress {
  const total = steps.length;
  const completed = steps.filter((s) => s.status === 'COMPLETED').length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    completed,
    total,
    percentage,
  };
}

/**
 * Retourne le label en français pour un statut de projet
 */
export function getProjectStatusLabel(status: ProjectStatus): string {
  const labels: Record<ProjectStatus, string> = {
    en_attente: 'En attente',
    en_cours: 'En cours',
    termine: 'Terminé',
  };
  return labels[status];
}

/**
 * Retourne les classes CSS pour le badge de statut
 */
export function getProjectStatusBadgeClasses(status: ProjectStatus): string {
  const baseClasses = 'px-2 py-1 text-xs font-medium rounded';
  const statusClasses: Record<ProjectStatus, string> = {
    en_attente: `${baseClasses} bg-gray-100 text-gray-800`,
    en_cours: `${baseClasses} bg-blue-100 text-blue-800`,
    termine: `${baseClasses} bg-green-100 text-green-800`,
  };
  return statusClasses[status];
}

/**
 * Type pour une prochaine étape avec informations du projet
 */
export interface NextStep {
  step: {
    id: string;
    name: string;
    order: number;
    status: StepStatus;
    plannedDate: Date | null;
    project: {
      id: string;
      name: string;
    };
  };
  urgency: number; // Score d'urgence (plus bas = plus urgent)
}

/**
 * Récupère les prochaines étapes (non complétées) de tous les projets d'un utilisateur
 * Les étapes sont triées par urgence (dates proches en premier)
 */
export function getNextSteps(
  projects: Array<{
    id: string;
    name: string;
    steps: Array<{
      id: string;
      name: string;
      order: number;
      status: StepStatus;
      plannedDate: Date | null;
    }>;
  }>
): NextStep[] {
  const nextSteps: NextStep[] = [];

  // Parcourir tous les projets et leurs étapes
  for (const project of projects) {
    for (const step of project.steps) {
      // Ne garder que les étapes non complétées
      if (step.status !== 'COMPLETED') {
        // Calculer le score d'urgence
        // - Si date prévue : score = jours jusqu'à la date (négatif si dépassée)
        // - Sinon : score très élevé (triées à la fin)
        let urgency = 999999; // Par défaut, pas urgent (trié à la fin)

        if (step.plannedDate) {
          const now = new Date();
          const planned = new Date(step.plannedDate);
          const diffDays = Math.floor((planned.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          urgency = diffDays; // Plus bas = plus urgent (dates passées = négatif, très urgent)
        }

        nextSteps.push({
          step: {
            ...step,
            project: {
              id: project.id,
              name: project.name,
            },
          },
          urgency,
        });
      }
    }
  }

  // Trier par urgence (plus bas = plus urgent), puis par ordre d'étape
  nextSteps.sort((a, b) => {
    if (a.urgency !== b.urgency) {
      return a.urgency - b.urgency;
    }
    return a.step.order - b.step.order;
  });

  return nextSteps;
}
