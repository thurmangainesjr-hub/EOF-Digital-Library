// EOF Faceless Videos — Universal Asset Pipeline
// Shared storage utilities used across all studios

export function lsGet(key, fb) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fb; }
  catch { return fb; }
}
export function lsSet(key, v) {
  try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
}

// ── Asset type registry ────────────────────────────────────────────────────────
export const ASSET_TYPE_META = {
  script:    { icon:'📝', color:'#10B981', folder:'Scripts',       track:'CA' },
  prompt:    { icon:'💬', color:'#6B7280', folder:'Prompts',       track:null },
  image:     { icon:'🖼️', color:'#3B82F6', folder:'Images',        track:'IM' },
  character: { icon:'👤', color:'#EC4899', folder:'Characters',    track:'IM' },
  background:{ icon:'🌄', color:'#60A5FA', folder:'Backgrounds',   track:'V1' },
  animation: { icon:'✨', color:'#A78BFA', folder:'Animations',    track:'MG' },
  video:     { icon:'🎬', color:'#EC4899', folder:'Video Clips',   track:'V1' },
  voice:     { icon:'🎙️', color:'#8B5CF6', folder:'Voiceovers',   track:'VC' },
  music:     { icon:'🎵', color:'#F59E0B', folder:'Music',         track:'MU' },
  sfx:       { icon:'🔊', color:'#EF4444', folder:'Sound Effects', track:'SX' },
  caption:   { icon:'💬', color:'#6EE7B7', folder:'Captions',      track:'CA' },
  template:  { icon:'📋', color:'#D4AF37', folder:'Templates',     track:null },
  logo:      { icon:'⭐', color:'#D97706', folder:'Logos',         track:'BL' },
  brand:     { icon:'🎨', color:'#7C3AED', folder:'Brand Kit',     track:'BL' },
  export:    { icon:'🚀', color:'#10B981', folder:'Exports',       track:null },
};

export const ASSET_FOLDERS = [
  { name:'Recent Assets',  icon:'🕐' },
  { name:'Favorites',      icon:'⭐' },
  { name:'AI Generated',   icon:'🤖' },
  { name:'Scripts',        icon:'📝' },
  { name:'Prompts',        icon:'💬' },
  { name:'Images',         icon:'🖼️' },
  { name:'Characters',     icon:'👤' },
  { name:'Backgrounds',    icon:'🌄' },
  { name:'Animations',     icon:'✨' },
  { name:'Video Clips',    icon:'🎬' },
  { name:'Voiceovers',     icon:'🎙️' },
  { name:'Music',          icon:'🎵' },
  { name:'Sound Effects',  icon:'🔊' },
  { name:'Captions',       icon:'💬' },
  { name:'Templates',      icon:'📋' },
  { name:'Logos',          icon:'⭐' },
  { name:'Brand Kit',      icon:'🎨' },
  { name:'Exports',        icon:'🚀' },
  { name:'Archive',        icon:'📦' },
  { name:'Imported Files', icon:'📁' },
];

// ── Timeline track definitions (all 17) ───────────────────────────────────────
export const TIMELINE_TRACKS_SEED = [
  { id:'V1', label:'Video Track 1',   type:'video',  color:'#EC4899', clips:[], muted:false, locked:false, solo:false },
  { id:'V2', label:'Video Track 2',   type:'video',  color:'#F472B6', clips:[], muted:false, locked:false, solo:false },
  { id:'BR', label:'B-Roll',          type:'video',  color:'#10B981', clips:[], muted:false, locked:false, solo:false },
  { id:'MG', label:'Motion Graphics', type:'motion', color:'#A78BFA', clips:[], muted:false, locked:false, solo:false },
  { id:'IM', label:'Image Track',     type:'image',  color:'#60A5FA', clips:[], muted:false, locked:false, solo:false },
  { id:'VC', label:'Voice Track',     type:'voice',  color:'#8B5CF6', clips:[], muted:false, locked:false, solo:false },
  { id:'DL', label:'Dialogue Track',  type:'voice',  color:'#7C3AED', clips:[], muted:false, locked:false, solo:false },
  { id:'MU', label:'Music Track',     type:'music',  color:'#F59E0B', clips:[], muted:false, locked:false, solo:false },
  { id:'SX', label:'Sound FX',        type:'sfx',    color:'#EF4444', clips:[], muted:false, locked:false, solo:false },
  { id:'CA', label:'Captions',        type:'text',   color:'#6EE7B7', clips:[], muted:false, locked:false, solo:false },
  { id:'SB', label:'Subtitles',       type:'text',   color:'#A3E635', clips:[], muted:false, locked:false, solo:false },
  { id:'OV', label:'Overlay Track',   type:'overlay',color:'#FB923C', clips:[], muted:false, locked:false, solo:false },
  { id:'CG', label:'Color Grade',     type:'fx',     color:'#9CA3AF', clips:[], muted:false, locked:false, solo:false },
  { id:'FX', label:'Effects Layer',   type:'fx',     color:'#6B7280', clips:[], muted:false, locked:false, solo:false },
  { id:'TR', label:'Transition Layer',type:'fx',     color:'#4B5563', clips:[], muted:false, locked:false, solo:false },
  { id:'BL', label:'Brand Overlay',   type:'brand',  color:'#D4AF37', clips:[], muted:false, locked:false, solo:false },
  { id:'EX', label:'Export Layer',    type:'export', color:'#10B981', clips:[], muted:false, locked:false, solo:false },
];

// ── Project memory seed ────────────────────────────────────────────────────────
export const PROJECT_MEMORY_SEED = {
  name: 'My First Love — EP1',
  currentScene: 1,
  characters: [],
  narrator: 'narrator-1',
  promptHistory: [],
  brandColors: ['#10B981', '#D4AF37', '#000000', '#FFFFFF'],
  fonts: ['Inter', 'Playfair Display'],
  musicSelections: [],
  voiceSettings: { speed: 1, pitch: 0, emotion: 'Neutral' },
  thumbnailStyle: 'Cinematic',
  exportPresets: ['YouTube', 'TikTok'],
  cameraPresets: [],
  motionPresets: [],
  lastModified: null,
};

// ── Asset helpers (used by hook in hub) ───────────────────────────────────────
export function makeAsset(partial) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2,7)}`,
    name: partial.name || 'Untitled Asset',
    type: partial.type || 'image',
    folder: partial.folder || ASSET_TYPE_META[partial.type]?.folder || 'AI Generated',
    content: partial.content || '',
    tags: partial.tags || [],
    starred: false,
    aiGenerated: partial.aiGenerated !== false,
    preview: partial.preview || null,
    dur: partial.dur || null,
    createdAt: new Date().toISOString(),
    addedToTimeline: false,
  };
}

// ── Export presets registry ────────────────────────────────────────────────────
export const EXPORT_PRESETS = [
  // Platform
  { cat:'Platform',   name:'YouTube',           specs:'1920×1080 · MP4 · 30fps',  emoji:'▶️', color:'#FF0000' },
  { cat:'Platform',   name:'YouTube Shorts',    specs:'1080×1920 · MP4 · 60fps',  emoji:'▶️', color:'#FF0000' },
  { cat:'Platform',   name:'TikTok',            specs:'1080×1920 · MP4 · 60fps',  emoji:'🎵', color:'#69C9D0' },
  { cat:'Platform',   name:'Instagram Reels',   specs:'1080×1920 · MP4 · 30fps',  emoji:'📷', color:'#E1306C' },
  { cat:'Platform',   name:'Facebook',          specs:'1920×1080 · MP4 · 30fps',  emoji:'👥', color:'#1877F2' },
  { cat:'Platform',   name:'X / Twitter',       specs:'1280×720 · MP4 · 30fps',   emoji:'✖️', color:'#1DA1F2' },
  { cat:'Platform',   name:'LinkedIn',          specs:'1920×1080 · MP4 · 30fps',  emoji:'💼', color:'#0A66C2' },
  { cat:'Platform',   name:'Podcast Video',     specs:'1920×1080 · MP4 · 30fps',  emoji:'🎙️', color:'#8B5CF6' },
  // Resolution
  { cat:'Resolution', name:'1080p',             specs:'1920×1080 · MP4',           emoji:'📺', color:'#10B981' },
  { cat:'Resolution', name:'2K',                specs:'2560×1440 · MP4',           emoji:'🖥️', color:'#10B981' },
  { cat:'Resolution', name:'4K',                specs:'3840×2160 · MP4',           emoji:'✨', color:'#10B981' },
  { cat:'Resolution', name:'Vertical',          specs:'1080×1920 · MP4',           emoji:'📱', color:'#10B981' },
  { cat:'Resolution', name:'Horizontal',        specs:'1920×1080 · MP4',           emoji:'🖥️', color:'#10B981' },
  { cat:'Resolution', name:'Square',            specs:'1080×1080 · MP4',           emoji:'⬛', color:'#10B981' },
  { cat:'Resolution', name:'Transparent Alpha', specs:'ProRes 4444 · RGBA',        emoji:'🔲', color:'#10B981' },
  { cat:'Resolution', name:'PNG Sequence',      specs:'Lossless per-frame',        emoji:'📸', color:'#10B981' },
  // Format
  { cat:'Format',     name:'MP4',               specs:'H.264 · Compressed',        emoji:'🎬', color:'#6B7280' },
  { cat:'Format',     name:'MOV',               specs:'ProRes · High Quality',     emoji:'🎞️', color:'#6B7280' },
  { cat:'Format',     name:'WebM',              specs:'VP9 · Web Optimized',       emoji:'🌐', color:'#6B7280' },
  { cat:'Format',     name:'GIF',               specs:'Animated · 480p max',       emoji:'🎭', color:'#6B7280' },
  { cat:'Format',     name:'Image Sequence',    specs:'JPEG/PNG per frame',        emoji:'🖼️', color:'#6B7280' },
  { cat:'Format',     name:'Custom Export',     specs:'Manual configuration',      emoji:'⚙️', color:'#D4AF37' },
  // Batch
  { cat:'Batch',      name:'EOF Streaming',     specs:'4K · HLS · Multi-bitrate',  emoji:'📺', color:'#EF4444' },
  { cat:'Batch',      name:'All Platforms',     specs:'Auto-resize × 8 platforms', emoji:'📦', color:'#10B981' },
];

// ── AI next-step actions (post-generation prompt) ─────────────────────────────
export const AI_NEXT_ACTIONS = [
  { label:'Add to Timeline',        icon:'🎬', forTypes:['script','image','voice','video','music'] },
  { label:'Generate Variations',    icon:'⚡', forTypes:['image','voice','music'] },
  { label:'Upscale',                icon:'📐', forTypes:['image'] },
  { label:'Animate',                icon:'📹', forTypes:['image'] },
  { label:'Extend Scene',           icon:'➕', forTypes:['video'] },
  { label:'Generate Voice',         icon:'🎙️', forTypes:['script','image'] },
  { label:'Generate Music',         icon:'🎵', forTypes:['script','video'] },
  { label:'Generate Captions',      icon:'💬', forTypes:['voice','video'] },
  { label:'Create Thumbnail',       icon:'🖼️', forTypes:['script','video'] },
  { label:'Generate Social Clips',  icon:'📱', forTypes:['video'] },
  { label:'Publish Later',          icon:'🚀', forTypes:['video','export'] },
  { label:'Export',                 icon:'📤', forTypes:['video','image','voice'] },
];
