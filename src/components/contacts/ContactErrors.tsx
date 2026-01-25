import { validateContact } from '@/lib/validations/contactValidation';

type Contact = {
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  role?: string | null;
  notes?: string | null;
};

type ContactErrorsProps = {
  contact: Contact;
};

export function ContactErrors({ contact }: ContactErrorsProps) {
  const validation = validateContact(contact);

  if (validation.isValid && validation.errors.length === 0) {
    return null;
  }

  const criticalErrors = validation.errors.filter((e) => e.type !== 'warning');
  const warnings = validation.errors.filter((e) => e.type === 'warning');

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <svg
          className="h-5 w-5 text-red-600 mr-2 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-red-800 mb-2">
            Cette fiche contient des erreurs nécessitant une correction
          </h3>
          {criticalErrors.length > 0 && (
            <ul className="list-disc list-inside space-y-1 mb-2">
              {criticalErrors.map((error, index) => (
                <li key={index} className="text-sm text-red-700">
                  <strong>{error.field}:</strong> {error.message}
                </li>
              ))}
            </ul>
          )}
          {warnings.length > 0 && (
            <div className="mt-2 pt-2 border-t border-red-200">
              <p className="text-xs font-medium text-red-600 mb-1">Avertissements :</p>
              <ul className="list-disc list-inside space-y-1">
                {warnings.map((warning, index) => (
                  <li key={index} className="text-xs text-red-600">
                    {warning.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
