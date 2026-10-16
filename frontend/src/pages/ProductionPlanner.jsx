import { useState } from 'react';

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

const SAMPLE_SCHEDULE = [
  { id: 1, day: 'Mon', time: '08:00', scene: 'Scene 1 — Market Arrival',  location: 'Afrofuturist Market',  crew: 8, status: 'confirmed' },
  { id: 2, day: 'Mon', time: '14:00', scene: 'Scene 2 — The Encounter',   location: 'Vendor Stall',         crew: 4, status: 'confirmed' },
  { id: 3, day: 'Tue', time: '09:00', scene: 'Scene 4 — The Chase',       location: 'Market Alley',         crew: 12, status: 'tentative' },
  { id: 4, day: 'Wed', time: '10:00', scene: 'Scene 6 — Rooftop Reveal',  location: 'City Rooftop',         crew: 6, status: 'confirmed' },
  { id: 5, day: 'Thu', time: '08:00', scene: 'Scene 8 — The Ceremony',    location: 'Sacred Chamber',       crew: 15, status: 'tentative' },
  { id: 6, day: 'Fri', time: '13:00', scene: 'B-Roll — City Establishing', location: 'Various Locations',   crew: 3, status: 'confirmed' },
];

const STATUS_STYLE = {
  confirmed: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', text: '#34d399' },
  tentative: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', text: '#fbbf24' },
  cancelled: { bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.3)',  text: '#f87171' },
};

export default function ProductionPlanner() {
  const [schedule] = useState(SAMPLE_SCHEDULE);
  const [activeDay, setActiveDay] = useState('Mon');

  const dayItems = schedule.filter(s => s.day === activeDay);

  return (
    <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24, height: '100%', overflowY: 'auto' }}>

      <div>
        <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 10 }}>
          📋 Production Planner
        </h1>
        <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: 4 }}>
          Shooting schedule · Week of July 7, 2026
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Total Shoot Days', value: '5' },
          { label: 'Scenes Scheduled', value: String(schedule.length) },
          { label: 'Confirmed Setups', value: String(schedule.filter(s => s.status === 'confirmed').length) },
          { label: 'Crew Required',    value: String(Math.max(...schedule.map(s => s.crew))) + ' max' },
        ].map(stat => (
          <div key={stat.label} style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#EF4444' }}>{stat.value}</div>
            <div style={{ fontSize: '0.65rem', color: '#6b7280', marginTop: 3 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Day tabs */}
      <div style={{ display: 'flex', gap: 6 }}>
        {DAYS.map(day => {
          const hasItems = schedule.some(s => s.day === day);
          const isActive = activeDay === day;
          return (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              style={{
                flex: 1, padding: '8px 4px', borderRadius: 9,
                fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer',
                border: `1px solid ${isActive ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.07)'}`,
                background: isActive ? 'rgba(239,68,68,0.1)' : '#111118',
                color: isActive ? '#EF4444' : hasItems ? '#ccc' : '#374151',
                transition: 'all 0.12s',
              }}
            >
              {day}
              {hasItems && <div style={{ width: 4, height: 4, borderRadius: '50%', background: isActive ? '#EF4444' : '#4b5563', margin: '4px auto 0' }} />}
            </button>
          );
        })}
      </div>

      {/* Schedule items */}
      <div style={{ flex: 1 }}>
        {dayItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#374151', fontSize: '0.78rem' }}>
            No shoots scheduled for {activeDay}.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {dayItems.map(item => {
              const s = STATUS_STYLE[item.status];
              return (
                <div
                  key={item.id}
                  style={{
                    background: '#111118', border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 12, padding: '16px 18px',
                    display: 'flex', alignItems: 'center', gap: 16,
                  }}
                >
                  <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#EF4444' }}>{item.time}</div>
                    <div style={{ fontSize: '0.58rem', color: '#6b7280' }}>{item.day}</div>
                  </div>
                  <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.07)', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff', marginBottom: 4 }}>{item.scene}</div>
                    <div style={{ fontSize: '0.68rem', color: '#6b7280' }}>📍 {item.location} · 👥 {item.crew} crew</div>
                  </div>
                  <span style={{ fontSize: '0.6rem', fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: s.bg, color: s.text, border: `1px solid ${s.border}`, flexShrink: 0 }}>
                    {item.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Link to Video Studio */}
      <div style={{ padding: '14px 18px', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#ccc' }}>Ready to edit captured footage?</p>
          <p style={{ fontSize: '0.68rem', color: '#6b7280', marginTop: 2 }}>Open EOF Video Studio to assemble scenes and export.</p>
        </div>
        <a href="http://localhost:5200" target="_blank" rel="noreferrer" style={{ padding: '8px 18px', borderRadius: 9, fontSize: '0.75rem', fontWeight: 700, background: '#EF4444', color: '#fff', textDecoration: 'none', flexShrink: 0, boxShadow: '0 0 12px rgba(239,68,68,0.35)' }}>
          ✂️ Video Studio
        </a>
      </div>
    </div>
  );
}
