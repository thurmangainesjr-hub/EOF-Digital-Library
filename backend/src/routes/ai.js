/**
 * AI Agent Routes
 *
 * Provides AI-powered assistant functionality using Claude API
 * Agents: Sage (Librarian), Aurora (Story Time Host), Prism (Adaptation Specialist)
 */

import express from 'express';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Agent personalities and system prompts
const AGENTS = {
  librarian: {
    name: 'Sage',
    role: 'Library Assistant',
    emoji: '📚',
    color: '#3b82f6',
    systemPrompt: `You are Sage, a knowledgeable and helpful digital librarian at EOF Digital Library.
Your personality is warm, scholarly, and enthusiastic about books and literature.

Your capabilities:
- Help users discover books based on their interests
- Provide book recommendations across genres
- Explain literary concepts, themes, and historical context
- Answer questions about authors and their works
- Guide users through the library features
- Suggest books similar to ones they've enjoyed

Style guidelines:
- Be conversational but informative
- Show genuine enthusiasm for literature
- Use book metaphors occasionally
- Keep responses concise but helpful
- Recommend specific titles when appropriate
- Reference public domain classics when relevant

Remember you're part of EOF Digital Library which integrates with Griot AI for book adaptations.`
  },

  storyteller: {
    name: 'Aurora',
    role: 'Story Time Host',
    emoji: '🎭',
    color: '#ec4899',
    systemPrompt: `You are Aurora, the enchanting Story Time host at EOF Digital Library.
Your personality is theatrical, expressive, and captivating - like a master storyteller by the fireside.

Your capabilities:
- Recommend audiobooks and video readings
- Discuss narration techniques and voice acting
- Help users find story time content for different moods
- Share interesting facts about storytelling traditions
- Suggest books perfect for audio adaptation
- Guide users through the Story Time features

Style guidelines:
- Be dramatic and engaging, but not over the top
- Use vivid language that evokes imagery
- Share your passion for the spoken word
- Occasionally quote famous literary passages
- Be encouraging about users' reading journeys
- Create a cozy, inviting atmosphere

You're the host of VOD and live reading sessions at EOF Digital Library.`
  },

  adapter: {
    name: 'Prism',
    role: 'Adaptation Specialist',
    emoji: '✨',
    color: '#8b5cf6',
    systemPrompt: `You are Prism, the creative adaptation specialist at EOF Digital Library.
Your personality is innovative, artistic, and technically knowledgeable about media adaptation.

Your capabilities:
- Advise on adapting books to different formats (audiobook, screenplay, game narrative)
- Explain the Griot AI adaptation tools
- Discuss adaptation techniques and best practices
- Help users understand public domain rights
- Suggest which books work best for different adaptations
- Guide users through the adaptation workflow

Style guidelines:
- Be creative and inspiring
- Balance artistic vision with practical advice
- Show knowledge of multiple media formats
- Be encouraging about users' creative projects
- Use examples from successful adaptations
- Connect literary elements to their adaptable potential

You help users transform books using Griot AI integration.`
  }
};

// Anthropic API configuration
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const CLAUDE_MODEL = 'claude-3-haiku-20240307'; // Using Haiku for fast, cost-effective responses

// Check if Claude API is configured
const isClaudeConfigured = ANTHROPIC_API_KEY && !ANTHROPIC_API_KEY.includes('placeholder');

// Get AI configuration status
router.get('/status', (req, res) => {
  res.json({
    success: true,
    data: {
      isConfigured: isClaudeConfigured,
      model: CLAUDE_MODEL,
      agents: Object.keys(AGENTS),
      instructions: !isClaudeConfigured ? {
        steps: [
          {
            step: 1,
            title: 'Get Anthropic API Key',
            description: 'Go to https://console.anthropic.com and create an account'
          },
          {
            step: 2,
            title: 'Generate API Key',
            description: 'Navigate to API Keys section and create a new key'
          },
          {
            step: 3,
            title: 'Update .env File',
            description: 'Add your key to backend/.env',
            example: 'ANTHROPIC_API_KEY=sk-ant-api03-...'
          },
          {
            step: 4,
            title: 'Restart Server',
            description: 'Restart the backend server to load the new key'
          }
        ],
        note: 'The AI agents work in fallback mode without an API key, providing pre-written responses.'
      } : null
    }
  });
});

// Get agent info
router.get('/agents', (req, res) => {
  const agentList = Object.entries(AGENTS).map(([id, agent]) => ({
    id,
    name: agent.name,
    role: agent.role,
    emoji: agent.emoji,
    color: agent.color
  }));

  res.json({
    success: true,
    data: {
      agents: agentList,
      isConfigured: isClaudeConfigured
    }
  });
});

// Get specific agent info
router.get('/agents/:agentId', (req, res) => {
  const { agentId } = req.params;
  const agent = AGENTS[agentId];

  if (!agent) {
    return res.status(404).json({
      success: false,
      error: 'Agent not found'
    });
  }

  res.json({
    success: true,
    data: {
      id: agentId,
      name: agent.name,
      role: agent.role,
      emoji: agent.emoji,
      color: agent.color
    }
  });
});

// Chat with an agent
router.post('/chat', optionalAuth, async (req, res) => {
  try {
    const { agentType, message, conversationHistory = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    const agent = AGENTS[agentType] || AGENTS.librarian;

    // If Claude is not configured, use fallback responses
    if (!isClaudeConfigured) {
      const fallbackResponse = getFallbackResponse(agentType, message);
      return res.json({
        success: true,
        data: {
          response: fallbackResponse,
          agent: {
            name: agent.name,
            role: agent.role,
            emoji: agent.emoji
          },
          isAI: false
        }
      });
    }

    // Build messages array for Claude
    const messages = [
      ...conversationHistory.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user',
        content: message
      }
    ];

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 1024,
        system: agent.systemPrompt,
        messages
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Claude API error:', error);
      throw new Error('Failed to get AI response');
    }

    const data = await response.json();
    const aiResponse = data.content[0]?.text || 'I apologize, I couldn\'t generate a response.';

    res.json({
      success: true,
      data: {
        response: aiResponse,
        agent: {
          name: agent.name,
          role: agent.role,
          emoji: agent.emoji
        },
        isAI: true,
        usage: data.usage
      }
    });
  } catch (error) {
    console.error('AI chat error:', error);

    // Return fallback response on error
    const agent = AGENTS[req.body.agentType] || AGENTS.librarian;
    const fallbackResponse = getFallbackResponse(req.body.agentType, req.body.message);

    res.json({
      success: true,
      data: {
        response: fallbackResponse,
        agent: {
          name: agent.name,
          role: agent.role,
          emoji: agent.emoji
        },
        isAI: false,
        fallback: true
      }
    });
  }
});

// Quick actions for agents
router.post('/quick-action', optionalAuth, async (req, res) => {
  try {
    const { agentType, action, context = {} } = req.body;

    const agent = AGENTS[agentType] || AGENTS.librarian;

    // Define quick action prompts
    const actionPrompts = {
      librarian: {
        'recommend': 'Recommend 3 books based on: ' + (context.query || 'popular classics'),
        'explain': 'Briefly explain this book/author: ' + (context.topic || 'Pride and Prejudice'),
        'similar': 'Suggest books similar to: ' + (context.book || 'a classic novel')
      },
      storyteller: {
        'suggest-audio': 'Recommend an audiobook for: ' + (context.mood || 'relaxing evening'),
        'narration-tips': 'Give a quick tip for enjoying audiobooks',
        'live-preview': 'Describe what to expect at a live reading session'
      },
      adapter: {
        'adaptation-ideas': 'Suggest adaptation ideas for: ' + (context.book || 'a classic novel'),
        'format-advice': 'Explain the best format to adapt: ' + (context.book || 'a novel') + ' into',
        'rights-info': 'Briefly explain public domain rights for adaptation'
      }
    };

    const prompt = actionPrompts[agentType]?.[action] || `Help with: ${action}`;

    // If Claude is not configured, use fallback
    if (!isClaudeConfigured) {
      const fallbackResponse = getQuickActionFallback(agentType, action, context);
      return res.json({
        success: true,
        data: {
          response: fallbackResponse,
          agent: {
            name: agent.name,
            role: agent.role,
            emoji: agent.emoji
          },
          isAI: false
        }
      });
    }

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 512,
        system: agent.systemPrompt + '\n\nBe concise - this is a quick action response.',
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get AI response');
    }

    const data = await response.json();
    const aiResponse = data.content[0]?.text || 'I apologize, I couldn\'t generate a response.';

    res.json({
      success: true,
      data: {
        response: aiResponse,
        agent: {
          name: agent.name,
          role: agent.role,
          emoji: agent.emoji
        },
        isAI: true
      }
    });
  } catch (error) {
    console.error('Quick action error:', error);

    const agent = AGENTS[req.body.agentType] || AGENTS.librarian;
    const fallbackResponse = getQuickActionFallback(req.body.agentType, req.body.action, req.body.context);

    res.json({
      success: true,
      data: {
        response: fallbackResponse,
        agent: {
          name: agent.name,
          role: agent.role,
          emoji: agent.emoji
        },
        isAI: false,
        fallback: true
      }
    });
  }
});

// Fallback responses when Claude API is not available
function getFallbackResponse(agentType, message) {
  const responses = {
    librarian: [
      "I'd be happy to help you explore our library! While I'm operating in limited mode, I can still guide you through our collection. Try browsing by genre or searching for specific titles.",
      "Welcome to EOF Digital Library! I'm Sage, your librarian assistant. Feel free to explore our public domain collection - you'll find classics from Jane Austen to H.G. Wells.",
      "Looking for a good read? Our Gutenberg collection has over 70,000 free books. Check out the Popular section to see what others are enjoying!",
      "Great question! I recommend starting with our featured classics - Pride and Prejudice, Frankenstein, and Dracula are timeless choices available for free."
    ],
    storyteller: [
      "Welcome to Story Time! I'm Aurora, your host for audiobooks and live readings. Check out our VOD library for recorded sessions, or join us live for an immersive experience!",
      "Looking for something to listen to? Our narrators bring classic stories to life with professional performances. Browse by mood or genre to find your perfect match.",
      "Story Time is all about the magic of spoken word. Whether you prefer dramatic readings or soothing narrations, we have something special for you.",
      "Let the stories come alive! Our live reading sessions are perfect for unwinding after a long day. Check the schedule to see what's coming up!"
    ],
    adapter: [
      "Ready to transform a book into something new? I'm Prism, and I help creators adapt public domain works into audiobooks, screenplays, and more through Griot AI.",
      "Adaptation is an art! The key is understanding what makes a story work in its original form, then reimagining it for a new medium.",
      "Public domain books are perfect for adaptation - no licensing fees! Consider how the pacing, dialogue, and visual elements might translate to your chosen format.",
      "Whether you're creating an audiobook or a screenplay, start by identifying the story's core emotional beats. Those are what you want to preserve and enhance."
    ]
  };

  const agentResponses = responses[agentType] || responses.librarian;
  return agentResponses[Math.floor(Math.random() * agentResponses.length)];
}

function getQuickActionFallback(agentType, action, context) {
  const fallbacks = {
    librarian: {
      'recommend': "I recommend starting with these classics: 'Pride and Prejudice' by Jane Austen for romance, 'Frankenstein' by Mary Shelley for gothic horror, and 'The Time Machine' by H.G. Wells for science fiction. All available free in our Gutenberg collection!",
      'explain': "Browse our library to learn more about specific books and authors. Each book page includes descriptions, themes, and historical context.",
      'similar': "Try using our search feature to find books in similar genres. You can also browse by topic in the Gutenberg section."
    },
    storyteller: {
      'suggest-audio': "For a relaxing experience, I recommend our dramatic readings of classic novels. Check the Story Time page for our curated VOD collection.",
      'narration-tips': "Find a comfortable spot, use good headphones, and let yourself be transported. The best audiobook experiences come when you can fully immerse yourself.",
      'live-preview': "Our live sessions feature professional narrators reading classics in real-time. You can chat with other listeners and even request favorite passages!"
    },
    adapter: {
      'adaptation-ideas': "Classic novels often work well as: audiobook narrations (great for dialogue-heavy works), screenplays (visual/dramatic stories), or podcast series (episodic tales).",
      'format-advice': "Consider the story's strengths: heavy dialogue suits audio, vivid settings suit visual media, and complex plots might work well as series.",
      'rights-info': "Public domain works (generally pre-1928 in the US) are free to adapt without permission or fees. Project Gutenberg books are all public domain!"
    }
  };

  return fallbacks[agentType]?.[action] || "I can help you with that! Please try the feature again or explore the library directly.";
}

export default router;
