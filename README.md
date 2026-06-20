# NODE JS TASK (TypeScript + Express + MongoDB)



Features
- Register, login, refresh-token endpoints
- Access token (1 minute) and refresh token (7 days)
- Password hashing with `bcrypt`
- Refresh token rotation and revocation (stored per-user in MongoDB)
- Protected test route and auth middleware

Quick start
1. Copy `.env.example` to `.env` and set values:

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/jwt_refresh_demo
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
```

2. Install dependencies

```bash
npm install
```

3. Start MongoDB (local service or Docker)

```bash
# Docker (optional)
docker run -p 27017:27017 -d --name mongo mongo:6.0
```

4. Start dev server (hot reload)

```bash
npm run start
```

5. Run automated verification (register → login → protected → refresh → logout)

```bash
node test-auth.mjs
# or
npm run test:auth
```

API Endpoints

Base URL: `http://localhost:4000`

- `POST /api/auth/register` — create a user
  - Body: `{ "email": "alice@example.com", "password": "secret" }`

- `POST /api/auth/login` — returns `accessToken` and `refreshToken`
  - Body: `{ "email": "...", "password": "..." }`

- `GET /api/auth/protected` — protected test route
  - Header: `Authorization: Bearer <ACCESS_TOKEN>`

- `POST /api/auth/refresh-token` — rotate refresh token and get new access token
  - Body: `{ "refreshToken": "<REFRESH_TOKEN>" }`

- `POST /api/auth/logout` — revoke a refresh token
  - Body: `{ "refreshToken": "<REFRESH_TOKEN>" }`

Examples (PowerShell / curl)

PowerShell (recommended on Windows):

```powershell
Invoke-RestMethod -Method Post -Uri 'http://localhost:4000/api/auth/register' -ContentType 'application/json' -Body (@{ email='alice@example.com'; password='secret' } | ConvertTo-Json)
```

curl (Windows PowerShell - call `curl.exe`):

```powershell
curl.exe -X POST "http://localhost:4000/api/auth/register" -H "Content-Type: application/json" -d '{"email":"alice@example.com","password":"secret"}'
```

Or use the included test script to avoid quoting issues:

```bash
node test-auth.mjs
```

Important files

- `src/controllers/authController.ts` — authentication logic
- `src/utils/jwt.ts` — access/refresh token helpers
- `src/models/User.ts` — user schema (stores refresh tokens)
- `src/routes/auth.ts` — route definitions
- `src/middleware/auth.ts` — `requireAuth` middleware
- `scripts/test-auth.mjs` — integration test script

NPM scripts

- `npm run start` — dev server (ts-node-dev)
- `npm run build` — TypeScript build
- `npm run start:prod` — run compiled build
- `npm run test:auth` — run auth test script



