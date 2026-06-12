import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiGrid, FiBook, FiUsers, FiGlobe, FiClock, FiImage, FiFilm, FiMic, FiMusic,
  FiSend, FiDownload, FiSettings, FiChevronDown, FiPlus, FiRefreshCw,
  FiLock, FiFileText, FiZap, FiCpu, FiArrowRight, FiEdit3, FiCamera,
  FiFolder, FiBookOpen, FiUser, FiMaximize2, FiX,
} from 'react-icons/fi';

const ACCENT   = '#7C3AED';
const A_SOFT   = 'rgba(124,58,237,0.12)';
const A_BORDER = 'rgba(124,58,237,0.28)';

const PROJECT_ROUTES = {
  'Write a Story':        'story',
  'Continue a Story':     'story',
  'Create a Script':      'story',
  'Create a Character':   'characters',
  'Add a Character':      'characters',
  'Story Builder':        'story',
  'Character Builder':    'characters',
  'World Builder':        'world',
  'Timeline Builder':     'timeline',
  'Book Format':          'publish',
  'Comic Format':         'publish',
  'Podcast/Radio Format': 'publish',
  'Film Format':          'film-studio',
  'Music Format':         'music-studio',
};

const PROJECT_ITEMS = Object.keys(PROJECT_ROUTES);

const NAV = [
  { id: 'dashboard',    label: 'Dashboard',    icon: FiGrid    },
  { id: 'story',        label: 'Story',         icon: FiBook    },
  { id: 'characters',   label: 'Characters',    icon: FiUsers   },
  { id: 'world',        label: 'World',         icon: FiGlobe   },
  { id: 'timeline',     label: 'Timeline',      icon: FiClock   },
  { id: 'image-studio', label: 'Image Studio',  icon: FiImage   },
  { id: 'video-studio', label: 'Video Studio',  icon: FiFilm    },
  { id: 'voice-studio', label: 'Voice Studio',  icon: FiMic     },
  { id: 'music-studio', label: 'Music Studio',  icon: FiMusic   },
  { id: 'film-studio',  label: 'Film Studio',   icon: FiCamera  },
  { id: 'agents',       label: 'Agents',        icon: FiCpu     },
  { id: 'publish',      label: 'Publish',       icon: FiSend    },
  { id: 'export',       label: 'Export',        icon: FiDownload},
];

const AGENTS = [
  { name: 'Griot Central',       role: 'Orchestrator',       status: 'active',  icon: '🌀', desc: 'Coordinates all agents and manages the full production flow' },
  { name: 'Story Architect',     role: 'Narrative Design',   status: 'active',  icon: '📖', desc: 'Builds story structure, plot arcs, and chapter flow' },
  { name: 'Canon Keeper',        role: 'Continuity Guard',   status: 'active',  icon: '🔒', desc: 'Tracks and enforces story canon and continuity rules' },
  { name: 'Character Agent',     role: 'Character Design',   status: 'standby', icon: '👤', desc: 'Creates and manages character bios, voices, and arcs' },
  { name: 'World Builder Agent', role: 'World Design',       status: 'standby', icon: '🌍', desc: 'Builds locations, cultures, rules, and world systems' },
  { name: 'Timeline Agent',      role: 'Event Tracking',     status: 'standby', icon: '⏳', desc: 'Manages story events, arcs, and continuity tracking' },
  { name: 'Image Studio Agent',  role: 'Visual Creation',    status: 'idle',    icon: '🎨', desc: 'Generates character, scene, and concept images' },
  { name: 'Video Studio Agent',  role: 'Motion Production',  status: 'idle',    icon: '🎬', desc: 'Creates trailers, scenes, and cinematic content' },
  { name: 'Voice Studio Agent',  role: 'Audio Direction',    status: 'idle',    icon: '🎙️', desc: 'Manages voice cloning, narration, and dialogue' },
  { name: 'Music Studio Agent',  role: 'Music Production',   status: 'idle',    icon: '🎵', desc: 'Handles song building, lyrics, and music direction' },
  { name: 'Film Studio Agent',   role: 'Film Production',    status: 'idle',    icon: '🎞️', desc: 'Manages scripts, casting, and film packages' },
  { name: 'Publishing Agent',    role: 'Release Management', status: 'standby', icon: '📤', desc: 'Formats and publishes books, comics, and scripts' },
  { name: 'Export Agent',        role: 'File Packaging',     status: 'standby', icon: '📦', desc: 'Packages and exports all production files' },
  { name: 'Distribution Agent',  role: 'Distribution',       status: 'idle',    icon: '🚀', desc: 'Distributes finished work across platforms' },
  { name: 'Research Agent',      role: 'Research',           status: 'standby', icon: '🔍', desc: 'Researches topics, facts, and creative references' },
];

const STATUS_COLOR = { active: '#10B981', busy: '#F59E0B', standby: '#38BDF8', idle: '#374151' };
const STATUS_GLOW  = { active: '0 0 8px rgba(16,185,129,0.55)', busy: '0 0 8px rgba(245,158,11,0.45)', standby: '', idle: '' };

const STAGES   = [
  { label: 'Develop',   count: 4,  color: '#60A5FA' },
  { label: 'Drafting',  count: 2,  color: ACCENT    },
  { label: 'Adapting',  count: 1,  color: '#F59E0B' },
  { label: 'Published', count: 47, color: '#10B981' },
];
const FORMATS  = [
  { name: 'Novels',   count: 12, delta: '+2', icon: '📚' },
  { name: 'Scripts',  count: 8,  delta: '+1', icon: '📄' },
  { name: 'Comics',   count: 5,  delta: '+1', icon: '🖼️' },
  { name: 'Podcasts', count: 9,  delta: '+3', icon: '🎙️' },
  { name: 'Films',    count: 4,  delta: '0',  icon: '🎬' },
  { name: 'Music',    count: 9,  delta: '+2', icon: '🎵' },
];
const PROJECTS = [
  { title: 'The Freedom Blueprint',   format: 'Novel',   progress: 72, stage: 'Drafting' },
  { title: 'Black Excellence Doc',    format: 'Film',    progress: 45, stage: 'Develop'  },
  { title: 'Griot Origins: Season 1', format: 'Podcast', progress: 88, stage: 'Adapting' },
  { title: 'Kingdom of Nkosi',        format: 'Comic',   progress: 31, stage: 'Develop'  },
];

// ─── Feature info for every unbuilt button ────────────────────────
const FEATURE_INFO = {
  'to-script': {
    title: 'Script Converter', emoji: '📄', badge: 'Coming Soon',
    description: 'Convert your prose narrative into a properly formatted screenplay or teleplay. Griot AI reads your story draft and restructures it into industry-standard format — scene headings, action lines, dialogue blocks, and transitions — ready for Final Draft or production use.',
    capabilities: ['Prose to Screenplay', 'Scene Headings (INT/EXT)', 'Action Lines', 'Character Dialogue Blocks', 'Transition Markers', 'Final Draft Export', 'TV Pilot Format', 'Stage Direction Format'],
  },
  'to-comic': {
    title: 'Comic Script Converter', emoji: '🖼️', badge: 'Coming Soon',
    description: 'Transform your prose story into a panel-by-panel comic script. Griot AI breaks your narrative into pages and panels, writes visual descriptions for each panel, and formats character dialogue as speech bubbles and caption boxes — ready for an artist to illustrate.',
    capabilities: ['Page & Panel Breakdown', 'Panel Visual Descriptions', 'Speech Bubble Format', 'Caption Box Writer', 'Artist Notes', 'Page Count Estimator', 'Cover Page Script', 'Webtoon Format'],
  },
  'canon-lock': {
    title: 'Canon Lock', emoji: '🔒', badge: 'Coming Soon',
    description: 'Lock selected text, scenes, or chapters as official canon in your continuity database. Once locked, the Canon Keeper agent enforces these facts across all future generations — preventing contradictions, maintaining character consistency, and protecting your world\'s rules.',
    capabilities: ['Lock Scene as Canon', 'Lock Character Fact', 'Lock World Rule', 'Contradiction Detection', 'Canon Database Export', 'Version-controlled History', 'Team Canon Sync', 'Override with Reason Log'],
  },
  'new-scene': {
    title: 'New Scene', emoji: '✍️', badge: 'Coming Soon',
    description: 'Create a new scene within the current chapter. The Scene Manager will prompt you for scene purpose, POV character, and location, then help you structure the scene with Griot AI writing assistance.',
    capabilities: ['Scene Purpose Setter', 'POV Character Select', 'Location Select', 'Scene Structure Template', 'Tension Arc Guide', 'Word Count Tracker', 'Scene to Chapter Link', 'Scene Summary AI'],
  },
  'save-project': {
    title: 'Save to Project', emoji: '💾', badge: 'Coming Soon',
    description: 'Save your current writing session to the project database. The system tracks version history, manages draft states, and syncs with the Canon Keeper to update continuity records automatically.',
    capabilities: ['Auto-save Drafts', 'Named Version Saves', 'Draft vs Final States', 'Canon Sync on Save', 'Project Timeline', 'Conflict Detection', 'Cloud Backup', 'Team Sharing'],
  },
  'version-history': {
    title: 'Version History', emoji: '🕐', badge: 'Coming Soon',
    description: 'Browse and restore any previous version of your story, scene, or character record. Every edit is tracked with metadata — what changed, when, and why — giving you a full production audit trail.',
    capabilities: ['Full Revision History', 'Side-by-side Comparison', 'Restore Any Version', 'Author Attribution', 'Timestamp Log', 'Change Summary AI', 'Branch Versions', 'Production Archive'],
  },
  'export-story': {
    title: 'Export Story', emoji: '📤', badge: 'Coming Soon',
    description: 'Export your complete story package in multiple formats simultaneously. Griot AI bundles your prose, scripts, character bibles, world documents, and media assets into a production-ready package for distribution or submission.',
    capabilities: ['PDF Export', 'EPUB Export', 'Final Draft FDX', 'Comic Script PDF', 'Character Bible PDF', 'World Document', 'Media Asset Bundle', 'Kindle Format'],
  },
  'book-format': {
    title: 'Book Format', emoji: '📚', badge: 'Coming Soon',
    description: 'Format your story as a print or digital book. Griot AI applies professional typesetting, generates a front matter package (title page, copyright, TOC, dedication), and prepares your manuscript for self-publishing or publisher submission.',
    capabilities: ['Print Layout', 'EPUB / eBook Format', 'Front Matter Generator', 'Chapter Formatting', 'Scene Break Styling', 'ISBN Prep', 'Amazon KDP Ready', 'IngramSpark Ready'],
  },
  'script-format': {
    title: 'Script Format', emoji: '📄', badge: 'Coming Soon',
    description: 'Format your writing as a professional screenplay or teleplay. Industry-standard formatting rules for feature films, TV pilots, webseries, or stage plays — ready for agency submission or competitions.',
    capabilities: ['Feature Film Format', 'TV Pilot Format', 'Webseries Format', 'Stage Play Format', 'Final Draft Compatible', 'WGA Submission Ready', 'Page Count Calculator', 'Coverage Summary'],
  },
  'comic-format': {
    title: 'Comic Format', emoji: '🎨', badge: 'Coming Soon',
    description: 'Format your story as a complete comic book or graphic novel package. Creates the panel breakdown, writes visual descriptions, structures dialogue for bubbles, and prepares the script for an artist.',
    capabilities: ['Panel Script Writer', 'Page Layout Planner', 'Artist Brief Generator', 'Dialogue Bubble Format', 'Cover Page Design', 'Series Bible', 'Webtoon Format', 'Comixology Format'],
  },
  'podcast-format': {
    title: 'Podcast / Audio Drama', emoji: '🎙️', badge: 'Coming Soon',
    description: 'Convert your story into a full audio drama production package. Griot AI restructures your narrative for audio format — adding sound direction, formatting dialogue for voice acting, and building production notes for audio engineers.',
    capabilities: ['Audio Drama Script', 'Sound Effect Direction', 'Music Cue Markers', 'Voice Acting Guide', 'Episode Structure', 'RSS Feed Package', 'Spotify / Apple Ready', 'Transcript Export'],
  },
  'film-format': {
    title: 'Film Format', emoji: '🎬', badge: 'Coming Soon',
    description: 'Assemble a complete film production package from your story. Griot AI generates the screenplay, shot list, storyboard descriptions, casting brief, production schedule outline, and budget template.',
    capabilities: ['Screenplay (Final Draft)', 'Shot List', 'Storyboard Script', 'Casting Brief', 'Production Schedule', 'Budget Template', 'Trailer Script', 'One-Page Logline'],
  },
  'music-format': {
    title: 'Music Format', emoji: '🎵', badge: 'Coming Soon',
    description: 'Extract the musical content from your story and format it into a music production package. Griot AI writes lyrics, builds song structures, and creates music briefs for your composers and producers.',
    capabilities: ['Lyric Writer', 'Song Structure Builder', 'Score Direction Brief', 'Character Theme Notes', 'Soundtrack Playlist', 'Music Video Script', 'Publisher Package', 'Streaming Metadata'],
  },
  'chapter-manager': {
    title: 'Chapter Manager', emoji: '📖', badge: 'Coming Soon',
    description: 'Manage your entire chapter architecture from one view. Drag-and-drop reordering, split and merge chapters, set chapter goals, track word counts, and see the full story arc at a glance.',
    capabilities: ['Drag-and-drop Reorder', 'Chapter Split / Merge', 'Word Count Per Chapter', 'Chapter Goal Setting', 'Arc Visualization', 'POV Tracking', 'Tension Chart', 'Chapter Summary AI'],
  },
  'scene-manager': {
    title: 'Scene Manager', emoji: '🎬', badge: 'Coming Soon',
    description: 'View, organize, and manage all scenes across your entire story. Filter by POV, location, or emotional beat. Identify pacing issues, redundant scenes, and missing beats with AI analysis.',
    capabilities: ['Scene Grid View', 'Filter by POV / Location', 'Pacing Analysis', 'Scene Purpose Tagger', 'Redundancy Detector', 'Emotional Beat Chart', 'Scene Summary AI', 'Cut / Archive Scenes'],
  },
  'store-drafts': {
    title: 'Draft Vault', emoji: '📁', badge: 'Coming Soon',
    description: 'Save multiple drafts of any piece of writing. Drafts are versioned, searchable, and never deleted. The Draft Vault gives you a full creative history to pull from at any time.',
    capabilities: ['Named Drafts', 'Draft Search', 'Draft Comparison', 'Restore Any Draft', 'Draft to Canon Promotion', 'Team Draft Sharing', 'Expiry Settings', 'Cloud Sync'],
  },
  'deploy-agent': {
    title: 'Deploy Agent', emoji: '🚀', badge: 'Coming Soon',
    description: 'Configure and deploy a new custom AI agent into your Griot AI production pipeline. Define the agent\'s role, set its memory access, assign it to specific projects, and connect it to external tools and APIs.',
    capabilities: ['Agent Role Configuration', 'Memory Access Control', 'Project Assignment', 'Tool Integration', 'API Key Management', 'Agent Testing Mode', 'Performance Monitoring', 'Agent Library'],
  },
  'all-projects': {
    title: 'Projects Hub', emoji: '📁', badge: 'Coming Soon',
    description: 'The full Projects Hub gives you a complete view of all your creative projects across every format. Filter by format, stage, collaborator, or deadline. Manage your full production portfolio from one screen.',
    capabilities: ['Grid / List View', 'Filter by Format', 'Filter by Stage', 'Collaborator View', 'Deadline Tracker', 'Archive Projects', 'Project Templates', 'Import / Export Projects'],
  },
  'char-appearance': {
    title: 'Character Appearance', emoji: '🎨', badge: 'Coming Soon',
    description: 'Build a complete visual profile for your character. Describe physical traits in detail, generate AI portrait art, build outfit collections, and export a character reference sheet for artists and directors.',
    capabilities: ['Physical Traits Form', 'AI Portrait Generator', 'Outfit Builder', 'Color Palette', 'Height / Build Chart', 'Distinguishing Marks', 'Age Progression View', 'Artist Reference Export'],
  },
  'char-personality': {
    title: 'Character Personality', emoji: '🧠', badge: 'Coming Soon',
    description: 'Define your character\'s inner world. Map personality traits, psychological profile, dialogue patterns, and emotional tendencies. Griot AI uses this profile to keep all AI-generated dialogue and actions consistent.',
    capabilities: ['MBTI / Enneagram Mapper', 'Trait Sliders', 'Voice Descriptor', 'Dialogue Sample Generator', 'Quirks & Habits', 'Fears & Core Desires', 'Moral Alignment', 'Consistency Enforcement'],
  },
  'char-powers': {
    title: 'Powers / Skills', emoji: '⚡', badge: 'Coming Soon',
    description: 'Define and manage your character\'s abilities, powers, and skills. Build skill trees, set power limits, track growth arcs, and connect abilities to the world\'s magic or technology system.',
    capabilities: ['Skill Tree Builder', 'Power Level Meter', 'Weakness Tracker', 'Growth Arc Planner', 'World System Link', 'Combat Style', 'Special Abilities', 'Canon Power Limits'],
  },
  'char-relationships': {
    title: 'Relationships', emoji: '🤝', badge: 'Coming Soon',
    description: 'Map your character\'s full web of relationships. Build family trees, define alliances and rivalries, track relationship arcs over time, and visualize how character dynamics shift across your story.',
    capabilities: ['Family Tree Builder', 'Ally / Enemy Mapper', 'Relationship Timeline', 'Trust Level Tracker', 'Conflict History', 'Romance Arc', 'Mentor / Student Bonds', 'Rivalry Dynamics'],
  },
  'char-media': {
    title: 'Character Media', emoji: '📸', badge: 'Coming Soon',
    description: 'Build a media library for your character — AI-generated portraits, voice samples, video appearances, reference images, and concept art. All media is tagged to the character record and exportable.',
    capabilities: ['AI Portrait Generation', 'Voice Sample Upload', 'Video Reference Upload', 'Canon Image Gallery', 'Reference Image Board', 'Character Sheet Export', 'Media Version History', 'Artist Brief Generator'],
  },
  'char-memory': {
    title: 'Canon / Memory', emoji: '🔮', badge: 'Coming Soon',
    description: 'Control what the AI remembers about your character as canon. Lock key facts, add continuity rules, track all chapter appearances, and get contradiction alerts when new content conflicts with established truth.',
    capabilities: ['Canon Lock Toggle', 'Story Memory Log', 'Chapter Appearance Tracker', 'Continuity Rules', 'Contradiction Alerts', 'Timeline Events', 'Version History', 'Team Canon Sync'],
  },
};

const AGENT_CAPS = {
  'Griot Central':       ['Orchestrate All Agents', 'Manage Production Queue', 'Route Tasks', 'Monitor Agent Status', 'Conflict Resolution', 'Pipeline Coordination', 'System Health', 'Log & Audit'],
  'Story Architect':     ['Build Story Structure', 'Plot Arc Design', 'Chapter Planning', 'Scene Order', 'Narrative Flow Analysis', 'Genre Conventions', 'Plot Hole Detection', 'Story Beat Templates'],
  'Canon Keeper':        ['Continuity Enforcement', 'Contradiction Detection', 'Canon Database', 'Timeline Consistency', 'Character Fact Locking', 'World Rule Enforcement', 'Version Canon Audit', 'Canon Reports'],
  'Character Agent':     ['Create Character Profiles', 'Voice Consistency', 'Character Arc Tracking', 'Dialogue Style', 'Relationship Mapping', 'Bio Management', 'Character Reference Export', 'AI Portrait Briefs'],
  'World Builder Agent': ['Location Creation', 'Culture Design', 'World Rules', 'Map Generation Briefs', 'Faction Management', 'Magic / Tech Systems', 'History Building', 'World Bible Export'],
  'Timeline Agent':      ['Event Tracking', 'Arc Sequencing', 'Flashback Management', 'Future Event Planning', 'Continuity Timeline', 'Story Epoch Management', 'Series Timeline', 'Date & Era Consistency'],
  'Image Studio Agent':  ['Text to Image Prompts', 'Character Portraits', 'Scene Images', 'Style Reference', 'Midjourney / SD Integration', 'Image Batch', 'Art Direction', 'Asset Library'],
  'Video Studio Agent':  ['Image to Video', 'Scene Animation', 'Trailer Assembly', 'Storyboard Execution', 'Runway / Pika Integration', 'Shot Sequencing', 'Visual Effects Brief', 'Video Export'],
  'Voice Studio Agent':  ['Voice Cloning Setup', 'Narration Generation', 'Dialogue Rendering', 'Character Voice Matching', 'ElevenLabs Integration', 'Audio Production Brief', 'Podcast Voice Format', 'Voice Archive'],
  'Music Studio Agent':  ['Lyric Generation', 'Song Structure', 'Beat Direction', 'Score Brief', 'Suno / Udio Integration', 'Soundtrack Curation', 'Music Brief Export', 'Artist Collaboration Prep'],
  'Film Studio Agent':   ['Script Supervision', 'Shot List Generation', 'Casting Brief', 'Storyboard Direction', 'Production Schedule', 'Budget Template', 'Continuity Checking', 'Film Package Export'],
  'Publishing Agent':    ['Book Formatting', 'Manuscript Prep', 'Cover Brief', 'Publisher Submission', 'KDP / IngramSpark Setup', 'ISBN Management', 'Launch Calendar', 'Distribution Routes'],
  'Export Agent':        ['Package Story Files', 'Multi-format Export', 'Asset Bundling', 'Delivery Prep', 'Quality Check', 'File Naming', 'Cloud Upload', 'Delivery Confirmation'],
  'Distribution Agent':  ['Platform Upload', 'Amazon KDP', 'Spotify / Apple Podcasts', 'YouTube Upload', 'Comic Platforms', 'Marketing Assets', 'Analytics Setup', 'Revenue Tracking'],
  'Research Agent':      ['Topic Research', 'Fact Verification', 'Historical Research', 'Cultural Reference', 'Science / Tech Research', 'News & Trend Monitoring', 'Source Citation', 'Research Brief Export'],
};

// ─── Feature Modal ────────────────────────────────────────────────
function FeatureModal({ modal, onClose }) {
  useEffect(() => {
    if (!modal) return;
    const h = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [modal, onClose]);

  return (
    <AnimatePresence>
      {modal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}>
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
          <motion.div
            className="relative z-10 w-full max-w-md rounded-2xl p-6 shadow-2xl"
            style={{ background: '#111', border: `1px solid ${A_BORDER}` }}
            initial={{ scale: 0.92, y: 16 }} animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 16 }} transition={{ duration: 0.15 }}
            onClick={e => e.stopPropagation()}>

            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: A_SOFT }}>
                  {modal.emoji}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base leading-tight">{modal.title}</h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full mt-0.5 inline-block"
                    style={{
                      background: modal.statusColor ? `${modal.statusColor}20` : A_SOFT,
                      color: modal.statusColor || '#A78BFA',
                    }}>
                    {modal.badge}
                  </span>
                </div>
              </div>
              <button onClick={onClose}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:text-white hover:bg-white/8 transition-all flex-shrink-0">
                <FiX size={14} />
              </button>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed mb-4">{modal.description}</p>

            {modal.capabilities && modal.capabilities.length > 0 && (
              <div className="mb-4">
                <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider mb-2">Capabilities</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {modal.capabilities.map(c => (
                    <div key={c} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-gray-400"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <FiZap size={9} style={{ color: ACCENT }} className="flex-shrink-0" />
                      {c}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="px-3 py-2.5 rounded-xl text-xs text-center text-gray-500"
              style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
              {modal.note || 'Coming Soon — This feature is part of the Griot AI production system and is being prepared for release.'}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Coming Soon ──────────────────────────────────────────────────
function ComingSoon({ title, icon: Icon, features = [] }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center overflow-y-auto">
      <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: A_SOFT, border: `1px solid ${A_BORDER}` }}>
        <Icon size={34} style={{ color: ACCENT }} />
      </div>
      <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>
      <p className="text-gray-400 text-sm max-w-md mb-8 leading-relaxed">
        Coming Soon — This feature is part of the Griot AI production system and is being prepared for release.
      </p>
      {features.length > 0 && (
        <div className="grid grid-cols-2 gap-2 max-w-lg w-full mx-auto">
          {features.map(f => (
            <div key={f} className="flex items-center gap-2 px-3 py-2 rounded-lg text-left"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <FiZap size={11} style={{ color: ACCENT }} className="flex-shrink-0" />
              <span className="text-xs text-gray-400">{f}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────
function Dashboard({ setSection, onFeature }) {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
      <div className="grid grid-cols-4 gap-3">
        {STAGES.map(s => (
          <div key={s.label} className="p-4 rounded-xl"
            style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="text-2xl font-bold mb-0.5" style={{ color: s.color }}>{s.count}</div>
            <div className="text-xs text-gray-400 mb-2">{s.label}</div>
            <div className="h-1 rounded-full" style={{ background: `${s.color}22` }}>
              <div className="h-full rounded-full" style={{ width: `${Math.min((s.count / 50) * 100, 100)}%`, background: s.color }} />
            </div>
          </div>
        ))}
      </div>

      <div>
        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Create</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Write a Story',   icon: '📖', id: 'story'        },
            { label: 'Build Character', icon: '👤', id: 'characters'   },
            { label: 'Build World',     icon: '🌍', id: 'world'        },
            { label: 'Image Studio',    icon: '🎨', id: 'image-studio' },
            { label: 'Video Studio',    icon: '🎬', id: 'video-studio' },
            { label: 'Music Studio',    icon: '🎵', id: 'music-studio' },
            { label: 'Film Studio',     icon: '🎞️', id: 'film-studio'  },
            { label: 'Voice Studio',    icon: '🎙️', id: 'voice-studio' },
          ].map(q => (
            <button key={q.label} onClick={() => setSection(q.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-gray-300 hover:text-white transition-all"
              style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span>{q.icon}</span>{q.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 p-4 rounded-xl"
          style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Active Projects</h3>
            <button onClick={() => onFeature('all-projects')}
              className="text-xs text-gray-500 hover:text-white transition-colors">View all</button>
          </div>
          <div className="space-y-2.5">
            {PROJECTS.map(p => (
              <button key={p.title} onClick={() => setSection('story')}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/4 transition-all text-left">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-sm font-medium text-white truncate">{p.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: A_SOFT, color: '#A78BFA' }}>{p.format}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div className="h-full rounded-full" style={{ width: `${p.progress}%`, background: ACCENT }} />
                    </div>
                    <span className="text-[10px] text-gray-500 flex-shrink-0">{p.progress}%</span>
                  </div>
                </div>
                <span className="text-[10px] text-gray-600 flex-shrink-0">{p.stage}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-xl"
          style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 className="text-sm font-semibold text-white mb-4">Format Vault</h3>
          <div className="space-y-3">
            {FORMATS.map(f => (
              <div key={f.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{f.icon}</span>
                  <span className="text-xs text-gray-400">{f.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white">{f.count}</span>
                  <span className="text-[10px] text-emerald-400">{f.delta}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Live Agents</p>
          <button onClick={() => setSection('agents')} className="text-xs text-gray-500 hover:text-white transition-colors">View all →</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {AGENTS.slice(0, 8).map(a => (
            <button key={a.name} onClick={() => onFeature({ agent: a })}
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 transition-all"
              style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: STATUS_COLOR[a.status], boxShadow: STATUS_GLOW[a.status] }} />
              <span className="text-xs text-gray-300">{a.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-3">Production Pipeline</p>
        <div className="flex items-center gap-2 flex-wrap">
          {['Write', 'Build Characters', 'Build World', 'Create Images', 'Create Video', 'Add Voice', 'Add Music', 'Produce Film', 'Publish', 'Export', 'Distribute'].map((step, i, arr) => (
            <React.Fragment key={step}>
              <div className="px-3 py-1.5 rounded-lg text-xs font-medium"
                style={{ background: A_SOFT, border: `1px solid ${A_BORDER}`, color: '#C4B5FD' }}>
                {step}
              </div>
              {i < arr.length - 1 && <FiArrowRight size={11} className="text-gray-700 flex-shrink-0" />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Story Builder ────────────────────────────────────────────────
function StoryBuilder({ onFeature }) {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'Welcome to Story Builder — your AI writing engine. Start a story, continue a chapter, or give Griot AI direction.' }
  ]);
  const [input, setInput]     = useState('');
  const [panel, setPanel]     = useState('chapters');
  const [chapters, setChapters] = useState([
    { title: 'Chapter 1: Origins',     scenes: 3, locked: true  },
    { title: 'Chapter 2: The Call',    scenes: 2, locked: false },
    { title: 'Chapter 3: The Journey', scenes: 0, locked: false },
  ]);
  const bottomRef = useRef(null);

  function send(text) {
    const msg = text || input;
    if (!msg.trim()) return;
    const user = { role: 'user', content: msg };
    const ai   = { role: 'assistant', content: `Processing your direction: "${msg.slice(0, 70)}${msg.length > 70 ? '…' : ''}" — Connect a live LLM to activate Griot AI story generation.` };
    setMessages(m => [...m, user, ai]);
    if (!text) setInput('');
  }

  function addChapter() {
    const n = chapters.length + 1;
    setChapters(c => [...c, { title: `Chapter ${n}: Untitled`, scenes: 0, locked: false }]);
  }

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const TOOLBAR = [
    { label: 'Continue',       icon: FiArrowRight, action: () => send('Continue the story from where we left off.') },
    { label: 'Rewrite Scene',  icon: FiRefreshCw,  action: () => send('Rewrite the current scene with more detail and depth.') },
    { label: 'Expand Chapter', icon: FiMaximize2,  action: () => send('Expand this chapter with more richness, atmosphere, and depth.') },
    { label: 'To Script',      icon: FiFileText,   action: () => onFeature('to-script')  },
    { label: 'To Comic',       icon: FiImage,      action: () => onFeature('to-comic')   },
    { label: 'Canon Lock',     icon: FiLock,       action: () => onFeature('canon-lock') },
    { label: 'New Chapter',    icon: FiPlus,       action: addChapter },
    { label: 'New Scene',      icon: FiEdit3,      action: () => onFeature('new-scene')  },
  ];

  const QUICK_ACTIONS = [
    { label: 'Book Format',     icon: FiBook,      key: 'book-format'     },
    { label: 'Script Format',   icon: FiFileText,  key: 'script-format'   },
    { label: 'Comic Format',    icon: FiImage,     key: 'comic-format'    },
    { label: 'Podcast Format',  icon: FiMic,       key: 'podcast-format'  },
    { label: 'Film Format',     icon: FiCamera,    key: 'film-format'     },
    { label: 'Music Format',    icon: FiMusic,     key: 'music-format'    },
    { label: 'Chapter Manager', icon: FiBookOpen,  key: 'chapter-manager' },
    { label: 'Scene Manager',   icon: FiGrid,      key: 'scene-manager'   },
    { label: 'Store Drafts',    icon: FiFolder,    key: 'store-drafts'    },
    { label: 'Version History', icon: FiRefreshCw, key: 'version-history' },
    { label: 'Export Story',    icon: FiDownload,  key: 'export-story'    },
  ];

  const LEFT_ACTIONS = [
    { label: 'Save to Project',  key: 'save-project'    },
    { label: 'Version History',  key: 'version-history' },
    { label: 'Export Story',     key: 'export-story'    },
  ];

  return (
    <div className="flex flex-1 min-h-0 overflow-hidden">
      <aside className="w-52 flex-shrink-0 flex flex-col border-r border-white/6" style={{ background: 'rgba(10,10,10,0.85)' }}>
        <div className="px-3 pt-3 pb-2 flex items-center justify-between border-b border-white/5">
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Project</span>
          <button onClick={addChapter}
            className="w-5 h-5 rounded flex items-center justify-center text-gray-600 hover:text-white hover:bg-white/8">
            <FiPlus size={12} />
          </button>
        </div>
        <div className="flex border-b border-white/5 flex-shrink-0">
          {['chapters', 'scenes', 'notes', 'canon'].map(t => (
            <button key={t} onClick={() => setPanel(t)}
              className={`flex-1 text-[10px] py-1.5 font-medium capitalize transition-colors ${panel === t ? 'text-white' : 'text-gray-600 hover:text-gray-400'}`}
              style={panel === t ? { borderBottom: `2px solid ${ACCENT}` } : {}}>
              {t}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
          {panel === 'chapters' && chapters.map((ch, i) => (
            <button key={i} className="w-full text-left px-2 py-2 rounded-lg hover:bg-white/5 transition-all">
              <div className="flex items-center gap-1.5 mb-0.5">
                {ch.locked && <FiLock size={9} style={{ color: ACCENT }} />}
                <span className="text-xs text-gray-300 truncate">{ch.title}</span>
              </div>
              <span className="text-[10px] text-gray-600">{ch.scenes} scenes</span>
            </button>
          ))}
          {panel !== 'chapters' && (
            <p className="text-center text-gray-700 text-xs mt-8">No {panel} yet</p>
          )}
        </div>
        <div className="px-2 pb-3 pt-2 border-t border-white/5 space-y-0.5">
          {LEFT_ACTIONS.map(a => (
            <button key={a.label} onClick={() => onFeature(a.key)}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-gray-600 hover:text-gray-300 hover:bg-white/5 transition-all">
              <FiArrowRight size={10} style={{ color: ACCENT }} />{a.label}
            </button>
          ))}
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-white/6 flex-shrink-0 overflow-x-auto"
          style={{ background: 'rgba(17,17,17,0.85)' }}>
          {TOOLBAR.map(({ label, icon: Icon, action }) => (
            <button key={label} onClick={action}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/8 border border-white/6 hover:border-white/15 transition-all flex-shrink-0 whitespace-nowrap">
              <Icon size={11} />{label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-0.5" style={{ background: A_SOFT }}>
                  <FiCpu size={13} style={{ color: ACCENT }} />
                </div>
              )}
              <div className={`max-w-2xl px-4 py-3 rounded-xl text-sm leading-relaxed ${
                m.role === 'user'   ? 'text-white rounded-tr-sm' :
                m.role === 'system' ? 'text-gray-500 italic text-xs' :
                                      'text-gray-200 rounded-tl-sm'
              }`}
                style={
                  m.role === 'user'      ? { background: ACCENT } :
                  m.role === 'assistant' ? { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' } :
                  {}
                }>
                {m.content}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="px-4 pb-4 flex-shrink-0">
          <div className="flex items-end gap-2 rounded-xl p-2 border" style={{ background: 'rgba(17,17,17,0.9)', borderColor: A_BORDER }}>
            <textarea value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Write your story, continue a scene, or give Griot AI direction…"
              rows={3}
              className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 resize-none outline-none px-2 py-1 leading-relaxed" />
            <button onClick={() => send()}
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-all"
              style={{ background: ACCENT }}>
              <FiSend size={14} className="text-white" />
            </button>
          </div>
          <p className="text-[10px] text-gray-700 mt-1.5 text-center">Enter to send · Shift+Enter for new line</p>
        </div>
      </main>

      <aside className="w-44 flex-shrink-0 border-l border-white/6 flex flex-col" style={{ background: 'rgba(10,10,10,0.85)' }}>
        <div className="px-3 pt-3 pb-2 border-b border-white/5">
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Quick Actions</span>
        </div>
        <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
          {QUICK_ACTIONS.map(({ label, icon: Icon, key }) => (
            <button key={label} onClick={() => onFeature(key)}
              className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-xs text-gray-500 hover:text-white hover:bg-white/5 transition-all">
              <Icon size={11} style={{ color: ACCENT }} className="flex-shrink-0" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}

// ─── Character Builder ────────────────────────────────────────────
const CHAR_TAB_KEYS = {
  appearance:    'char-appearance',
  personality:   'char-personality',
  powers:        'char-powers',
  relationships: 'char-relationships',
  media:         'char-media',
  memory:        'char-memory',
};

function CharacterBuilder({ onFeature }) {
  const [tab, setTab]           = useState('bio');
  const [selected, setSelected] = useState(0);
  const chars = [
    { name: 'Amara Jackson', role: 'Protagonist' },
    { name: 'The Elder',     role: 'Mentor'      },
  ];
  const TABS = ['bio', 'appearance', 'personality', 'powers', 'relationships', 'media', 'memory'];
  const TAB_LABELS = { bio: 'Bio', powers: 'Powers / Skills', media: 'Media', memory: 'Canon / Memory' };

  return (
    <div className="flex flex-1 min-h-0 overflow-hidden">
      <aside className="w-48 flex-shrink-0 flex flex-col border-r border-white/6" style={{ background: 'rgba(10,10,10,0.85)' }}>
        <div className="px-3 pt-3 pb-2 flex items-center justify-between border-b border-white/5">
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Characters</span>
          <button className="w-5 h-5 rounded flex items-center justify-center text-gray-600 hover:text-white hover:bg-white/8">
            <FiPlus size={12} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
          {chars.map((c, i) => (
            <button key={i} onClick={() => setSelected(i)}
              className={`w-full flex items-center gap-2.5 px-2 py-2.5 rounded-xl transition-all text-left ${
                selected === i ? 'text-white' : 'text-gray-500 hover:text-gray-300 hover:bg-white/4'
              }`}
              style={selected === i ? { background: A_SOFT, border: `1px solid ${A_BORDER}` } : { border: '1px solid transparent' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(124,58,237,0.2)' }}>
                <FiUser size={14} style={{ color: ACCENT }} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium truncate">{c.name}</p>
                <p className="text-[10px] text-gray-600">{c.role}</p>
              </div>
            </button>
          ))}
        </div>
        <div className="px-2 pb-3 pt-2 border-t border-white/5">
          <button className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium"
            style={{ background: A_SOFT, border: `1px solid ${A_BORDER}`, color: ACCENT }}>
            <FiPlus size={12} /> Add Character
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex border-b border-white/6 px-6 pt-4 flex-shrink-0 overflow-x-auto"
          style={{ background: 'rgba(17,17,17,0.85)' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-xs font-medium mr-1 rounded-t-lg transition-all whitespace-nowrap ${tab === t ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
              style={tab === t ? { background: A_SOFT, borderBottom: `2px solid ${ACCENT}` } : {}}>
              {TAB_LABELS[t] || (t.charAt(0).toUpperCase() + t.slice(1))}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {tab === 'bio' ? (
            <div className="grid grid-cols-2 gap-4 max-w-2xl">
              {[
                { label: 'Character Name', ph: 'Full name…' },
                { label: 'Role',           ph: 'Protagonist, Antagonist, Supporting…' },
                { label: 'Age',            ph: 'Age or era…' },
                { label: 'Origin',         ph: 'Where they come from…' },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">{f.label}</label>
                  <input placeholder={f.ph}
                    className="w-full px-3 py-2 rounded-lg text-sm text-white placeholder-gray-600 outline-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
                </div>
              ))}
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Background / History</label>
                <textarea rows={4} placeholder="Character history, backstory, motivation…"
                  className="w-full px-3 py-2 rounded-lg text-sm text-white placeholder-gray-600 outline-none resize-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Goals & Motivation</label>
                <textarea rows={3} placeholder="What drives this character?"
                  className="w-full px-3 py-2 rounded-lg text-sm text-white placeholder-gray-600 outline-none resize-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
              </div>
              <div className="col-span-2 flex justify-end">
                <button className="px-5 py-2 rounded-xl text-sm font-medium text-white hover:opacity-90 transition-all"
                  style={{ background: ACCENT }}>
                  Save Character
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto">
              {(() => {
                const key = CHAR_TAB_KEYS[tab];
                const info = FEATURE_INFO[key];
                if (!info) return null;
                return (
                  <>
                    <div className="text-4xl mb-4">{info.emoji}</div>
                    <h3 className="text-lg font-bold text-white mb-2">{info.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed mb-6">{info.description}</p>
                    <div className="grid grid-cols-2 gap-1.5 w-full mb-6">
                      {info.capabilities.map(c => (
                        <div key={c} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-gray-400"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <FiZap size={9} style={{ color: ACCENT }} className="flex-shrink-0" />{c}
                        </div>
                      ))}
                    </div>
                    <button onClick={() => onFeature(key)}
                      className="px-6 py-2.5 rounded-xl text-sm font-medium text-white hover:opacity-90 transition-all"
                      style={{ background: A_SOFT, border: `1px solid ${A_BORDER}`, color: '#A78BFA' }}>
                      Learn More About {info.title}
                    </button>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ─── Agents Panel ─────────────────────────────────────────────────
function AgentsPanel({ onFeature }) {
  return (
    <div className="flex-1 overflow-y-auto p-6 min-h-0">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-white">Agent System</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {AGENTS.filter(a => a.status === 'active').length} active ·{' '}
            {AGENTS.filter(a => a.status === 'standby').length} standby ·{' '}
            {AGENTS.filter(a => a.status === 'idle').length} idle
          </p>
        </div>
        <button onClick={() => onFeature('deploy-agent')}
          className="px-4 py-2 rounded-xl text-xs font-medium text-white hover:opacity-90 transition-all"
          style={{ background: ACCENT }}>
          + Deploy Agent
        </button>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {AGENTS.map(agent => {
          const isActive = agent.status === 'active';
          return (
            <div key={agent.name}
              className="p-4 rounded-xl cursor-pointer transition-all hover:border-purple-500/30"
              style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.07)' }}
              onClick={() => onFeature({ agent })}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: A_SOFT }}>
                  {agent.icon}
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full"
                    style={{ background: STATUS_COLOR[agent.status], boxShadow: STATUS_GLOW[agent.status] }} />
                  <span className="text-[10px] text-gray-500 capitalize">{agent.status}</span>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-white mb-0.5">{agent.name}</h3>
              <p className="text-[10px] font-medium mb-2" style={{ color: ACCENT }}>{agent.role}</p>
              <p className="text-[10px] text-gray-600 leading-relaxed mb-3">{agent.desc}</p>
              <button
                onClick={e => { e.stopPropagation(); onFeature({ agent }); }}
                className="w-full py-1.5 rounded-lg text-[10px] font-medium transition-all border"
                style={isActive
                  ? { color: '#10B981', borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.08)' }
                  : { color: '#9CA3AF', borderColor: 'rgba(255,255,255,0.08)', background: 'transparent' }
                }>
                {isActive ? 'View Agent' : 'Activate Agent'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Hub ─────────────────────────────────────────────────────
export default function GroitAIHub() {
  const [section,     setSection]     = useState('dashboard');
  const [projectOpen, setProjectOpen] = useState(false);
  const [modal,       setModal]       = useState(null);
  const projRef = useRef(null);

  useEffect(() => {
    const h = e => { if (projRef.current && !projRef.current.contains(e.target)) setProjectOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  function openFeature(keyOrAgent) {
    if (typeof keyOrAgent === 'string') {
      const info = FEATURE_INFO[keyOrAgent];
      if (info) setModal(info);
    } else if (keyOrAgent?.agent) {
      const a = keyOrAgent.agent;
      const caps = AGENT_CAPS[a.name] || [];
      const isActive = a.status === 'active';
      setModal({
        title: a.name,
        emoji: a.icon,
        badge: a.status.charAt(0).toUpperCase() + a.status.slice(1),
        statusColor: STATUS_COLOR[a.status],
        description: `${a.desc}. ${isActive
          ? `${a.name} is currently active and processing tasks within the Griot AI production pipeline.`
          : `Activating ${a.name} will deploy this agent into your production pipeline, where it will begin ${a.role.toLowerCase()} operations and integrate with connected tools.`}`,
        capabilities: caps,
        note: isActive
          ? `${a.name} is live. Agent configuration and task management are coming in the next production release.`
          : `Full activation requires a connected LLM and production API key. Agent deployment is coming soon.`,
      });
    }
  }

  function renderSection() {
    switch (section) {
      case 'dashboard':    return <Dashboard setSection={setSection} onFeature={openFeature} />;
      case 'story':        return <StoryBuilder onFeature={openFeature} />;
      case 'characters':   return <CharacterBuilder onFeature={openFeature} />;
      case 'agents':       return <AgentsPanel onFeature={openFeature} />;
      case 'world':        return <ComingSoon title="World Builder"    icon={FiGlobe}    features={['Locations','Kingdoms & Planets','Rules of the World','Culture & History','Maps','Factions','Technology / Magic Systems','Timeline Connections']} />;
      case 'timeline':     return <ComingSoon title="Timeline Builder" icon={FiClock}    features={['Story Events','Character Arcs','Chapter Order','Flashbacks','Future Events','Continuity Tracker','Conflict Tracker','Season / Series Timeline']} />;
      case 'image-studio': return <ComingSoon title="Image Studio"     icon={FiImage}    features={['Text to Image','Image to Image','Character Reference','Scene Image','Style Reference','Inpainting','Background Replacement','Image Upscaling','Midjourney-style','Stable Diffusion-style','Leonardo-style']} />;
      case 'video-studio': return <ComingSoon title="Video Studio"     icon={FiFilm}     features={['Image to Video','Video to Video','Character Motion Transfer','Scene Animation','Trailer Builder','Storyboard to Video','Character Lip Sync','Shot List','Export for YouTube / Film / Reels','Runway / Pika / Kling / Luma']} />;
      case 'voice-studio': return <ComingSoon title="Voice Studio"     icon={FiMic}      features={['Import 11Labs Voices','Upload Actor Recordings','Voice Cloning','Narration','Dialogue Generation','Character Voice Matching','Podcast Voice Format','Radio Drama Format','ElevenLabs Integration','PlayHT-style']} />;
      case 'music-studio': return <ComingSoon title="Music Studio"     icon={FiMusic}    features={['Song Idea Builder','Lyric Writer','Hook Builder','Beat Direction','Vocal Session Planner','Mix Notes','Cover Art Request','Music Video Request','Radio / Podcast Promotion','Export Song Package']} />;
      case 'film-studio':  return <ComingSoon title="Film Studio"      icon={FiCamera}   features={['Script Builder','Scene Builder','Shot Designer','Storyboard','Character Casting','Voice Casting','Image Generation','Video Generation','Trailer Builder','Schedule & Budget','Continuity','Export Film Package']} />;
      case 'publish':      return <ComingSoon title="Publish"          icon={FiSend}     features={['Book Format','Comic Format','Podcast Format','Film Format','Music Format','Distribution','Platform Export','Radio Drama']} />;
      case 'export':       return <ComingSoon title="Export"           icon={FiDownload} features={['Export Story Package','Export Script','Export Comic Package','Export Film Package','Export Music Package','Version Archive','Cloud Backup']} />;
      default:             return <Dashboard setSection={setSection} onFeature={openFeature} />;
    }
  }

  return (
    <div className="flex flex-col h-full min-h-0 relative overflow-hidden" style={{ background: '#0d0d0d' }}>

      {/* Synapse background */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.45 }}>
        <div className="synapse-bg" />
      </div>
      <div className="absolute inset-0 pointer-events-none bg-black/60" />

      {/* Modal */}
      <FeatureModal modal={modal} onClose={() => setModal(null)} />

      {/* ── Section nav bar ─────────────────────────────── */}
      <div className="relative z-10 flex items-center gap-1 px-3 h-11 border-b border-white/6 flex-shrink-0 overflow-x-auto"
        style={{ background: 'rgba(17,17,17,0.88)' }}>

        <div className="relative flex-shrink-0 mr-1" ref={projRef}>
          <button onClick={() => setProjectOpen(o => !o)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              background: projectOpen ? A_SOFT : 'transparent',
              border:     `1px solid ${projectOpen ? A_BORDER : 'transparent'}`,
              color:      projectOpen ? '#A78BFA' : '#9CA3AF',
            }}>
            <FiFolder size={12} /> Project
            <FiChevronDown size={10} className={`transition-transform ${projectOpen ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {projectOpen && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.12 }}
                className="absolute left-0 top-full mt-1 z-50 w-52 rounded-xl py-1 shadow-2xl"
                style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}>
                {PROJECT_ITEMS.map(item => (
                  <button key={item}
                    onClick={() => { setProjectOpen(false); setSection(PROJECT_ROUTES[item]); }}
                    className="w-full text-left px-4 py-2 text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                    {item}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-px h-5 bg-white/10 mx-1 flex-shrink-0" />

        {NAV.map(n => (
          <button key={n.id} onClick={() => setSection(n.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all ${
              section === n.id ? 'text-white' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
            }`}
            style={section === n.id
              ? { background: A_SOFT, border: `1px solid ${A_BORDER}`, color: '#A78BFA' }
              : { border: '1px solid transparent' }}>
            <n.icon size={11} className="flex-shrink-0" /> {n.label}
          </button>
        ))}
      </div>

      {/* ── Content ───────────────────────────────────────── */}
      <div className="relative z-10 flex-1 min-h-0 overflow-hidden flex flex-col">
        {renderSection()}
      </div>
    </div>
  );
}
