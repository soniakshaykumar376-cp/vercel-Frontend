import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  Compass, 
  LayoutDashboard, 
  Truck, 
  Tractor, 
  Scale, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  CloudSun, 
  ArrowRight,
  Sparkles,
  Users,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { getCentres, getDashboardStats } from '../api/client';
import WeatherWidget from '../components/WeatherWidget';

export default function HomePage() {
  const [centres, setCentres] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [centresRes, statsRes] = await Promise.all([
          getCentres(),
          getDashboardStats()
        ]);
        if (centresRes.data?.centres) setCentres(centresRes.data.centres);
        if (statsRes.data?.summary) setStats(statsRes.data.summary);
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="glow-emerald -top-20 -left-20"></div>
      <div className="glow-amber top-1/3 -right-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            AI Smart Procurement Orchestrator
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white leading-tight">
            Seamless Grain Procurement. <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
              Zero Yard Congestion.
            </span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            ProcureAI intelligently directs farmers to the optimal procurement centre, 
            predicts arrival no-shows, balances weighbridge queues, and shields harvests from adverse weather.
          </p>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/register"
              id="hero-register-farmer-btn"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 hover:shadow-emerald-500/50 hover:from-emerald-400 hover:to-teal-500 transition-all active:scale-95 flex items-center gap-2.5"
            >
              <Tractor className="w-5 h-5" />
              <span>Register Farmer & Get AI Recommendation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/admin"
              id="hero-admin-dashboard-btn"
              className="px-6 py-3.5 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-emerald-500/50 text-slate-200 font-semibold text-sm hover:bg-slate-800 transition-all flex items-center gap-2"
            >
              <LayoutDashboard className="w-5 h-5 text-emerald-400" />
              <span>Admin Government Portal</span>
            </Link>
          </div>
        </div>

        {/* Real-time Summary KPIs */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card glass-card-hover rounded-2xl p-4 sm:p-5">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Farmers Registered</span>
                <Users className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                {stats.totalFarmersRegistered}
              </div>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                Active mandi bookings today
              </span>
            </div>

            <div className="glass-card glass-card-hover rounded-2xl p-4 sm:p-5">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Vehicles Expected</span>
                <Truck className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                {stats.totalVehiclesExpected}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Tractors, trucks & trolleys
              </span>
            </div>

            <div className="glass-card glass-card-hover rounded-2xl p-4 sm:p-5">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Total Expected Produce</span>
                <Scale className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                {stats.totalQuintalsExpected.toLocaleString()}{' '}
                <span className="text-xs font-normal text-slate-400">Qtl</span>
              </div>
              <span className="text-[11px] text-amber-400 mt-1 block">
                ~{(stats.totalQuintalsExpected / 10).toFixed(0)} Metric Tonnes
              </span>
            </div>

            <div className={`rounded-2xl p-4 sm:p-5 border transition-all ${
              stats.overloadRiskPercent > 70 
                ? 'bg-amber-950/40 border-amber-500/40 text-amber-300' 
                : 'glass-card text-emerald-400'
            }`}>
              <div className="flex items-center justify-between text-xs mb-2 opacity-80">
                <span>Network Overload Risk</span>
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-display">
                {stats.overloadRiskPercent}%
              </div>
              <span className="text-[11px] opacity-90 mt-1 block font-medium">
                {stats.overloadRiskPercent > 70 ? 'High Congestion Alert' : 'Operational Equilibrium'}
              </span>
            </div>
          </div>
        )}

        {/* Live Weather Integration Card */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-white font-display flex items-center gap-2">
              <CloudSun className="w-5 h-5 text-amber-400" />
              Weather-Aware Operations
            </h2>
            <span className="text-xs text-slate-400">
              Automated advisory based on regional rainfall probabilities
            </span>
          </div>
          <WeatherWidget />
        </div>

        {/* Live Centres Real-time Status */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white font-display">
                Live Procurement Centre Status
              </h2>
              <p className="text-xs text-slate-400">
                Real-time capacity utilization, queue depth, and active weighbridges
              </p>
            </div>
            <Link
              to="/recommendation"
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
            >
              <span>Test AI Matcher</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {centres.map((centre) => {
              const isHigh = centre.capacity_percent >= 80;
              const isMod = centre.capacity_percent >= 50 && centre.capacity_percent < 80;
              return (
                <div
                  key={centre.id}
                  className={`rounded-2xl p-4 sm:p-5 border transition-all flex flex-col justify-between ${
                    isHigh
                      ? 'bg-red-950/20 border-red-500/40 hover:border-red-400'
                      : isMod
                      ? 'glass-card border-amber-500/30 hover:border-amber-400'
                      : 'glass-card border-emerald-500/25 hover:border-emerald-400'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {centre.id}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isHigh
                            ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                            : isMod
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}
                      >
                        {centre.status}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm sm:text-base text-white font-display mb-1">
                      {centre.name}
                    </h3>
                    <p className="text-xs text-slate-400 mb-3 line-clamp-1">{centre.location}</p>

                    {/* Capacity Bar */}
                    <div className="space-y-1 mb-3">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">Yard Capacity</span>
                        <span className="font-semibold text-white">{centre.capacity_percent}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isHigh ? 'bg-red-500' : isMod ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${centre.capacity_percent}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] text-slate-500 block text-right">
                        {centre.current_load_quintals.toLocaleString()} / {centre.max_capacity_quintals.toLocaleString()} Qtl
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Estimated Wait</span>
                      <div className="flex items-center gap-1 text-slate-200 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{centre.expected_wait_minutes} mins</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block">Weighbridges</span>
                      <div className="flex items-center gap-1 text-slate-200 font-semibold">
                        <Scale className="w-3.5 h-3.5 text-teal-400" />
                        <span>{centre.active_counters} / {centre.max_counters} open</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
          <div className="glass-card rounded-2xl p-5 space-y-2">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 w-fit">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-display">
              Multi-Objective AI Dispatch
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Equitably distributes farmer arrivals by calculating proximity, real-time yard fullness, 
              and weighbridge throughput, cutting average wait time by 45%.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 space-y-2">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 w-fit">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-display">
              No-Show Risk Prediction
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Machine learning heuristic assesses transit distance, vehicle sensitivity, and slot history 
              to recommend dynamic overbooking buffers without yard jamming.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 space-y-2">
            <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400 w-fit">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-display">
              Administrative Counter Simulator
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Government mandi officers can simulate opening extra weighbridge lanes in real time 
              to balance high peak hour inflows and prevent highway snarls.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
