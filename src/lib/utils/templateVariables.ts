/**
 * Variables dynamiques pour les templates de mailing
 * Syntaxe: {{nom_variable}}
 * Si une variable n'est pas disponible, elle est remplacée par une chaîne vide.
 */

export const TEMPLATE_VARIABLES = [
  // Salle
  { key: 'nom_salle', label: 'Nom de la salle', category: 'salle' },
  { key: 'capacite', label: 'Capacité', category: 'salle' },
  { key: 'region', label: 'Région', category: 'salle' },
  { key: 'style', label: 'Style musical', category: 'salle' },
  { key: 'adresse', label: 'Adresse', category: 'salle' },
  { key: 'site_web', label: 'Site web', category: 'salle' },
  // Contact
  { key: 'nom_contact', label: 'Nom du contact', category: 'contact' },
  { key: 'prenom_contact', label: 'Prénom du contact', category: 'contact' },
  { key: 'email_contact', label: 'Email du contact', category: 'contact' },
  { key: 'telephone_contact', label: 'Téléphone du contact', category: 'contact' },
  { key: 'role_contact', label: 'Rôle du contact', category: 'contact' },
  // Projet
  { key: 'nom_projet', label: 'Nom du projet', category: 'projet' },
  { key: 'type_projet', label: 'Type de projet (EP, Album, etc.)', category: 'projet' },
] as const;

export type TemplateVariableKey = (typeof TEMPLATE_VARIABLES)[number]['key'];

const VAR_REGEX = /\{\{(\w+)\}\}/g;

/**
 * Remplace les variables {{nom}} dans un texte par les valeurs fournies.
 * Les variables non définies sont remplacées par une chaîne vide.
 */
export function replaceTemplateVariables(
  text: string,
  data: Record<string, string | number | null | undefined>
): string {
  return text.replace(VAR_REGEX, (_, key: string) => {
    const v = data[key];
    if (v === undefined || v === null) return '';
    return String(v);
  });
}

/**
 * Données d'exemple pour la prévisualisation
 */
export function getExampleData(): Record<string, string> {
  return {
    nom_salle: 'Le Bataclan',
    capacite: '1500',
    region: 'Île-de-France',
    style: 'Rock, Variété',
    adresse: '50 boulevard Voltaire, 75011 Paris',
    site_web: 'https://www.bataclan.fr',
    nom_contact: 'Dupont',
    prenom_contact: 'Marie',
    email_contact: 'marie.dupont@example.com',
    telephone_contact: '01 23 45 67 89',
    role_contact: 'Programmatrice',
    nom_projet: 'Nouvel EP 2026',
    type_projet: 'EP',
  };
}

/**
 * Applique le remplacement sur le sujet et le corps avec les données fournies
 */
export function renderTemplate(
  subject: string,
  body: string,
  data: Record<string, string | number | null | undefined> = getExampleData()
): { subject: string; body: string } {
  return {
    subject: replaceTemplateVariables(subject, data),
    body: replaceTemplateVariables(body, data),
  };
}

// --- Story 5.3: Variantes selon capacité, région, style ---

export const CAPACITY_CATEGORIES = ['petite', 'moyenne', 'grande'] as const;
export type CapacityCategory = (typeof CAPACITY_CATEGORIES)[number];

/** Seuils: petite < 300, moyenne 300–999, grande >= 1000. null → null. */
export function capacityToCategory(
  capacity: number | null | undefined
): CapacityCategory | null {
  if (capacity == null || typeof capacity !== 'number') return null;
  if (capacity < 300) return 'petite';
  if (capacity < 1000) return 'moyenne';
  return 'grande';
}

export type VariantLike = {
  capacityCategory: string | null;
  region: string | null;
  style: string | null;
  subject: string;
  body: string;
  order?: number;
};

/** Compte le nombre de critères non vides (spécificité). */
function variantSpecificity(v: VariantLike): number {
  let n = 0;
  if (v.capacityCategory != null && v.capacityCategory !== '') n++;
  if (v.region != null && v.region !== '') n++;
  if (v.style != null && v.style !== '') n++;
  return n;
}

/** Vérifie si une variante correspond aux propriétés salle/contact. */
function variantMatches(
  v: VariantLike,
  ctx: { capacityCategory: CapacityCategory | null; region: string | null; style: string | null }
): boolean {
  if (v.capacityCategory != null && v.capacityCategory !== '') {
    if (ctx.capacityCategory !== v.capacityCategory) return false;
  }
  if (v.region != null && v.region !== '') {
    if (ctx.region == null || ctx.region !== v.region) return false;
  }
  if (v.style != null && v.style !== '') {
    if (ctx.style == null || ctx.style !== v.style) return false;
  }
  return true;
}

/**
 * Sélectionne la variante la plus spécifique qui correspond.
 * Si aucune ne correspond, retourne null (→ utiliser sujet/corps du template par défaut).
 */
export function selectTemplateVariant(
  variants: VariantLike[],
  ctx: { capacity: number | null; region: string | null; style: string | null }
): VariantLike | null {
  const capacityCategory = capacityToCategory(ctx.capacity);
  const c = { capacityCategory, region: ctx.region, style: ctx.style };

  const matching = variants.filter((v) => variantMatches(v, c));
  if (matching.length === 0) return null;

  matching.sort((a, b) => {
    const sa = variantSpecificity(a);
    const sb = variantSpecificity(b);
    if (sa !== sb) return sb - sa;
    return (a.order ?? 0) - (b.order ?? 0);
  });
  return matching[0];
}

/**
 * Données d'exemple par variante (capacité/région/style) pour prévisualisation.
 */
export function getExampleDataForVariant(overrides?: {
  capacity?: number | null;
  region?: string | null;
  style?: string | null;
}): Record<string, string> {
  const base = getExampleData();
  if (!overrides) return base;
  if (overrides.capacity != null) base.capacite = String(overrides.capacity);
  if (overrides.region != null) base.region = overrides.region;
  if (overrides.style != null) base.style = overrides.style;
  return base;
}
