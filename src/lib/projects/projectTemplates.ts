import { ProjectType } from '@prisma/client';

/** Arbre d’étapes pour un type de projet (phases + sous-tâches). */
export type ProjectStepTemplateNode = {
  name: string;
  /** Jours estimés pour cette étape (suggestion de calendrier) */
  estimatedDays?: number;
  children?: ProjectStepTemplateNode[];
};

export const PROJECT_STEP_TREE_TEMPLATES: Record<ProjectType, ProjectStepTemplateNode[]> = {
  EP: [
    {
      name: 'Préparation & cadrage',
      estimatedDays: 7,
      children: [
        { name: 'Brief artistique / direction', estimatedDays: 2 },
        { name: 'Budget & planning global', estimatedDays: 3 },
        { name: 'Choix ingénieur·e son & studio', estimatedDays: 2 },
      ],
    },
    {
      name: 'Pré-production',
      estimatedDays: 14,
      children: [
        { name: 'Sélection des titres & démos', estimatedDays: 5 },
        { name: 'Arrangements & pré-production', estimatedDays: 5 },
        { name: 'Sessions prépa / répétitions captées', estimatedDays: 4 },
      ],
    },
    {
      name: 'Enregistrement',
      estimatedDays: 12,
      children: [
        { name: 'Prises de bases (batterie, rythmique)', estimatedDays: 4 },
        { name: 'Prises harmoniques & voix', estimatedDays: 5 },
        { name: 'Comping & choix des prises', estimatedDays: 3 },
      ],
    },
    {
      name: 'Mixage',
      estimatedDays: 10,
      children: [
        { name: 'Rough mix & retours artiste', estimatedDays: 4 },
        { name: 'Mix détaillé & automation', estimatedDays: 4 },
        { name: 'Révisions & validation mix', estimatedDays: 2 },
      ],
    },
    {
      name: 'Mastering & livrables',
      estimatedDays: 7,
      children: [
        { name: 'Mastering (LUFS / true peak / références)', estimatedDays: 3 },
        { name: 'DDP ou livrables agrégateur', estimatedDays: 2 },
        { name: 'Métadonnées ISRC / crédits / splits', estimatedDays: 2 },
        { name: 'Exports WAV / stems & archives', estimatedDays: 1 },
      ],
    },
    {
      name: 'Visuel & identité',
      estimatedDays: 10,
      children: [
        { name: 'Pochette / visuel EP', estimatedDays: 5 },
        { name: 'Assets réseaux & press kit', estimatedDays: 3 },
        { name: 'Lyrics vidéos (optionnel)', estimatedDays: 2 },
      ],
    },
    {
      name: 'Distribution & sortie',
      estimatedDays: 14,
      children: [
        { name: 'Choix agrégateur / label & contrats', estimatedDays: 3 },
        { name: 'Déclarations PRO / SACEM & splits', estimatedDays: 2 },
        { name: 'Bio DSP, pitch stores & upload', estimatedDays: 4 },
        { name: 'Campagne promo & playlists', estimatedDays: 3 },
        { name: 'Lancement & suivi premières semaines', estimatedDays: 2 },
      ],
    },
  ],
  ALBUM: [
    {
      name: 'Préparation',
      estimatedDays: 10,
      children: [
        { name: 'Concept album & tracklist', estimatedDays: 4 },
        { name: 'Budget & calendrier', estimatedDays: 3 },
        { name: 'Équipe créative', estimatedDays: 3 },
      ],
    },
    {
      name: 'Composition & pré-prod',
      estimatedDays: 21,
      children: [
        { name: 'Écriture & démos', estimatedDays: 10 },
        { name: 'Pré-production détaillée', estimatedDays: 7 },
        { name: 'Validation direction artistique', estimatedDays: 4 },
      ],
    },
    {
      name: 'Enregistrement',
      estimatedDays: 20,
      children: [
        { name: 'Sessions par blocs / titres', estimatedDays: 14 },
        { name: 'Edits & comping', estimatedDays: 6 },
      ],
    },
    {
      name: 'Mixage',
      estimatedDays: 14,
      children: [
        { name: 'Rough mix & retours', estimatedDays: 5 },
        { name: 'Mix détaillé & automation', estimatedDays: 6 },
        { name: 'Révisions finales', estimatedDays: 3 },
      ],
    },
    {
      name: 'Mastering',
      estimatedDays: 7,
      children: [
        { name: 'Séquence album & transitions', estimatedDays: 2 },
        { name: 'Mastering & contrôle LUFS', estimatedDays: 3 },
        { name: 'DDP / livrables & archivage', estimatedDays: 2 },
      ],
    },
    {
      name: 'Artwork & packaging',
      estimatedDays: 10,
      children: [
        { name: 'Visuel album', estimatedDays: 6 },
        { name: 'Liner notes & crédits', estimatedDays: 2 },
        { name: 'Pressage / vinyle (optionnel)', estimatedDays: 2 },
      ],
    },
    {
      name: 'Sortie & promo',
      estimatedDays: 14,
      children: [
        { name: 'Singles, clips & calendrier de com', estimatedDays: 5 },
        { name: 'Distribution, PRO & métadonnées', estimatedDays: 4 },
        { name: 'Lancement & promo post-sortie', estimatedDays: 5 },
      ],
    },
  ],
  TOURNEE: [
    {
      name: 'Cadrage',
      estimatedDays: 7,
      children: [
        { name: 'Routing & budget', estimatedDays: 3 },
        { name: 'Booking agent / équipe', estimatedDays: 2 },
        { name: 'Tech rider & backline', estimatedDays: 2 },
      ],
    },
    {
      name: 'Booking salles',
      estimatedDays: 21,
      children: [
        { name: 'Liste cibles & pitching', estimatedDays: 7 },
        { name: 'Négociation cachets & contrats', estimatedDays: 8 },
        { name: 'Confirmations & avances', estimatedDays: 3 },
        { name: 'Assurances / visas (si besoin)', estimatedDays: 3 },
      ],
    },
    {
      name: 'Promotion',
      estimatedDays: 14,
      children: [
        { name: 'Annonce tournée & billetterie', estimatedDays: 5 },
        { name: 'Contenus réseaux & press', estimatedDays: 5 },
        { name: 'Partenariats locaux', estimatedDays: 4 },
      ],
    },
    {
      name: 'Répétitions',
      estimatedDays: 10,
      children: [
        { name: 'Mise en set & arrangements live', estimatedDays: 6 },
        { name: 'Soundcheck process', estimatedDays: 2 },
        { name: 'Prépa merch & logistique', estimatedDays: 2 },
      ],
    },
    {
      name: 'Exécution tournée',
      estimatedDays: 30,
      children: [
        { name: 'Transport & logistique quotidienne', estimatedDays: 10 },
        { name: 'Merch & guest lists', estimatedDays: 5 },
        { name: 'Dates live & com terrain', estimatedDays: 10 },
        { name: 'Bilan financier & relances', estimatedDays: 5 },
      ],
    },
  ],
  SINGLE: [
    {
      name: 'Préparation',
      estimatedDays: 5,
      children: [
        { name: 'Direction artistique', estimatedDays: 2 },
        { name: 'Choix studio / prod', estimatedDays: 2 },
        { name: 'Planning', estimatedDays: 1 },
      ],
    },
    {
      name: 'Enregistrement',
      estimatedDays: 5,
      children: [
        { name: 'Prises & comping', estimatedDays: 3 },
        { name: 'Edits & tuning léger', estimatedDays: 2 },
      ],
    },
    {
      name: 'Mixage',
      estimatedDays: 4,
      children: [
        { name: 'Mix & retouches', estimatedDays: 3 },
        { name: 'Bounces références streaming', estimatedDays: 1 },
      ],
    },
    {
      name: 'Mastering',
      estimatedDays: 2,
      children: [
        { name: 'Master final & QC LUFS', estimatedDays: 1 },
        { name: 'Livrables agrégateur', estimatedDays: 1 },
      ],
    },
    {
      name: 'Sortie',
      estimatedDays: 7,
      children: [
        { name: 'Visuel single & assets réseaux', estimatedDays: 3 },
        { name: 'Upload DSP & pitch playlists', estimatedDays: 2 },
        { name: 'Promo lancement & suivi', estimatedDays: 2 },
      ],
    },
  ],
};

export function getProjectStepTreeForType(type: ProjectType): ProjectStepTemplateNode[] {
  return PROJECT_STEP_TREE_TEMPLATES[type] ?? [];
}
