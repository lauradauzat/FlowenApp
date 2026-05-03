'use client';

import { StepStatus } from '@prisma/client';
import { updateStepStatus, updateProjectStepDetails, deleteProjectStep } from '@/actions/projectActions';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface StepCardStep {
  id: string;
  name: string;
  order: number;
  status: StepStatus;
  plannedDate: Date | null;
  actualDate: Date | null;
  parentStepId: string | null;
  estimatedDays: number | null;
}

interface StepCardProps {
  step: StepCardStep;
}

const statusLabels: Record<StepStatus, string> = {
  TODO: 'À faire',
  IN_PROGRESS: 'En cours',
  COMPLETED: 'Terminée',
};

const statusBadgeClasses: Record<StepStatus, string> = {
  TODO: 'bg-gray-100 text-gray-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
};

function toInputDate(d: Date | null): string {
  if (!d) return '';
  const x = new Date(d);
  const y = x.getFullYear();
  const m = String(x.getMonth() + 1).padStart(2, '0');
  const day = String(x.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function StepCard({ step }: StepCardProps) {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState<StepStatus>(step.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(step.name);
  const [planned, setPlanned] = useState(toInputDate(step.plannedDate));
  const [estDays, setEstDays] = useState(step.estimatedDays != null ? String(step.estimatedDays) : '');

  useEffect(() => {
    setCurrentStatus(step.status);
    setName(step.name);
    setPlanned(toInputDate(step.plannedDate));
    setEstDays(step.estimatedDays != null ? String(step.estimatedDays) : '');
  }, [step.status, step.name, step.plannedDate, step.estimatedDays]);

  const handleStatusChange = async (newStatus: StepStatus) => {
    if (newStatus === currentStatus) return;
    setIsUpdating(true);
    setError(null);
    const result = await updateStepStatus({ stepId: step.id, status: newStatus });
    if (result.success) {
      setCurrentStatus(newStatus);
      router.refresh();
    } else {
      setError(result.error?.message || 'Erreur lors de la mise à jour');
    }
    setIsUpdating(false);
  };

  const saveMeta = async () => {
    setIsUpdating(true);
    setError(null);
    let estimatedDays: number | null = null;
    if (estDays !== '') {
      const n = parseInt(estDays, 10);
      if (Number.isNaN(n) || n < 0) {
        setError('Durée estimée invalide');
        setIsUpdating(false);
        return;
      }
      estimatedDays = n;
    }
    const res = await updateProjectStepDetails({
      stepId: step.id,
      name: name.trim(),
      plannedDate: planned === '' ? null : planned,
      estimatedDays,
    });
    setIsUpdating(false);
    if (res.success) router.refresh();
    else setError(res.error?.message ?? 'Erreur');
  };

  const remove = async () => {
    if (!confirm('Supprimer cette étape ? Les sous-tâches éventuelles seront aussi supprimées.')) return;
    setIsUpdating(true);
    setError(null);
    const res = await deleteProjectStep({ stepId: step.id });
    setIsUpdating(false);
    if (res.success) router.refresh();
    else setError(res.error?.message ?? 'Erreur');
  };

  const isPlannedDateOverdue =
    step.plannedDate && new Date(step.plannedDate) < new Date() && currentStatus !== 'COMPLETED';

  const isSub = !!step.parentStepId;

  return (
    <div
      className={`p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors ${isSub ? 'ml-6 border-l-4 border-l-indigo-200 bg-indigo-50/30' : ''}`}
    >
      <div className="flex items-start justify-between mb-3 gap-2">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="text-sm font-medium text-gray-500 mt-1 shrink-0">#{step.order}</span>
          <div className="flex-1 min-w-0">
            {isSub && (
              <span className="text-[10px] uppercase tracking-wide text-indigo-600 font-medium">Sous-étape</span>
            )}
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="font-semibold text-gray-900 w-full border border-transparent hover:border-gray-200 rounded px-1 py-0.5 -mx-1"
            />
            <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-1">
              {step.plannedDate && (
                <span className={isPlannedDateOverdue ? 'text-red-600 font-medium' : ''}>
                  Prévue (affichage):{' '}
                  {new Date(step.plannedDate).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                  {isPlannedDateOverdue && ' ⚠️'}
                </span>
              )}
              {step.actualDate && (
                <span>
                  Réalisée:{' '}
                  {new Date(step.actualDate).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              )}
            </div>
          </div>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded shrink-0 ${statusBadgeClasses[currentStatus]}`}>
          {statusLabels[currentStatus]}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3 text-sm">
        <div>
          <label className="block text-xs text-gray-600 mb-0.5">Date prévue</label>
          <input type="date" value={planned} onChange={(e) => setPlanned(e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-0.5">Durée estimée (j)</label>
          <input
            type="number"
            min={0}
            max={365}
            value={estDays}
            onChange={(e) => setEstDays(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
            placeholder="—"
          />
        </div>
        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={saveMeta}
            disabled={isUpdating}
            className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Enregistrer infos
          </button>
          <button
            type="button"
            onClick={remove}
            disabled={isUpdating}
            className="px-3 py-1 text-xs text-red-700 border border-red-200 rounded hover:bg-red-50 disabled:opacity-50"
          >
            Supprimer
          </button>
        </div>
      </div>

      {error && <div className="mb-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">{error}</div>}

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleStatusChange('TODO')}
          disabled={isUpdating || currentStatus === 'TODO'}
          className={`px-3 py-1 text-xs rounded transition-colors ${
            currentStatus === 'TODO'
              ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } disabled:opacity-50`}
        >
          À faire
        </button>
        <button
          onClick={() => handleStatusChange('IN_PROGRESS')}
          disabled={isUpdating || currentStatus === 'IN_PROGRESS'}
          className={`px-3 py-1 text-xs rounded transition-colors ${
            currentStatus === 'IN_PROGRESS'
              ? 'bg-blue-200 text-blue-700 cursor-not-allowed'
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          } disabled:opacity-50`}
        >
          En cours
        </button>
        <button
          onClick={() => handleStatusChange('COMPLETED')}
          disabled={isUpdating || currentStatus === 'COMPLETED'}
          className={`px-3 py-1 text-xs rounded transition-colors ${
            currentStatus === 'COMPLETED'
              ? 'bg-green-200 text-green-700 cursor-not-allowed'
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          } disabled:opacity-50`}
        >
          Terminée
        </button>
      </div>
    </div>
  );
}
