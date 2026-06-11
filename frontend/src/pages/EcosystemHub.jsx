import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiChevronRight } from 'react-icons/fi';
import { ECOSYSTEM_APPS, ECOSYSTEM_FLOW } from '../data/ecosystemData';

function AppCard({ app, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
    >
      <Link
        to={app.path}
        className={`group flex flex-col gap-4 rounded-2xl bg-gradient-to-br ${app.gradient} border ${app.border} p-6 hover:scale-[1.02] transition-transform duration-200 h-full`}
      >
        <div className="flex items-start justify-between">
          <div className="text-5xl">{app.emoji}</div>
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full border"
            style={{ color: app.color, borderColor: `${app.color}40`, background: `${app.color}10` }}
          >
            {app.role}
          </span>
        </div>
        <div>
          <h3 className="font-serif text-xl text-white font-bold">{app.name}</h3>
          <p className="text-sm mt-1" style={{ color: app.color }}>{app.tagline}</p>
        </div>
        <p className="text-sm text-gray-400 leading-relaxed flex-1">{app.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {app.features.slice(0, 3).map(f => (
            <span key={f} className="text-xs bg-black/30 border border-white/10 rounded-full px-2.5 py-1 text-gray-400">
              {f}
            </span>
          ))}
          {app.features.length > 3 && (
            <span className="text-xs text-gray-600">+{app.features.length - 3}</span>
          )}
        </div>
        <div
          className="flex items-center gap-1.5 text-sm font-medium group-hover:gap-3 transition-all"
          style={{ color: app.color }}
        >
          Enter {app.shortName} <FiArrowRight size={14} />
        </div>
      </Link>
    </motion.div>
  );
}

function FlowStep({ item, index, total }) {
  const app = ECOSYSTEM_APPS.find(a => a.id === item.app);
  return (
    <div className="flex flex-col items-center gap-2 relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1, type: 'spring', damping: 15 }}
      >
        <Link
          to={app?.path || '#'}
          className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border transition-all hover:scale-110 ${
            app
              ? `bg-gradient-to-br ${app.gradient} ${app.border} hover:border-opacity-60`
              : 'bg-eof-gold/10 border-eof-gold/25'
          }`}
        >
          {item.icon}
        </Link>
      </motion.div>
      <p className="text-xs font-bold text-white">{item.step}</p>
      <p className="text-[10px] text-gray-500 text-center leading-tight max-w-[64px]">{item.desc}</p>
      {app && (
        <p className="text-[10px]" style={{ color: app.color }}>{app.shortName}</p>
      )}
    </div>
  );
}

export default function EcosystemHub() {
  return (
    <div className="min-h-screen bg-eof-dark px-4 md:px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <Link to="/" className="hover:text-eof-gold transition-colors">Home</Link>
        <FiChevronRight size={12} />
        <span className="text-eof-gold">Ecosystem</span>
      </div>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-r from-eof-gold/10 via-eof-purple/5 to-transparent border border-eof-gold/20 px-6 py-10 mb-10 relative overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(124,58,237,0.08) 0%, transparent 60%)' }} />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-eof-gold/10 border border-eof-gold/25 rounded-full px-3 py-1 text-xs text-eof-gold mb-4">
            <span>🌐</span> All {ECOSYSTEM_APPS.length} Apps — One Connected Ecosystem
          </div>
          <h1 className="font-serif text-3xl md:text-5xl text-white font-bold leading-tight mb-3">
            The EOF Ecosystem
          </h1>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed">
            Every app works together. Learn at DIY University. Create with Griot AI. Store in the Library. Distribute through Streaming and Radio. Build your legacy.
          </p>
        </div>
      </motion.div>

      {/* Ecosystem Flow */}
      <div className="rounded-2xl bg-white/3 border border-white/10 p-6 md:p-8 mb-10">
        <h2 className="font-serif text-xl text-white font-bold mb-1 text-center">The Journey</h2>
        <p className="text-sm text-gray-500 text-center mb-8">Click any step to enter that app</p>
        <div className="flex flex-wrap justify-center items-start gap-3 md:gap-6">
          {ECOSYSTEM_FLOW.map((item, i) => (
            <React.Fragment key={item.step}>
              <FlowStep item={item} index={i} total={ECOSYSTEM_FLOW.length} />
              {i < ECOSYSTEM_FLOW.length - 1 && (
                <div className="flex items-center mt-7">
                  <FiArrowRight size={16} className="text-white/20 flex-shrink-0" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* App grid */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl text-white font-bold">All Apps</h2>
          <span className="text-sm text-gray-500">{ECOSYSTEM_APPS.length} platforms</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {ECOSYSTEM_APPS.map((app, i) => (
            <AppCard key={app.id} app={app} index={i} />
          ))}
        </div>
      </div>

      {/* Connection diagram — simple text-based */}
      <div className="rounded-2xl bg-white/3 border border-white/10 p-6 md:p-8">
        <h2 className="font-serif text-xl text-white font-bold mb-6">How The Apps Connect</h2>
        <div className="space-y-4">
          {ECOSYSTEM_APPS.map(app => {
            const connected = app.connects.map(cid => ECOSYSTEM_APPS.find(a => a.id === cid)).filter(Boolean);
            return (
              <div key={app.id} className="flex flex-col sm:flex-row sm:items-center gap-3">
                <Link
                  to={app.path}
                  className={`flex items-center gap-2.5 rounded-xl bg-gradient-to-r ${app.gradient} border ${app.border} px-4 py-2.5 w-48 flex-shrink-0 hover:brightness-110 transition-all`}
                >
                  <span className="text-xl">{app.emoji}</span>
                  <span className="text-sm font-bold text-white">{app.shortName}</span>
                </Link>
                <FiArrowRight size={14} className="text-white/30 hidden sm:block flex-shrink-0" />
                <div className="flex flex-wrap gap-2">
                  {connected.map(c => (
                    <Link
                      key={c.id}
                      to={c.path}
                      className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:border-white/20 transition-all"
                    >
                      <span>{c.emoji}</span>
                      {c.shortName}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
