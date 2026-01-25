'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export function RefreshDashboardButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-60"
      aria-label="Actualiser le tableau de bord"
    >
      {isPending ? 'Actualisation…' : 'Actualiser'}
    </button>
  );
}
