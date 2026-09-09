# ProcureAI — Frontend Dashboard & Management Portal

Modern, responsive frontend portal for the ProcureAI Intelligent Procurement & Queue Optimization System. Built with **React 18**, **Vite**, **Lucide Icons**, and custom design system.

---

## Features
- **Live Network Overview**: Real-time procurement centre metrics, utilization rates, and operational status.
- **Smart Queue & Allocation**: AI-assisted scheduling and slot allocation recommendations based on farmer travel distance and centre congestion.
- **Farmer Registration & Management**: Rapid onboarding with dynamic attendance probability scoring and vehicle categorization.
- **Weather & Climate Advisory**: Live microclimate and precipitation monitoring for agricultural logistics.
- **Dark/Light Theme & Glassmorphism**: Tailored high-contrast accessibility interface.

---

## Tech Stack
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Vanilla CSS with custom tokens & glassmorphic UI components
- **Icons**: Lucide React
- **HTTP Client**: Axios with centralized error handling

---

## Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Set `VITE_API_URL` to your backend server URL (e.g., `http://localhost:5000`).

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## Deploying on Vercel

1. Import this repository into [Vercel](https://vercel.com).
2. Framework Preset: **Vite** (auto-detected).
3. Root Directory: `./` (leave default).
4. Environment Variables:
   - **`VITE_API_URL`**: Your deployed backend URL (e.g. `https://vercel-backend-xxx.vercel.app`).
5. Click **Deploy**.

