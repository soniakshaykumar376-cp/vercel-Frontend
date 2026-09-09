import React, { useState } from 'react';
import { 
  Sliders, 
  X, 
  Check, 
  Clock, 
  Scale, 
  TrendingDown, 
  ShieldCheck, 
  AlertCircle,
  Plus,
  Minus,
  Sparkles
} from 'lucide-react';
import { updateCentreCounters } from '../api/client';

export default function CounterSimulatorModal({ centre, isOpen, onClose, onUpdated }) {
  if (!isOpen || !centre) return null;

  const [activeCounters, setActiveCounters] = useState(centre.activeCounters || centre.active_counters || 2);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const maxCounters = centre.maxCounters || centre.max_counters || 6;
  const initialWait = centre.waitMins || centre.expected_wait_minutes || 60;

  // Real-time preview calculation
  const previewRatio = (centre.activeCounters || centre.active_counters || 2) / activeCounters;
  const previewWait = Math.max(8, Math.round(initialWait * previewRatio));
  const previewMinutesSaved = Math.max(0, initialWait - previewWait);

  const handleIncrement = () => {
    if (activeCounters < maxCounters) {
      setActiveCounters((c) => c + 1);
    }
  };

  const handleDecrement = () => {
    if (activeCounters > 1) {
      setActiveCounters((c) => c - 1);
    }
  };

  const handleApply = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await updateCentreCounters(centre.id, null, activeCounters);
      if (res.data?.success) {
        setResult(res.data);
        if (onUpdated) {
          onUpdated(res.data.centre);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update counters');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="counter-simulator-modal"
        className="w-full max-w-lg bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden"
      >
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Mandi Administrative Simulator
            </span>
            <h3 className="text-xl font-bold text-white font-display mt-0.5">
              Weighbridge Counter Optimization
            </h3>
            <p className="text-xs text-slate-400">Target Centre: {centre.name}</p>
          </div>
        </div>

        {/* Counter Stepper */}
        <div className="bg-slate-950/70 rounded-2xl p-5 border border-slate-800/80 mb-5 text-center">
          <span className="text-xs text-slate-400 block mb-2 font-medium">
            Active Weighbridge Counters (Max available: {maxCounters})
          </span>
          <div className="flex items-center justify-center gap-6">
            <button
              id="counter-decrement-btn"
              type="button"
              disabled={activeCounters <= 1 || loading}
              onClick={handleDecrement}
              className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 text-white flex items-center justify-center hover:bg-slate-700 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all"
            >
              <Minus className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center">
              <span className="text-5xl font-extrabold text-emerald-400 font-display">
                {activeCounters}
              </span>
              <span className="text-[11px] text-slate-400 mt-1">
                {activeCounters > (centre.activeCounters || centre.active_counters || 2)
                  ? `+${activeCounters - (centre.activeCounters || centre.active_counters || 2)} additional counters`
                  : 'Current baseline'}
              </span>
            </div>

            <button
              id="counter-increment-btn"
              type="button"
              disabled={activeCounters >= maxCounters || loading}
              onClick={handleIncrement}
              className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 text-white flex items-center justify-center hover:bg-slate-700 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Simulation Impact Preview */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-slate-950/50 rounded-xl p-3.5 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Projected Wait Time</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white font-display">
                {previewWait}
              </span>
              <span className="text-xs text-slate-400">mins</span>
            </div>
            <span className="text-[11px] text-slate-500 block">
              Was: {initialWait} mins
            </span>
          </div>

          <div className="bg-emerald-950/30 rounded-xl p-3.5 border border-emerald-500/30">
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 mb-1">
              <TrendingDown className="w-4 h-4 text-emerald-400" />
              <span>Queue Reduction</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-emerald-400 font-display">
                -{previewMinutesSaved}
              </span>
              <span className="text-xs text-emerald-300">mins saved</span>
            </div>
            <span className="text-[11px] text-emerald-400/80 block font-medium">
              Eliminates yard bottlenecks
            </span>
          </div>
        </div>

        {/* Error / Success feedback */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{result.message}</span>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-700 text-slate-300 font-semibold text-sm hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
          <button
            id="apply-counters-btn"
            type="button"
            disabled={loading}
            onClick={handleApply}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-sm shadow-lg shadow-emerald-600/30 hover:from-emerald-400 hover:to-teal-500 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'Simulating...' : 'Apply Simulation'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
