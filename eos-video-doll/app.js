// ══════════════════════════════════════════════
//  EOF Video Studio — app.js
// ══════════════════════════════════════════════

// ── Element refs (Clip Trimmer) ──
const videoInput       = document.getElementById('video-input');
const btnAddMedia      = document.getElementById('btn-add-media');
const mediaList        = document.getElementById('media-list');
const mediaEmpty       = document.getElementById('media-empty');
const videoPlayer      = document.getElementById('video-player');
const previewPlaceholder = document.getElementById('preview-placeholder');
const previewBadge     = document.getElementById('preview-badge');
const btnPlay          = document.getElementById('btn-play');
const btnSkipStart     = document.getElementById('btn-skip-start');
const btnSkipEnd       = document.getElementById('btn-skip-end');
const timecode         = document.getElementById('timecode');
const btnPreviewTrim   = document.getElementById('btn-preview-trim');
const trackLaneV1      = document.getElementById('track-lane-v1');
const clipBlock        = document.getElementById('clip-block');
const clipBlockName    = document.getElementById('clip-block-name');
const trackEmptyHint   = document.getElementById('track-empty-hint');
const timelineTrack    = document.getElementById('timeline-track');
const playhead         = document.getElementById('playhead');
const trimRegion       = document.getElementById('trim-region');
const handleStart      = document.getElementById('handle-start');
const handleEnd        = document.getElementById('handle-end');
const rulerStart       = document.getElementById('ruler-start');
const rulerMid         = document.getElementById('ruler-mid');
const rulerEnd         = document.getElementById('ruler-end');
const trimReadout      = document.getElementById('trim-readout');
const trimInLabel      = document.getElementById('trim-in-label');
const trimDurLabel     = document.getElementById('trim-dur-label');
const trimOutLabel     = document.getElementById('trim-out-label');
const propsEmpty       = document.getElementById('props-empty');
const propsDetail      = document.getElementById('props-detail');
const propName         = document.getElementById('prop-name');
const propDuration     = document.getElementById('prop-duration');
const propSize         = document.getElementById('prop-size');
const propTrimIn       = document.getElementById('prop-trim-in');
const propTrimOut      = document.getElementById('prop-trim-out');
const propTrimDur      = document.getElementById('prop-trim-dur');
const btnExportProps   = document.getElementById('btn-export-props');
const exportWrap       = document.getElementById('export-progress-wrap');
const exportStatus     = document.getElementById('export-status');
const exportBar        = document.getElementById('export-bar');
const projectName      = document.getElementById('project-name');
const zoomIn           = document.getElementById('zoom-in');
const zoomOut          = document.getElementById('zoom-out');
const zoomLabel        = document.getElementById('zoom-label');

// ── State ──
let currentFile = null;
const clipURLMap = new Map();   // File → objectURL (persists across multi-clip imports)
let currentObjectURL = null;
const trim = { start: 0, end: 1 };
let segments = [];              // [{ start, end }] fractions — supports split-at-playhead
let zoom = 100;
const undoStack = [];
const redoStack = [];

// ══════════════════════════════════════════════
//  VIEW SWITCHING
// ══════════════════════════════════════════════

const SOON_META = {
  color:    { icon: '🎨', title: 'Color Grade',   pills: ['LUT Manager','AI Color Match','Film Emulation','Skin Tone Balance'] },
  effects:  { icon: '✨', title: 'Effects',        pills: ['Blur & Glow','Chroma Key','Motion Blur','Lens Flare'] },
  audio:    { icon: '🎵', title: 'Audio Studio',   pills: ['Voice Cleanup','Noise Removal','AI Mastering','Podcast Workflow'] },
  overlays: { icon: '🖼️', title: 'Overlays',       pills: ['Lower Thirds','Titles','Logo Anim','Social Graphics'] },
};

document.querySelectorAll('[data-view]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const view = link.dataset.view;
    switchView(view, link);
  });
});

function switchView(view, linkEl) {
  document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
  if (linkEl) linkEl.classList.add('active');

  // Hide all views — must remove 'active' AND add 'hidden' (hidden has !important)
  document.querySelectorAll('.workspace-view').forEach(v => {
    v.classList.remove('active');
    v.classList.add('hidden');
  });

  const show = id => {
    const el = document.getElementById(id);
    if (el) { el.classList.remove('hidden'); el.classList.add('active'); }
  };

  if (['editor','multitrack','settings'].includes(view)) {
    show('view-' + view);
  } else if (SOON_META[view]) {
    const m = SOON_META[view];
    document.getElementById('soon-icon').textContent  = m.icon;
    document.getElementById('soon-title').textContent = m.title;
    document.getElementById('soon-title').nextElementSibling.innerHTML =
      `Professional ${m.title.toLowerCase()} with AI-powered tools.<br><br>Coming in EOF Video Studio v0.3.`;
    const pillsEl = document.querySelector('.soon-pills');
    pillsEl.innerHTML = m.pills.map(p => `<span class="soon-pill">${p}</span>`).join('');
    show('view-soon');
  }
}

// ══════════════════════════════════════════════
//  MEDIA IMPORT (Clip Trimmer)
// ══════════════════════════════════════════════

btnAddMedia.addEventListener('click', () => videoInput.click());

videoInput.addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('video/')) {
    alert('Please select a video file (MP4, WebM, MOV).');
    return;
  }
  importClip(file);
  videoInput.value = '';
});

function importClip(file) {
  currentFile = file;
  if (!clipURLMap.has(file)) {
    clipURLMap.set(file, URL.createObjectURL(file));
  }
  currentObjectURL = clipURLMap.get(file);
  addMediaCard(file);
  loadIntoPlayer(file, currentObjectURL);
  if (projectName.textContent === 'Untitled Project') {
    projectName.textContent = file.name.replace(/\.[^/.]+$/, '');
  }
  // Refresh Editor Doll if open
  if (!document.getElementById('doll-panel').classList.contains('hidden')) {
    setTimeout(refreshDoll, 400);
  }
}

function addMediaCard(file) {
  mediaEmpty.style.display = 'none';
  document.querySelectorAll('.media-clip').forEach(c => c.classList.remove('active'));

  const cardURL = clipURLMap.get(file);
  const card = document.createElement('div');
  card.className = 'media-clip active';
  card.innerHTML = `
    <span class="media-thumb">🎬</span>
    <div class="media-info">
      <div class="media-name" title="${file.name}">${file.name}</div>
      <div class="media-dur">—</div>
    </div>
  `;
  card.addEventListener('click', () => {
    document.querySelectorAll('.media-clip').forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    currentFile = file;
    currentObjectURL = cardURL;
    loadIntoPlayer(file, cardURL);
  });
  mediaList.appendChild(card);

  videoPlayer.addEventListener('loadedmetadata', function onMeta() {
    card.querySelector('.media-dur').textContent = fmt(videoPlayer.duration);
    videoPlayer.removeEventListener('loadedmetadata', onMeta);
  }, { once: true });
}

// ══════════════════════════════════════════════
//  PLAYER SETUP (Clip Trimmer)
// ══════════════════════════════════════════════

function loadIntoPlayer(file, objectURL) {
  videoPlayer.src = objectURL;
  videoPlayer.style.display = 'block';
  previewPlaceholder.style.display = 'none';
  videoPlayer.addEventListener('loadedmetadata', onMetadataLoaded, { once: true });
}

function onMetadataLoaded() {
  const dur = videoPlayer.duration;
  trim.start = 0;
  trim.end   = 1;

  clipBlock.classList.add('hidden'); // segments system takes over
  trackEmptyHint.style.display = 'none';
  trimReadout.classList.remove('hidden');
  btnPreviewTrim.classList.remove('hidden');
  segments = [{ start: 0, end: 1 }];
  renderSegments();

  rulerStart.textContent = '0:00';
  rulerMid.textContent   = fmt(dur / 2);
  rulerEnd.textContent   = fmt(dur);

  propsEmpty.classList.add('hidden');
  propsDetail.classList.remove('hidden');
  propName.textContent     = currentFile.name;
  propDuration.textContent = fmt(dur);
  propSize.textContent     = fmtSize(currentFile.size);

  updateTrimUI();
  refreshDoll();
}

// ══════════════════════════════════════════════
//  PLAYBACK CONTROLS
// ══════════════════════════════════════════════

btnPlay.addEventListener('click', togglePlay);
function togglePlay() {
  if (videoPlayer.paused) videoPlayer.play();
  else videoPlayer.pause();
}

videoPlayer.addEventListener('play',  () => { btnPlay.textContent = '⏸'; previewBadge.classList.remove('hidden'); previewBadge.textContent = '▶ PLAYING'; });
videoPlayer.addEventListener('pause', () => { btnPlay.textContent = '▶'; previewBadge.classList.add('hidden'); });
videoPlayer.addEventListener('ended', () => { btnPlay.textContent = '▶'; previewBadge.classList.add('hidden'); });

btnSkipStart.addEventListener('click', () => { if (videoPlayer.src) { videoPlayer.currentTime = 0; videoPlayer.pause(); } });
btnSkipEnd.addEventListener('click',   () => { if (videoPlayer.src) { videoPlayer.currentTime = videoPlayer.duration; videoPlayer.pause(); } });

videoPlayer.addEventListener('timeupdate', () => {
  const cur = videoPlayer.currentTime;
  const dur = videoPlayer.duration || 1;
  timecode.textContent = `${fmt(cur)} / ${fmt(dur)}`;
  playhead.style.left = (cur / dur * 100) + '%';
});

// ══════════════════════════════════════════════
//  TRIM HANDLES
// ══════════════════════════════════════════════

makeDraggable(handleStart, 'start');
makeDraggable(handleEnd,   'end');

// ── Click-to-seek on the timeline ruler ──
timelineTrack.addEventListener('click', e => {
  if (e.target.closest('.trim-handle')) return; // handle clicks are draggable, not seek
  if (!videoPlayer.duration) return;
  const rect = timelineTrack.getBoundingClientRect();
  const f = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  videoPlayer.currentTime = f * videoPlayer.duration;
});

// ── Click-to-seek on V1 track lane ──
trackLaneV1.addEventListener('click', e => {
  if (e.target.closest('.seg-block')) return; // segment clicks select, not seek
  if (!videoPlayer.duration) return;
  const rect = trackLaneV1.getBoundingClientRect();
  const f = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  videoPlayer.currentTime = f * videoPlayer.duration;
});

// ── Cut tool button → split at playhead ──
document.getElementById('tool-cut').addEventListener('click', splitAtPlayhead);

function makeDraggable(handle, which) {
  handle.addEventListener('mousedown', function (e) {
    e.preventDefault();
    const rect = timelineTrack.getBoundingClientRect();
    let moved = false;

    function onMove(e) {
      if (!moved) { pushUndo(); moved = true; }
      let f = (e.clientX - rect.left) / rect.width;
      f = Math.max(0, Math.min(1, f));
      if (which === 'start') trim.start = Math.min(f, trim.end - 0.01);
      else                   trim.end   = Math.max(f, trim.start + 0.01);
      syncActiveSegment();
      updateTrimUI();
    }
    function onUp() {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup',   onUp);
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup',   onUp);
  });
}

function updateTrimUI() {
  const startPct = trim.start * 100;
  const endPct   = trim.end   * 100;

  handleStart.style.left = startPct + '%';
  handleEnd.style.left   = endPct   + '%';
  trimRegion.style.left  = startPct + '%';
  trimRegion.style.width = (endPct - startPct) + '%';

  const dur      = videoPlayer.duration || 0;
  const startSec = trim.start * dur;
  const endSec   = trim.end   * dur;
  const durSec   = endSec - startSec;

  trimInLabel.textContent  = 'In: '  + fmt(startSec);
  trimOutLabel.textContent = 'Out: ' + fmt(endSec);
  trimDurLabel.textContent = 'Dur: ' + fmt(durSec);

  propTrimIn.textContent  = fmt(startSec);
  propTrimOut.textContent = fmt(endSec);
  propTrimDur.textContent = fmt(durSec);
}

// ══════════════════════════════════════════════
//  KEYBOARD SHORTCUTS
// ══════════════════════════════════════════════

document.addEventListener('keydown', e => {
  // Don't fire when user is typing in an input or editable field
  if (e.target.matches('input, select, textarea') || e.target.isContentEditable) return;

  switch (e.code) {
    case 'Space':
      e.preventDefault();
      togglePlay();
      break;
    case 'KeyI':
      e.preventDefault();
      setTrimIn();
      break;
    case 'KeyO':
      e.preventDefault();
      setTrimOut();
      break;
    case 'KeyC':
      e.preventDefault();
      splitAtPlayhead();
      break;
  }
});

function setTrimIn() {
  if (!videoPlayer.duration) return;
  const f = videoPlayer.currentTime / videoPlayer.duration;
  if (f >= trim.end - 0.01) return;
  pushUndo();
  trim.start = f;
  syncActiveSegment();
  updateTrimUI();
  flashHandle(handleStart);
}

function setTrimOut() {
  if (!videoPlayer.duration) return;
  const f = videoPlayer.currentTime / videoPlayer.duration;
  if (f <= trim.start + 0.01) return;
  pushUndo();
  trim.end = f;
  syncActiveSegment();
  updateTrimUI();
  flashHandle(handleEnd);
}

function flashHandle(el) {
  el.classList.add('handle-flash');
  setTimeout(() => el.classList.remove('handle-flash'), 350);
}

// ══════════════════════════════════════════════
//  UNDO / REDO HELPERS
// ══════════════════════════════════════════════

function snapshotState() {
  return {
    trim: { ...trim },
    segments: segments.map(s => ({ ...s })),
  };
}

function restoreState(snap) {
  trim.start = snap.trim.start;
  trim.end   = snap.trim.end;
  segments   = snap.segments.map(s => ({ ...s }));
  updateTrimUI();
  renderSegments();
}

function pushUndo() {
  undoStack.push(snapshotState());
  redoStack.length = 0;
}

// Keep active segment in sync when trim handles move
function syncActiveSegment() {
  const idx = segments.findIndex(s =>
    Math.abs(s.start - trim.start) < 0.001 || Math.abs(s.end - trim.end) < 0.001
  );
  if (idx !== -1) {
    segments[idx] = { start: trim.start, end: trim.end };
    renderSegments();
  }
}

// ══════════════════════════════════════════════
//  SPLIT AT PLAYHEAD
// ══════════════════════════════════════════════

function splitAtPlayhead() {
  if (!videoPlayer.duration || !segments.length) return;
  const f = videoPlayer.currentTime / videoPlayer.duration;

  // Find which segment contains the playhead
  const idx = segments.findIndex(s => f > s.start + 0.01 && f < s.end - 0.01);
  if (idx === -1) return; // playhead not inside any segment — nothing to split

  pushUndo();
  const seg = segments[idx];

  // Replace segment with two halves
  segments.splice(idx, 1,
    { start: seg.start, end: f },
    { start: f,         end: seg.end }
  );

  // Select the right half, update trim
  trim.start = f;
  trim.end   = seg.end;
  updateTrimUI();
  renderSegments();

  // Flash both handles to signal the cut
  flashHandle(handleStart);
  flashHandle(handleEnd);
}

// ══════════════════════════════════════════════
//  SEGMENT RENDERING (V1 track lane)
// ══════════════════════════════════════════════

function renderSegments() {
  // Remove previous segment blocks
  trackLaneV1.querySelectorAll('.seg-block').forEach(el => el.remove());
  if (!segments.length || !currentFile) return;

  const label = currentFile.name.replace(/\.[^/.]+$/, '');
  const multi = segments.length > 1;

  segments.forEach((seg, i) => {
    const isActive = Math.abs(seg.start - trim.start) < 0.001 && Math.abs(seg.end - trim.end) < 0.001;
    const block = document.createElement('div');
    block.className = 'seg-block' + (isActive ? ' seg-active' : '');
    block.style.left  = (seg.start * 100) + '%';
    block.style.width = Math.max((seg.end - seg.start) * 100, 1) + '%';
    block.innerHTML   = `<div class="clip-inner">
      <span class="clip-seg-name">${label}${multi ? ` <span class="clip-seg-num">${i + 1}/${segments.length}</span>` : ''}</span>
    </div>`;

    block.addEventListener('click', e => {
      e.stopPropagation();
      trim.start = seg.start;
      trim.end   = seg.end;
      updateTrimUI();
      if (videoPlayer.duration) videoPlayer.currentTime = seg.start * videoPlayer.duration;
      renderSegments();
    });

    trackLaneV1.appendChild(block);
  });
}

// ══════════════════════════════════════════════
//  PREVIEW TRIM
// ══════════════════════════════════════════════

btnPreviewTrim.addEventListener('click', previewTrim);
function previewTrim() {
  if (!videoPlayer.src || !videoPlayer.duration) return;
  const startSec = trim.start * videoPlayer.duration;
  const endSec   = trim.end   * videoPlayer.duration;
  videoPlayer.currentTime = startSec;
  videoPlayer.play();
  function watchEnd() {
    if (videoPlayer.currentTime >= endSec) {
      videoPlayer.pause();
      videoPlayer.removeEventListener('timeupdate', watchEnd);
    }
  }
  videoPlayer.addEventListener('timeupdate', watchEnd);
}

// ══════════════════════════════════════════════
//  EXPORT (ffmpeg.wasm)
// ══════════════════════════════════════════════

btnExportProps.addEventListener('click', exportClip);
document.getElementById('btn-export-top').addEventListener('click', exportClip);

async function exportClip() {
  if (!currentFile || !videoPlayer.duration) return;
  const startSec = trim.start * videoPlayer.duration;
  const endSec   = trim.end   * videoPlayer.duration;
  const { createFFmpeg, fetchFile } = FFmpeg;
  const ffmpeg = createFFmpeg({
    log: true,
    progress: ({ ratio }) => {
      const pct = Math.round(ratio * 100);
      exportBar.style.width    = pct + '%';
      exportStatus.textContent = `Exporting… ${pct}%`;
    },
  });
  btnExportProps.disabled = true;
  exportWrap.classList.remove('hidden');
  exportBar.style.width    = '0%';
  exportStatus.textContent = 'Loading ffmpeg engine…';
  try {
    if (!ffmpeg.isLoaded()) await ffmpeg.load();
    exportStatus.textContent = 'Reading video file…';
    ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(currentFile));
    exportStatus.textContent = 'Trimming…';
    await ffmpeg.run('-i','input.mp4','-ss',String(startSec),'-to',String(endSec),'-c','copy','output.mp4');
    const data = ffmpeg.FS('readFile', 'output.mp4');
    const blob = new Blob([data.buffer], { type: 'video/mp4' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'trimmed-clip.mp4'; a.click();
    URL.revokeObjectURL(url);
    ffmpeg.FS('unlink', 'input.mp4');
    ffmpeg.FS('unlink', 'output.mp4');
    exportBar.style.width    = '100%';
    exportStatus.textContent = '✅ Export complete — check Downloads.';
  } catch (err) {
    console.error(err);
    exportStatus.textContent = '❌ Export failed. See console.';
  }
  btnExportProps.disabled = false;
}

// ══════════════════════════════════════════════
//  ZOOM
// ══════════════════════════════════════════════

function applyZoom() {
  zoomLabel.textContent = zoom + '%';
  const scale = zoom / 100;
  document.getElementById('timeline-track-wrap').style.width = (scale * 100) + '%';
  document.getElementById('track-lane-v1').style.width       = (scale * 100) + '%';
  document.getElementById('timeline-body').style.overflowX   = zoom > 100 ? 'auto' : 'hidden';
}

zoomIn.addEventListener('click',  () => { zoom = Math.min(zoom + 25, 400); applyZoom(); });
zoomOut.addEventListener('click', () => { zoom = Math.max(zoom - 25,  25); applyZoom(); });

// ══════════════════════════════════════════════
//  PROJECT NAME — inline edit
// ══════════════════════════════════════════════

projectName.setAttribute('contenteditable', 'true');
projectName.setAttribute('spellcheck', 'false');
projectName.addEventListener('keydown', e => {
  if (e.key === 'Enter') { e.preventDefault(); projectName.blur(); }
});
projectName.addEventListener('focus', () => {
  const range = document.createRange();
  range.selectNodeContents(projectName);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
});

// ══════════════════════════════════════════════
//  SAVE / UNDO / REDO
// ══════════════════════════════════════════════

document.getElementById('btn-save').addEventListener('click', () => {
  const state = {
    trim: { ...trim },
    projectName: projectName.textContent,
    wl: loadWLSettings(),
  };
  localStorage.setItem('eof-video-studio-save', JSON.stringify(state));
  const btn = document.getElementById('btn-save');
  const orig = btn.textContent;
  btn.textContent = '✅ Saved';
  setTimeout(() => { btn.textContent = orig; }, 1500);
});

document.getElementById('btn-undo').addEventListener('click', () => {
  if (!undoStack.length) return;
  redoStack.push(snapshotState());
  restoreState(undoStack.pop());
});
document.getElementById('btn-redo').addEventListener('click', () => {
  if (!redoStack.length) return;
  undoStack.push(snapshotState());
  restoreState(redoStack.pop());
});

// ══════════════════════════════════════════════
//  MULTI-TRACK ENGINE
// ══════════════════════════════════════════════

const mtState = {
  tracks: [],           // { id, type:'video'|'audio', clips:[] }
  projectDuration: 60,  // seconds (grows as clips are added)
  nextVideoId: 1,
  nextAudioId: 1,
};

// Seed with V1 + A1
addMTTrack('video');
addMTTrack('audio');

function addMTTrack(type) {
  const id = type === 'video'
    ? 'V' + (mtState.nextVideoId++)
    : 'A' + (mtState.nextAudioId++);
  const track = { id, type, clips: [] };
  mtState.tracks.push(track);
  renderMTTrack(track);
  document.getElementById('mt-drop-hint').style.display = 'none';
  return track;
}

function renderMTTrack(track) {
  const list = document.getElementById('mt-track-list');
  const row  = document.createElement('div');
  row.className = 'mt-track-row';
  row.id = 'mt-row-' + track.id;

  const label = document.createElement('div');
  label.className = 'mt-track-label' + (track.type === 'audio' ? ' audio' : '');
  label.innerHTML = `<span>${track.id}</span>`;

  const lane = document.createElement('div');
  lane.className = 'mt-track-lane';
  lane.id = 'mt-lane-' + track.id;

  // Accept drops from media cards
  lane.addEventListener('dragover', e => {
    e.preventDefault();
    lane.classList.add('drag-over');
  });
  lane.addEventListener('dragleave', () => lane.classList.remove('drag-over'));
  lane.addEventListener('drop', e => {
    e.preventDefault();
    lane.classList.remove('drag-over');
    const fileIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    const file = mtMediaFiles[fileIndex];
    if (file) placeMTClip(track, file, lane);
  });

  row.appendChild(label);
  row.appendChild(lane);
  list.appendChild(row);
}

function placeMTClip(track, file, lane) {
  if (!clipURLMap.has(file)) clipURLMap.set(file, URL.createObjectURL(file));
  const url = clipURLMap.get(file);

  // Load file temporarily to get duration, then render
  const tmp = document.createElement('video');
  tmp.src = url;
  tmp.addEventListener('loadedmetadata', () => {
    const dur = tmp.duration;
    const clipData = { file, url, duration: dur, startOffset: getNextOffset(track) };
    track.clips.push(clipData);
    renderMTClip(track, clipData, lane);
    updateMTProjectDuration();
    // Load into MT preview if this is V1 and no clip playing yet
    if (track.id === 'V1') loadMTPreview(url);
  }, { once: true });
}

function getNextOffset(track) {
  if (!track.clips.length) return 0;
  const last = track.clips[track.clips.length - 1];
  return last.startOffset + last.duration;
}

function renderMTClip(track, clip, lane) {
  const pct = (clip.duration / mtState.projectDuration) * 100;
  const leftPct = (clip.startOffset / mtState.projectDuration) * 100;

  const el = document.createElement('div');
  el.className = 'mt-clip' + (track.type === 'audio' ? ' audio-clip' : '');
  el.style.left  = leftPct + '%';
  el.style.width = Math.max(pct, 3) + '%';
  el.innerHTML   = `<span class="mt-clip-name">${clip.file.name.replace(/\.[^/.]+$/,'')}</span>`;
  el.title       = `${clip.file.name} — ${fmt(clip.duration)}`;
  lane.appendChild(el);
}

function updateMTProjectDuration() {
  let maxDur = 10;
  mtState.tracks.forEach(t => {
    t.clips.forEach(c => {
      const end = c.startOffset + c.duration;
      if (end > maxDur) maxDur = end;
    });
  });
  mtState.projectDuration = maxDur * 1.1; // add 10% breathing room
  // Re-render all clips with updated scale
  mtState.tracks.forEach(t => {
    const lane = document.getElementById('mt-lane-' + t.id);
    if (!lane) return;
    lane.innerHTML = '';
    t.clips.forEach(c => renderMTClip(t, c, lane));
  });
}

// MT Preview player
const mtPlayer  = document.getElementById('mt-player');
const mtPlaceholder = document.getElementById('mt-placeholder');
const mtBtnPlay = document.getElementById('mt-btn-play');
const mtTimecode = document.getElementById('mt-timecode');

function loadMTPreview(url) {
  mtPlayer.src = url;
  mtPlayer.style.display = 'block';
  mtPlaceholder.style.display = 'none';
}
mtBtnPlay.addEventListener('click', () => {
  if (mtPlayer.paused) { mtPlayer.play(); mtBtnPlay.textContent = '⏸'; }
  else                 { mtPlayer.pause(); mtBtnPlay.textContent = '▶'; }
});
document.getElementById('mt-btn-start').addEventListener('click', () => { mtPlayer.currentTime = 0; });
document.getElementById('mt-btn-end').addEventListener('click',   () => { if (mtPlayer.duration) mtPlayer.currentTime = mtPlayer.duration; });
mtPlayer.addEventListener('timeupdate', () => {
  if (!mtPlayer.duration) return;
  mtTimecode.textContent = `${fmt(mtPlayer.currentTime)} / ${fmt(mtPlayer.duration)}`;
});
mtPlayer.addEventListener('ended', () => { mtBtnPlay.textContent = '▶'; });

// Add track buttons
document.getElementById('mt-add-video').addEventListener('click', () => addMTTrack('video'));
document.getElementById('mt-add-audio').addEventListener('click', () => addMTTrack('audio'));

// MT Media Library (separate from Clip Trimmer's)
const mtMediaFiles = [];

document.getElementById('btn-add-mt').addEventListener('click', () => {
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = 'video/*'; inp.multiple = true;
  inp.addEventListener('change', () => {
    Array.from(inp.files).forEach(addMTMedia);
  });
  inp.click();
});

function addMTMedia(file) {
  if (!clipURLMap.has(file)) clipURLMap.set(file, URL.createObjectURL(file));
  const idx = mtMediaFiles.length;
  mtMediaFiles.push(file);

  const list = document.getElementById('mt-media-list');
  document.getElementById('mt-empty').style.display = 'none';

  const card = document.createElement('div');
  card.className = 'mt-media-card';
  card.draggable = true;
  card.innerHTML = `
    <span class="mt-card-icon">🎬</span>
    <div>
      <div class="mt-card-name" title="${file.name}">${file.name}</div>
      <div class="mt-card-dur">—</div>
    </div>
  `;
  card.addEventListener('dragstart', e => {
    e.dataTransfer.setData('text/plain', String(idx));
    e.dataTransfer.effectAllowed = 'copy';
  });

  // Get duration
  const tmp = document.createElement('video');
  tmp.src = clipURLMap.get(file);
  tmp.addEventListener('loadedmetadata', () => {
    card.querySelector('.mt-card-dur').textContent = fmt(tmp.duration);
  }, { once: true });

  list.appendChild(card);
}

// ══════════════════════════════════════════════
//  EDITOR DOLL
// ══════════════════════════════════════════════

const dollPanel   = document.getElementById('doll-panel');
const dollEmpty   = document.getElementById('doll-empty');
const dollLoaded  = document.getElementById('doll-loaded');
const dollAnalysis = document.getElementById('doll-analysis');
const dollSugs    = document.getElementById('doll-suggestions');

document.getElementById('btn-doll').addEventListener('click', () => {
  const hidden = dollPanel.classList.toggle('hidden');
  if (!hidden) refreshDoll();
});
document.getElementById('doll-close').addEventListener('click', () => dollPanel.classList.add('hidden'));

function refreshDoll() {
  if (!currentFile || !videoPlayer.duration) {
    dollEmpty.style.display = '';
    dollLoaded.classList.add('hidden');
    return;
  }
  dollEmpty.style.display = 'none';
  dollLoaded.classList.remove('hidden');

  const dur  = videoPlayer.duration;
  const file = currentFile;
  const trimDurSec = (trim.end - trim.start) * dur;

  // Analysis cards
  dollAnalysis.innerHTML = [
    { label: 'Duration',    value: fmt(dur) },
    { label: 'File Size',   value: fmtSize(file.size) },
    { label: 'Format',      value: file.type.split('/')[1]?.toUpperCase() || 'VIDEO' },
    { label: 'Trim Length', value: fmt(trimDurSec) },
  ].map(a => `
    <div class="doll-analysis-card">
      <span class="doll-a-label">${a.label}</span>
      <span class="doll-a-val">${a.value}</span>
    </div>
  `).join('');

  // Generate suggestions
  const suggestions = [];

  if (dur > 120) {
    suggestions.push({
      icon: '✂️', text: `Clip is ${fmt(dur)} — consider splitting at the midpoint for social formats.`,
      apply: () => { const s = { ...trim }; undoStack.push(s); trim.end = 0.5; updateTrimUI(); }
    });
  }
  if (dur > 10) {
    const skipSec = Math.min(dur * 0.04, 2.5);
    suggestions.push({
      icon: '⏭', text: `Skip opening ${fmt(skipSec)} — common for slate frames and leader.`,
      apply: () => { undoStack.push({ ...trim }); trim.start = skipSec / dur; updateTrimUI(); }
    });
  }
  if (dur > 10) {
    const tailSec = Math.min(dur * 0.03, 2);
    suggestions.push({
      icon: '🎬', text: `Trim last ${fmt(tailSec)} — removes common trailing hold frames.`,
      apply: () => { undoStack.push({ ...trim }); trim.end = (dur - tailSec) / dur; updateTrimUI(); }
    });
  }
  if (file.size > 200 * 1024 * 1024) {
    suggestions.push({
      icon: '📦', text: `Large file (${fmtSize(file.size)}) — export uses -c copy for speed, no re-encode.`,
      apply: null
    });
  }
  if (dur < 6) {
    suggestions.push({
      icon: '✅', text: `Short clip (${fmt(dur)}) — trim range looks good for social or intro use.`,
      apply: null
    });
  }
  if ((trim.end - trim.start) > 0.9 && dur > 30) {
    suggestions.push({
      icon: '💡', text: `Trim handles not set yet — drag them on the timeline to define your cut.`,
      apply: null
    });
  }

  dollSugs.innerHTML = suggestions.map((s, i) => `
    <div class="doll-suggestion" data-idx="${i}">
      <span class="doll-sug-icon">${s.icon}</span>
      <span class="doll-sug-text">${s.text}</span>
      ${s.apply ? `<button class="doll-sug-apply" data-idx="${i}">Apply</button>` : ''}
    </div>
  `).join('');

  // Wire apply buttons
  dollSugs.querySelectorAll('.doll-sug-apply').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx, 10);
      if (suggestions[idx]?.apply) {
        suggestions[idx].apply();
        refreshDoll();
      }
    });
  });

  // Best cut button
  document.getElementById('btn-auto-edit').onclick = () => {
    const actable = suggestions.filter(s => s.apply);
    if (actable.length) {
      undoStack.push({ ...trim });
      actable.forEach(s => s.apply());
      refreshDoll();
    }
  };
}

// ══════════════════════════════════════════════
//  WHITE-LABEL SETTINGS
// ══════════════════════════════════════════════

const WL_KEY = 'eof-video-studio-wl';

const WL_DEFAULTS = {
  appName:   'Video Studio',
  tagline:   'by EOF Film Studio',
  accent:    '#EF4444',
  edition:   'eof',
  workspace: '',
  aiModel:   'claude',
  apiKey:    '',
};

function loadWLSettings() {
  try { return { ...WL_DEFAULTS, ...JSON.parse(localStorage.getItem(WL_KEY) || '{}') }; }
  catch { return { ...WL_DEFAULTS }; }
}

function applyWLSettings(wl) {
  // Update CSS accent variable
  document.documentElement.style.setProperty('--accent', wl.accent);
  document.documentElement.style.setProperty('--accent-soft', hexToRGBA(wl.accent, 0.12));
  document.documentElement.style.setProperty('--accent-border', hexToRGBA(wl.accent, 0.28));

  // Update nav branding
  document.getElementById('app-name').textContent    = wl.appName;
  document.getElementById('app-tagline').textContent = wl.tagline;
}

function populateSettingsFields(wl) {
  document.getElementById('wl-app-name').value  = wl.appName;
  document.getElementById('wl-tagline').value   = wl.tagline;
  document.getElementById('wl-accent').value    = wl.accent;
  document.getElementById('wl-accent-hex').textContent = wl.accent;
  document.getElementById('wl-edition').value   = wl.edition;
  document.getElementById('wl-workspace').value = wl.workspace;
  document.getElementById('wl-ai-model').value  = wl.aiModel;
  document.getElementById('sprev-name').textContent = wl.appName;
  document.getElementById('sprev-tag').textContent  = wl.tagline;
  updatePreviewAccent(wl.accent);
}

function updatePreviewAccent(hex) {
  const icon = document.getElementById('sprev-icon');
  if (icon) icon.style.background = `linear-gradient(135deg, ${hex}, #000)`;
  icon.style.boxShadow = `0 0 12px ${hexToRGBA(hex, 0.4)}`;
}

// Live preview wiring
document.getElementById('wl-app-name').addEventListener('input', e => {
  document.getElementById('sprev-name').textContent = e.target.value || 'Video Studio';
});
document.getElementById('wl-tagline').addEventListener('input', e => {
  document.getElementById('sprev-tag').textContent = e.target.value || 'by EOF Film Studio';
});
document.getElementById('wl-accent').addEventListener('input', e => {
  document.getElementById('wl-accent-hex').textContent = e.target.value;
  updatePreviewAccent(e.target.value);
});

document.getElementById('btn-settings-save').addEventListener('click', () => {
  const wl = {
    appName:   document.getElementById('wl-app-name').value || WL_DEFAULTS.appName,
    tagline:   document.getElementById('wl-tagline').value  || WL_DEFAULTS.tagline,
    accent:    document.getElementById('wl-accent').value,
    edition:   document.getElementById('wl-edition').value,
    workspace: document.getElementById('wl-workspace').value,
    aiModel:   document.getElementById('wl-ai-model').value,
    apiKey:    document.getElementById('wl-api-key').value,
  };
  localStorage.setItem(WL_KEY, JSON.stringify(wl));
  applyWLSettings(wl);
  const btn = document.getElementById('btn-settings-save');
  btn.textContent = '✅ Applied!';
  setTimeout(() => { btn.textContent = '✅ Save & Apply'; }, 2000);
});

document.getElementById('btn-settings-reset').addEventListener('click', () => {
  localStorage.removeItem(WL_KEY);
  populateSettingsFields(WL_DEFAULTS);
  applyWLSettings(WL_DEFAULTS);
});

// ── On load: apply saved settings ──
const savedWL = loadWLSettings();
applyWLSettings(savedWL);
populateSettingsFields(savedWL);

// ══════════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════════

function fmt(sec) {
  if (!sec || isNaN(sec)) return '0:00';
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  return `${m}:${String(s).padStart(2,'0')}`;
}

function fmtSize(bytes) {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function hexToRGBA(hex, alpha) {
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
