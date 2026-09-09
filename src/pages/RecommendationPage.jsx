import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Scale, 
  Milestone, 
  Warehouse, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight, 
  Share2, 
  Printer, 
  Ticket, 
  QrCode, 
  RefreshCw,
  Tractor,
  Layers,
  ChevronRight
} from 'lucide-react';
import { getCentreRecommendation } from '../api/client';
import RouteComparison from '../components/RouteComparison';

export default function RecommendationPage() {
  const location = useLocation();
  const registeredFarmer = location.state?.farmer;
  const justRegistered = location.state?.justRegistered;

  const [inputData, setInputData] = useState({
    location: registeredFarmer?.location || 'Bija Village, Khanna',
    crop_type: registeredFarmer?.crop_type || 'Wheat',
    expected_quantity: registeredFarmer?.expected_quantity || 150,
    vehicle_type: registeredFarmer?.vehicle_type || 'Tractor',
    isRainPredicted: false
  });

  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showGatePass, setShowGatePass] = useState(Boolean(justRegistered));
  const [selectedCentre, setSelectedCentre] = useState(null);

  const fetchRecommendation = async (params) => {
    setLoading(true);
    try {
      const res = await getCentreRecommendation(params);
      if (res.data?.success) {
        setRecommendation(res.data);
        setSelectedCentre(res.data.bestMatch);
      }
    } catch (err) {
      console.error('Failed to get recommendation:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendation(inputData);
  }, []);

  const handleRecalculate = (e) => {
    e.preventDefault();
    fetchRecommendation(inputData);
  };

  const handleSelectAlternative = (centre) => {
    setSelectedCentre(centre);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            AI Decision Intelligence
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            AI Procurement Centre Recommendation
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Multi-objective optimization scoring for distance, yard capacity, wait times, and weather safety.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="print-gate-pass-btn"
            type="button"
            onClick={() => setShowGatePass(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm border border-slate-700 transition-all flex items-center gap-2"
          >
            <Ticket className="w-4 h-4 text-amber-400" />
            <span>Digital Gate Token</span>
          </button>

          <Link
            to="/register"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-xs sm:text-sm shadow-md shadow-emerald-600/30 hover:from-emerald-400 hover:to-teal-500 transition-all flex items-center gap-2"
          >
            <span>New Farmer</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Just Registered Alert Banner */}
      {justRegistered && registeredFarmer && (
        <div className="rounded-2xl p-4 bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 flex items-center justify-between gap-4 shadow-lg shadow-emerald-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Registration Confirmed • ID: {registeredFarmer.id}
              </span>
              <p className="text-sm font-semibold text-white">
                Farmer: {registeredFarmer.name} ({registeredFarmer.crop_type}, {registeredFarmer.expected_quantity} Qtl)
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowGatePass(true)}
            className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-colors shrink-0"
          >
            View Gate Token
          </button>
        </div>
      )}

      {/* Interactive Parameters Bar */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800">
        <form onSubmit={handleRecalculate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Location</label>
            <input
              type="text"
              value={inputData.location}
              onChange={(e) => setInputData((d) => ({ ...d, location: e.target.value }))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Crop Type</label>
            <select
              value={inputData.crop_type}
              onChange={(e) => setInputData((d) => ({ ...d, crop_type: e.target.value }))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="Wheat">Wheat</option>
              <option value="Paddy">Paddy / Basmati</option>
              <option value="Mustard">Mustard</option>
              <option value="Maize">Maize</option>
              <option value="Cotton">Cotton</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Quantity (Quintals)</label>
            <input
              type="number"
              value={inputData.expected_quantity}
              onChange={(e) => setInputData((d) => ({ ...d, expected_quantity: e.target.value }))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Vehicle</label>
            <select
              value={inputData.vehicle_type}
              onChange={(e) => setInputData((d) => ({ ...d, vehicle_type: e.target.value }))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="Tractor">Tractor-Trolley</option>
              <option value="Truck">Commercial Truck</option>
              <option value="Trolley">Light Trolley</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-3 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Recalculate Match</span>
          </button>
        </form>
      </div>

      {loading ? (
        <div className="glass-card rounded-3xl p-12 text-center animate-pulse space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-500/30 border-t-emerald-400 animate-spin mx-auto"></div>
          <p className="text-slate-300 font-semibold text-sm">
            AI is analyzing real-time gate capacities, transit road widths, and queue algorithms...
          </p>
        </div>
      ) : recommendation ? (
        <div className="space-y-8">
          {/* Top Recommendation Highlight Card */}
          <div
            id="top-recommended-centre-card"
            className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-emerald-950/50 via-slate-900 to-slate-950 border-2 border-emerald-500/40 shadow-2xl shadow-emerald-950/50"
          >
            {/* AI Top Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-md flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  AI #1 Recommended Centre
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                  {selectedCentre?.centreId || recommendation.bestMatch.centreId}
                </span>
              </div>

              {/* Confidence Score Pill */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30">
                <span className="text-xs text-slate-400">Match Confidence:</span>
                <span className="text-xl font-extrabold text-emerald-400 font-display">
                  {selectedCentre?.score || recommendation.bestMatch.score}/100
                </span>
              </div>
            </div>

            {/* Centre Title & Location */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <div className="lg:col-span-2 space-y-3">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                  {selectedCentre?.name || recommendation.bestMatch.name}
                </h2>
                <p className="text-sm text-slate-300 flex items-center gap-1.5">
                  <Milestone className="w-4 h-4 text-emerald-400 shrink-0" />
                  {selectedCentre?.location || recommendation.bestMatch.location} (
                  {selectedCentre?.district || recommendation.bestMatch.district} District)
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {(selectedCentre?.badges || recommendation.bestMatch.badges || []).map((b, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-0.5 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 font-medium"
                    >
                      ✓ {b}
                    </span>
                  ))}
                  <span className="text-xs px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                    60T Automated Weighbridge
                  </span>
                </div>
              </div>

              {/* Quick Decision Box */}
              <div className="bg-slate-950/70 rounded-2xl p-4 border border-emerald-500/20 space-y-2">
                <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider block">
                  AI Summary Assessment
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {recommendation.decisionSummary}
                </p>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Yard Status:</span>
                  <span className="text-emerald-400 font-bold">
                    {selectedCentre?.status || recommendation.bestMatch.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
              <div className="bg-slate-900/80 rounded-2xl p-3.5 border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">Transit Distance</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold font-display text-white">
                    {selectedCentre?.distance_km || recommendation.bestMatch.distance_km}
                  </span>
                  <span className="text-xs text-slate-400">km</span>
                </div>
                <span className="text-[11px] text-emerald-400 mt-0.5 block">Shortest haul</span>
              </div>

              <div className="bg-slate-900/80 rounded-2xl p-3.5 border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">Yard Capacity Used</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold font-display text-white">
                    {selectedCentre?.capacity_percent || recommendation.bestMatch.capacity_percent}%
                  </span>
                </div>
                <span className="text-[11px] text-emerald-400 mt-0.5 block">
                  {100 - (selectedCentre?.capacity_percent || recommendation.bestMatch.capacity_percent)}% buffer free
                </span>
              </div>

              <div className="bg-slate-900/80 rounded-2xl p-3.5 border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">Estimated Wait</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold font-display text-emerald-400">
                    ~{selectedCentre?.expected_wait_minutes || recommendation.bestMatch.expected_wait_minutes}
                  </span>
                  <span className="text-xs text-slate-400">mins</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-0.5 block">Weighbridge turnaround</span>
              </div>

              <div className="bg-slate-900/80 rounded-2xl p-3.5 border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">Active Counters</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold font-display text-white">
                    {selectedCentre?.active_counters || recommendation.bestMatch.active_counters}
                  </span>
                  <span className="text-xs text-slate-400">
                    / {selectedCentre?.max_counters || recommendation.bestMatch.max_counters} lanes
                  </span>
                </div>
                <span className="text-[11px] text-teal-400 mt-0.5 block">Express clearance</span>
              </div>
            </div>

            {/* Explainable AI Reasoning List */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Explainable AI Reasoning (Why this centre was chosen):
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {(selectedCentre?.reasoning || recommendation.bestMatch.reasoning || []).map((reason, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs text-slate-300"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Route & Traffic Intelligence Component */}
          {selectedCentre?.routes && (
            <RouteComparison routes={selectedCentre.routes} />
          )}

          {/* Alternative Ranked Centres Comparison */}
          <div className="space-y-4 pt-4">
            <div>
              <h3 className="text-lg font-bold text-white font-display">
                Alternative Procurement Centres Evaluated
              </h3>
              <p className="text-xs text-slate-400">
                Comparison of secondary and tertiary candidates ranked by multi-factor score
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendation.alternatives.map((alt) => {
                const isSelected = selectedCentre?.centreId === alt.centreId;
                return (
                  <div
                    key={alt.centreId}
                    className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-900 border-emerald-500 ring-2 ring-emerald-500/30'
                        : 'glass-card border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          Rank #{alt.rank}
                        </span>
                        <span className="text-xs font-bold text-slate-400">
                          Score: {alt.score}/100
                        </span>
                      </div>

                      <h4 className="font-bold text-base text-white font-display mb-1">
                        {alt.name}
                      </h4>
                      <p className="text-xs text-slate-400 mb-3">{alt.location}</p>

                      <div className="space-y-2 bg-slate-950/60 rounded-xl p-3 border border-slate-800 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Distance:</span>
                          <span className="font-semibold text-white">{alt.distance_km} km</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Yard Capacity:</span>
                          <span className={`font-semibold ${alt.capacity_percent > 75 ? 'text-amber-400' : 'text-white'}`}>
                            {alt.capacity_percent}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Wait Time:</span>
                          <span className={`font-semibold ${alt.expected_wait_minutes > 40 ? 'text-red-400' : 'text-white'}`}>
                            ~{alt.expected_wait_minutes} mins
                          </span>
                        </div>
                      </div>

                      {/* Disadvantage summary */}
                      <div className="mt-3 text-[11px] text-slate-400 italic">
                        {alt.capacity_percent > 75
                          ? `⚠️ ${alt.capacity_percent}% capacity creates risk of gate queue.`
                          : `⚠️ Requires ${alt.distance_km} km travel distance.`}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectAlternative(alt)}
                      className={`mt-4 w-full py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                          : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
                      }`}
                    >
                      {isSelected ? 'Currently Selected' : 'Choose This Centre'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}

      {/* Digital Gate Token Modal */}
      {showGatePass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div
            id="digital-gate-token-modal"
            className="w-full max-w-md bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base text-white font-display">
                  Digital Mandi Gate Pass
                </h3>
              </div>
              <button
                onClick={() => setShowGatePass(false)}
                className="text-xs text-slate-400 hover:text-white p-1 rounded"
              >
                ✕ Close
              </button>
            </div>

            {/* Pass Slip Content */}
            <div className="my-5 p-5 bg-slate-950 rounded-2xl border border-dashed border-emerald-500/40 space-y-4">
              <div className="text-center pb-3 border-b border-slate-800">
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 block">
                  Punjab Mandi Board • Smart Token
                </span>
                <span className="text-xl font-extrabold text-white font-mono tracking-wider mt-1 block">
                  {registeredFarmer?.id || 'TOKEN-2026-X9'}
                </span>
                <span className="text-xs text-slate-400">
                  Priority Gate Clearance Allocated
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">Farmer Name</span>
                  <span className="font-bold text-white">
                    {registeredFarmer?.name || 'Harpreet Singh'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px]">Mobile</span>
                  <span className="font-bold text-white font-mono">
                    {registeredFarmer?.phone || '9876543210'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px]">Produce</span>
                  <span className="font-bold text-emerald-400">
                    {registeredFarmer?.expected_quantity || 150} Qtl (
                    {registeredFarmer?.crop_type || 'Wheat'})
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px]">Vehicle</span>
                  <span className="font-bold text-white">
                    {registeredFarmer?.vehicle_type || 'Tractor-Trolley'}
                  </span>
                </div>

                <div className="col-span-2 pt-2 border-t border-slate-800/80">
                  <span className="text-slate-500 block text-[10px]">Destination Centre</span>
                  <span className="font-bold text-emerald-300">
                    {selectedCentre?.name || recommendation?.bestMatch.name || 'Khanna Central Silo Complex'}
                  </span>
                </div>
              </div>

              {/* Mock QR code visual */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-14 h-14 bg-white rounded-lg p-1 flex items-center justify-center">
                    <QrCode className="w-12 h-12 text-slate-950" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      VALID GATE-1 SCAN
                    </span>
                    <span className="text-xs font-semibold text-emerald-400">
                      Express Weigh Lane 2
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">Est. Wait</span>
                  <span className="text-base font-bold text-white font-display">
                    ~{selectedCentre?.expected_wait_minutes || 18}m
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Pass</span>
              </button>
              <button
                type="button"
                onClick={() => setShowGatePass(false)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
