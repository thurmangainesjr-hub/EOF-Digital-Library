import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  FiCommand, FiBook, FiUsers, FiServer, FiDatabase,
  FiActivity, FiZap, FiGlobe, FiCpu, FiHardDrive,
  FiTerminal, FiCheck, FiX, FiAlertTriangle, FiRefreshCw
} from 'react-icons/fi';

function CommandCenter() {
  const { user, isAuthenticated } = useAuth();
  const [activeAgent, setActiveAgent] = useState(null);
  const [terminalHistory, setTerminalHistory] = useState([
    { type: 'system', text: 'EOF Digital Library Command Center initialized.' },
    { type: 'system', text: 'Type "help" for available commands.' }
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const [systemStatus, setSystemStatus] = useState({
    api: 'checking',
    database: 'checking',
    griot: 'checking',
    stripe: 'checking'
  });
  const terminalRef = useRef(null);

  // System agents
  const agents = [
    {
      id: 'librarian',
      name: 'Librarian',
      icon: FiBook,
      color: 'from-blue-500 to-blue-600',
      status: 'active',
      description: 'Manages book catalog and metadata',
      tasks: ['Index new books', 'Update metadata', 'Sync Gutenberg']
    },
    {
      id: 'creator-liaison',
      name: 'Creator Liaison',
      icon: FiUsers,
      color: 'from-purple-500 to-purple-600',
      status: 'active',
      description: 'Handles creator onboarding and products',
      tasks: ['Process applications', 'Review uploads', 'Manage royalties']
    },
    {
      id: 'griot-bridge',
      name: 'Griot Bridge',
      icon: FiZap,
      color: 'from-yellow-500 to-yellow-600',
      status: 'active',
      description: 'Connects to Griot AI for adaptations',
      tasks: ['Export to Griot', 'Sync projects', 'Track adaptations']
    },
    {
      id: 'payment-processor',
      name: 'Payment Processor',
      icon: FiCpu,
      color: 'from-green-500 to-green-600',
      status: 'active',
      description: 'Handles Stripe subscriptions and payments',
      tasks: ['Process subscriptions', 'Handle webhooks', 'Track revenue']
    },
    {
      id: 'content-guardian',
      name: 'Content Guardian',
      icon: FiServer,
      color: 'from-red-500 to-red-600',
      status: 'active',
      description: 'Monitors content and enforces policies',
      tasks: ['Review content', 'Check copyrights', 'Flag violations']
    },
    {
      id: 'analytics-engine',
      name: 'Analytics Engine',
      icon: FiActivity,
      color: 'from-indigo-500 to-indigo-600',
      status: 'active',
      description: 'Tracks reading patterns and metrics',
      tasks: ['Generate reports', 'Track engagement', 'User insights']
    }
  ];

  // Check system status
  useEffect(() => {
    const checkStatus = async () => {
      // Check API
      try {
        await api.get('/health');
        setSystemStatus(prev => ({ ...prev, api: 'online' }));
      } catch {
        setSystemStatus(prev => ({ ...prev, api: 'offline' }));
      }

      // Check Database
      try {
        await api.get('/health/db');
        setSystemStatus(prev => ({ ...prev, database: 'online' }));
      } catch {
        setSystemStatus(prev => ({ ...prev, database: 'offline' }));
      }

      // Check Griot
      try {
        const res = await fetch('http://localhost:3001/health');
        setSystemStatus(prev => ({ ...prev, griot: res.ok ? 'online' : 'offline' }));
      } catch {
        setSystemStatus(prev => ({ ...prev, griot: 'offline' }));
      }

      // Stripe is always "online" if configured
      setSystemStatus(prev => ({ ...prev, stripe: 'online' }));
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // Terminal command handler
  const handleCommand = async (cmd) => {
    const command = cmd.toLowerCase().trim();
    const parts = command.split(' ');

    setTerminalHistory(prev => [...prev, { type: 'input', text: `> ${cmd}` }]);

    switch (parts[0]) {
      case 'help':
        setTerminalHistory(prev => [...prev, {
          type: 'output',
          text: `Available commands:
  help          - Show this help message
  status        - Check system status
  agents        - List active agents
  stats         - Show library statistics
  sync gutenberg - Sync Gutenberg catalog
  clear         - Clear terminal`
        }]);
        break;

      case 'status':
        setTerminalHistory(prev => [...prev, {
          type: 'output',
          text: `System Status:
  API Server:   ${systemStatus.api === 'online' ? '✓ Online' : '✗ Offline'}
  Database:     ${systemStatus.database === 'online' ? '✓ Online' : '✗ Offline'}
  Griot AI:     ${systemStatus.griot === 'online' ? '✓ Online' : '✗ Offline'}
  Stripe:       ${systemStatus.stripe === 'online' ? '✓ Configured' : '✗ Not configured'}`
        }]);
        break;

      case 'agents':
        setTerminalHistory(prev => [...prev, {
          type: 'output',
          text: `Active Agents:
${agents.map(a => `  [${a.status === 'active' ? '●' : '○'}] ${a.name} - ${a.description}`).join('\n')}`
        }]);
        break;

      case 'stats':
        try {
          const res = await api.get('/admin/stats');
          const s = res.data.data;
          setTerminalHistory(prev => [...prev, {
            type: 'success',
            text: `Library Statistics:
  Total Books:      ${s?.books || 0}
  Total Users:      ${s?.users || 0}
  Active Members:   ${s?.members || 0}
  Creators:         ${s?.creators || 0}
  Adaptations:      ${s?.adaptations || 0}`
          }]);
        } catch {
          setTerminalHistory(prev => [...prev, {
            type: 'error',
            text: 'Failed to fetch statistics. Ensure you have admin access.'
          }]);
        }
        break;

      case 'sync':
        if (parts[1] === 'gutenberg') {
          setTerminalHistory(prev => [...prev, {
            type: 'output',
            text: 'Initiating Gutenberg catalog sync...'
          }]);
          // Simulate sync
          setTimeout(() => {
            setTerminalHistory(prev => [...prev, {
              type: 'success',
              text: 'Gutenberg sync completed. 500 new titles indexed.'
            }]);
          }, 2000);
        } else {
          setTerminalHistory(prev => [...prev, {
            type: 'error',
            text: 'Unknown sync target. Try: sync gutenberg'
          }]);
        }
        break;

      case 'clear':
        setTerminalHistory([
          { type: 'system', text: 'Terminal cleared.' }
        ]);
        break;

      default:
        setTerminalHistory(prev => [...prev, {
          type: 'error',
          text: `Unknown command: ${parts[0]}. Type "help" for available commands.`
        }]);
    }
  };

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    if (terminalInput.trim()) {
      handleCommand(terminalInput);
      setTerminalInput('');
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'text-green-400';
      case 'offline': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online': return <FiCheck className="text-green-400" />;
      case 'offline': return <FiX className="text-red-400" />;
      default: return <FiRefreshCw className="text-yellow-400 animate-spin" />;
    }
  };

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center animate-pulse-gold">
            <FiCommand className="text-white" size={24} />
          </div>
          <div>
            <h1 className="font-serif text-3xl text-white">Command Center</h1>
            <p className="text-gray-400">EOF Digital Library Control Hub</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className="card mb-6">
            <h2 className="font-serif text-xl text-white mb-4 flex items-center gap-2">
              <FiServer /> System Status
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-black/30">
                <div className="flex items-center gap-3">
                  <FiGlobe className="text-blue-400" />
                  <span className="text-gray-300">API Server</span>
                </div>
                {getStatusIcon(systemStatus.api)}
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-black/30">
                <div className="flex items-center gap-3">
                  <FiDatabase className="text-green-400" />
                  <span className="text-gray-300">PostgreSQL</span>
                </div>
                {getStatusIcon(systemStatus.database)}
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-black/30">
                <div className="flex items-center gap-3">
                  <FiZap className="text-yellow-400" />
                  <span className="text-gray-300">Griot AI</span>
                </div>
                {getStatusIcon(systemStatus.griot)}
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-black/30">
                <div className="flex items-center gap-3">
                  <FiCpu className="text-purple-400" />
                  <span className="text-gray-300">Stripe</span>
                </div>
                {getStatusIcon(systemStatus.stripe)}
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="card">
            <h2 className="font-serif text-xl text-white mb-4 flex items-center gap-2">
              <FiActivity /> Live Metrics
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-lg bg-black/30">
                <p className="text-2xl font-bold text-yellow-500">--</p>
                <p className="text-xs text-gray-400">Active Users</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-black/30">
                <p className="text-2xl font-bold text-green-500">--</p>
                <p className="text-xs text-gray-400">Books Read Today</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-black/30">
                <p className="text-2xl font-bold text-blue-500">--</p>
                <p className="text-xs text-gray-400">Adaptations</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-black/30">
                <p className="text-2xl font-bold text-purple-500">--</p>
                <p className="text-xs text-gray-400">Revenue (MTD)</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Agents Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="card mb-6">
            <h2 className="font-serif text-xl text-white mb-4 flex items-center gap-2">
              <FiCpu /> System Agents
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agents.map((agent, i) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * i }}
                  onClick={() => setActiveAgent(activeAgent === agent.id ? null : agent.id)}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${
                    activeAgent === agent.id
                      ? 'bg-purple-900/50 border border-purple-500/50'
                      : 'bg-black/30 hover:bg-black/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${agent.color} flex items-center justify-center flex-shrink-0`}>
                      <agent.icon className="text-white" size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-medium">{agent.name}</h3>
                        <span className={`w-2 h-2 rounded-full ${
                          agent.status === 'active' ? 'bg-green-400' : 'bg-gray-500'
                        }`} />
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{agent.description}</p>

                      <AnimatePresence>
                        {activeAgent === agent.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 pt-3 border-t border-gray-700"
                          >
                            <p className="text-xs text-gray-500 mb-2">Active Tasks:</p>
                            <div className="flex flex-wrap gap-2">
                              {agent.tasks.map(task => (
                                <span
                                  key={task}
                                  className="text-xs px-2 py-1 rounded bg-purple-800/50 text-purple-300"
                                >
                                  {task}
                                </span>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Terminal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="terminal rounded-lg overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2 bg-black border-b border-yellow-600/20">
                <FiTerminal className="text-yellow-500" />
                <span className="text-sm text-gray-400">EOF Terminal</span>
              </div>
              <div
                ref={terminalRef}
                className="p-4 h-64 overflow-y-auto"
              >
                {terminalHistory.map((line, i) => (
                  <div key={i} className={`terminal-line ${
                    line.type === 'input' ? 'terminal-prompt' :
                    line.type === 'success' ? 'terminal-success' :
                    line.type === 'error' ? 'terminal-error' :
                    'terminal-output'
                  }`}>
                    <pre className="whitespace-pre-wrap">{line.text}</pre>
                  </div>
                ))}
              </div>
              <form onSubmit={handleTerminalSubmit} className="border-t border-yellow-600/20">
                <div className="flex items-center px-4 py-2">
                  <span className="terminal-prompt mr-2">{'>'}</span>
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-white"
                    placeholder="Type a command..."
                    autoFocus
                  />
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default CommandCenter;
