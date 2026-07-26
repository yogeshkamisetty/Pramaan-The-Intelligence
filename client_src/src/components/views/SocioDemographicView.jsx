import React, { useState } from 'react';
import { WorkPanel } from '../ui/Layout.jsx';
import { 
  BarChart3, TrendingUp, Users, ShieldAlert, AlertTriangle, Activity, 
  BrainCircuit, DollarSign, Calendar, MapPin, Eye, FileText, CheckCircle2, 
  Download, Filter, Layers, PieChart, Sparkles, Zap, ArrowUpRight
} from 'lucide-react';

export default function SocioDemographicView({ activeRole = 'ACP' }) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [activeTab, setActiveTab] = useState('demographics'); // 'demographics', 'profiling', 'forecasting', 'financial'

  const DEMOGRAPHIC_CORRELATIONS = [
    { metric: 'Urbanization Growth Rate', correlation: '+0.84', impact: 'High Burglary & Property Theft', trend: 'Up', color: 'text-pramaan-critical' },
    { metric: 'Migrant Workforce Inflow', correlation: '+0.76', impact: 'Identity Spoofing & Cash Theft', trend: 'Up', color: 'text-pramaan-warning' },
    { metric: 'Youth Unemployment Rate (18-25)', correlation: '+0.91', impact: 'Cyber Phishing & Vehicle Theft', trend: 'Up', color: 'text-pramaan-critical' },
    { metric: 'Economic Inflation Index', correlation: '+0.68', impact: 'Commercial Hawala Fraud', trend: 'Stable', color: 'text-pramaan-primary' },
    { metric: 'Low Education Rate (< High School)', correlation: '+0.62', impact: 'Street Theft & Violent Assault', trend: 'Up', color: 'text-pramaan-warning' },
  ];

  const DEMOGRAPHIC_BREAKDOWNS = {
    ageGroups: [
      { range: '18-25 Yrs', percentage: '42%', label: 'Highest Cyber & Auto Theft' },
      { range: '26-35 Yrs', percentage: '38%', label: 'Residential Burglary & Hawala' },
      { range: '36-50 Yrs', percentage: '14%', label: 'Financial Fraud Leadership' },
      { range: '50+ Yrs', percentage: '6%', label: 'White Collar Forgery' },
    ],
    genderRatio: 'Male 88% • Female 12%',
    educationLevels: 'High School (48%) • Illiterate (32%) • IT Graduate (20%)',
    interstateMigration: '34% Interstate Mobile Offender Networks (TN/AP/MH Borders)'
  };

  const OFFENDER_PROFILES = [
    {
      id: 'CANON-0042',
      name: 'Mohammed Rafi',
      riskScore: 94,
      riskLevel: 'CRITICAL',
      habitualIndex: 'High Re-offender (3 FIRs)',
      violenceScore: 'Moderate (Crowbar Breaching)',
      primaryMO: 'Late Night Rear Window Disassembly',
      demographics: 'Age 34 • Male • Urban Migrant • Unemployed',
      behavioralProfile: 'Methodical serial burglar, targets locked residential premises between 01:00-04:00 AM using stolen getaways.',
      formulaBreakdown: 'Formula: 3 Convictions (35.0) + MO Signature Match (30.0) + 15km Radius (20.0) + Crowbar Breaching (9.0) = 94/100'
    },
    {
      id: 'CANON-0089',
      name: 'Ramesh Kumar',
      riskScore: 88,
      riskLevel: 'HIGH',
      habitualIndex: 'Syndicate Leader (Hawala)',
      violenceScore: 'Low (Financial Fraud)',
      primaryMO: 'Mule Account Money Transfer',
      demographics: 'Age 41 • Male • Commercial Business Owner',
      behavioralProfile: 'Organized Hawala ringleader, coordinates interstate wire fraud across Bengaluru, Mysuru & Hyderabad.',
      formulaBreakdown: 'Formula: 2 Wire Frauds (35.0) + Account Split MO (30.0) + Multi-District (18.0) + Zero Violence (5.0) = 88/100'
    },
    {
      id: 'CANON-0104',
      name: 'Sharif Khan',
      riskScore: 79,
      riskLevel: 'HIGH',
      habitualIndex: 'Cyber Specialist',
      violenceScore: 'Zero (Digital Phishing)',
      primaryMO: 'OTP Bypass & Mule Wire Routing',
      demographics: 'Age 36 • Male • Diploma IT Graduate',
      behavioralProfile: 'Cyber syndicate tech lead, executes high-volume banking phishing attacks using spoofed SIMs.',
      formulaBreakdown: 'Formula: 1 Phishing Conviction (25.0) + OTP Bypass MO (30.0) + Digital Footprint (20.0) + Zero Violence (4.0) = 79/100'
    }
  ];

  const CRIME_FORECASTS = [
    { crimeType: 'Residential Burglary', currentCount: 42, projectedCount: 58, change: '+38%', forecastReason: 'Upcoming Festival Holiday Season (Homes Left Unattended)', riskBadge: 'HIGH RISK' },
    { crimeType: 'Cyber Phishing Fraud', currentCount: 89, projectedCount: 114, change: '+28%', forecastReason: 'Month-End Salary & Tax Refund Phishing Campaigns', riskBadge: 'CRITICAL' },
    { crimeType: 'Commercial Hawala Fraud', currentCount: 18, projectedCount: 22, change: '+22%', forecastReason: 'Cross-Border Hawala Transfer Spikes', riskBadge: 'MEDIUM' },
    { crimeType: 'Two-Wheeler Vehicle Theft', currentCount: 65, projectedCount: 71, change: '+9%', forecastReason: 'Metro Station Unmonitored Parking Hubs', riskBadge: 'MODERATE' }
  ];

  const FINANCIAL_TRAILS = [
    { account: 'ICICI Bank AC #8819200412', holder: 'Sharif Khan (Mule)', totalFlow: '₹18,50,000', flag: 'High Speed Split Routing', status: 'FROZEN' },
    { account: 'HDFC Bank AC #9921004128', holder: 'Ramesh Kumar (Hawala)', totalFlow: '₹45,00,000', flag: 'Interstate Cash Dispersal', status: 'UNDER MONITORING' },
    { account: 'SBI Account #1004291823', holder: 'Mohammed Rafi (Accused)', totalFlow: '₹4,50,000', flag: 'Stolen Jewelry Cash Deposit', status: 'SEIZED' }
  ];

  const handleExportAnalyticsReport = () => {
    const reportContent = `
KARNATAKA STATE POLICE — SOCIO-DEMOGRAPHIC & PREDICTIVE FORECASTING REPORT
====================================================================================
GENERATED BY: Pramaan Criminological Analytics Engine
DATE & TIME: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
AUTHORITY CLEARANCE: Level 5 (${activeRole} Role)

1. SOCIO-DEMOGRAPHIC CORRELATION SUMMARY:
------------------------------------------------------------------------------------
• Youth Unemployment Rate (18-25): +0.91 Correlation with Cyber Phishing & Vehicle Theft
• Urbanization Growth Rate: +0.84 Correlation with Commercial Burglary
• Migrant Workforce Inflow: +0.76 Correlation with Identity Fraud

2. CRIMINOLOGY OFFENDER RISK LEADERBOARD:
------------------------------------------------------------------------------------
${OFFENDER_PROFILES.map(p => `• ${p.name} (${p.id}) — Risk Score: ${p.riskScore}/100 [${p.riskLevel}]
  Demographics: ${p.demographics}
  Behavioral Profile: ${p.behavioralProfile}`).join('\n\n')}

3. PREDICTIVE CRIME FORECASTS (30-DAY PROJECTION):
------------------------------------------------------------------------------------
${CRIME_FORECASTS.map(f => `• ${f.crimeType}: Current=${f.currentCount} -> Projected=${f.projectedCount} (${f.change})
  Forecast Rationale: ${f.forecastReason} [${f.riskBadge}]`).join('\n')}

====================================================================================
CERTIFIED REPORT UNDER SEC 65B BHARATIYA SAKSHYA ADHINIYAM
====================================================================================
    `;
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KSP_SocioDemographic_Analytics_Report.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <WorkPanel
      eyebrow="Sociological & Criminological Intelligence"
      title="Socio-Demographic Analytics, Offender Risk Profiling & Crime Forecasting"
      className="h-full bg-pramaan-bg text-pramaan-text"
      bodyClass="p-4 sm:p-6 overflow-auto"
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportAnalyticsReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pramaan-primary hover:bg-pramaan-primary/80 text-black font-extrabold text-xs font-mono transition-all cursor-pointer shadow-md"
          >
            <Download size={14} /> Export Criminological Report
          </button>
        </div>
      }
    >
      {/* Navigation Sub-Tabs */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-pramaan-border pb-3">
        <div className="flex items-center gap-1 font-mono text-xs">
          <button
            onClick={() => setActiveTab('demographics')}
            className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'demographics'
                ? 'bg-pramaan-primary text-black font-extrabold border-pramaan-primary shadow-md'
                : 'bg-pramaan-surface text-pramaan-text-secondary border-pramaan-border hover:bg-pramaan-elevated'
            }`}
          >
            <Users size={14} /> Socio-Demographic Correlations
          </button>

          <button
            onClick={() => setActiveTab('profiling')}
            className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'profiling'
                ? 'bg-pramaan-primary text-black font-extrabold border-pramaan-primary shadow-md'
                : 'bg-pramaan-surface text-pramaan-text-secondary border-pramaan-border hover:bg-pramaan-elevated'
            }`}
          >
            <BrainCircuit size={14} /> Offender Risk Profiling
          </button>

          <button
            onClick={() => setActiveTab('forecasting')}
            className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'forecasting'
                ? 'bg-pramaan-primary text-black font-extrabold border-pramaan-primary shadow-md'
                : 'bg-pramaan-surface text-pramaan-text-secondary border-pramaan-border hover:bg-pramaan-elevated'
            }`}
          >
            <TrendingUp size={14} /> Predictive Crime Forecasting
          </button>

          <button
            onClick={() => setActiveTab('financial')}
            className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'financial'
                ? 'bg-pramaan-primary text-black font-extrabold border-pramaan-primary shadow-md'
                : 'bg-pramaan-surface text-pramaan-text-secondary border-pramaan-border hover:bg-pramaan-elevated'
            }`}
          >
            <DollarSign size={14} /> Financial Crime & Mule Networks
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-pramaan-text-secondary">Region Filter:</span>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="bg-pramaan-surface text-pramaan-text border border-pramaan-border rounded-lg px-2.5 py-1 outline-none"
          >
            <option value="All">All Karnataka Police Zones</option>
            <option value="Bengaluru">Bengaluru Urban Command</option>
            <option value="Mysuru">Mysuru Southern Range</option>
            <option value="Hubballi">Hubballi-Dharwad Northern Range</option>
          </select>
        </div>
      </div>

      {/* TAB 1: SOCIO-DEMOGRAPHIC CORRELATIONS */}
      {activeTab === 'demographics' && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 rounded-xl border border-pramaan-border bg-pramaan-surface space-y-2 shadow-lg">
              <span className="text-xs font-mono text-pramaan-text-secondary">Urban Migration Correlation</span>
              <p className="text-2xl font-bold font-mono text-pramaan-critical">+0.84</p>
              <span className="text-[10px] font-mono text-pramaan-text-secondary block">Strong positive link with property theft</span>
            </div>
            <div className="p-4 rounded-xl border border-pramaan-border bg-pramaan-surface space-y-2 shadow-lg">
              <span className="text-xs font-mono text-pramaan-text-secondary">Youth Unemployment (18-25)</span>
              <p className="text-2xl font-bold font-mono text-pramaan-warning">+0.91</p>
              <span className="text-[10px] font-mono text-pramaan-text-secondary block">Direct spike in Cyber Fraud & Auto Theft</span>
            </div>
            <div className="p-4 rounded-xl border border-pramaan-border bg-pramaan-surface space-y-2 shadow-lg">
              <span className="text-xs font-mono text-pramaan-text-secondary">Economic Stress Index</span>
              <p className="text-2xl font-bold font-mono text-pramaan-primary">+0.68</p>
              <span className="text-[10px] font-mono text-pramaan-text-secondary block">Triggers commercial Hawala laundering</span>
            </div>
            <div className="p-4 rounded-xl border border-pramaan-border bg-pramaan-surface space-y-2 shadow-lg">
              <span className="text-xs font-mono text-pramaan-text-secondary">Literacy Rate Ratio</span>
              <p className="text-2xl font-bold font-mono text-pramaan-success">-0.54</p>
              <span className="text-[10px] font-mono text-pramaan-text-secondary block">Inverse correlation with violent crimes</span>
            </div>
          </div>

          {/* Detailed Correlation Matrix Table */}
          <div className="rounded-xl border border-pramaan-border bg-pramaan-surface p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-pramaan-border pb-2">
              <span className="text-xs font-mono uppercase font-bold text-pramaan-text flex items-center gap-1.5">
                <BarChart3 size={15} className="text-pramaan-primary" /> Sociological Risk Factor Correlation Matrix
              </span>
              <span className="text-[10px] font-mono text-pramaan-text-secondary">
                Data Source: State Crime Records Bureau (SCRB) + Census Indices
              </span>
            </div>

            <div className="rounded-xl border border-pramaan-border overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#121722] border-b border-pramaan-border text-pramaan-text-secondary uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Sociological Risk Factor</th>
                    <th className="p-3">Pearson Correlation (r)</th>
                    <th className="p-3">Primary Impacted Crime Category</th>
                    <th className="p-3">Trend Direction</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pramaan-border/60 bg-[#0B0E14]">
                  {DEMOGRAPHIC_CORRELATIONS.map((c, idx) => (
                    <tr key={idx} className="hover:bg-[#161C2A] transition-colors">
                      <td className="p-3 font-bold text-pramaan-text">{c.metric}</td>
                      <td className={`p-3 font-bold ${c.color}`}>{c.correlation}</td>
                      <td className="p-3 text-pramaan-text-secondary">{c.impact}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-pramaan-elevated border border-pramaan-border font-bold text-pramaan-primary flex items-center gap-1 w-fit">
                          <TrendingUp size={12} /> {c.trend}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: OFFENDER RISK PROFILING */}
      {activeTab === 'profiling' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-pramaan-border pb-2">
            <span className="text-xs font-mono uppercase font-bold text-pramaan-text flex items-center gap-1.5">
              <BrainCircuit size={15} className="text-pramaan-primary" /> Criminology Behavioral Profiling & Offender Risk Leaderboard
            </span>
          </div>

          {/* Criminological Risk Scoring Methodology Banner */}
          <div className="p-4 rounded-xl border border-pramaan-primary/30 bg-pramaan-primary/10 font-mono text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-pramaan-primary flex items-center gap-1.5">
                <Sparkles size={14} /> Mathematical Offender Risk Scoring Model:
              </span>
              <span className="text-[10px] text-pramaan-text-secondary">Weighted Linear Combination (WLC) Model</span>
            </div>
            <p className="text-pramaan-text text-[11px]">
              <strong className="text-pramaan-primary">Risk Score (1-100)</strong> = 0.35(Prior Convictions) + 0.30(MO Repetition Score) + 0.20(Geographic Radius Index) + 0.15(Violence Propensity)
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {OFFENDER_PROFILES.map((prof) => (
              <div key={prof.id} className="rounded-xl border border-pramaan-border bg-pramaan-surface p-5 space-y-3 shadow-xl flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-pramaan-primary">{prof.id}</span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      prof.riskLevel === 'CRITICAL' ? 'bg-pramaan-critical/20 text-pramaan-critical border border-pramaan-critical/40' :
                      'bg-pramaan-warning/20 text-pramaan-warning border border-pramaan-warning/40'
                    }`}>
                      {prof.riskLevel} (Risk Score {prof.riskScore}/100)
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-pramaan-text">{prof.name}</h3>
                  <p className="text-xs text-pramaan-text-secondary font-mono">{prof.demographics}</p>

                  <div className="space-y-1.5 pt-2 text-xs font-mono border-t border-pramaan-border/60">
                    <div className="flex justify-between"><span className="text-pramaan-text-secondary">Re-offence Index:</span> <span className="text-pramaan-text font-bold">{prof.habitualIndex}</span></div>
                    <div className="flex justify-between"><span className="text-pramaan-text-secondary">Violence Propensity:</span> <span className="text-pramaan-warning font-bold">{prof.violenceScore}</span></div>
                    <div className="flex justify-between"><span className="text-pramaan-text-secondary">Primary MO:</span> <span className="text-pramaan-text truncate font-bold">{prof.primaryMO}</span></div>
                  </div>

                  <p className="text-xs text-pramaan-text-secondary leading-relaxed font-sans bg-[#0B0E14] p-3 rounded-lg border border-pramaan-border/60 mt-2">
                    {prof.behavioralProfile}
                  </p>

                  <div className="text-[10px] font-mono text-pramaan-primary bg-pramaan-primary/10 p-2 rounded border border-pramaan-primary/20">
                    {prof.formulaBreakdown}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PREDICTIVE CRIME FORECASTING */}
      {activeTab === 'forecasting' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-pramaan-border pb-2">
            <span className="text-xs font-mono uppercase font-bold text-pramaan-text flex items-center gap-1.5">
              <TrendingUp size={15} className="text-pramaan-primary" /> 30-Day Predictive Crime Forecasting & Early Warning Alerts
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {CRIME_FORECASTS.map((fc, fIdx) => (
              <div key={fIdx} className="rounded-xl border border-pramaan-border bg-pramaan-surface p-5 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-pramaan-text">{fc.crimeType}</h3>
                  <span className="text-xs font-mono font-extrabold text-pramaan-critical bg-pramaan-critical/15 px-2.5 py-0.5 rounded-full border border-pramaan-critical/40">
                    {fc.change} Increase Projected
                  </span>
                </div>

                <div className="flex items-center gap-6 font-mono text-xs bg-[#0B0E14] p-3 rounded-lg border border-pramaan-border/60">
                  <div>
                    <span className="text-pramaan-text-secondary block text-[10px]">Current 30d Baseline:</span>
                    <span className="text-base font-bold text-pramaan-text">{fc.currentCount} Incidents</span>
                  </div>
                  <ArrowUpRight className="text-pramaan-critical w-6 h-6 shrink-0" />
                  <div>
                    <span className="text-pramaan-text-secondary block text-[10px]">Projected Next 30d:</span>
                    <span className="text-base font-bold text-pramaan-critical">{fc.projectedCount} Incidents</span>
                  </div>
                </div>

                <p className="text-xs text-pramaan-text-secondary font-sans leading-relaxed">
                  <strong className="text-pramaan-primary">Forecast Rationale:</strong> {fc.forecastReason}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: FINANCIAL CRIME & MULE NETWORKS */}
      {activeTab === 'financial' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-pramaan-border pb-2">
            <span className="text-xs font-mono uppercase font-bold text-pramaan-text flex items-center gap-1.5">
              <DollarSign size={15} className="text-pramaan-primary" /> Financial Crime & Mule Account Network Tracer
            </span>
          </div>

          <div className="rounded-xl border border-pramaan-border bg-pramaan-surface p-5 space-y-4 shadow-xl">
            <div className="rounded-xl border border-pramaan-border overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#121722] border-b border-pramaan-border text-pramaan-text-secondary uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Target Mule Bank Account</th>
                    <th className="p-3">Registered Account Holder</th>
                    <th className="p-3">Cumulative Transaction Flow</th>
                    <th className="p-3">Flagged Pattern</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pramaan-border/60 bg-[#0B0E14]">
                  {FINANCIAL_TRAILS.map((fin, fIdx) => (
                    <tr key={fIdx} className="hover:bg-[#161C2A] transition-colors">
                      <td className="p-3 font-bold text-pramaan-primary">{fin.account}</td>
                      <td className="p-3 text-pramaan-text">{fin.holder}</td>
                      <td className="p-3 font-bold text-pramaan-success">{fin.totalFlow}</td>
                      <td className="p-3 text-pramaan-warning">{fin.flag}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          fin.status === 'FROZEN' ? 'bg-pramaan-critical/20 text-pramaan-critical border border-pramaan-critical/40' : 'bg-pramaan-warning/20 text-pramaan-warning border border-pramaan-warning/40'
                        }`}>
                          {fin.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </WorkPanel>
  );
}
