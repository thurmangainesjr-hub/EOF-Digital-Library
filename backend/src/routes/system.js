/**
 * EOF Digital Library — System / Thermal Route
 * GET /api/system/thermal  → CPU, GPU, memory, battery temps & load
 */

import express from 'express';
import si from 'systeminformation';

const router = express.Router();

// Cache to avoid hammering sensors on every poll
let cache = null;
let cacheAt = 0;
const CACHE_MS = 3000; // refresh every 3 s

router.get('/thermal', async (req, res) => {
  try {
    const now = Date.now();
    if (cache && now - cacheAt < CACHE_MS) {
      return res.json({ success: true, data: cache });
    }

    // Fetch all metrics in parallel
    const [cpuTemp, cpuLoad, mem, battery, graphics, osInfo] = await Promise.all([
      si.cpuTemperature(),
      si.currentLoad(),
      si.mem(),
      si.battery(),
      si.graphics(),
      si.osInfo(),
    ]);

    // Normalise CPU temp — si returns main, cores[], max
    const cpu = {
      main:  cpuTemp.main  ?? null,
      max:   cpuTemp.max   ?? null,
      cores: (cpuTemp.cores ?? []).map((t, i) => ({ core: i, temp: t })),
      load:  Math.round(cpuLoad.currentLoad ?? 0),
    };

    // GPU(s)
    const gpus = (graphics.controllers ?? []).map(g => ({
      name:          g.model   ?? 'GPU',
      temp:          g.temperatureGpu ?? null,
      memUsed:       g.memoryUsed ?? null,
      memTotal:      g.memoryTotal ?? null,
      utilizationGpu: g.utilizationGpu ?? null,
    }));

    // Memory
    const memory = {
      total:    mem.total,
      used:     mem.used,
      free:     mem.free,
      usedPct:  Math.round((mem.used / mem.total) * 100),
    };

    // Battery
    const bat = {
      hasBattery: battery.hasBattery,
      percent:    battery.percent,
      isCharging: battery.isCharging,
      timeRemaining: battery.timeRemaining ?? null,
    };

    // Thermal status helpers
    const thermalStatus = (temp) => {
      if (temp == null) return 'unknown';
      if (temp < 50) return 'cool';
      if (temp < 70) return 'warm';
      if (temp < 85) return 'hot';
      return 'critical';
    };

    const data = {
      timestamp: now,
      os: { platform: osInfo.platform, distro: osInfo.distro, arch: osInfo.arch },
      cpu: { ...cpu, status: thermalStatus(cpu.main) },
      gpus: gpus.map(g => ({ ...g, status: thermalStatus(g.temp) })),
      memory,
      battery: bat,
    };

    cache  = data;
    cacheAt = now;

    res.json({ success: true, data });
  } catch (err) {
    console.error('[/system/thermal]', err.message);
    res.status(500).json({ success: false, error: 'Could not read system sensors.' });
  }
});

export default router;
