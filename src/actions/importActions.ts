'use server';

import { prisma } from '@/lib/prisma/client';
import { requireAuth } from '@/lib/auth/utils';
import { parseCSVFile } from '@/lib/utils/csvParser';
import {
  importContactsFromCSVSchema,
  importVenuesFromCSVSchema,
  previewCSVSchema,
  type ContactColumnMapping,
  type VenueColumnMapping,
} from '@/lib/validations/import';
import { validateContact } from '@/lib/validations/contactValidation';
import { validateVenue } from '@/lib/validations/venueValidation';

type ActionResult<T> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
};

type ImportReport = {
  totalRows: number;
  imported: number;
  duplicates: number;
  errors: number;
  errorDetails: Array<{
    row: number;
    field?: string;
    message: string;
  }>;
};

/**
 * Prévise les données CSV avant import
 */
export async function previewCSVImport(
  file: File,
  type: 'contacts' | 'venues',
  mapping: Record<string, string | undefined>
): Promise<ActionResult<{ headers: string[]; preview: Array<Record<string, string>> }>> {
  try {
    await requireAuth();

    const parseResult = await parseCSVFile(file);

    if (!parseResult.success) {
      return {
        success: false,
        error: {
          code: 'PARSE_ERROR',
          message: `Erreur lors du parsing CSV: ${parseResult.errors.map((e) => e.message).join(', ')}`,
        },
      };
    }

    // Valider le schéma
    const validated = previewCSVSchema.parse({
      type,
      mapping: mapping as Record<string, string | undefined>,
      data: parseResult.data.slice(0, 10), // Prévisualiser les 10 premières lignes
    });

    return {
      success: true,
      data: {
        headers: parseResult.headers,
        preview: validated.data as Array<Record<string, string>>,
      },
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.message,
        },
      };
    }

    console.error('Error previewing CSV:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Une erreur est survenue lors de la prévisualisation',
      },
    };
  }
}

/**
 * Importe des contacts depuis un fichier CSV
 */
export async function importContactsFromCSV(
  file: File,
  mapping: ContactColumnMapping,
  skipDuplicates: boolean = true
): Promise<ActionResult<ImportReport>> {
  try {
    const userId = await requireAuth();

    const parseResult = await parseCSVFile(file);

    if (!parseResult.success) {
      return {
        success: false,
        error: {
          code: 'PARSE_ERROR',
          message: `Erreur lors du parsing CSV: ${parseResult.errors.map((e) => e.message).join(', ')}`,
        },
      };
    }

    const validated = importContactsFromCSVSchema.parse({
      mapping,
      data: parseResult.data,
      skipDuplicates,
    });

    const report: ImportReport = {
      totalRows: validated.data.length,
      imported: 0,
      duplicates: 0,
      errors: 0,
      errorDetails: [],
    };

    for (let i = 0; i < validated.data.length; i++) {
      const row = validated.data[i];
      const rowNumber = i + 2; // +2 car ligne 1 = headers, et index commence à 0

      try {
        // Mapper les colonnes CSV aux champs de la DB
        const firstName = mapping.firstName && row[mapping.firstName] ? String(row[mapping.firstName]).trim() : '';
        const lastName = mapping.lastName && row[mapping.lastName] ? String(row[mapping.lastName]).trim() : '';
        const email = mapping.email && row[mapping.email] ? String(row[mapping.email]).trim() : undefined;
        const phone = mapping.phone && row[mapping.phone] ? String(row[mapping.phone]).trim() : undefined;
        const role = mapping.role && row[mapping.role] ? String(row[mapping.role]).trim() : undefined;
        const notes = mapping.notes && row[mapping.notes] ? String(row[mapping.notes]).trim() : undefined;

        // Valider les données
        const validation = validateContact({
          firstName,
          lastName,
          email,
          phone,
          role,
          notes,
        });

        if (!validation.isValid) {
          report.errors++;
          report.errorDetails.push({
            row: rowNumber,
            message: validation.errors.map((e) => e.message).join(', '),
          });
          continue;
        }

        // Vérifier les doublons si demandé
        if (skipDuplicates) {
          const existing = await prisma.contact.findFirst({
            where: {
              userId,
              OR: [
                ...(email ? [{ email }] : []),
                {
                  firstName,
                  lastName,
                },
              ],
            },
          });

          if (existing) {
            report.duplicates++;
            continue;
          }
        }

        // Créer le contact
        await prisma.contact.create({
          data: {
            userId,
            firstName,
            lastName,
            email,
            phone,
            role,
            notes,
            status: validation.isValid ? 'ACTIVE' : 'ERROR',
          },
        });

        report.imported++;
      } catch (error) {
        report.errors++;
        report.errorDetails.push({
          row: rowNumber,
          message: error instanceof Error ? error.message : 'Erreur inconnue',
        });
      }
    }

    return {
      success: true,
      data: report,
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.message,
        },
      };
    }

    console.error('Error importing contacts from CSV:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Une erreur est survenue lors de l\'import',
      },
    };
  }
}

/**
 * Importe des salles depuis un fichier CSV
 */
export async function importVenuesFromCSV(
  file: File,
  mapping: VenueColumnMapping,
  skipDuplicates: boolean = true
): Promise<ActionResult<ImportReport>> {
  try {
    const userId = await requireAuth();

    const parseResult = await parseCSVFile(file);

    if (!parseResult.success) {
      return {
        success: false,
        error: {
          code: 'PARSE_ERROR',
          message: `Erreur lors du parsing CSV: ${parseResult.errors.map((e) => e.message).join(', ')}`,
        },
      };
    }

    const validated = importVenuesFromCSVSchema.parse({
      mapping,
      data: parseResult.data,
      skipDuplicates,
    });

    const report: ImportReport = {
      totalRows: validated.data.length,
      imported: 0,
      duplicates: 0,
      errors: 0,
      errorDetails: [],
    };

    for (let i = 0; i < validated.data.length; i++) {
      const row = validated.data[i];
      const rowNumber = i + 2; // +2 car ligne 1 = headers, et index commence à 0

      try {
        // Mapper les colonnes CSV aux champs de la DB
        const name = mapping.name && row[mapping.name] ? String(row[mapping.name]).trim() : '';
        const address = mapping.address && row[mapping.address] ? String(row[mapping.address]).trim() : undefined;
        const region = mapping.region && row[mapping.region] ? String(row[mapping.region]).trim() : undefined;
        const website = mapping.website && row[mapping.website] ? String(row[mapping.website]).trim() : undefined;
        const capacity = mapping.capacity && row[mapping.capacity]
          ? parseInt(String(row[mapping.capacity]).trim() || '0', 10) || undefined
          : undefined;
        const style = mapping.style && row[mapping.style] ? String(row[mapping.style]).trim() : undefined;
        const notes = mapping.notes && row[mapping.notes] ? String(row[mapping.notes]).trim() : undefined;

        // Valider les données
        const validation = validateVenue({
          name,
          address,
          region,
          website,
          capacity,
          style,
          notes,
        });

        if (!validation.isValid) {
          report.errors++;
          report.errorDetails.push({
            row: rowNumber,
            message: validation.errors.map((e) => e.message).join(', '),
          });
          continue;
        }

        // Vérifier les doublons si demandé
        if (skipDuplicates) {
          const existing = await prisma.venue.findFirst({
            where: {
              userId,
              name,
            },
          });

          if (existing) {
            report.duplicates++;
            continue;
          }
        }

        // Créer la salle
        await prisma.venue.create({
          data: {
            userId,
            name,
            address,
            region,
            website,
            capacity,
            style,
            notes,
            status: validation.isValid ? 'ACTIVE' : 'ERROR',
          },
        });

        report.imported++;
      } catch (error) {
        report.errors++;
        report.errorDetails.push({
          row: rowNumber,
          message: error instanceof Error ? error.message : 'Erreur inconnue',
        });
      }
    }

    return {
      success: true,
      data: report,
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.message,
        },
      };
    }

    console.error('Error importing venues from CSV:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Une erreur est survenue lors de l\'import',
      },
    };
  }
}
