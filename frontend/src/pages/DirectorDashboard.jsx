import { useState } from 'react';

const PHASES = [
  { id: 'dev',       label: 'Development',    icon: '💡', color: '#8b5cf6' },
  { id: 'pre',       label: 'Pre-Production', icon: '📋', color: '#f59e0b' },
  { id: 'principal', label: 'Production',     icon: '🎬', color: '#EF4444' },
  { id: 'post',      label: 'Post-Production',icon: '✂️', color: '#10b981' },
  { id: 'delivery',  label: 'Delivery',       icon: '🚀', color: '#3b82f6' },
];

const SAMPLE_TASKS = [
  { id: 1, phase: 'pre',       label: 'Finalize shooting schedule',   done: true },
  { id: 2, phase: 'pre',       label: 'Lock character designs',        done: true },
  { id: 3, phase: 'principal', label: 'Record principal photography',  done: false },
  { id: 4, phase: 'principal', label: 'Capture B-roll footage',        done: false },
  { id: 5, phase: 'post',      label: 'Rough cut assembly',            done: false },
  { id: 6, phase: 'post',      label: 'Color grade + audio mix',       done: false },
  { id: 7, phase: 'delivery',  label: 'Export final master',           done: false },
  { id: 8, phase: 'delivery',  label: 'Publish to platforms',          done: false },
];

export default function DirectorDashboard() {
  const [tasks, setTasks] = useState(SAMPLE_TASKS);
  const [activePhase, setActivePhase] = useState('principal');

  function toggleTask(id) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }

  const done  = tasks.filter(t => t.done).length;
  const total = tasks.length;
  const pct   = Math.round((done / total) * 100);

  const currentPhase = PHASES.find(p => p.id === activePhase);
  const phaseTasks   = tasks.filter(t => t.phase === activePhase);

  return (
    <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24, height: '100%', overflowY: 'auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 10 }}>
            🎬 Director Dashboard
          </h1>
          <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: 4 }}>
            Production overview · Afrofuture Rising
          </p>
        </div>
        <a
          href="http://localhost:5200"
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 16px', borderRadius: 10, fontSize: '0.78rem', fontWeight: 700,
            background: '#EF4444', color: '#fff', textDecoration: 'none',
            boxShadow: '0 0 14px rgba(239,68,68,0.4)',
          }}
        >
          ✂️ Open Video Studio
        </a>
      </div>

      {/* Overall progress */}
      <div style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '18px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#aaa' }}>OVERALL PROGRESS</span>
          <span style={{ fontSize: '1rem', fontWeight: 700, color: '#EF4444' }}>{pct}%</span>
        </div>
        <div style={{ height: 8, background: '#1a1a28', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: pct + '%', background: 'linear-gradient(90deg, #EF4444, #f97316)', borderRadius: 99, transition: 'width 0.3s ease' }} />
        </div>
        <p style={{ fontSize: '0.68rem', color: '#6b7280', marginTop: 8 }}>{done} of {total} tasks complete</p>
      </div>

      {/* Phase pipeline */}
      <div style={{ display: 'flex', gap: 8 }}>
        {PHASES.map(phase => (
          <button
            key={phase.id}
            onClick={() => setActivePhase(phase.id)}
            style={{
              flex: 1, padding: '10px 8px', borderRadius: 10,
              fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer',
              border: `1px solid ${activePhase === phase.id ? phase.color : 'rgba(255,255,255,0.07)'}`,
              background: activePhase === phase.id ? `${phase.color}18` : '#111118',
              color: activePhase === phase.id ? phase.color : '#6b7280',
              transition: 'all 0.15s', textAlign: 'center', display: 'flex',
              flexDirection: 'column', alignItems: 'center', gap: 4,
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>{phase.icon}</span>
            <span>{phase.label}</span>
          </button>
        ))}
      </div>

      {/* Phase tasks */}
      <div style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '18px 20px', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: '1.1rem' }}>{currentPhase.icon}</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{currentPhase.label}</span>
          <span style={{
            marginLeft: 'auto', fontSize: '0.6rem', fontWeight: 700,
            padding: '2px 8px', borderRadius: 20,
            background: `${currentPhase.color}18`, color: currentPhase.color,
            border: `1px solid ${currentPhase.color}40`,
          }}>
            {phaseTasks.filter(t => t.done).length}/{phaseTasks.length} done
          </span>
        </div>
        {phaseTasks.length === 0 ? (
          <p style={{ fontSize: '0.78rem', color: '#6b7280', textAlign: 'center', padding: '20px 0' }}>No tasks for this phase yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {phaseTasks.map(task => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px', borderRadius: 9, cursor: 'pointer',
                  background: task.done ? 'rgba(16,185,129,0.06)' : '#18181f',
                  border: `1px solid ${task.done ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)'}`,
                  transition: 'all 0.12s',
                }}
              >
                <div style={{
                  width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                  border: `2px solid ${task.done ? '#10b981' : 'rgba(255,255,255,0.2)'}`,
                  background: task.done ? '#10b981' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.65rem', color: '#fff',
                }}>
                  {task.done && '✓'}
                </div>
                <span style={{
                  fontSize: '0.78rem', color: task.done ? '#6b7280' : '#ccc',
                  textDecoration: task.done ? 'line-through' : 'none',
                }}>
                  {task.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
