import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowLeft, FiPlay, FiUsers, FiFilm, FiMic,
  FiStar, FiList, FiShare2, FiCamera,
  FiPackage, FiMessageCircle, FiEdit2,
  FiUpload, FiCopy, FiCheck, FiPlus, FiUser,
  FiRefreshCw, FiChevronRight, FiSave, FiMail,
  FiCalendar, FiChevronDown, FiChevronUp, FiZap,
  FiTrash2, FiClock, FiDollarSign, FiMusic,
  FiX, FiAlertTriangle, FiGlobe,
} from 'react-icons/fi';

const ACCENT = '#10B981';
const GOLD   = '#D4AF37';
const PURPLE = '#8B5CF6';
const RED    = '#EF4444';

// ── utils ──────────────────────────────────────────────────────────────────────
function useFlash(ms = 1800) {
  const [on, setOn] = useState(false);
  const flash = () => { setOn(true); setTimeout(() => setOn(false), ms); };
  return [on, flash];
}
function today() { return new Date().toISOString().split('T')[0]; }
function lsGet(key, fb) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fb; } catch { return fb; } }
function lsSet(key, v)  { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }

// ── shared UI ─────────────────────────────────────────────────────────────────
function Pill({ label, color = ACCENT }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider flex-shrink-0"
      style={{ background:`${color}18`, color, border:`1px solid ${color}30` }}>{label}</span>
  );
}
function SH({ label, color = ACCENT, icon }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      {icon && <span style={{ color }}>{icon}</span>}
      <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color:`${color}99` }}>{label}</span>
    </div>
  );
}
function Card({ children, color = ACCENT, className = '' }) {
  return (
    <div className={`rounded-2xl p-5 ${className}`} style={{ background:`${color}06`, border:`1px solid ${color}20` }}>
      {children}
    </div>
  );
}

// ── data seeds ─────────────────────────────────────────────────────────────────
const STEP_CYCLE = { pending:'active', active:'done', done:'pending' };

const STEPS_SEED = [
  { id:1,  label:'Series Bible',       status:'done',    doneAt:'2026-06-20' },
  { id:2,  label:'Episode 1 Outline',  status:'done',    doneAt:'2026-06-22' },
  { id:3,  label:'Script Draft',       status:'active',  doneAt:null },
  { id:4,  label:'Guest Outreach',     status:'active',  doneAt:null },
  { id:5,  label:'Community Question', status:'pending', doneAt:null },
  { id:6,  label:'B-Roll Collection',  status:'pending', doneAt:null },
  { id:7,  label:'Interview Shoot',    status:'pending', doneAt:null },
  { id:8,  label:'Rough Cut',          status:'pending', doneAt:null },
  { id:9,  label:'Final Edit',         status:'pending', doneAt:null },
  { id:10, label:'Export & Publish',   status:'pending', doneAt:null },
];

const GUESTS_SEED = [
  { id:1, name:'', role:'', email:'', social:'', date:'', notes:'', status:'Open' },
  { id:2, name:'', role:'', email:'', social:'', date:'', notes:'', status:'Open' },
  { id:3, name:'', role:'', email:'', social:'', date:'', notes:'', status:'Open' },
  { id:4, name:'', role:'', email:'', social:'', date:'', notes:'', status:'Open' },
];

const EPISODES_SEED = [
  { id:1, num:1, title:'My First Love', question:'"When did hip-hop become your first love?"',       status:'production', airDate:'', published:false, ytUrl:'', tiktokUrl:'', eofUrl:'' },
  { id:2, num:2, title:'Episode 2',     question:'"Who changed your life through music?"',           status:'planned',    airDate:'', published:false, ytUrl:'', tiktokUrl:'', eofUrl:'' },
  { id:3, num:3, title:'Episode 3',     question:'"What is the greatest hip-hop album ever made?"', status:'planned',    airDate:'', published:false, ytUrl:'', tiktokUrl:'', eofUrl:'' },
  { id:4, num:4, title:'Episode 4',     question:'"What lyric still gives you chills?"',            status:'planned',    airDate:'', published:false, ytUrl:'', tiktokUrl:'', eofUrl:'' },
  { id:5, num:5, title:'Episode 5',     question:'"What moment changed hip-hop forever?"',          status:'planned',    airDate:'', published:false, ytUrl:'', tiktokUrl:'', eofUrl:'' },
  { id:6, num:6, title:'Episode 6',     question:'"What does hip-hop mean in your community?"',     status:'planned',    airDate:'', published:false, ytUrl:'', tiktokUrl:'', eofUrl:'' },
];

const BROLL_SEED = [
  'B-roll','Historic Photos','Newspaper Headlines','Album Artwork',
  'Performance Footage','Concert Clips','Music Video Clips','Animated Maps',
  'Lower-Third Graphics','Lyric Animations','Motion Graphics','VHS Transitions',
  'Vinyl Animations','Cassette Graphics','Beat Visualizers','Waveform Animations',
  'On-Screen Quotes','Timeline Graphics',
].map((label, i) => ({ id:i, label, status:'needed' }));

const ICONS_BROLL = ['🎞️','📸','📰','💿','🎬','🎤','🎵','🗺️','📍','✍️','⚙️','📼','🎚️','📟','🎛️','〰️','💬','📅'];

const MUSIC_SEED = [
  { id:1, track:'',                          artist:'',             type:'Background', status:'needed', notes:'' },
  { id:2, track:'',                          artist:'',             type:'Featured',   status:'needed', notes:'' },
];

const BUDGET_SEED = [
  { id:1, item:'Talent / Guest Fees',   estimated:0, actual:0, note:'Volunteers / community' },
  { id:2, item:'Music Licensing',       estimated:0, actual:0, note:'Free-use / original'    },
  { id:3, item:'Graphics & Animation',  estimated:0, actual:0, note:'DIY open-source tools'  },
  { id:4, item:'Equipment',             estimated:0, actual:0, note:'Existing gear'           },
  { id:5, item:'Platform Distribution', estimated:0, actual:0, note:'Free tier accounts'      },
  { id:6, item:'Miscellaneous',         estimated:0, actual:0, note:''                        },
];

const MFL_AGENTS = [
  { id:'director', name:'AI Video Director', avatar:'📹', color:ACCENT, items:[
    { id:'d1', priority:'high',   tag:'Hook Structure',  text:'Open with a community response clip first — viewer emotional connection peaks in seconds 1–30. Cut to narration at 0:31.' },
    { id:'d2', priority:'medium', tag:'Visual Pacing',   text:'Scene 4 (DJ Kool Herc) runs long in the outline. Insert 3 quick B-roll cuts at the 7-minute mark to reset audience attention.' },
    { id:'d3', priority:'low',    tag:'VHS Transition',  text:'Use VHS-style transitions between decade jumps (70s → 80s → 90s) — matches the documentary aesthetic and earns authenticity.' },
  ]},
  { id:'script', name:'AI Script Intelligence', avatar:'✍️', color:'#34D399', items:[
    { id:'s1', priority:'high',   tag:'Episode Length',  text:'Current outline maps to ~72 min for TV cut. Cut Scene 8 (Fifth Element) to 4 min from 7 — it\'s a bridge section, not a headline.' },
    { id:'s2', priority:'medium', tag:'EP2 Hook',        text:'Close Episode 1 with a 30-second teaser: "Next time — who changed your life through music?" Drives 40%+ more EP2 viewers.' },
  ]},
  { id:'voice', name:'AI Voice Director', avatar:'🎙️', color:PURPLE, items:[
    { id:'v1', priority:'medium', tag:'Energy Arc',      text:'Narration energy: Scene 1 at 75%, build to 90% by Scene 4 (Herc), peak 100% at Scene 6 (Flash). Then settle at 80% for the global close.' },
  ]},
  { id:'editor', name:'AI Editor', avatar:'✂️', color:'#3B82F6', items:[
    { id:'e1', priority:'high',   tag:'Social Cuts',     text:'Community response clips: max 45 seconds each for TikTok/Reels extraction. Flag any longer responses for edit before final cut.' },
    { id:'e2', priority:'medium', tag:'Caption Style',   text:'Use bold white caps on black pill background for captions. 22px, centered, 20% above bottom. Outperforms in mobile viewing tests.' },
  ]},
];

const BIBLE_SECTIONS = [
  { title:'Format', content:'45–60 min TV premiere. 90–120 min VOD director\'s cut. Each episode covers one central hip-hop history theme through narration, featured interviews, archival footage, and community voices.' },
  { title:'Tone & Style', content:'VH1 documentary meets Netflix music doc meets community conversation. The narrator guides — the people tell the story. Every episode should feel personal, educational, and celebratory.' },
  { title:'Visual Identity', content:'High contrast blacks. Gold accents for historical eras. Emerald green for current-day moments. VHS transitions between decades. Waveform animations for audio-only community submissions.' },
  { title:'Guest Criteria', content:'3–4 featured guests per episode: mix of industry (artists, producers, DJs) and community (fans, educators, historians). Each answers 4 core interview questions. No green room — real environments.' },
  { title:'Community Integration', content:'Each episode has one central community question. Responses accepted via video, audio, photo, or written. 5–10 selected responses woven into the final cut. Full credits on screen.' },
  { title:'Episode Arc Structure', content:'1. Historical context (narration + archival) → 2. Featured interviews (woven throughout) → 3. Community voices → 4. Independent artist spotlight → 5. Hip-Hop Quotable → 6. Next episode tease.' },
  { title:'Distribution Model', content:'Premiere on EOF Streaming + YouTube simultaneously. Shorts cut for TikTok and Instagram within 48 hours of premiere. Podcast audio exported to EOF Radio and Spotify. Blog recap on EOF Website.' },
  { title:'Series Goal', content:'Permanent archive of hip-hop culture. 12-episode first season. Each episode a standalone documentary that also functions as part of a larger narrative. Library quality — built to last 50 years.' },
];

const EP1_SCRIPT_TEMPLATE = `MY FIRST LOVE — Episode 1: My First Love
Hip-Hop History Documentary Series
══════════════════════════════════════════

CENTRAL QUESTION: "When did hip-hop become your first love?"

────────────────────────────────────────
SCENE 01 · THE BRONX IN THE 1970s
────────────────────────────────────────
[B-ROLL: Archival footage, South Bronx streets, 1970s]
[NARRATOR]:


────────────────────────────────────────
SCENE 02 · WHY HIP-HOP EMERGED
────────────────────────────────────────
[B-ROLL: Community centers, block parties]
[NARRATOR]:


────────────────────────────────────────
SCENE 03 · THE ROLE OF BLOCK PARTIES
────────────────────────────────────────
[B-ROLL: Archival block party footage]
[NARRATOR]:


────────────────────────────────────────
SCENE 04 · DJ KOOL HERC
────────────────────────────────────────
[B-ROLL: Photos, archival clips]
[NARRATOR]:


────────────────────────────────────────
SCENE 05 · AFRIKA BAMBAATAA
────────────────────────────────────────
[B-ROLL: Universal Zulu Nation footage]
[NARRATOR]:


────────────────────────────────────────
SCENE 06 · GRANDMASTER FLASH
────────────────────────────────────────
[B-ROLL: Performance footage]
[NARRATOR]:


────────────────────────────────────────
SCENE 07 · THE ORIGINAL FOUR ELEMENTS
────────────────────────────────────────
[B-ROLL: DJing, MCing, breakdancing, graffiti]
[NARRATOR]:


────────────────────────────────────────
SCENE 08 · THE FIFTH ELEMENT: KNOWLEDGE
────────────────────────────────────────
[B-ROLL: Community, education, culture]
[NARRATOR]:


────────────────────────────────────────
SCENE 09 · HIP-HOP SPREADS ACROSS AMERICA
────────────────────────────────────────
[B-ROLL: Cities, radio stations, record stores]
[NARRATOR]:


────────────────────────────────────────
SCENE 10 · A GLOBAL CULTURE
────────────────────────────────────────
[B-ROLL: International hip-hop footage]
[NARRATOR]:


════════════════════════════════════════
FEATURED INTERVIEW QUESTIONS (All Guests)
════════════════════════════════════════
Q1: "What is your first hip-hop memory?"
Q2: "Who was the first artist who inspired you?"
Q3: "Why did hip-hop change your life?"
Q4: "What does hip-hop represent today?"

════════════════════════════════════════
COMMUNITY QUESTION (Episode 1)
════════════════════════════════════════
"When did hip-hop become your first love?"
`;

const COMMUNITY_QUESTIONS = [
  { q:'"When did hip-hop become your first love?"',      ep:'EP 1' },
  { q:'"Who changed your life through music?"',          ep:'EP 2' },
  { q:'"What is the greatest hip-hop album ever made?"', ep:'EP 3' },
  { q:'"What lyric still gives you chills?"',            ep:'EP 4' },
  { q:'"What moment changed hip-hop forever?"',          ep:'EP 5' },
  { q:'"What does hip-hop mean in your community?"',     ep:'EP 6' },
];

const SUBMISSION_TYPES = [
  { icon:'📱', label:'Vertical Video',    sub:'Instagram / TikTok format'   },
  { icon:'🎬', label:'Horizontal Video',  sub:'YouTube / streaming format'   },
  { icon:'🎙️', label:'Audio Recording',   sub:'MP3, WAV, or voice memo'      },
  { icon:'📸', label:'Photos',            sub:'With animated waveform'       },
  { icon:'✍️', label:'Written Response',  sub:'Displayed as on-screen quote' },
  { icon:'🔗', label:'Social Media Clip', sub:'With permission from creator' },
];

const PIPELINE = [
  { icon:'📺', label:'Full Premiere Episode',        cat:'primary',   color:RED,      section:'editor' },
  { icon:'🎬', label:'Extended VOD Edition',          cat:'primary',   color:RED,      section:'editor' },
  { icon:'🎙️', label:'Podcast Episode',               cat:'audio',     color:PURPLE,   section:'voice'  },
  { icon:'🎤', label:'3–4 Complete Interview Videos', cat:'video',     color:ACCENT,   section:'editor' },
  { icon:'📱', label:'10–20 Social Media Clips',      cat:'social',    color:'#EC4899',section:'export' },
  { icon:'▶️', label:'5–10 YouTube Shorts',           cat:'social',    color:RED,      section:'export' },
  { icon:'💎', label:'Hip-Hop Quotable Segment',      cat:'segment',   color:GOLD,     section:'script' },
  { icon:'🎵', label:'Behind the Bars Segment',       cat:'segment',   color:GOLD,     section:'script' },
  { icon:'🌟', label:'Independent Spotlight',         cat:'segment',   color:GOLD,     section:'script' },
  { icon:'👥', label:'Community Voices Compilation',  cat:'community', color:PURPLE,   section:'editor' },
  { icon:'🚀', label:'Promotional Trailers',          cat:'marketing', color:ACCENT,   section:'export' },
  { icon:'🎭', label:'Behind-the-Scenes Featurette',  cat:'marketing', color:ACCENT,   section:'editor' },
];

const PLATFORMS = [
  { icon:'▶️', label:'YouTube',       sub:'Full + Shorts',  to:null,          ext:'https://youtube.com'   },
  { icon:'🎵', label:'TikTok',        sub:'Clips + Series', to:null,          ext:'https://tiktok.com'    },
  { icon:'📷', label:'Instagram',     sub:'Reels + Feed',   to:null,          ext:'https://instagram.com' },
  { icon:'📺', label:'EOF Streaming', sub:'Premiere + VOD', to:'/streaming',  ext:null                    },
  { icon:'🎙️', label:'EOF Radio',     sub:'Audio Podcast',  to:'/radio',      ext:null                    },
  { icon:'🔊', label:'Spotify',       sub:'Podcast',        to:null,          ext:'https://spotify.com'   },
  { icon:'📱', label:'Facebook',      sub:'Video + Clips',  to:null,          ext:'https://facebook.com'  },
  { icon:'🌐', label:'EOF Website',   sub:'Blog + Embed',   to:'/',           ext:null                    },
];

// ── Intro overlay ──────────────────────────────────────────────────────────────
function IntroOverlay({ onDismiss }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1=setTimeout(()=>setPhase(1),400);
    const t2=setTimeout(()=>setPhase(2),1400);
    const t3=setTimeout(()=>setPhase(3),2600);
    return ()=>{ clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  },[]);
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.4}}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{background:'linear-gradient(135deg,#040404 0%,#080808 50%,#060606 100%)'}}
      onClick={phase>=3?onDismiss:undefined}>
      <motion.div initial={{scaleX:0}} animate={{scaleX:phase>=1?1:0}} transition={{duration:0.8}}
        className="absolute top-0 left-0 right-0 h-px origin-left"
        style={{background:`linear-gradient(90deg,transparent,${GOLD},transparent)`}}/>
      <AnimatePresence>
        {phase>=1&&<motion.p initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="text-[9px] font-black uppercase tracking-[0.5em] mb-6" style={{color:`${GOLD}60`}}>
          EOF Faceless Videos · Documentary Series</motion.p>}
      </AnimatePresence>
      <AnimatePresence>
        {phase>=1&&<motion.h1 initial={{opacity:0,y:20,letterSpacing:'0.5em'}} animate={{opacity:1,y:0,letterSpacing:'0.15em'}} transition={{duration:0.9}}
          className="text-6xl md:text-8xl font-black text-white text-center leading-none mb-2" style={{textShadow:`0 0 60px ${GOLD}30`}}>MY FIRST</motion.h1>}
      </AnimatePresence>
      <AnimatePresence>
        {phase>=1&&<motion.h1 initial={{opacity:0,y:20,letterSpacing:'0.5em'}} animate={{opacity:1,y:0,letterSpacing:'0.15em'}} transition={{duration:0.9,delay:0.15}}
          className="text-6xl md:text-8xl font-black text-center leading-none mb-8" style={{color:GOLD,textShadow:`0 0 80px ${GOLD}50`}}>LOVE</motion.h1>}
      </AnimatePresence>
      <AnimatePresence>
        {phase>=2&&<motion.div initial={{scaleX:0,opacity:0}} animate={{scaleX:1,opacity:1}} transition={{duration:0.5}} className="w-16 h-px mb-8" style={{background:`${GOLD}60`}}/>}
      </AnimatePresence>
      <AnimatePresence>
        {phase>=2&&<motion.p initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.7}}
          className="text-base md:text-lg text-gray-300 font-medium text-center max-w-md px-8 leading-relaxed mb-2">
          "When did hip-hop become your first love?"</motion.p>}
      </AnimatePresence>
      <AnimatePresence>
        {phase>=2&&<motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.5,delay:0.3}}
          className="text-[10px] text-center mb-12" style={{color:`${ACCENT}70`}}>A Hip-Hop History Documentary Series</motion.p>}
      </AnimatePresence>
      <AnimatePresence>
        {phase>=3&&<motion.button initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.5}} onClick={onDismiss}
          className="flex items-center gap-2 px-8 py-3 rounded-full text-sm font-bold transition-all hover:brightness-125"
          style={{background:`${GOLD}18`,color:GOLD,border:`1px solid ${GOLD}40`}}>
          <FiPlay size={13}/> Enter Series Hub</motion.button>}
      </AnimatePresence>
      <motion.p initial={{opacity:0}} animate={{opacity:phase>=3?0.3:0}} transition={{duration:0.5,delay:0.5}}
        className="absolute bottom-8 text-[9px] text-gray-700">click anywhere to enter</motion.p>
      <motion.div initial={{scaleX:0}} animate={{scaleX:phase>=1?1:0}} transition={{duration:0.8}}
        className="absolute bottom-0 left-0 right-0 h-px origin-right"
        style={{background:`linear-gradient(90deg,transparent,${GOLD},transparent)`}}/>
    </motion.div>
  );
}

// ── GAP 1: B-Roll Sourcing Tracker ────────────────────────────────────────────
const BROLL_CYCLE = { needed:'sourced', sourced:'licensed', licensed:'needed' };
const BROLL_COLOR = { needed:'#4B5563', sourced:GOLD, licensed:ACCENT };

function BRollTracker() {
  const [items, setItems] = useState(()=>lsGet('mfl-broll', BROLL_SEED));
  const [saved, setSaved] = useState(false);
  function cycle(id) { setItems(it=>it.map(i=>i.id===id?{...i,status:BROLL_CYCLE[i.status]}:i)); }
  function save() { lsSet('mfl-broll',items); setSaved(true); setTimeout(()=>setSaved(false),2000); }
  const sourced  = items.filter(i=>i.status==='sourced').length;
  const licensed = items.filter(i=>i.status==='licensed').length;
  const done     = sourced+licensed;
  return (
    <Card color={PURPLE}>
      <div className="flex items-center justify-between mb-3">
        <SH label="B-Roll & Visual Elements" color={PURPLE} icon={<FiFilm size={13}/>}/>
        <div className="flex items-center gap-3">
          <span className="text-[9px] text-gray-600">{done}/{items.length} sourced</span>
          <button onClick={save}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-bold transition-all"
            style={{background:saved?`${ACCENT}18`:`${PURPLE}12`,color:saved?ACCENT:PURPLE,border:`1px solid ${saved?ACCENT:PURPLE}25`}}>
            {saved?<><FiCheck size={9}/>Saved</>:<><FiSave size={9}/>Save</>}
          </button>
        </div>
      </div>
      <div className="h-1.5 rounded-full bg-white/6 overflow-hidden mb-4">
        <motion.div className="h-full rounded-full" style={{background:ACCENT}}
          initial={{width:0}} animate={{width:`${(done/items.length)*100}%`}} transition={{duration:0.5}}/>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {items.map((item,i)=>{
          const c=BROLL_COLOR[item.status];
          return (
            <button key={item.id} onClick={()=>cycle(item.id)}
              className="flex items-center gap-1.5 p-2 rounded-xl border text-left transition-all hover:brightness-110"
              style={{background:`${c}08`,borderColor:`${c}20`}}>
              <span className="text-sm flex-shrink-0">{ICONS_BROLL[i]}</span>
              <div className="min-w-0">
                <p className="text-[9px] font-semibold truncate" style={{color:c==='#4B5563'?'#6B7280':c}}>{item.label}</p>
                <p className="text-[7px] font-bold uppercase" style={{color:`${c}80`}}>{item.status}</p>
              </div>
            </button>
          );
        })}
      </div>
      <p className="text-[9px] text-gray-800 mt-3">Click to cycle: Needed → Sourced → Licensed</p>
    </Card>
  );
}

// ── GAP 2: Music & Licensing Tracker ─────────────────────────────────────────
const MUSIC_STATUS_COLOR = { needed:'#4B5563', requested:GOLD, cleared:ACCENT, rejected:RED, 'free-use':'#34D399' };
const MUSIC_STATUS_CYCLE = { needed:'requested', requested:'cleared', cleared:'free-use', 'free-use':'needed', rejected:'needed' };

function MusicTracker() {
  const [tracks, setTracks] = useState(()=>lsGet('mfl-music',[...MUSIC_SEED]));
  const [saved, setSaved]   = useState(false);
  function addTrack() { setTracks(t=>[...t,{id:Date.now(),track:'',artist:'',type:'Background',status:'needed',notes:''}]); }
  function remove(id) { setTracks(t=>t.filter(x=>x.id!==id)); }
  function update(id,f,v){ setTracks(t=>t.map(x=>x.id===id?{...x,[f]:v}:x)); }
  function cycle(id){ setTracks(t=>t.map(x=>x.id===id?{...x,status:MUSIC_STATUS_CYCLE[x.status]}:x)); }
  function save(){ lsSet('mfl-music',tracks); setSaved(true); setTimeout(()=>setSaved(false),2000); }
  const cleared = tracks.filter(t=>t.status==='cleared'||t.status==='free-use').length;
  return (
    <Card color={GOLD}>
      <div className="flex items-center justify-between mb-3">
        <SH label="Music & Licensing" color={GOLD} icon={<FiMusic size={13}/>}/>
        <div className="flex gap-2">
          <span className="text-[9px] text-gray-600">{cleared}/{tracks.length} cleared</span>
          <button onClick={addTrack}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-bold transition-all hover:brightness-110"
            style={{background:`${GOLD}12`,color:GOLD,border:`1px solid ${GOLD}25`}}>
            <FiPlus size={9}/>Add
          </button>
          <button onClick={save}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-bold transition-all"
            style={{background:saved?`${ACCENT}18`:`${GOLD}12`,color:saved?ACCENT:GOLD,border:`1px solid ${saved?ACCENT:GOLD}25`}}>
            {saved?<><FiCheck size={9}/>Saved</>:<><FiSave size={9}/>Save</>}
          </button>
        </div>
      </div>
      <div className="space-y-2">
        {tracks.map(t=>{
          const sc=MUSIC_STATUS_COLOR[t.status]||'#4B5563';
          return (
            <div key={t.id} className="flex items-center gap-2 p-2.5 rounded-xl border border-white/6 bg-white/2">
              <input value={t.track} onChange={e=>update(t.id,'track',e.target.value)}
                placeholder="Track name…"
                className="flex-1 bg-transparent text-[10px] font-semibold text-white placeholder-gray-700 outline-none min-w-0"/>
              <input value={t.artist} onChange={e=>update(t.id,'artist',e.target.value)}
                placeholder="Artist…"
                className="w-24 bg-transparent text-[9px] text-gray-500 placeholder-gray-800 outline-none"/>
              <select value={t.type} onChange={e=>update(t.id,'type',e.target.value)}
                className="bg-transparent text-[9px] text-gray-600 outline-none border-none cursor-pointer">
                {['Background','Featured','Transition','Intro','Outro'].map(o=><option key={o} value={o}>{o}</option>)}
              </select>
              <button onClick={()=>cycle(t.id)}
                className="text-[8px] font-black px-2 py-0.5 rounded-full flex-shrink-0 transition-all hover:brightness-125"
                style={{background:`${sc}15`,color:sc,border:`1px solid ${sc}25`}}>
                {t.status}
              </button>
              <button onClick={()=>remove(t.id)} className="text-gray-800 hover:text-red-500 transition-colors">
                <FiTrash2 size={9}/>
              </button>
            </div>
          );
        })}
      </div>
      <p className="text-[9px] text-gray-800 mt-3">Click status to cycle: Needed → Requested → Cleared / Free-Use</p>
    </Card>
  );
}

// ── GAP 3: Budget Tracker ─────────────────────────────────────────────────────
function BudgetTracker() {
  const [rows, setRows]   = useState(()=>lsGet('mfl-budget',[...BUDGET_SEED]));
  const [saved, setSaved] = useState(false);
  function update(id,f,v){ setRows(r=>r.map(x=>x.id===id?{...x,[f]:v}:x)); }
  function save(){ lsSet('mfl-budget',rows); setSaved(true); setTimeout(()=>setSaved(false),2000); }
  const totalEst = rows.reduce((s,r)=>s+(Number(r.estimated)||0),0);
  const totalAct = rows.reduce((s,r)=>s+(Number(r.actual)||0),0);
  return (
    <Card color={ACCENT}>
      <div className="flex items-center justify-between mb-3">
        <SH label="Episode 1 Budget" color={ACCENT} icon={<FiDollarSign size={13}/>}/>
        <button onClick={save}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-bold transition-all"
          style={{background:saved?`${ACCENT}18`:`${ACCENT}10`,color:ACCENT,border:`1px solid ${ACCENT}25`}}>
          {saved?<><FiCheck size={9}/>Saved</>:<><FiSave size={9}/>Save</>}
        </button>
      </div>
      <div className="space-y-1.5 mb-3">
        <div className="grid grid-cols-12 gap-1 text-[8px] font-black uppercase tracking-widest text-gray-700 px-1 mb-1">
          <span className="col-span-5">Line Item</span>
          <span className="col-span-2 text-right">Est.</span>
          <span className="col-span-2 text-right">Actual</span>
          <span className="col-span-3">Note</span>
        </div>
        {rows.map(r=>(
          <div key={r.id} className="grid grid-cols-12 gap-1 items-center px-1">
            <span className="col-span-5 text-[10px] font-semibold text-gray-400">{r.item}</span>
            <div className="col-span-2 flex items-center gap-0.5">
              <span className="text-[9px] text-gray-700">$</span>
              <input type="number" value={r.estimated} onChange={e=>update(r.id,'estimated',e.target.value)}
                className="w-full bg-white/3 border border-white/8 rounded px-1 py-0.5 text-[9px] text-right text-gray-300 outline-none"/>
            </div>
            <div className="col-span-2 flex items-center gap-0.5">
              <span className="text-[9px] text-gray-700">$</span>
              <input type="number" value={r.actual} onChange={e=>update(r.id,'actual',e.target.value)}
                className="w-full bg-white/3 border border-white/8 rounded px-1 py-0.5 text-[9px] text-right text-gray-300 outline-none"/>
            </div>
            <input value={r.note} onChange={e=>update(r.id,'note',e.target.value)}
              className="col-span-3 bg-transparent text-[9px] text-gray-700 placeholder-gray-800 outline-none truncate"
              placeholder="note…"/>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-white/8">
        <span className="text-[10px] font-black text-white">Total</span>
        <div className="flex gap-4">
          <span className="text-[10px] font-bold" style={{color:ACCENT}}>Est. ${totalEst.toLocaleString()}</span>
          <span className="text-[10px] font-bold text-white">Actual ${totalAct.toLocaleString()}</span>
        </div>
      </div>
    </Card>
  );
}

// ── GAP 4: AI Agent Suggestions Panel ────────────────────────────────────────
const P_COLOR = { high:RED, medium:GOLD, low:'#6B7280' };

function AgentCard({ item, color, onRemove }) {
  const [done, setDone] = useState(false);
  function act(a){ setDone(true); setTimeout(()=>onRemove(item.id,a),350); }
  return (
    <AnimatePresence>
      {!done&&(
        <motion.div layout initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} exit={{opacity:0,height:0,overflow:'hidden'}}
          transition={{duration:0.2}}
          className="rounded-xl border p-3 mb-2" style={{background:'rgba(255,255,255,0.03)',borderColor:`${color}25`}}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{background:`${color}18`,color}}>{item.tag}</span>
            <span className="text-[9px] font-bold" style={{color:P_COLOR[item.priority]}}>{item.priority.toUpperCase()}</span>
          </div>
          <p className="text-[10px] text-gray-300 leading-relaxed mb-2">{item.text}</p>
          <div className="flex gap-1">
            {[['Accept','#10B981'],['Deny','#EF4444'],['Save','#F59E0B']].map(([label,c])=>(
              <button key={label} onClick={()=>act(label.toLowerCase())}
                className="flex-1 py-1 rounded-lg text-[9px] font-bold border transition-all hover:brightness-110"
                style={{background:`${c}12`,borderColor:`${c}30`,color:c}}>{label}</button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AgentSuggestions() {
  const [agents, setAgents] = useState(()=>lsGet('mfl-agents',MFL_AGENTS));
  const [open, setOpen]     = useState({director:true,script:false,voice:false,editor:false});
  const [saved, setSaved]   = useState([]);
  function removeItem(agId,itemId,act){
    setAgents(ag=>ag.map(a=>{
      if(a.id!==agId) return a;
      const item=a.items.find(i=>i.id===itemId);
      if(act==='save'&&item) setSaved(s=>[...s,{...item,agentName:a.name,color:a.color}]);
      return {...a,items:a.items.filter(i=>i.id!==itemId)};
    }));
    lsSet('mfl-agents',agents);
  }
  const total=agents.reduce((s,a)=>s+a.items.length,0);
  return (
    <Card color={PURPLE}>
      <div className="flex items-center justify-between mb-4">
        <SH label="AI Agent Suggestions" color={PURPLE} icon={<FiZap size={13}/>}/>
        {total>0&&<Pill label={`${total} pending`} color={PURPLE}/>}
      </div>
      {agents.map(ag=>(
        <div key={ag.id} className="mb-2 border rounded-xl overflow-hidden" style={{borderColor:'rgba(255,255,255,0.06)'}}>
          <button onClick={()=>setOpen(o=>({...o,[ag.id]:!o[ag.id]}))}
            className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-white/3 transition-colors">
            <span className="text-base leading-none">{ag.avatar}</span>
            <span className="text-xs font-bold text-white flex-1 text-left">{ag.name}</span>
            {ag.items.length>0&&<span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
              style={{background:`${ag.color}18`,color:ag.color}}>{ag.items.length}</span>}
            <FiChevronRight size={10} className="text-gray-600 transition-transform"
              style={{transform:open[ag.id]?'rotate(90deg)':'rotate(0)'}}/>
          </button>
          <AnimatePresence>
            {open[ag.id]&&(
              <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}}
                exit={{height:0,opacity:0}} transition={{duration:0.18}} className="overflow-hidden">
                <div className="px-3 pb-2 pt-1">
                  {ag.items.length===0
                    ?<p className="text-[10px] text-gray-700 italic py-1">All suggestions reviewed.</p>
                    :ag.items.map(item=><AgentCard key={item.id} item={item} color={ag.color} onRemove={(id,act)=>removeItem(ag.id,id,act)}/>)
                  }
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
      {saved.length>0&&(
        <div className="mt-2 pt-2 border-t border-white/6">
          <p className="text-[9px] font-bold text-gray-600 mb-2 flex items-center gap-1">
            <FiStar size={9} className="text-amber-400"/> Saved ({saved.length})
          </p>
          {saved.map((s,i)=>(
            <div key={i} className="rounded-lg border border-white/6 bg-white/2 p-2 mb-1">
              <p className="text-[9px] font-semibold mb-0.5" style={{color:s.color}}>{s.agentName} · {s.tag}</p>
              <p className="text-[9px] text-gray-500 leading-snug">{s.text}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

// ── GAP 5: Submission Counter ─────────────────────────────────────────────────
function SubmissionCounter() {
  const [count, setCount] = useState(()=>lsGet('mfl-sub-count',0));
  const [byType, setByType] = useState(()=>lsGet('mfl-sub-types',{
    'Vertical Video':0,'Horizontal Video':0,'Audio Recording':0,'Photos':0,'Written Response':0,'Social Media Clip':0
  }));
  function add(type){
    const nc={...byType,[type]:(byType[type]||0)+1};
    setByType(nc); lsSet('mfl-sub-types',nc);
    const n=count+1; setCount(n); lsSet('mfl-sub-count',n);
  }
  function reset(){
    const z={};Object.keys(byType).forEach(k=>z[k]=0);
    setByType(z); lsSet('mfl-sub-types',z);
    setCount(0); lsSet('mfl-sub-count',0);
  }
  return (
    <Card color={PURPLE}>
      <div className="flex items-center justify-between mb-4">
        <SH label="Submission Tracker" color={PURPLE} icon={<FiMessageCircle size={13}/>}/>
        <div className="flex items-center gap-3">
          <span className="text-2xl font-black" style={{color:PURPLE}}>{count}</span>
          <span className="text-[9px] text-gray-600">received</span>
          <button onClick={reset} className="text-[8px] text-gray-700 hover:text-gray-500 transition-colors">Reset</button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {SUBMISSION_TYPES.map(s=>(
          <button key={s.label} onClick={()=>add(s.label)}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-white/6 bg-white/2 hover:bg-white/5 hover:border-purple-500/30 transition-all group">
            <span className="text-xl">{s.icon}</span>
            <p className="text-[9px] font-bold text-gray-400 group-hover:text-white transition-colors text-center leading-tight">{s.label}</p>
            <span className="text-[10px] font-black" style={{color:PURPLE}}>{byType[s.label]||0}</span>
          </button>
        ))}
      </div>
      <p className="text-[9px] text-gray-800 mt-3">Click a type to log a received submission</p>
    </Card>
  );
}

// ── Guest Tracker ─────────────────────────────────────────────────────────────
const STATUS_OPTS  = ['Open','Invited','Confirmed','Recorded','Delivered'];
const STATUS_COLOR = { Open:'#4B5563', Invited:GOLD, Confirmed:ACCENT, Recorded:PURPLE, Delivered:'#EC4899' };

function SendInviteBtn({ disabled, color }) {
  const [sent, flash] = useFlash(2000);
  return (
    <button onClick={!disabled?flash:undefined} disabled={disabled}
      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-bold transition-all"
      style={{background:sent?`${ACCENT}18`:`${color}10`,color:sent?ACCENT:disabled?'#374151':color,
              border:`1px solid ${sent?ACCENT:disabled?'rgba(255,255,255,0.05)':color}25`,cursor:disabled?'not-allowed':'pointer'}}>
      {sent?<><FiCheck size={9}/>Invite Sent!</>:<><FiMail size={9}/>Send Invite</>}
    </button>
  );
}

function GuestTracker() {
  const [guests, setGuests] = useState(()=>lsGet('mfl-guests',GUESTS_SEED));
  const [expanded, setExpanded] = useState({});
  const [saved, setSaved] = useState(false);
  function update(id,f,v){ setGuests(gs=>gs.map(g=>g.id===id?{...g,[f]:v}:g)); }
  function nextStatus(id){ setGuests(gs=>gs.map(g=>{ if(g.id!==id)return g; const idx=STATUS_OPTS.indexOf(g.status); return {...g,status:STATUS_OPTS[(idx+1)%STATUS_OPTS.length]}; })); }
  function addGuest(){ setGuests(gs=>[...gs,{id:Date.now(),name:'',role:'',email:'',social:'',date:'',notes:'',status:'Open'}]); }
  function removeGuest(id){ setGuests(gs=>gs.filter(g=>g.id!==id)); }
  function toggleExpand(id){ setExpanded(e=>({...e,[id]:!e[id]})); }
  function save(){ lsSet('mfl-guests',guests); setSaved(true); setTimeout(()=>setSaved(false),2000); }
  return (
    <Card color={PURPLE}>
      <div className="flex items-center justify-between mb-4">
        <SH label="Guest Tracker — Episode 1" color={PURPLE} icon={<FiUsers size={13}/>}/>
        <div className="flex gap-2">
          <button onClick={addGuest}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-bold hover:brightness-110 transition-all"
            style={{background:`${PURPLE}12`,color:PURPLE,border:`1px solid ${PURPLE}25`}}>
            <FiPlus size={9}/>Add
          </button>
          <button onClick={save}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-bold transition-all"
            style={{background:saved?`${ACCENT}18`:`${PURPLE}15`,color:saved?ACCENT:PURPLE,border:`1px solid ${saved?ACCENT:PURPLE}25`}}>
            {saved?<><FiCheck size={9}/>Saved</>:<><FiSave size={9}/>Save</>}
          </button>
        </div>
      </div>
      <div className="space-y-2">
        {guests.map((g,i)=>{
          const sc=STATUS_COLOR[g.status]||'#4B5563';
          return (
            <div key={g.id} className="rounded-xl border border-white/6 bg-white/2 overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2">
                <span className="text-[9px] font-black w-5 text-center flex-shrink-0" style={{color:`${PURPLE}60`}}>{i+1}</span>
                <input value={g.name} onChange={e=>update(g.id,'name',e.target.value)} placeholder="Guest name…"
                  className="flex-1 bg-transparent text-[11px] font-semibold text-white placeholder-gray-700 outline-none min-w-0"/>
                <input value={g.role} onChange={e=>update(g.id,'role',e.target.value)} placeholder="Role…"
                  className="w-24 bg-transparent text-[9px] text-gray-500 placeholder-gray-800 outline-none"/>
                <button onClick={()=>nextStatus(g.id)}
                  className="text-[8px] font-black px-2 py-0.5 rounded-full flex-shrink-0 hover:brightness-125 transition-all"
                  style={{background:`${sc}18`,color:sc,border:`1px solid ${sc}25`}}>{g.status}</button>
                <button onClick={()=>toggleExpand(g.id)} className="text-gray-700 hover:text-gray-400 transition-colors flex-shrink-0">
                  {expanded[g.id]?<FiChevronUp size={11}/>:<FiChevronDown size={11}/>}
                </button>
                <button onClick={()=>removeGuest(g.id)} className="text-gray-800 hover:text-red-500 transition-colors flex-shrink-0">
                  <FiTrash2 size={10}/>
                </button>
              </div>
              <AnimatePresence>
                {expanded[g.id]&&(
                  <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.18}} className="overflow-hidden">
                    <div className="px-3 pb-3 space-y-2 border-t border-white/6 pt-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-1.5">
                          <FiMail size={9} className="text-gray-700 flex-shrink-0"/>
                          <input value={g.email} onChange={e=>update(g.id,'email',e.target.value)} placeholder="email@example.com"
                            className="flex-1 bg-white/3 border border-white/8 rounded-lg px-2 py-1 text-[9px] text-gray-400 placeholder-gray-700 outline-none"/>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] text-gray-700">@</span>
                          <input value={g.social} onChange={e=>update(g.id,'social',e.target.value)} placeholder="social handle"
                            className="flex-1 bg-white/3 border border-white/8 rounded-lg px-2 py-1 text-[9px] text-gray-400 placeholder-gray-700 outline-none"/>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FiCalendar size={9} className="text-gray-700"/>
                        <input type="date" value={g.date} onChange={e=>update(g.id,'date',e.target.value)}
                          className="bg-white/3 border border-white/8 rounded-lg px-2 py-1 text-[9px] text-gray-400 outline-none"/>
                        <span className="text-[9px] text-gray-700">Interview date</span>
                      </div>
                      <textarea value={g.notes} onChange={e=>update(g.id,'notes',e.target.value)} placeholder="Notes…" rows={2}
                        className="w-full bg-white/3 border border-white/8 rounded-lg px-2 py-1.5 text-[9px] text-gray-400 placeholder-gray-700 outline-none resize-none leading-relaxed"/>
                      <SendInviteBtn disabled={!g.email&&!g.social} color={PURPLE}/>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
      <p className="text-[9px] text-gray-800 mt-3">Click status badge to cycle · ↕ expand for details · Save persists to browser</p>
    </Card>
  );
}

// ── Clickable Production Tracker ──────────────────────────────────────────────
function ProdTracker() {
  const [steps, setSteps] = useState(()=>lsGet('mfl-prod-steps',STEPS_SEED));
  const [saved, setSaved] = useState(false);
  function cycleStep(id){ setSteps(ss=>ss.map(s=>{ if(s.id!==id)return s; const next=STEP_CYCLE[s.status]; return{...s,status:next,doneAt:next==='done'?today():null}; })); }
  function save(){ lsSet('mfl-prod-steps',steps); setSaved(true); setTimeout(()=>setSaved(false),2000); }
  function reset(){ const f=STEPS_SEED.map(s=>({...s})); setSteps(f); lsSet('mfl-prod-steps',f); }
  const doneCount=steps.filter(s=>s.status==='done').length;
  const activeCount=steps.filter(s=>s.status==='active').length;
  const pct=Math.round((doneCount/steps.length)*100);
  return (
    <Card color={ACCENT}>
      <div className="flex items-center justify-between mb-3">
        <SH label="Production Steps" color={ACCENT} icon={<FiZap size={13}/>}/>
        <div className="flex gap-2">
          <button onClick={reset} className="text-[8px] text-gray-700 hover:text-gray-500 transition-colors px-1">Reset</button>
          <button onClick={save}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-bold transition-all"
            style={{background:saved?`${ACCENT}18`:`${ACCENT}10`,color:ACCENT,border:`1px solid ${ACCENT}25`}}>
            {saved?<><FiCheck size={9}/>Saved</>:<><FiSave size={9}/>Save</>}
          </button>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9px] font-bold text-gray-600">{doneCount}/{steps.length} complete · {activeCount} in progress</span>
          <span className="text-[10px] font-black" style={{color:ACCENT}}>{pct}%</span>
        </div>
        <div className="h-2 rounded-full bg-white/6 overflow-hidden">
          <motion.div className="h-full rounded-full" style={{background:ACCENT}}
            initial={{width:0}} animate={{width:`${pct}%`}} transition={{duration:0.5}}/>
        </div>
      </div>
      <div className="space-y-1.5">
        {steps.map((step,i)=>{
          const c=step.status==='done'?ACCENT:step.status==='active'?GOLD:'#4B5563';
          return (
            <button key={step.id} onClick={()=>cycleStep(step.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all hover:brightness-110 text-left group"
              style={{background:`${c}06`,border:`1px solid ${c}18`}}>
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-black"
                style={{background:`${c}20`,color:c,border:`1px solid ${c}40`}}>
                {step.status==='done'?'✓':i+1}
              </div>
              <p className="flex-1 text-[11px] font-semibold" style={{color:step.status==='done'?ACCENT:step.status==='active'?GOLD:'#6B7280'}}>{step.label}</p>
              {step.doneAt&&<span className="text-[8px] text-gray-700">{step.doneAt}</span>}
              <span className="text-[8px] font-black opacity-0 group-hover:opacity-60 transition-opacity flex-shrink-0" style={{color:c}}>
                {step.status==='pending'?'→ Active':step.status==='active'?'→ Done':'→ Reset'}
              </span>
              <Pill label={step.status==='done'?'Done':step.status==='active'?'In Progress':'Pending'} color={c}/>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

// ── Episode Notes ─────────────────────────────────────────────────────────────
function EpisodeNotes() {
  const [notes, setNotes] = useState(()=>lsGet('mfl-ep1-notes',''));
  const [saved, setSaved] = useState(false);
  function save(){ lsSet('mfl-ep1-notes',notes); setSaved(true); setTimeout(()=>setSaved(false),2000); }
  return (
    <Card color={GOLD}>
      <div className="flex items-center justify-between mb-3">
        <SH label="Episode 1 Production Notes" color={GOLD} icon={<FiEdit2 size={13}/>}/>
        <button onClick={save}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-bold transition-all flex-shrink-0"
          style={{background:saved?`${ACCENT}18`:`${GOLD}15`,color:saved?ACCENT:GOLD,border:`1px solid ${saved?ACCENT:GOLD}25`}}>
          {saved?<><FiCheck size={9}/>Saved</>:<><FiSave size={9}/>Save Notes</>}
        </button>
      </div>
      <textarea value={notes} onChange={e=>setNotes(e.target.value)}
        placeholder="Production notes — shot ideas, guest notes, script reminders, timing notes…" rows={6}
        className="w-full bg-white/3 border border-white/8 rounded-xl p-3 text-[11px] text-gray-300 placeholder-gray-700 outline-none resize-none leading-relaxed focus:border-white/15 transition-colors"/>
    </Card>
  );
}

// ── GAP 7: Series Bible ───────────────────────────────────────────────────────
function SeriesBible() {
  const [open, setOpen] = useState({ Format:true });
  return (
    <Card color={GOLD}>
      <SH label="Series Bible" color={GOLD} icon={<FiStar size={13}/>}/>
      <div className="space-y-2">
        {BIBLE_SECTIONS.map(s=>(
          <div key={s.title} className="rounded-xl border border-white/8 overflow-hidden">
            <button onClick={()=>setOpen(o=>({...o,[s.title]:!o[s.title]}))}
              className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-white/3 transition-colors">
              <span className="text-[11px] font-bold text-white">{s.title}</span>
              {open[s.title]?<FiChevronUp size={11} className="text-gray-600"/>:<FiChevronDown size={11} className="text-gray-600"/>}
            </button>
            <AnimatePresence>
              {open[s.title]&&(
                <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.18}} className="overflow-hidden">
                  <p className="px-3 pb-3 text-[11px] text-gray-400 leading-relaxed border-t border-white/6 pt-2">{s.content}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── GAP 8: Episodes Manager (with published status + platform links) ───────────
const EP_STATUS_COLOR = { production:ACCENT, planned:'#4B5563', complete:PURPLE, paused:GOLD };
const EP_STATUS_CYCLE = { planned:'production', production:'complete', complete:'paused', paused:'planned' };

function EpisodesTab({ episodes, setEpisodes }) {
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newQ, setNewQ] = useState('');
  const [pubOpen, setPubOpen] = useState({});
  const [saved, setSaved] = useState(false);

  function save(){ lsSet('mfl-episodes',episodes); setSaved(true); setTimeout(()=>setSaved(false),2000); }
  function updateEp(id,f,v){ setEpisodes(eps=>eps.map(e=>e.id===id?{...e,[f]:v}:e)); }
  function cycleStatus(id){ setEpisodes(eps=>eps.map(e=>e.id===id?{...e,status:EP_STATUS_CYCLE[e.status]}:e)); }
  function togglePub(id){ setEpisodes(eps=>eps.map(e=>e.id===id?{...e,published:!e.published,status:!e.published?'complete':e.status}:e)); }
  function removeEp(id){ if(episodes.length<=1)return; setEpisodes(eps=>eps.filter(e=>e.id!==id)); }
  function addEpisode(){
    if(!newTitle.trim())return;
    const ep={id:Date.now(),num:episodes.length+1,title:newTitle,question:newQ||'"TBD"',status:'planned',airDate:'',published:false,ytUrl:'',tiktokUrl:'',eofUrl:''};
    setEpisodes(eps=>[...eps,ep]);
    setNewTitle(''); setNewQ(''); setAdding(false);
  }

  const inProd   = episodes.filter(e=>e.status==='production').length;
  const complete = episodes.filter(e=>e.published).length;
  const planned  = episodes.filter(e=>e.status==='planned').length;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-3">
        {[
          {label:'Total',         val:episodes.length, color:'#6B7280'},
          {label:'In Production', val:inProd,           color:ACCENT   },
          {label:'Published',     val:complete,         color:PURPLE   },
          {label:'Planned',       val:planned,          color:'#4B5563'},
        ].map(s=>(
          <div key={s.label} className="rounded-xl p-3 text-center"
            style={{background:`${s.color}08`,border:`1px solid ${s.color}20`}}>
            <p className="text-2xl font-black" style={{color:s.color}}>{s.val}</p>
            <p className="text-[9px] text-gray-600 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {episodes.map(ep=>{
          const sc=EP_STATUS_COLOR[ep.status]||'#4B5563';
          return (
            <div key={ep.id} className="rounded-2xl border border-white/6 bg-white/2 hover:bg-white/3 transition-all overflow-hidden">
              <div className="flex items-start gap-3 p-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0"
                  style={{background:`${sc}15`,color:sc,border:`1px solid ${sc}25`}}>{ep.num}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <input value={ep.title} onChange={e=>updateEp(ep.id,'title',e.target.value)}
                      className="flex-1 bg-transparent text-sm font-black text-white placeholder-gray-700 outline-none min-w-0" placeholder="Episode title…"/>
                    {ep.published&&<Pill label="Published" color={PURPLE}/>}
                    <button onClick={()=>cycleStatus(ep.id)}
                      className="text-[8px] font-black px-2 py-0.5 rounded-full flex-shrink-0 hover:brightness-125 transition-all"
                      style={{background:`${sc}15`,color:sc,border:`1px solid ${sc}25`}}>{ep.status}</button>
                    <button onClick={()=>removeEp(ep.id)} className="text-gray-800 hover:text-red-500 transition-colors flex-shrink-0">
                      <FiTrash2 size={10}/>
                    </button>
                  </div>
                  <input value={ep.question} onChange={e=>updateEp(ep.id,'question',e.target.value)}
                    className="w-full bg-transparent text-[10px] text-gray-500 placeholder-gray-700 outline-none mb-2" placeholder="Community question…"/>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <FiCalendar size={9} className="text-gray-700"/>
                      <input type="date" value={ep.airDate} onChange={e=>updateEp(ep.id,'airDate',e.target.value)}
                        className="bg-transparent text-[9px] text-gray-600 outline-none"/>
                    </div>
                    <button onClick={()=>{ togglePub(ep.id); setPubOpen(o=>({...o,[ep.id]:!ep.published})); }}
                      className="flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-lg transition-all hover:brightness-110"
                      style={{background:ep.published?`${PURPLE}15`:`${ACCENT}10`,color:ep.published?PURPLE:ACCENT,border:`1px solid ${ep.published?PURPLE:ACCENT}25`}}>
                      {ep.published?<><FiCheck size={9}/>Published</>:<><FiGlobe size={9}/>Mark Published</>}
                    </button>
                    <button onClick={()=>setPubOpen(o=>({...o,[ep.id]:!o[ep.id]}))}
                      className="text-[9px] text-gray-700 hover:text-gray-400 transition-colors">
                      Platform links {pubOpen[ep.id]?'▲':'▼'}
                    </button>
                  </div>
                </div>
              </div>
              <AnimatePresence>
                {pubOpen[ep.id]&&(
                  <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.18}} className="overflow-hidden">
                    <div className="px-4 pb-4 pt-0 space-y-2 border-t border-white/6">
                      {[
                        {icon:'▶️',placeholder:'YouTube URL',field:'ytUrl'},
                        {icon:'🎵',placeholder:'TikTok URL', field:'tiktokUrl'},
                        {icon:'📺',placeholder:'EOF Streaming URL',field:'eofUrl'},
                      ].map(p=>(
                        <div key={p.field} className="flex items-center gap-2">
                          <span className="text-sm flex-shrink-0">{p.icon}</span>
                          <input value={ep[p.field]} onChange={e=>updateEp(ep.id,p.field,e.target.value)}
                            placeholder={p.placeholder}
                            className="flex-1 bg-white/3 border border-white/8 rounded-lg px-2 py-1.5 text-[10px] text-gray-400 placeholder-gray-700 outline-none"/>
                          {ep[p.field]&&<a href={ep[p.field]} target="_blank" rel="noreferrer"
                            className="text-gray-600 hover:text-white transition-colors"><FiGlobe size={11}/></a>}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {adding&&(
          <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}
            className="rounded-2xl p-4 border border-white/10 bg-white/3">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-3">New Episode</p>
            <input value={newTitle} onChange={e=>setNewTitle(e.target.value)} placeholder="Episode title…"
              className="w-full bg-white/4 border border-white/8 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-700 outline-none mb-2"/>
            <input value={newQ} onChange={e=>setNewQ(e.target.value)} placeholder="Community question (optional)…"
              className="w-full bg-white/4 border border-white/8 rounded-xl px-3 py-2 text-[11px] text-white placeholder-gray-700 outline-none mb-3"/>
            <div className="flex gap-2">
              <button onClick={addEpisode}
                className="flex-1 py-2 rounded-xl text-[11px] font-bold transition-all hover:brightness-110"
                style={{background:`${ACCENT}18`,color:ACCENT,border:`1px solid ${ACCENT}30`}}>Add Episode</button>
              <button onClick={()=>setAdding(false)}
                className="px-4 py-2 rounded-xl text-[11px] font-bold text-gray-600 border border-white/10 hover:text-gray-400 transition-all">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-3">
        <button onClick={()=>setAdding(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[11px] font-bold transition-all hover:brightness-110"
          style={{background:`${ACCENT}12`,color:ACCENT,border:`1px solid ${ACCENT}25`}}>
          <FiPlus size={12}/>Add Episode
        </button>
        <button onClick={save}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[11px] font-bold transition-all"
          style={{background:saved?`${ACCENT}18`:'rgba(255,255,255,0.04)',color:saved?ACCENT:'#6B7280',border:`1px solid ${saved?ACCENT:'rgba(255,255,255,0.08)'}`}}>
          {saved?<><FiCheck size={11}/>Saved!</>:<><FiSave size={11}/>Save All</>}
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN HUB
// ══════════════════════════════════════════════════════════════════════════════
export default function MyFirstLoveHub() {
  const navigate = useNavigate();

  // GAP 9: lift episodes state so header can read air date
  const [episodes, setEpisodes] = useState(()=>lsGet('mfl-episodes',EPISODES_SEED));
  useEffect(()=>{ lsSet('mfl-episodes',episodes); },[episodes]);

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedQ, setSelectedQ] = useState(0);
  const [copiedQ, setCopiedQ]     = useState(false);
  const [showIntro, setShowIntro] = useState(()=>!sessionStorage.getItem('mfl-intro-seen'));

  function dismissIntro(){ sessionStorage.setItem('mfl-intro-seen','1'); setShowIntro(false); }
  function replayIntro(){ sessionStorage.removeItem('mfl-intro-seen'); setShowIntro(true); }

  function copyQuestion(){
    navigator.clipboard?.writeText(COMMUNITY_QUESTIONS[selectedQ].q).catch(()=>{});
    setCopiedQ(true); setTimeout(()=>setCopiedQ(false),2000);
  }

  function openScriptWithTemplate(){
    lsSet('mfl-script-template',EP1_SCRIPT_TEMPLATE);
    navigate('/faceless-videos',{state:{section:'script'}});
  }

  // GAP 6: air date countdown from EP1
  const ep1 = episodes.find(e=>e.num===1);
  const daysLeft = ep1?.airDate
    ? Math.ceil((new Date(ep1.airDate)-new Date())/(1000*60*60*24))
    : null;

  const tabs = [
    {id:'overview',   label:'Overview'},
    {id:'episode1',   label:'Episode 1'},
    {id:'production', label:'Production'},
    {id:'pipeline',   label:'Content Pipeline'},
    {id:'community',  label:'Community'},
    {id:'episodes',   label:'All Episodes'},
  ];

  return (
    <>
      <AnimatePresence>{showIntro&&<IntroOverlay onDismiss={dismissIntro}/>}</AnimatePresence>

      <div className="min-h-full" style={{background:'#080808'}}>

        {/* ── HEADER ────────────────────────────────────────────────────── */}
        <div className="sticky top-0 z-20 border-b border-white/8"
          style={{background:'rgba(8,8,8,0.97)',backdropFilter:'blur(16px)'}}>
          <div className="flex items-center gap-3 px-6 pt-4 pb-2">
            <Link to="/faceless-videos"
              className="flex items-center gap-1.5 text-[10px] text-gray-600 hover:text-gray-400 transition-colors">
              <FiArrowLeft size={11}/>Faceless Videos
            </Link>
            <span className="text-gray-800">/</span>
            <span className="text-[10px] text-gray-600 font-semibold">My First Love</span>
            <div className="ml-auto flex items-center gap-2 flex-wrap">
              <button onClick={replayIntro}
                className="flex items-center gap-1 text-[9px] text-gray-700 hover:text-gray-400 transition-colors">
                <FiRefreshCw size={9}/>Replay Intro
              </button>
              <Pill label="Series Active" color={ACCENT}/>
              <Pill label="EP 1 · In Production" color={GOLD}/>
              {/* GAP 6: Air date countdown */}
              {daysLeft!==null?(
                <Pill label={daysLeft>0?`${daysLeft}d to air`:daysLeft===0?'Airs Today!':'Aired'} color={daysLeft>7?'#6B7280':RED}/>
              ):(
                <button onClick={()=>setActiveTab('episodes')}
                  className="flex items-center gap-1 text-[9px] text-gray-700 hover:text-gray-400 transition-colors">
                  <FiCalendar size={9}/>Set Air Date
                </button>
              )}
            </div>
          </div>
          <div className="px-6 pb-3">
            <div className="flex items-end gap-4">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-1" style={{color:`${ACCENT}70`}}>
                  EOF Faceless Videos · Documentary Series</p>
                <h1 className="text-3xl font-black text-white leading-none">MY FIRST LOVE</h1>
                <p className="text-xs text-gray-500 mt-1 font-medium">A Hip-Hop History Documentary Series — VH1 · Netflix · Community</p>
              </div>
              <div className="ml-auto flex gap-2 pb-0.5">
                <button onClick={openScriptWithTemplate}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-bold border border-white/10 text-gray-500 hover:text-gray-300 hover:bg-white/4 transition-all">
                  <FiEdit2 size={11}/>Write Script
                </button>
                <button onClick={()=>setActiveTab('production')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold transition-all hover:brightness-110"
                  style={{background:`${ACCENT}18`,color:ACCENT,border:`1px solid ${ACCENT}35`}}>
                  <FiPlay size={11}/>Start Production
                </button>
              </div>
            </div>
          </div>
          <div className="flex border-t border-white/6 px-6 overflow-x-auto">
            {tabs.map(t=>(
              <button key={t.id} onClick={()=>setActiveTab(t.id)}
                className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap flex-shrink-0"
                style={{color:activeTab===t.id?ACCENT:'#4B5563',borderColor:activeTab===t.id?ACCENT:'transparent'}}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── BODY ──────────────────────────────────────────────────────── */}
        <div className="p-6 space-y-6 max-w-5xl mx-auto">

          {/* OVERVIEW */}
          {activeTab==='overview'&&(
            <>
              <Card color={GOLD}>
                <SH label="Series Vision" color={GOLD} icon={<FiStar size={13}/>}/>
                {[
                  {icon:'🎬',text:'Every episode should feel like a VH1 documentary, a Netflix music documentary, and a community conversation combined into one experience.'},
                  {icon:'🎙️',text:'The narrator guides the story, but the people become the storytellers.'},
                  {icon:'❤️',text:'The audience should feel like they are hearing hip-hop history from the people who lived it.'},
                ].map(v=>(
                  <div key={v.text} className="flex gap-3 items-start mb-3 last:mb-0">
                    <span className="text-lg mt-0.5 flex-shrink-0">{v.icon}</span>
                    <p className="text-sm text-gray-300 leading-relaxed">{v.text}</p>
                  </div>
                ))}
              </Card>

              <div className="grid grid-cols-2 gap-4">
                {[
                  {label:'TV / Streaming Premiere',num:'45–60', sub:'Minutes per episode',color:RED,   to:'/streaming'},
                  {label:'EOF Video On Demand',    num:'90–120',sub:'Minutes per episode',color:PURPLE,to:'/streaming'},
                ].map(s=>(
                  <Card key={s.label} color={s.color}>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{color:`${s.color}80`}}>{s.label}</p>
                    <p className="text-4xl font-black text-white mb-1">{s.num}</p>
                    <p className="text-xs text-gray-500 font-semibold">{s.sub}</p>
                    <Link to={s.to} className="mt-3 flex items-center gap-1 text-[9px] font-bold hover:brightness-125 transition-all"
                      style={{color:s.color}}>→ EOF Streaming<FiChevronRight size={9}/></Link>
                  </Card>
                ))}
              </div>

              <Card color={ACCENT}>
                <SH label="Interview Structure" color={ACCENT} icon={<FiMic size={13}/>}/>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    {num:'3–4', label:'Featured Video Interviews',sub:'5–10 min each',   color:ACCENT },
                    {num:'5–10',label:'Community Submissions',    sub:'30–90 sec each',  color:PURPLE },
                    {num:'∞',   label:'Archival Clips',           sub:'Properly licensed',color:GOLD  },
                  ].map(s=>(
                    <div key={s.label} className="rounded-xl p-3 text-center"
                      style={{background:`${s.color}10`,border:`1px solid ${s.color}25`}}>
                      <p className="text-2xl font-black" style={{color:s.color}}>{s.num}</p>
                      <p className="text-[10px] font-bold text-white mt-1">{s.label}</p>
                      <p className="text-[9px] text-gray-600 mt-0.5">{s.sub}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={()=>setActiveTab('community')}
                    className="text-[9px] font-bold px-2.5 py-1 rounded-lg hover:brightness-110 transition-all"
                    style={{background:`${ACCENT}12`,color:ACCENT,border:`1px solid ${ACCENT}25`}}>→ Community Submissions</button>
                  <button onClick={()=>setActiveTab('episode1')}
                    className="text-[9px] font-bold px-2.5 py-1 rounded-lg hover:brightness-110 transition-all"
                    style={{background:`${PURPLE}12`,color:PURPLE,border:`1px solid ${PURPLE}25`}}>→ Guest Tracker</button>
                </div>
              </Card>

              {/* GAP 7: Series Bible */}
              <SeriesBible/>

              <div className="rounded-2xl p-6 text-center"
                style={{background:'linear-gradient(135deg,rgba(16,185,129,0.06),rgba(212,175,55,0.04))',border:'1px solid rgba(16,185,129,0.2)'}}>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-3" style={{color:`${ACCENT}60`}}>Series Philosophy</p>
                <p className="text-base font-bold text-white">"My First Love" is not just a show about music.</p>
                <p className="text-sm text-gray-400 leading-relaxed mt-2 max-w-2xl mx-auto">
                  It is a <strong className="text-white">permanent archive of hip-hop culture</strong>. Every episode preserves stories, educates new audiences,
                  introduces independent talent, and documents the voices of the people who continue to shape the culture.
                </p>
                <button onClick={()=>setActiveTab('production')}
                  className="mt-4 inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-[11px] font-bold hover:brightness-110 transition-all"
                  style={{background:`${ACCENT}15`,color:ACCENT,border:`1px solid ${ACCENT}30`}}>
                  <FiPlay size={11}/>Begin Production
                </button>
              </div>
            </>
          )}

          {/* EPISODE 1 */}
          {activeTab==='episode1'&&(
            <>
              <div className="rounded-2xl p-6 text-center"
                style={{background:`${GOLD}08`,border:`1px solid ${GOLD}30`}}>
                <Pill label="Episode 1" color={GOLD}/>
                <h2 className="text-2xl font-black text-white mt-3 mb-2">My First Love</h2>
                <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{color:`${GOLD}70`}}>Central Question</p>
                <p className="text-lg text-white font-bold mb-4">"When did hip-hop become your first love?"</p>
                <div className="flex items-center justify-center gap-2">
                  <button onClick={openScriptWithTemplate}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-bold hover:brightness-110 transition-all"
                    style={{background:`${GOLD}15`,color:GOLD,border:`1px solid ${GOLD}30`}}>
                    <FiEdit2 size={11}/>Write Episode Script</button>
                  <button onClick={()=>setActiveTab('community')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-bold hover:brightness-110 transition-all"
                    style={{background:`${PURPLE}12`,color:PURPLE,border:`1px solid ${PURPLE}25`}}>
                    <FiUsers size={11}/>Community Submissions</button>
                </div>
              </div>

              <Card color={ACCENT}>
                <SH label="Featured Topics" color={ACCENT} icon={<FiList size={13}/>}/>
                <div className="grid grid-cols-2 gap-2">
                  {['The Bronx in the 1970s','Why hip-hop emerged','The role of block parties','The contributions of DJ Kool Herc',
                    'The influence of Afrika Bambaataa','The innovations of Grandmaster Flash','The original elements of hip-hop',
                    'The fifth element: knowledge','How hip-hop spread across America','Why it became a global culture'].map((t,i)=>(
                    <div key={t} className="flex items-start gap-2.5 p-2.5 rounded-xl border border-white/5 bg-white/2">
                      <span className="text-[9px] font-black w-5 flex-shrink-0 mt-0.5" style={{color:`${ACCENT}60`}}>{String(i+1).padStart(2,'0')}</span>
                      <p className="text-[10px] font-semibold text-gray-300 leading-tight">{t}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <GuestTracker/>
              {/* GAP 1 */}
              <BRollTracker/>
            </>
          )}

          {/* PRODUCTION */}
          {activeTab==='production'&&(
            <>
              <ProdTracker/>
              {/* GAP 4 */}
              <AgentSuggestions/>
              {/* GAP 2 */}
              <MusicTracker/>
              {/* GAP 3 */}
              <BudgetTracker/>
              <EpisodeNotes/>
              <div className="grid grid-cols-3 gap-3">
                {[
                  {icon:<FiEdit2 size={16}/>,  label:'Write Episode 1 Script', color:ACCENT,  action:openScriptWithTemplate},
                  {icon:<FiMic size={16}/>,    label:'Generate Narration',      color:PURPLE,  section:'voice' },
                  {icon:<FiCamera size={16}/>, label:'Open Video Editor',       color:GOLD,    section:'editor'},
                ].map(a=>{
                  const inner=(
                    <div className="flex flex-col items-center gap-2 p-4 rounded-2xl text-center border transition-all hover:brightness-125"
                      style={{background:`${a.color}08`,borderColor:`${a.color}20`,color:a.color}}>
                      {a.icon}
                      <span className="text-[10px] font-bold leading-tight">{a.label}</span>
                      <span className="text-[8px] opacity-50">→ Faceless Videos</span>
                    </div>
                  );
                  return a.action
                    ?<button key={a.label} onClick={a.action}>{inner}</button>
                    :<Link key={a.label} to="/faceless-videos" state={{section:a.section}}>{inner}</Link>;
                })}
              </div>
            </>
          )}

          {/* CONTENT PIPELINE */}
          {activeTab==='pipeline'&&(
            <>
              <Card color={GOLD}>
                <SH label="Content Pipeline — Per Episode" color={GOLD} icon={<FiPackage size={13}/>}/>
                <div className="grid grid-cols-2 gap-3">
                  {PIPELINE.map(p=>(
                    <div key={p.label} className="flex items-center gap-3 p-3 rounded-xl border border-white/6 bg-white/2 hover:bg-white/4 transition-all group">
                      <span className="text-xl flex-shrink-0">{p.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-white truncate">{p.label}</p>
                        <p className="text-[9px] font-semibold mt-0.5 capitalize" style={{color:`${p.color}80`}}>{p.cat}</p>
                      </div>
                      <Link to="/faceless-videos" state={{section:p.section}}
                        className="text-[8px] font-bold px-2 py-0.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                        style={{background:`${p.color}18`,color:p.color,border:`1px solid ${p.color}30`}}>Create →</Link>
                    </div>
                  ))}
                </div>
              </Card>

              <div>
                <SH label="Platform Targets" color={RED} icon={<FiShare2 size={13}/>}/>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {PLATFORMS.map(p=>{
                    const inner=(
                      <div className="p-3 rounded-xl border border-white/6 bg-white/2 text-center hover:bg-white/4 transition-all cursor-pointer group">
                        <span className="text-xl">{p.icon}</span>
                        <p className="text-[10px] font-bold text-white mt-1">{p.label}</p>
                        <p className="text-[9px] text-gray-600">{p.sub}</p>
                        <p className="text-[8px] mt-1 opacity-0 group-hover:opacity-100 transition-all" style={{color:RED}}>{p.ext?'Open ↗':'Open →'}</p>
                      </div>
                    );
                    if(p.to)  return <Link key={p.label} to={p.to}>{inner}</Link>;
                    if(p.ext) return <a key={p.label} href={p.ext} target="_blank" rel="noreferrer">{inner}</a>;
                    return <div key={p.label}>{inner}</div>;
                  })}
                </div>
              </div>

              <div className="rounded-2xl p-4 flex items-center gap-4"
                style={{background:`${ACCENT}06`,border:`1px solid ${ACCENT}20`}}>
                <FiUpload size={20} style={{color:ACCENT,flexShrink:0}}/>
                <div className="flex-1">
                  <p className="text-[11px] font-bold text-white mb-0.5">Ready to export?</p>
                  <p className="text-[9px] text-gray-600">Render and publish to all platforms from Export Studio.</p>
                </div>
                <Link to="/faceless-videos" state={{section:'export'}}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-bold hover:brightness-110 transition-all flex-shrink-0"
                  style={{background:`${ACCENT}15`,color:ACCENT,border:`1px solid ${ACCENT}30`}}>Export Studio →</Link>
              </div>
            </>
          )}

          {/* COMMUNITY */}
          {activeTab==='community'&&(
            <>
              <Card color={PURPLE}>
                <SH label="Community Question of the Week" color={PURPLE} icon={<FiMessageCircle size={13}/>}/>
                <div className="space-y-2 mb-4">
                  {COMMUNITY_QUESTIONS.map((item,i)=>(
                    <div key={item.q} onClick={()=>setSelectedQ(i)}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${selectedQ===i?'border-purple-500/50 bg-purple-500/10':'border-white/5 bg-white/2 hover:bg-white/4'}`}>
                      <span className="text-[9px] font-black flex-shrink-0 w-7" style={{color:selectedQ===i?PURPLE:'#4B5563'}}>{item.ep}</span>
                      <p className={`text-[11px] font-semibold leading-snug flex-1 ${selectedQ===i?'text-white':'text-gray-500'}`}>{item.q}</p>
                      {selectedQ===i&&<Pill label="Selected" color={PURPLE}/>}
                      {i===0&&selectedQ!==i&&<Pill label="EP 1 Active" color={ACCENT}/>}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-white/6">
                  <p className="text-[9px] text-gray-700 flex-1">Selected: <span className="text-gray-400">{COMMUNITY_QUESTIONS[selectedQ].ep}</span></p>
                  <button onClick={copyQuestion}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[9px] font-bold transition-all"
                    style={{background:copiedQ?`${ACCENT}18`:`${PURPLE}12`,color:copiedQ?ACCENT:PURPLE,border:`1px solid ${copiedQ?ACCENT:PURPLE}25`}}>
                    {copiedQ?<><FiCheck size={9}/>Copied!</>:<><FiCopy size={9}/>Copy Question</>}
                  </button>
                  <button onClick={openScriptWithTemplate}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[9px] font-bold hover:brightness-110 transition-all"
                    style={{background:`${GOLD}12`,color:GOLD,border:`1px solid ${GOLD}25`}}>
                    <FiEdit2 size={9}/>Use in Script
                  </button>
                </div>
              </Card>

              {/* GAP 5 */}
              <SubmissionCounter/>
            </>
          )}

          {/* ALL EPISODES — GAP 8+9 */}
          {activeTab==='episodes'&&(
            <EpisodesTab episodes={episodes} setEpisodes={setEpisodes}/>
          )}

        </div>
      </div>
    </>
  );
}
