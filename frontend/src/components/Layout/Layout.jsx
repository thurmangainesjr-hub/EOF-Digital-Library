import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  FiHome, FiBook, FiFolder, FiEdit3, FiStar, FiUser,
  FiLogOut, FiMenu, FiX, FiCommand, FiGlobe, FiPlay,
  FiBell, FiChevronRight, FiThermometer, FiSmartphone
} from 'react-icons/fi';

const NAV_ITEMS = [
  { path: '/',               icon: FiHome,    label: 'Dashboard',      group: 'main' },
  { path: '/library',        icon: FiBook,    label: 'Library',        group: 'main' },
  { path: '/bookshelves',    icon: FiFolder,  label: 'My Bookshelves', group: 'main' },
  { path: '/story-time',     icon: FiPlay,    label: 'Story Time',     group: 'main' },
  { path: '/gutenberg',      icon: FiGlobe,   label: 'Gutenberg',      group: 'explore' },
  { path: '/command-center', icon: FiCommand, label: 'Command Center', group: 'explore' },
  { path: '/membership',     icon: FiStar,       label: 'Membership',     group: 'account' },
  { path: '/thermal',        icon: FiThermometer, label: 'Thermal Monitor', group: 'account' },
  { path: '/preview',        icon: FiSmartphone,  label: 'Test Lab',        group: 'account' },
];

const CREATOR_ITEM = { path: '/creator', icon: FiEdit3, label: 'Creator Studio', group: 'explore' };

const GROUP_LABELS = { main: 'Navigate', explore: 'Discover', account: 'Account' };

// ── EOF Logo mark ────────────────────────────────────────────────────────────
function EOFLogo({ collapsed = false }) {
  return (
    <div className="flex items-center gap-3 select-none">
      <div className="relative w-9 h-9 flex-shrink-0">
        <div className="w-full h-full rounded-lg bg-eof-gold flex items-center justify-center shadow-gold-sm">
          <span className="font-serif font-bold text-eof-dark text-lg leading-none">E</span>
        </div>
        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-eof-crimson border-2 border-eof-dark" />
      </div>
      {!collapsed && (
        <div className="leading-none">
          <p className="font-serif text-lg text-eof-gold tracking-widest">EOF</p>
          <p className="text-[10px] text-eof-muted tracking-widest uppercase mt-0.5">Digital Library</p>
        </div>
      )}
    </div>
  );
}

// ── Drawer nav ───────────────────────────────────────────────────────────────
function Drawer({ open, onClose, navItems, user, onLogout }) {
  const drawerRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Group nav items
  const groups = navItems.reduce((acc, item) => {
    (acc[item.group] = acc[item.group] || []).push(item);
    return acc;
  }, {});

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer panel */}
          <motion.aside
            key="drawer"
            ref={drawerRef}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
            className="fixed left-0 top-0 h-full z-50 w-72 flex flex-col"
            style={{ background: '#111111', borderRight: '1px solid #2A2A2A' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-eof-dark-border">
              <EOFLogo />
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-eof-muted hover:text-white hover:bg-white/5 transition-colors"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Nav groups */}
            <nav className="flex-1 overflow-y-auto py-4 px-3">
              {Object.entries(groups).map(([group, items]) => (
                <div key={group} className="mb-6">
                  <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-eof-muted px-3 mb-2">
                    {GROUP_LABELS[group]}
                  </p>
                  {items.map(item => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 transition-all duration-150 group ${
                          isActive
                            ? 'bg-eof-gold/10 text-eof-gold'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                            isActive ? 'bg-eof-gold/15' : 'group-hover:bg-white/5'
                          }`}>
                            <item.icon size={17} />
                          </span>
                          <span className="flex-1 text-sm font-medium">{item.label}</span>
                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-eof-gold flex-shrink-0" />
                          )}
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              ))}
            </nav>

            {/* User section */}
            <div className="px-4 py-4 border-t border-eof-dark-border">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-eof-purple to-eof-gold/60 flex items-center justify-center flex-shrink-0 border border-eof-gold/20">
                    <span className="font-serif font-bold text-white text-sm">
                      {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{user.displayName || user.email}</p>
                    <span className="badge badge-gold mt-0.5">{user.membership?.tier || 'FREE'}</span>
                  </div>
                  <button
                    onClick={onLogout}
                    className="p-2 text-eof-muted hover:text-eof-crimson-light transition-colors rounded-lg hover:bg-eof-crimson/10"
                    title="Sign out"
                  >
                    <FiLogOut size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onLogout}
                  className="btn-primary w-full text-sm py-2.5"
                >
                  Sign In
                </button>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Top bar ──────────────────────────────────────────────────────────────────
function TopBar({ onOpenDrawer, user, onLogout, currentPath }) {
  // Derive a page title from the path
  const PAGE_TITLES = {
    '/':               'Dashboard',
    '/library':        'Library',
    '/bookshelves':    'My Bookshelves',
    '/story-time':     'Story Time',
    '/gutenberg':      'Gutenberg',
    '/command-center': 'Command Center',
    '/creator':        'Creator Studio',
    '/membership':     'Membership',
  };
  const title = Object.entries(PAGE_TITLES).find(([k]) =>
    currentPath === k || (k !== '/' && currentPath.startsWith(k))
  )?.[1] || 'EOF Library';

  return (
    <header className="topbar fixed top-0 left-0 right-0 z-30 flex items-center px-4 md:px-6 gap-4">
      {/* Hamburger */}
      <button
        onClick={onOpenDrawer}
        className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/6 transition-all"
        aria-label="Open menu"
      >
        <FiMenu size={22} />
      </button>

      {/* Logo (always visible) */}
      <EOFLogo />

      {/* Page title — hidden on small screens */}
      <div className="hidden md:flex items-center gap-2 text-gray-600">
        <FiChevronRight size={14} />
        <span className="text-sm font-medium text-gray-300">{title}</span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <button className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-eof-gold transition-colors relative">
          <FiBell size={19} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-eof-crimson" />
        </button>

        {user ? (
          <button
            className="w-9 h-9 rounded-full bg-gradient-to-br from-eof-purple to-eof-gold/60 flex items-center justify-center border border-eof-gold/25 hover:border-eof-gold/60 transition-colors"
            onClick={onOpenDrawer}
            title="Open menu"
          >
            <span className="font-serif font-bold text-white text-sm">
              {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
            </span>
          </button>
        ) : (
          <button className="btn-primary text-xs py-2 px-4" onClick={onLogout}>
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}

// ── Layout root ──────────────────────────────────────────────────────────────
function Layout() {
  const { user, logout, isAuthenticated, isCreator } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setDrawerOpen(false);
  };

  const navItems = [...NAV_ITEMS];
  if (isCreator) {
    // Insert Creator Studio after Command Center
    const idx = navItems.findIndex(i => i.path === '/command-center');
    navItems.splice(idx + 1, 0, CREATOR_ITEM);
  }

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false); }, [location.pathname]);

  return (
    <div className="min-h-screen bg-eof-dark">
      {/* Fixed top bar */}
      <TopBar
        onOpenDrawer={() => setDrawerOpen(true)}
        user={isAuthenticated ? user : null}
        onLogout={handleLogout}
        currentPath={location.pathname}
      />

      {/* Slide-out drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        navItems={navItems}
        user={isAuthenticated ? user : null}
        onLogout={handleLogout}
      />

      {/* Page content — offset by top bar height */}
      <main
        className="pt-16 min-h-screen"
        style={{ paddingTop: 'var(--topbar-height)' }}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
