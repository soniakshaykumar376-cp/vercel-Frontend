import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Truck, 
  Scale, 
  AlertTriangle, 
  TrendingUp, 
  Sliders, 
  ShieldCheck, 
  Clock, 
  Search, 
  Filter, 
  RefreshCw, 
  Sparkles, 
  CheckCircle2, 
  XCircle,
  HelpCircle,
  Phone,
  Layers,
  BarChart3,
  PieChart as PieIcon,
  Calendar
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell,
  CartesianGrid
} from 'recharts';
import { getDashboardStats, getFarmers, getCentres } from '../api/client';
import CounterSimulatorModal from '../components/CounterSimulatorModal';
import WeatherWidget from '../components/WeatherWidget';

export default function AdminDashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [farmersList, setFarmersList] = useState([]);
  const [centresList, setCentresList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtering states for farmers table
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');
  const [vehicleFilter, setVehicleFilter] = useState('All');

  // Counter Simulator state
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const [targetCentreForSimulation, setTargetCentreForSimulation] = useState(null);

  const loadAllDashboardData = async () => {
    setLoading(true);
    try {
      const [dashRes, farmersRes, centresRes] = await Promise.all([
        getDashboardStats(),
        getFarmers(),
        getCentres()
      ]);

      if (dashRes.data?.success) setDashboardData(dashRes.data);
      if (farmersRes.data?.farmers) setFarmersList(farmersRes.data.farmers);
      if (centresRes.data?.centres) setCentresList(centresRes.data.centres);

      // Default simulation target is most congested centre
      if (dashRes.data?.summary?.mostCongestedCentre && centresRes.data?.centres) {
        const found = centresRes.data.centres.find(
          (c) => c.name.includes(dashRes.data.summary.mostCongestedCentre.name) ||
                 dashRes.data.summary.mostCongestedCentre.name.includes(c.name)
        );
        if (found) setTargetCentreForSimulation(found);
      }
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllDashboardData();
  }, []);

  const handleSimulatorSuccess = () => {
    loadAllDashboardData();
  };

  // Filtered farmers list
  const filteredFarmers = farmersList.filter((f) => {
    const matchesSearch = 
      !searchTerm ||
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.crop_type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRisk = riskFilter === 'All' || f.risk_label === riskFilter;
    const matchesVehicle = vehicleFilter === 'All' || f.vehicle_type === vehicleFilter;

    return matchesSearch && matchesRisk && matchesVehicle;
  });

  const summary = dashboardData?.summary;
  const noShow = dashboardData?.noShowMetrics;
  const hourlyTrends = dashboardData?.hourlyTrends || [];
  const weeklyForecast = dashboardData?.weeklyForecast || [];
  const vehicleChart = dashboardData?.vehicleTypeChart || [];
  const centresComparison = dashboardData?.centresComparison || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Government & Mandi Board Central Command
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            Administrative Intelligence & Governance Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time vehicle inflow surveillance, predictive no-show analytics, and weighbridge lane balancing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="open-counter-simulator-btn"
            type="button"
            onClick={() => setSimulatorOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-xs sm:text-sm shadow-md shadow-emerald-600/30 hover:from-emerald-400 hover:to-teal-500 transition-all flex items-center gap-2"
          >
            <Sliders className="w-4 h-4" />
            <span>Counter Load Simulator</span>
          </button>

          <button
            onClick={loadAllDashboardData}
            title="Refresh analytics"
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Actionable AI Government Recommendation Banner */}
      {summary?.recommendationText && (
        <div
          id="admin-ai-recommendation-banner"
          className={`rounded-3xl p-5 border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
            summary.overloadRiskPercent > 70
              ? 'bg-red-950/40 border-red-500/40 shadow-xl shadow-red-950/30 text-red-200'
              : summary.overloadRiskPercent > 45
              ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
              : 'glass-card border-emerald-500/30 text-emerald-200'
          }`}
        >
          <div className="flex items-start gap-3.5">
            <div
              className={`p-3 rounded-2xl shrink-0 mt-0.5 ${
                summary.overloadRiskPercent > 70
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-amber-500/20 text-amber-400'
              }`}
            >
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Operational AI Directive:
                </span>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                    summary.overloadRiskPercent > 70
                      ? 'bg-red-500 text-slate-950'
                      : 'bg-amber-500 text-slate-950'
                  }`}
                >
                  {summary.recommendationUrgency} Priority
                </span>
              </div>
              <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                {summary.recommendationText}
              </p>
            </div>
          </div>

          <button
            id="banner-simulate-counter-btn"
            onClick={() => setSimulatorOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-white text-slate-950 font-bold text-xs sm:text-sm hover:bg-slate-200 transition-all shrink-0 flex items-center justify-center gap-1.5 shadow-lg"
          >
            <Sliders className="w-4 h-4 text-emerald-600" />
            <span>Simulate Extra Counters</span>
          </button>
        </div>
      )}

      {/* Top 4 Core Metrics Cards */}
      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card rounded-3xl p-5 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Predicted Farmers Tomorrow</span>
              <Calendar className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-display">
                {summary.predictedFarmersTomorrow}
              </span>
              <span className="text-xs text-emerald-400 font-semibold">+25% harvest surge</span>
            </div>
            <span className="text-[11px] text-slate-500 block mt-1">
              Today registered: {summary.totalFarmersRegistered} farmers
            </span>
          </div>

          <div className="glass-card rounded-3xl p-5 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Total Vehicles Expected</span>
              <Truck className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-display">
                {summary.totalVehiclesExpected}
              </span>
              <span className="text-xs text-slate-400">units</span>
            </div>
            <span className="text-[11px] text-slate-500 block mt-1">
              Tomorrow: ~{summary.predictedVehiclesTomorrow} vehicles
            </span>
          </div>

          <div className="glass-card rounded-3xl p-5 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Total Produce Expected</span>
              <Scale className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-white font-display">
                {summary.totalQuintalsExpected.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 font-medium">Quintals</span>
            </div>
            <span className="text-[11px] text-amber-400 block mt-1">
              {(summary.totalQuintalsExpected / 10).toFixed(0)} Metric Tonnes
            </span>
          </div>

          <div
            className={`rounded-3xl p-5 border transition-all ${
              summary.overloadRiskPercent > 70
                ? 'bg-red-950/30 border-red-500/40 text-red-400'
                : 'glass-card border-emerald-500/20 text-emerald-400'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-1 opacity-80">
              <span>Overall Overload Risk</span>
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-display">
                {summary.overloadRiskPercent}%
              </span>
              <span className="text-xs uppercase font-bold">
                {summary.overloadRiskPercent > 70 ? 'Severe' : 'Moderate'}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  summary.overloadRiskPercent > 70 ? 'bg-red-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${summary.overloadRiskPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Inflow Trend Chart (Bar + Line) */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                Hourly Farmer & Produce Inflow Trends (06:00 - 18:00)
              </h3>
              <p className="text-xs text-slate-400">
                Hourly vehicle arrivals and produce volume arriving at Mandi gates
              </p>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
              Peak: 10:00 AM
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyTrends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} yAxisId="left" orientation="left" />
                <YAxis stroke="#64748b" fontSize={11} yAxisId="right" orientation="right" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar yAxisId="left" dataKey="quintals" name="Produce (Qtl)" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="vehicles" name="Vehicles (Count)" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vehicle Breakdown Pie Chart */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-cyan-400" />
                Vehicle Intelligence Share
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Breakdown of incoming transport fleet by vehicle category
            </p>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vehicleChart}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {vehicleChart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      color: '#f8fafc',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
            {vehicleChart.map((v, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: v.fill }}></div>
                  <span className="text-slate-300">{v.name}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-white font-bold">{v.count} units</span>
                  <span className="text-slate-500">({v.quintals} Qtl)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Centre Capacity Utilization Chart */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              Procurement Centre Capacity Load vs Bottlenecks
            </h3>
            <p className="text-xs text-slate-400">
              Comparative yard utilization and active weighbridge lanes across centres
            </p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={centresComparison} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} unit="%" domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  color: '#f8fafc',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="capacityPercent" name="Capacity Used (%)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="waitMins" name="Wait Time (Mins)" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* No-Show Intelligence & Overbooking Buffer Banner */}
      {noShow && (
        <div className="rounded-3xl p-6 bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Predictive Attendance Heuristic
              </span>
              <h3 className="text-lg font-bold text-white font-display">
                No-Show Prediction & Overbooking Buffer Factor
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Recommended Dynamic Buffer:</span>
              <span className="text-base font-extrabold px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                +{noShow.recommendedBufferPercent}% Slots
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950/70 rounded-2xl p-3 border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">Average Attendance</span>
              <span className="text-2xl font-bold font-display text-white">
                {noShow.avgAttendanceProbability}%
              </span>
            </div>

            <div className="bg-slate-950/70 rounded-2xl p-3 border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">Predicted No-Shows</span>
              <span className="text-2xl font-bold font-display text-amber-400">
                {noShow.predictedNoShows}
              </span>
              <span className="text-[10px] text-slate-500 block">Farmers likely to postpone</span>
            </div>

            <div className="bg-slate-950/70 rounded-2xl p-3 border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">High Risk Inflows</span>
              <span className="text-2xl font-bold font-display text-red-400">
                {noShow.highRiskCount}
              </span>
              <span className="text-[10px] text-slate-500 block">&lt;50% check-in prob</span>
            </div>

            <div className="bg-slate-950/70 rounded-2xl p-3 border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">Low Risk (Committed)</span>
              <span className="text-2xl font-bold font-display text-emerald-400">
                {noShow.lowRiskCount}
              </span>
              <span className="text-[10px] text-slate-500 block">&gt;80% check-in prob</span>
            </div>
          </div>
        </div>
      )}

      {/* Registered Farmers Table with Search & Filters */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white font-display">
              Registered Farmers & No-Show Risk Surveillance
            </h3>
            <p className="text-xs text-slate-400">
              Showing {filteredFarmers.length} of {farmersList.length} total farmers registered in SQLite
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                id="farmer-search-input"
                type="text"
                placeholder="Search name, phone, crop..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 w-48 sm:w-60"
              />
            </div>

            {/* Risk filter */}
            <select
              id="filter-risk-select"
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="All">All Risk Tiers</option>
              <option value="Low">Low Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="High">High Risk</option>
            </select>

            {/* Vehicle filter */}
            <select
              id="filter-vehicle-select"
              value={vehicleFilter}
              onChange={(e) => setVehicleFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="All">All Vehicles</option>
              <option value="Tractor">Tractor</option>
              <option value="Truck">Truck</option>
              <option value="Trolley">Trolley</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Token ID</th>
                <th className="py-3 px-4">Farmer Details</th>
                <th className="py-3 px-4">Crop & Volume</th>
                <th className="py-3 px-4">Vehicle</th>
                <th className="py-3 px-4">Assigned Mandi</th>
                <th className="py-3 px-4">Attendance Prob</th>
                <th className="py-3 px-4">No-Show Risk</th>
                <th className="py-3 px-4">AI Risk Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
              {filteredFarmers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 text-xs">
                    No farmer records match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredFarmers.map((farmer) => {
                  const isHigh = farmer.risk_label === 'High';
                  const isMed = farmer.risk_label === 'Medium';
                  return (
                    <tr key={farmer.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-white whitespace-nowrap">
                        {farmer.id}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{farmer.name}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {farmer.phone} • {farmer.location}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold text-emerald-400">
                          {farmer.expected_quantity} Qtl
                        </span>
                        <span className="text-[11px] text-slate-400 block">{farmer.crop_type}</span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-medium">
                          {farmer.vehicle_type}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-200">
                        {farmer.assigned_centre_name || 'Khanna Central Silo'}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                isHigh ? 'bg-red-500' : isMed ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${farmer.attendance_probability}%` }}
                            ></div>
                          </div>
                          <span className="font-mono font-bold text-white">
                            {farmer.attendance_probability}%
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isHigh
                              ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                              : isMed
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          }`}
                        >
                          {farmer.risk_label} Risk
                        </span>
                      </td>

                      <td className="py-3 px-4 text-[11px] text-slate-400 max-w-xs truncate" title={farmer.risk_reasons}>
                        {farmer.risk_reasons || 'Direct farm proximity with confirmed transport booking.'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Embedded Weather Advisory Widget */}
      <div className="space-y-3 pt-4">
        <h3 className="text-base font-bold text-white font-display">
          Weather Contingency Surveillance
        </h3>
        <WeatherWidget />
      </div>

      {/* Counter Simulator Modal */}
      {targetCentreForSimulation && (
        <CounterSimulatorModal
          centre={targetCentreForSimulation}
          isOpen={simulatorOpen}
          onClose={() => setSimulatorOpen(false)}
          onUpdated={handleSimulatorSuccess}
        />
      )}
    </div>
  );
}
