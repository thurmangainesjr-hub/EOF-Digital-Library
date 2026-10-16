/**
 * EOF Task Router — Global AI task dispatcher
 * Cmd+K to open from anywhere. Routes tasks to the correct agent/division.
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiZap, FiArrowRight, FiClock, FiX, FiLoader, FiCheckCircle } from 'react-icons/fi';
import { detectRoute, QUICK_TASKS, logTask, getTaskHistory } from '../data/taskRouterData';

const PHASES = ['idle', 'routing', 'responding', 'done'];

function MarkdownLine({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**')
          ? <strong key={i} style={{ color: '#fff', fontWeight: 700 }}>{p.slice(2, -2)}</strong>
          : <span key={i}>{p}</span>
      )}
    </span>
  );
}

function ResponseDisplay({ text, color }) {
  const lines = text.split('\n');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} style={{ height: 6 }}/>;
        const isHeader = line.startsWith('📖') || line.startsWith('🧠') || line.startsWith('✅') ||
          line.startsWith('📚') || line.startsWith('🎵') || line.startsWith('🎬') ||
          line.startsWith('📣') || line.startsWith('⚙️') || line.startsWith('📋') ||
          line.startsWith('📊') || line.startsWith('🛡️') || line.startsWith('🔍') ||
          line.startsWith('🏆') || line.startsWith('⭐') || line.startsWith('⚠️') ||
          line.startsWith('🔑') || line.startsWith('👤') || line.startsWith('🔒') ||
          line.startsWith('🎚️') || line.startsWith('🎞️') || line.startsWith('🎛️') ||
          line.startsWith('🤖');
        const isArrow = line.trim().startsWith('→');
        const isBullet = line.trim().startsWith('•');
        const isNum = /^\d+\./.test(line.trim());
        return (
          <div key={i} style={{
            fontSize: isHeader ? 12 : 11,
            color: isHeader ? '#fff' : isArrow || isBullet || isNum ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.55)',
            paddingLeft: isArrow || isBullet || isNum ? 10 : 0,
            fontWeight: isHeader ? 600 : 400,
            lineHeight: 1.6,
            borderLeft: isHeader ? `2px solid ${color}60` : 'none',
            paddingTop: isHeader ? 4 : 0,
            paddingBottom: isHeader ? 2 : 0,
          }}>
            <MarkdownLine text={line}/>
          </div>
        );
      })}
    </div>
  );
}

export default function EOFTaskRouter({ onClose }) {
  const navigate = useNavigate();
  const inputRef  = useRef(null);
  const [query,   setQuery]   = useState('');
  const [phase,   setPhase]   = useState('idle');
  const [route,   setRoute]   = useState(null);
  const [display, setDisplay] = useState('');
  const [history, setHistory] = useState(() => getTaskHistory());
  const timerRef = useRef(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 60);
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); clearTimeout(timerRef.current); };
  }, [onClose]);

  const runTask = useCallback((q) => {
    if (!q.trim() || phase !== 'idle') return;
    const detected = detectRoute(q);
    setRoute(detected);
    setPhase('routing');
    setDisplay('');

    timerRef.current = setTimeout(() => {
      setPhase('responding');
      const full = detected.demoResponse(q);
      let i = 0;
      function tick() {
        i += 3;
        setDisplay(full.slice(0, i));
        if (i < full.length) timerRef.current = setTimeout(tick, 12);
        else {
          setPhase('done');
          logTask({ query: q, division: detected.division, agent: detected.agent, color: detected.color });
          setHistory(getTaskHistory());
        }
      }
      tick();
    }, 900);
  }, [phase]);

  function handleSubmit(e) {
    e.preventDefault();
    runTask(query);
  }

  function reset() {
    clearTimeout(timerRef.current);
    setQuery('');
    setPhase('idle');
    setRoute(null);
    setDisplay('');
    setTimeout(() => inputRef.current?.focus(), 60);
  }

  const color = route?.color || '#D4AF37';

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        paddingTop: '10vh',
      }}
    >
      <div style={{
        width: '100%', maxWidth: 660, borderRadius: 18,
        background: '#0D0D14',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: `0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px ${color}22`,
        overflow: 'hidden',
        transition: 'box-shadow 0.3s',
      }}>

        {/* Input bar */}
        <form onSubmit={handleSubmit}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '14px 16px',
            borderBottom: `1px solid ${phase === 'idle' ? 'rgba(255,255,255,0.07)' : color + '30'}`,
            transition: 'border-color 0.3s',
          }}>
            {phase === 'routing' ? (
              <FiLoader size={18} style={{ color, animation: 'spin 1s linear infinite', flexShrink: 0 }}/>
            ) : phase === 'done' ? (
              <FiCheckCircle size={18} style={{ color, flexShrink: 0 }}/>
            ) : (
              <FiZap size={18} style={{ color: '#D4AF37', flexShrink: 0 }}/>
            )}
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Ask anything — write a story, build software, create a course…"
              disabled={phase !== 'idle'}
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                color: 'white', fontSize: 15, fontFamily: 'system-ui, sans-serif',
                opacity: phase !== 'idle' ? 0.6 : 1,
              }}
            />
            {phase === 'idle' && query && (
              <button type="submit" style={{
                padding: '5px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                background: color, color: '#000', border: 'none', cursor: 'pointer', flexShrink: 0,
              }}>
                Run ↵
              </button>
            )}
            {phase !== 'idle' && (
              <button type="button" onClick={reset} style={{
                width: 28, height: 28, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', flexShrink: 0,
              }}>
                <FiX size={14}/>
              </button>
            )}
            <button type="button" onClick={onClose} style={{
              width: 28, height: 28, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 10, flexShrink: 0,
            }}>
              esc
            </button>
          </div>
        </form>

        {/* Routing phase */}
        {phase === 'routing' && route && (
          <div style={{ padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                background: route.color + '18', border: `1px solid ${route.color}35`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
              }}>
                {route.avatar}
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>Routing to</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>{route.division}</div>
                <div style={{ fontSize: 11, color: route.color, marginTop: 1 }}>Agent: {route.agent}</div>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                {route.tags?.map(t => (
                  <span key={t} style={{
                    fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 999,
                    background: route.color + '15', border: `1px solid ${route.color}30`, color: route.color,
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}>{t}</span>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 14, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{
                height: '100%', background: `linear-gradient(90deg, ${route.color}, ${route.color}80)`,
                borderRadius: 3, animation: 'progress 0.9s ease-in-out forwards',
              }}/>
            </div>
          </div>
        )}

        {/* Response */}
        {(phase === 'responding' || phase === 'done') && route && (
          <div style={{ maxHeight: 340, overflowY: 'auto' }}>
            {/* Agent header */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              background: route.color + '06',
            }}>
              <span style={{ fontSize: 18 }}>{route.avatar}</span>
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, color: route.color }}>{route.agent}</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginLeft: 8 }}>{route.division}</span>
              </div>
              {phase === 'done' && (
                <span style={{
                  marginLeft: 'auto', fontSize: 9, fontWeight: 700, color: '#10B981',
                  background: '#10B98115', border: '1px solid #10B98130', padding: '2px 8px', borderRadius: 999,
                }}>COMPLETE</span>
              )}
            </div>
            {/* Response text */}
            <div style={{ padding: '16px 20px' }}>
              <ResponseDisplay text={display} color={route.color}/>
              {phase === 'responding' && (
                <span style={{ display: 'inline-block', width: 2, height: 14, background: route.color, marginLeft: 2, animation: 'blink 0.7s infinite', verticalAlign: 'middle' }}/>
              )}
            </div>
          </div>
        )}

        {/* Done footer — open app */}
        {phase === 'done' && route && (
          <div style={{
            padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <button
              onClick={() => { onClose(); navigate(route.app); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px',
                borderRadius: 10, background: route.color, border: 'none',
                color: '#000', fontSize: 12, fontWeight: 700, cursor: 'pointer',
              }}>
              Open {route.appLabel} <FiArrowRight size={12}/>
            </button>
            <button onClick={reset} style={{
              padding: '9px 16px', borderRadius: 10,
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.6)', fontSize: 12, cursor: 'pointer',
            }}>
              New Task
            </button>
            <span style={{ marginLeft: 'auto', fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>Task logged ✓</span>
          </div>
        )}

        {/* Idle state — quick tasks */}
        {phase === 'idle' && (
          <div style={{ padding: '14px 16px' }}>
            {/* Quick actions */}
            <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', marginBottom: 10, textTransform: 'uppercase' }}>
              Quick Tasks
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: history.length ? 16 : 0 }}>
              {QUICK_TASKS.map(qt => (
                <button key={qt.label} onClick={() => { setQuery(qt.query); runTask(qt.query); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '5px 11px', borderRadius: 8, fontSize: 11,
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.55)', cursor: 'pointer', transition: 'all 0.12s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; }}>
                  <span>{qt.icon}</span> {qt.label}
                </button>
              ))}
            </div>

            {/* Recent tasks */}
            {history.length > 0 && (
              <>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', marginBottom: 8, textTransform: 'uppercase' }}>
                  Recent
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {history.slice(0, 4).map((h, i) => (
                    <button key={i} onClick={() => { setQuery(h.query); runTask(h.query); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10, padding: '7px 10px',
                        borderRadius: 8, background: 'transparent', border: '1px solid transparent',
                        color: 'rgba(255,255,255,0.4)', cursor: 'pointer', textAlign: 'left', fontSize: 12,
                        transition: 'all 0.1s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}>
                      <FiClock size={11} style={{ flexShrink: 0 }}/>
                      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.query}</span>
                      <span style={{ fontSize: 9, flexShrink: 0, color: h.color }}>{h.division}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>⌘K to open · Esc to close</span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>↵ to run</span>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes progress { from{width:0%} to{width:100%} }
      `}</style>
    </div>
  );
}
