import Link from 'next/link';

const navItems = [
  {
    key: 'overview',
    label: 'Overview',
    href: '/dashboards',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7m-9 2v10" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-1.5 1.5" />
      </svg>
    ),
  },
  {
    key: 'playground',
    label: 'API Playground',
    href: '/playground',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
      </svg>
    ),
  },
  {
    key: 'billing',
    label: 'Billing',
    href: '#',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h10" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 18h4" />
      </svg>
    ),
  },
  {
    key: 'docs',
    label: 'Documentation',
    href: '#',
    external: true,
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h12l4 4v12a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 4v4h4" />
      </svg>
    ),
  },
];

const Sidebar = ({ active = 'overview', isOpen = true, onClose }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900 bg-opacity-50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 min-h-screen w-72 flex-col justify-between border-r border-gray-200 bg-white px-6 py-8 transition-transform duration-300 ease-in-out lg:relative lg:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:hidden'
        } flex`}
      >
      <div className="space-y-8">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white font-semibold">
              GI
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">GitInsight</p>
              <p className="text-xs font-medium text-gray-500">API Platform</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden rounded-lg p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Close sidebar"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = item.key === active;
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-50 text-gray-500'
                  }`}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </span>
                {item.external && (
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 3.5h6v6" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.5L9 11" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 5v10a2 2 0 002 2h10" />
                  </svg>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="rounded-2xl bg-gray-50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-semibold text-blue-600">
            AA
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">Anunay Amrit</p>
            <p className="text-xs text-gray-500">Product Lead</p>
          </div>
          <button
            type="button"
            className="rounded-full border border-gray-200 p-2 text-gray-400 transition hover:text-gray-600"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 8l4 4 4-4" />
            </svg>
          </button>
        </div>
      </div>
      </aside>
    </>
  );
};

export default Sidebar;
