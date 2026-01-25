'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  createMailTemplate,
  updateMailTemplate,
  createMailTemplateVariant,
  updateMailTemplateVariant,
  deleteMailTemplateVariant,
} from '@/actions/mailTemplateActions';
import {
  TEMPLATE_VARIABLES,
  renderTemplate,
  getExampleData,
  getExampleDataForVariant,
  selectTemplateVariant,
  CAPACITY_CATEGORIES,
} from '@/lib/utils/templateVariables';

type VariantItem = {
  id: string;
  capacityCategory: string | null;
  region: string | null;
  style: string | null;
  subject: string;
  body: string;
  order: number;
};

type MailTemplateFormProps =
  | {
      mode: 'create';
      initialValues?: undefined;
    }
  | {
      mode: 'edit';
      initialValues: {
        id: string;
        name: string;
        subject: string;
        body: string;
        variants: VariantItem[];
      };
    };

const VAR_CATEGORIES: Record<string, string> = {
  salle: 'Salle',
  contact: 'Contact',
  projet: 'Projet',
};

export function MailTemplateForm(props: MailTemplateFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [insertTarget, setInsertTarget] = useState<'subject' | 'body'>('body');
  const [variantForm, setVariantForm] = useState<{
    capacityCategory: string;
    region: string;
    style: string;
    subject: string;
    body: string;
  } | null>(null);
  const [editingVariantId, setEditingVariantId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<string>('default');
  const [simulateCapacity, setSimulateCapacity] = useState<string>('');
  const [simulateRegion, setSimulateRegion] = useState<string>('');
  const [simulateStyle, setSimulateStyle] = useState<string>('');
  const subjectRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const isEdit = props.mode === 'edit';
  const initial = isEdit ? props.initialValues : undefined;
  const variants = initial?.variants ?? [];

  const insertVariable = (key: string) => {
    const el = insertTarget === 'subject' ? subjectRef.current : bodyRef.current;
    if (!el) return;
    el.focus();
    const tag = `{{${key}}}`;
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    el.setRangeText(tag, start, end, 'end');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const payload = {
      name: (formData.get('name') as string).trim(),
      subject: (formData.get('subject') as string).trim(),
      body: (formData.get('body') as string).trim(),
    };

    const result = isEdit
      ? await updateMailTemplate({ id: initial!.id, ...payload })
      : await createMailTemplate(payload);

    if (result.success && result.data) {
      router.push('/templates');
      router.refresh();
    } else {
      setError(result.error?.message || 'Une erreur est survenue');
      setIsSubmitting(false);
    }
  };

  const byCategory = TEMPLATE_VARIABLES.reduce<
    Record<string, Array<(typeof TEMPLATE_VARIABLES)[number]>>
  >((acc, v) => {
    (acc[v.category] ??= []).push(v);
    return acc;
  }, {});

  const variantLabel = (v: VariantItem) => {
    const p: string[] = [];
    p.push(v.capacityCategory ? `Capacité: ${v.capacityCategory}` : 'Capacité: toutes');
    p.push(v.region ? `Région: ${v.region}` : 'Région: toutes');
    p.push(v.style ? `Style: ${v.style}` : 'Style: tout');
    return p.join(' · ');
  };

  const handleSaveVariant = async () => {
    if (!variantForm || !initial) return;
    const pay = {
      capacityCategory: variantForm.capacityCategory || null,
      region: variantForm.region.trim() || null,
      style: variantForm.style.trim() || null,
      subject: variantForm.subject.trim(),
      body: variantForm.body.trim(),
    };
    if (editingVariantId) {
      const res = await updateMailTemplateVariant({ id: editingVariantId, ...pay });
      if (res.success) {
        setVariantForm(null);
        setEditingVariantId(null);
        router.refresh();
      } else {
        setError(res.error?.message ?? 'Erreur');
      }
    } else {
      const res = await createMailTemplateVariant({
        mailTemplateId: initial.id,
        ...pay,
      });
      if (res.success) {
        setVariantForm(null);
        router.refresh();
      } else {
        setError(res.error?.message ?? 'Erreur');
      }
    }
  };

  const handleDeleteVariant = async (id: string) => {
    if (!confirm('Supprimer cette variante ?')) return;
    const res = await deleteMailTemplateVariant({ id });
    if (res.success) router.refresh();
    else setError(res.error?.message ?? 'Erreur');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Nom du template *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          defaultValue={initial?.name ?? ''}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Ex: Premier contact salles, Relance campagne booking..."
        />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
          Sujet du mail *
        </label>
        <input
          ref={subjectRef}
          type="text"
          id="subject"
          name="subject"
          required
          onFocus={() => setInsertTarget('subject')}
          defaultValue={initial?.subject ?? ''}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Ex: Proposition de concert - {{nom_salle}}"
        />
      </div>

      <div>
        <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">
          Corps du mail *
        </label>
        <textarea
          ref={bodyRef}
          id="body"
          name="body"
          required
          rows={12}
          onFocus={() => setInsertTarget('body')}
          defaultValue={initial?.body ?? ''}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Bonjour {{prenom_contact}},

[Votre message ici...]

Cordialement"
        />
        <p className="mt-1 text-xs text-gray-500">
          Syntaxe : {`{{nom_variable}}`}. Cliquez sur une variable ci-dessous pour l&apos;insérer. Si une variable n&apos;est pas disponible pour un destinataire, elle sera remplacée par une chaîne vide. Le bloc ci-dessus est le <strong>template par défaut</strong> (utilisé lorsqu&apos;aucune variante ne correspond).
        </p>
      </div>

      {/* Variables disponibles */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Variables disponibles</h3>
        <p className="text-xs text-gray-500 mb-3">
          Cliquez pour insérer dans {insertTarget === 'subject' ? 'le sujet' : 'le corps'}.
        </p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(byCategory).map(([cat, vars]) => (
            <div key={cat} className="flex flex-wrap gap-1.5 items-center">
              <span className="text-xs text-gray-500 mr-1">({VAR_CATEGORIES[cat]})</span>
              {vars.map((v) => (
                <button
                  key={v.key}
                  type="button"
                  onClick={() => insertVariable(v.key)}
                  className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-blue-50 hover:border-blue-300"
                  title={v.label}
                >
                  {`{{${v.key}}}`}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Story 5.3: Variantes (edit only) */}
      {isEdit && initial && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Variantes selon capacité, région ou style</h3>
          <p className="text-xs text-gray-500 mb-3">
            Si une variante correspond aux propriétés de la salle (capacité, région, style), elle sera utilisée à la place du template par défaut.
          </p>
          <div className="space-y-2">
            {variants.map((v) => (
              <div
                key={v.id}
                className="flex flex-wrap items-center justify-between gap-2 py-2 px-3 bg-white border rounded"
              >
                {editingVariantId === v.id && variantForm ? (
                  <div className="w-full space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="text-xs text-gray-600">Capacité</label>
                        <select
                          value={variantForm.capacityCategory}
                          onChange={(e) => setVariantForm((f) => f && { ...f, capacityCategory: e.target.value })}
                          className="w-full mt-0.5 px-2 py-1 text-sm border rounded"
                        >
                          <option value="">Toutes</option>
                          {CAPACITY_CATEGORIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-gray-600">Région</label>
                        <input
                          type="text"
                          value={variantForm.region}
                          onChange={(e) => setVariantForm((f) => f && { ...f, region: e.target.value })}
                          placeholder="Toutes si vide"
                          className="w-full mt-0.5 px-2 py-1 text-sm border rounded"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600">Style</label>
                        <input
                          type="text"
                          value={variantForm.style}
                          onChange={(e) => setVariantForm((f) => f && { ...f, style: e.target.value })}
                          placeholder="Tout si vide"
                          className="w-full mt-0.5 px-2 py-1 text-sm border rounded"
                        />
                      </div>
                    </div>
                    <input
                      value={variantForm.subject}
                      onChange={(e) => setVariantForm((f) => f && { ...f, subject: e.target.value })}
                      placeholder="Sujet *"
                      className="w-full px-2 py-1 text-sm border rounded"
                    />
                    <textarea
                      value={variantForm.body}
                      onChange={(e) => setVariantForm((f) => f && { ...f, body: e.target.value })}
                      placeholder="Corps *"
                      rows={4}
                      className="w-full px-2 py-1 text-sm border rounded"
                    />
                    <p className="text-xs text-gray-500">Variables : {`{{nom_salle}}`}, {`{{prenom_contact}}`}, etc.</p>
                    <div className="flex gap-2">
                      <button type="button" onClick={handleSaveVariant} className="px-2 py-1 text-sm bg-blue-600 text-white rounded">Enregistrer</button>
                      <button type="button" onClick={() => { setVariantForm(null); setEditingVariantId(null); }} className="px-2 py-1 text-sm border rounded">Annuler</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-sm">
                      <span className="text-gray-600">{variantLabel(v)}</span>
                      <span className="ml-2 text-gray-900">— {v.subject.slice(0, 50)}{v.subject.length > 50 ? '…' : ''}</span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setVariantForm({ capacityCategory: v.capacityCategory ?? '', region: v.region ?? '', style: v.style ?? '', subject: v.subject, body: v.body });
                          setEditingVariantId(v.id);
                        }}
                        className="px-2 py-1 text-xs border rounded hover:bg-gray-100"
                      >
                        Modifier
                      </button>
                      <button type="button" onClick={() => handleDeleteVariant(v.id)} className="px-2 py-1 text-xs border border-red-200 rounded hover:bg-red-50 text-red-700">Supprimer</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          {!variantForm ? (
            <button
              type="button"
              onClick={() => setVariantForm({ capacityCategory: '', region: '', style: '', subject: '', body: '' })}
              className="mt-2 px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-100"
            >
              + Ajouter une variante
            </button>
          ) : !editingVariantId && (
            <div className="mt-4 p-3 bg-white border rounded space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-gray-600">Capacité</label>
                  <select
                    value={variantForm.capacityCategory}
                    onChange={(e) => setVariantForm((f) => f && { ...f, capacityCategory: e.target.value })}
                    className="w-full mt-0.5 px-2 py-1 text-sm border rounded"
                  >
                    <option value="">Toutes</option>
                    {CAPACITY_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-600">Région</label>
                  <input
                    type="text"
                    value={variantForm.region}
                    onChange={(e) => setVariantForm((f) => f && { ...f, region: e.target.value })}
                    placeholder="Toutes si vide"
                    className="w-full mt-0.5 px-2 py-1 text-sm border rounded"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Style</label>
                  <input
                    type="text"
                    value={variantForm.style}
                    onChange={(e) => setVariantForm((f) => f && { ...f, style: e.target.value })}
                    placeholder="Tout si vide"
                    className="w-full mt-0.5 px-2 py-1 text-sm border rounded"
                  />
                </div>
              </div>
              <input
                value={variantForm.subject}
                onChange={(e) => setVariantForm((f) => f && { ...f, subject: e.target.value })}
                placeholder="Sujet *"
                className="w-full px-2 py-1 text-sm border rounded"
              />
              <textarea
                value={variantForm.body}
                onChange={(e) => setVariantForm((f) => f && { ...f, body: e.target.value })}
                placeholder="Corps *"
                rows={4}
                className="w-full px-2 py-1 text-sm border rounded"
              />
              <p className="text-xs text-gray-500">Variables : {`{{nom_salle}}`}, {`{{prenom_contact}}`}, etc.</p>
              <div className="flex gap-2">
                <button type="button" onClick={handleSaveVariant} className="px-2 py-1 text-sm bg-blue-600 text-white rounded">Enregistrer</button>
                <button type="button" onClick={() => setVariantForm(null)} className="px-2 py-1 text-sm border rounded">Annuler</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Story 5.4: Prévisualisation avec choix de variante */}
      <div>
        <button
          type="button"
          onClick={() => setShowPreview((v) => !v)}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {showPreview ? 'Masquer la prévisualisation' : 'Prévisualiser'}
        </button>
        {showPreview && (
          <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-white space-y-4">
            <p className="text-sm text-gray-500">Aperçu avec des données d&apos;exemple. Choisissez le contenu à afficher :</p>
            {isEdit && variants.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs text-gray-600">Contenu :</span>
                <button
                  type="button"
                  onClick={() => setPreviewMode('default')}
                  className={`px-2 py-1 text-xs rounded ${previewMode === 'default' ? 'bg-blue-100 border border-blue-300' : 'border border-gray-300 hover:bg-gray-50'}`}
                >
                  Défaut
                </button>
                {variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setPreviewMode(`variant-${v.id}`)}
                    className={`px-2 py-1 text-xs rounded ${previewMode === `variant-${v.id}` ? 'bg-blue-100 border border-blue-300' : 'border border-gray-300 hover:bg-gray-50'}`}
                    title={variantLabel(v)}
                  >
                    {variantLabel(v).slice(0, 30)}…
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPreviewMode('simulate')}
                  className={`px-2 py-1 text-xs rounded ${previewMode === 'simulate' ? 'bg-blue-100 border border-blue-300' : 'border border-gray-300 hover:bg-gray-50'}`}
                >
                  Simuler une salle
                </button>
              </div>
            )}
            {previewMode === 'simulate' && isEdit && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 bg-gray-50 rounded">
                <div>
                  <label className="text-xs text-gray-600">Capacité (nombre)</label>
                  <input
                    type="number"
                    value={simulateCapacity}
                    onChange={(e) => setSimulateCapacity(e.target.value)}
                    placeholder="ex. 500"
                    className="w-full mt-0.5 px-2 py-1 text-sm border rounded"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Région</label>
                  <input
                    type="text"
                    value={simulateRegion}
                    onChange={(e) => setSimulateRegion(e.target.value)}
                    placeholder="ex. Île-de-France"
                    className="w-full mt-0.5 px-2 py-1 text-sm border rounded"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Style</label>
                  <input
                    type="text"
                    value={simulateStyle}
                    onChange={(e) => setSimulateStyle(e.target.value)}
                    placeholder="ex. Rock"
                    className="w-full mt-0.5 px-2 py-1 text-sm border rounded"
                  />
                </div>
              </div>
            )}
            {(() => {
              let sub: string; let bod: string; let data: Record<string, string>;
              const defSubject = subjectRef.current?.value ?? initial?.subject ?? '';
              const defBody = bodyRef.current?.value ?? initial?.body ?? '';
              const variantLike = variants.map((v) => ({ ...v, order: v.order }));

              if (previewMode === 'simulate' && isEdit) {
                const cap = simulateCapacity ? parseInt(simulateCapacity, 10) : null;
                const sel = selectTemplateVariant(variantLike, {
                  capacity: Number.isNaN(cap) ? null : cap,
                  region: simulateRegion.trim() || null,
                  style: simulateStyle.trim() || null,
                });
                sub = sel ? sel.subject : defSubject;
                bod = sel ? sel.body : defBody;
                data = getExampleDataForVariant({
                  capacity: Number.isNaN(cap) ? undefined : cap ?? undefined,
                  region: simulateRegion.trim() || undefined,
                  style: simulateStyle.trim() || undefined,
                });
              } else if (previewMode.startsWith('variant-')) {
                const vid = previewMode.replace(/^variant-/, '');
                const v = variants.find((x) => x.id === vid);
                if (v) {
                  sub = v.subject; bod = v.body;
                  data = getExampleDataForVariant({
                    capacity: v.capacityCategory === 'petite' ? 200 : v.capacityCategory === 'moyenne' ? 500 : v.capacityCategory === 'grande' ? 1500 : undefined,
                    region: v.region ?? undefined,
                    style: v.style ?? undefined,
                  });
                } else {
                  sub = defSubject; bod = defBody; data = getExampleData();
                }
              } else {
                sub = defSubject; bod = defBody; data = getExampleData();
              }
              const { subject, body } = renderTemplate(sub, bod, data);
              return (
                <>
                  <div>
                    <span className="text-xs font-medium text-gray-500">Sujet : </span>
                    <span className="text-gray-900">{subject || '(vide)'}</span>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-500 block mb-1">Corps :</span>
                    <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans p-3 bg-gray-50 rounded border">
                      {body || '(vide)'}
                    </pre>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Enregistrement...' : isEdit ? 'Enregistrer' : 'Créer le template'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
