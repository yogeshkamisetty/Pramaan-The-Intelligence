import { useState } from 'react';
import { Search, Command, Bell, ChevronRight, Globe, Shield, LogOut, Sun, Moon, Check, Trash2, X, Plus } from 'lucide-react';

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
  demographic: { title: 'Socio-Demographic Intelligence', sub: 'ANALYZE', titleKn: 'ಸಾಮಾಜಿಕ ಅಪರಾಧ ಮಾದರಿ' },
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
  onOpenCommandPalette,
  onOpenNewCase
}) {
  const meta = titles[view] || { title: view, sub: 'ANALYZE', titleKn: view };
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const displayTitle = language === 'KN' ? meta.titleKn : meta.title;
  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <header className="flex min-h-[60px] shrink-0 flex-wrap items-center justify-between gap-3 border-b border-[#B3E3DE] bg-[#FEFFFF] px-5 py-2.5 relative z-40 text-[#17252A] select-none shadow-xs font-sans">
      
      {/* Left Breadcrumbs & LIVE ENGINE Badge */}
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="text-[#2B7A78] uppercase text-[10px] font-mono font-extrabold tracking-widest">
          {meta.sub}
        </span>
        <ChevronRight size={14} className="text-[#2B7A78]/50" />
        <span className="truncate text-[#17252A] font-black text-sm sm:text-base tracking-tight">
          {displayTitle}
        </span>
        
        {/* LIVE ENGINE Pill Badge */}
        <span className="ml-2 hidden sm:flex items-center gap-1.5 text-[#2B7A78] text-[10px] font-mono font-bold bg-[#DEF2F1] px-3 py-1 rounded-full border border-[#3AAFA9]/40 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#3AAFA9] animate-pulse" /> LIVE ENGINE
        </span>
      </div>

      {/* Center Search Input Bar & Global New Case Button */}
      <div className="order-3 flex w-full max-w-sm sm:max-w-lg items-center gap-2.5 md:order-none">
        <div
          onClick={onOpenCommandPalette}
          className="flex flex-1 items-center gap-2.5 rounded-2xl border border-[#B3E3DE] bg-[#DEF2F1] px-4 py-2 cursor-pointer hover:border-[#3AAFA9] transition-all shadow-xs active:scale-[0.99]"
        >
          <Search className="w-4 h-4 text-[#2B7A78] shrink-0" />
          <span className="flex-1 text-xs text-[#2B7A78] font-sans truncate font-semibold">
            {language === 'KN'
              ? 'ಹುಡುಕಿ ಪ್ರಕರಣಗಳು, ಅಪರಾಧಿಗಳು (⌘K)...'
              : 'Search cases, suspects, or jump to view (⌘K)...'}
          </span>
          <span className="hidden items-center gap-1 rounded-lg bg-[#FEFFFF] border border-[#B3E3DE] px-2 py-0.5 text-[10px] font-mono font-bold text-[#17252A] sm:flex">
            <Command size={10} /> K
          </span>
        </div>

        {onOpenNewCase && (
          <button
            onClick={onOpenNewCase}
            className="px-3.5 py-2 bg-[#17252A] hover:bg-[#2B7A78] text-[#FEFFFF] font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-sm border border-[#3AAFA9]/40 shrink-0"
            title="Register New FIR / Case File"
          >
            <Plus size={15} className="text-[#3AAFA9]" />
            <span className="hidden sm:inline font-mono uppercase text-[11px]">New Case</span>
          </button>
        )}
      </div>

      {/* Right Controls */}
      <div className="ml-auto flex items-center gap-2 relative">
        
        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#B3E3DE] bg-[#DEF2F1] text-[#2B7A78] hover:text-[#17252A] hover:border-[#3AAFA9] transition-all cursor-pointer shadow-xs"
            title="Notifications & Alerts"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#EF4444] text-[10px] font-mono font-bold text-white shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-84 sm:w-[420px] max-w-[92vw] rounded-2xl border-2 border-[#B3E3DE] bg-[#FEFFFF] shadow-xl overflow-hidden z-[3000]">
              <div className="border-b border-[#B3E3DE] p-3.5 bg-[#DEF2F1] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2B7A78]/20 text-[#2B7A78]">
                      <Bell size={13} />
                    </div>
                    <span className="font-bold text-xs text-[#17252A] font-sans">Notifications & Stream Alerts</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-[#EF4444] text-white text-[10px] font-mono font-bold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 rounded-md text-[#2B7A78] hover:text-[#17252A] hover:bg-[#EAF7F6] transition-colors cursor-pointer"
                  >
                    <X size={15} />
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono pt-1">
                  <span className="text-[#2B7A78]">
                    {notifications.length} Total Stream Events
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={markAllRead}
                      className="text-[#2B7A78] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Check size={12} /> Mark Read
                    </button>
                    <span className="text-[#B3E3DE]">|</span>
                    <button
                      onClick={clearAll}
                      className="text-[#EF4444] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 size={12} /> Clear All
                    </button>
                  </div>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#B3E3DE]/60 p-2 bg-[#FEFFFF]">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#2B7A78] space-y-1">
                    <Check size={20} className="mx-auto text-[#10B981]" />
                    <p className="font-semibold text-[#17252A]">All alerts cleared</p>
                    <p className="text-[11px] text-[#2B7A78]">No active threat alerts in stream</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 rounded-xl transition-all ${
                        n.unread
                          ? 'bg-[#EAF7F6] border border-[#3AAFA9]/50'
                          : 'bg-[#FEFFFF] hover:bg-[#DEF2F1]/50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2 w-2 rounded-full shrink-0 ${
                              n.severity === 'critical' ? 'bg-[#EF4444] animate-pulse' :
                              n.severity === 'warning' ? 'bg-[#F59E0B]' : 'bg-[#3AAFA9]'
                            }`}
                          />
                          <span className="font-bold text-xs text-[#17252A] leading-tight">{n.title}</span>
                        </div>
                        <span className="text-[10px] font-mono text-[#2B7A78] shrink-0">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-[#2B7A78] mt-1.5 leading-relaxed pl-4 font-sans">{n.desc}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bilingual Language Switcher */}
        <button
          onClick={onLanguageToggle}
          className="flex h-9 items-center gap-1.5 rounded-xl border border-[#B3E3DE] bg-[#DEF2F1] px-3 text-xs font-bold text-[#17252A] hover:border-[#3AAFA9] transition-all cursor-pointer shadow-xs"
          title="Switch Language (English / ಕನ್ನಡ)"
        >
          <Globe size={14} className="text-[#2B7A78]" />
          <span>{language === 'KN' ? 'ಕನ್ನಡ' : 'EN'}</span>
        </button>

        {/* Role & Login Selector */}
        <div className="flex items-center gap-1 rounded-xl border border-[#B3E3DE] bg-[#DEF2F1] p-1">
          <select
            value={activeRole}
            onChange={(e) => onRoleChange(e.target.value)}
            className="h-7 rounded-lg bg-transparent px-2 text-xs font-mono font-bold text-[#17252A] outline-none cursor-pointer"
            title="Switch Clearance Role"
          >
            {roles.map((r) => (
              <option key={r} value={r} className="bg-[#FEFFFF] text-[#17252A]">
                Role: {r}
              </option>
            ))}
          </select>

          <button
            onClick={onOpenLoginModal}
            className="flex h-7 items-center gap-1.5 rounded-lg bg-[#17252A] px-2.5 text-[11px] font-bold text-[#3AAFA9] hover:bg-[#2B7A78] hover:text-[#FEFFFF] transition-all cursor-pointer"
            title="Open Security Login Portal"
          >
            <Shield size={13} />
            <span className="hidden sm:inline">Role Access</span>
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="flex h-7 items-center gap-1.5 rounded-lg bg-[#EF4444]/15 px-2 text-[11px] font-bold text-[#EF4444] hover:bg-[#EF4444] hover:text-white transition-all cursor-pointer"
              title="Lock System & Sign Out"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Lock</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
