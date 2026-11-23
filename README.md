# Salon Queue Management System

**Live demo:** https://aurelia-salon-virid.vercel.app
**Hosted on:** React Vite (Frontend) + Express & MongoDB (Backend)

### Staff Credentials
| Role | Email | Password | Access |
|---|---|---|---|
| **Salon Owner (Admin)** | `admin@salon.demo` | `Admin@123` | Full access (`/admin`, `/reception`, `/barber`) |
| **Front Desk (Reception)** | `reception@salon.demo` | `Reception@123` | Walk-in registration & queue table (`/reception`) |
| **Stylist (Ravi Sharma)** | `ravi@salon.demo` | `Barber@123` | Chair 1 workstation (`/barber`) |
| **Stylist (Amit Patel)** | `amit@salon.demo` | `Barber@123` | Chair 2 workstation (`/barber`) |
| **Stylist (Imran Khan)** | `imran@salon.demo` | `Barber@123` | Chair 3 workstation (`/barber`) |

*(On the login page at `/login`, one-click demo preset tabs automatically fill these credentials).*

---

## 📖 Lab Documentation (Vibe Coding Lab Guide)

All required design documents specified in the **MSc IT Vibe Coding Lab TA Handout** are located in the `docs/` folder and root:

1. [docs/01-brief.md](docs/01-brief.md): Problem, Users, Must-Have Features (1–6), Don't-Build List, Look & Feel.
2. [docs/02-screens.md](docs/02-screens.md): Specifications for all 7 screens (Home, Join Queue, My Status, Reception, Barber View, Waiting Area TV, Owner Settings).
3. [docs/03-flows-rules.md](docs/03-flows-rules.md): Customer Flows (Remote & Walk-in), Plain-English Queue Rules, and 10-Item Test Checklist.
4. [AGENTS.md](AGENTS.md): Project overview, stack, commands, coding standards, and business invariants.
5. [prompts.md](prompts.md): Log of vibe coding prompts used to build the system.

---

## 🌟 Key Features

### 1. 📱 Customer Virtual Line
- **Phone Booking (`/join`)**: Pick 1 to 3 services with live duration & price tally. Choose any available barber or preferred stylist.
- **Live Status Tracker (`/track`)**: Live position countdown (`#2 in line`), wait countdown, 'Start coming to salon' warning, and full-screen gold ring when called.
- **Audio Chime**: Web Audio API multi-tone alert synthesized natively in the browser on token call.

### 2. 📺 Waiting Area TV Display (`/board`)
- Split-screen lobby TV dashboard:
  - **Now Serving**: Large gold token numbers per barber chair with animated border pulse on call.
  - **Up Next**: Top 5 waiting tokens with estimated wait times.
  - Digital clock, chime toggle, and fullscreen mode.

### 3. 🛎️ Receptionist Dashboard (`/reception`)
- **Quick Walk-In Entry**: Modal form to generate in-person tokens (`WALK_IN`).
- **Stylist Chairs Bar**: Shows live duty (`Available (Ready)`, `Busy (In Chair)`, `On Break`) and 'Call Next' button.
- **Queue Table**: Search and filter by All, Active, Waiting, Called, In-Chair, Done, No-Show.

### 4. ✂️ Barber Workstation (`/barber`)
- Displays current guest in chair with requested services.
- Stage action buttons: `[ Start Service ]` ➔ `[ Finish Service / Done ]`.
- Duty toggle: `[ Available ]` vs `[ On Break ]`.
- Preview of next waiting client in line.

### 5. 📊 Owner Settings & Analytics (`/admin`)
- Recharts daily revenue and status breakdown charts.
- Services menu catalog management (English + Gujarati names, pricing, durations).
- Salon operating hours, online cutoff minutes, and no-show grace period controls.

### 6. 🌐 Dual-Language Support
- Full bilingual toggle for **English** and **Gujarati (ગુજરાતી)** across all guest interfaces and menus.

---

## 🚀 Quick Run Guide

### 1. Install & Seed
```powershell
npm run install:all
npm run seed
```

### 2. Run Locally
In two separate terminals:
```powershell
# Terminal 1: Backend API & Socket.IO (Port 5000)
npm run dev:server

# Terminal 2: Frontend Vite Client (Port 5173)
npm run dev:client
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Run Tests & Build
```powershell
npm test
npm run build
```

---

## 🌐 Production Deployment Guide

### Architecture Overview
- **Frontend**: Hosted on [Vercel](https://vercel.com) (Global CDN for React Vite SPA).
- **Backend API & WebSockets**: Hosted on [Render](https://render.com) (Persistent Node.js + Socket.IO process).
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free tier M0 Cluster).

> **Why separate frontend and backend?**  
> Vercel's serverless functions are ephemeral and do not maintain persistent WebSockets. Because Aurelia Salon relies on real-time Socket.IO events for live queue countdowns, TV board updates, and audio chimes, the backend requires a persistent Node.js environment like Render or Railway.

---

### Step 1: Database (MongoDB Atlas)
1. Sign up or log into [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a **Free (M0)** shared cluster.
2. In **Database Access**, create a database user (e.g., `salon_admin`) with a secure password.
3. In **Network Access**, add IP `0.0.0.0/0` (allow access from anywhere so hosting providers can connect).
4. Click **Connect** ➔ **Drivers (Node.js)** to copy your connection string:
   ```
   mongodb+srv://salon_admin:<password>@cluster0.abcde.mongodb.net/salon_queue?retryWrites=true&w=majority
   ```

---

### Step 2: Backend API (Render)
1. Push your repository to GitHub.
2. Log into [Render](https://render.com) and click **New +** ➔ **Web Service**.
3. Connect your GitHub repository.
4. Fill in the service configuration:
   - **Name**: `salon-queue-api`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Under **Environment Variables**, add:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `MONGO_URI`: *(Your MongoDB Atlas connection URI)*
   - `JWT_SECRET`: *(A random secure string, e.g., `salon_jwt_production_secret_key_99`)*
   - `CLIENT_URL`: `https://<your-vercel-domain>.vercel.app` *(or `*` during initial deploy)*
6. Click **Deploy Web Service**.
7. Once deployed, open the Render **Shell** tab and run the initial database seed:
   ```bash
   node seeders/seed.js
   ```
   *(This populates initial admin, reception, barbers, and service catalog).*
8. Note down your backend URL: e.g. `https://salon-queue-api.onrender.com`.

---

### Step 3: Frontend (Vercel)
1. Log into [Vercel](https://vercel.com) and click **Add New...** ➔ **Project**.
2. Select your imported GitHub repository.
3. In the project setup screen:
   - **Option A (Recommended)**: Set **Root Directory** to `client`.
     - Framework Preset: `Vite` (auto-detected)
     - Build Command: `vite build`
     - Output Directory: `dist`
   - **Option B**: Leave Root Directory as `./` (Root `vercel.json` will execute build).
4. Expand **Environment Variables** and add:
   - `VITE_API_URL`: `https://salon-queue-api.onrender.com/api` *(Your Render backend URL + `/api`)*
   - `VITE_SOCKET_URL`: `https://salon-queue-api.onrender.com` *(Your Render backend URL)*
5. Click **Deploy**.
6. When deployment finishes, copy your live Vercel URL (e.g. `https://salon-queue.vercel.app`).
7. Update `CLIENT_URL` in your Render backend environment variables with your final Vercel domain to secure CORS.
