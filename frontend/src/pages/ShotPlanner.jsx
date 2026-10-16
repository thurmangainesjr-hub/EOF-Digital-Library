import { useState } from 'react';

const SHOT_TYPES  = ['Wide','Medium','Close-Up','Extreme Close-Up','POV','Over-the-Shoulder','Aerial'];
const CAMERA_MOVES = ['Static','Pan','Tilt','Dolly','Handheld','Crane','Rack Focus'];

const SAMPLE_SCENES = [
  {
    id: 1, title: 'Scene 1 — Market Arrival', location: 'Afrofuturist Market', status: 'planned',
    shots: [
      { id: 's1', type: 'Wide', move: 'Crane', desc: 'Establish the sprawling market from above', done: false },
      { id: 's2', type: 'Medium', move: 'Dolly', desc: 'Follow protagonist through the crowd', done: false },
      { id: 's3', type: 'Close-Up', move: 'Static', desc: 'Reaction shot — eyes widen at the display', done: true },
    ],
  },
  {
    id: 2, title: 'Scene 2 — The Encounter', location: 'Vendor Stall', status: 'in-progress',
    shots: [
      { id: 's4', type: 'Over-the-Shoulder', move: 'Static', desc: 'Dialogue — protagonist meets the vendor', done: true },
      { id: 's5', type: 'Close-Up', move: 'Rack Focus', desc: 'The artifact revealed on the table', done: false },
    ],
  },
];

const STATUS_COLORS = {
  planned:     { bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.3)', text: '#a78bfa' },
  'in-progress': { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', text: '#f87171' },
  complete:    { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', text: '#34d399' },
};

export default function ShotPlanner() {
  const [scenes, setScenes] = useState(SAMPLE_SCENES);
  const [selected, setSelected] = useState(1);

  function toggleShot(sceneId, shotId) {
    setScenes(prev => prev.map(sc =>
      sc.id === sceneId
        ? { ...sc, shots: sc.shots.map(sh => sh.id === shotId ? { ...sh, done: !sh.done } : sh) }
        : sc
    ));
  }

  const scene = scenes.find(s => s.id === selected);

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>

      {/* Scene list */}
      <div style={{ width: 220, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', background: '#0a0a0a', overflowY: 'auto', padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <p style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.12em', color: '#374151', padding: '0 6px 8px' }}>SCENES</p>
        {scenes.map(sc => {
          const c = STATUS_COLORS[sc.status] || STATUS_COLORS.planned;
          const isActive = sc.id === selected;
          return (
            <button
              key={sc.id}
              onClick={() => setSelected(sc.id)}
              style={{
                textAlign: 'left', padding: '10px 12px', borderRadius: 10,
                border: `1px solid ${isActive ? 'rgba(239,68,68,0.35)' : 'rgba(255,255,255,0.06)'}`,
                background: isActive ? 'rgba(239,68,68,0.08)' : '#111118',
                cursor: 'pointer', transition: 'all 0.12s',
              }}
            >
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: isActive ? '#fff' : '#ccc', marginBottom: 4 }}>{sc.title}</div>
              <div style={{ fontSize: '0.6rem', color: '#6b7280' }}>{sc.location}</div>
              <div style={{ marginTop: 6 }}>
                <span style={{ fontSize: '0.55rem', fontWeight: 700, padding: '2px 7px', borderRadius: 20, background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
                  {sc.status}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Shot detail */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
        {scene ? (
          <>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{scene.title}</h2>
              <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: 4 }}>📍 {scene.location}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {scene.shots.map(shot => (
                <div
                  key={shot.id}
                  style={{
                    background: '#111118', border: `1px solid ${shot.done ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)'}`,
                    borderRadius: 12, padding: '14px 16px',
                    display: 'flex', alignItems: 'flex-start', gap: 14,
                  }}
                >
                  <div
                    onClick={() => toggleShot(scene.id, shot.id)}
                    style={{
                      width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
                      border: `2px solid ${shot.done ? '#10b981' : 'rgba(255,255,255,0.2)'}`,
                      background: shot.done ? '#10b981' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', fontSize: '0.65rem', color: '#fff',
                    }}
                  >
                    {shot.done && '✓'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                      <span style={{ fontSize: '0.62rem', fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                        {shot.type}
                      </span>
                      <span style={{ fontSize: '0.62rem', fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.04)', color: '#9ca3af', border: '1px solid rgba(255,255,255,0.07)' }}>
                        {shot.move}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: shot.done ? '#6b7280' : '#ccc', textDecoration: shot.done ? 'line-through' : 'none' }}>
                      {shot.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 16, padding: '12px 14px', background: 'rgba(239,68,68,0.05)', border: '1px dashed rgba(239,68,68,0.2)', borderRadius: 10, textAlign: 'center' }}>
              <p style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                When footage is captured, open <strong style={{ color: '#EF4444' }}>EOF Video Studio</strong> to edit and assemble this scene.
              </p>
              <a href="http://localhost:5200" target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: 8, fontSize: '0.7rem', fontWeight: 700, color: '#EF4444', textDecoration: 'none' }}>
                → Open Video Studio ✂️
              </a>
            </div>
          </>
        ) : (
          <p style={{ color: '#6b7280' }}>Select a scene.</p>
        )}
      </div>
    </div>
  );
}
