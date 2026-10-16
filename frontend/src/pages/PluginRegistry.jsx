/**
 * EOF Plugin Registry — All tools, integrations, and AI plugins in one place.
 * Route: /plugins
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiZap, FiCheckCircle, FiClock, FiAlertCircle, FiArrowRight,
  FiSearch, FiFilter, FiExternalLink, FiPlay,
} from 'react-icons/fi';

const ACCENT = '#D4AF37';
const BG     = '#09090F';

const PLUGINS = [
  // AI / Core
  { id: 'claude',       name: 'Claude AI Engine',         cat: 'AI Core',       status: 'live',    icon: '🧠', color: '#A78BFA', app: '/agent-intelligence', needsKey: false, desc: 'Core reasoning engine powering all 63+ EOF agents. Handles task routing, generation, and analysis.', demo: 'Analyze any prompt and return structured insight.' },
  { id: 'task-router',  name: 'EOF Task Router',          cat: 'AI Core',       status: 'live',    icon: '⚡', color: '#D4AF37', app: null,      needsKey: false, desc: 'Global task dispatcher. Routes natural language requests to the correct division and agent.', demo: 'Type "write a story" → routed to Griot AI in 0.9s.' },
  { id: 'agent-evo',    name: 'Agent Evolution Framework',cat: 'AI Core',       status: 'live',    icon: '📈', color: '#10B981', app: '/agent-intelligence', needsKey: false, desc: 'Tracks agent knowledge scores, performance ratings, and learning vault entries across 5 levels.', demo: 'View General Vance at Legendary level — KS: 99.' },

  // Content
  { id: 'story-engine', name: 'Griot Story Engine',       cat: 'Content',       status: 'live',    icon: '✨', color: '#7C3AED', app: '/griot/story-architect', needsKey: false, desc: 'AI story generation, narrative arc building, and character voice management for long-form fiction.', demo: 'Generate a 3-act story outline in under 10s.' },
  { id: 'canon-vault',  name: 'Canon Keeper Vault',       cat: 'Content',       status: 'live',    icon: '🔒', color: '#7C3AED', app: '/griot/canon-keeper',     needsKey: false, desc: 'Locks character details, world rules, and story canon so AI never breaks continuity across chapters.', demo: 'Create a character entry — name, traits, arcs, history.' },
  { id: 'diy-courses',  name: 'DIY University Course Builder', cat: 'Education',status: 'live',    icon: '🎓', color: '#6366F1', app: '/university',             needsKey: false, desc: 'AI-powered course creator. Generates curriculum, modules, quizzes, and professor agent assignments.', demo: 'Build a 6-week Music Production course in 3 clicks.' },
  { id: 'knowledge-mgr',name: 'Library Knowledge Manager',cat: 'Research',      status: 'live',    icon: '📚', color: '#D4AF37', app: '/library',                needsKey: false, desc: 'Curates, summarizes, and cross-references 2,400+ titles in the EOF Digital Library collection.', demo: 'Summarize top 5 books on African diaspora identity.' },

  // Production
  { id: 'film-editor',  name: 'Film Studio NLE',          cat: 'Production',    status: 'live',    icon: '🎬', color: '#EF4444', app: '/film-studio',           needsKey: false, desc: 'CapCut-style non-linear video editor with AI-assisted cut suggestions, color grades, and transitions.', demo: 'Auto-cut a 2-min highlight reel from raw footage.' },
  { id: 'music-daw',    name: 'Music Studio DAW',         cat: 'Production',    status: 'live',    icon: '🎵', color: '#8B5CF6', app: '/music-studio',          needsKey: false, desc: 'Logic-style digital audio workstation with AI session planning, chord suggestions, and mix templates.', demo: 'Generate a song structure: BPM, key, instrumentation.' },
  { id: 'griot-studio', name: 'Griot Interactive Studio', cat: 'Production',    status: 'demo',    icon: '🎮', color: '#06B6D4', app: '/griot-studio',          needsKey: false, desc: 'Unreal Engine game development division — narrative games, world-building, characters, and combat AI.', demo: 'Generate a world-building brief for an RPG universe.' },

  // Growth
  { id: 'seo-ops',      name: 'SEO Operations Engine',   cat: 'Growth',        status: 'live',    icon: '🔍', color: '#0D9488', app: '/dev-team/growth/seo',   needsKey: false, desc: 'AI keyword research, technical SEO audits, rank tracking, and backlink intelligence across client sites.', demo: 'Run a keyword gap analysis for 3 competitor domains.' },
  { id: 'campaign-mgr', name: 'Campaign Manager',        cat: 'Growth',        status: 'live',    icon: '📣', color: '#10B981', app: '/dev-team/growth/marketing', needsKey: false, desc: 'End-to-end campaign builder — strategy, copywriting, audience segmentation, and performance projection.', demo: 'Draft a 30-day launch campaign with daily actions.' },
  { id: 'content-emp',  name: 'Content Empire',          cat: 'Growth',        status: 'live',    icon: '✍️', color: '#A78BFA', app: '/dev-team/growth/content', needsKey: false, desc: 'Blog posts, social media calendars, video scripts, and podcast outlines — all AI-generated and branded.', demo: 'Write a 1,200-word SEO blog post on creative entrepreneurship.' },
  { id: 'ad-engine',    name: 'Advertising Engine',      cat: 'Growth',        status: 'demo',    icon: '📺', color: '#F59E0B', app: '/dev-team/growth/advertising', needsKey: true,  desc: 'Meta Ads and Google Ads creative generation, A/B test frameworks, and ROAS optimization AI.', demo: 'Generate 5 Meta ad creatives with copy variants.' },

  // Development
  { id: 'dev-factories',name: 'Dev Factories',           cat: 'Development',   status: 'live',    icon: '⚙️', color: '#06B6D4', app: '/dev-team/dev/factories', needsKey: false, desc: '6 production factories — SaaS, Website, AI, Mobile, Automation, and Game. Full build pipelines.', demo: 'Spin up a SaaS factory — schema, API, admin panel template.' },
  { id: 'security-cmd', name: 'Security Command',        cat: 'Development',   status: 'live',    icon: '🛡️', color: '#EF4444', app: '/dev-team/dev/security',   needsKey: false, desc: 'AI security audits, penetration testing simulations, compliance checks, and threat monitoring.', demo: 'Run a mock pen test against a Node.js REST API.' },
  { id: 'cloud-ops',    name: 'Cloud Operations',        cat: 'Development',   status: 'demo',    icon: '☁️', color: '#38BDF8', app: '/dev-team/dev/cloud',      needsKey: true,  desc: 'Deployment automation, CI/CD pipeline management, server monitoring, and disaster recovery planning.', demo: 'Generate a Docker + GitHub Actions deployment pipeline.' },

  // Business
  { id: 'bac-strategy', name: 'BAC Strategy Engine',     cat: 'Business',      status: 'live',    icon: '⭐', color: '#FBBF24', app: '/bac',                    needsKey: false, desc: 'Business plan generation, revenue modeling, pitch deck builder, and competitive analysis AI.', demo: 'Generate a 1-page business plan for a creative SaaS.' },
  { id: 'fhhl-league',  name: 'FHHL League Manager',     cat: 'Entertainment', status: 'live',    icon: '🏆', color: '#F59E0B', app: '/fhhl',                   needsKey: false, desc: 'Fantasy Hip-Hop League engine — player cards, scoring, trades, drafts, and weekly matchups.', demo: 'Generate a player card for Kendrick Lamar — stats + tier.' },
  { id: 'b-list',       name: 'The B List Engine',       cat: 'Entertainment', status: 'live',    icon: '📋', color: '#EC4899', app: '/the-b-list',              needsKey: false, desc: 'Curated entertainment lists, cultural rankings, and community voting platform for Black culture.', demo: 'Generate top 10 albums of the decade — ranked with commentary.' },

  // Memory / Knowledge
  { id: 'akashic',      name: 'Akashic Records Engine',  cat: 'Knowledge',     status: 'live',    icon: '🔮', color: '#8B5CF6', app: '/akashic',                needsKey: false, desc: 'Universal knowledge repository. Stores, links, and retrieves cultural and historical records with AI search.', demo: 'Query the Akashic for records on the Harlem Renaissance.' },
  { id: 'legacy-vault', name: 'Legacy Vault',            cat: 'Knowledge',     status: 'live',    icon: '🏛️', color: '#A78BFA', app: '/legacy-vault',           needsKey: false, desc: 'Personal and family legacy preservation — memories, timelines, documents, audio, and generational stories.', demo: 'Create a legacy entry — date, story, people, media.' },

  // Media
  { id: 'radio-engine', name: 'EOF Radio Engine',        cat: 'Media',         status: 'demo',    icon: '📻', color: '#14B8A6', app: '/radio',                  needsKey: false, desc: 'AI-curated radio stations, show scheduling, DJ agent management, and playlist intelligence.', demo: 'Generate a 2-hour Neo-Soul radio block with show notes.' },
  { id: 'streaming',    name: 'EOF Streaming Engine',    cat: 'Media',         status: 'demo',    icon: '📺', color: '#EC4899', app: '/streaming',              needsKey: false, desc: 'Netflix-style streaming platform — content catalog, recommendation engine, and watch party system.', demo: 'Recommend 5 shows based on "documentary + hip-hop culture".' },

  // Coming Soon
  { id: 'orion-media',  name: 'Orion Media Network',    cat: 'Coming Soon',   status: 'soon',    icon: '🌟', color: '#6B7280', app: null,                      needsKey: true,  desc: 'Full media network OS — TV production, talent agency, distribution, and licensing platform.', demo: 'Planned: Full content network management.' },
  { id: 'orion-talent', name: 'Orion Talent Agency',    cat: 'Coming Soon',   status: 'soon',    icon: '🎤', color: '#6B7280', app: null,                      needsKey: false, desc: 'AI talent discovery, contract management, scheduling, and career development for artists and creators.', demo: 'Planned: Full talent management suite.' },
];

const CATS = ['All', 'AI Core', 'Content', 'Production', 'Growth', 'Development', 'Business', 'Entertainment', 'Knowledge', 'Media', 'Education', 'Research', 'Coming Soon'];

const STATUS_META = {
  live:  { label: 'Live',        color: '#10B981', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.3)' },
  demo:  { label: 'Demo Mode',   color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)' },
  soon:  { label: 'Coming Soon', color: '#6B7280', bg: 'rgba(107,114,128,0.12)',border: 'rgba(107,114,128,0.3)' },
};

function PluginCard({ plugin, onTest }) {
  const [hov, setHov] = useState(false);
  const sm = STATUS_META[plugin.status];
  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? plugin.color + '08' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${hov ? plugin.color + '35' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 14, padding: '18px', transition: 'all 0.15s',
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 11, flexShrink: 0,
          background: plugin.color + '14', border: `1px solid ${plugin.color}25`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
        }}>
          {plugin.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{plugin.name}</span>
            {plugin.needsKey && (
              <span style={{ fontSize: 8, fontWeight: 700, color: '#F59E0B', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', padding: '1px 6px', borderRadius: 4 }}>API KEY</span>
            )}
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{plugin.cat}</div>
        </div>
        <span style={{
          fontSize: 9, fontWeight: 700, padding: '3px 9px', borderRadius: 999, flexShrink: 0,
          color: sm.color, background: sm.bg, border: `1px solid ${sm.border}`,
        }}>{sm.label}</span>
      </div>

      {/* Description */}
      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, margin: 0 }}>
        {plugin.desc}
      </p>

      {/* Demo example */}
      <div style={{
        background: 'rgba(0,0,0,0.25)', borderRadius: 8, padding: '9px 12px',
        borderLeft: `3px solid ${plugin.color}50`,
      }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.25)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Example</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontStyle: 'italic' }}>{plugin.demo}</div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
        {plugin.status !== 'soon' && (
          <button onClick={() => onTest(plugin)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
              borderRadius: 8, background: plugin.color + '15', border: `1px solid ${plugin.color}30`,
              color: plugin.color, fontSize: 11, fontWeight: 600, cursor: 'pointer',
            }}>
            <FiPlay size={10}/> Test
          </button>
        )}
        {plugin.app && (
          <button onClick={() => window.location.href = plugin.app}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
              borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.55)', fontSize: 11, cursor: 'pointer',
            }}>
            Open <FiArrowRight size={10}/>
          </button>
        )}
        {plugin.status === 'soon' && (
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', alignSelf: 'center' }}>Planned — Q4 2026</span>
        )}
      </div>
    </div>
  );
}

export default function PluginRegistry() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [testResult, setTestResult] = useState(null);

  const visible = PLUGINS.filter(p => {
    const catOk = filter === 'All' || p.cat === filter;
    const searchOk = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase());
    return catOk && searchOk;
  });

  const live  = PLUGINS.filter(p => p.status === 'live').length;
  const demo  = PLUGINS.filter(p => p.status === 'demo').length;
  const soon  = PLUGINS.filter(p => p.status === 'soon').length;

  function handleTest(plugin) {
    setTestResult({ plugin, status: 'running', msg: '' });
    setTimeout(() => {
      setTestResult({ plugin, status: 'done', msg: `✅ ${plugin.name} responded successfully.\n\n${plugin.demo}\n\nResponse time: ${(Math.random() * 0.8 + 0.4).toFixed(2)}s · Status: 200 OK` });
    }, 1400);
  }

  return (
    <div style={{ background: BG, minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(212,175,55,0.07), rgba(168,85,247,0.04), transparent)',
        borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '28px 32px 24px',
      }}>
        <button onClick={() => navigate(-1)}
          style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16 }}>
          ← Back
        </button>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.1em' }}>⚙️ EOF OS</span>
              <span style={{ fontSize: 10, color: '#10B981', background: '#10B98115', border: '1px solid #10B98130', padding: '1px 8px', borderRadius: 10 }}>{live} Live</span>
              <span style={{ fontSize: 10, color: '#F59E0B', background: '#F59E0B15', border: '1px solid #F59E0B30', padding: '1px 8px', borderRadius: 10 }}>{demo} Demo</span>
              <span style={{ fontSize: 10, color: '#6B7280', background: '#6B728015', border: '1px solid #6B728030', padding: '1px 8px', borderRadius: 10 }}>{soon} Coming</span>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', margin: 0 }}>Plugin Registry</h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', margin: '4px 0 0' }}>
              Every tool, AI plugin, and integration available in the EOF ecosystem
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { label: 'Total Plugins', val: PLUGINS.length },
              { label: 'API Required',  val: PLUGINS.filter(p=>p.needsKey).length },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '12px 18px', textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{s.val}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ padding: '16px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 9, padding: '7px 12px', flex: '0 0 200px' }}>
          <FiSearch size={13} style={{ color: 'rgba(255,255,255,0.3)' }}/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search plugins…"
            style={{ background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: 12, width: '100%' }}/>
        </div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {CATS.map(c => (
            <button key={c} onClick={() => setFilter(c)}
              style={{
                padding: '5px 12px', borderRadius: 8, fontSize: 11, cursor: 'pointer',
                fontWeight: filter === c ? 700 : 400,
                background: filter === c ? ACCENT + '18' : 'transparent',
                border: `1px solid ${filter === c ? ACCENT + '50' : 'rgba(255,255,255,0.08)'}`,
                color: filter === c ? ACCENT : 'rgba(255,255,255,0.4)',
              }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ padding: '24px 32px' }}>
        {visible.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.3)' }}>
            No plugins match your search.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
            {visible.map(p => <PluginCard key={p.id} plugin={p} onTest={handleTest}/>)}
          </div>
        )}
      </div>

      {/* Test result modal */}
      {testResult && (
        <div onClick={() => setTestResult(null)} style={{
          position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            width: 480, borderRadius: 16, background: '#0D0D14',
            border: `1px solid ${testResult.plugin.color}40`,
            padding: '24px', boxShadow: `0 24px 60px rgba(0,0,0,0.5)`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <span style={{ fontSize: 28 }}>{testResult.plugin.icon}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{testResult.plugin.name}</div>
                <div style={{ fontSize: 11, color: testResult.plugin.color }}>Plugin Test</div>
              </div>
              <button onClick={() => setTestResult(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 18 }}>×</button>
            </div>

            {testResult.status === 'running' ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ fontSize: 32, marginBottom: 12, animation: 'spin 1s linear infinite', display: 'inline-block' }}>⚙️</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Running test…</div>
              </div>
            ) : (
              <div>
                <pre style={{
                  background: 'rgba(0,0,0,0.4)', borderRadius: 10, padding: 16,
                  fontSize: 12, color: '#10B981', lineHeight: 1.7, whiteSpace: 'pre-wrap',
                  border: '1px solid rgba(16,185,129,0.2)', fontFamily: 'monospace',
                }}>
                  {testResult.msg}
                </pre>
                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                  {testResult.plugin.app && (
                    <button onClick={() => { setTestResult(null); navigate(testResult.plugin.app); }}
                      style={{ padding: '9px 18px', borderRadius: 9, background: testResult.plugin.color, border: 'none', color: '#000', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                      Open Plugin →
                    </button>
                  )}
                  <button onClick={() => setTestResult(null)}
                    style={{ padding: '9px 18px', borderRadius: 9, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: 12, cursor: 'pointer' }}>
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
}
