import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiMenu, FiX, FiZap, FiRefreshCw } from 'react-icons/fi';
import EOFTopNav from '../components/EOFTopNav';
import { PROJ_NAV_ITEMS, AI_ACTIONS, MOCK_PROJECT } from '../data/eofStudioData';

const ACCENT   = '#10B981';
const A_SOFT   = 'rgba(16,185,129,0.10)';
const A_BORDER = 'rgba(16,185,129,0.28)';

const APP_TABS = [
  { label:'Dashboard',         section:'dashboard'  },
  { label:'Script Studio',     section:'script'     },
  { label:'Scene Breakdown',   section:'breakdown'  },
  { label:'Storyboard',        section:'storyboard' },
  { label:'Image Studio',      section:'image'      },
  { label:'Image → Video',     section:'img2video'  },
  { label:'Video Editor',      section:'editor'     },
  { label:'Music / Audio',     section:'audio'      },
  { label:'Thumbnail Studio',  section:'thumbnail'  },
  { label:'Asset Library',     section:'assets'     },
  { label:'Export Center',     section:'export'     },
  { label:'Integrations',      section:'integrations'},
  { label:'Settings',          section:'settings'   },
  { label:'📋 Templates',      section:'templates'  },
  { label:'🏆 Blueprints',     section:'blueprints' },
];

export default function FacelessVideosAppLayout() {
  const [leftOpen,        setLeftOpen]        = useState(true);
  const [rightOpen,       setRightOpen]       = useState(true);
  const [mobileOpen,      setMobileOpen]      = useState(false);
  const [activeSection,   setActiveSection]   = useState('dashboard');
  const [activeProject,   setActiveProject]   = useState(null);
  const [actionFlash,     setActionFlash]     = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (location.state?.section) setActiveSection(location.state.section);
    if (location.state?.project) setActiveProject(location.state.project);
  }, [location.state]);

  const isChildRoute = location.pathname !== '/faceless-videos';

  function goSection(section) {
    if (isChildRoute) {
      navigate('/faceless-videos', { state: { section } });
    } else {
      setActiveSection(section);
    }
    setMobileOpen(false);
  }

  function flashAction(id) {
    setActionFlash(id);
    setTimeout(() => setActionFlash(null), 900);
  }

  const proj = activeProject || MOCK_PROJECT;
  const connectedCount = 4; // comfyui, kdenlive, audacity, ffmpeg

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#0a0a0a' }}>
      <EOFTopNav accentColor={ACCENT} systemName="Faceless Videos" systemEmoji="🎬" />

      {/* ── Tab bar ── */}
      <div className="flex items-center gap-0 px-2 h-9 border-b border-white/6 flex-shrink-0 overflow-x-auto scrollbar-none"
        style={{ background: 'rgba(10,10,10,0.97)' }}>
        {APP_TABS.map(t => (
          <button key={t.section} onClick={() => goSection(t.section)}
            className="px-3 py-1.5 text-[10px] font-semibold whitespace-nowrap rounded-md transition-all flex-shrink-0 relative"
            style={activeSection === t.section && !isChildRoute
              ? { color:'#6EE7B7', background: A_SOFT }
              : { color:'#5B6470' }}>
            {t.label}
            {activeSection === t.section && !isChildRoute && (
              <div className="absolute bottom-0 left-2 right-2 h-px rounded-full" style={{ background: ACCENT }} />
            )}
          </button>
        ))}
      </div>

      {/* ── 3-panel body ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* ── LEFT: Project Navigator ── */}
        <AnimatePresence initial={false}>
          {leftOpen && (
            <motion.aside key="left"
              initial={{ width:0, opacity:0 }} animate={{ width:210, opacity:1 }} exit={{ width:0, opacity:0 }}
              transition={{ duration:0.18 }}
              className="hidden lg:flex flex-col flex-shrink-0 overflow-hidden"
              style={{ background:'#0d0d0d', borderRight:'1px solid rgba(255,255,255,0.06)' }}>

              {/* Navigator header */}
              <div className="flex items-center justify-between px-3 h-9 border-b border-white/6 flex-shrink-0">
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-600">Project</span>
                <button onClick={() => setLeftOpen(false)} className="text-gray-700 hover:text-gray-400 transition-colors">
                  <FiChevronLeft size={12}/>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-2">
                {/* Project title */}
                <div className="px-3 pb-3 border-b border-white/5 mb-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: ACCENT }}/>
                    <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: ACCENT }}>Active Project</p>
                  </div>
                  <p className="text-[11px] font-bold text-white leading-tight truncate">{proj.title}</p>
                  <p className="text-[8px] text-gray-700 font-mono">{proj.id}</p>
                </div>

                {/* Scene tree */}
                <div className="px-3 mb-3">
                  <p className="text-[8px] font-black uppercase tracking-widest text-gray-700 mb-1.5">Scenes</p>
                  {proj.scenes?.map(sc => (
                    <button key={sc.id} onClick={() => goSection('breakdown')}
                      className="w-full flex items-center gap-1.5 py-1 px-1.5 rounded-lg text-left hover:bg-white/4 transition-all group">
                      <span className="text-[10px]">{sc.emoji}</span>
                      <span className="text-[9px] text-gray-600 group-hover:text-gray-300 transition-colors truncate">
                        {sc.num} · {sc.title}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Asset nav */}
                <div className="px-3">
                  <p className="text-[8px] font-black uppercase tracking-widest text-gray-700 mb-1.5">Assets</p>
                  {PROJ_NAV_ITEMS.map(item => (
                    <button key={item.id} onClick={() => goSection(item.section)}
                      className="w-full flex items-center gap-2 py-1.5 px-1.5 rounded-lg text-left transition-all hover:bg-white/4 group"
                      style={activeSection === item.section && !isChildRoute
                        ? { background: A_SOFT, color:'#6EE7B7' }
                        : {}}>
                      <span className="text-[10px]">{item.icon}</span>
                      <span className="text-[10px] text-gray-600 group-hover:text-gray-300 transition-colors"
                        style={activeSection === item.section && !isChildRoute ? { color:'#6EE7B7' } : {}}>
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Integrations status footer */}
              <div className="px-3 py-2.5 border-t border-white/5 flex-shrink-0">
                <button onClick={() => goSection('integrations')}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/4 transition-all">
                  <span className="text-[9px] text-gray-700">Integrations</span>
                  <span className="text-[8px] font-bold px-1.5 py-0.5 rounded"
                    style={{ background:'rgba(16,185,129,0.15)', color: ACCENT }}>
                    {connectedCount} connected
                  </span>
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Left toggle */}
        {!leftOpen && (
          <button onClick={() => setLeftOpen(true)}
            className="hidden lg:flex flex-col items-center justify-center w-5 border-r border-white/6 text-gray-700 hover:text-gray-400 hover:bg-white/2 transition-all flex-shrink-0">
            <FiChevronRight size={10}/>
          </button>
        )}

        {/* ── CENTER ── */}
        <main className="flex-1 overflow-y-auto">
          <Outlet context={{ activeSection, setActiveSection, activeProject, setActiveProject }} />
        </main>

        {/* Right toggle when collapsed */}
        {!rightOpen && (
          <button onClick={() => setRightOpen(true)}
            className="hidden lg:flex flex-col items-center justify-center w-5 border-l border-white/6 text-gray-700 hover:text-gray-400 hover:bg-white/2 transition-all flex-shrink-0">
            <FiChevronLeft size={10}/>
          </button>
        )}

        {/* ── RIGHT: AI Action Panel ── */}
        <AnimatePresence initial={false}>
          {rightOpen && (
            <motion.aside key="right"
              initial={{ width:0, opacity:0 }} animate={{ width:200, opacity:1 }} exit={{ width:0, opacity:0 }}
              transition={{ duration:0.18 }}
              className="hidden lg:flex flex-col flex-shrink-0 overflow-hidden"
              style={{ background:'#0d0d0d', borderLeft:'1px solid rgba(255,255,255,0.06)' }}>

              <div className="flex items-center justify-between px-3 h-9 border-b border-white/6 flex-shrink-0">
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-600">AI Actions</span>
                <button onClick={() => setRightOpen(false)} className="text-gray-700 hover:text-gray-400 transition-colors">
                  <FiChevronRight size={12}/>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-2 px-2">
                <p className="text-[8px] font-black uppercase tracking-widest text-gray-700 px-1 mb-2">Quick Actions</p>
                <div className="space-y-0.5">
                  {AI_ACTIONS.map(a => (
                    <motion.button key={a.id}
                      onClick={() => { flashAction(a.id); if (a.section) goSection(a.section); }}
                      whileTap={{ scale:0.96 }}
                      className="w-full flex items-center gap-2 px-2 py-2 rounded-xl text-left transition-all text-[10px] font-semibold border"
                      style={actionFlash === a.id
                        ? { background: A_SOFT, borderColor: A_BORDER, color:'#6EE7B7' }
                        : { borderColor:'transparent', color:'#6B7280' }}>
                      <span>{a.icon}</span>
                      <span>{a.label}</span>
                      {actionFlash === a.id && (
                        <FiRefreshCw size={9} className="animate-spin ml-auto" style={{ color: ACCENT }}/>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="px-2 py-2.5 border-t border-white/5 flex-shrink-0">
                <button onClick={() => goSection('script')}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10px] font-bold transition-all hover:brightness-110"
                  style={{ background: A_SOFT, color:'#6EE7B7', border:`1px solid ${A_BORDER}` }}>
                  <FiZap size={11}/> New Project
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="lg:hidden fixed inset-0 z-20 bg-black/70" onClick={() => setMobileOpen(false)}/>
            <motion.div initial={{ x:'100%' }} animate={{ x:0 }} exit={{ x:'100%' }}
              transition={{ duration:0.22, ease:'easeOut' }}
              className="lg:hidden fixed right-0 top-0 bottom-0 z-30 w-60 flex flex-col overflow-hidden"
              style={{ background:'#0d0d0d', borderLeft:'1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center justify-between px-4 h-14 border-b border-white/6 flex-shrink-0">
                <span className="text-xs font-black uppercase tracking-widest text-gray-500">🎬 Studio</span>
                <button onClick={() => setMobileOpen(false)} className="text-gray-600 hover:text-white transition-colors">
                  <FiX size={16}/>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-3 px-3">
                {APP_TABS.map(t => (
                  <button key={t.section} onClick={() => goSection(t.section)}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all mb-0.5"
                    style={activeSection === t.section && !isChildRoute
                      ? { background: A_SOFT, color:'#6EE7B7' }
                      : { color:'#6B7280' }}>
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: activeSection === t.section && !isChildRoute ? ACCENT : 'rgba(255,255,255,0.1)' }}/>
                    <span className="text-xs font-semibold">{t.label}</span>
                  </button>
                ))}
              </div>
              <div className="px-3 py-3 border-t border-white/6 flex-shrink-0">
                <button onClick={() => goSection('script')}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all hover:brightness-110"
                  style={{ background: A_SOFT, color:'#6EE7B7', border:`1px solid ${A_BORDER}` }}>
                  <FiZap size={11}/> Start New Video
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile FAB */}
      <button onClick={() => setMobileOpen(o => !o)}
        className="lg:hidden fixed bottom-6 right-4 z-40 w-11 h-11 rounded-full flex items-center justify-center shadow-xl border"
        style={{ background:'#111', borderColor: A_BORDER, color: ACCENT }}>
        {mobileOpen ? <FiX size={18}/> : <FiMenu size={18}/>}
      </button>
    </div>
  );
}
