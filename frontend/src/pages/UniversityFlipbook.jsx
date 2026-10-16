import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight, FiExternalLink, FiDownload, FiBook } from 'react-icons/fi';

const FLIPBOOKS = [
  {
    id: 'diy-university-guide',
    title: 'How to Use the EOF Ecosystem',
    subtitle: 'DIY University Official Guide',
    desc: 'A complete visual walkthrough of the EOF ecosystem — from first login to building a full creative business. Covers all 8 schools, professor workflow, and the Creator-to-Legacy pipeline.',
    file: '/flipbooks/diy-university-guide.html',
    pages: 12,
    color: '#2563EB',
    icon: '🎓',
    tags: ['Onboarding', 'EOF Ecosystem', 'DIY University'],
  },
];

export default function UniversityFlipbook() {
  const [active, setActive] = useState(FLIPBOOKS[0]);
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <div className="min-h-screen px-4 md:px-6 py-8" style={{ background: '#0d0d0d' }}>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[10px] text-gray-600 mb-5">
        <Link to="/university" className="hover:text-blue-400 transition-colors">DIY University</Link>
        <FiChevronRight size={10} />
        <span className="text-blue-400">Flipbooks</span>
      </div>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg"
            style={{ background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(59,130,246,0.3)' }}>
            <FiBook size={15} style={{ color: '#60A5FA' }} />
          </div>
          <h1 className="font-serif text-2xl text-white font-bold">University Flipbooks</h1>
        </div>
        <p className="text-sm text-gray-500 ml-11">Interactive ebooks and visual guides for EOF students</p>
      </div>

      {/* Book list */}
      <div className="flex flex-wrap gap-3 mb-6">
        {FLIPBOOKS.map(book => (
          <button key={book.id} onClick={() => setActive(book)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all"
            style={active.id === book.id
              ? { background: 'rgba(37,99,235,0.15)', border: `1px solid ${book.color}`, color: '#93C5FD' }
              : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}>
            <span className="text-xl">{book.icon}</span>
            <div className="text-left">
              <p className="text-xs font-bold">{book.title}</p>
              <p className="text-[9px] text-gray-600 mt-0.5">{book.pages} pages</p>
            </div>
            {active.id === book.id && <span className="text-[9px] font-black px-1.5 py-0.5 rounded" style={{ background: 'rgba(37,99,235,0.2)', color: '#93C5FD' }}>Active</span>}
          </button>
        ))}
      </div>

      <div className="flex gap-5 flex-col xl:flex-row">

        {/* Viewer */}
        <div className="flex-1 min-w-0">
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)', background: '#0a0a0a' }}>

            {/* Viewer toolbar */}
            <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-2">
                <span className="text-sm">{active.icon}</span>
                <div>
                  <p className="text-xs font-bold text-white">{active.title}</p>
                  <p className="text-[9px] text-gray-600">{active.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a href={active.file} download
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <FiDownload size={11} /> Download
                </a>
                <a href={active.file} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all"
                  style={{ background: 'rgba(37,99,235,0.12)', color: '#93C5FD', border: '1px solid rgba(37,99,235,0.3)' }}>
                  <FiExternalLink size={11} /> Open Full
                </a>
              </div>
            </div>

            {/* iframe */}
            <div style={{ height: fullscreen ? '80vh' : '560px', position: 'relative' }}>
              <iframe
                src={active.file}
                title={active.title}
                className="w-full h-full border-0"
                style={{ background: '#0d0b14' }}
              />
            </div>
          </div>

          <button onClick={() => setFullscreen(f => !f)}
            className="mt-2 text-[10px] text-gray-700 hover:text-gray-500 transition-colors">
            {fullscreen ? '↕ Normal height' : '↕ Expand viewer'}
          </button>
        </div>

        {/* Sidebar info */}
        <div className="xl:w-56 flex-shrink-0 space-y-4">
          <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-3">About this book</p>
            <p className="text-xs text-gray-400 leading-relaxed">{active.desc}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {active.tags.map(t => (
                <span key={t} className="text-[9px] px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(37,99,235,0.1)', color: '#60A5FA', border: '1px solid rgba(37,99,235,0.2)' }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-4" style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
            <p className="text-[9px] font-black uppercase tracking-widest mb-2" style={{ color: '#60A5FA' }}>Next Steps</p>
            <div className="space-y-2">
              {[
                { label: 'Choose a School', to: '/university' },
                { label: 'Meet Chancellor AI', to: '/university/chancellor' },
                { label: 'Adaptation Engine', to: '/university/adaptation-engine' },
                { label: 'Faculty Roster', to: '/university/roster' },
              ].map(item => (
                <Link key={item.to} to={item.to}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all hover:bg-white/5"
                  style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {item.label}
                  <FiChevronRight size={10} />
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-2">Also Available In</p>
            <a href="/library" className="flex items-center gap-2 text-[10px] text-gray-500 hover:text-gray-300 transition-colors">
              <span>📚</span> EOF Library
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
