import { ProjectType } from '@prisma/client';

export interface ProjectStepTemplate {
  name: string;
  order: number;
}

export const PROJECT_STEP_TEMPLATES: Record<ProjectType, ProjectStepTemplate[]> = {
  EP: [
    { name: 'Composition', order: 1 },
    { name: 'Enregistrement', order: 2 },
    { name: 'Mixage', order: 3 },
    { name: 'Mastering', order: 4 },
    { name: 'Sortie', order: 5 },
  ],
  ALBUM: [
    { name: 'Composition', order: 1 },
    { name: 'Enregistrement', order: 2 },
    { name: 'Mixage', order: 3 },
    { name: 'Mastering', order: 4 },
    { name: 'Artwork', order: 5 },
    { name: 'Sortie', order: 6 },
  ],
  TOURNEE: [
    { name: 'Planification', order: 1 },
    { name: 'Réservation salles', order: 2 },
    { name: 'Promotion', order: 3 },
    { name: 'Répétitions', order: 4 },
    { name: 'Exécution', order: 5 },
  ],
  SINGLE: [
    { name: 'Composition', order: 1 },
    { name: 'Enregistrement', order: 2 },
    { name: 'Mixage', order: 3 },
    { name: 'Mastering', order: 4 },
    { name: 'Sortie', order: 5 },
  ],
};

/**
 * Récupère les étapes préconstruites pour un type de projet donné
 */
export function getProjectStepsForType(type: ProjectType): ProjectStepTemplate[] {
  return PROJECT_STEP_TEMPLATES[type] || [];
}
