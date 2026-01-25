/**
 * Story 10.3: configuration des champs des fiches contact/venue.
 * getEffectiveFicheConfig fusionne les valeurs par défaut avec le JSON UserSettings
 * et force visible+required pour les champs verrouillés (firstName, lastName, name).
 */

import type { Prisma } from '@prisma/client';

export type FicheFieldConfig = {
  visible: boolean;
  required: boolean;
  defaultValue?: string | number | null;
};

export const CONTACT_FIELD_KEYS = ['firstName', 'lastName', 'email', 'phone', 'role', 'notes'] as const;
export const VENUE_FIELD_KEYS = ['name', 'address', 'capacity', 'style', 'region', 'website', 'notes'] as const;

export type ContactFieldKey = (typeof CONTACT_FIELD_KEYS)[number];
export type VenueFieldKey = (typeof VENUE_FIELD_KEYS)[number];

export const LOCKED_CONTACT_KEYS: ContactFieldKey[] = ['firstName', 'lastName'];
export const LOCKED_VENUE_KEYS: VenueFieldKey[] = ['name'];

function defaultContactConfig(): Record<ContactFieldKey, FicheFieldConfig> {
  const c: Record<string, FicheFieldConfig> = {};
  for (const k of CONTACT_FIELD_KEYS) {
    c[k] = {
      visible: true,
      required: LOCKED_CONTACT_KEYS.includes(k as ContactFieldKey),
      defaultValue: undefined,
    };
  }
  return c as Record<ContactFieldKey, FicheFieldConfig>;
}

function defaultVenueConfig(): Record<VenueFieldKey, FicheFieldConfig> {
  const c: Record<string, FicheFieldConfig> = {};
  for (const k of VENUE_FIELD_KEYS) {
    c[k] = {
      visible: true,
      required: LOCKED_VENUE_KEYS.includes(k as VenueFieldKey),
      defaultValue: undefined,
    };
  }
  return c as Record<VenueFieldKey, FicheFieldConfig>;
}

function isContactFieldKey(k: string): k is ContactFieldKey {
  return (CONTACT_FIELD_KEYS as readonly string[]).includes(k);
}
function isVenueFieldKey(k: string): k is VenueFieldKey {
  return (VENUE_FIELD_KEYS as readonly string[]).includes(k);
}

function isFicheFieldConfig(v: unknown): v is FicheFieldConfig {
  return (
    typeof v === 'object' &&
    v !== null &&
    'visible' in v &&
    typeof (v as FicheFieldConfig).visible === 'boolean' &&
    'required' in v &&
    typeof (v as FicheFieldConfig).required === 'boolean'
  );
}

export type EffectiveFicheConfig = {
  contact: Record<ContactFieldKey, FicheFieldConfig>;
  venue: Record<VenueFieldKey, FicheFieldConfig>;
};

/**
 * Fusionne les défauts avec le JSON UserSettings et force visible+required pour les champs verrouillés.
 */
export function getEffectiveFicheConfig(
  ficheContactFields: Prisma.JsonValue | null | undefined,
  ficheVenueFields: Prisma.JsonValue | null | undefined
): EffectiveFicheConfig {
  const contact = defaultContactConfig();
  const venue = defaultVenueConfig();

  const rawContact = ficheContactFields && typeof ficheContactFields === 'object' && !Array.isArray(ficheContactFields) ? (ficheContactFields as Record<string, unknown>) : null;
  if (rawContact) {
    for (const k of Object.keys(rawContact)) {
      if (!isContactFieldKey(k)) continue;
      const v = rawContact[k];
      if (!isFicheFieldConfig(v)) continue;
      const locked = LOCKED_CONTACT_KEYS.includes(k);
      contact[k] = {
        visible: locked ? true : v.visible,
        required: locked ? true : v.required,
        defaultValue: v.defaultValue,
      };
    }
  }

  const rawVenue = ficheVenueFields && typeof ficheVenueFields === 'object' && !Array.isArray(ficheVenueFields) ? (ficheVenueFields as Record<string, unknown>) : null;
  if (rawVenue) {
    for (const k of Object.keys(rawVenue)) {
      if (!isVenueFieldKey(k)) continue;
      const v = rawVenue[k];
      if (!isFicheFieldConfig(v)) continue;
      const locked = LOCKED_VENUE_KEYS.includes(k);
      venue[k] = {
        visible: locked ? true : v.visible,
        required: locked ? true : v.required,
        defaultValue: v.defaultValue,
      };
    }
  }

  return { contact, venue };
}
