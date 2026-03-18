# EOF Digital Library - API Reference

## Base URL
```
Production: https://api.eof-library.com
Development: http://localhost:3002
```

## Authentication
All authenticated endpoints require a Bearer token:
```
Authorization: Bearer <access_token>
```

## Rate Limits
- Anonymous: 30 req/min
- Authenticated: 100 req/min
- Creator: 200 req/min

---

## API Routes (40 Total)

### Authentication (6 routes)

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login and get tokens |
| POST | `/api/auth/refresh` | Public | Refresh access token |
| POST | `/api/auth/logout` | Auth | Logout and invalidate tokens |
| POST | `/api/auth/forgot-password` | Public | Request password reset |
| POST | `/api/auth/reset-password` | Public | Reset password with token |

### Users (4 routes)

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/users/me` | Auth | Get current user profile |
| PUT | `/api/users/me` | Auth | Update current user |
| PUT | `/api/users/me/password` | Auth | Change password |
| DELETE | `/api/users/me` | Auth | Delete account |

### Memberships (5 routes)

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/memberships/me` | Auth | Get membership status |
| POST | `/api/memberships/subscribe` | Auth | Start subscription ($5/mo) |
| POST | `/api/memberships/cancel` | Member | Cancel subscription |
| POST | `/api/memberships/reactivate` | Auth | Reactivate canceled sub |
| POST | `/api/memberships/webhook` | Stripe | Handle Stripe webhooks |

### Creator Profiles (5 routes)

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/creators` | Public | List verified creators |
| GET | `/api/creators/:id` | Public | Get creator profile |
| POST | `/api/creators/profile` | Creator | Create creator profile |
| PUT | `/api/creators/profile` | Creator | Update creator profile |
| GET | `/api/creators/earnings` | Creator | Get earnings summary |

### Products (8 routes)

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/products` | Public | List/search products |
| GET | `/api/products/:slug` | Public | Get product by slug |
| POST | `/api/products` | Creator | Create new product |
| PUT | `/api/products/:id` | Creator | Update product |
| DELETE | `/api/products/:id` | Creator | Delete product |
| POST | `/api/products/:id/files` | Creator | Upload product file |
| GET | `/api/products/:id/download` | Member | Download product file |
| POST | `/api/products/:id/publish` | Creator | Submit for review |

### Genres (3 routes)

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/genres` | Public | List all genres |
| GET | `/api/genres/:slug` | Public | Get genre with products |
| POST | `/api/genres` | Admin | Create genre |

### Reading Sessions (4 routes)

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/reading/history` | Auth | Get reading history |
| GET | `/api/reading/:productId` | Auth | Get session for product |
| PUT | `/api/reading/:productId` | Auth | Update reading progress |
| POST | `/api/reading/:productId/bookmark` | Auth | Add bookmark |

### Bookshelves (5 routes)

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/bookshelves` | Auth | List user's bookshelves |
| POST | `/api/bookshelves` | Auth | Create bookshelf |
| PUT | `/api/bookshelves/:id` | Auth | Update bookshelf |
| DELETE | `/api/bookshelves/:id` | Auth | Delete bookshelf |
| POST | `/api/bookshelves/:id/items` | Auth | Add product to shelf |

### Adaptations - Griot AI (6 routes)

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/adaptations/preferences` | Auth | Get adaptation preferences |
| PUT | `/api/adaptations/preferences` | Auth | Update preferences |
| POST | `/api/adaptations/request` | Member | Request adaptation rights |
| GET | `/api/adaptations/requests` | Auth | List user's requests |
| PUT | `/api/adaptations/requests/:id` | Creator | Approve/deny request |
| POST | `/api/adaptations/export-to-griot` | Member | Export to Griot AI |

### Admin (4 routes)

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/products/pending` | Admin | Products awaiting review |
| PUT | `/api/admin/products/:id/review` | Admin | Review product |
| GET | `/api/admin/creators/pending` | Admin | Creators awaiting verify |
| PUT | `/api/admin/creators/:id/verify` | Admin | Verify creator |

---

## Request/Response Examples

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "READER"
    },
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

### Subscribe to Membership
```http
POST /api/memberships/subscribe
Authorization: Bearer <token>
Content-Type: application/json

{
  "paymentMethodId": "pm_..."
}
```

Response:
```json
{
  "success": true,
  "data": {
    "membership": {
      "tier": "MEMBER",
      "status": "ACTIVE",
      "currentPeriodEnd": "2024-02-15T00:00:00Z"
    },
    "subscriptionId": "sub_..."
  }
}
```

### Request Adaptation Rights
```http
POST /api/adaptations/request
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product-uuid",
  "targetFormat": "film",
  "notes": "Adapting for indie film production"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "request": {
      "id": "request-uuid",
      "status": "PENDING",
      "feeAmount": 50.00,
      "product": {
        "title": "The Great Adventure",
        "creator": "Author Name"
      }
    }
  }
}
```

### Export to Griot AI
```http
POST /api/adaptations/export-to-griot
Authorization: Bearer <token>
Content-Type: application/json

{
  "adaptationRequestId": "request-uuid",
  "griotProjectType": "film",
  "includeCharacters": true,
  "includeWorldBuilding": true
}
```

Response:
```json
{
  "success": true,
  "data": {
    "griotProjectId": "griot-project-uuid",
    "griotProjectUrl": "http://localhost:5173/project/griot-project-uuid",
    "exportedElements": {
      "characters": 5,
      "scenes": 24,
      "worldRules": 3
    }
  }
}
```

---

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": [
    { "field": "email", "message": "Invalid email format" }
  ]
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| UNAUTHORIZED | 401 | Missing or invalid token |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| VALIDATION_ERROR | 400 | Invalid input |
| MEMBERSHIP_REQUIRED | 403 | Membership needed |
| RATE_LIMITED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Server error |

---

## Webhooks

### Stripe Webhook Events
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`

### Griot AI Webhook Events (Outbound)
- `adaptation.exported`
- `adaptation.completed`
- `project.updated`
