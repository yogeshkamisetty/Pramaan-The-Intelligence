import { useState } from 'react';
import {
  LayoutDashboard, FolderKanban, BellRing, Share2,
  MapPinned, Fingerprint, CopyCheck, ScrollText,
  ShieldCheck, Sparkles, Lock, HelpCircle,
  FileSearch, FileUp, ScanFace, Shield, BarChart3
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
  const w = collapsed ? 'w-16' : 'w-16 md:w-64';
  const t = translations[language] || translations.EN;

  return (
    <aside className={`flex h-full self-stretch min-h-full ${w} shrink-0 flex-col bg-pramaan-surface text-pramaan-text border-r border-pramaan-border transition-[width] duration-200 select-none z-20 shadow-xl font-sans`}>
      
      {/* Top Header Branding */}
      <div className="p-4 sm:p-5 border-b border-pramaan-border bg-pramaan-elevated/60">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pramaan-primary/15 border border-pramaan-primary/30 text-pramaan-primary">
            <ShieldCheck size={22} />
          </div>
          {!collapsed && (
            <div className="min-w-0 leading-tight hidden md:block">
              <div className="truncate text-pramaan-text font-black font-mono tracking-wider text-base">PRAMAAN</div>
              <div className="truncate text-pramaan-text-secondary text-[10px] font-semibold">KSP Crime Intelligence</div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-4 px-3">
        {groupsConfig.map((g, idx) => (
          <div key={`${g.headingKey}-${idx}`} className="space-y-1">
            {!collapsed && (
              <div className="px-3 text-[10px] font-bold uppercase tracking-widest text-pramaan-primary hidden md:block mb-1.5 font-mono">
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
                    className={`group relative flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left transition-all cursor-pointer active:scale-[0.98] ${
                      isActive
                        ? 'bg-pramaan-primary text-black font-extrabold shadow-md scale-[1.01]'
                        : isAllowed
                        ? 'text-pramaan-text-secondary hover:bg-pramaan-elevated hover:text-pramaan-text font-medium'
                        : 'text-pramaan-text-secondary/40 hover:bg-pramaan-elevated/40'
                    }`}
                  >
                    <Icon size={17} strokeWidth={isActive ? 2.25 : 1.75} className={`shrink-0 ${isActive ? 'text-black' : 'text-pramaan-text-secondary'}`} />
                    {!collapsed && <span className="truncate text-xs hidden md:inline">{displayLabel}</span>}

                    {!isAllowed && !collapsed && (
                      <Lock size={12} className="ml-auto shrink-0 text-pramaan-text-secondary/40 hidden md:block" title={`Requires ${requiredPermissionFor(item.key)}`} />
                    )}

                    {/* Badge Pill */}
                    {item.badge && !collapsed && isAllowed && (
                      <span className={`ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-mono font-bold shadow-xs ${
                        isActive ? 'bg-black text-white' : 'bg-pramaan-primary/20 text-pramaan-primary'
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
      <div className="p-3 border-t border-pramaan-border bg-pramaan-elevated/60 text-xs">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-pramaan-surface border border-pramaan-border">
          <Shield size={16} className="text-pramaan-primary shrink-0" />
          {!collapsed && (
            <div className="min-w-0 flex-1 hidden md:block">
              <div className="text-[10px] font-mono text-pramaan-primary truncate font-bold uppercase tracking-wide">CLEARANCE LEVEL</div>
              <div className="text-xs font-extrabold text-pramaan-text truncate">{ROLE_LABELS[activeRole] || activeRole}</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
