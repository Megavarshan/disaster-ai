'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowRight, Shield, Brain, Activity, Map, Bell, Users, FlaskConical, CheckCircle, Globe, Mic, Languages, FileText } from 'lucide-react';

const Globe3D = dynamic(() => import('@/components/three/globe'), { ssr: false, loading: () => <div className="w-full h-full flex items-center justify-center"><div className="w-16 h-16 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" /></div> });

const features = [
  { icon: Activity, title: 'Live Monitoring', desc: 'Real-time tracking of cyclones, tsunamis, floods, and earthquakes.', color: 'from-red-500 to-orange-500' },
  { icon: Map, title: 'Geospatial Intelligence', desc: 'Interactive maps with hazard markers, risk zones, and NDRF deployment locations.', color: 'from-blue-500 to-cyan-500' },
  { icon: Shield, title: 'Reliability Engine', desc: 'Evaluates the confidence and uncertainty of AI predictions in real-time.', color: 'from-emerald-500 to-green-500' },
  { icon: Brain, title: 'Smart Gating', desc: 'Core innovation — AI that knows when NOT to decide based on data anomalies.', color: 'from-cyan-500 to-blue-500' },
  { icon: Bell, title: 'Multi-Channel Alerts', desc: 'Send real-time warnings via SMS, Telegram, and WhatsApp to affected populations.', color: 'from-amber-500 to-yellow-500' },
  { icon: Users, title: 'Public Reporting', desc: 'Citizens can report incidents directly, reflected in government dashboards.', color: 'from-purple-500 to-violet-500' },
  { icon: Languages, title: 'Multilingual AI', desc: 'Voice and text assistant in English, Tamil, Hindi, Kannada, and Telugu.', color: 'from-pink-500 to-rose-500' },
  { icon: Globe, title: 'India-Focused', desc: 'Designed for Indian disaster management with IMD, INCOIS, CWC, NDRF integration.', color: 'from-orange-500 to-red-500' },
];

const metrics = [
  { value: '46%', label: 'Unsafe Decision Reduction', sub: 'Nominal Conditions' },
  { value: '35%', label: 'Unsafe Decision Reduction', sub: 'Anomalous Data' },
  { value: '69.2%', label: 'Coverage Rate', sub: 'Events Processed' },
  { value: '12.98%', label: 'Gated Unsafe Rate', sub: 'vs 24.19% Baseline' },
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
              <span className="text-[10px] text-slate-500 ml-2 hidden sm:inline">Disaster Intelligence</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/public" className="text-sm text-slate-300 hover:text-white transition">Public</Link>
            <Link href="/government" className="text-sm text-slate-300 hover:text-white transition">Government</Link>
            <Link href="/about" className="text-sm text-cyan-400 font-medium hover:text-cyan-300 transition">About Developer</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-28 pb-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[75vh]">
          
          {/* Left: Text Content */}
          <div className="lg:col-span-5 space-y-8 z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-medium text-cyan-400">Award Winning AI Research Project</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              <span className="text-white">AI-Powered Disaster</span><br />
              <span className="text-white">Intelligence for </span>
              <span className="gradient-text">India</span>
            </h1>
            <p className="text-base text-slate-400 leading-relaxed">
              Predicts disaster risks and utilizes an advanced uncertainty gating mechanism to determine if those predictions are
              <span className="text-cyan-400 font-semibold"> reliable enough for action</span>.
              Reducing unsafe operational decisions by <span className="text-emerald-400 font-bold">up to 46%</span>.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/public" className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:shadow-xl hover:shadow-cyan-500/25 transition-all flex items-center gap-2">
                Public Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/government" className="px-6 py-3 rounded-xl border border-white/10 text-slate-300 font-medium hover:bg-white/5 transition-all flex items-center gap-2">
                Government Portal <Shield className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right: Globe and Developer Card */}
          <div className="lg:col-span-7 relative h-[500px] lg:h-[600px] flex items-center justify-end">
            {/* 3D Globe Background */}
            <div className="absolute inset-0 z-0">
              <Globe3D />
            </div>

            {/* Developer Card overlay */}
            <div className="relative z-10 glass-card p-5 w-full max-w-sm mr-4 md:mr-10 animate-float border-cyan-500/30 shadow-2xl shadow-cyan-900/20 bg-[#0a1228]/80">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 p-1">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#050a18] flex items-center justify-center relative">
                    <img src="/megavarshan.jpg" alt="Megavarshan A" className="absolute inset-0 w-full h-full object-cover z-10" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    <Users className="w-8 h-8 text-cyan-400 absolute z-0" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Megavarshan A</h3>
                  <p className="text-xs text-cyan-400 font-medium">Lead Developer & Researcher</p>
                </div>
              </div>
              <div className="space-y-2 text-xs text-slate-300 mb-4">
                <p className="flex items-center gap-2"><span className="text-emerald-400">🎓</span> Final Year AI Undergrad at SRMIST, Chennai</p>
                <p className="flex items-center gap-2"><span className="text-purple-400">🚀</span> Co-Founder, Foresight-X Research Labs</p>
                <p className="flex items-center gap-2"><span className="text-amber-400">🏆</span> Award Winner at SRM Research Day 2026</p>
              </div>
              <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                <Link href="/about" className="flex-1 py-2 text-center rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition">
                  View Full Profile
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Metrics Bar */}
      <section className="py-12 px-6 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {metrics.map((m, i) => (
            <div key={i} className="text-center animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <p className="text-3xl md:text-4xl font-bold gradient-text mb-1">{m.value}</p>
              <p className="text-xs font-medium text-slate-400">{m.label}</p>
              <p className="text-[10px] text-slate-600 mt-0.5">{m.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Innovation (Obfuscated Formula) */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto glass-card p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">The Core Innovation</h2>
            <p className="text-sm text-slate-400">Instead of only predicting disasters, the system assesses uncertainty to predict if its own prediction should be trusted.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/10 text-center">
              <Brain className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-white mb-1">Risk Assessment</p>
              <p className="text-[10px] text-slate-400">Multi-hazard predictions</p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-center">
              <Shield className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-white mb-1">Reliability Estimation</p>
              <p className="text-[10px] text-slate-400">Prediction confidence</p>
            </div>
            <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10 text-center">
              <Activity className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-white mb-1">Anomaly Detection</p>
              <p className="text-[10px] text-slate-400">Data shift metrics</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <p className="text-sm text-slate-400"><span className="text-white font-medium">Smart Gating:</span> If confidence is high and data is normal, the alert executes. Otherwise, the system abstains — preventing false alarms.</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Platform Capabilities</h2>
            <p className="text-slate-400">Integrated modules for comprehensive Indian disaster intelligence</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="glass-card p-6 group hover:bg-white/[0.04] transition-all duration-300">
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
            <h2 className="text-3xl font-bold text-white mb-4">Award-Winning Research</h2>
            <p className="text-slate-400">Built on state-of-the-art AI reliability frameworks</p>
          </div>
          <div className="glass-card p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1">Megavarshan A</h3>
                <p className="text-sm text-cyan-400 mb-3">Lead Researcher • SRMIST</p>
                <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                  Developed an advanced disaster intelligence platform utilizing a novel reliability-aware architecture. The system intelligently integrates real-time hazard prediction with uncertainty estimation and data shift monitoring to dynamically gate critical operational decisions.
                </p>
                <Link href="/about" className="inline-flex items-center gap-2 text-sm text-emerald-400 font-medium hover:text-emerald-300">
                  Learn more about the developer <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-slate-600" />
            <span className="text-xs text-slate-600">DADIP — Disaster Intelligence Platform</span>
          </div>
          <span className="text-xs text-slate-700">Award Winning AI Research • github.com/Megavarshan</span>
        </div>
      </footer>
    </div>
  );
}
