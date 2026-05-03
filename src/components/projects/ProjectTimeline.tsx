'use client';

import { StepStatus } from '@prisma/client';

interface Step {
  id: string;
  name: string;
  order: number;
  status: StepStatus;
  plannedDate: Date | null;
  actualDate: Date | null;
  parentStepId?: string | null;
  estimatedDays?: number | null;
}

interface ProjectTimelineProps {
  steps: Step[];
  startDate: Date | null;
  endDate: Date | null;
}

function getStepStatusColor(status: StepStatus): string {
  switch (status) {
    case 'COMPLETED':
      return 'bg-green-500';
    case 'IN_PROGRESS':
      return 'bg-blue-500';
    default:
      return 'bg-gray-300';
  }
}

function getStepStatusBorderColor(status: StepStatus): string {
  switch (status) {
    case 'COMPLETED':
      return 'border-green-500';
    case 'IN_PROGRESS':
      return 'border-blue-500';
    default:
      return 'border-gray-300';
  }
}

function formatDate(date: Date | null): string {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function ProjectTimeline({ steps, startDate, endDate }: ProjectTimelineProps) {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

      {/* Dates importantes du projet */}
      {(startDate || endDate) && (
        <div className="mb-6 pb-4 border-b border-gray-200">
          <div className="flex flex-wrap gap-4 text-sm">
            {startDate && (
              <div>
                <span className="font-medium text-gray-700">Début :</span>{' '}
                <span className="text-gray-600">{formatDate(startDate)}</span>
              </div>
            )}
            {endDate && (
              <div>
                <span className="font-medium text-gray-700">Fin prévue :</span>{' '}
                <span className="text-gray-600">{formatDate(endDate)}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Étapes */}
      <div className="space-y-6">
        {steps.map((step) => {
          const statusColor = getStepStatusColor(step.status);
          const borderColor = getStepStatusBorderColor(step.status);
          const isSub = !!step.parentStepId;

          return (
            <div key={step.id} className={`relative flex items-start gap-4 ${isSub ? 'ml-10' : ''}`}>
              {/* Timeline dot */}
              <div className="relative z-10 flex-shrink-0">
                <div
                  className={`w-8 h-8 rounded-full border-2 ${borderColor} ${statusColor} flex items-center justify-center`}
                >
                  {step.status === 'COMPLETED' && (
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                  {step.status === 'IN_PROGRESS' && (
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  )}
                </div>
              </div>

              {/* Step content */}
              <div className="flex-1 pb-6">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h3 className="font-semibold text-gray-900">{step.name}</h3>
                    <p className="text-xs text-gray-500">
                      Étape #{step.order}
                      {step.estimatedDays != null && step.estimatedDays > 0 && (
                        <span className="ml-2 text-indigo-600">~{step.estimatedDays} j</span>
                      )}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      step.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-800'
                        : step.status === 'IN_PROGRESS'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {step.status === 'COMPLETED'
                      ? 'Terminée'
                      : step.status === 'IN_PROGRESS'
                      ? 'En cours'
                      : 'À faire'}
                  </span>
                </div>

                {/* Dates */}
                <div className="mt-2 space-y-1 text-xs text-gray-600">
                  {step.plannedDate && (
                    <div>
                      <span className="font-medium">Prévue :</span> {formatDate(step.plannedDate)}
                      {step.plannedDate && new Date(step.plannedDate) < new Date() && step.status !== 'COMPLETED' && (
                        <span className="ml-2 text-red-600">⚠️ En retard</span>
                      )}
                    </div>
                  )}
                  {step.actualDate && (
                    <div>
                      <span className="font-medium">Réalisée :</span> {formatDate(step.actualDate)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
