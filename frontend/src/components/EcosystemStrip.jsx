import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { ECOSYSTEM_APPS } from '../data/ecosystemData';

// Shared cross-app navigation strip rendered at the bottom of every app page.
export default function EcosystemStrip({ currentAppId, compact = false }) {
  const others = ECOSYSTEM_APPS.filter(a => a.id !== currentAppId);

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-[10px] font-semibold tracking-widest uppercase text-gray-600 mr-1">Also on EOF</span>
        {others.map(app => (
          <Link
            key={app.id}
            to={app.path}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors px-2.5 py-1 rounded-full bg-white/5 border border-white/10 hover:border-white/20"
          >
            <span className="text-sm">{app.emoji}</span>
            {app.shortName}
          </Link>
        ))}
      </div>
    );
  }

  return (
    <section className="mt-16 border-t border-white/10 pt-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-xl text-white font-bold">The Complete EOF Ecosystem</h2>
          <p className="text-sm text-gray-500 mt-1">Every app works together. Explore the others.</p>
        </div>
        <Link
          to="/ecosystem"
          className="flex items-center gap-1.5 text-sm text-eof-gold hover:underline font-medium"
        >
          View Full Ecosystem <FiArrowRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {others.map((app, i) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Link
              to={app.path}
              className={`group flex flex-col gap-3 rounded-2xl bg-gradient-to-br ${app.gradient} border ${app.border} p-4 hover:scale-[1.02] transition-transform duration-200 h-full`}
            >
              <div className="text-3xl">{app.emoji}</div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white leading-tight">{app.shortName}</p>
                <p className="text-xs text-gray-500 mt-0.5 font-medium">{app.role}</p>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2">{app.tagline}</p>
              <div
                className="flex items-center gap-1 text-xs font-medium group-hover:gap-2 transition-all"
                style={{ color: app.color }}
              >
                Open <FiArrowRight size={11} />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
