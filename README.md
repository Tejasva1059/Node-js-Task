# JWT Refresh Token Demo (TypeScript + Express + MongoDB)

Features:
- POST /register — create user (email + password)
- POST /login — returns access token (1m) and refresh token (7d)
- POST /refresh-token — exchange refresh token for new tokens (rotating refresh tokens)

Quick start:
1. Copy `.env.example` to `.env` and set `MONGO_URI` and secrets.
2. Install dependencies:

```bash
npm install
```

3. Start dev server:

```bash
npm run start
```

Endpoints:
- `POST /api/auth/register` { email, password }
- `POST /api/auth/login` { email, password }
- `POST /api/auth/refresh-token` { refreshToken }

Notes:
- Access tokens expire in 1 minute.
- Refresh tokens expire in 7 days and are stored per-user in DB.

Examples (curl)

- Register:

```bash
curl -X POST http://localhost:4000/api/auth/register \
	-H "Content-Type: application/json" \
	-d '{"email":"alice@example.com","password":"secret"}'
```

- Login:

```bash
curl -X POST http://localhost:4000/api/auth/login \
	-H "Content-Type: application/json" \
	-d '{"email":"alice@example.com","password":"secret"}'
```

- Use access token to call protected route:

```bash
curl http://localhost:4000/api/auth/protected \
	-H "Authorization: Bearer <ACCESS_TOKEN>"
```

- Refresh tokens:

```bash
curl -X POST http://localhost:4000/api/auth/refresh-token \
	-H "Content-Type: application/json" \
	-d '{"refreshToken":"<REFRESH_TOKEN>"}'
```

- Logout (revoke refresh token):

```bash
curl -X POST http://localhost:4000/api/auth/logout \
	-H "Content-Type: application/json" \
	-d '{"refreshToken":"<REFRESH_TOKEN>"}'
```

