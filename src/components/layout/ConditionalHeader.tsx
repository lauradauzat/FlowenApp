'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';

const publicRoutes = ['/login', '/signin'];

export function ConditionalHeader() {
  const pathname = usePathname();
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  if (isPublicRoute) {
    return null;
  }

  return <Header />;
}
