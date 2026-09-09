import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Tractor, 
  Truck, 
  Car, 
  MapPin, 
  Phone, 
  User, 
  Wheat, 
  Scale, 
  Clock, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { registerFarmer } from '../api/client';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: 'Bija Village, Khanna',
    crop_type: 'Wheat',
    expected_quantity: '150',
    vehicle_type: 'Tractor',
    preferred_slot: 'Morning (08:00 - 11:00)'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cropOptions = [
    { label: 'Wheat (Gehun)', value: 'Wheat' },
    { label: 'Paddy / Basmati (Dhan)', value: 'Paddy' },
    { label: 'Mustard (Sarson)', value: 'Mustard' },
    { label: 'Maize (Makka)', value: 'Maize' },
    { label: 'Cotton (Kapas)', value: 'Cotton' },
    { label: 'Pulses / Gram (Chana)', value: 'Pulses' }
  ];

  const vehicleOptions = [
    {
      id: 'Tractor',
      label: 'Tractor-Trolley',
      desc: 'Standard agricultural trolley (100 - 250 Qtl)',
      icon: Tractor
    },
    {
      id: 'Truck',
      label: 'Commercial Truck',
      desc: 'Multi-axle covered truck (200 - 500 Qtl)',
      icon: Truck
    },
    {
      id: 'Trolley',
      label: 'Light Trolley / Cart',
      desc: 'Local farm link transport (20 - 100 Qtl)',
      icon: Car
    }
  ];

  const locationPresets = [
    'Bija Village, Khanna',
    'Samrala Mandi Link',
    'Doraha Bypass Road',
    'Payal Tehsil, Ludhiana',
    'Amloh Rural Link',
    'Machhiwara Corridor'
  ];

  const timeSlots = [
    'Morning (08:00 - 11:00)',
    'Midday (11:00 - 14:00)',
    'Afternoon (14:00 - 17:00)'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVehicleSelect = (type) => {
    setFormData((prev) => ({ ...prev, vehicle_type: type }));
  };

  const handleQuantityAdjust = (amount) => {
    const current = Number(formData.expected_quantity) || 0;
    const nextVal = Math.max(10, current + amount);
    setFormData((prev) => ({ ...prev, expected_quantity: String(nextVal) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Basic Validation
    if (!formData.name.trim()) {
      setError('Please enter farmer name.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    const qty = Number(formData.expected_quantity);
    if (!qty || qty <= 0) {
      setError('Please specify a valid quantity in quintals.');
      return;
    }

    setLoading(true);
    try {
      const res = await registerFarmer({
        ...formData,
        expected_quantity: qty
      });

      if (res.data?.success) {
        // Navigate to AI Recommendation with registered farmer state
        navigate('/recommendation', {
          state: {
            farmer: res.data.farmer,
            justRegistered: true
          }
        });
      }
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.response?.data?.message || err.message || 'Failed to submit registration');
    } finally {
      setLoading(false);
    }
  };

  // Preview attendance calculation
  const qtyNumber = Number(formData.expected_quantity) || 100;
  const isMorning = formData.preferred_slot.includes('Morning');
  const previewAttendance = Math.min(96, Math.max(45, (isMorning ? 88 : 78) + (qtyNumber > 150 ? 5 : -5)));
  const previewRisk = previewAttendance >= 80 ? 'Low' : previewAttendance >= 60 ? 'Medium' : 'High';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          Mandi Digital Check-in
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
          Farmer Procurement Registration
        </h1>
        <p className="text-sm text-slate-400">
          Enter produce and vehicle details to receive an instant AI-matched centre recommendation, 
          shortest wait times, and a digital gate pass.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 sm:p-8 border border-emerald-500/20 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error banner */}
            {error && (
              <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs sm:text-sm flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Farmer Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  Farmer Full Name *
                </label>
                <input
                  id="farmer-name-input"
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Harpreet Singh"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  Mobile Number *
                </label>
                <input
                  id="farmer-phone-input"
                  type="tel"
                  name="phone"
                  required
                  maxLength={10}
                  placeholder="e.g. 9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 text-sm font-mono"
                />
              </div>
            </div>

            {/* Farm Location */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                Farm / Village Location *
              </label>
              <input
                id="farmer-location-input"
                type="text"
                name="location"
                required
                placeholder="Village name, Tehsil, or Landmark"
                value={formData.location}
                onChange={handleChange}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 text-sm mb-2"
              />

              {/* Location presets */}
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[11px] text-slate-500 self-center mr-1">Quick Select:</span>
                {locationPresets.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, location: loc }))}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                      formData.location === loc
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                        : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            {/* Crop Type & Quantity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Wheat className="w-3.5 h-3.5 text-emerald-400" />
                  Crop Type *
                </label>
                <select
                  id="crop-type-select"
                  name="crop_type"
                  value={formData.crop_type}
                  onChange={handleChange}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 text-sm"
                >
                  {cropOptions.map((crop) => (
                    <option key={crop.value} value={crop.value} className="bg-slate-900">
                      {crop.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-emerald-400" />
                  Expected Quantity (Quintals) *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="expected-quantity-input"
                    type="number"
                    name="expected_quantity"
                    min="1"
                    step="1"
                    required
                    placeholder="e.g. 150"
                    value={formData.expected_quantity}
                    onChange={handleChange}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 text-sm font-semibold"
                  />
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleQuantityAdjust(50)}
                      className="px-2 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-bold"
                    >
                      +50
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuantityAdjust(100)}
                      className="px-2 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-bold"
                    >
                      +100
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Type Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Vehicle Type (Weighbridge Alignment) *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {vehicleOptions.map((v) => {
                  const Icon = v.icon;
                  const isSelected = formData.vehicle_type === v.id;
                  return (
                    <div
                      key={v.id}
                      id={`vehicle-option-${v.id.toLowerCase()}`}
                      onClick={() => handleVehicleSelect(v.id)}
                      className={`cursor-pointer rounded-2xl p-3.5 border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-md shadow-emerald-950/40 ring-1 ring-emerald-500/40'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Icon className={`w-6 h-6 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </div>
                      <div>
                        <span className="font-bold text-sm text-white block">{v.label}</span>
                        <span className="text-[11px] text-slate-400 mt-0.5 block">{v.desc}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Preferred Time Slot */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                Preferred Arrival Window *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {timeSlots.map((slot) => {
                  const isSelected = formData.preferred_slot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, preferred_slot: slot }))}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                        isSelected
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                          : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="submit-farmer-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white font-bold text-sm sm:text-base shadow-xl shadow-emerald-600/30 hover:shadow-emerald-500/50 hover:from-emerald-400 hover:to-teal-400 transition-all active:scale-[0.99] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Saving & Running AI Optimization...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>Register & Get AI Centre Recommendation</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Live Preview Sidebar */}
        <div className="space-y-4">
          <div className="glass-card rounded-3xl p-5 sm:p-6 border border-emerald-500/20 space-y-4 sticky top-24">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-sm text-white font-display">
                Real-Time AI Intake Preview
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">Produce Payload</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold font-display text-white">
                    {formData.expected_quantity || 0}
                  </span>
                  <span className="text-slate-400">Quintals</span>
                </div>
                <span className="text-[11px] text-emerald-400 font-medium">
                  ~{(qtyNumber * 0.1).toFixed(1)} Metric Tonnes of {formData.crop_type}
                </span>
              </div>

              <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-slate-400">Predicted Attendance</span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      previewRisk === 'Low'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : previewRisk === 'Medium'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {previewRisk} Risk
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold font-display text-emerald-400">
                    {previewAttendance}%
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Calculated using vehicle type, dispatch window & volume stakes.
                </span>
              </div>

              <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 block">Dispatch Profile</span>
                <div className="flex items-center justify-between text-slate-200">
                  <span>Vehicle:</span>
                  <span className="font-semibold text-white">{formData.vehicle_type}</span>
                </div>
                <div className="flex items-center justify-between text-slate-200">
                  <span>Window:</span>
                  <span className="font-semibold text-white">{formData.preferred_slot.split(' ')[0]}</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-300 leading-relaxed">
              💡 <strong>Smart Allocation:</strong> Once submitted, our AI engine compares all nearby Mandis, assesses rain risk, and reserves your express weighbridge token.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
