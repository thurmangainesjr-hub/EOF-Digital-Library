import React from 'react';
import { motion } from 'framer-motion';

// Tier display config
const TIER_CONFIG = {
  free:       { label: 'Free',       color: '#9CA3AF', bg: 'rgba(156,163,175,0.1)'  },
  standard:   { label: 'Standard',   color: '#60A5FA', bg: 'rgba(96,165,250,0.1)'   },
  premium:    { label: 'Premium',    color: '#D4AF37', bg: 'rgba(212,175,55,0.1)'   },
  enterprise: { label: 'Enterprise', color: '#A78BFA', bg: 'rgba(167,139,250,0.1)'  },
};

// ── Avatar face — the visual identity of each agent ───────────────────────────
export function AgentAvatarFace({ agent, size = 'md' }) {
  const dim = { sm: 44, md: 80, lg: 120, xl: 160 }[size];
  const emojiSize = { sm: 20, md: 34, lg: 52, xl: 68 }[size];
  const radius = { sm: 12, md: 18, lg: 24, xl: 32 }[size];

  return (
    <div
      className="relative flex items-center justify-center flex-shrink-0 overflow-hidden"
      style={{
        width: dim,
        height: dim,
        borderRadius: radius,
        background: `radial-gradient(circle at 35% 35%, ${agent.colorFrom}CC, ${agent.colorTo}FF)`,
        border: `1.5px solid ${agent.colorFrom}50`,
        boxShadow: `0 0 ${dim * 0.25}px ${agent.colorFrom}30, inset 0 1px 0 rgba(255,255,255,0.08)`,
      }}
    >
      {/* Scan-line overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.12) 3px, rgba(0,0,0,0.12) 4px)',
          borderRadius: 'inherit',
        }}
      />

      {/* Corner accent — top right */}
      <div
        className="absolute top-0 right-0 pointer-events-none"
        style={{
          width: dim * 0.45,
          height: dim * 0.45,
          borderRadius: `0 ${radius}px 0 ${dim * 0.45}px`,
          background: `rgba(255,255,255,0.04)`,
          border: `1px solid rgba(255,255,255,0.06)`,
        }}
      />

      {/* Inner glow ring */}
      <div
        className="absolute inset-0 pointer-events-none rounded-[inherit]"
        style={{
          background: `radial-gradient(circle at 65% 65%, ${agent.colorFrom}15, transparent 65%)`,
        }}
      />

      {/* Emoji face */}
      <span
        className="relative z-10 select-none"
        style={{ fontSize: emojiSize, lineHeight: 1, filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))' }}
      >
        {agent.avatar}
      </span>

      {/* Status dot — bottom right */}
      {size !== 'sm' && (
        <span
          className="absolute bottom-1.5 right-1.5 rounded-full border-2 z-10 animate-pulse"
          style={{
            width: dim * 0.14,
            height: dim * 0.14,
            background: '#10B981',
            borderColor: 'rgba(10,10,10,0.9)',
          }}
        />
      )}
    </div>
  );
}

// ── Compact avatar card — the Netflix tile ─────────────────────────────────────
export default function AgentAvatarCard({ agent, systemId, system, minTier = 'free', index = 0, onClick }) {
  const tier = TIER_CONFIG[minTier] || TIER_CONFIG.standard;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      onClick={onClick}
      className="group relative cursor-pointer flex-shrink-0"
      style={{ width: 155 }}
    >
      {/* Card shell */}
      <div
        className="rounded-2xl overflow-hidden border transition-all duration-200 group-hover:border-opacity-60"
        style={{
          background: 'linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
          borderColor: `${agent.colorFrom}28`,
          boxShadow: `0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)`,
        }}
      >
        {/* Avatar face area */}
        <div
          className="relative flex items-center justify-center pt-5 pb-4"
          style={{
            background: `linear-gradient(180deg, ${agent.colorFrom}14 0%, transparent 100%)`,
            borderBottom: `1px solid rgba(255,255,255,0.05)`,
          }}
        >
          {/* Glow backdrop behind avatar */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 50% 60%, ${agent.colorFrom}18 0%, transparent 70%)`,
            }}
          />
          <AgentAvatarFace agent={agent} size="md" />

          {/* System badge — top left */}
          {system && (
            <div
              className="absolute top-2 left-2 text-base leading-none"
              title={system.name}
            >
              {system.emoji}
            </div>
          )}
        </div>

        {/* Info section */}
        <div className="px-3 pt-2.5 pb-3">
          <p className="text-[13px] font-bold text-white leading-tight truncate">{agent.name}</p>
          <p
            className="text-[10px] mt-0.5 truncate font-medium"
            style={{ color: agent.colorFrom }}
          >
            {agent.title}
          </p>

          {/* Tagline — first capability as the hook */}
          <p className="text-[10px] text-gray-600 mt-1.5 leading-tight line-clamp-2">
            "{agent.capabilities[0]}"
          </p>

          {/* Footer badges */}
          <div className="flex items-center gap-1.5 mt-2.5">
            <span
              className="text-[9px] px-1.5 py-0.5 rounded-full border font-medium"
              style={{ color: tier.color, borderColor: `${tier.color}40`, background: tier.bg }}
            >
              {tier.label}+
            </span>
            <span className="ml-auto flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] text-gray-600">Online</span>
            </span>
          </div>
        </div>
      </div>

      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200"
        style={{ boxShadow: `0 8px 32px ${agent.colorFrom}22` }}
      />
    </motion.div>
  );
}
