import React, { useState, useEffect } from 'react';
import { 
  CloudRain, 
  Sun, 
  Cloud, 
  Wind, 
  Droplets, 
  AlertTriangle, 
  RefreshCw, 
  Sparkles,
  CheckCircle2,
  CalendarClock
} from 'lucide-react';
import { getWeather } from '../api/client';

export default function WeatherWidget({ onWeatherChange }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [simulateRain, setSimulateRain] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeatherData = async (isSimulated) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getWeather({ simulateRain: isSimulated });
      if (res.data?.success) {
        setWeather(res.data);
        if (onWeatherChange) {
          onWeatherChange(res.data);
        }
      }
    } catch (err) {
      console.error('Failed to load weather:', err);
      setError('Unable to load live meteorological data. Using regional fallback.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData(simulateRain);
  }, [simulateRain]);

  const handleToggleSimulation = () => {
    setSimulateRain((prev) => !prev);
  };

  if (loading && !weather) {
    return (
      <div className="glass-card p-5 rounded-2xl animate-pulse flex items-center justify-center min-h-[140px]">
        <div className="flex items-center gap-3 text-emerald-400">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="text-sm font-medium">Fetching Open-Meteo meteorological feed...</span>
        </div>
      </div>
    );
  }

  const isRain = weather?.isRainPredicted;

  return (
    <div 
      id="weather-aware-widget"
      className={`relative overflow-hidden rounded-2xl transition-all border p-5 ${
        isRain 
          ? 'bg-gradient-to-br from-amber-950/40 via-red-950/30 to-slate-900 border-amber-500/40 shadow-lg shadow-amber-950/30' 
          : 'glass-card border-emerald-500/20'
      }`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl ${isRain ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
            {isRain ? <CloudRain className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="font-semibold text-sm text-white flex items-center gap-1.5 font-display">
              Regional Weather Intelligence
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                Open-Meteo
              </span>
            </h3>
            <p className="text-xs text-slate-400">{weather?.location || 'Central Procurement Hub'}</p>
          </div>
        </div>

        {/* Rain Simulation Toggle for evaluation */}
        <div className="flex items-center gap-2">
          <button
            id="weather-simulate-toggle"
            type="button"
            onClick={handleToggleSimulation}
            className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 border ${
              simulateRain
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{simulateRain ? 'Rain Simulation (Active)' : 'Simulate Rain Test'}</span>
          </button>

          <button
            onClick={() => fetchWeatherData(simulateRain)}
            title="Refresh weather"
            className="p-1.5 rounded-lg bg-slate-800/60 text-slate-400 hover:text-emerald-400 hover:bg-slate-700/60 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Condition & Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800">
          <span className="text-[11px] text-slate-400 block mb-1">Current Temperature</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-display text-white">
              {weather?.current?.temperature ?? '--'}°
            </span>
            <span className="text-xs text-slate-400">C</span>
          </div>
          <span className="text-xs text-emerald-400 font-medium truncate block">
            {weather?.current?.weatherDescription || 'Mainly Clear'}
          </span>
        </div>

        <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800">
          <span className="text-[11px] text-slate-400 block mb-1">Precipitation Risk</span>
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-bold font-display ${isRain ? 'text-amber-400' : 'text-emerald-400'}`}>
              {weather?.rainProbabilityMax ?? 0}%
            </span>
          </div>
          <span className="text-xs text-slate-400 block">
            {isRain ? 'Elevated Shower Risk' : 'Dry & Clear'}
          </span>
        </div>

        <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800">
          <span className="text-[11px] text-slate-400 block mb-1">Air Humidity</span>
          <div className="flex items-center gap-1.5 text-slate-200">
            <Droplets className="w-4 h-4 text-teal-400" />
            <span className="text-lg font-bold font-display">{weather?.current?.humidity ?? '--'}%</span>
          </div>
          <span className="text-xs text-slate-400 block">Relative index</span>
        </div>

        <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800">
          <span className="text-[11px] text-slate-400 block mb-1">Wind Speed</span>
          <div className="flex items-center gap-1.5 text-slate-200">
            <Wind className="w-4 h-4 text-cyan-400" />
            <span className="text-lg font-bold font-display">{weather?.current?.windSpeed ?? '--'}</span>
            <span className="text-xs text-slate-400">km/h</span>
          </div>
          <span className="text-xs text-slate-400 block">Breeze level</span>
        </div>
      </div>

      {/* Weather-Aware Suggestion Banner */}
      <div
        id="weather-suggestion-banner"
        className={`rounded-xl p-3.5 flex items-start gap-3 border ${
          isRain
            ? 'bg-amber-950/60 border-amber-500/50 text-amber-200'
            : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
        }`}
      >
        {isRain ? (
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 animate-bounce" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-semibold text-xs uppercase tracking-wider">
              {isRain ? '⚠️ Weather Alert Advisory' : 'Procurement Operating Advice'}
            </span>
            {isRain && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-bold uppercase">
                Rain Predicted
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm font-medium leading-snug">
            {weather?.suggestion}
          </p>
          {isRain && (
            <div className="mt-2 flex items-center gap-2 text-xs text-amber-300/90 font-normal">
              <CalendarClock className="w-3.5 h-3.5" />
              <span>Recommended Action: Postpone open-trolley transit or divert to covered Silo complexes.</span>
            </div>
          )}
        </div>
      </div>

      {/* 3-Day Forecast mini bar */}
      {weather?.forecast && weather.forecast.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2">
          {weather.forecast.map((f, i) => (
            <div key={i} className="text-center bg-slate-950/40 rounded-lg py-1.5 px-1">
              <span className="text-[11px] text-slate-400 block">{f.day}</span>
              <span className="text-xs font-semibold text-white">
                {f.tempMax}° / {f.tempMin}°
              </span>
              <span className={`text-[10px] block font-medium ${f.rainProb > 40 ? 'text-amber-400' : 'text-slate-400'}`}>
                {f.rainProb}% rain
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
