# EOF Digital Library

A premium digital library platform with creator rights management and Griot AI integration for content adaptation.

## Overview

EOF Digital Library is a comprehensive platform for:
- **Readers**: Access to curated digital content with $5/month membership
- **Creators**: Publish and manage adaptation rights for their works
- **Adaptation**: Seamless integration with Griot AI for content transformation

## Features

### MVP (Phase 1)
- User authentication and membership management
- $5/month Stripe subscription
- Product catalog with genre organization
- Reading sessions and bookshelf management
- Project Gutenberg public domain integration
- Creator profile and rights management

### Phase 2
- Advanced reading analytics
- Creator dashboard with earnings
- Adaptation request workflow
- External store connections
- Enhanced search and discovery

### Phase 3
- Griot AI direct integration
- Automated adaptation pipeline
- Creator collaboration tools
- White-label options
- API marketplace

## Tech Stack

- **Frontend**: React 18, Vite, TailwindCSS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL with Prisma ORM
- **Payments**: Stripe
- **Auth**: JWT with refresh tokens
- **AI Integration**: Griot AI API

## Project Structure

```
eof-digital-library/
├── frontend/           # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── context/
│   │   └── api/
│   └── package.json
├── backend/            # Express backend
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── utils/
│   ├── prisma/
│   └── package.json
├── docs/               # Documentation
│   ├── API.md
│   ├── DATABASE.md
│   └── LEGAL.md
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Stripe account

### Installation

```bash
# Clone the repository
git clone https://github.com/thurmangainesjr-hub/EOF-Digital-Library.git

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install

# Set up environment variables
cp .env.example .env

# Run database migrations
cd ../backend && npx prisma migrate dev

# Start development servers
npm run dev
```

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/eof_library

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret

# Stripe
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...

# Griot AI Integration
GRIOT_API_URL=http://localhost:3001
GRIOT_API_KEY=your-griot-key

# Frontend
VITE_API_URL=http://localhost:3002
```

## Membership Tiers

| Tier | Price | Features |
|------|-------|----------|
| Free | $0 | Browse catalog, Gutenberg access |
| Member | $5/mo | Full library access, bookshelf, reading history |
| Creator | $5/mo | Publishing tools, adaptation rights management |

## Griot AI Integration

EOF Digital Library connects with Griot AI for:
- Content adaptation to different formats (film, game, etc.)
- Character extraction and analysis
- World-building export
- Canon validation

## Legal

- [Creator Adaptation Rights Agreement](docs/LEGAL.md)
- [Project Gutenberg Compliance](docs/GUTENBERG.md)
- [Terms of Service](docs/TOS.md)
- [Privacy Policy](docs/PRIVACY.md)

## License

MIT License - See [LICENSE](LICENSE) for details.

## Links

- [Griot AI Repository](https://github.com/thurmangainesjr-hub/Griot-AI-Repository)
- [Documentation](docs/)
- [API Reference](docs/API.md)
