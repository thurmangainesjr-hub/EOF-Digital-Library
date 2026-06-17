/**
 * EOF Growth Intelligence Suite — Division sub-page placeholder
 * Coming Soon per EOF universal UI rule, with agent roster.
 */
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiZap } from 'react-icons/fi';

const EMERALD = '#10B981';

const DEPT_META = {
  '/growth/seo': {
    name: 'SEO Operations',      icon: '🔍',
    tagline: 'Visibility · Rankings · Authority',
    agents: ['SEO Director','Keyword Intelligence','Technical SEO','Local SEO','GEO Agent','Backlink Intelligence','SEO Reporting'],
  },
  '/growth/marketing': {
    name: 'Marketing Command',   icon: '📣',
    tagline: 'Acquire · Convert · Retain',
    agents: ['Marketing Director','Market Research','Audience Intelligence','Funnel Architect','Campaign Manager','Retention Specialist'],
  },
  '/growth/content': {
    name: 'Content Empire',      icon: '✍️',
    tagline: 'Blog · Social · Video · Podcast',
    agents: ['Content Director','Copywriter','Storytelling Specialist','Social Media Manager','Video Strategist','Podcast Producer'],
  },
  '/growth/advertising': {
    name: 'Advertising Agency',  icon: '📺',
    tagline: 'Meta · Google · Search · Display',
    agents: ['Advertising Director','Meta Ads Specialist','Search Ads Specialist','Creative Testing','Conversion Analyst'],
  },
  '/growth/clients': {
    name: 'Client Success',      icon: '🤝',
    tagline: 'CRM · Reporting · Onboarding · ROI',
    agents: ['Account Manager','Client Success Manager','Onboarding Specialist','ROI Analyst'],
  },
  '/growth/analytics': {
    name: 'Analytics Center',    icon: '📊',
    tagline: 'Data · Insights · Growth Metrics',
    agents: ['Analytics Director','Data Visualizer','Attribution Analyst'],
  },
  '/growth/portal': {
    name: 'Client Portal',       icon: '🌐',
    tagline: 'Client Dashboard · Reports · Communication',
    agents: ['Portal Manager','Report Generator'],
  },
};

export default function GrowthStudioDept() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const lastSeg   = location.pathname.split('/').filter(Boolean).pop();
  const meta      = DEPT_META['/growth/' + lastSeg] || { name: 'Division', icon: '📈', tagline: '', agents: [] };
  const inDevTeam = location.pathname.startsWith('/dev-team');
  const backPath  = inDevTeam ? '/dev-team/growth' : '/growth';

  return (
    <div style={{
      minHeight: '100%', background: '#020C07',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif', padding: 32,
    }}>
      <div style={{
        maxWidth: 580, width: '100%', textAlign: 'center',
        background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.18)',
        borderRadius: 20, padding: '48px 40px',
      }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>{meta.icon}</div>
        <div style={{ fontSize: 11, fontWeight: 600, color: EMERALD, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
          EOF Growth Intelligence Suite
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: 'white', margin: '0 0 4px' }}>{meta.name}</h2>
        {meta.tagline && (
          <div style={{ fontSize: 12, color: EMERALD, marginBottom: 16, opacity: 0.7 }}>{meta.tagline}</div>
        )}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700,
          color: '#F59E0B', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)',
          padding: '4px 14px', borderRadius: 20, marginBottom: 24, letterSpacing: '0.08em',
        }}>
          <FiZap size={11}/> COMING SOON
        </div>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, marginBottom: 28 }}>
          This division's full agent interface, campaign tools, and reporting dashboards are being built.
          Full capabilities will be available here soon.
        </p>

        {meta.agents.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
              AI Team Members
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {meta.agents.map(a => (
                <span key={a} style={{
                  fontSize: 12, color: 'rgba(255,255,255,0.55)',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
                  padding: '5px 12px', borderRadius: 8,
                }}>{a}</span>
              ))}
            </div>
          </div>
        )}

        <button onClick={() => navigate(backPath)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', borderRadius: 10, cursor: 'pointer',
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
            color: EMERALD, fontSize: 13, fontWeight: 600,
          }}>
          <FiArrowLeft size={13}/> Back to Growth Command
        </button>
      </div>
    </div>
  );
}
