import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { prepareContactsExport, prepareVenuesExport } from '@/actions/exportActions';
import { generateCSVBuffer } from '@/lib/utils/csvGenerator';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'contacts';

    // Parser les paramètres
    const fieldsParam = searchParams.get('fields');
    const fields = fieldsParam ? fieldsParam.split(',') : undefined;

    const statusFilter = searchParams.get('status') || undefined;
    const regionFilter = searchParams.get('region') || undefined;
    const roleFilter = searchParams.get('role') || undefined;
    const includeRelations = searchParams.get('includeRelations') === 'true';

    let exportData: { data: Array<Record<string, unknown>>; headers: string[] };
    let filename: string;

    if (type === 'contacts') {
      const result = await prepareContactsExport({
        fields: fields as Array<'firstName' | 'lastName' | 'email' | 'phone' | 'role' | 'notes' | 'status' | 'venues'> | undefined,
        filters: {
          status: statusFilter as 'ACTIVE' | 'ARCHIVED' | 'ERROR' | undefined,
          role: roleFilter,
        },
        includeRelations,
      });

      if (!result.success || !result.data) {
        return NextResponse.json(
          { error: result.error?.message || 'Erreur lors de la préparation de l\'export' },
          { status: 400 }
        );
      }

      exportData = result.data;
      filename = `contacts_export_${new Date().toISOString().split('T')[0]}.csv`;
    } else if (type === 'venues') {
      const result = await prepareVenuesExport({
        fields: fields as Array<'name' | 'address' | 'region' | 'website' | 'capacity' | 'style' | 'notes' | 'status' | 'contacts'> | undefined,
        filters: {
          status: statusFilter as 'ACTIVE' | 'ARCHIVED' | 'ERROR' | undefined,
          region: regionFilter,
        },
        includeRelations,
      });

      if (!result.success || !result.data) {
        return NextResponse.json(
          { error: result.error?.message || 'Erreur lors de la préparation de l\'export' },
          { status: 400 }
        );
      }

      exportData = result.data;
      filename = `salles_export_${new Date().toISOString().split('T')[0]}.csv`;
    } else {
      return NextResponse.json({ error: 'Type d\'export invalide' }, { status: 400 });
    }

    // Générer le CSV
    const csvBuffer = generateCSVBuffer(exportData.data, exportData.headers);

    // Retourner le fichier
    return new NextResponse(new Uint8Array(csvBuffer), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
      },
    });
  } catch (error) {
    console.error('Error exporting CSV:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l\'export' },
      { status: 500 }
    );
  }
}
