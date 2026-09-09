import React, { useState } from 'react';
import { 
  Navigation, 
  Clock, 
  Milestone, 
  CheckCircle2, 
  AlertCircle, 
  Truck, 
  Tractor, 
  ArrowRight,
  ShieldAlert,
  Zap
} from 'lucide-react';

export default function RouteComparison({ routes, onSelectRoute, selectedRouteId }) {
  const [activeRoute, setActiveRoute] = useState(selectedRouteId || 'route-a');

  if (!routes) return null;

  const { routeA, routeB, trafficSummary } = routes;

  const handleSelect = (id) => {
    setActiveRoute(id);
    if (onSelectRoute) {
      onSelectRoute(id === 'route-a' ? routeA : routeB);
    }
  };

  return (
    <div id="route-intelligence-section" className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Route & Traffic Intelligence
            </h3>
            <p className="text-xs text-slate-400">
              AI evaluates road width, mandi gate access, and harvest congestion
            </p>
          </div>
        </div>

        <span className="text-xs px-2.5 py-1 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300 font-medium flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-400" />
          Live Corridors
        </span>
      </div>

      {/* Traffic Summary Alert */}
      {trafficSummary && (
        <div className="text-xs sm:text-sm bg-blue-950/40 border border-blue-500/30 text-blue-200 rounded-xl p-3 flex items-start gap-2.5">
          <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="font-medium leading-relaxed">{trafficSummary}</p>
        </div>
      )}

      {/* Route Cards: Route A vs Route B */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Route A */}
        <div
          id="route-card-a"
          onClick={() => handleSelect('route-a')}
          className={`cursor-pointer rounded-2xl p-4 transition-all border relative ${
            activeRoute === 'route-a'
              ? 'bg-slate-900/90 border-emerald-500 shadow-lg shadow-emerald-950/40 ring-2 ring-emerald-500/30'
              : 'glass-card border-slate-800 hover:border-slate-700'
          }`}
        >
          {routeA.isFaster && (
            <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[11px] uppercase tracking-wider shadow-md flex items-center gap-1">
              <Zap className="w-3 h-3 fill-current" />
              AI Recommended Faster Route
            </div>
          )}

          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Option 1
                </span>
                <h4 className="font-bold text-sm text-white font-display">
                  {routeA.name}
                </h4>
              </div>
              <p className="text-xs text-slate-400 mt-1">{routeA.roadCondition}</p>
            </div>
            {activeRoute === 'route-a' && (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 my-3 bg-slate-950/60 rounded-xl p-3 border border-slate-800/80">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-[10px] text-slate-400 block">Transit Time</span>
                <span className="text-lg font-bold text-white font-display">
                  {routeA.durationMins} mins
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Milestone className="w-4 h-4 text-teal-400" />
              <div>
                <span className="text-[10px] text-slate-400 block">Distance</span>
                <span className="text-lg font-bold text-white font-display">
                  {routeA.distanceKm} km
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-slate-300 mt-3">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Traffic Congestion:</span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold">
                {routeA.congestionLevel}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Vehicle Suitability:</span>
              <span className="text-slate-200 font-medium">{routeA.vehicleSuitability}</span>
            </div>
          </div>

          {routeA.highlights && (
            <ul className="mt-3 pt-3 border-t border-slate-800/80 space-y-1 text-xs text-slate-400">
              {routeA.highlights.map((h, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          )}

          {routeA.savingsMinutes > 0 && (
            <div className="mt-3 py-1.5 px-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold text-center">
              ⚡ Saves ~{routeA.savingsMinutes} minutes compared to Option 2
            </div>
          )}
        </div>

        {/* Route B */}
        <div
          id="route-card-b"
          onClick={() => handleSelect('route-b')}
          className={`cursor-pointer rounded-2xl p-4 transition-all border relative ${
            activeRoute === 'route-b'
              ? 'bg-slate-900/90 border-emerald-500 shadow-lg shadow-emerald-950/40 ring-2 ring-emerald-500/30'
              : 'glass-card border-slate-800 hover:border-slate-700'
          }`}
        >
          {routeB.isFaster && (
            <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[11px] uppercase tracking-wider shadow-md flex items-center gap-1">
              <Zap className="w-3 h-3 fill-current" />
              Faster Route
            </div>
          )}

          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Option 2
                </span>
                <h4 className="font-bold text-sm text-white font-display">
                  {routeB.name}
                </h4>
              </div>
              <p className="text-xs text-slate-400 mt-1">{routeB.roadCondition}</p>
            </div>
            {activeRoute === 'route-b' && (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 my-3 bg-slate-950/60 rounded-xl p-3 border border-slate-800/80">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-[10px] text-slate-400 block">Transit Time</span>
                <span className="text-lg font-bold text-white font-display">
                  {routeB.durationMins} mins
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Milestone className="w-4 h-4 text-teal-400" />
              <div>
                <span className="text-[10px] text-slate-400 block">Distance</span>
                <span className="text-lg font-bold text-white font-display">
                  {routeB.distanceKm} km
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-slate-300 mt-3">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Traffic Congestion:</span>
              <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-semibold">
                {routeB.congestionLevel}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Vehicle Suitability:</span>
              <span className="text-slate-200 font-medium">{routeB.vehicleSuitability}</span>
            </div>
          </div>

          {routeB.highlights && (
            <ul className="mt-3 pt-3 border-t border-slate-800/80 space-y-1 text-xs text-slate-400">
              {routeB.highlights.map((h, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-3 py-1.5 px-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold text-center">
            ⚠️ Frequent traffic halts at local market crossings
          </div>
        </div>
      </div>
    </div>
  );
}
