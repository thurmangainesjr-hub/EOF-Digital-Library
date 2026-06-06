/**
 * EOF Digital Library — Thermal Monitor
 *
 * Real-time CPU/GPU/Memory/Battery dashboard.
 * Polls GET /api/system/thermal every 3 s.
 *
 * Usage:
 *   <ThermalMonitor />                  full dashboard
 *   <ThermalMonitor compact />          mini widget strip
 */

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import {
  FiCpu, FiZap, FiDatabase, FiBattery, FiActivity,
  FiThermometer, FiAlertTriangle, FiRefreshCw, FiWifi,
  FiWifiOff
} from 'react-icons/fi';

// ── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_COLOR = {
  cool:     { text: 'text-emerald-400',  bg: 'bg-emerald-500',   ring: 'border-emerald-500/40',  bar: 'from-emerald-600 to-emerald-400'  },
  warm:     { text: 'text-yellow-400',   bg: 'bg-yellow-500',    ring: 'border-yellow-500/40',   bar: 'from-yellow-600 to-yellow-400'    },
  hot:      { text: 'text-orange-400',   bg: 'bg-orange-500',    ring: 'border-orange-500/40',   bar: 'from-orange-600 to-orange-400'    },
  critical: { text: 'text-eof-crimson-light', bg: 'bg-eof-crimson', ring: 'border-eof-crimson/60', bar: 'from-eof-crimson to-eof-crimson-light' },
  unknown:  { text: 'text-gray-500',     bg: 'bg-gray-600',      ring: 'border-gray-600/30',     bar: 'from-gray-600 to-gray-500'        },
};

function statusColor(s) { return STATUS_COLOR[s] ?? STATUS_COLOR.unknown; }

function tempStatus(t) {
  if (t == null) return 'unknown';
  if (t < 50)   return 'cool';
  if (t < 70)   return 'warm';
  if (t < 85)   return 'hot';
  return 'critical';
}

function fmt(n, unit = '°C') {
  return n != null ? `${Math.round(n)}${unit}` : '—';
}

function fmtBytes(bytes) {
  if (!bytes) return '—';
  const gb = bytes / 1024 / 1024 / 1024;
  return gb >= 1 ? `${gb.toFixed(1)} GB` : `${(bytes / 1024 / 1024).toFixed(0)} MB`;
}

// ── Gauge (circular) ─────────────────────────────────────────────────────────

function TempGauge({ temp, status, size = 96, label }) {
  const c = statusColor(status);
  const pct = temp != null ? Math.min(temp / 100, 1) : 0;
  const r   = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const arc  = circ * 0.75; // 270° sweep
  const dash = arc * pct;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Track */}
        <svg width={size} height={size} className="rotate-[135deg]">
          <circle cx={size/2} cy={size/2} r={r}
                  fill="none" stroke="rgba(255,255,255,0.05)"
                  strokeWidth={8} strokeDasharray={`${arc} ${circ - arc}`}
                  strokeLinecap="round"/>
          {/* Fill */}
          <circle cx={size/2} cy={size/2} r={r}
                  fill="none"
                  className={`transition-all duration-700`}
                  stroke={
                    status === 'cool'     ? '#34d399' :
                    status === 'warm'     ? '#fbbf24' :
                    status === 'hot'      ? '#fb923c' :
                    status === 'critical' ? '#e74c3c' : '#6b7280'
                  }
                  strokeWidth={8}
                  strokeDasharray={`${dash} ${circ - dash}`}
                  strokeLinecap="round"/>
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold text-lg leading-none ${c.text}`}>
            {temp != null ? Math.round(temp) : '—'}
          </span>
          <span className="text-[10px] text-gray-500 mt-0.5">°C</span>
        </div>
      </div>
      <span className="text-[11px] text-gray-400 font-medium">{label}</span>
      <span className={`badge text-[8px] py-0.5 px-2 ${c.text} bg-transparent border ${c.ring}`}>
        {status}
      </span>
    </div>
  );
}

// ── Bar metric ───────────────────────────────────────────────────────────────

function MetricBar({ label, value, max, unit = '', status, icon: Icon }) {
  const pct  = max ? Math.min((value / max) * 100, 100) : value;
  const c    = statusColor(status ?? tempStatus(value));

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          {Icon && <Icon size={12}/>}
          <span>{label}</span>
        </div>
        <span className={`text-xs font-semibold ${c.text}`}>
          {value != null ? `${typeof value === 'number' ? (Number.isInteger(value) ? value : value.toFixed(1)) : value}${unit}` : '—'}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${c.bar}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

// ── Core card ────────────────────────────────────────────────────────────────

function CoreGrid({ cores }) {
  if (!cores?.length) return null;
  return (
    <div className="grid grid-cols-4 gap-1.5 mt-2">
      {cores.map(({ core, temp }) => {
        const s = tempStatus(temp);
        const c = statusColor(s);
        return (
          <div key={core}
               className={`rounded-lg p-1.5 text-center border ${c.ring} bg-white/3`}>
            <p className={`text-[11px] font-bold ${c.text}`}>{fmt(temp)}</p>
            <p className="text-[9px] text-gray-600 mt-0.5">C{core}</p>
          </div>
        );
      })}
    </div>
  );
}

// ── Pulse dot ─────────────────────────────────────────────────────────────────

function LiveDot({ active }) {
  return (
    <span className="relative flex h-2 w-2">
      {active && (
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"/>
      )}
      <span className={`relative inline-flex rounded-full h-2 w-2 ${active ? 'bg-emerald-500' : 'bg-gray-600'}`}/>
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ThermalMonitor({ compact = false }) {
  const [data,     setData]     = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [polling,  setPolling]  = useState(true);

  const fetchThermal = useCallback(async () => {
    try {
      const res = await api.get('/system/thermal');
      setData(res.data.data);
      setLastUpdate(new Date());
      setError(null);
    } catch (e) {
      setError(e?.response?.data?.error ?? 'Could not reach thermal endpoint.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchThermal();
    if (!polling) return;
    const id = setInterval(fetchThermal, 3000);
    return () => clearInterval(id);
  }, [fetchThermal, polling]);

  // ── Compact strip ──────────────────────────────────────────────────────────
  if (compact) {
    if (!data) return null;
    const items = [
      { label: 'CPU', value: data.cpu?.main, icon: FiCpu },
      ...(data.gpus ?? []).slice(0, 1).map(g => ({ label: 'GPU', value: g.temp, icon: FiZap })),
      { label: 'RAM', value: data.memory?.usedPct, icon: FiDatabase, unit: '%', noTemp: true },
    ];
    return (
      <div className="flex items-center gap-4">
        {items.map(({ label, value, icon: Icon, unit = '°C', noTemp }) => {
          const s = noTemp ? (value > 80 ? 'hot' : value > 60 ? 'warm' : 'cool') : tempStatus(value);
          const c = statusColor(s);
          return (
            <div key={label} className="flex items-center gap-1.5">
              <Icon size={13} className={c.text}/>
              <span className="text-xs text-gray-400">{label}</span>
              <span className={`text-xs font-bold ${c.text}`}>
                {value != null ? `${Math.round(value)}${unit}` : '—'}
              </span>
            </div>
          );
        })}
        <LiveDot active={polling}/>
      </div>
    );
  }

  // ── Full dashboard ─────────────────────────────────────────────────────────
  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-white">Thermal Monitor</h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time system health — {data?.os?.platform ?? '…'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Live indicator */}
          <div className="flex items-center gap-2 bg-white/4 border border-white/8 rounded-full px-3 py-1.5">
            <LiveDot active={polling && !error}/>
            <span className="text-xs text-gray-400">
              {error ? 'Offline' : polling ? 'Live' : 'Paused'}
            </span>
          </div>
          <button
            onClick={() => setPolling(p => !p)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
              polling ? 'bg-eof-gold/10 text-eof-gold hover:bg-eof-gold/20' : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
            title={polling ? 'Pause' : 'Resume'}
          >
            <FiActivity size={16}/>
          </button>
          <button
            onClick={fetchThermal}
            className="w-9 h-9 rounded-xl bg-white/5 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
            title="Refresh now"
          >
            <FiRefreshCw size={15}/>
          </button>
        </div>
      </div>

      {/* Last update */}
      {lastUpdate && (
        <p className="text-xs text-gray-600 -mt-4">
          Last updated {lastUpdate.toLocaleTimeString()}
        </p>
      )}

      {/* Error banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-3 bg-eof-crimson/10 border border-eof-crimson/30 rounded-xl p-4"
          >
            <FiAlertTriangle className="text-eof-crimson-light flex-shrink-0" size={18}/>
            <div>
              <p className="text-sm font-semibold text-eof-crimson-light">Sensor Error</p>
              <p className="text-xs text-gray-400 mt-0.5">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading && !data ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-3 border-eof-gold border-t-transparent rounded-full animate-spin"/>
        </div>
      ) : data ? (
        <div className="space-y-6">

          {/* ── Temperature gauges row ─────────────────────────────── */}
          <div className="card">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <FiThermometer size={14}/> Temperature
            </h2>
            <div className="flex flex-wrap gap-8 justify-around">
              <TempGauge
                temp={data.cpu?.main}
                status={data.cpu?.status}
                label="CPU"
              />
              {(data.gpus ?? []).map((g, i) => (
                <TempGauge
                  key={i}
                  temp={g.temp}
                  status={g.status}
                  label={g.name?.split(' ').slice(-2).join(' ') ?? `GPU ${i}`}
                />
              ))}
            </div>

            {/* CPU per-core temps */}
            {data.cpu?.cores?.length > 0 && (
              <div className="mt-6 pt-4 border-t border-white/5">
                <p className="text-xs text-gray-500 mb-2">Per-core temperatures</p>
                <CoreGrid cores={data.cpu.cores}/>
              </div>
            )}
          </div>

          {/* ── Load & Memory ──────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* CPU Load */}
            <div className="card space-y-4">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <FiCpu size={14}/> CPU Load
              </h2>
              <MetricBar
                label="Overall"
                value={data.cpu?.load}
                max={100}
                unit="%"
                status={data.cpu?.load > 90 ? 'critical' : data.cpu?.load > 70 ? 'hot' : data.cpu?.load > 50 ? 'warm' : 'cool'}
                icon={FiActivity}
              />
              <div className="pt-2 border-t border-white/5">
                <p className="text-[11px] text-gray-500">
                  Temperature · <span className={statusColor(data.cpu?.status).text}>
                    {fmt(data.cpu?.main)} / max {fmt(data.cpu?.max)}
                  </span>
                </p>
              </div>
            </div>

            {/* Memory */}
            <div className="card space-y-4">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <FiDatabase size={14}/> Memory
              </h2>
              <MetricBar
                label="Used"
                value={data.memory?.usedPct}
                max={100}
                unit="%"
                status={data.memory?.usedPct > 90 ? 'critical' : data.memory?.usedPct > 75 ? 'hot' : data.memory?.usedPct > 55 ? 'warm' : 'cool'}
                icon={FiDatabase}
              />
              <div className="flex justify-between text-[11px] text-gray-500 pt-1 border-t border-white/5">
                <span>Used: {fmtBytes(data.memory?.used)}</span>
                <span>Total: {fmtBytes(data.memory?.total)}</span>
              </div>
            </div>
          </div>

          {/* ── GPU details ────────────────────────────────────────── */}
          {data.gpus?.length > 0 && (
            <div className="card space-y-4">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <FiZap size={14}/> GPU{data.gpus.length > 1 ? 's' : ''}
              </h2>
              {data.gpus.map((g, i) => (
                <div key={i} className={i > 0 ? 'pt-4 border-t border-white/5' : ''}>
                  <p className="text-sm text-white font-medium mb-3">{g.name}</p>
                  <div className="space-y-3">
                    {g.temp != null && (
                      <MetricBar label="Temperature" value={g.temp} max={100} unit="°C"
                                 status={g.status} icon={FiThermometer}/>
                    )}
                    {g.utilizationGpu != null && (
                      <MetricBar label="GPU Load" value={g.utilizationGpu} max={100} unit="%"
                                 status={g.utilizationGpu > 90 ? 'hot' : 'warm'} icon={FiActivity}/>
                    )}
                    {g.memTotal > 0 && (
                      <MetricBar
                        label="VRAM"
                        value={Math.round((g.memUsed / g.memTotal) * 100)}
                        max={100} unit="%"
                        status="warm" icon={FiDatabase}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Battery ────────────────────────────────────────────── */}
          {data.battery?.hasBattery && (
            <div className="card">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <FiBattery size={14}/> Battery
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <MetricBar
                    label={data.battery.isCharging ? 'Charging…' : 'Discharge'}
                    value={data.battery.percent}
                    max={100} unit="%"
                    status={data.battery.percent < 10 ? 'critical' : data.battery.percent < 25 ? 'hot' : 'cool'}
                    icon={FiBattery}
                  />
                </div>
                {data.battery.timeRemaining != null && data.battery.timeRemaining > 0 && (
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-gray-500">Remaining</p>
                    <p className="text-sm font-semibold text-white">
                      {Math.floor(data.battery.timeRemaining / 60)}h {data.battery.timeRemaining % 60}m
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      ) : null}
    </div>
  );
}
