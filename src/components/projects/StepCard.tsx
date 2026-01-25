'use client';

import { StepStatus } from '@prisma/client';
import { updateStepStatus } from '@/actions/projectActions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface StepCardProps {
  step: {
    id: string;
    name: string;
    order: number;
    status: StepStatus;
    plannedDate: Date | null;
    actualDate: Date | null;
  };
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

export function StepCard({ step }: StepCardProps) {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState<StepStatus>(step.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStatusChange = async (newStatus: StepStatus) => {
    if (newStatus === currentStatus) return;

    setIsUpdating(true);
    setError(null);

    const result = await updateStepStatus({
      stepId: step.id,
      status: newStatus,
    });

    if (result.success) {
      setCurrentStatus(newStatus);
      // Rafraîchir la page pour mettre à jour la progression
      router.refresh();
    } else {
      setError(result.error?.message || 'Erreur lors de la mise à jour');
    }

    setIsUpdating(false);
  };

  const isPlannedDateOverdue =
    step.plannedDate && new Date(step.plannedDate) < new Date() && currentStatus !== 'COMPLETED';

  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <span className="text-sm font-medium text-gray-500 mt-1">#{step.order}</span>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">{step.name}</h3>
            <div className="flex flex-wrap gap-2 text-xs text-gray-500">
              {step.plannedDate && (
                <span className={isPlannedDateOverdue ? 'text-red-600 font-medium' : ''}>
                  Prévue: {new Date(step.plannedDate).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                  {isPlannedDateOverdue && ' ⚠️'}
                </span>
              )}
              {step.actualDate && (
                <span>
                  Réalisée: {new Date(step.actualDate).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              )}
            </div>
          </div>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded ${statusBadgeClasses[currentStatus]}`}>
          {statusLabels[currentStatus]}
        </span>
      </div>

      {error && (
        <div className="mb-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
          {error}
        </div>
      )}

      <div className="flex gap-2">
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
