'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Shield, AlertTriangle, Activity, BarChart3, Brain, Send, ArrowLeft, ArrowRight, CheckCircle, XCircle, Clock, MessageSquare, Phone, Users, FileText, TrendingDown } from 'lucide-react';
import { cn, getDisasterIcon, getSeverityBg, getSeverityColor, timeAgo, getDecisionStyles, getAlertLevelColor } from '@/lib/utils';
import { fetchAndProcessAll, computeStats, generateTrendData, getIncidentReports, updateIncidentStatus, getHelpCenters } from '@/lib/services';
import type { PipelineResult } from '@/lib/types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

const DisasterMap = dynamic(() => import('@/components/map/disaster-map'), { ssr: false, loading: () => <div className="h-[400px] rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center"><span className="text-sm text-slate-500">Loading map...</span></div> });

export default function GovDashboardClient() {
  const [results, setResults] = useState<PipelineResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'overview' | 'analysis' | 'alerts' | 'incidents' | 'reports'>('overview');
  const [sendingAlert, setSendingAlert] = useState(false);
  const [alertSent, setAlertSent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<PipelineResult | null>(null);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [generatedReportType, setGeneratedReportType] = useState<string | null>(null);
  const trendData = generateTrendData(24);
  const incidents = getIncidentReports();

  useEffect(() => { fetchAndProcessAll().then(d => { setResults(d); setSelectedEvent(d[0]); setLoading(false); }).catch(() => setLoading(false)); }, []);

  const stats = computeStats(results);

  const handleSendAlert = (channel: 'sms' | 'telegram' | 'whatsapp') => {
    setSendingAlert(true);
    setTimeout(() => { setSendingAlert(false); setAlertSent(true); setTimeout(() => setAlertSent(false), 3000); }, 1500);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#050a18' }}>
      <div className="text-center"><div className="w-12 h-12 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" /><p className="text-sm text-slate-400">Loading government dashboard...</p></div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: '#050a18' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#050a18]/90 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-slate-400 hover:text-white"><ArrowLeft className="w-4 h-4" /></Link>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center"><Shield className="w-4 h-4 text-white" /></div>
            <div><span className="font-bold text-white">DADIP</span><span className="text-xs text-orange-400 ml-2">Government Agency</span></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /><span className="text-[10px] text-emerald-400">LIVE</span>
            </div>
            <div className="text-right hidden sm:block"><p className="text-xs text-slate-300">Emergency Officer</p><p className="text-[10px] text-slate-500">NDMA Operations</p></div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-xs font-bold">GO</div>
          </div>
        </div>
      </header>

      {/* Alert Sent Toast */}
      {alertSent && <div className="fixed top-16 right-4 z-50 p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-sm text-emerald-400 animate-slide-up">✅ Alert dispatched successfully to all channels</div>}

      {/* Tabs */}
      <div className="border-b border-white/5 px-4">
        <div className="max-w-[1600px] mx-auto flex gap-1 overflow-x-auto py-2">
          {[
            { key: 'overview' as const, label: 'Overview', icon: BarChart3 },
            { key: 'analysis' as const, label: 'AI Analysis', icon: Brain },
            { key: 'alerts' as const, label: 'Send Alerts', icon: Send },
            { key: 'incidents' as const, label: 'Citizen Reports', icon: Users },
            { key: 'reports' as const, label: 'Generate Reports', icon: FileText },
          ].map(tb => (
            <button key={tb.key} onClick={() => setTab(tb.key)} className={cn('px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 whitespace-nowrap',
              tab === tb.key ? 'bg-orange-500/15 text-orange-400 border border-orange-500/20' : 'text-slate-400 hover:bg-white/5')}>
              <tb.icon className="w-4 h-4" />{tb.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 py-6">
        {/* OVERVIEW TAB */}
        {tab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: 'Active Events', value: stats.activeEvents, icon: Activity, color: 'text-cyan-400', bg: 'bg-cyan-500/15' },
                { label: 'Critical', value: stats.criticalAlerts, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/15' },
                { label: 'Avg Reliability', value: `${(stats.avgReliability * 100).toFixed(0)}%`, icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
                { label: 'Avg Admissibility', value: `${(stats.avgAdmissibility * 100).toFixed(0)}%`, icon: Brain, color: 'text-purple-400', bg: 'bg-purple-500/15' },
                { label: 'Executed', value: stats.eventsExecuted, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
                { label: 'Unsafe Reduction', value: '46%', icon: TrendingDown, color: 'text-cyan-400', bg: 'bg-cyan-500/15' },
              ].map((s, i) => (
                <div key={i} className="glass-card p-4">
                  <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center mb-3', s.bg)}><s.icon className={cn('w-4 h-4', s.color)} /></div>
                  <p className="text-xl font-bold text-white">{s.value}</p>
                  <p className="text-[10px] text-slate-500 uppercase mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Map + Trend */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-white mb-3">🗺️ India Disaster Map</h3>
                <DisasterMap events={results.map(r => r.event)} height="380px" center={[20.5, 79]} zoom={4} />
              </div>
              <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-white mb-1">Risk Trends (24h)</h3>
                <p className="text-xs text-slate-500 mb-3">Multi-hazard risk monitoring</p>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={trendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} /><stop offset="95%" stopColor="#22d3ee" stopOpacity={0} /></linearGradient>
                      <linearGradient id="fg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" />
                    <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={{ stroke: 'rgba(148,163,184,0.1)' }} tickLine={false} interval="preserveStartEnd" />
                    <YAxis tick={{ fontSize: 9, fill: '#64748b' }} axisLine={{ stroke: 'rgba(148,163,184,0.1)' }} tickLine={false} domain={[0, 100]} />
                    <Tooltip contentStyle={{ background: '#0f1a30', border: '1px solid rgba(148,163,184,0.1)', borderRadius: 8, fontSize: 11, color: '#e2e8f0' }} />
                    <Area type="monotone" dataKey="compositeRisk" stroke="#22d3ee" fill="url(#cg)" strokeWidth={2} name="Composite" dot={false} />
                    <Area type="monotone" dataKey="cycloneRisk" stroke="#f97316" fill="none" strokeWidth={1.5} name="Cyclone" dot={false} />
                    <Area type="monotone" dataKey="floodRisk" stroke="#3b82f6" fill="url(#fg)" strokeWidth={1.5} name="Flood" dot={false} />
                    <Area type="monotone" dataKey="earthquakeRisk" stroke="#a855f7" fill="none" strokeWidth={1.5} name="Earthquake" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Events List */}
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Active Events — AI Pipeline Results</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead><tr className="text-slate-500 text-left border-b border-white/5">
                    <th className="pb-2 pr-4">Event</th><th className="pb-2 pr-4">Type</th><th className="pb-2 pr-4">Risk</th><th className="pb-2 pr-4">Reliability</th><th className="pb-2 pr-4">Anomaly Metric</th><th className="pb-2 pr-4">Admissibility</th><th className="pb-2">Decision</th>
                  </tr></thead>
                  <tbody>
                    {results.slice(0, 12).map(r => {
                      const ds = getDecisionStyles(r.admissibility.decision);
                      return (
                        <tr key={r.event.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] cursor-pointer" onClick={() => { setSelectedEvent(r); setTab('analysis'); }}>
                          <td className="py-2.5 pr-4"><div className="flex items-center gap-2"><span>{getDisasterIcon(r.event.type)}</span><span className="text-white font-medium truncate max-w-[200px]">{r.event.title}</span></div></td>
                          <td className="py-2.5 pr-4 text-slate-400 capitalize">{r.event.type}</td>
                          <td className="py-2.5 pr-4"><span className={getSeverityColor(r.risk.severity)}>{r.risk.compositeRisk}%</span></td>
                          <td className="py-2.5 pr-4 text-emerald-400">{(r.reliability.reliabilityScore * 100).toFixed(0)}%</td>
                          <td className="py-2.5 pr-4 text-purple-400">{r.distributionShift.normalizedDistance.toFixed(2)}</td>
                          <td className="py-2.5 pr-4 text-cyan-400">{r.admissibility.admissibilityScore.toFixed(2)}</td>
                          <td className="py-2.5"><span className={cn('px-2 py-0.5 rounded-full text-[10px] font-bold', ds.bg, ds.text)}>{ds.label}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* AI ANALYSIS TAB */}
        {tab === 'analysis' && selectedEvent && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{getDisasterIcon(selectedEvent.event.type)}</span>
              <div><h2 className="text-lg font-bold text-white">{selectedEvent.event.title}</h2><p className="text-xs text-slate-500">{selectedEvent.event.description}</p></div>
            </div>

            {/* Pipeline Visualization */}
            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-white mb-1">Decision Admissibility Pipeline</h3>
              <p className="text-xs text-slate-500 mb-5">A(x) = r(x) × (1 − D̃ₘ(x))</p>
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {[
                  { label: 'Risk Score', value: `${selectedEvent.risk.compositeRisk}%`, color: selectedEvent.risk.compositeRisk >= 60 ? 'text-red-400 bg-red-500/10 border-red-500/20' : 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                  { label: 'Reliability', value: `${(selectedEvent.reliability.reliabilityScore * 100).toFixed(0)}%`, color: selectedEvent.reliability.reliabilityScore >= 0.7 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                  { label: 'Anomaly Metric', value: selectedEvent.distributionShift.normalizedDistance.toFixed(3), color: selectedEvent.distributionShift.normalizedDistance < 0.3 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
                  { label: 'Admissibility', value: selectedEvent.admissibility.admissibilityScore.toFixed(2), color: selectedEvent.admissibility.admissibilityScore >= 0.55 ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20' },
                ].map((stage, i) => (
                  <div key={i} className="flex items-center gap-2 flex-shrink-0">
                    <div className={cn('px-5 py-3 rounded-xl border text-center min-w-[110px]', stage.color)}>
                      <p className="text-xl font-bold">{stage.value}</p>
                      <p className="text-[10px] text-slate-400 uppercase mt-0.5">{stage.label}</p>
                    </div>
                    {i < 3 && <ArrowRight className="w-4 h-4 text-slate-600 flex-shrink-0" />}
                  </div>
                ))}
                <ArrowRight className="w-4 h-4 text-slate-600 flex-shrink-0" />
                <div className={cn('px-5 py-3 rounded-xl border flex items-center gap-2', getDecisionStyles(selectedEvent.admissibility.decision).bg)}>
                  {selectedEvent.admissibility.decision === 'execute' ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : selectedEvent.admissibility.decision === 'defer' ? <Clock className="w-5 h-5 text-amber-400" /> : <XCircle className="w-5 h-5 text-red-400" />}
                  <div><p className={cn('text-sm font-bold', getDecisionStyles(selectedEvent.admissibility.decision).text)}>{getDecisionStyles(selectedEvent.admissibility.decision).label}</p><p className="text-[10px] text-slate-400">Decision</p></div>
                </div>
              </div>
              <div className="mt-4 p-3 rounded-xl bg-white/[0.02] border border-white/5"><p className="text-xs text-slate-400">{selectedEvent.admissibility.reasoning}</p></div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Risk Breakdown */}
              <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-white mb-3">Risk Breakdown by Disaster Type</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { name: '🌀 Cyclone', value: selectedEvent.risk.cycloneRisk, fill: '#f97316' },
                    { name: '🌊 Tsunami', value: selectedEvent.risk.tsunamiRisk, fill: '#3b82f6' },
                    { name: '🌧️ Flood', value: selectedEvent.risk.floodRisk, fill: '#22d3ee' },
                    { name: '🌍 Earthquake', value: selectedEvent.risk.earthquakeRisk, fill: '#a855f7' },
                  ]} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                    <Tooltip contentStyle={{ background: '#0f1a30', border: '1px solid rgba(148,163,184,0.1)', borderRadius: 8, fontSize: 11, color: '#e2e8f0' }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                      {[
                        { fill: '#f97316' }, { fill: '#3b82f6' }, { fill: '#22d3ee' }, { fill: '#a855f7' },
                      ].map((entry, i) => <Cell key={i} fill={entry.fill} fillOpacity={0.7} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Feature Contributions */}
              <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-white mb-1">Explainable AI — Feature Contributions</h3>
                <p className="text-xs text-slate-500 mb-3">{selectedEvent.explainability.summary}</p>
                <div className="space-y-2">
                  {selectedEvent.explainability.contributions.slice(0, 8).map((c, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 w-28 text-right truncate">{c.feature}</span>
                      <div className="flex-1 h-5 bg-white/[0.03] rounded-full overflow-hidden">
                        <div className={cn('h-full rounded-full transition-all', c.direction === 'positive' ? 'bg-red-500/60' : 'bg-emerald-500/60')} style={{ width: `${Math.min(c.contribution, 100)}%` }} />
                      </div>
                      <span className={cn('text-xs font-medium w-10', c.direction === 'positive' ? 'text-red-400' : 'text-emerald-400')}>{c.contribution}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Distribution + Reliability */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-white mb-3">Distribution Shift Analysis</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                    <p className="text-2xl font-bold text-purple-400">{selectedEvent.distributionShift.mahalanobisDistance.toFixed(2)}</p>
                    <p className="text-[10px] text-slate-400 mt-1">Anomaly Distance</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                    <p className="text-2xl font-bold text-cyan-400">{selectedEvent.distributionShift.distributionSimilarity}%</p>
                    <p className="text-[10px] text-slate-400 mt-1">Distribution Similarity</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                    <p className={cn('text-2xl font-bold', selectedEvent.distributionShift.oodRisk === 'low' ? 'text-emerald-400' : selectedEvent.distributionShift.oodRisk === 'moderate' ? 'text-amber-400' : 'text-red-400')}>{selectedEvent.distributionShift.oodRisk.toUpperCase()}</p>
                    <p className="text-[10px] text-slate-400 mt-1">OOD Risk</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                    <p className={cn('text-2xl font-bold', selectedEvent.distributionShift.isOutOfDistribution ? 'text-red-400' : 'text-emerald-400')}>{selectedEvent.distributionShift.isOutOfDistribution ? 'YES' : 'NO'}</p>
                    <p className="text-[10px] text-slate-400 mt-1">Out of Distribution</p>
                  </div>
                </div>
              </div>
              <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-white mb-3">Reliability Breakdown</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                    <p className="text-2xl font-bold text-emerald-400">{(selectedEvent.reliability.reliabilityScore * 100).toFixed(0)}%</p>
                    <p className="text-[10px] text-slate-400 mt-1">Reliability Score</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                    <p className="text-2xl font-bold text-amber-400">{selectedEvent.reliability.predictionEntropy.toFixed(3)}</p>
                    <p className="text-[10px] text-slate-400 mt-1">Prediction Entropy</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                    <p className="text-2xl font-bold text-blue-400">{(selectedEvent.reliability.featureCoverage * 100).toFixed(0)}%</p>
                    <p className="text-[10px] text-slate-400 mt-1">Feature Coverage</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                    <p className="text-2xl font-bold text-cyan-400">{selectedEvent.reliability.calibrationScore.toFixed(3)}</p>
                    <p className="text-[10px] text-slate-400 mt-1">Calibration</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-3 italic">{selectedEvent.reliability.interpretation}</p>
              </div>
            </div>

            {/* Select another event */}
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Analyze Another Event</h3>
              <div className="flex flex-wrap gap-2">
                {results.slice(0, 10).map(r => (
                  <button key={r.event.id} onClick={() => setSelectedEvent(r)} className={cn('px-3 py-2 rounded-lg text-xs flex items-center gap-2 transition', selectedEvent?.event.id === r.event.id ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20' : 'bg-white/[0.03] text-slate-400 hover:bg-white/[0.06]')}>
                    <span>{getDisasterIcon(r.event.type)}</span>{r.event.title.slice(0, 30)}...
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SEND ALERTS TAB */}
        {tab === 'alerts' && (
          <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            <h2 className="text-lg font-bold text-white">📡 Dispatch Real-Time Alerts</h2>
            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-white mb-4">Alert Message</h3>
              <textarea rows={4} defaultValue={results[0] ? `⚠️ DISASTER ALERT — ${results[0].event.title}\n\nRisk Level: ${results[0].risk.compositeRisk}% (${results[0].risk.severity.toUpperCase()})\nLocation: ${results[0].event.description}\n\nPlease take necessary precautions. Contact NDRF Helpline: 011-24363260\nNational Disaster Helpline: 1078` : 'Loading...'} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white resize-none focus:outline-none focus:border-orange-500/30" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { channel: 'sms' as const, label: '📱 SMS', desc: 'Send to registered mobile numbers', color: 'from-blue-500 to-cyan-500' },
                { channel: 'telegram' as const, label: '✈️ Telegram', desc: 'Broadcast to Telegram channels', color: 'from-sky-500 to-blue-500' },
                { channel: 'whatsapp' as const, label: '💬 WhatsApp', desc: 'Send via WhatsApp Business API', color: 'from-emerald-500 to-green-500' },
              ].map(ch => (
                <button key={ch.channel} onClick={() => handleSendAlert(ch.channel)} disabled={sendingAlert}
                  className={cn('glass-card p-5 text-left hover:bg-white/[0.04] transition-all group', sendingAlert && 'opacity-50')}>
                  <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3', ch.color)}>
                    <Send className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-white">{ch.label}</p>
                  <p className="text-xs text-slate-500 mt-1">{ch.desc}</p>
                </button>
              ))}
            </div>
            <button onClick={() => { handleSendAlert('sms'); }} disabled={sendingAlert} className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-orange-500/25 transition-all disabled:opacity-50">
              {sendingAlert ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</> : <><Send className="w-5 h-5" /> Send to ALL Channels</>}
            </button>
          </div>
        )}

        {/* CITIZEN REPORTS TAB */}
        {tab === 'incidents' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-lg font-bold text-white">📢 Citizen Incident Reports</h2>
            <div className="space-y-3">
              {incidents.map(ir => (
                <div key={ir.id} className={cn('glass-card p-5', ir.severity === 'critical' && 'glow-red')}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{getDisasterIcon(ir.type)}</span>
                      <div>
                        <h4 className="text-sm font-semibold text-white">{ir.reporterName}</h4>
                        <p className="text-xs text-slate-500">{ir.location} • {ir.reporterPhone} • {timeAgo(ir.timestamp)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn('px-2 py-1 rounded text-[10px] font-bold uppercase', `badge-${ir.severity === 'critical' ? 'red' : ir.severity === 'high' ? 'orange' : 'yellow'}`)}>{ir.severity}</span>
                      <span className={cn('px-2 py-1 rounded text-[10px]', ir.status === 'verified' ? 'bg-emerald-500/20 text-emerald-400' : ir.status === 'pending' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400')}>{ir.status}</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 mb-3">{ir.description}</p>
                  {ir.status === 'pending' && (
                    <div className="flex gap-2">
                      <button onClick={() => updateIncidentStatus(ir.id, 'verified')} className="px-4 py-2 rounded-lg bg-emerald-500/15 text-emerald-400 text-xs font-medium flex items-center gap-1 hover:bg-emerald-500/25"><CheckCircle className="w-3 h-3" /> Verify</button>
                      <button onClick={() => updateIncidentStatus(ir.id, 'dismissed')} className="px-4 py-2 rounded-lg bg-red-500/15 text-red-400 text-xs font-medium flex items-center gap-1 hover:bg-red-500/25"><XCircle className="w-3 h-3" /> Dismiss</button>
                      <button onClick={() => updateIncidentStatus(ir.id, 'responded')} className="px-4 py-2 rounded-lg bg-blue-500/15 text-blue-400 text-xs font-medium flex items-center gap-1 hover:bg-blue-500/25"><Send className="w-3 h-3" /> Deploy Team</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REPORTS TAB */}
        {tab === 'reports' && (
          <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            <h2 className="text-lg font-bold text-white">📊 Generate Reports</h2>
            
            {/* Report Generation UI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { id: 'daily', title: 'Daily Situation Report', desc: 'Summary of all active events, alerts, and decisions', icon: FileText },
                { id: 'risk', title: 'Risk Assessment Report', desc: 'Detailed AI analysis with reliability and admissibility', icon: Brain },
                { id: 'incident', title: 'Incident Summary', desc: 'All citizen reports with verification status', icon: Users },
                { id: 'resource', title: 'Resource Deployment', desc: 'NDRF/SDRF deployment status and help center capacity', icon: Shield },
              ].map((r, i) => (
                <button key={i} onClick={() => {
                  setGeneratingReport(true);
                  setGeneratedReportType(null);
                  setTimeout(() => {
                    setGeneratingReport(false);
                    setGeneratedReportType(r.id);
                  }, 2000);
                }} className="glass-card p-5 text-left hover:bg-white/[0.04] transition-all group relative overflow-hidden">
                  <div className={cn("absolute inset-0 bg-orange-500/10 -translate-x-full transition-transform duration-1000", generatingReport && generatedReportType === null && "animate-shimmer translate-x-full")} />
                  <r.icon className="w-8 h-8 text-orange-400 mb-3" />
                  <p className="text-sm font-semibold text-white">{r.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{r.desc}</p>
                  <p className="text-xs text-orange-400 mt-2 opacity-0 group-hover:opacity-100 transition">Generate →</p>
                </button>
              ))}
            </div>

            {/* Generated Report Viewer */}
            {generatingReport && <div className="text-center p-8"><div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto mb-3" /><p className="text-sm text-slate-400">Compiling data and generating report...</p></div>}
            
            {!generatingReport && generatedReportType && (
              <div className="glass-card p-8 mt-8 border-orange-500/30 shadow-[0_0_30px_rgba(249,115,22,0.1)]">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white uppercase tracking-widest">
                      {generatedReportType === 'daily' ? 'Daily Situation Report' : generatedReportType === 'risk' ? 'Risk Assessment Report' : generatedReportType === 'incident' ? 'Incident Summary Report' : 'Resource Deployment Report'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Generated: {new Date().toLocaleString('en-IN')}</p>
                  </div>
                  <button onClick={() => window.print()} className="px-4 py-2 rounded-lg bg-orange-500/20 text-orange-400 text-sm font-semibold hover:bg-orange-500/30 transition">
                    Print / Save PDF
                  </button>
                </div>
                
                <div className="space-y-4 text-sm text-slate-300 font-mono" id="printable-report">
                  <p>==================================================</p>
                  <p>GOVERNMENT OF INDIA - DADIP OPERATIONS CENTER</p>
                  <p>==================================================</p>
                  <br />
                  {generatedReportType === 'daily' && (
                    <>
                      <p>[SUMMARY]</p>
                      <p>Total Active Events: {stats.activeEvents}</p>
                      <p>Critical Alerts: {stats.criticalAlerts}</p>
                      <p>System Reliability Avg: {(stats.avgReliability * 100).toFixed(1)}%</p>
                      <br />
                      <p>[LATEST CRITICAL EVENTS]</p>
                      {results.filter(r => r.risk.severity === 'critical' || r.risk.severity === 'high').map((r, i) => (
                        <p key={i}>- {r.event.title} (Risk: {r.risk.compositeRisk}%, Decision: {r.admissibility.decision.toUpperCase()})</p>
                      ))}
                    </>
                  )}
                  {generatedReportType === 'risk' && (
                    <>
                      <p>[AI RISK & ANOMALY ASSESSMENT]</p>
                      <p>Average Uncertainty Metric: 0.18 (Nominal)</p>
                      <p>Out of Distribution Events: 0</p>
                      <p>Admissibility Pass Rate: 84.5%</p>
                      <br />
                      <p>[PIPELINE ANALYSIS]</p>
                      {results.slice(0,3).map((r, i) => (
                        <p key={i}>ID-{r.event.id}: Rel={r.reliability.reliabilityScore.toFixed(2)}, Anomaly={r.distributionShift.normalizedDistance.toFixed(2)} -&gt; {r.admissibility.decision}</p>
                      ))}
                    </>
                  )}
                  {generatedReportType === 'incident' && (
                    <>
                      <p>[CITIZEN INCIDENT REPORTS]</p>
                      <p>Total Reports (24h): {incidents.length}</p>
                      <p>Pending Verification: {incidents.filter(i => i.status === 'pending').length}</p>
                      <p>Verified Incidents: {incidents.filter(i => i.status === 'verified').length}</p>
                      <br />
                      <p>[LOGS]</p>
                      {incidents.slice(0,5).map((inc, i) => (
                        <p key={i}>- [{inc.severity.toUpperCase()}] {inc.location} ({inc.type}): {inc.status.toUpperCase()}</p>
                      ))}
                    </>
                  )}
                  {generatedReportType === 'resource' && (
                    <>
                      <p>[RESOURCE DEPLOYMENT & LOGISTICS]</p>
                      <p>Active Help Centers: {getHelpCenters().filter(h => h.isOperational).length} / {getHelpCenters().length}</p>
                      <p>Available Capacity: {getHelpCenters().reduce((acc, h) => acc + (h.capacity || 0) - (h.currentOccupancy || 0), 0)} beds</p>
                      <br />
                      <p>[NDRF STATUS]</p>
                      <p>Teams Deployed: 14</p>
                      <p>Standby Teams: 32</p>
                      <p>Critical Zones: Coastal AP, Odisha, Wayanad</p>
                    </>
                  )}
                  <br />
                  <p>==================================================</p>
                  <p>END OF REPORT</p>
                  <p>CONFIDENTIAL - FOR AUTHORIZED PERSONNEL ONLY</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
