import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, LogOut, LayoutDashboard, Boxes, PackageOpen, ArrowLeftRight, Sparkles, Settings, ChevronRight } from 'lucide-react';
import useAuthStore from '../context/authStore';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">📦</span>
            </div>
            <span className="text-xl font-bold text-gray-800 dark:text-white">Inventra AI</span>
          </Link>

          {user && (
            <div className="hidden md:flex items-center space-x-6">
              <span className="text-gray-700 dark:text-gray-300">{user.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-red-600 transition"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && user && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden pb-4 border-t border-gray-200 dark:border-gray-700"
          >
            <span className="block py-2 text-gray-700 dark:text-gray-300">{user.name}</span>
            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center space-x-2 py-2 text-red-600 hover:bg-red-50 px-2 rounded"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </motion.div>
        )}
      </div>
    
  );
};

export const Sidebar = ({ activeNav }) => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Boxes, label: 'Products', href: '/products' },
    { icon: PackageOpen, label: 'Inventory', href: '/inventory' },
    { icon: ArrowLeftRight, label: 'Transactions', href: '/transactions' },
    { icon: Sparkles, label: 'AI Assistant', href: '/ai-assistant' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  return (
    <aside className="hidden lg:block w-72 bg-white/90 dark:bg-gray-800/90 h-screen border-r border-gray-200/80 dark:border-gray-700/80 fixed left-0 top-16 overflow-y-auto backdrop-blur-xl">
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
