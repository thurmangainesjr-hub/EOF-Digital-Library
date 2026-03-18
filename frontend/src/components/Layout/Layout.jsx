import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiHome, FiBook, FiGrid, FiFolder, FiEdit3,
  FiStar, FiUser, FiLogOut, FiMenu, FiX, FiCommand,
  FiBookOpen, FiGlobe, FiPlay
} from 'react-icons/fi';

function Layout() {
  const { user, logout, isAuthenticated, isMember, isCreator } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', icon: FiHome, label: 'Dashboard' },
    { path: '/command-center', icon: FiCommand, label: 'Command Center' },
    { path: '/library', icon: FiBook, label: 'Library' },
    { path: '/gutenberg', icon: FiGlobe, label: 'Gutenberg' },
    { path: '/story-time', icon: FiPlay, label: 'Story Time' },
    { path: '/bookshelves', icon: FiFolder, label: 'My Bookshelves' },
  ];

  if (isCreator) {
    navItems.push({ path: '/creator', icon: FiEdit3, label: 'Creator Studio' });
  }

  navItems.push({ path: '/membership', icon: FiStar, label: 'Membership' });

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? 'w-64' : 'w-20'} glass-dark transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-yellow-600/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
              <span className="text-black font-bold text-xl">E</span>
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="font-serif text-xl text-yellow-500">EOF</h1>
                <p className="text-xs text-gray-400">Digital Library</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-6 py-3 transition-all duration-200
                ${isActive
                  ? 'text-yellow-500 bg-yellow-600/10 border-r-2 border-yellow-500'
                  : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-600/5'
                }
              `}
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-yellow-600/20">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                <FiUser className="text-white" />
              </div>
              {sidebarOpen && (
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{user?.displayName || user?.email}</p>
                  <p className="text-xs text-yellow-500">{user?.membership?.tier || 'FREE'}</p>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors"
              >
                <FiLogOut size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="w-full btn-primary text-center"
            >
              {sidebarOpen ? 'Sign In' : <FiUser />}
            </button>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-6 -right-3 w-6 h-6 rounded-full bg-yellow-600 text-black flex items-center justify-center hover:bg-yellow-500 transition-colors"
        >
          {sidebarOpen ? <FiX size={14} /> : <FiMenu size={14} />}
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
