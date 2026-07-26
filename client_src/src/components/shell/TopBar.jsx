import { useState } from 'react';
import { Search, Command, Bell, ChevronRight, Globe, Shield, LogOut, Check, Trash2, X, Plus, Sparkles, Sun, Moon } from 'lucide-react';

const titles = {
  overview: { title: 'Command Overview', sub: 'WATCH FLOOR', titleKn: 'ಕಮಾಂಡ್ ಮೇಲ್ನೋಟ' },
  cases: { title: 'Case Register', sub: 'INVESTIGATE', titleKn: 'ಪ್ರಕರಣಗಳ ನೋಂದಣಿ' },
  alerts: { title: 'Alert Stream', sub: 'WATCH FLOOR', titleKn: 'ಎಚ್ಚರಿಕೆ ವಾಹಿನಿ' },
  map: { title: 'Live Crime Map', sub: 'ANALYZE', titleKn: 'ನೈಜ ಸಮಯದ ಅಪರಾಧ ನಕ್ಷೆ' },
  graph: { title: 'Entity Graph', sub: 'ANALYZE', titleKn: 'ಸಂಬಂಧಿತ ಜಾಲಲಕ್ಷಣ Graph' },
  similar: { title: 'Case Twin Intelligence', sub: 'INVESTIGATE', titleKn: 'ಸಮಾನ ಅಪರಾಧ ಮಾದರಿಗಳು' },
  resolution: { title: 'Identity Resolution', sub: 'INVESTIGATE', titleKn: 'ಗುರುತು ದೃಢೀಕರಣ Resolution' },
  fingerprint: { title: 'Fingerprint Match', sub: 'INVESTIGATE', titleKn: 'ಫಿಂಗರ್‌ಪ್ರಿಂಟ್ ಹೊಂದಾಣಿಕೆ' },
  facerec: { title: 'Facial Forensics & 3D Pose Mesh', sub: 'INVESTIGATE', titleKn: 'ಮುಖ ಗುರುತಿಸುವಿಕೆ ಫೋರೆನ್ಸಿಕ್' },
  history: { title: 'Investigation History', sub: 'INVESTIGATE', titleKn: 'ತನಿಖಾ ಇತಿಹಾಸ' },
  assistant: { title: 'AI Investigation Assistant', sub: 'ANALYZE', titleKn: 'ಎಐ ತನಿಖಾ ಸಹಾಯಕ' },
  docsearch: { title: 'Document Search', sub: 'ANALYZE', titleKn: 'ದಸ್ತಾವೇಜು ಹುಡುಕಾಟ' },
  docupload: { title: 'Document Upload', sub: 'ANALYZE', titleKn: 'ದಸ್ತಾವೇಜು ಅಪ್‌ಲೋಡ್' },
  audit: { title: 'Audit & Compliance', sub: 'GOVERN', titleKn: 'ಲೆಕ್ಕಪರಿಶೋಧನೆ ಮತ್ತು ನಿಯಮಾವಳಿ' },
  helpdesk: { title: 'Public Help Desk', sub: 'PUBLIC PORTAL', titleKn: 'ಸಾರ್ವಜನಿಕ ಸಹಾಯ ಕೇಂದ್ರ' },
  sociodemographic: { title: 'Socio-Demographic Intelligence', sub: 'ANALYZE', titleKn: 'ಸಾಮಾಜಿಕ ಅಪರಾಧ ಮಾದರಿ' },
};

const roles = ['SI', 'IO', 'ACP', 'Analyst', 'Policy'];

const INITIAL_NOTIFICATIONS = [
  { id: '1', title: 'Critical Alert: Burglary Cluster', time: '10 mins ago', unread: true, severity: 'critical', desc: 'Indiranagar reported 3 window-forced burglaries.' },
  { id: '2', title: 'Warrant Issued: CANON-0042', time: '1 hour ago', unread: true, severity: 'warning', desc: '1st ACMM Court issued active theft warrant for Mohammed Rafi.' },
  { id: '3', title: 'Identity Merged: AUTO_MERGE', time: '2 hours ago', unread: false, severity: 'info', desc: 'Fellegi-Sunter matched P-101 and P-102 based on phone number.' }
];

export function TopBar({
  view,
  activeRole,
  onRoleChange,
  onOpenLoginModal,
  onLogout,
  language = 'EN',
  onLanguageToggle,
  theme = 'dark',
  onThemeToggle,
  onOpenCommandPalette,
  onOpenNewCase
}) {
  const meta = titles[view] || { title: view, sub: 'ANALYZE', titleKn: view };
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [searchMode, setSearchMode] = useState('search');

  const displayTitle = language === 'KN' ? meta.titleKn : meta.title;
  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-pramaan-border bg-pramaan-surface px-5 relative z-40 text-pramaan-text select-none shadow-md font-sans transition-colors duration-200">
      
      {/* Left Breadcrumbs & LIVE ENGINE Badge */}
      <div className="flex min-w-0 items-center gap-2">
        <span className="text-pramaan-text-secondary uppercase text-[10px] font-mono font-bold tracking-wider">
          {meta.sub}
        </span>
        <ChevronRight size={13} className="text-pramaan-text-secondary/50 shrink-0" />
        <span className="truncate text-pramaan-text font-bold text-sm sm:text-base tracking-tight">
          {displayTitle}
        </span>
        
        {/* LIVE ENGINE Pill Badge */}
        <span className="ml-2 hidden sm:flex items-center gap-1.5 text-pramaan-primary text-[10px] font-mono font-bold bg-pramaan-primary/10 px-2.5 py-0.5 rounded-full border border-pramaan-primary/30 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-pramaan-primary animate-pulse" /> LIVE
        </span>
      </div>

      {/* Center Search Input Bar & Mode Toggle */}
      <div className="hidden md:flex flex-1 max-w-lg items-center gap-2 rounded-xl border border-pramaan-border bg-pramaan-elevated px-2 py-1 shadow-xs hover:border-pramaan-primary/60 transition-all">
        <div className="flex rounded-lg bg-pramaan-surface p-0.5 border border-pramaan-border">
          <button
            onClick={() => setSearchMode('search')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono font-bold transition-all cursor-pointer ${
              searchMode === 'search' ? 'bg-pramaan-primary/20 text-pramaan-primary' : 'text-pramaan-text-secondary hover:text-pramaan-text'
            }`}
          >
            <Search size={12} /> Find
          </button>
          <button
            onClick={() => setSearchMode('ask')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono font-bold transition-all cursor-pointer ${
              searchMode === 'ask' ? 'bg-pramaan-primary/20 text-pramaan-primary' : 'text-pramaan-text-secondary hover:text-pramaan-text'
            }`}
          >
            <Sparkles size={12} /> Ask AI
          </button>
        </div>

        <div onClick={onOpenCommandPalette} className="flex flex-1 items-center gap-2 cursor-pointer min-w-0">
          <span className="flex-1 text-xs text-pramaan-text-secondary font-sans truncate font-medium">
            {searchMode === 'search'
              ? (language === 'KN' ? 'ಹುಡುಕಿ ಪ್ರಕರಣಗಳು, ಅಪರಾಧಿಗಳು (⌘K)...' : 'Search cases, suspects, vehicles (⌘K)...')
              : (language === 'KN' ? 'ಎಐ ಗೆ ಕೇಳಿ: CASE-001 ವಿವರ...' : 'Ask AI: "Who connects CANON-0042 to CASE-001?"')}
          </span>
          <span className="flex items-center gap-0.5 rounded-md bg-pramaan-surface border border-pramaan-border px-1.5 py-0.5 text-[10px] font-mono font-bold text-pramaan-text-secondary shrink-0">
            <Command size={10} /> K
          </span>
        </div>
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center gap-2 shrink-0">
        
        {/* Global New Case Button */}
        {onOpenNewCase && (
          <button
            onClick={onOpenNewCase}
            className="px-3 py-1.5 bg-pramaan-primary hover:opacity-90 text-white dark:text-black font-extrabold text-xs rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-md border border-pramaan-primary/40 font-mono"
            title="Register New FIR / Case File"
          >
            <Plus size={14} />
            <span className="hidden sm:inline uppercase text-[11px]">New Case</span>
          </button>
        )}

        {/* Theme Switcher Toggle (Sun / Moon) */}
        <button
          onClick={onThemeToggle}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-pramaan-border bg-pramaan-elevated text-pramaan-text-secondary hover:text-pramaan-primary hover:border-pramaan-primary transition-all cursor-pointer shadow-xs"
          title={`Switch Theme (Current: ${theme === 'dark' ? 'Dark Mode' : 'Light Mode'})`}
        >
          {theme === 'dark' ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-indigo-600" />}
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-pramaan-border bg-pramaan-elevated text-pramaan-text-secondary hover:text-pramaan-text hover:border-pramaan-primary transition-all cursor-pointer shadow-xs"
            title="Notifications & Stream Alerts"
          >
            <Bell size={15} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-pramaan-critical text-[10px] font-mono font-bold text-white shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Solid Non-Transparent Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-84 sm:w-[400px] max-w-[92vw] rounded-2xl border-2 border-pramaan-border bg-pramaan-surface shadow-2xl overflow-hidden z-[9999] font-sans">
              <div className="border-b border-pramaan-border p-3.5 bg-pramaan-elevated space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-pramaan-primary/20 text-pramaan-primary">
                      <Bell size={13} />
                    </div>
                    <span className="font-bold text-xs text-pramaan-text font-sans">Notifications & Stream Alerts</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-pramaan-critical text-white text-[10px] font-mono font-bold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 rounded-md text-pramaan-text-secondary hover:text-pramaan-text hover:bg-pramaan-surface transition-colors cursor-pointer"
                  >
                    <X size={15} />
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono pt-1">
                  <span className="text-pramaan-text-secondary">
                    {notifications.length} Total Stream Events
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={markAllRead}
                      className="text-pramaan-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Check size={12} /> Mark Read
                    </button>
                    <span className="text-pramaan-border">|</span>
                    <button
                      onClick={clearAll}
                      className="text-pramaan-critical hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 size={12} /> Clear All
                    </button>
                  </div>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-pramaan-border/60 p-2 bg-pramaan-surface">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-xs text-pramaan-text-secondary space-y-1">
                    <Check size={20} className="mx-auto text-pramaan-success" />
                    <p className="font-semibold text-pramaan-text">All alerts cleared</p>
                    <p className="text-[11px] text-pramaan-text-secondary">No active threat alerts in stream</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 rounded-xl transition-all ${
                        n.unread
                          ? 'bg-pramaan-elevated border border-pramaan-primary/50'
                          : 'bg-pramaan-surface hover:bg-pramaan-elevated border border-transparent'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2 w-2 rounded-full shrink-0 ${
                              n.severity === 'critical' ? 'bg-pramaan-critical animate-pulse' :
                              n.severity === 'warning' ? 'bg-pramaan-warning' : 'bg-pramaan-primary'
                            }`}
                          />
                          <span className="font-bold text-xs text-pramaan-text leading-tight">{n.title}</span>
                        </div>
                        <span className="text-[10px] font-mono text-pramaan-text-secondary shrink-0">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-pramaan-text-secondary mt-1.5 leading-relaxed pl-4 font-sans">{n.desc}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Language Switcher Button */}
        <button
          onClick={onLanguageToggle}
          className="flex h-8 items-center gap-1 rounded-lg border border-pramaan-border bg-pramaan-elevated px-2.5 text-xs font-bold text-pramaan-text hover:border-pramaan-primary transition-all cursor-pointer shadow-xs font-mono"
          title="Switch Language (English / ಕನ್ನಡ)"
        >
          <Globe size={13} className="text-pramaan-primary" />
          <span>{language === 'KN' ? 'ಕನ್ನಡ' : 'EN'}</span>
        </button>

        {/* Role Clearance Dropdown */}
        <div className="flex items-center gap-1 rounded-lg border border-pramaan-border bg-pramaan-elevated p-1">
          <select
            value={activeRole}
            onChange={(e) => onRoleChange(e.target.value)}
            className="h-6 rounded-md bg-pramaan-surface px-1.5 text-xs font-mono font-bold text-pramaan-primary outline-none cursor-pointer border border-pramaan-border"
            title="Switch Clearance Role"
          >
            {roles.map((r) => (
              <option key={r} value={r} className="bg-pramaan-surface text-pramaan-text">
                Role: {r}
              </option>
            ))}
          </select>

          <button
            onClick={onOpenLoginModal}
            className="flex h-6 items-center gap-1 rounded-md bg-pramaan-primary px-2 text-[10px] font-bold text-white dark:text-black hover:opacity-90 transition-all cursor-pointer font-mono"
            title="Open Security Login Portal"
          >
            <Shield size={12} />
            <span className="hidden sm:inline">Role Access</span>
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="flex h-6 items-center gap-1 rounded-md bg-pramaan-critical/15 px-1.5 text-[10px] font-bold text-pramaan-critical hover:bg-pramaan-critical hover:text-white transition-all cursor-pointer"
              title="Lock System & Sign Out"
            >
              <LogOut size={12} />
              <span className="hidden sm:inline">Lock</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
