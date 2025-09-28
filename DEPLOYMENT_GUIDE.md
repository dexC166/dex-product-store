## 🚀 Deployment Guide: Vercel (Frontend) + Fly.io (Backend)

This guide walks you through deploying Dex-Product-Store using:

- **Frontend**: Vercel
- **Backend**: Fly.io (Docker)
- **Database**: Neon/PostgreSQL
- **Rate limiting & shield**: Arcjet

---

## 📋 Prerequisites

1. GitHub account (code pushed to a repo)
2. Vercel account (`https://vercel.com`)
3. Fly.io account (`https://fly.io`)
4. Neon (PostgreSQL) account (`https://neon.tech`) or an equivalent hosted Postgres
5. Arcjet account/key (`https://arcjet.com`) – used by the backend middleware

---

## 📁 Required Files (already in this repo)

- `backend/fly.toml` – Fly.io app configuration
- `backend/Dockerfile` – Container build for Fly.io
- `frontend/vercel.json` – Vercel rewrites to your Fly backend

Important:

- If your backend file is named `DockerFile` (uppercase F), rename it to `Dockerfile`. Fly looks for `Dockerfile` by default.
- Ensure a health endpoint exists at `/health` (see Step 1.4.1) since both the Docker healthcheck and Fly check use it.

---

## 🔧 Step 1: Deploy Backend to Fly.io

### 1.1 Install Fly CLI

```bash
# Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex

# macOS / Linux
curl -L https://fly.io/install.sh | sh
```

You can verify with:

```bash
fly version
```

### 1.2 Login to Fly.io

```bash
fly auth login
```

Check you’re logged in:

```bash
fly auth whoami
```

### 1.3 Navigate to Backend Directory

```bash
cd backend
```

### 1.4 Prepare Backend

#### 1.4.1 Add a health check route (required)

Your Dockerfile and `fly.toml` expect `GET /health` to return 200. Add this to `backend/server.js` before the `app.listen` call if it isn’t there yet:

```javascript
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});
```

#### 1.4.2 Ensure Dockerfile exists and is correctly named

- File should be `backend/Dockerfile` (not `DockerFile`).
- Add a `backend/.dockerignore` (e.g., `node_modules`, `.env`, `.git`, `*.log`, `README.md`) to shrink build context.
- The Dockerfile should expose port 8080 and use the `/health` endpoint. Example (matches this repo):

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

CMD ["npm", "start"]
```

#### 1.4.3 Verify Fly config (`backend/fly.toml`)

This repo includes a ready `fly.toml`. If you plan to use a different app name, adjust `app = "YOUR-APP-NAME-backend"`.

Recommended shape:

```toml
app = "dex-product-store-backend"
primary_region = "iad"

[env]
  PORT = "8080"

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0
  processes = ["app"]

[[http_service.checks]]
  grace_period = "10s"
  interval = "30s"
  method = "GET"
  timeout = "5s"
  path = "/health"

[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 512
```

### 1.5 Create the Fly app (one-time)

If you haven’t created the app yet:

```bash
fly apps create dex-product-store-backend
```

Use a unique name if the above is taken (remember to update `fly.toml` and `frontend/vercel.json` if you change it).
Note: Fly looks for `Dockerfile` by default. If you must keep the alternate name, set it under `[build]` with `dockerfile = "DockerFile"`.

### 1.6 Set Environment Variables (as Fly secrets)

Required for this project:

- `PGHOST`=Neon host
- `PGDATABASE`=Neon database
- `PGUSER`=Neon user
- `PGPASSWORD`=Neon password
- `ARCJET_KEY`=Arcjet API key
- `PORT`=8080
- `NODE_ENV`=production

Set them on Fly:

```bash
fly secrets set PGHOST="your_neon_host"
fly secrets set PGDATABASE="your_db"
fly secrets set PGUSER="your_user"
fly secrets set PGPASSWORD="your_password"
fly secrets set ARCJET_KEY="your_arcjet_key"
fly secrets set PORT="8080"
fly secrets set NODE_ENV="production"
```

Tip: For Neon, your URL typically looks like `postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require`. This repo builds that from the variables you supply.

### 1.7 Deploy to Fly.io

```bash
fly deploy
```

Windows PATH issue? Either:

```bash
# Immediate workaround
C:\Users\YourUsername\.fly\bin\fly.exe deploy

# Or fix PATH permanently by adding C:\Users\YourUsername\.fly\bin, restart PC, then use:
fly deploy
```

### 1.8 Verify deployment

```bash
fly status
fly logs
```

If you updated secrets after deploy, restart the machine so the running container receives them:

```bash
fly status                 # get machine ID
fly machine restart ID
fly deploy                 # redeploy to ensure all changes are applied
fly status
fly logs
```

Your backend URL will be:

```
`https://your-app-name-backend.fly.dev
```

### 1.9 Test API endpoints

Browser or curl:

```bash
# Health
curl https://your-app-name-backend.fly.dev/health

# Products
curl https://your-app-name-backend.fly.dev/api/products
```

Expected:

- `/health` → `{ "status": "OK", "timestamp": "..." }`
- `/api/products` → array of products (may be empty initially)

### 1.10 (Optional) Seed the database

You can seed Neon directly from your local machine (using your local `.env`):

```bash
# at project root
cp .env.example .env   # if you keep one; otherwise create .env
# Fill in PGHOST/PGDATABASE/PGUSER/PGPASSWORD locally

node backend/seeds/products.js
```

This script truncates and inserts sample products using your Neon credentials.

---

## 🌐 Step 2: Deploy Frontend to Vercel

### 2.1 Push to GitHub

Ensure the project is committed and pushed to GitHub.

### 2.2 Create a Vercel project

1. Go to `https://vercel.com` → New Project
2. Import your GitHub repo
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. No frontend env vars are required for production because we use Vercel rewrites.

### 2.3 Verify Vercel rewrites (`frontend/vercel.json`)

This repo already includes rewrites that forward `/api/*` to your Fly backend:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-app-name-backend.fly.dev/api/$1"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [{ "key": "Access-Control-Allow-Origin", "value": "*" }]
    }
  ]
}
```

If you used a different Fly app name, update the `destination` domain accordingly.

### 2.4 Deploy

Click Deploy in Vercel. On success, your frontend URL will be something like:

```
https://your-project-name.vercel.app
```

### 2.5 Production behavior

The frontend uses a dynamic base URL in `frontend/src/store/useProductStore.js`:

- Development: `http://localhost:3000` (your local backend)
- Production: `""` (same origin) → resolved via Vercel `rewrites` to your Fly backend

No additional `VITE_API_URL` is required for production.

---

## 🔗 End-to-end test

1. Visit your Vercel frontend URL
2. Products should load from Fly backend
3. Test create/update/delete product
4. Check Fly logs if any API call fails: `fly logs`

---

## 🚨 Troubleshooting

- **Dockerfile name**: Must be `Dockerfile` (case-sensitive). If you must keep `DockerFile`, set `[build] dockerfile = "DockerFile"` in `fly.toml`.
- **Missing health endpoint**: Add `GET /health` in `backend/server.js` (see Step 1.4.1).
- **Arcjet warnings on /health**: Scope Arcjet to API only. In `backend/server.js` use `app.use('/api', arcjetMiddleware)` instead of global.
- **Windows PATH (fly not found)**:
  - Immediate: `C:\\Users\\YourUsername\\.fly\\bin\\fly.exe deploy`
  - Fix: add `C:\\Users\\YourUsername\\.fly\\bin` to PATH, reboot, use `fly deploy`
- **Secrets not applied**: After `fly secrets set ...`, restart machine and redeploy.
- **Neon connection issues**: Verify `PGHOST/PGDATABASE/PGUSER/PGPASSWORD`. Ensure SSL is required (this repo adds `?sslmode=require`).
- **429 Too Many Requests**: Arcjet rate limiter is active. For initial testing, reduce request bursts or adjust Arcjet rules if needed.
- **CORS**: Backend uses permissive `cors()` by default. If you later restrict origins, add your Vercel domain.
- **Common typo**: If the server crashes on start with an import error for `express`, confirm `backend/routes/productRoutes.js` imports `express` correctly.
- **Auto-stop shows "stopped"**: Expected when idle with `min_machines_running = 0`. It auto-starts on the next request.

---

## 📚 Useful Fly.io commands

```bash
fly logs                    # view logs
fly status                  # app status
fly secrets list            # list secrets
fly machine restart ID      # restart a machine
fly scale count 1           # scale to 1 instance (free tier)
```

---

## 🎉 Done!

- **Frontend** (Vercel): your Vercel project URL
- **Backend** (Fly): `https://your-app-name-backend.fly.dev`

Push to GitHub to trigger Vercel redeploys. Re-run `fly deploy` when you update backend code or configuration.
