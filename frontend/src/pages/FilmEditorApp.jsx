import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlay, FiPause, FiSquare, FiSkipBack, FiSkipForward,
  FiScissors, FiChevronLeft, FiChevronRight, FiX, FiCheck,
  FiEdit2, FiStar, FiUpload, FiDownload, FiSave, FiMaximize2,
  FiLayers, FiList, FiGrid, FiZoomIn, FiZoomOut, FiAlertTriangle,
} from 'react-icons/fi';

// ── Mock Data ───────────────────────────────────────────────────────────────
const CLIPS = [
  { id: 'v1', name: 'Opening Wide Shot',  dur: '0:42', icon: '🏙️', type: 'video' },
  { id: 'v2', name: 'Marcus Close-Up',    dur: '1:15', icon: '👤', type: 'video' },
  { id: 'v3', name: 'Market Scene',       dur: '2:08', icon: '🏪', type: 'video' },
  { id: 'v4', name: 'Chase Sequence',     dur: '0:55', icon: '🏃', type: 'video' },
  { id: 'v5', name: 'Night Skyline',      dur: '0:28', icon: '🌃', type: 'video' },
  { id: 'v6', name: 'Council Chamber',    dur: '1:32', icon: '🏛️', type: 'video' },
  { id: 'a1', name: 'Main Theme',         dur: '3:42', icon: '🎵', type: 'audio' },
  { id: 'a2', name: 'Tension Score',      dur: '2:10', icon: '🎶', type: 'audio' },
  { id: 'a3', name: 'Ambient City',       dur: '4:00', icon: '🎧', type: 'audio' },
];

const TIMELINE_TRACKS = [
  { id: 'V1', label: 'Video 1', type: 'video', color: '#3B82F6',
    clips: [{ id:'v3', name:'Market Scene',    x:0,   w:120 },
            { id:'v1', name:'Wide Shot',        x:130, w:80  },
            { id:'v2', name:'Marcus CU',        x:220, w:100 }] },
  { id: 'V2', label: 'Video 2', type: 'video', color: '#6366F1',
    clips: [{ id:'v4', name:'Chase Seq.',       x:320, w:90  },
            { id:'v5', name:'Night Skyline',    x:420, w:55  },
            { id:'v6', name:'Council',          x:485, w:95  }] },
  { id: 'A1', label: 'Audio 1', type: 'audio', color: '#10B981',
    clips: [{ id:'a1', name:'Main Theme',       x:0,   w:480 }] },
  { id: 'A2', label: 'Audio 2', type: 'audio', color: '#059669',
    clips: [{ id:'a3', name:'Ambient City',     x:0,   w:600 }] },
  { id: 'T1', label: 'Titles',  type: 'text',  color: '#9CA3AF',
    clips: [{ id:'t1', name:'TITLE CARD',       x:0,   w:60  }] },
];

const AVATAR_SUGGESTIONS = [
  { id: 'director', name: 'The Director', avatar: '🎬', color: '#EF4444',
    items: [
      { id:'d1', priority:'high',   tag:'Scene Order',    text:'Move Market Scene before the Opening Wide Shot. Opens with culture and community — stronger emotional hook than a landscape.' },
      { id:'d2', priority:'medium', tag:'Pacing',         text:'The Marcus Close-Up holds 3 seconds too long on the final frame. Trim to 1.5s for better forward momentum.' },
    ]},
  { id: 'cinematographer', name: 'The Cinematographer', avatar: '📷', color: '#F59E0B',
    items: [
      { id:'c1', priority:'high',   tag:'Shot Composition', text:'Scene 1 has no wide establishing shot before the close-up sequence. The audience has no geographic orientation — this disorients them.' },
      { id:'c2', priority:'medium', tag:'Color Grade',      text:'Night Skyline reads too cool. Apply a warmer LUT (+15 temperature) to match the emotional warmth of the scene.' },
    ]},
  { id: 'editor', name: 'The Editor', avatar: '✂️', color: '#A78BFA',
    items: [
      { id:'e1', priority:'high',   tag:'Trailer Pacing', text:'Pacing drops at the 47-second mark. Move the Chase Sequence 8s earlier — it restores the energy spike that the trailer needs there.' },
      { id:'e2', priority:'medium', tag:'J-Cut',          text:'Scene 3→4 transition should be a J-cut. Carry Marcus\'s voice 1 second into the next scene before the visual cuts — far smoother.' },
    ]},
  { id: 'producer', name: 'The Producer', avatar: '📋', color: '#10B981',
    items: [
      { id:'p1', priority:'high', tag:'Missing Asset', text:'No continuity shot exists for the Night Skyline sequence. The cut from Scene 4 to Scene 5 will look disconnected without it.' },
    ]},
];

const PRIORITY_COLOR = { high: '#EF4444', medium: '#F59E0B', low: '#10B981' };

// ── Suggestion Card ─────────────────────────────────────────────────────────
function SuggestionCard({ item, color, onRemove }) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(item.text);
  const [dismissed, setDismissed] = useState(false);
  const [action, setAction] = useState(null);

  function handle(act) {
    setAction(act);
    setDismissed(true);
    setTimeout(() => onRemove(item.id, act), 400);
  }

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          layout
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }}
          transition={{ duration: 0.25 }}
          className="rounded-xl border p-3 mb-2"
          style={{ background: 'rgba(255,255,255,0.03)', borderColor: `${color}25` }}
        >
          {/* Tag + Priority */}
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
              style={{ background: `${color}18`, color }}>
              {item.tag}
            </span>
            <span className="text-[9px] font-bold"
              style={{ color: PRIORITY_COLOR[item.priority] }}>
              {item.priority.toUpperCase()}
            </span>
          </div>

          {/* Text or Edit */}
          {editing ? (
            <textarea
              value={editText}
              onChange={e => setEditText(e.target.value)}
              className="w-full text-[10px] text-white bg-white/5 border border-white/10 rounded-lg p-2 resize-none leading-relaxed outline-none focus:border-white/20"
              rows={3}
            />
          ) : (
            <p className="text-[10px] text-gray-300 leading-relaxed mb-2">{editing ? editText : item.text}</p>
          )}

          {/* Action buttons */}
          <div className="flex gap-1 mt-2">
            <button onClick={() => handle('accept')}
              className="flex-1 flex items-center justify-center gap-1 py-1 rounded-lg text-[9px] font-bold border transition-all hover:brightness-110"
              style={{ background:'rgba(16,185,129,0.12)', borderColor:'rgba(16,185,129,0.3)', color:'#10B981' }}>
              <FiCheck size={8} /> Accept
            </button>
            <button onClick={() => handle('deny')}
              className="flex-1 flex items-center justify-center gap-1 py-1 rounded-lg text-[9px] font-bold border transition-all hover:brightness-110"
              style={{ background:'rgba(239,68,68,0.08)', borderColor:'rgba(239,68,68,0.25)', color:'#EF4444' }}>
              <FiX size={8} /> Deny
            </button>
            <button onClick={() => setEditing(e => !e)}
              className="flex-1 flex items-center justify-center gap-1 py-1 rounded-lg text-[9px] font-bold border border-white/10 text-gray-400 hover:text-white transition-all">
              <FiEdit2 size={8} /> Edit
            </button>
            <button onClick={() => handle('save')}
              className="flex-1 flex items-center justify-center gap-1 py-1 rounded-lg text-[9px] font-bold border border-white/10 text-gray-400 hover:text-amber-400 transition-all">
              <FiStar size={8} /> Save
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Main App ────────────────────────────────────────────────────────────────
export default function FilmEditorApp() {
  const [selectedClipId, setSelectedClipId] = useState(null);
  const [playhead, setPlayhead]             = useState(0);
  const [isPlaying, setIsPlaying]           = useState(false);
  const [activeTool, setActiveTool]         = useState('select');
  const [activeView, setActiveView]         = useState('timeline');
  const [suggestions, setSuggestions]       = useState(AVATAR_SUGGESTIONS);
  const [savedItems, setSavedItems]         = useState([]);
  const [openAvatars, setOpenAvatars]       = useState({ director:true, cinematographer:false, editor:false, producer:false });
  const [selectedTrackClip, setSelectedTrackClip] = useState(null);

  const projectName = 'Afrofuture Rising — Ep. 1';
  const TIMELINE_WIDTH = 620;

  useEffect(() => {
    if (!isPlaying) return;
    const iv = setInterval(() => setPlayhead(p => p >= TIMELINE_WIDTH ? 0 : p + 1), 60);
    return () => clearInterval(iv);
  }, [isPlaying]);

  function fmtTime(px) {
    const total = Math.floor((px / TIMELINE_WIDTH) * 360);
    return `${Math.floor(total/60)}:${String(total%60).padStart(2,'0')}`;
  }

  function handleRemove(avatarId, itemId, act) {
    setSuggestions(prev => prev.map(av =>
      av.id !== avatarId ? av : { ...av, items: av.items.filter(i => {
        if (i.id !== itemId) return true;
        if (act === 'save') setSavedItems(s => [...s, { ...i, avatar: av.name, avatarColor: av.color }]);
        return false;
      })}
    ));
  }

  const totalPending = suggestions.reduce((sum, av) => sum + av.items.length, 0);

  return (
    <div className="flex flex-col h-screen text-white overflow-hidden select-none"
      style={{ background:'#0a0a0a', fontFamily:'system-ui, sans-serif' }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 h-12 flex-shrink-0 border-b"
        style={{ background:'#111', borderColor:'rgba(255,255,255,0.08)' }}>
        <Link to="/film-studio"
          className="flex items-center gap-1.5 text-red-400 hover:text-red-300 transition-colors flex-shrink-0">
          <FiChevronLeft size={14} />
          <span className="text-xs font-bold hidden sm:block">Film Studio</span>
        </Link>
        <div className="w-px h-5 bg-white/10 flex-shrink-0" />
        <span className="text-sm font-bold text-white truncate flex-shrink-0">🎬 Griot Film Editor</span>
        <span className="text-[10px] text-gray-600 truncate hidden md:block">— {projectName}</span>

        {/* Tools */}
        <div className="flex items-center gap-1 ml-2">
          {[{ id:'select', icon:'↗', title:'Select' }, { id:'cut', icon:<FiScissors size={11}/>, title:'Cut' }].map(t => (
            <button key={t.id} title={t.title}
              onClick={() => setActiveTool(t.id)}
              className="w-6 h-6 rounded flex items-center justify-center text-xs transition-all"
              style={activeTool === t.id
                ? { background:'rgba(239,68,68,0.25)', color:'#EF4444', border:'1px solid rgba(239,68,68,0.4)' }
                : { background:'rgba(255,255,255,0.05)', color:'#6B7280', border:'1px solid transparent' }}>
              {t.icon}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 ml-1">
          {[{ id:'timeline', icon:<FiList size={11}/> }, { id:'storyboard', icon:<FiGrid size={11}/> }].map(v => (
            <button key={v.id} onClick={() => setActiveView(v.id)}
              className="w-6 h-6 rounded flex items-center justify-center transition-all"
              style={activeView === v.id
                ? { background:'rgba(239,68,68,0.2)', color:'#EF4444' }
                : { color:'#6B7280' }}>
              {v.icon}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {/* Pending alerts badge */}
        {totalPending > 0 && (
          <div className="flex items-center gap-1 text-[9px] px-2 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 font-bold flex-shrink-0">
            <FiAlertTriangle size={9} />
            {totalPending} suggestions
          </div>
        )}

        <button className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all flex-shrink-0">
          <FiSave size={11} /> Save
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border border-red-500/30 bg-red-500/10 text-red-400 hover:brightness-110 transition-all flex-shrink-0">
          <FiDownload size={11} /> Export
        </button>
      </div>

      {/* ── Main Content ────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left: Media Library ─────────────────────────────────────── */}
        <div className="w-48 flex-shrink-0 flex flex-col border-r overflow-y-auto"
          style={{ background:'#0d0d0d', borderColor:'rgba(255,255,255,0.07)' }}>
          <div className="px-3 py-2 border-b" style={{ borderColor:'rgba(255,255,255,0.06)' }}>
            <p className="text-[9px] font-bold tracking-widest uppercase text-gray-600">Media Library</p>
          </div>

          {/* Upload */}
          <button className="mx-2 mt-2 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-dashed border-white/10 text-[10px] text-gray-600 hover:text-gray-400 hover:border-white/20 transition-all">
            <FiUpload size={10} /> Add Clips
          </button>

          {/* Video clips */}
          <p className="text-[8px] font-bold tracking-widest uppercase text-gray-700 px-3 pt-3 pb-1">
            Video ({CLIPS.filter(c=>c.type==='video').length})
          </p>
          {CLIPS.filter(c=>c.type==='video').map(clip => (
            <button
              key={clip.id}
              onClick={() => setSelectedClipId(clip.id)}
              className="flex items-center gap-2 px-3 py-1.5 text-left transition-all hover:bg-white/4"
              style={selectedClipId===clip.id
                ? { background:'rgba(239,68,68,0.1)', borderLeft:'2px solid #EF4444' }
                : { borderLeft:'2px solid transparent' }}
            >
              <span className="text-sm leading-none flex-shrink-0">{clip.icon}</span>
              <div className="min-w-0">
                <p className="text-[10px] text-gray-300 truncate leading-tight">{clip.name}</p>
                <p className="text-[9px] text-gray-600">{clip.dur}</p>
              </div>
            </button>
          ))}

          {/* Audio clips */}
          <p className="text-[8px] font-bold tracking-widest uppercase text-gray-700 px-3 pt-3 pb-1">
            Audio ({CLIPS.filter(c=>c.type==='audio').length})
          </p>
          {CLIPS.filter(c=>c.type==='audio').map(clip => (
            <button
              key={clip.id}
              onClick={() => setSelectedClipId(clip.id)}
              className="flex items-center gap-2 px-3 py-1.5 text-left transition-all hover:bg-white/4"
              style={selectedClipId===clip.id
                ? { background:'rgba(16,185,129,0.1)', borderLeft:'2px solid #10B981' }
                : { borderLeft:'2px solid transparent' }}
            >
              <span className="text-sm leading-none flex-shrink-0">{clip.icon}</span>
              <div className="min-w-0">
                <p className="text-[10px] text-gray-300 truncate leading-tight">{clip.name}</p>
                <p className="text-[9px] text-gray-600">{clip.dur}</p>
              </div>
            </button>
          ))}
        </div>

        {/* ── Center: Preview + Timeline ──────────────────────────────── */}
        <div className="flex flex-col flex-1 overflow-hidden">

          {/* Preview window */}
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-3"
            style={{ background:'#0d0d0d', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
            <div className="relative w-full max-w-xl rounded-xl overflow-hidden flex-shrink-0"
              style={{ aspectRatio:'16/9', background:'#000', border:'1px solid rgba(255,255,255,0.08)' }}>
              {/* Fake video frame */}
              <div className="absolute inset-0 flex items-center justify-center"
                style={{ background:'linear-gradient(135deg, #1a0a2e 0%, #0a0a1a 50%, #0a1a0a 100%)' }}>
                <div className="text-center">
                  <div className="text-5xl mb-2 opacity-40">
                    {selectedClipId ? CLIPS.find(c=>c.id===selectedClipId)?.icon || '🎬' : '🎬'}
                  </div>
                  <p className="text-[10px] text-gray-600">
                    {selectedClipId ? CLIPS.find(c=>c.id===selectedClipId)?.name : 'Afrofuture Rising — Scene 3'}
                  </p>
                </div>
              </div>
              {/* Timecode overlay */}
              <div className="absolute bottom-2 left-2 font-mono text-[10px] text-white/60 bg-black/50 px-2 py-0.5 rounded">
                {fmtTime(playhead)} / {fmtTime(TIMELINE_WIDTH)}
              </div>
              {/* REC indicator */}
              <div className="absolute top-2 right-2 flex items-center gap-1 text-[9px] text-red-400 bg-black/60 px-2 py-0.5 rounded">
                <span className={`w-1.5 h-1.5 rounded-full bg-red-500 ${isPlaying ? 'animate-pulse':''}`} />
                {isPlaying ? 'PLAYING' : 'PAUSED'}
              </div>
            </div>

            {/* Transport controls */}
            <div className="flex items-center gap-3 mt-3">
              <button onClick={() => setPlayhead(0)} className="text-gray-600 hover:text-white transition-colors">
                <FiSkipBack size={14} />
              </button>
              <button
                onClick={() => setIsPlaying(p => !p)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:brightness-110"
                style={{ background:'#EF4444', boxShadow:'0 0 16px rgba(239,68,68,0.4)' }}>
                {isPlaying ? <FiPause size={14} /> : <FiPlay size={14} />}
              </button>
              <button onClick={() => setPlayhead(TIMELINE_WIDTH)} className="text-gray-600 hover:text-white transition-colors">
                <FiSkipForward size={14} />
              </button>
              <span className="text-[10px] font-mono text-gray-500 ml-2">{fmtTime(playhead)}</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="h-52 flex-shrink-0 overflow-hidden"
            style={{ background:'#0a0a0a', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
            {/* Timeline header */}
            <div className="flex items-center gap-2 px-3 h-7 border-b"
              style={{ borderColor:'rgba(255,255,255,0.06)' }}>
              <p className="text-[9px] font-bold tracking-widest uppercase text-gray-600">Timeline</p>
              <div className="flex-1" />
              <button className="text-gray-700 hover:text-white transition-colors"><FiZoomOut size={11} /></button>
              <div className="w-12 h-1 bg-white/10 rounded-full">
                <div className="h-full w-1/2 bg-red-500/50 rounded-full" />
              </div>
              <button className="text-gray-700 hover:text-white transition-colors"><FiZoomIn size={11} /></button>
            </div>

            {/* Track area */}
            <div className="overflow-x-auto overflow-y-auto h-[calc(100%-28px)]">
              <div style={{ minWidth: 680 }}>
                {/* Time ruler */}
                <div className="flex items-center h-5 border-b"
                  style={{ borderColor:'rgba(255,255,255,0.05)', marginLeft:80, position:'relative' }}>
                  {[0,1,2,3,4,5,6].map(i => (
                    <div key={i} className="flex-1 text-center text-[8px] text-gray-700 font-mono border-l"
                      style={{ borderColor:'rgba(255,255,255,0.05)' }}>
                      {i}:00
                    </div>
                  ))}
                  {/* Playhead on ruler */}
                  <div className="absolute top-0 bottom-0 w-px bg-red-500 pointer-events-none"
                    style={{ left: (playhead / TIMELINE_WIDTH) * 100 + '%', marginLeft: 80 }} />
                </div>

                {/* Tracks */}
                {TIMELINE_TRACKS.map(track => (
                  <div key={track.id} className="flex items-center h-8 border-b"
                    style={{ borderColor:'rgba(255,255,255,0.04)' }}>
                    {/* Track label */}
                    <div className="w-20 px-2 flex-shrink-0 flex items-center gap-1.5">
                      <div className="w-1.5 h-3 rounded-sm flex-shrink-0" style={{ background: track.color }} />
                      <span className="text-[9px] text-gray-500 truncate">{track.label}</span>
                    </div>
                    {/* Clip area */}
                    <div className="relative flex-1 h-full" style={{ minWidth: TIMELINE_WIDTH }}>
                      {track.clips.map((clip, ci) => (
                        <button
                          key={ci}
                          onClick={() => setSelectedTrackClip(clip.id)}
                          className="absolute top-0.5 bottom-0.5 rounded flex items-center px-1.5 transition-all hover:brightness-110"
                          style={{
                            left: clip.x,
                            width: clip.w,
                            background: selectedTrackClip === clip.id
                              ? track.color
                              : `${track.color}60`,
                            border: `1px solid ${track.color}80`,
                          }}
                        >
                          <span className="text-[8px] text-white/90 font-medium truncate leading-none">
                            {clip.name || clip.label}
                          </span>
                        </button>
                      ))}
                      {/* Playhead line */}
                      <div className="absolute top-0 bottom-0 w-px bg-red-500/70 pointer-events-none"
                        style={{ left: playhead }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Avatar Suggestion Panel ──────────────────────────── */}
        <div className="w-72 flex-shrink-0 flex flex-col border-l overflow-y-auto"
          style={{ background:'#0d0d0d', borderColor:'rgba(255,255,255,0.07)' }}>
          <div className="px-3 py-2 border-b flex items-center justify-between flex-shrink-0"
            style={{ borderColor:'rgba(255,255,255,0.06)' }}>
            <p className="text-[9px] font-bold tracking-widest uppercase text-gray-600">Avatar Studio</p>
            {totalPending > 0 && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/25">
                {totalPending} pending
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {suggestions.map(av => {
              const isOpen = openAvatars[av.id];
              return (
                <div key={av.id} className="border-b" style={{ borderColor:'rgba(255,255,255,0.05)' }}>
                  <button
                    onClick={() => setOpenAvatars(p => ({ ...p, [av.id]: !p[av.id] }))}
                    className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-white/3 transition-colors"
                  >
                    <span className="text-lg leading-none">{av.avatar}</span>
                    <span className="text-xs font-bold text-white flex-1 text-left">{av.name}</span>
                    {av.items.length > 0 && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background:`${av.color}18`, color:av.color }}>
                        {av.items.length}
                      </span>
                    )}
                    <FiChevronRight size={11} className="text-gray-600 transition-transform"
                      style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }} />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 pb-2">
                          {av.items.length === 0 ? (
                            <p className="text-[10px] text-gray-700 italic py-1">All suggestions reviewed.</p>
                          ) : (
                            av.items.map(item => (
                              <SuggestionCard
                                key={item.id}
                                item={item}
                                color={av.color}
                                onRemove={(id, act) => handleRemove(av.id, id, act)}
                              />
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            {/* Saved suggestions */}
            {savedItems.length > 0 && (
              <div className="px-3 py-3">
                <p className="text-[9px] font-bold tracking-widest uppercase text-gray-600 mb-2 flex items-center gap-1">
                  <FiStar size={9} className="text-amber-400" /> Saved ({savedItems.length})
                </p>
                {savedItems.map((item, i) => (
                  <div key={i} className="rounded-lg border border-white/6 bg-white/2 p-2 mb-1.5">
                    <p className="text-[9px] font-semibold text-amber-400 mb-0.5">{item.avatar} · {item.tag}</p>
                    <p className="text-[9px] text-gray-500 leading-snug">{item.text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {totalPending === 0 && savedItems.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <FiCheck size={20} className="text-green-500 mb-2" />
                <p className="text-xs font-bold text-white mb-1">All Caught Up</p>
                <p className="text-[10px] text-gray-600">No pending suggestions from your studio team.</p>
              </div>
            )}
          </div>

          {/* Chat CTA */}
          <div className="p-3 border-t flex-shrink-0" style={{ borderColor:'rgba(255,255,255,0.07)' }}>
            <Link to="/film-studio"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all hover:brightness-110"
              style={{ background:'linear-gradient(135deg, #EF4444, #991B1B)', color:'#fff', boxShadow:'0 4px 16px rgba(239,68,68,0.3)' }}>
              🎬 Open Film Studio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
