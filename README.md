# Baitullah Safar — Full Stack Travel Agency Website (MERN)

Hajj, Umrah & Tour package booking website with admin panel — built with MongoDB, Express, React (Vite), Node.js.

## Project Structure

```
baitullahsafar/
├── server/      # Express + MongoDB API
└── client/      # React (Vite) frontend + Admin Panel
```

## 1. Backend Setup (server)

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env`:
- `MONGO_URI` — your MongoDB connection string (local or Atlas)
- `JWT_SECRET` — set a long random string
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — credentials for the seeded admin account
- `CLIENT_URL` — frontend URL (default `http://localhost:5173`)

Seed the admin user + sample packages:

```bash
npm run seed
```

This prints the admin login email/password (from `.env`) — use this to log into `/admin/login`.

Run the server:

```bash
npm run dev      # development (nodemon)
npm start        # production
```

API runs on `http://localhost:5000`.

## 2. Frontend Setup (client)

```bash
cd client
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`. Vite proxy forwards `/api` and `/uploads` to the backend (port 5000) — already configured in `vite.config.js`.

For production build:

```bash
npm run build
```

## 3. Pages & Features

**Public site:**
- Home — hero banners, recent offers, featured packages, airlines
- Packages — `/packages/hajj`, `/packages/umrah`, `/packages/tour` (filter + search)
- Package Details — `/package/:slug` — full info, itinerary, includes/excludes, booking inquiry form
- About, Contact

**Admin panel** (`/admin/login`):
- Dashboard — overview stats
- Manage Packages — add/edit/delete Hajj/Umrah/Tour packages with image upload, itinerary, includes/excludes
- Manage Bookings — view & update status of booking inquiries
- Manage Offers — homepage offer banners

## 4. Default Admin Login

After running `npm run seed`, login at `http://localhost:5173/admin/login` using the email/password set in `server/.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`).

**⚠️ Change the default admin password after first login (via Admin → Profile), and use a strong `JWT_SECRET` in production.**

## 5. Deployment Notes

- Set `CLIENT_URL` in server `.env` to your production frontend domain (for CORS). Multiple origins can be comma-separated.
- Frontend uses `VITE_API_URL` env var (e.g. `https://your-backend.onrender.com/api`) for the API base URL in production. Leave unset for local dev (Vite proxy handles it).
- Image URLs (`/uploads/...`) are auto-resolved against `VITE_API_URL`'s origin in production.
- Serve `/uploads` folder persistently (or move to cloud storage like S3/Cloudinary for production — Render free tier disk is ephemeral and resets on redeploy).
- Use MongoDB Atlas for production database.

## 6. Free Deployment (Vercel + Render + MongoDB Atlas)

**1. MongoDB Atlas**
- Create free M0 cluster at https://www.mongodb.com/cloud/atlas
- Create a database user, allow access from anywhere (0.0.0.0/0)
- Copy connection string → this is your `MONGO_URI`

**2. Backend → Render**
- Push this project to GitHub
- Render.com → New Web Service → connect repo, Root Directory: `server`
- Build Command: `npm install`, Start Command: `npm start`
- Add environment variables: `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CLIENT_URL`, `PORT`
- After deploy, run `npm run seed` once via Render Shell tab
- Note your backend URL, e.g. `https://baitullahsafar-api.onrender.com`

**3. Frontend → Vercel**
- Vercel.com → Add New Project → import repo, Root Directory: `client`
- Add environment variable: `VITE_API_URL = https://baitullahsafar-api.onrender.com/api`
- Deploy → get URL like `https://baitullahsafar.vercel.app`

**4. Connect them**
- Update `CLIENT_URL` in Render env vars to your Vercel URL, redeploy backend
- Visit `/admin/login` on the Vercel URL with your seeded admin credentials

**5. Custom domain later**
- Buy domain (Namecheap, Exonhost, etc.)
- In Vercel: Project Settings → Domains → add your domain, follow DNS instructions (A/CNAME records)
- Update `CLIENT_URL` (Render) and `VITE_API_URL` (Vercel) if domain changes
