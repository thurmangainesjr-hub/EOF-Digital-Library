// EOF Faceless Videos — Universal Format System
// Every component reads from here to adapt to the active project format

export const FORMATS = {
  youtube: {
    id: 'youtube', name: 'YouTube', icon: '▶️',
    w: 1920, h: 1080, ratio: '16:9',
    desc: 'Standard YouTube video',
    orientation: 'landscape',
    safeArea: { top: 60, bottom: 100, left: 80, right: 80 },
    storyboardStyle: 'wide',
    cameraMode: 'documentary',
    platform: 'youtube',
  },
  youtube_4k: {
    id: 'youtube_4k', name: 'YouTube 4K', icon: '✨',
    w: 3840, h: 2160, ratio: '16:9',
    desc: '4K Ultra HD',
    orientation: 'landscape',
    safeArea: { top: 120, bottom: 200, left: 160, right: 160 },
    storyboardStyle: 'wide',
    cameraMode: 'cinematic',
    platform: 'youtube',
  },
  shorts: {
    id: 'shorts', name: 'Shorts / TikTok / Reels', icon: '📱',
    w: 1080, h: 1920, ratio: '9:16',
    desc: 'Vertical video — all short-form platforms',
    orientation: 'portrait',
    safeArea: { top: 150, bottom: 280, left: 60, right: 60 },
    storyboardStyle: 'vertical',
    cameraMode: 'shorts',
    platform: 'tiktok',
  },
  square: {
    id: 'square', name: 'Square', icon: '⬛',
    w: 1080, h: 1080, ratio: '1:1',
    desc: 'Instagram Feed / Facebook',
    orientation: 'square',
    safeArea: { top: 60, bottom: 60, left: 60, right: 60 },
    storyboardStyle: 'square',
    cameraMode: 'documentary',
    platform: 'instagram',
  },
  portrait: {
    id: 'portrait', name: 'Portrait', icon: '📷',
    w: 1080, h: 1350, ratio: '4:5',
    desc: 'Instagram Portrait — maximum feed space',
    orientation: 'portrait',
    safeArea: { top: 80, bottom: 80, left: 60, right: 60 },
    storyboardStyle: 'portrait',
    cameraMode: 'documentary',
    platform: 'instagram',
  },
  cinematic_235: {
    id: 'cinematic_235', name: 'Cinematic 2.35:1', icon: '🎬',
    w: 2350, h: 1000, ratio: '2.35:1',
    desc: 'Anamorphic widescreen',
    orientation: 'ultrawide',
    safeArea: { top: 40, bottom: 40, left: 120, right: 120 },
    storyboardStyle: 'ultrawide',
    cameraMode: 'cinematic',
    platform: 'youtube',
  },
  cinematic_239: {
    id: 'cinematic_239', name: 'Cinematic 2.39:1', icon: '🎬',
    w: 2390, h: 1000, ratio: '2.39:1',
    desc: 'Ultra widescreen — film standard',
    orientation: 'ultrawide',
    safeArea: { top: 40, bottom: 40, left: 120, right: 120 },
    storyboardStyle: 'ultrawide',
    cameraMode: 'cinematic',
    platform: 'youtube',
  },
  custom: {
    id: 'custom', name: 'Custom', icon: '⚙️',
    w: null, h: null, ratio: null,
    desc: 'Enter your own dimensions',
    orientation: 'custom',
    safeArea: { top: 60, bottom: 100, left: 80, right: 80 },
    storyboardStyle: 'wide',
    cameraMode: 'documentary',
    platform: 'youtube',
  },
};

// ── Camera angle library ───────────────────────────────────────────────────────
export const CAMERA_ANGLES = {
  documentary: [
    { id: 'wide_est',   name: 'Wide Establishing', icon: '🌆', desc: 'Set the scene, reveal the world' },
    { id: 'slow_push',  name: 'Slow Push-In',       icon: '🎯', desc: 'Build tension and intimacy' },
    { id: 'handheld',   name: 'Handheld',            icon: '📹', desc: 'Raw, authentic energy' },
    { id: 'med_int',    name: 'Medium Interview',    icon: '🎙️', desc: 'Subject-focused framing' },
    { id: 'arch_zoom',  name: 'Archival Zoom',       icon: '🔍', desc: 'Historical detail reveal' },
    { id: 'cutaway',    name: 'Cutaway',             icon: '✂️', desc: 'Support narration visually' },
  ],
  shorts: [
    { id: 'tight_cu',   name: 'Tight Close-Up',     icon: '👁️', desc: 'Instant hook — immediate impact' },
    { id: 'fast_push',  name: 'Fast Push',           icon: '⚡', desc: 'Energy and momentum' },
    { id: 'vert_track', name: 'Vertical Tracking',   icon: '📱', desc: 'Mobile-native movement' },
    { id: 'quick_zoom', name: 'Quick Zoom',          icon: '🔭', desc: 'Emphasis and punchline' },
    { id: 'dyn_motion', name: 'Dynamic Motion',      icon: '💥', desc: 'Excitement and engagement' },
    { id: 'text_bomb',  name: 'Text Bomb',           icon: '💬', desc: 'Bold on-screen text reveal' },
  ],
  cinematic: [
    { id: 'dolly',      name: 'Dolly',               icon: '🎬', desc: 'Smooth lateral movement' },
    { id: 'crane',      name: 'Crane',               icon: '🏗️', desc: 'Reveal from above' },
    { id: 'drone',      name: 'Drone',               icon: '🚁', desc: 'Aerial scope and grandeur' },
    { id: 'tracking',   name: 'Tracking',            icon: '🎯', desc: 'Follow the action' },
    { id: 'orbit',      name: 'Orbit',               icon: '⭕', desc: 'Character / object reveal' },
    { id: 'rack_focus', name: 'Rack Focus',          icon: '📷', desc: 'Depth of field shift' },
  ],
};

// ── Platform export presets ────────────────────────────────────────────────────
export const PLATFORM_EXPORTS = [
  { id: 'youtube',     name: 'YouTube',            icon: '▶️', w: 1920, h: 1080, fps: 30,  emoji: '▶️', color: '#FF0000' },
  { id: 'yt_shorts',   name: 'YouTube Shorts',     icon: '📱', w: 1080, h: 1920, fps: 60,  emoji: '📱', color: '#FF0000' },
  { id: 'tiktok',      name: 'TikTok',             icon: '🎵', w: 1080, h: 1920, fps: 60,  emoji: '🎵', color: '#69C9D0' },
  { id: 'ig_reels',    name: 'Instagram Reels',    icon: '📷', w: 1080, h: 1920, fps: 30,  emoji: '📷', color: '#E1306C' },
  { id: 'ig_feed',     name: 'Instagram Feed',     icon: '🟣', w: 1080, h: 1080, fps: 30,  emoji: '🟣', color: '#833AB4' },
  { id: 'fb_video',    name: 'Facebook Video',     icon: '👥', w: 1920, h: 1080, fps: 30,  emoji: '👥', color: '#1877F2' },
  { id: 'fb_reels',    name: 'Facebook Reels',     icon: '🔵', w: 1080, h: 1920, fps: 30,  emoji: '🔵', color: '#1877F2' },
  { id: 'x_twitter',   name: 'X / Twitter',        icon: '✖️', w: 1280, h: 720,  fps: 30,  emoji: '✖️', color: '#1DA1F2' },
  { id: 'linkedin',    name: 'LinkedIn',            icon: '💼', w: 1920, h: 1080, fps: 30,  emoji: '💼', color: '#0A66C2' },
  { id: 'pinterest',   name: 'Pinterest',           icon: '📌', w: 1000, h: 1500, fps: 30,  emoji: '📌', color: '#E60023' },
  { id: 'snapchat',    name: 'Snapchat Spotlight',  icon: '👻', w: 1080, h: 1920, fps: 60,  emoji: '👻', color: '#FFFC00' },
];

// ── Thumbnail types per platform ───────────────────────────────────────────────
export const THUMBNAIL_TYPES = [
  { id: 'youtube',    name: 'YouTube Thumbnail',  w: 1280, h: 720,  icon: '▶️' },
  { id: 'shorts',     name: 'Shorts Cover',       w: 1080, h: 1920, icon: '📱' },
  { id: 'tiktok',     name: 'TikTok Cover',       w: 1080, h: 1920, icon: '🎵' },
  { id: 'facebook',   name: 'Facebook Cover',     w: 1200, h: 630,  icon: '👥' },
  { id: 'podcast',    name: 'Podcast Cover',      w: 3000, h: 3000, icon: '🎙️' },
  { id: 'streaming',  name: 'Streaming Poster',   w: 2000, h: 3000, icon: '📺' },
];

// ── Social content repurposing types ──────────────────────────────────────────
export const SOCIAL_CONTENT_TYPES = [
  { id: 'full_episode',  name: 'Full YouTube Episode',       icon: '▶️', auto: true,  platform: 'youtube'   },
  { id: 'trailer',       name: 'Trailer (60–90s)',           icon: '🎬', auto: true,  platform: 'youtube'   },
  { id: 'teaser',        name: 'Teaser (15–30s)',            icon: '⚡', auto: true,  platform: 'youtube'   },
  { id: 'short_60',      name: '60-Second Short',            icon: '📱', auto: true,  platform: 'tiktok'    },
  { id: 'reel_30',       name: '30-Second Reel',             icon: '📱', auto: true,  platform: 'instagram' },
  { id: 'tiktok_clip',   name: 'TikTok Clip',               icon: '🎵', auto: true,  platform: 'tiktok'    },
  { id: 'quote_cards',   name: 'Quote Cards',                icon: '💬', auto: true,  platform: 'instagram' },
  { id: 'bts',           name: 'Behind-the-Scenes Clips',   icon: '🎥', auto: false, platform: 'instagram' },
  { id: 'thumb_vars',    name: 'Thumbnail Variations',      icon: '🖼️', auto: true,  platform: 'youtube'   },
  { id: 'promo_imgs',    name: 'Promotional Images',        icon: '📸', auto: true,  platform: 'instagram' },
  { id: 'community',     name: 'Community Posts',            icon: '📝', auto: true,  platform: 'youtube'   },
  { id: 'banner',        name: 'Channel Banner Suggestion',  icon: '🎨', auto: false, platform: 'youtube'   },
];

// ── 7-step workflow definition ─────────────────────────────────────────────────
export const WORKFLOW_STEPS = [
  { id: 'script',     num: 1, label: 'Script',      icon: '✍️', desc: 'Write or import your script' },
  { id: 'storyboard', num: 2, label: 'Storyboard',  icon: '🎬', desc: 'AI plans your shots'          },
  { id: 'images',     num: 3, label: 'Images',      icon: '🖼️', desc: 'Generate scene visuals'       },
  { id: 'animate',    num: 4, label: 'Animate',     icon: '📹', desc: 'Bring images to life'          },
  { id: 'edit',       num: 5, label: 'Edit',        icon: '✂️', desc: 'Timeline and effects'          },
  { id: 'thumbnail',  num: 6, label: 'Thumbnail',   icon: '🖼️', desc: 'AI thumbnail concepts'        },
  { id: 'export',     num: 7, label: 'Export',      icon: '🚀', desc: 'Publish everywhere'            },
];

// Helper: get aspect ratio CSS value for format
export function getRatioCss(format) {
  if (!format) return '16 / 9';
  const { w, h } = format;
  if (!w || !h) return '16 / 9';
  return `${w} / ${h}`;
}

// Helper: get storyboard card dimensions (normalized to fit UI)
export function getCardDimensions(format) {
  const orientation = format?.orientation || 'landscape';
  switch (orientation) {
    case 'portrait':   return { w: 90,  h: 160 };
    case 'ultrawide':  return { w: 200, h: 85  };
    case 'square':     return { w: 130, h: 130 };
    default:           return { w: 160, h: 90  };  // landscape
  }
}
