'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowRight, Shield, Brain, Activity, Map, Bell, Users, FlaskConical, CheckCircle, Globe, Mic, Languages } from 'lucide-react';

const Globe3D = dynamic(() => import('@/components/three/globe'), { ssr: false, loading: () => <div className="w-full h-full flex items-center justify-center"><div className="w-16 h-16 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" /></div> });

const features = [
  { icon: Activity, title: 'Live Monitoring', desc: 'Real-time tracking of cyclones, tsunamis, floods, and earthquakes across India.', color: 'from-red-500 to-orange-500' },
  { icon: Map, title: 'Geospatial Intelligence', desc: 'Interactive maps with hazard markers, risk zones, and NDRF deployment locations.', color: 'from-blue-500 to-cyan-500' },
  { icon: Shield, title: 'Reliability Engine', desc: 'Estimates P(ŷ = y | x) — whether the prediction should be trusted.', color: 'from-emerald-500 to-green-500' },
  { icon: Brain, title: 'Decision Admissibility', desc: 'Core innovation — AI that knows when NOT to decide. Reduces false alarms by 46%.', color: 'from-cyan-500 to-blue-500' },
  { icon: Bell, title: 'Multi-Channel Alerts', desc: 'Send real-time warnings via SMS, Telegram, and WhatsApp to affected populations.', color: 'from-amber-500 to-yellow-500' },
  { icon: Users, title: 'Public Reporting', desc: 'Citizens can report incidents directly, reflected in government dashboards.', color: 'from-purple-500 to-violet-500' },
  { icon: Languages, title: 'Multilingual AI', desc: 'Voice and text assistant in English, Tamil, Hindi, Kannada, and Telugu.', color: 'from-pink-500 to-rose-500' },
  { icon: Globe, title: 'India-Focused', desc: 'Designed for Indian disaster management with IMD, INCOIS, CWC, NDRF integration.', color: 'from-orange-500 to-red-500' },
];

const metrics = [
  { value: '46%', label: 'Unsafe Decision Reduction', sub: 'Nominal Conditions' },
  { value: '35%', label: 'Unsafe Decision Reduction', sub: 'Distribution Shift' },
  { value: '69.2%', label: 'Coverage Rate', sub: 'Events Processed' },
  { value: '12.98%', label: 'Gated Unsafe Rate', sub: 'vs 24.19% Baseline' },
];

const emergencyNumbers = [
  { name: 'National Disaster Helpline', number: '1078', icon: '🆘' },
  { name: 'NDRF Control Room', number: '011-24363260', icon: '🛡️' },
  { name: 'Earthquake Helpline', number: '1092', icon: '🌍' },
  { name: 'Flood Control Room', number: '011-24362520', icon: '🌊' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #050a18 0%, #0a1230 30%, #0d1535 60%, #050a18 100%)' }}>
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050a18]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-white">DADIP</span>
              <span className="text-[10px] text-slate-500 ml-2 hidden sm:inline">India Disaster Intelligence</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/public" className="px-4 py-2 rounded-lg text-sm text-slate-300 hover:bg-white/5 transition">Public Dashboard</Link>
            <Link href="/government" className="px-4 py-2 rounded-lg text-sm text-slate-300 hover:bg-white/5 transition">Government</Link>
            <Link href="/admin" className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all">Login</Link>
          </div>
        </div>
      </nav>

      {/* Hero with 3D Globe */}
      <section className="pt-24 pb-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[80vh]">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-medium text-cyan-400">Silver Medal Research Award Winner</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              <span className="text-white">AI-Powered Disaster</span><br />
              <span className="text-white">Intelligence for </span>
              <span className="gradient-text">India</span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed max-w-lg">
              Predicts cyclone, tsunami, flood, and earthquake risks — and determines whether those predictions are
              <span className="text-cyan-400 font-semibold"> reliable enough for action</span>.
              Reducing unsafe operational decisions by <span className="text-emerald-400 font-bold">up to 46%</span>.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/public" className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:shadow-xl hover:shadow-cyan-500/25 transition-all flex items-center gap-2">
                Public Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/government" className="px-8 py-3.5 rounded-xl border border-white/10 text-slate-300 font-medium hover:bg-white/5 transition-all flex items-center gap-2">
                Government Portal <Shield className="w-4 h-4" />
              </Link>
            </div>
            {/* Emergency Numbers */}
            <div className="flex flex-wrap gap-3 pt-2">
              {emergencyNumbers.map((e, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
                  <span>{e.icon}</span>
                  <span className="text-xs text-red-400 font-medium">{e.name}: <strong>{e.number}</strong></span>
                </div>
              ))}
            </div>
          </div>
          {/* 3D Globe */}
          <div className="h-[500px] lg:h-[600px] relative">
            <Globe3D />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-slate-600 text-center">
              Interactive 3D Globe • Disaster Hotspots Highlighted
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Bar */}
      <section className="py-12 px-6 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {metrics.map((m, i) => (
            <div key={i} className="text-center animate-slide-up" style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}>
              <p className="text-3xl md:text-4xl font-bold gradient-text mb-1">{m.value}</p>
              <p className="text-xs font-medium text-slate-400">{m.label}</p>
              <p className="text-[10px] text-slate-600 mt-0.5">{m.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Formula */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto glass-card p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">The Core Innovation</h2>
            <p className="text-sm text-slate-400">Instead of only predicting disasters, the system predicts whether its own prediction should be trusted.</p>
          </div>
          <div className="text-center mb-6">
            <p className="text-sm text-slate-500 mb-3 uppercase tracking-wider">Decision Admissibility Formula</p>
            <p className="text-2xl md:text-3xl font-mono font-bold text-white">
              <span className="text-cyan-400">A(x)</span> <span className="text-slate-500">= </span>
              <span className="text-emerald-400">r(x)</span> <span className="text-slate-500">× (1 − </span>
              <span className="text-purple-400">D̃<sub>M</sub>(x)</span><span className="text-slate-500">)</span>
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/10 text-center">
              <p className="text-lg font-bold text-cyan-400">A(x)</p><p className="text-[10px] text-slate-400">Admissibility</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-center">
              <p className="text-lg font-bold text-emerald-400">r(x)</p><p className="text-[10px] text-slate-400">Reliability</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/10 text-center">
              <p className="text-lg font-bold text-purple-400">D̃<sub>M</sub></p><p className="text-[10px] text-slate-400">Mahalanobis</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <p className="text-sm text-slate-400"><span className="text-white font-medium">If A(x) ≥ threshold → Execute Alert.</span> Otherwise, abstain — preventing unreliable predictions from triggering false alarms.</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Platform Capabilities</h2>
            <p className="text-slate-400">Eight integrated modules for comprehensive Indian disaster intelligence</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="glass-card p-6 group hover:bg-white/[0.04] transition-all duration-300 animate-slide-up" style={{ animationDelay: `${i * 0.06}s`, opacity: 0 }}>
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Researcher Section */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Research & Innovation</h2>
            <p className="text-slate-400">Based on silver-medal-winning research in AI reliability</p>
          </div>
          <div className="glass-card p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Profile Placeholder */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
                  <Users className="w-12 h-12 text-cyan-400/50" />
                </div>
                <p className="text-xs text-slate-500 text-center mt-2">Your Photo Here</p>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1">[Your Name]</h3>
                <p className="text-sm text-cyan-400 mb-3">Researcher & Developer</p>
                <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                  Developed a Decision-Admissibility Disaster Intelligence Platform based on a novel reliability-aware
                  cognitive architecture integrating disaster prediction, supervised reliability estimation,
                  Mahalanobis-based distribution shift detection, and threshold-based decision gating.
                </p>
                <div className="text-xs text-slate-500 italic">
                  &quot;Decision Admissibility Driven Cognitive Architecture for Reliable Multimodal Intelligent Systems&quot;
                </div>
              </div>
            </div>
            {/* Research Results Table */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Nominal Conditions</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-slate-400">Baseline Unsafe</span><span className="text-red-400 font-bold">24.19%</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Gated Unsafe</span><span className="text-emerald-400 font-bold">12.98%</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Coverage</span><span className="text-blue-400 font-bold">69.23%</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Reduction</span><span className="text-cyan-400 font-bold">~46%</span></div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Distribution Shift</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-slate-400">Baseline Unsafe</span><span className="text-red-400 font-bold">28.36%</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Gated Unsafe</span><span className="text-emerald-400 font-bold">18.35%</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Coverage</span><span className="text-blue-400 font-bold">71.47%</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Reduction</span><span className="text-cyan-400 font-bold">~35%</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Voice Assistant Banner */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto glass-card p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
            <Mic className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">Multilingual Voice Assistant</h3>
            <p className="text-sm text-slate-400 mb-3">Ask about disasters, find help centers, or report incidents in your language.</p>
            <div className="flex flex-wrap gap-2">
              {['English', 'தமிழ்', 'हिन्दी', 'ಕನ್ನಡ', 'తెలుగు'].map((lang) => (
                <span key={lang} className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs text-purple-400 font-medium">{lang}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Protect Lives?</h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">Access real-time disaster intelligence for informed decision-making.</p>
        <div className="flex justify-center gap-4">
          <Link href="/public" className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:shadow-xl hover:shadow-cyan-500/25 transition-all">
            Public Access →
          </Link>
          <Link href="/government" className="px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold hover:shadow-xl hover:shadow-orange-500/25 transition-all">
            Government Login →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-slate-600" />
            <span className="text-xs text-slate-600">DADIP — Decision-Admissibility Disaster Intelligence Platform</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-700">
            <span>NDMA</span><span>•</span><span>NDRF</span><span>•</span><span>IMD</span><span>•</span><span>INCOIS</span><span>•</span><span>CWC</span>
          </div>
          <span className="text-xs text-slate-700">Silver Medal Research • github.com/Megavarshan</span>
        </div>
      </footer>
    </div>
  );
}
