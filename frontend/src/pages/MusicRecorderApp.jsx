import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlay, FiPause, FiSquare, FiSkipBack, FiSkipForward,
  FiMic, FiVolume2, FiVolumeX, FiChevronLeft, FiChevronRight,
  FiX, FiCheck, FiEdit2, FiStar, FiDownload, FiSave,
  FiSliders, FiAlertTriangle, FiList, FiGrid,
} from 'react-icons/fi';

// ── Mock Data ───────────────────────────────────────────────────────────────
const TRACKS = [
  { id:'t1', name:'Lead Vocals',  icon:'🎤', vol:82,  pan:0,   color:'#A78BFA', hasContent:true  },
  { id:'t2', name:'Harmonies',    icon:'🎤', vol:68,  pan:-20, color:'#EC4899', hasContent:true  },
  { id:'t3', name:'Beat',         icon:'🥁', vol:88,  pan:0,   color:'#F97316', hasContent:true  },
  { id:'t4', name:'Bass Line',    icon:'🎸', vol:76,  pan:10,  color:'#10B981', hasContent:true  },
  { id:'t5', name:'Keys',         icon:'🎹', vol:60,  pan:-15, color:'#60A5FA', hasContent:false },
  { id:'t6', name:'Ad-libs',      icon:'🎙️', vol:55,  pan:28,  color:'#D4AF37', hasContent:true  },
];

const ARRANGEMENT = [
  { label:'Intro',    bars:4  },
  { label:'Verse 1',  bars:16 },
  { label:'Pre-Hook', bars:8  },
  { label:'Hook',     bars:8  },
  { label:'Verse 2',  bars:16 },
  { label:'Hook',     bars:8  },
  { label:'Bridge',   bars:8  },
  { label:'Outro',    bars:4  },
];

const SECTION_COLORS = {
  Intro:'#60A5FA', 'Verse 1':'#A78BFA', 'Pre-Hook':'#EC4899',
  Hook:'#D4AF37', 'Verse 2':'#A78BFA', Bridge:'#10B981', Outro:'#9CA3AF',
};

const AVATAR_SUGGESTIONS = [
  { id:'architect', name:'The Architect', avatar:'🏗️', color:'#F97316',
    items:[
      { id:'ar1', priority:'high',   tag:'Beat Structure', text:'The hook is hitting on a 4-bar loop but your arrangement shows it sitting over 8 bars. Loop the beat twice or extend the pattern — right now there\'s a dead 4-bar gap behind the vocals.' },
      { id:'ar2', priority:'medium', tag:'Bass Pocket',    text:'The bass line is fighting the kick on beats 2 and 4. Sidechain the bass to duck -6dB for 40ms after every kick hit. Instant pocket.' },
    ]},
  { id:'lyricist', name:'The Lyricist', avatar:'✍️', color:'#A78BFA',
    items:[
      { id:'ly1', priority:'high',   tag:'Hook Rewrite',   text:'The hook\'s second line ends on a weak syllable ("again"). Rewrite it to land on a stressed open vowel — "ablaze," "alive," or "remain" all hit harder rhythmically.' },
      { id:'ly2', priority:'medium', tag:'Verse 2 Flow',   text:'Bar 9 of Verse 2 has 3 extra syllables. Either compress the lyric or break it into a 2-bar phrase. Right now it rushes the melody.' },
    ]},
  { id:'vocal-director', name:'Vocal Director', avatar:'🎤', color:'#EC4899',
    items:[
      { id:'vd1', priority:'high',   tag:'Comp Strategy',  text:'Take 2 has the stronger performance on bars 1-8. Take 4 has the better hook delivery. Comp them together — the stitch point at bar 9 is clean.' },
      { id:'vd2', priority:'medium', tag:'Harmony Stack',  text:'The harmonies are all panned center. Spread them: -30L / center / +30R. It opens the stereo field and lets the lead vocal sit in the pocket.' },
    ]},
  { id:'maestro', name:'The Maestro', avatar:'🎼', color:'#0891B2',
    items:[
      { id:'ma1', priority:'high',   tag:'Arc Continuity', text:'Bridge drops the energy too sharply — the dynamic shift reads as a recording flaw, not an intentional moment. Build 2 bars of filtered transition before the energy drops.' },
    ]},
  { id:'mogul', name:'The Mogul', avatar:'💎', color:'#D4AF37',
    items:[
      { id:'mo1', priority:'medium', tag:'Radio Edit',     text:'Radio edit should be 3:28 max. Current runtime is 4:12. Trim the second verse to 8 bars and cut one outro repeat — you keep the statement and hit the format.' },
    ]},
];

const PRIORITY_COLOR = { high:'#EF4444', medium:'#F59E0B', low:'#10B981' };
const TOTAL_BARS = ARRANGEMENT.reduce((s, a) => s + a.bars, 0); // 72

// ── Waveform bar (fake CSS bars) ────────────────────────────────────────────
function Waveform({ color, hasContent, active }) {
  const BARS = 48;
  return (
    <div className="flex items-center gap-px h-6 w-full">
      {Array.from({ length: BARS }).map((_, i) => {
        const h = hasContent
          ? Math.abs(Math.sin(i * 0.7 + Math.cos(i * 0.4) * 2) * 0.7 + 0.3)
          : 0.05;
        return (
          <div
            key={i}
            className="flex-1 rounded-full transition-all"
            style={{
              height: `${h * 100}%`,
              background: active ? color : `${color}55`,
              minHeight: 1,
            }}
          />
        );
      })}
    </div>
  );
}

// ── Suggestion Card ─────────────────────────────────────────────────────────
function SuggestionCard({ item, color, onRemove }) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(item.text);
  const [dismissed, setDismissed] = useState(false);

  function handle(act) {
    setDismissed(true);
    setTimeout(() => onRemove(item.id, act), 350);
  }

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          layout
          initial={{ opacity:0, y:6 }}
          animate={{ opacity:1, y:0 }}
          exit={{ opacity:0, height:0, marginBottom:0, overflow:'hidden' }}
          transition={{ duration:0.25 }}
          className="rounded-xl border p-3 mb-2"
          style={{ background:'rgba(255,255,255,0.03)', borderColor:`${color}25` }}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
              style={{ background:`${color}18`, color }}>
              {item.tag}
            </span>
            <span className="text-[9px] font-bold"
              style={{ color: PRIORITY_COLOR[item.priority] }}>
              {item.priority.toUpperCase()}
            </span>
          </div>

          {editing ? (
            <textarea
              value={editText}
              onChange={e => setEditText(e.target.value)}
              className="w-full text-[10px] text-white bg-white/5 border border-white/10 rounded-lg p-2 resize-none leading-relaxed outline-none focus:border-white/20"
              rows={3}
            />
          ) : (
            <p className="text-[10px] text-gray-300 leading-relaxed mb-2">{item.text}</p>
          )}

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
export default function MusicRecorderApp() {
  const [tracks, setTracks]             = useState(TRACKS);
  const [isPlaying, setIsPlaying]       = useState(false);
  const [isRecording, setIsRecording]   = useState(false);
  const [playhead, setPlayhead]         = useState(0);
  const [activeTrack, setActiveTrack]   = useState('t1');
  const [suggestions, setSuggestions]   = useState(AVATAR_SUGGESTIONS);
  const [savedItems, setSavedItems]     = useState([]);
  const [openAvatars, setOpenAvatars]   = useState({ architect:true, lyricist:false, 'vocal-director':false, maestro:false, mogul:false });
  const [activeView, setActiveView]     = useState('arrangement');
  const [mutedTracks, setMutedTracks]   = useState(new Set());

  const BAR_PX = 12;
  const TIMELINE_TOTAL = TOTAL_BARS * BAR_PX; // 864px

  const projectName = 'Crown Season — Track 4';
  const totalPending = suggestions.reduce((s, av) => s + av.items.length, 0);

  useEffect(() => {
    if (!isPlaying && !isRecording) return;
    const iv = setInterval(() => {
      setPlayhead(p => {
        if (p >= TIMELINE_TOTAL) { setIsPlaying(false); setIsRecording(false); return 0; }
        return p + 2;
      });
    }, 50);
    return () => clearInterval(iv);
  }, [isPlaying, isRecording, TIMELINE_TOTAL]);

  function fmtBar(px) {
    const bar = Math.floor(px / BAR_PX) + 1;
    return `Bar ${bar}`;
  }

  function handleVolChange(id, vol) {
    setTracks(prev => prev.map(t => t.id === id ? { ...t, vol } : t));
  }
  function handlePanChange(id, pan) {
    setTracks(prev => prev.map(t => t.id === id ? { ...t, pan } : t));
  }
  function toggleMute(id) {
    setMutedTracks(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
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

  return (
    <div className="flex flex-col h-screen text-white overflow-hidden select-none"
      style={{ background:'#0a0a0a', fontFamily:'system-ui, sans-serif' }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 h-12 flex-shrink-0 border-b"
        style={{ background:'#111', borderColor:'rgba(255,255,255,0.08)' }}>
        <Link to="/music-studio"
          className="flex items-center gap-1.5 text-yellow-400 hover:text-yellow-300 transition-colors flex-shrink-0">
          <FiChevronLeft size={14} />
          <span className="text-xs font-bold hidden sm:block">Music Studio</span>
        </Link>
        <div className="w-px h-5 bg-white/10 flex-shrink-0" />
        <span className="text-sm font-bold text-white flex-shrink-0">🎵 Griot Music Recorder</span>
        <span className="text-[10px] text-gray-600 truncate hidden md:block">— {projectName}</span>

        {/* View toggle */}
        <div className="flex items-center gap-1 ml-2">
          {[{ id:'arrangement', label:'Arrangement', icon:<FiGrid size={11}/> },
            { id:'waveform',    label:'Waveform',    icon:<FiList size={11}/> }].map(v => (
            <button key={v.id} onClick={() => setActiveView(v.id)}
              title={v.label}
              className="w-6 h-6 rounded flex items-center justify-center transition-all"
              style={activeView === v.id
                ? { background:'rgba(212,175,55,0.2)', color:'#D4AF37' }
                : { color:'#6B7280' }}>
              {v.icon}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {totalPending > 0 && (
          <div className="flex items-center gap-1 text-[9px] px-2 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 font-bold flex-shrink-0">
            <FiAlertTriangle size={9} />
            {totalPending} suggestions
          </div>
        )}

        {/* Record button */}
        <button
          onClick={() => { setIsRecording(r => !r); setIsPlaying(false); }}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border transition-all flex-shrink-0"
          style={isRecording
            ? { background:'rgba(239,68,68,0.2)', borderColor:'rgba(239,68,68,0.5)', color:'#EF4444', boxShadow:'0 0 12px rgba(239,68,68,0.3)' }
            : { background:'rgba(239,68,68,0.08)', borderColor:'rgba(239,68,68,0.2)', color:'#EF4444' }}>
          <FiMic size={11} />
          {isRecording ? 'Recording…' : 'Record'}
        </button>

        <button className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border border-white/10 text-gray-400 hover:text-white transition-all flex-shrink-0">
          <FiSave size={11} /> Save
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 hover:brightness-110 transition-all flex-shrink-0">
          <FiDownload size={11} /> Export
        </button>
      </div>

      {/* ── Main Content ────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left: Track List ────────────────────────────────────────── */}
        <div className="w-52 flex-shrink-0 flex flex-col border-r overflow-y-auto"
          style={{ background:'#0d0d0d', borderColor:'rgba(255,255,255,0.07)' }}>
          <div className="px-3 py-2 border-b flex items-center justify-between"
            style={{ borderColor:'rgba(255,255,255,0.06)' }}>
            <p className="text-[9px] font-bold tracking-widest uppercase text-gray-600">Tracks</p>
            <button className="text-[9px] text-yellow-500 hover:text-yellow-300 transition-colors font-bold">
              + Add
            </button>
          </div>

          {tracks.map(track => {
            const muted = mutedTracks.has(track.id);
            const isActive = activeTrack === track.id;
            return (
              <div key={track.id}
                className="border-b transition-all cursor-pointer"
                style={{
                  borderColor:'rgba(255,255,255,0.04)',
                  background: isActive ? `${track.color}0a` : 'transparent',
                  borderLeft: isActive ? `2px solid ${track.color}` : '2px solid transparent',
                }}
                onClick={() => setActiveTrack(track.id)}
              >
                <div className="flex items-center gap-2 px-2 pt-2 pb-1">
                  <span className="text-sm leading-none">{track.icon}</span>
                  <span className="text-[10px] font-bold text-white flex-1 truncate">{track.name}</span>
                  <button
                    onClick={e => { e.stopPropagation(); toggleMute(track.id); }}
                    className="transition-colors"
                    title={muted ? 'Unmute' : 'Mute'}
                    style={{ color: muted ? '#EF4444' : '#4B5563' }}>
                    {muted ? <FiVolumeX size={11} /> : <FiVolume2 size={11} />}
                  </button>
                </div>
                {/* Vol + Pan */}
                <div className="px-2 pb-2 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[8px] text-gray-700 w-5">Vol</span>
                    <input type="range" min={0} max={100} value={track.vol}
                      onChange={e => handleVolChange(track.id, +e.target.value)}
                      className="flex-1 h-0.5 accent-current"
                      style={{ accentColor: track.color }}
                      onClick={e => e.stopPropagation()}
                    />
                    <span className="text-[8px] font-mono w-5 text-right"
                      style={{ color: muted ? '#4B5563' : track.color }}>
                      {muted ? 'M' : track.vol}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[8px] text-gray-700 w-5">Pan</span>
                    <input type="range" min={-50} max={50} value={track.pan}
                      onChange={e => handlePanChange(track.id, +e.target.value)}
                      className="flex-1 h-0.5"
                      style={{ accentColor: track.color }}
                      onClick={e => e.stopPropagation()}
                    />
                    <span className="text-[8px] font-mono w-5 text-right text-gray-600">
                      {track.pan > 0 ? `R${track.pan}` : track.pan < 0 ? `L${Math.abs(track.pan)}` : 'C'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Center: Arrangement / Waveform view ─────────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Transport + playhead */}
          <div className="flex items-center gap-3 px-4 h-10 flex-shrink-0 border-b"
            style={{ background:'#0d0d0d', borderColor:'rgba(255,255,255,0.06)' }}>
            <button onClick={() => setPlayhead(0)} className="text-gray-600 hover:text-white transition-colors">
              <FiSkipBack size={13} />
            </button>
            <button
              onClick={() => { setIsPlaying(p => !p); setIsRecording(false); }}
              className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:brightness-110"
              style={{ background:isPlaying ? '#D4AF37' : '#D4AF37', boxShadow:'0 0 12px rgba(212,175,55,0.35)' }}>
              {isPlaying ? <FiPause size={12} /> : <FiPlay size={12} />}
            </button>
            <button onClick={() => { setIsPlaying(false); setIsRecording(false); setPlayhead(0); }}
              className="text-gray-600 hover:text-white transition-colors">
              <FiSquare size={13} />
            </button>
            <button onClick={() => setPlayhead(TIMELINE_TOTAL)} className="text-gray-600 hover:text-white transition-colors">
              <FiSkipForward size={13} />
            </button>
            <span className="text-[10px] font-mono text-yellow-400 ml-1">{fmtBar(playhead)}</span>
            {isRecording && (
              <span className="flex items-center gap-1 text-[9px] text-red-400 ml-2 font-bold animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> REC
              </span>
            )}
          </div>

          {/* Arrangement / Waveform pane */}
          <div className="flex-1 overflow-auto"
            style={{ background:'#0a0a0a' }}>
            {activeView === 'arrangement' ? (
              /* Arrangement view */
              <div style={{ minWidth: TIMELINE_TOTAL + 20, paddingBottom: 16 }}>
                {/* Section labels */}
                <div className="flex items-center h-7 border-b pl-0"
                  style={{ borderColor:'rgba(255,255,255,0.05)' }}>
                  {ARRANGEMENT.map((sec, i) => {
                    const secColor = SECTION_COLORS[sec.label] || '#9CA3AF';
                    return (
                      <div key={i}
                        className="flex items-center justify-center border-r text-[8px] font-bold"
                        style={{
                          width: sec.bars * BAR_PX,
                          minWidth: sec.bars * BAR_PX,
                          height:'100%',
                          borderColor:'rgba(255,255,255,0.07)',
                          background:`${secColor}10`,
                          color: secColor,
                        }}>
                        {sec.label}
                      </div>
                    );
                  })}
                </div>

                {/* Tracks with blocks */}
                {tracks.map((track, ti) => {
                  const muted = mutedTracks.has(track.id);
                  const isActive = activeTrack === track.id;
                  let barOffset = 0;
                  return (
                    <div key={track.id}
                      className="flex items-center relative border-b cursor-pointer"
                      style={{
                        height: 36,
                        borderColor:'rgba(255,255,255,0.04)',
                        background: isActive ? `${track.color}05` : 'transparent',
                      }}
                      onClick={() => setActiveTrack(track.id)}
                    >
                      {ARRANGEMENT.map((sec, si) => {
                        const start = barOffset;
                        barOffset += sec.bars;
                        const hasContent = track.hasContent && ['Hook','Verse 1','Verse 2'].includes(sec.label)
                          ? true
                          : track.hasContent && sec.label !== 'Intro' && sec.label !== 'Outro'
                          ? Math.random() > 0.3
                          : track.hasContent && (si === 0 ? Math.random() > 0.5 : Math.random() > 0.4);
                        const fill = track.hasContent ? true : false;

                        return fill ? (
                          <div key={si}
                            className="absolute top-1 bottom-1 rounded flex items-center overflow-hidden"
                            style={{
                              left: start * BAR_PX + 1,
                              width: sec.bars * BAR_PX - 2,
                              background:`${track.color}${muted ? '15' : '20'}`,
                              border:`1px solid ${track.color}${muted ? '30' : '45'}`,
                            }}>
                            <Waveform
                              color={track.color}
                              hasContent={track.hasContent}
                              active={isActive && !muted}
                            />
                          </div>
                        ) : (
                          <div key={si}
                            className="absolute top-1 bottom-1 border-l border-dashed"
                            style={{ left: start * BAR_PX, width: sec.bars * BAR_PX, borderColor:'rgba(255,255,255,0.04)' }}
                          />
                        );
                      })}
                      {/* Playhead */}
                      <div className="absolute top-0 bottom-0 w-px bg-yellow-400/60 pointer-events-none z-10"
                        style={{ left: playhead }} />
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Waveform view */
              <div className="px-4 py-3 space-y-2">
                {tracks.map(track => {
                  const muted = mutedTracks.has(track.id);
                  const isActive = activeTrack === track.id;
                  return (
                    <div key={track.id}
                      className="rounded-xl border p-3 cursor-pointer transition-all hover:brightness-105"
                      style={{
                        background: isActive ? `${track.color}0d` : 'rgba(255,255,255,0.02)',
                        borderColor: isActive ? `${track.color}40` : 'rgba(255,255,255,0.06)',
                      }}
                      onClick={() => setActiveTrack(track.id)}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-base">{track.icon}</span>
                        <span className="text-xs font-bold" style={{ color: isActive ? track.color : '#fff' }}>
                          {track.name}
                        </span>
                        {muted && <span className="text-[9px] text-red-400 font-bold">MUTED</span>}
                        {!track.hasContent && (
                          <span className="text-[9px] text-gray-600 font-bold ml-auto">NO CONTENT</span>
                        )}
                      </div>
                      <div className="h-10 flex items-center">
                        <Waveform
                          color={track.color}
                          hasContent={track.hasContent}
                          active={isActive && !muted}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Mini mixing panel at bottom */}
          <div className="flex-shrink-0 border-t px-3 py-2"
            style={{ background:'#0d0d0d', borderColor:'rgba(255,255,255,0.07)' }}>
            <div className="flex items-center gap-1">
              <p className="text-[9px] font-bold tracking-widest uppercase text-gray-700 mr-2 flex-shrink-0">
                <FiSliders size={9} className="inline mr-1" />Mix
              </p>
              {tracks.map(track => {
                const muted = mutedTracks.has(track.id);
                return (
                  <div key={track.id} className="flex flex-col items-center gap-0.5" style={{ minWidth: 32 }}>
                    <div className="w-full h-10 relative flex items-end justify-center rounded"
                      style={{ background:'rgba(255,255,255,0.03)' }}>
                      <div className="w-3 rounded-t transition-all"
                        style={{
                          height: `${(track.vol / 100) * 32}px`,
                          background: muted ? '#374151' : track.color,
                          minHeight: 2,
                        }}
                      />
                    </div>
                    <span className="text-[7px] text-gray-700 truncate w-full text-center leading-tight">
                      {track.name.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
              <div className="ml-auto flex items-center gap-3">
                <div className="text-[9px] text-gray-700">
                  BPM: <span className="text-yellow-400 font-mono font-bold">94</span>
                </div>
                <div className="text-[9px] text-gray-700">
                  Key: <span className="text-yellow-400 font-mono font-bold">D min</span>
                </div>
                <div className="text-[9px] text-gray-700">
                  Sig: <span className="text-yellow-400 font-mono font-bold">4/4</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Avatar Suggestion Panel ──────────────────────────── */}
        <div className="w-72 flex-shrink-0 flex flex-col border-l overflow-y-auto"
          style={{ background:'#0d0d0d', borderColor:'rgba(255,255,255,0.07)' }}>
          <div className="px-3 py-2 border-b flex items-center justify-between flex-shrink-0"
            style={{ borderColor:'rgba(255,255,255,0.06)' }}>
            <p className="text-[9px] font-bold tracking-widest uppercase text-gray-600">Studio Team</p>
            {totalPending > 0 && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400 border border-yellow-500/25">
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
                        initial={{ height:0, opacity:0 }}
                        animate={{ height:'auto', opacity:1 }}
                        exit={{ height:0, opacity:0 }}
                        transition={{ duration:0.2 }}
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

            {/* Saved items */}
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

            {totalPending === 0 && savedItems.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <FiCheck size={20} className="text-green-500 mb-2" />
                <p className="text-xs font-bold text-white mb-1">All Caught Up</p>
                <p className="text-[10px] text-gray-600">No pending suggestions from your studio team.</p>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="p-3 border-t flex-shrink-0" style={{ borderColor:'rgba(255,255,255,0.07)' }}>
            <Link to="/music-studio"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all hover:brightness-110"
              style={{ background:'linear-gradient(135deg, #D4AF37, #92400E)', color:'#fff', boxShadow:'0 4px 16px rgba(212,175,55,0.3)' }}>
              🎵 Open Music Studio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
