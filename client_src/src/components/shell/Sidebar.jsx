import { useState } from 'react';
import {
  LayoutDashboard, FolderKanban, BellRing, Share2,
  MapPinned, Fingerprint, CopyCheck, ScrollText,
  ShieldCheck, Sparkles, Lock, HelpCircle,
  FileSearch, FileUp, ScanFace, Shield, BarChart3, ChevronsLeft
} from 'lucide-react';
import { canAccessView, ROLE_LABELS, requiredPermissionFor } from '../../access';
import { translations } from '../../data/translations';

const groupsConfig = [
  {
    headingKey: 'watchFloor',
    items: [
      { key: 'overview', labelKey: 'navOverview', icon: LayoutDashboard },
      { key: 'alerts', labelKey: 'navAlerts', icon: BellRing, badge: 6 },
    ],
  },
  {
    headingKey: 'investigate',
    items: [
      { key: 'cases', labelKey: 'navCases', icon: FolderKanban, badge: 7 },
      { key: 'resolution', labelKey: 'navResolution', icon: Fingerprint },
      { key: 'similar', labelKey: 'navSimilar', icon: CopyCheck },
      { key: 'facerec', labelKey: 'navFaceRec', icon: ScanFace, customLabel: 'Face Recognition' },
      { key: 'fingerprint', labelKey: 'navFingerprint', icon: Fingerprint, customLabel: 'Fingerprint Match' },
    ],
  },
  {
    headingKey: 'analyze',
    items: [
      { key: 'map', labelKey: 'navMap', icon: MapPinned },
      { key: 'graph', labelKey: 'navGraph', icon: Share2 },
      { key: 'assistant', labelKey: 'navAssistant', icon: Sparkles },
      { key: 'sociodemographic', labelKey: 'navSocioDemographic', icon: BarChart3, customLabel: 'Socio-Demographic' },
      { key: 'docsearch', labelKey: 'navDocSearch', icon: FileSearch, customLabel: 'Document Search' },
      { key: 'docupload', labelKey: 'navDocUpload', icon: FileUp, customLabel: 'Document Upload' },
    ],
  },
  {
    headingKey: 'govern',
    items: [
      { key: 'audit', labelKey: 'navAudit', icon: ScrollText },
      { key: 'helpdesk', labelKey: 'navHelpDesk', icon: HelpCircle },
    ],
  },
];

export function Sidebar({ active, onChange, activeRole = 'ACP', language = 'EN' }) {
  const [collapsed, setCollapsed] = useState(false);
  const w = collapsed ? 'w-16' : 'w-64';
  const t = translations[language] || translations.EN;

  return (
    <aside className={`flex h-full self-stretch min-h-full ${w} shrink-0 flex-col bg-pramaan-surface text-pramaan-text border-r border-pramaan-border transition-all duration-200 select-none z-30 shadow-xl font-sans`}>
      
      {/* Top Header Branding */}
      <div className="p-4 border-b border-pramaan-border bg-pramaan-elevated flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pramaan-primary/20 border border-pramaan-primary/50 text-pramaan-primary shrink-0 shadow-xs">
            <ShieldCheck size={22} strokeWidth={2.2} />
          </div>
          {!collapsed && (
            <div className="min-w-0 leading-tight">
              <div className="truncate text-pramaan-text font-black font-mono tracking-wider text-base">PRAMAAN</div>
              <div className="truncate text-pramaan-primary text-[10px] font-bold">KSP Crime Intelligence</div>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg text-pramaan-text-secondary hover:text-pramaan-primary hover:bg-pramaan-surface transition-all cursor-pointer"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <ChevronsLeft size={16} className={`transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-4 px-3">
        {groupsConfig.map((g, idx) => (
          <div key={`${g.headingKey}-${idx}`} className="space-y-1">
            {!collapsed && (
              <div className="px-3 text-[11px] font-extrabold uppercase tracking-widest text-pramaan-primary mb-1.5 font-mono">
                {t[g.headingKey] || g.headingKey}
              </div>
            )}
            <div className="space-y-1">
              {g.items.map((item, itemIdx) => {
                const isAllowed = canAccessView(activeRole, item.key);
                const isActive = active === item.key;
                const Icon = item.icon;
                const displayLabel = item.customLabel || t[item.labelKey] || item.key;

                return (
                  <button
                    key={`${item.key}-${itemIdx}`}
                    onClick={() => onChange(item.key)}
                    title={collapsed ? displayLabel : undefined}
                    className={`group relative flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-left transition-all cursor-pointer active:scale-[0.98] ${
                      isActive
                        ? 'bg-pramaan-elevated text-[#0F172A] dark:text-[#f9f9f9] font-extrabold border-2 border-[#0F172A] dark:border-white/90 shadow-lg scale-[1.01]'
                        : isAllowed
                        ? 'text-pramaan-text hover:bg-pramaan-elevated hover:text-pramaan-primary font-semibold border border-transparent'
                        : 'text-pramaan-text-secondary/40 hover:bg-pramaan-elevated/40 border border-transparent'
                    }`}
                  >
                    {/* Active Left Pill Accent (Black in Light mode, White in Dark mode) */}
                    {isActive && (
                      <span className="absolute inset-y-2 left-0 w-1.5 rounded-r-full bg-[#0F172A] dark:bg-[#f9f9f9] shadow-sm" />
                    )}

                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={`shrink-0 ${isActive ? 'text-[#0F172A] dark:text-[#f9f9f9]' : 'text-pramaan-primary'}`} />
                    
                    {!collapsed && (
                      <span className={`truncate text-xs font-extrabold flex-1 ${isActive ? 'text-[#0F172A] dark:text-[#f9f9f9]' : 'text-pramaan-text'}`}>
                        {displayLabel}
                      </span>
                    )}

                    {!isAllowed && !collapsed && (
                      <Lock size={12} className="ml-auto shrink-0 text-pramaan-text-secondary/50" title={`Requires ${requiredPermissionFor(item.key)}`} />
                    )}

                    {/* High-Contrast Badge Pill */}
                    {item.badge && !collapsed && isAllowed && (
                      <span className={`ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-mono font-bold shadow-xs ${
                        isActive 
                          ? 'bg-[#0F172A] text-white dark:bg-[#f9f9f9] dark:text-black font-extrabold' 
                          : 'bg-pramaan-primary/20 text-pramaan-primary border border-pramaan-primary/40'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Role Badge Info */}
      <div className="p-3 border-t border-pramaan-border bg-pramaan-elevated text-xs">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-pramaan-surface border border-pramaan-border shadow-xs">
          <Shield size={18} className="text-pramaan-primary shrink-0" />
          {!collapsed && (
            <div className="min-w-0 flex-1 leading-tight">
              <div className="text-[10px] font-mono text-pramaan-primary truncate font-extrabold uppercase tracking-wide">CLEARANCE LEVEL</div>
              <div className="text-xs font-black text-pramaan-text truncate">{ROLE_LABELS[activeRole] || activeRole}</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
