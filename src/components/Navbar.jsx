import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sprout, 
  LayoutDashboard, 
  UserPlus, 
  Compass, 
  Activity,
  ShieldCheck
} from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { label: 'Overview', path: '/', icon: Activity },
    { label: 'Register Farmer', path: '/register', icon: UserPlus },
    { label: 'AI Centre Match', path: '/recommendation', icon: Compass },
    { label: 'Admin Dashboard', path: '/admin', icon: LayoutDashboard }
  ];

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-emerald-500/20 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sprout className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold font-display tracking-tight text-white">
                  Procure<span className="text-emerald-400">AI</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                  v2.4 Smart Mandi
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                AI Agricultural Procurement Orchestrator
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  id={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right Action & Status */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Orchestrator Online
            </div>

            <Link
              to="/register"
              id="cta-register-farmer-btn"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-600/30 hover:shadow-emerald-500/50 hover:from-emerald-400 hover:to-teal-500 transition-all active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>Book Slot</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Submenu */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800/80 py-2 px-2 bg-slate-950/90 text-xs">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 py-1 px-2 rounded-md ${
                isActive ? 'text-emerald-400 font-semibold' : 'text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
