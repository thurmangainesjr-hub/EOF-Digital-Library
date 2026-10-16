import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlus, FiSearch, FiFilter, FiFolder, FiGrid, FiList,
  FiChevronRight, FiChevronDown, FiCheck, FiClock, FiUsers,
  FiZap, FiFileText, FiMessageSquare, FiBarChart2, FiUpload,
  FiBookOpen, FiFilm, FiMusic, FiGlobe, FiStar, FiEdit2,
  FiAlertTriangle, FiX, FiArrowRight, FiLayers,
} from 'react-icons/fi';

// ── Data ──────────────────────────────────────────────────────────────────────

const SYSTEM_TAGS = {
  'griot-ai':    { label:'Griot AI',     color:'#8B5CF6', emoji:'🌀' },
  'film-studio': { label:'Film Studio',  color:'#EF4444', emoji:'🎬' },
  'music-studio':{ label:'Music Studio', color:'#D4AF37', emoji:'🎵' },
  'library':     { label:'Library',      color:'#3B82F6', emoji:'📚' },
  'fhhl':        { label:'FHHL',         color:'#F59E0B', emoji:'🏆' },
  'university':  { label:'University',   color:'#10B981', emoji:'🎓' },
  'bac':         { label:'BAC',          color:'#0891B2', emoji:'💼' },
  'media':       { label:'EOF Media',    color:'#EF4444', emoji:'📺' },
};

const TYPE_META = {
  series:    { label:'Series',    emoji:'📺', color:'#8B5CF6' },
  album:     { label:'Album',     emoji:'🎵', color:'#D4AF37' },
  film:      { label:'Film',      emoji:'🎬', color:'#EF4444' },
  book:      { label:'Book',      emoji:'📚', color:'#3B82F6' },
  course:    { label:'Course',    emoji:'🎓', color:'#10B981' },
  campaign:  { label:'Campaign',  emoji:'📣', color:'#F97316' },
  research:  { label:'Research',  emoji:'🔍', color:'#60A5FA' },
};

const STATUS_META = {
  active:     { label:'Active',      color:'#10B981', dot:'bg-green-500' },
  review:     { label:'In Review',   color:'#F59E0B', dot:'bg-amber-500' },
  planning:   { label:'Planning',    color:'#60A5FA', dot:'bg-blue-400'  },
  complete:   { label:'Complete',    color:'#8B5CF6', dot:'bg-purple-500' },
  paused:     { label:'Paused',      color:'#6B7280', dot:'bg-gray-500'  },
};

const PROJECTS = [
  {
    id:'p1', title:'Afrofuture Rising', subtitle:'Ep. 1 — Post-Production',
    system:'film-studio', type:'series', status:'active',
    progress:72, quality:84, deadline:'Jun 28',
    agents:['The Director','The Editor','The Cinematographer'],
    tasks:{ total:24, done:17 }, files:34, notes:8,
    lastActivity:'2h ago',
    tags:['Priority','Deadline'],
  },
  {
    id:'p2', title:'Crown Season — Track 4', subtitle:'Mixing & Mastering',
    system:'music-studio', type:'album', status:'active',
    progress:68, quality:78, deadline:'Jul 5',
    agents:['The Architect','The Maestro','Vocal Director'],
    tasks:{ total:18, done:12 }, files:22, notes:5,
    lastActivity:'1h ago',
    tags:['In Session'],
  },
  {
    id:'p3', title:'Afrofuture Rising — Canon', subtitle:'Story Bible',
    system:'griot-ai', type:'book', status:'active',
    progress:55, quality:91, deadline:'Ongoing',
    agents:['Story Architect','Research Agent','Critique Agent'],
    tasks:{ total:40, done:22 }, files:67, notes:14,
    lastActivity:'3h ago',
    tags:['Canon','Locked'],
  },
  {
    id:'p4', title:'Black Excellence Certification', subtitle:'Module 1 — Finance',
    system:'university', type:'course', status:'review',
    progress:88, quality:90, deadline:'Jun 22',
    agents:['Chancellor AI','Professor Agent'],
    tasks:{ total:12, done:11 }, files:18, notes:3,
    lastActivity:'1d ago',
    tags:['Review Ready'],
  },
  {
    id:'p5', title:'Afrofuture Anthems EP', subtitle:'Writing Phase',
    system:'music-studio', type:'album', status:'planning',
    progress:35, quality:0, deadline:'Aug 10',
    agents:['The Lyricist','The Architect'],
    tasks:{ total:30, done:10 }, files:8, notes:11,
    lastActivity:'2d ago',
    tags:[],
  },
  {
    id:'p6', title:'Crown Season Promo', subtitle:'Social + Press Kit',
    system:'griot-ai', type:'campaign', status:'planning',
    progress:20, quality:0, deadline:'Jul 1',
    agents:['Marketing Studio'],
    tasks:{ total:16, done:3 }, files:4, notes:2,
    lastActivity:'3d ago',
    tags:['Deadline'],
  },
];

const PROJECT_TABS = [
  { id:'tasks',     label:'Tasks',     icon:<FiCheck size={11}/> },
  { id:'files',     label:'Files',     icon:<FiFolder size={11}/> },
  { id:'notes',     label:'Notes',     icon:<FiFileText size={11}/> },
  { id:'agents',    label:'Agents',    icon:<FiZap size={11}/> },
  { id:'timeline',  label:'Timeline',  icon:<FiClock size={11}/> },
  { id:'analytics', label:'Analytics', icon:<FiBarChart2 size={11}/> },
  { id:'publish',   label:'Publish',   icon:<FiUpload size={11}/> },
];

const MOCK_TASKS = [
  { id:'t1', label:'Lock Marcus Osei character profile in Canon', done:true,  priority:'high',   agent:'Story Architect', due:'Done'    },
  { id:'t2', label:'Resolve Thread weaponization canon conflict', done:false, priority:'high',   agent:'Canon Keeper',    due:'Today'   },
  { id:'t3', label:'Complete Scene 11 — Council Chamber cut',    done:false, priority:'high',   agent:'The Editor',      due:'Jun 15'  },
  { id:'t4', label:'Export trailer rough cut for review',        done:false, priority:'medium', agent:'The Producer',    due:'Jun 18'  },
  { id:'t5', label:'Color grade Night Skyline sequence',         done:false, priority:'medium', agent:'The Cinematographer', due:'Jun 20' },
  { id:'t6', label:'Final sound design pass',                    done:false, priority:'low',    agent:'You',             due:'Jun 25'  },
];

const MOCK_FILES = [
  { name:'AFR_Ep1_v7_ROUGH.mp4',  size:'2.4 GB', type:'video',    updated:'2h ago'  },
  { name:'Marcus_CU_Take4.mov',   size:'840 MB', type:'video',    updated:'5h ago'  },
  { name:'MainTheme_Master.wav',  size:'182 MB', type:'audio',    updated:'1d ago'  },
  { name:'Ep1_Script_Final.pdf',  size:'1.2 MB', type:'document', updated:'3d ago'  },
  { name:'StoryBible_v3.pdf',     size:'4.8 MB', type:'document', updated:'1w ago'  },
  { name:'MarketScene_4K.mov',    size:'3.1 GB', type:'video',    updated:'2d ago'  },
];

const PRIORITY_COLOR = { high:'#EF4444', medium:'#F59E0B', low:'#10B981' };
const FILE_COLOR = { video:'#3B82F6', audio:'#10B981', document:'#8B5CF6', image:'#F97316' };
const FILE_EMOJI = { video:'🎬', audio:'🎵', document:'📄', image:'🖼️' };

// ── Project Card ──────────────────────────────────────────────────────────────
function ProjectCard({ proj, isSelected, onClick }) {
  const sys    = SYSTEM_TAGS[proj.system];
  const type   = TYPE_META[proj.type];
  const status = STATUS_META[proj.status];

  return (
    <motion.button
      layout
      onClick={onClick}
      className="w-full text-left rounded-2xl border p-4 transition-all hover:brightness-105"
      style={{
        background:   isSelected ? `${sys.color}0d` : 'rgba(255,255,255,0.02)',
        borderColor:  isSelected ? `${sys.color}45` : 'rgba(255,255,255,0.07)',
      }}>
      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg leading-none flex-shrink-0">{type.emoji}</span>
          <div className="min-w-0">
            <p className="text-xs font-black text-white truncate">{proj.title}</p>
            <p className="text-[9px] text-gray-600 truncate">{proj.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${status.dot}`} />
          <span className="text-[9px] font-semibold" style={{ color: status.color }}>{status.label}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1 h-1 rounded-full bg-white/6">
          <div className="h-full rounded-full transition-all" style={{ width:`${proj.progress}%`, background:sys.color }} />
        </div>
        <span className="text-[9px] font-mono text-gray-600">{proj.progress}%</span>
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
          style={{ background:`${sys.color}12`, color:sys.color, border:`1px solid ${sys.color}22` }}>
          {sys.emoji} {sys.label}
        </span>
        <span className="text-[9px] text-gray-700">{proj.tasks.done}/{proj.tasks.total} tasks</span>
        <span className="text-[9px] text-gray-700">{proj.files} files</span>
        {proj.deadline !== 'Ongoing' && (
          <span className="text-[9px] text-gray-700 ml-auto">📅 {proj.deadline}</span>
        )}
      </div>

      {/* Tags */}
      {proj.tags.length > 0 && (
        <div className="flex gap-1 mt-2 flex-wrap">
          {proj.tags.map(tag => (
            <span key={tag} className="text-[8px] px-1.5 py-0.5 rounded font-bold border border-white/8 text-gray-600">
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.button>
  );
}

// ── Project Detail ────────────────────────────────────────────────────────────
function ProjectDetail({ proj, onClose }) {
  const [activeTab, setActiveTab] = useState('tasks');
  const sys    = SYSTEM_TAGS[proj.system];
  const type   = TYPE_META[proj.type];
  const status = STATUS_META[proj.status];

  return (
    <motion.div
      key={proj.id}
      initial={{ opacity:0, x:24 }}
      animate={{ opacity:1, x:0 }}
      exit={{ opacity:0, x:24 }}
      transition={{ type:'spring', damping:26, stiffness:260 }}
      className="flex flex-col h-full border-l overflow-hidden"
      style={{ background:'#0f0f0f', borderColor:'rgba(255,255,255,0.07)' }}>

      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b flex-shrink-0"
        style={{ borderColor:'rgba(255,255,255,0.07)' }}>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{type.emoji}</span>
            <div>
              <p className="text-sm font-black text-white">{proj.title}</p>
              <p className="text-[10px] text-gray-600">{proj.subtitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-700 hover:text-white transition-colors">
            <FiX size={14} />
          </button>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {[
            { label:'Progress', value:`${proj.progress}%`,     color:sys.color      },
            { label:'Quality',  value: proj.quality > 0 ? `${proj.quality}%` : '—', color:'#D4AF37' },
            { label:'Tasks',    value:`${proj.tasks.done}/${proj.tasks.total}`, color:'#10B981' },
            { label:'Deadline', value:proj.deadline,            color:'#F97316'      },
          ].map(s => (
            <div key={s.label} className="rounded-lg border px-2 py-1.5 text-center"
              style={{ background:'rgba(255,255,255,0.02)', borderColor:'rgba(255,255,255,0.07)' }}>
              <p className="text-xs font-black" style={{ color:s.color }}>{s.value}</p>
              <p className="text-[8px] text-gray-700">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Agents */}
        <div className="flex flex-wrap gap-1">
          {proj.agents.map(a => (
            <span key={a} className="text-[9px] px-2 py-0.5 rounded-full font-semibold border border-white/8 text-gray-500">
              🤖 {a}
            </span>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b flex-shrink-0"
        style={{ borderColor:'rgba(255,255,255,0.07)' }}>
        {PROJECT_TABS.map(t => (
          <button key={t.id}
            onClick={() => setActiveTab(t.id)}
            className="flex items-center gap-1.5 px-3 py-2.5 text-[10px] font-semibold whitespace-nowrap border-b-2 transition-all"
            style={activeTab===t.id
              ? { color:sys.color, borderBottomColor:sys.color }
              : { color:'#6B7280', borderBottomColor:'transparent' }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab}
            initial={{ opacity:0, y:4 }}
            animate={{ opacity:1, y:0 }}
            exit={{ opacity:0 }}
            transition={{ duration:0.15 }}>

            {/* ── Tasks ── */}
            {activeTab==='tasks' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[9px] font-bold tracking-widest uppercase text-gray-600">
                    Tasks ({proj.tasks.done}/{proj.tasks.total})
                  </p>
                  <button className="text-[9px] text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1">
                    <FiPlus size={9} /> Add Task
                  </button>
                </div>
                {MOCK_TASKS.map((task, i) => (
                  <div key={task.id}
                    className="flex items-start gap-2.5 py-2 border-b last:border-0"
                    style={{ borderColor:'rgba(255,255,255,0.05)' }}>
                    <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 mt-0.5 border transition-all`}
                      style={{
                        background: task.done ? 'rgba(16,185,129,0.2)' : 'transparent',
                        borderColor: task.done ? '#10B981' : 'rgba(255,255,255,0.15)',
                      }}>
                      {task.done && <FiCheck size={9} className="text-green-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[11px] leading-snug ${task.done ? 'line-through text-gray-600' : 'text-gray-300'}`}>
                        {task.label}
                      </p>
                      <p className="text-[9px] text-gray-700 mt-0.5">🤖 {task.agent} · {task.due}</p>
                    </div>
                    <span className="text-[8px] font-bold flex-shrink-0"
                      style={{ color: PRIORITY_COLOR[task.priority] }}>
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* ── Files ── */}
            {activeTab==='files' && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[9px] font-bold tracking-widest uppercase text-gray-600">
                    Files ({proj.files})
                  </p>
                  <button className="text-[9px] text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1">
                    <FiUpload size={9} /> Upload
                  </button>
                </div>
                <div className="space-y-1.5">
                  {MOCK_FILES.map((file, i) => (
                    <div key={i} className="flex items-center gap-2.5 py-2 border-b last:border-0"
                      style={{ borderColor:'rgba(255,255,255,0.05)' }}>
                      <span className="text-sm flex-shrink-0">{FILE_EMOJI[file.type]}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-gray-300 truncate font-medium">{file.name}</p>
                        <p className="text-[9px] text-gray-700">{file.size} · {file.updated}</p>
                      </div>
                      <span className="text-[8px] font-bold px-1.5 py-0.5 rounded flex-shrink-0"
                        style={{ background:`${FILE_COLOR[file.type]}15`, color:FILE_COLOR[file.type] }}>
                        {file.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Notes ── */}
            {activeTab==='notes' && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[9px] font-bold tracking-widest uppercase text-gray-600">
                    Notes ({proj.notes})
                  </p>
                  <button className="text-[9px] text-purple-400 font-bold flex items-center gap-1">
                    <FiPlus size={9} /> New Note
                  </button>
                </div>
                {[
                  { title:'Director\'s Vision', excerpt:'The market scene needs to open with sound before image — we hear New Accra before we see it…', agent:'The Director', time:'2h ago' },
                  { title:'Canon Note — Thread Rules', excerpt:'Confirmed: Thread cannot be weaponized. This closes the conflict in Ep.2 draft. Updating Canon Keeper…', agent:'You', time:'3h ago' },
                  { title:'Pacing Analysis', excerpt:'The 47-second energy drop is now confirmed as a structural issue, not a performance one. Recommend…', agent:'Story Architect', time:'5h ago' },
                ].map((note, i) => (
                  <div key={i} className="rounded-xl border p-3 mb-2 cursor-pointer hover:bg-white/3 transition-all"
                    style={{ background:'rgba(255,255,255,0.02)', borderColor:'rgba(255,255,255,0.07)' }}>
                    <p className="text-[10px] font-bold text-white mb-1">{note.title}</p>
                    <p className="text-[10px] text-gray-500 leading-snug line-clamp-2">{note.excerpt}</p>
                    <p className="text-[9px] text-gray-700 mt-1.5">🤖 {note.agent} · {note.time}</p>
                  </div>
                ))}
              </div>
            )}

            {/* ── Agents ── */}
            {activeTab==='agents' && (
              <div>
                <p className="text-[9px] font-bold tracking-widest uppercase text-gray-600 mb-3">Assigned Agents</p>
                <div className="space-y-2">
                  {proj.agents.map((agent, i) => (
                    <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl border"
                      style={{ background:'rgba(255,255,255,0.02)', borderColor:'rgba(255,255,255,0.07)' }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                        style={{ background:`${sys.color}18` }}>
                        🤖
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-white">{agent}</p>
                        <p className="text-[9px] text-gray-600">Active on this project</p>
                      </div>
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    </div>
                  ))}
                  <button className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-dashed border-white/10 text-[10px] text-gray-600 hover:text-gray-400 transition-all">
                    <FiPlus size={10} /> Assign Agent
                  </button>
                </div>
              </div>
            )}

            {/* ── Timeline ── */}
            {activeTab==='timeline' && (
              <div>
                <p className="text-[9px] font-bold tracking-widest uppercase text-gray-600 mb-3">Project Timeline</p>
                <div className="space-y-3">
                  {[
                    { phase:'Pre-Production', start:'Jan 15', end:'Mar 1',  done:true  },
                    { phase:'Principal Photography', start:'Mar 1', end:'Apr 20', done:true  },
                    { phase:'Post-Production', start:'Apr 20', end:'Jun 28', done:false },
                    { phase:'Review & Delivery', start:'Jun 28', end:'Jul 5', done:false },
                  ].map((ph, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border`}
                        style={{
                          background: ph.done ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.04)',
                          borderColor: ph.done ? '#10B981' : 'rgba(255,255,255,0.12)',
                        }}>
                        {ph.done && <FiCheck size={8} className="text-green-400" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-[11px] font-semibold" style={{ color: ph.done ? '#9CA3AF' : '#fff' }}>{ph.phase}</p>
                        <p className="text-[9px] text-gray-700">{ph.start} → {ph.end}</p>
                      </div>
                      {!ph.done && i === 2 && (
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/25">
                          Current
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Analytics ── */}
            {activeTab==='analytics' && (
              <div className="space-y-3">
                <p className="text-[9px] font-bold tracking-widest uppercase text-gray-600">Project Analytics</p>
                {[
                  { label:'Overall Progress',   value:proj.progress,  color:sys.color,  suffix:'%' },
                  { label:'Quality Score',       value:proj.quality || 0,  color:'#D4AF37',  suffix:'%' },
                  { label:'Task Completion',     value:Math.round((proj.tasks.done/proj.tasks.total)*100), color:'#10B981', suffix:'%' },
                  { label:'Agent Activity',      value:87, color:'#8B5CF6', suffix:'%' },
                ].map(stat => (
                  <div key={stat.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-gray-400">{stat.label}</span>
                      <span className="text-xs font-black" style={{ color:stat.color }}>{stat.value}{stat.suffix}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/6">
                      <motion.div
                        initial={{ width:0 }}
                        animate={{ width:`${stat.value}%` }}
                        transition={{ duration:0.6, delay:0.1 }}
                        className="h-full rounded-full"
                        style={{ background:stat.color }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Publish ── */}
            {activeTab==='publish' && (
              <div>
                <p className="text-[9px] font-bold tracking-widest uppercase text-gray-600 mb-3">Publishing</p>
                <div className="space-y-2">
                  {[
                    { platform:'EOF Streaming',  status:'scheduled', date:'Jul 5',   color:'#EF4444' },
                    { platform:'EOF Radio',       status:'pending',   date:'—',       color:'#F59E0B' },
                    { platform:'YouTube',         status:'draft',     date:'—',       color:'#F97316' },
                    { platform:'Spotify',         status:'pending',   date:'—',       color:'#10B981' },
                  ].map((pub, i) => (
                    <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl border"
                      style={{ background:'rgba(255,255,255,0.02)', borderColor:'rgba(255,255,255,0.07)' }}>
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                        style={{ background:`${pub.color}15` }}>
                        📤
                      </div>
                      <span className="text-xs text-white flex-1 font-medium">{pub.platform}</span>
                      <span className="text-[9px] font-semibold" style={{ color: pub.status==='scheduled' ? '#10B981' : pub.status==='pending' ? '#F59E0B' : '#6B7280' }}>
                        {pub.status}
                      </span>
                      <span className="text-[9px] text-gray-700">{pub.date}</span>
                    </div>
                  ))}
                  <p className="text-[9px] text-gray-700 mt-2 px-1">Publishing requires authorization from the project owner.</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function UniversalProjectHub() {
  const [selectedProject, setSelectedProject] = useState(PROJECTS[0]);
  const [searchQ, setSearchQ]                 = useState('');
  const [filterSystem, setFilterSystem]       = useState('all');
  const [filterStatus, setFilterStatus]       = useState('all');
  const [viewMode, setViewMode]               = useState('list');

  const filtered = PROJECTS
    .filter(p => filterSystem === 'all' || p.system === filterSystem)
    .filter(p => filterStatus === 'all' || p.status === filterStatus)
    .filter(p => !searchQ || p.title.toLowerCase().includes(searchQ.toLowerCase()));

  const activeCount   = PROJECTS.filter(p => p.status === 'active').length;
  const totalTasks    = PROJECTS.reduce((s, p) => s + p.tasks.total, 0);
  const doneTasks     = PROJECTS.reduce((s, p) => s + p.tasks.done, 0);

  return (
    <div className="flex flex-col h-screen" style={{ background:'#0a0a0a', color:'#fff', fontFamily:'system-ui, sans-serif' }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 h-12 flex-shrink-0 border-b"
        style={{ background:'#111', borderColor:'rgba(255,255,255,0.08)' }}>
        <span className="text-sm font-bold text-white flex-shrink-0">📁 Projects</span>
        <span className="text-[10px] text-gray-600 hidden md:block">— Universal Project System</span>
        <div className="flex-1" />

        {/* Quick stats */}
        <div className="hidden sm:flex items-center gap-3 text-[10px] text-gray-600">
          <span><span className="text-white font-bold">{activeCount}</span> active</span>
          <span><span className="text-white font-bold">{PROJECTS.length}</span> total</span>
          <span><span className="text-green-400 font-bold">{doneTasks}/{totalTasks}</span> tasks</span>
        </div>

        <button className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border border-purple-500/30 bg-purple-500/10 text-purple-400 hover:brightness-110 transition-all flex-shrink-0">
          <FiPlus size={11} /> New Project
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* ── Left: Project List ──────────────────────────────────────── */}
        <div className="w-80 flex-shrink-0 flex flex-col border-r overflow-hidden"
          style={{ background:'#0d0d0d', borderColor:'rgba(255,255,255,0.07)' }}>

          {/* Filters */}
          <div className="px-3 py-2.5 border-b space-y-2"
            style={{ borderColor:'rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/8 bg-white/3">
              <FiSearch size={11} className="text-gray-600 flex-shrink-0" />
              <input value={searchQ} onChange={e => setSearchQ(e.target.value)}
                placeholder="Search projects…"
                className="bg-transparent text-[11px] text-white outline-none placeholder-gray-700 flex-1" />
            </div>
            <div className="flex gap-1.5">
              <select value={filterSystem} onChange={e => setFilterSystem(e.target.value)}
                className="flex-1 text-[10px] px-2 py-1.5 rounded-lg border border-white/8 bg-white/3 text-gray-400 outline-none cursor-pointer">
                <option value="all">All Systems</option>
                {Object.entries(SYSTEM_TAGS).map(([k, v]) => (
                  <option key={k} value={k}>{v.emoji} {v.label}</option>
                ))}
              </select>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                className="flex-1 text-[10px] px-2 py-1.5 rounded-lg border border-white/8 bg-white/3 text-gray-400 outline-none cursor-pointer">
                <option value="all">All Status</option>
                {Object.entries(STATUS_META).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Project list */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filtered.map(proj => (
              <ProjectCard
                key={proj.id}
                proj={proj}
                isSelected={selectedProject?.id === proj.id}
                onClick={() => setSelectedProject(proj)}
              />
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-gray-700 text-sm py-8">No projects match.</p>
            )}
          </div>
        </div>

        {/* ── Right: Project Detail ───────────────────────────────────── */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {selectedProject ? (
              <ProjectDetail
                key={selectedProject.id}
                proj={selectedProject}
                onClose={() => setSelectedProject(null)}
              />
            ) : (
              <motion.div
                initial={{ opacity:0 }}
                animate={{ opacity:1 }}
                className="flex flex-col items-center justify-center h-full text-center px-8">
                <FiFolder size={32} className="text-gray-700 mb-3" />
                <p className="text-sm font-bold text-gray-500">Select a project</p>
                <p className="text-xs text-gray-700 mt-1">Click any project to view tasks, files, notes, agents, timeline, analytics, and publishing.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
