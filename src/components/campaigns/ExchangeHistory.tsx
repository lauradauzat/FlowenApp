import { MarkDateObtainedButton } from './MarkDateObtainedButton';

export type Exchange = {
  type: 'send' | 'response';
  id: string;
  date: Date | string;
  subject: string;
  content: string;
  campaignName: string;
  statusOrType: string;
  venueName?: string;
  contactName?: string;
  campaignId?: string;
  contactId?: string;
  venueId?: string;
  isDateObtained?: boolean;
};

const typeLabel: Record<string, string> = {
  SENT: 'Envoyé',
  FAILED: 'Échec',
  PENDING: 'En attente',
  POSITIVE: 'Positive',
  NEGATIVE: 'Négative',
  NEUTRAL: 'Neutre',
};

export function ExchangeHistory({
  items,
  title = 'Historique des échanges',
  emptyMessage = 'Aucun échange.',
  projects = [],
}: {
  items: Exchange[];
  title?: string;
  emptyMessage?: string;
  projects?: Array<{ id: string; name: string }>;
}) {
  if (items.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="text-gray-500 text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <ul className="space-y-3">
        {items.map((x) => (
          <li key={`${x.type}-${x.id}`} className="border-b border-gray-100 pb-3 last:border-0">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span
                className={`px-1.5 py-0.5 rounded ${
                  x.type === 'send'
                    ? 'bg-blue-50 text-blue-700'
                    : 'bg-green-50 text-green-700'
                }`}
              >
                {x.type === 'send' ? 'Mail envoyé' : 'Réponse'}
              </span>
              <span className="text-gray-500">
                {new Date(x.date).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <span className="text-gray-600">{x.campaignName}</span>
              {x.venueName && <span className="text-gray-500">— {x.venueName}</span>}
              {x.contactName && <span className="text-gray-500">— {x.contactName}</span>}
              <span className="text-gray-400">{typeLabel[x.statusOrType] ?? x.statusOrType}</span>
              {x.type === 'response' && x.isDateObtained && (
                <span className="text-green-600 text-xs">✓ Date obtenue</span>
              )}
            </div>
            <p className="font-medium text-gray-900 mt-1">{x.subject}</p>
            <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">{x.content}</p>
            {x.type === 'response' && !x.isDateObtained && x.campaignId && x.contactId && x.venueId && projects.length > 0 && (
              <MarkDateObtainedButton
                responseId={x.id}
                campaignId={x.campaignId}
                contactId={x.contactId}
                venueId={x.venueId}
                projects={projects}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
