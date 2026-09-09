import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import RecommendationPage from './pages/RecommendationPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { Sprout, ShieldCheck } from 'lucide-react';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#0b1315] text-slate-100 selection:bg-emerald-500 selection:text-white">
        {/* Navigation */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/recommendation" element={<RecommendationPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/80 bg-slate-950/80 mt-16 text-xs text-slate-400">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Sprout className="w-4 h-4" />
              </div>
              <span className="font-bold text-white font-display">
                Procure<span className="text-emerald-400">AI</span>
              </span>
              <span className="text-slate-600">|</span>
              <span>AI Smart Agricultural Procurement Orchestrator</span>
            </div>

            <div className="flex items-center gap-6">
              <Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link>
              <Link to="/register" className="hover:text-emerald-400 transition-colors">Farmer Registration</Link>
              <Link to="/recommendation" className="hover:text-emerald-400 transition-colors">AI Centre Match</Link>
              <Link to="/admin" className="hover:text-emerald-400 transition-colors">Government Portal</Link>
            </div>

            <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Render & Vercel Ready</span>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
