import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, LogOut, LayoutDashboard, Boxes, PackageOpen, ArrowLeftRight, Sparkles, Settings, ShieldCheck, ChevronRight } from 'lucide-react';
import useAuthStore from '../context/authStore';

const getNavItems = (role) => {
  const items = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Boxes, label: 'Products', href: '/products' },
    { icon: PackageOpen, label: 'Inventory', href: '/inventory' },
    { icon: ArrowLeftRight, label: 'Transactions', href: '/transactions' },
    { icon: Sparkles, label: 'AI Assistant', href: '/ai-assistant' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  if (role === 'admin') {
    items.splice(5, 0, { icon: ShieldCheck, label: 'Admin Panel', href: '/admin' });
  }

  return items;
};

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = getNavItems(user?.role);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 border-b border-gray-200/80 bg-white/95 backdrop-blur-xl dark:border-gray-700/80 dark:bg-gray-900/95">
      <div className="mx-auto flex min-h-14 max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link to="/dashboard" className="flex min-w-0 items-center gap-2 overflow-hidden">
            <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg sm:flex">
              <span className="text-lg text-white">📦</span>
            </div>
            <span className="hidden text-base font-semibold text-gray-900 dark:text-white sm:inline-block sm:text-xl">Inventra AI</span>
          </Link>
        </div>

        {user && (
          <div className="hidden items-center gap-4 md:flex">
            {/* <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user.name}</span> */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-red-50 hover:text-red-600 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-red-950/40"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {mobileMenuOpen && user && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-gray-200 bg-white/95 px-4 py-4 shadow-lg dark:border-gray-700 dark:bg-gray-900/95 md:hidden"
          >
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`flex items-center justify-between rounded-2xl px-3 py-3 text-sm font-medium transition ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`rounded-xl p-2 ${isActive ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-700'}`}>
                        <Icon size={18} />
                      </div>
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight size={16} className={`${isActive ? 'opacity-100' : 'opacity-60'}`} />
                  </Link>
                );
              })}
            </div>

            <div className="mt-3 border-t border-gray-200 pt-3 dark:border-gray-700">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-2xl px-3 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/40"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export const Sidebar = ({ activeNav }) => {
  const { user } = useAuthStore();
  const navItems = getNavItems(user?.role);

  return (
    <aside className="fixed left-0 top-16 z-30 hidden h-[calc(100vh-4rem)] w-72 overflow-y-auto border-r border-gray-200/80 bg-white/90 backdrop-blur-xl dark:border-gray-700/80 dark:bg-gray-800/90 md:block">
      <div className="p-6">
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 p-4 text-white shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] opacity-90">Operations</p>
          <p className="mt-1 text-lg font-semibold">Inventra AI Control Center</p>
        </div>

        <div className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-400 dark:text-gray-500">
          Main Menu
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                className={`group flex items-center justify-between rounded-2xl px-3 py-3 transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`rounded-xl p-2 ${isActive ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-700'}`}>
                    <Icon size={18} />
                  </div>
                  <span className="font-medium">{item.label}</span>
                </div>
                <ChevronRight size={16} className={`${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`} />
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
