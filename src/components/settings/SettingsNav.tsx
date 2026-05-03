import Link from 'next/link';

const links = [
  { href: '/settings/scraping', label: 'Scraping' },
  { href: '/settings/relances', label: 'Relances' },
  { href: '/settings/mailing', label: 'Mailing' },
  { href: '/settings/dashboard', label: 'Tableau de bord' },
  { href: '/settings/fiches', label: 'Fiches' },
];

export function SettingsNav({ current }: { current: string }) {
  return (
    <nav className="flex gap-4 mb-6 border-b border-gray-200 pb-4">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`text-sm font-medium ${current === href ? 'text-blue-600 border-b-2 border-blue-600 -mb-[17px] pb-4' : 'text-gray-600 hover:text-gray-900'}`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
