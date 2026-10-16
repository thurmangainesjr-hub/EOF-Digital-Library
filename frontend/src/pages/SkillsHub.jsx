/**
 * EOF Skills Hub — Universal Skills Framework
 * Additive layer: browse, search, and activate skills across the entire ecosystem.
 * No existing functionality is modified.
 */
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiZap, FiGrid, FiList, FiExternalLink, FiChevronRight } from 'react-icons/fi';
import { SKILLS, IMAGE_AGENTS, IMAGE_INTELLIGENCE, MASTER_SKILL, APP_META } from '../data/skillsData';

const GOLD = '#D4AF37';

/* ── Filter tabs ─────────────────────────────────────────────────────────── */
const FILTER_ALL = 'all';
const FILTER_IMAGE = 'image';
const APP_FILTERS = [
  { id: FILTER_ALL,    label: 'All Skills',       emoji: '⚡' },
  { id: 'griot',       label: 'Griot AI',         emoji: '🎭' },
  { id: 'university',  label: 'DIY University',   emoji: '🎓' },
  { id: 'library',     label: 'EOF Library',      emoji: '📚' },
  { id: 'film-studio', label: 'Film Studio',      emoji: '🎬' },
  { id: 'music-studio',label: 'Music Studio',     emoji: '🎵' },
  { id: 'fhhl',        label: 'FHHL',             emoji: '🏆' },
  { id: 'orion-media', label: 'Orion Media',      emoji: '📡' },
  { id: 'orion-talent',label: 'Orion Talent',     emoji: '🌟' },
  { id: 'legacy-vault',label: 'Legacy Vault',     emoji: '🏛️' },
  { id: FILTER_IMAGE,  label: 'Image Intelligence',emoji: '🎨' },
];

/* ── Skill card ──────────────────────────────────────────────────────────── */
function SkillCard({ skill }) {
  const [hovered, setHovered] = useState(false);
  const meta = APP_META[skill.app] || {};
  const color = meta.color || '#D4AF37';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:   hovered ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
        border:       `1px solid ${hovered ? color + '50' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 14,
        padding:      '18px 20px',
        transition:   'all 0.18s ease',
        cursor:       'default',
        position:     'relative',
        overflow:     'hidden',
      }}
    >
      {/* Accent bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${color}, transparent)`,
        opacity: hovered ? 1 : 0.4,
        transition: 'opacity 0.18s',
      }}/>

      {/* App badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{
          fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
          color, background: color + '18', border: `1px solid ${color}35`,
          padding: '2px 8px', borderRadius: 5,
        }}>
          {meta.emoji} {meta.label}
        </span>
        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {skill.category}
        </span>
      </div>

      {/* Icon + name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <span style={{ fontSize: 24 }}>{skill.icon}</span>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'white', lineHeight: 1.2 }}>{skill.name}</div>
          <div style={{ fontSize: 10, color: color, marginTop: 2, opacity: 0.8 }}>Skill</div>
        </div>
      </div>

      {/* Purpose */}
      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.55, marginBottom: 12 }}>
        {skill.purpose}
      </p>

      {/* Outputs */}
      {skill.outputs && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Outputs</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {skill.outputs.map(o => (
              <span key={o} style={{
                fontSize: 10, color: 'rgba(255,255,255,0.5)',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                padding: '2px 7px', borderRadius: 4,
              }}>{o}</span>
            ))}
          </div>
        </div>
      )}

      {/* References */}
      {skill.references?.length > 0 && (
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>
          References: {skill.references.join(' · ')}
        </div>
      )}

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 10 }}>
        {skill.tags?.map(tag => (
          <span key={tag} style={{
            fontSize: 9, color: color + 'aa',
            background: color + '10', padding: '1px 6px', borderRadius: 3,
          }}>#{tag}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Image agent card ────────────────────────────────────────────────────── */
function AgentCard({ agent }) {
  const [hovered, setHovered] = useState(false);
  const color = '#0D9488';
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:   hovered ? 'rgba(13,148,136,0.06)' : 'rgba(255,255,255,0.02)',
        border:       `1px solid ${hovered ? color + '55' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: 12, padding: '14px 16px',
        transition:   'all 0.15s ease',
      }}
    >
      <div style={{ fontSize: 28, marginBottom: 8 }}>{agent.icon}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'white', marginBottom: 4 }}>{agent.name}</div>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>{agent.specialty}</div>
    </div>
  );
}

/* ── Section header ──────────────────────────────────────────────────────── */
function SectionHeader({ emoji, title, count, color = GOLD }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
      <span style={{ fontSize: 18 }}>{emoji}</span>
      <div>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'white' }}>{title}</div>
      </div>
      {count !== undefined && (
        <span style={{
          fontSize: 10, fontWeight: 600,
          color, background: color + '18', border: `1px solid ${color}35`,
          padding: '2px 9px', borderRadius: 20, marginLeft: 'auto',
        }}>{count} skills</span>
      )}
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────────────────────── */
export default function SkillsHub() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState(FILTER_ALL);
  const [search, setSearch]             = useState('');
  const [viewMode, setViewMode]         = useState('grid');

  /* Filtered + searched skills */
  const filtered = useMemo(() => {
    let list = activeFilter === FILTER_ALL || activeFilter === FILTER_IMAGE
      ? SKILLS
      : SKILLS.filter(s => s.app === activeFilter);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.purpose.toLowerCase().includes(q) ||
        s.tags?.some(t => t.includes(q)) ||
        s.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeFilter, search]);

  /* Group skills by app for "All" view */
  const grouped = useMemo(() => {
    if (activeFilter !== FILTER_ALL || search.trim()) return null;
    const groups = {};
    SKILLS.forEach(s => {
      if (!groups[s.app]) groups[s.app] = [];
      groups[s.app].push(s);
    });
    return groups;
  }, [activeFilter, search]);

  const showImage = activeFilter === FILTER_ALL || activeFilter === FILTER_IMAGE;
  const showSkills = activeFilter !== FILTER_IMAGE;

  return (
    <div style={{
      flex: 1, overflowY: 'auto', background: '#0d0d0d',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      {/* ── Header ── */}
      <div style={{
        background: 'linear-gradient(180deg,rgba(212,175,55,0.06) 0%,transparent 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '32px 32px 24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg,#F0CC5A,#A8892A)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
              }}>⚡</div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: 'white', margin: 0 }}>EOF Skills Hub</h1>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: 0, maxWidth: 520 }}>
              Reusable AI skills that enhance every application in the EOF ecosystem.
              Skills activate on demand — they never replace existing features.
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 20, flexShrink: 0 }}>
            {[
              { label: 'Skills', value: SKILLS.length },
              { label: 'Image Agents', value: IMAGE_AGENTS.length },
              { label: 'Apps', value: Object.keys(APP_META).length - 2 },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: GOLD }}>{s.value}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Search + View toggle */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 400 }}>
            <FiSearch size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }}/>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search skills, categories, tags…"
              style={{
                width: '100%', background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9,
                padding: '9px 12px 9px 34px', fontSize: 13, color: 'white',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: 3, gap: 2 }}>
            {[['grid', FiGrid], ['list', FiList]].map(([mode, Icon]) => (
              <button key={mode} onClick={() => setViewMode(mode)} style={{
                padding: '5px 8px', borderRadius: 6, border: 'none', cursor: 'pointer',
                background: viewMode === mode ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: viewMode === mode ? 'white' : 'rgba(255,255,255,0.35)',
                transition: 'all 0.15s',
              }}>
                <Icon size={14}/>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Filter tabs ── */}
      <div style={{
        display: 'flex', gap: 6, overflowX: 'auto', padding: '16px 32px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        scrollbarWidth: 'none',
      }}>
        {APP_FILTERS.map(f => {
          const active = activeFilter === f.id;
          const meta   = APP_META[f.id];
          const color  = meta?.color || GOLD;
          return (
            <button key={f.id} onClick={() => setActiveFilter(f.id)}
              style={{
                flexShrink: 0, padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500,
                cursor: 'pointer', transition: 'all 0.15s',
                background: active ? color + '22' : 'rgba(255,255,255,0.04)',
                border:     `1px solid ${active ? color + '55' : 'rgba(255,255,255,0.08)'}`,
                color:      active ? color : 'rgba(255,255,255,0.45)',
              }}>
              {f.emoji} {f.label}
            </button>
          );
        })}
      </div>

      <div style={{ padding: '28px 32px', maxWidth: 1400 }}>

        {/* ── Master Orchestration Skill (always visible when not in image-only mode) ── */}
        {(activeFilter === FILTER_ALL || activeFilter === 'central') && !search && (
          <div style={{
            background: 'linear-gradient(135deg,rgba(212,175,55,0.08),rgba(212,175,55,0.03))',
            border: `1px solid rgba(212,175,55,0.25)`,
            borderRadius: 16, padding: '24px 28px', marginBottom: 32,
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%',
              background: 'radial-gradient(circle,rgba(212,175,55,0.08),transparent)',
              pointerEvents: 'none',
            }}/>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                background: 'linear-gradient(135deg,rgba(212,175,55,0.25),rgba(212,175,55,0.08))',
                border: '1px solid rgba(212,175,55,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
              }}>{MASTER_SKILL.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: 'white' }}>{MASTER_SKILL.name}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 600, color: GOLD,
                    background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)',
                    padding: '2px 9px', borderRadius: 20, letterSpacing: '0.06em',
                  }}>MASTER SKILL</span>
                </div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', margin: '0 0 14px', maxWidth: 600, lineHeight: 1.55 }}>
                  {MASTER_SKILL.purpose}
                </p>
                <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 10, padding: '12px 16px', maxWidth: 520 }}>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Example</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>
                    Input: <span style={{ color: GOLD, fontStyle: 'italic' }}>"{MASTER_SKILL.example.input}"</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {MASTER_SKILL.example.activates.map(s => (
                      <span key={s} style={{
                        fontSize: 10, color: GOLD + 'cc',
                        background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)',
                        padding: '2px 8px', borderRadius: 4,
                      }}>⚡ {s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Skill cards — grouped by app (All view) ── */}
        {showSkills && grouped && !search && Object.entries(grouped).map(([appId, appSkills]) => {
          const meta  = APP_META[appId] || {};
          const color = meta.color || GOLD;
          return (
            <div key={appId} style={{ marginBottom: 40 }}>
              <SectionHeader emoji={meta.emoji} title={meta.label} count={appSkills.length} color={color}/>
              <div style={{
                display: 'grid',
                gridTemplateColumns: viewMode === 'grid'
                  ? 'repeat(auto-fill, minmax(280px, 1fr))'
                  : '1fr',
                gap: 12,
              }}>
                {appSkills.map(skill => <SkillCard key={skill.id} skill={skill}/>)}
              </div>
            </div>
          );
        })}

        {/* ── Skill cards — flat (filtered/search view) ── */}
        {showSkills && (!grouped || search) && filtered.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            {search && (
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 16 }}>
                {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{search}"
              </div>
            )}
            <div style={{
              display: 'grid',
              gridTemplateColumns: viewMode === 'grid'
                ? 'repeat(auto-fill, minmax(280px, 1fr))'
                : '1fr',
              gap: 12,
            }}>
              {filtered.map(skill => <SkillCard key={skill.id} skill={skill}/>)}
            </div>
          </div>
        )}

        {showSkills && (!grouped || search) && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.25)' }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>🔍</div>
            <div style={{ fontSize: 14 }}>No skills match "{search}"</div>
          </div>
        )}

        {/* ── Image Intelligence Layer ── */}
        {showImage && (
          <div style={{
            background: 'rgba(13,148,136,0.04)',
            border: '1px solid rgba(13,148,136,0.2)',
            borderRadius: 16, padding: '24px 28px',
            marginTop: grouped && !search ? 8 : 0,
          }}>
            <SectionHeader emoji="🎨" title="Image Intelligence Layer" color="#0D9488"/>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 24, maxWidth: 600 }}>
              An additive layer above the existing Image Studio. Improves image quality, consistency,
              and automation without modifying any existing generation workflows.
            </p>

            {/* Character DNA + Prompt Engine */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 14, marginBottom: 28 }}>
              {Object.values(IMAGE_INTELLIGENCE).map(sys => (
                <div key={sys.id} style={{
                  background: 'rgba(13,148,136,0.06)', border: '1px solid rgba(13,148,136,0.2)',
                  borderRadius: 12, padding: '18px 20px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <span style={{ fontSize: 24 }}>{sys.icon}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>{sys.name}</div>
                      <div style={{ fontSize: 10, color: '#0D9488', marginTop: 1 }}>Image Intelligence</div>
                    </div>
                  </div>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.55, marginBottom: 12 }}>
                    {sys.purpose}
                  </p>
                  {sys.fields && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {sys.fields.map(f => (
                        <span key={f} style={{
                          fontSize: 10, color: 'rgba(255,255,255,0.4)',
                          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                          padding: '2px 7px', borderRadius: 4,
                        }}>{f}</span>
                      ))}
                    </div>
                  )}
                  {sys.analyzes && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {sys.analyzes.map(a => (
                        <span key={a} style={{
                          fontSize: 10, color: '#0D9488cc',
                          background: 'rgba(13,148,136,0.1)', border: '1px solid rgba(13,148,136,0.2)',
                          padding: '2px 7px', borderRadius: 4,
                        }}>✓ {a}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Image Specialist Agents */}
            <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
              Image Specialist Agents
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(190px,1fr))', gap: 10 }}>
              {IMAGE_AGENTS.map(agent => <AgentCard key={agent.id} agent={agent}/>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
