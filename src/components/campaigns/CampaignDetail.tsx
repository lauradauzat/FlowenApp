'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  setRecipientsFromFilters,
  launchCampaign,
  updateCampaign,
  previewRenderedMail,
  retryCampaignSend,
  getCampaignSends,
  sendManualRelances,
} from '@/actions/campaignActions';
import { CAPACITY_CATEGORIES } from '@/lib/utils/templateVariables';

type RecipientClassification = 'repondant' | 'non_repondant' | 'en_attente';

type Campaign = {
  id: string;
  name: string;
  status: string;
  mailTemplateId: string;
  projectId: string | null;
  relanceEnabled?: boolean;
  relanceFirstDelayDays?: number | null;
  relanceNextDelayDays?: number | null;
  relanceMax?: number | null;
  relanceTemplateId?: string | null;
  mailTemplate: { name: string };
  project: { id: string; name: string } | null;
  recipients: Array<{
    id: string;
    contactId: string;
    venueId: string;
    contact: { firstName: string; lastName: string; email: string | null };
    venue: { name: string; region: string | null; capacity: number | null; style: string | null };
    hasResponse?: boolean;
    numRelances?: number;
    lastSendAt?: Date | null;
    lastSendOrder?: number;
    classification?: RecipientClassification;
  }>;
  stats: { total: number; sent: number; failed: number; pending: number; responses: number };
};

type FilterOptions = { regions: string[]; styles: string[] };

type MailTemplateOption = { id: string; name: string };

type Send = {
  id: string;
  status: string;
  subject: string;
  body: string;
  sentAt: Date | null;
  errorMessage: string | null;
  contact: { firstName: string; lastName: string; email: string | null };
  venue: { name: string };
};

export function CampaignDetail({
  campaign: initialCampaign,
  filterOptions,
  initialSends,
  mailTemplates = [],
}: {
  campaign: Campaign;
  filterOptions: FilterOptions;
  initialSends?: Send[] | undefined;
  mailTemplates?: MailTemplateOption[];
}) {
  const router = useRouter();
  const [campaign, setCampaign] = useState(initialCampaign);
  const [sends, setSends] = useState<Send[]>(initialSends ?? []);
  const [region, setRegion] = useState<string[]>([]);
  const [capacity, setCapacity] = useState<string[]>([]);
  const [style, setStyle] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ subject: string; body: string } | null>(null);
  const [previewRecipient, setPreviewRecipient] = useState<string | null>(null);
  const [sendFilter, setSendFilter] = useState<'all' | 'SENT' | 'FAILED' | 'PENDING'>('all');
  // Epic 7: paramètres relances (DRAFT)
  const [relanceEnabled, setRelanceEnabled] = useState(!!initialCampaign.relanceEnabled);
  const [relanceFirstDelayDays, setRelanceFirstDelayDays] = useState(String(initialCampaign.relanceFirstDelayDays ?? ''));
  const [relanceNextDelayDays, setRelanceNextDelayDays] = useState(String(initialCampaign.relanceNextDelayDays ?? ''));
  const [relanceMax, setRelanceMax] = useState(String(initialCampaign.relanceMax ?? ''));
  const [relanceTemplateId, setRelanceTemplateId] = useState<string>(initialCampaign.relanceTemplateId ?? '');
  // Epic 7: filtre classification (RUNNING/COMPLETED)
  const [classFilter, setClassFilter] = useState<RecipientClassification | 'all'>('all');
  // Epic 7: relance manuelle (cases à cocher, template)
  const [relanceSelected, setRelanceSelected] = useState<Set<string>>(new Set());
  const [relanceTemplateChoice, setRelanceTemplateChoice] = useState<string>('');
  const [relanceSending, setRelanceSending] = useState(false);

  // Synchroniser avec les données serveur (après refresh)
  useEffect(() => {
    setCampaign(initialCampaign);
    if (initialSends) setSends(initialSends);
    setRelanceEnabled(!!initialCampaign.relanceEnabled);
    setRelanceFirstDelayDays(String(initialCampaign.relanceFirstDelayDays ?? ''));
    setRelanceNextDelayDays(String(initialCampaign.relanceNextDelayDays ?? ''));
    setRelanceMax(String(initialCampaign.relanceMax ?? ''));
    setRelanceTemplateId(initialCampaign.relanceTemplateId ?? '');
  }, [initialCampaign, initialSends]);

  // Polling process-send quand RUNNING
  useEffect(() => {
    if (campaign.status !== 'RUNNING') return;
    const t = setInterval(async () => {
      try {
        const r = await fetch(`/api/campaigns/${campaign.id}/process-send`, { method: 'POST' });
        const j = await r.json();
        if (r.ok && (j.remaining === 0 || j.processed > 0)) router.refresh();
      } catch {}
    }, 2500);
    return () => clearInterval(t);
  }, [campaign.status, campaign.id, router]);

  const applyFilters = async () => {
    setLoading(true);
    setError(null);
    const res = await setRecipientsFromFilters({
      campaignId: campaign.id,
      region: region.length ? region : undefined,
      capacityCategory: capacity.length ? (capacity as ('petite' | 'moyenne' | 'grande')[]) : undefined,
      style: style.length ? style : undefined,
    });
    setLoading(false);
    if (res.success) {
      router.refresh();
    } else {
      setError(res.error?.message ?? 'Erreur');
    }
  };

  const saveRelanceParams = async () => {
    setLoading(true);
    setError(null);
    const parse = (s: string, min: number) => {
      if (s === '') return null;
      const n = parseInt(s, 10);
      return isNaN(n) || n < min ? null : n;
    };
    const res = await updateCampaign({
      id: campaign.id,
      relanceEnabled,
      relanceFirstDelayDays: parse(relanceFirstDelayDays, 0),
      relanceNextDelayDays: parse(relanceNextDelayDays, 0),
      relanceMax: parse(relanceMax, 1),
      relanceTemplateId: relanceTemplateId === '' ? null : relanceTemplateId,
    });
    setLoading(false);
    if (res.success) router.refresh();
    else setError(res.error?.message ?? 'Erreur');
  };

  const eligibleForRelance = (r: Campaign['recipients'][0]) =>
    !(r.hasResponse ?? false) &&
    (r.numRelances ?? 0) < (campaign.relanceMax ?? Infinity);

  const toggleRelanceSelect = (id: string) => {
    setRelanceSelected((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const doSendManualRelances = async () => {
    if (relanceSelected.size === 0) {
      setError('Sélectionnez au moins un destinataire.');
      return;
    }
    setRelanceSending(true);
    setError(null);
    const res = await sendManualRelances({
      campaignId: campaign.id,
      recipientIds: Array.from(relanceSelected),
      templateId: relanceTemplateChoice === '' ? undefined : relanceTemplateChoice,
    });
    setRelanceSending(false);
    if (res.success) {
      setRelanceSelected(new Set());
      router.refresh();
    } else {
      setError(res.error?.message ?? 'Erreur');
    }
  };

  const doLaunch = async () => {
    if (!confirm('Lancer la campagne ? Les mails seront envoyés aux destinataires.')) return;
    setLoading(true);
    setError(null);
    const res = await launchCampaign({ id: campaign.id });
    setLoading(false);
    if (res.success) router.refresh();
    else setError(res.error?.message ?? 'Erreur');
  };

  const loadPreview = async (contactId: string, venueId: string) => {
    const res = await previewRenderedMail({
      mailTemplateId: campaign.mailTemplateId,
      projectId: campaign.projectId ?? undefined,
      contactId,
      venueId,
    });
    if (res.success) setPreview(res.data);
    else setPreview({ subject: '(erreur)', body: res.error?.message ?? '' });
    setPreviewRecipient(`${contactId}:${venueId}`);
  };

  const retry = async (sendId: string) => {
    setError(null);
    const res = await retryCampaignSend({ campaignSendId: sendId });
    if (res.success) {
      const s = await getCampaignSends(campaign.id);
      if (s.success && s.data) setSends(s.data);
      router.refresh();
    } else setError(res.error?.message ?? 'Erreur');
  };

  const toggle = (arr: string[], v: string, set: (a: string[]) => void) => {
    if (arr.includes(v)) set(arr.filter((x) => x !== v));
    else set([...arr, v]);
  };

  const statusLabel: Record<string, string> = {
    DRAFT: 'Brouillon',
    RUNNING: 'En cours',
    COMPLETED: 'Terminée',
    PAUSED: 'En pause',
  };

  const filteredSends = sends.filter((s) => sendFilter === 'all' || s.status === sendFilter);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{campaign.name}</h1>
          <p className="text-gray-500">
            Template: {campaign.mailTemplate.name}
            {campaign.project && ` · Projet: ${campaign.project.name}`}
          </p>
        </div>
        <span
          className={`px-2 py-1 text-xs rounded ${
            campaign.status === 'DRAFT'
              ? 'bg-gray-100 text-gray-700'
              : campaign.status === 'RUNNING'
                ? 'bg-blue-100 text-blue-700'
                : campaign.status === 'COMPLETED'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-amber-100 text-amber-700'
          }`}
        >
          {statusLabel[campaign.status] ?? campaign.status}
        </span>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {campaign.status === 'DRAFT' && (
        <>
          <section className="border rounded-lg p-4">
            <h2 className="font-medium mb-3">Destinataires</h2>
            <p className="text-sm text-gray-500 mb-3">
              Filtrez par région, capacité et style pour cibler les contacts des salles concernées.
            </p>
            <div className="flex flex-wrap gap-4 mb-4">
              <div>
                <span className="text-xs text-gray-600 block mb-1">Région</span>
                <div className="flex flex-wrap gap-1">
                  {filterOptions.regions.map((r) => (
                    <label key={r} className="inline-flex items-center gap-1 text-sm">
                      <input
                        type="checkbox"
                        checked={region.includes(r)}
                        onChange={() => toggle(region, r, setRegion)}
                      />
                      {r}
                    </label>
                  ))}
                  {filterOptions.regions.length === 0 && <span className="text-gray-400 text-sm">Aucune</span>}
                </div>
              </div>
              <div>
                <span className="text-xs text-gray-600 block mb-1">Capacité</span>
                <div className="flex flex-wrap gap-1">
                  {CAPACITY_CATEGORIES.map((c) => (
                    <label key={c} className="inline-flex items-center gap-1 text-sm">
                      <input
                        type="checkbox"
                        checked={capacity.includes(c)}
                        onChange={() => toggle(capacity, c, setCapacity)}
                      />
                      {c}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-xs text-gray-600 block mb-1">Style</span>
                <div className="flex flex-wrap gap-1">
                  {filterOptions.styles.map((s) => (
                    <label key={s} className="inline-flex items-center gap-1 text-sm">
                      <input
                        type="checkbox"
                        checked={style.includes(s)}
                        onChange={() => toggle(style, s, setStyle)}
                      />
                      {s}
                    </label>
                  ))}
                  {filterOptions.styles.length === 0 && <span className="text-gray-400 text-sm">Aucun</span>}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={applyFilters}
              disabled={loading}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Application...' : 'Appliquer les filtres'}
            </button>
            <p className="text-sm text-gray-500 mt-2">
              {campaign.recipients.length} destinataire{campaign.recipients.length > 1 ? 's' : ''}
            </p>
          </section>

          <section className="border rounded-lg p-4">
            <h2 className="font-medium mb-3">Paramètres de relances</h2>
            <label className="inline-flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                checked={relanceEnabled}
                onChange={(e) => setRelanceEnabled(e.target.checked)}
              />
              <span className="text-sm">Activer les relances automatiques</span>
            </label>
            {relanceEnabled && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Délai 1ère relance (jours)</label>
                  <input
                    type="number"
                    min={0}
                    className="border rounded px-2 py-1 w-24 text-sm"
                    value={relanceFirstDelayDays}
                    onChange={(e) => setRelanceFirstDelayDays(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Délai relances suivantes (jours)</label>
                  <input
                    type="number"
                    min={0}
                    className="border rounded px-2 py-1 w-24 text-sm"
                    value={relanceNextDelayDays}
                    onChange={(e) => setRelanceNextDelayDays(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Nombre max de relances</label>
                  <input
                    type="number"
                    min={1}
                    className="border rounded px-2 py-1 w-24 text-sm"
                    value={relanceMax}
                    onChange={(e) => setRelanceMax(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Template de relance</label>
                  <select
                    className="border rounded px-2 py-1 text-sm min-w-[200px]"
                    value={relanceTemplateId}
                    onChange={(e) => setRelanceTemplateId(e.target.value)}
                  >
                    <option value="">Même que l&apos;envoi initial</option>
                    {mailTemplates.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={saveRelanceParams}
              disabled={loading}
              className="px-3 py-1.5 bg-gray-700 text-white text-sm rounded hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? 'Sauvegarde...' : 'Sauvegarder les paramètres'}
            </button>
          </section>

          {campaign.recipients.length > 0 && (
            <>
              <section>
                <h2 className="font-medium mb-2">Liste des destinataires</h2>
                <ul className="text-sm space-y-1 max-h-48 overflow-y-auto">
                  {campaign.recipients.map((r) => (
                    <li key={r.id}>
                      {r.contact.firstName} {r.contact.lastName} &lt;{r.contact.email}&gt; — {r.venue.name}
                    </li>
                  ))}
                </ul>
              </section>

              <div className="flex flex-wrap gap-2">
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={previewRecipient ?? ''}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (!v) {
                      setPreview(null);
                      setPreviewRecipient(null);
                      return;
                    }
                    const [cid, vid] = v.split(':');
                    loadPreview(cid, vid);
                  }}
                >
                  <option value="">— Prévisualiser un mail —</option>
                  {campaign.recipients.map((r) => (
                    <option key={r.id} value={`${r.contactId}:${r.venueId}`}>
                      {r.contact.firstName} {r.contact.lastName} — {r.venue.name}
                    </option>
                  ))}
                </select>
                {preview && (
                  <div className="w-full mt-2 p-3 border rounded bg-gray-50 text-sm">
                    <p><strong>Sujet:</strong> {preview.subject}</p>
                    <pre className="mt-2 whitespace-pre-wrap">{preview.body}</pre>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={doLaunch}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Lancement...' : 'Lancer la campagne'}
              </button>
            </>
          )}
        </>
      )}

      {(campaign.status === 'RUNNING' || campaign.status === 'COMPLETED') && (
        <>
          <section className="border rounded-lg p-4">
            <h2 className="font-medium mb-2">Statistiques</h2>
            <div className="flex gap-6 text-sm">
              <span>Total: {campaign.stats.total}</span>
              <span className="text-green-600">Envoyés: {campaign.stats.sent}</span>
              <span className="text-red-600">Échecs: {campaign.stats.failed}</span>
              <span className="text-amber-600">En attente: {campaign.stats.pending}</span>
              <span>Réponses: {campaign.stats.responses}</span>
            </div>
            {campaign.stats.total > 0 && (
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{
                    width: `${(campaign.stats.sent / campaign.stats.total) * 100}%`,
                  }}
                />
              </div>
            )}
          </section>

          <section className="border rounded-lg p-4">
            <h2 className="font-medium mb-2">Destinataires</h2>
            <div className="flex flex-wrap gap-2 mb-3">
              {(['all', 'repondant', 'non_repondant', 'en_attente'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setClassFilter(f)}
                  className={`px-2 py-1 text-xs rounded ${classFilter === f ? 'bg-blue-100' : 'bg-gray-100'}`}
                >
                  {f === 'all' ? 'Tous' : f === 'repondant' ? 'Répondant' : f === 'non_repondant' ? 'Non-répondant' : 'En attente'}
                </button>
              ))}
            </div>
            <ul className="space-y-1 text-sm max-h-48 overflow-y-auto">
              {(classFilter === 'all'
                ? campaign.recipients
                : campaign.recipients.filter((r) => (r.classification ?? 'en_attente') === classFilter)
              ).map((r) => (
                <li key={r.id} className="flex items-center gap-2">
                  <span>
                    {r.contact.firstName} {r.contact.lastName} — {r.venue.name}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 text-xs rounded ${
                      (r.classification ?? 'en_attente') === 'repondant'
                        ? 'bg-green-100 text-green-800'
                        : (r.classification ?? 'en_attente') === 'non_repondant'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {(r.classification ?? 'en_attente') === 'repondant' ? 'Répondant' : (r.classification ?? 'en_attente') === 'non_repondant' ? 'Non-répondant' : 'En attente'}
                  </span>
                  {((r.numRelances ?? 0) > 0) && (
                    <span className="text-gray-500 text-xs">({r.numRelances} relance{(r.numRelances ?? 0) > 1 ? 's' : ''})</span>
                  )}
                </li>
              ))}
            </ul>
          </section>

          {campaign.relanceEnabled && (
            <section className="border rounded-lg p-4">
              <h2 className="font-medium mb-2">Relance manuelle</h2>
              <p className="text-sm text-gray-500 mb-3">
                Destinataires éligibles (sans réponse, relances &lt; max). Choisissez le template et les destinataires.
              </p>
              <div className="flex gap-2 mb-3">
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={relanceTemplateChoice}
                  onChange={(e) => setRelanceTemplateChoice(e.target.value)}
                >
                  <option value="">Par défaut (template de relance ou envoi initial)</option>
                  {mailTemplates.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <ul className="space-y-1 text-sm max-h-40 overflow-y-auto mb-3">
                {campaign.recipients.filter(eligibleForRelance).map((r) => (
                  <li key={r.id}>
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={relanceSelected.has(r.id)}
                        onChange={() => toggleRelanceSelect(r.id)}
                      />
                      {r.contact.firstName} {r.contact.lastName} — {r.venue.name}
                      {((r.numRelances ?? 0) > 0) && <span className="text-gray-500">({r.numRelances} relance{(r.numRelances ?? 0) > 1 ? 's' : ''})</span>}
                    </label>
                  </li>
                ))}
              </ul>
              {campaign.recipients.filter(eligibleForRelance).length === 0 && (
                <p className="text-sm text-gray-500 mb-3">Aucun destinataire éligible.</p>
              )}
              <button
                type="button"
                onClick={doSendManualRelances}
                disabled={relanceSending || relanceSelected.size === 0}
                className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {relanceSending ? 'Envoi...' : 'Envoyer la relance'}
              </button>
            </section>
          )}

          <section className="border rounded-lg p-4">
            <h2 className="font-medium mb-2">Envois</h2>
            <div className="flex gap-2 mb-3">
              {(['all', 'SENT', 'FAILED', 'PENDING'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setSendFilter(f)}
                  className={`px-2 py-1 text-xs rounded ${sendFilter === f ? 'bg-blue-100' : 'bg-gray-100'}`}
                >
                  {f === 'all' ? 'Tous' : f === 'SENT' ? 'Envoyés' : f === 'FAILED' ? 'Échecs' : 'En attente'}
                </button>
              ))}
            </div>
            <ul className="space-y-2 text-sm max-h-64 overflow-y-auto">
              {filteredSends.map((s) => (
                <li key={s.id} className="flex justify-between items-start gap-2 border-b pb-2">
                  <div>
                    <span>{s.contact.firstName} {s.contact.lastName} — {s.venue.name}</span>
                    <span className={`ml-2 px-1 rounded ${s.status === 'SENT' ? 'bg-green-100' : s.status === 'FAILED' ? 'bg-red-100' : 'bg-amber-100'}`}>
                      {s.status}
                    </span>
                    {s.errorMessage && <span className="block text-red-600 text-xs">{s.errorMessage}</span>}
                  </div>
                  {s.status === 'FAILED' && (
                    <button
                      type="button"
                      onClick={() => retry(s.id)}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Réessayer
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
