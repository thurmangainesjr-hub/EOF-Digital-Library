import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import api from '../services/api';
import {
  FiCheck, FiX, FiAlertCircle, FiCreditCard, FiCpu,
  FiDatabase, FiServer, FiExternalLink, FiCopy, FiRefreshCw
} from 'react-icons/fi';

function Setup() {
  // Check all configurations
  const { data: stripeStatus, refetch: refetchStripe } = useQuery({
    queryKey: ['stripe-status'],
    queryFn: async () => {
      const res = await api.get('/stripe-setup/status');
      return res.data.data;
    }
  });

  const { data: aiStatus, refetch: refetchAI } = useQuery({
    queryKey: ['ai-status'],
    queryFn: async () => {
      const res = await api.get('/ai/status');
      return res.data.data;
    }
  });

  const { data: dbStatus, refetch: refetchDB } = useQuery({
    queryKey: ['db-status'],
    queryFn: async () => {
      const res = await api.get('/health/db');
      return res.data;
    }
  });

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const StatusBadge = ({ configured }) => (
    <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
      configured
        ? 'bg-green-500/20 text-green-400'
        : 'bg-yellow-500/20 text-yellow-400'
    }`}>
      {configured ? <FiCheck size={14} /> : <FiAlertCircle size={14} />}
      {configured ? 'Configured' : 'Not Configured'}
    </span>
  );

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-serif text-4xl text-white mb-2">System Setup</h1>
        <p className="text-gray-400">
          Configure your EOF Digital Library integrations
        </p>
      </motion.div>

      {/* Database Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <FiDatabase className="text-green-400" size={24} />
            </div>
            <div>
              <h2 className="text-xl text-white">Database</h2>
              <p className="text-gray-400 text-sm">SQLite local database</p>
            </div>
          </div>
          <StatusBadge configured={dbStatus?.status === 'ok'} />
        </div>
        <div className="bg-black/30 rounded-lg p-4">
          <p className="text-gray-300">
            {dbStatus?.status === 'ok'
              ? '✅ Database connected and working'
              : '❌ Database connection issue'}
          </p>
        </div>
      </motion.div>

      {/* Stripe Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <FiCreditCard className="text-purple-400" size={24} />
            </div>
            <div>
              <h2 className="text-xl text-white">Stripe Payments</h2>
              <p className="text-gray-400 text-sm">$5/month membership billing</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge configured={stripeStatus?.isConfigured} />
            <button
              onClick={() => refetchStripe()}
              className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white"
            >
              <FiRefreshCw size={16} />
            </button>
          </div>
        </div>

        {stripeStatus?.isConfigured ? (
          <div className="bg-black/30 rounded-lg p-4 space-y-2">
            <p className="text-green-400">✅ Stripe is configured and ready</p>
            {stripeStatus.isTestMode && (
              <p className="text-yellow-400">⚠️ Running in TEST mode</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-black/30 rounded-lg p-4">
              <p className="text-yellow-400 mb-2">⚠️ Demo mode active - Configure Stripe for real payments</p>
            </div>

            {stripeStatus?.instructions?.steps && (
              <div className="space-y-3">
                <h3 className="text-white font-medium">Setup Instructions:</h3>
                {stripeStatus.instructions.steps.map((step, i) => (
                  <div key={i} className="bg-black/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-purple-500 text-white text-sm flex items-center justify-center flex-shrink-0">
                        {step.step}
                      </span>
                      <div>
                        <h4 className="text-white font-medium">{step.title}</h4>
                        <p className="text-gray-400 text-sm">{step.description}</p>
                        {step.example && (
                          <div className="mt-2 bg-black/30 rounded p-2 flex items-center justify-between">
                            <code className="text-green-400 text-xs">{step.example}</code>
                            <button
                              onClick={() => copyToClipboard(step.example)}
                              className="p-1 text-gray-400 hover:text-white"
                            >
                              <FiCopy size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <a
              href="https://dashboard.stripe.com/test/apikeys"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-flex items-center gap-2"
            >
              <FiExternalLink /> Open Stripe Dashboard
            </a>
          </div>
        )}
      </motion.div>

      {/* Claude AI Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <FiCpu className="text-blue-400" size={24} />
            </div>
            <div>
              <h2 className="text-xl text-white">Claude AI</h2>
              <p className="text-gray-400 text-sm">AI Agents powered by Anthropic</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge configured={aiStatus?.isConfigured} />
            <button
              onClick={() => refetchAI()}
              className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white"
            >
              <FiRefreshCw size={16} />
            </button>
          </div>
        </div>

        {aiStatus?.isConfigured ? (
          <div className="bg-black/30 rounded-lg p-4 space-y-2">
            <p className="text-green-400">✅ Claude AI is configured</p>
            <p className="text-gray-400 text-sm">Model: {aiStatus.model}</p>
            <p className="text-gray-400 text-sm">Agents: {aiStatus.agents?.join(', ')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-black/30 rounded-lg p-4">
              <p className="text-yellow-400 mb-2">⚠️ Fallback mode active - Configure Claude for AI responses</p>
              <p className="text-gray-400 text-sm">AI agents work with pre-written responses until configured</p>
            </div>

            {aiStatus?.instructions?.steps && (
              <div className="space-y-3">
                <h3 className="text-white font-medium">Setup Instructions:</h3>
                {aiStatus.instructions.steps.map((step, i) => (
                  <div key={i} className="bg-black/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-500 text-white text-sm flex items-center justify-center flex-shrink-0">
                        {step.step}
                      </span>
                      <div>
                        <h4 className="text-white font-medium">{step.title}</h4>
                        <p className="text-gray-400 text-sm">{step.description}</p>
                        {step.example && (
                          <div className="mt-2 bg-black/30 rounded p-2 flex items-center justify-between">
                            <code className="text-green-400 text-xs">{step.example}</code>
                            <button
                              onClick={() => copyToClipboard(step.example)}
                              className="p-1 text-gray-400 hover:text-white"
                            >
                              <FiCopy size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <a
              href="https://console.anthropic.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-flex items-center gap-2"
            >
              <FiExternalLink /> Open Anthropic Console
            </a>
          </div>
        )}
      </motion.div>

      {/* Griot AI Integration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <FiServer className="text-yellow-400" size={24} />
            </div>
            <div>
              <h2 className="text-xl text-white">Griot AI Integration</h2>
              <p className="text-gray-400 text-sm">Book adaptation engine</p>
            </div>
          </div>
          <StatusBadge configured={false} />
        </div>

        <div className="bg-black/30 rounded-lg p-4">
          <p className="text-yellow-400 mb-2">⚠️ Requires Griot AI backend to be running</p>
          <p className="text-gray-400 text-sm mb-4">
            Griot AI should be running at http://localhost:3001 for book adaptations to work.
          </p>
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex items-center gap-2"
          >
            <FiExternalLink /> Open Griot AI Studio
          </a>
        </div>
      </motion.div>

      {/* Environment File Template */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card mt-6"
      >
        <h2 className="text-xl text-white mb-4">Environment Template</h2>
        <p className="text-gray-400 text-sm mb-4">
          Copy this template to your <code className="text-yellow-400">backend/.env</code> file:
        </p>
        <div className="bg-black/50 rounded-lg p-4 relative">
          <button
            onClick={() => copyToClipboard(envTemplate)}
            className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white"
          >
            <FiCopy size={16} />
          </button>
          <pre className="text-green-400 text-sm overflow-x-auto">{envTemplate}</pre>
        </div>
      </motion.div>
    </div>
  );
}

const envTemplate = `# Database
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET=your-jwt-secret-min-32-chars-long
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars

# Stripe (https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Anthropic Claude (https://console.anthropic.com)
ANTHROPIC_API_KEY=sk-ant-api03-...

# Griot AI
GRIOT_API_URL=http://localhost:3001
GRIOT_API_KEY=your-griot-api-key

# Frontend
FRONTEND_URL=http://localhost:5174

# Server
PORT=3002
NODE_ENV=development`;

export default Setup;
