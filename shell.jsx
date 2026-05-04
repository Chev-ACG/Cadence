// shell.jsx — Sidebar, Topbar, layout shell

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: 'Dashboard' },
  { id: 'clients', label: 'Clients', icon: 'Users', badge: 6 },
  { id: 'registry', label: 'Ads Registry', icon: 'Layers', badge: 12 },
  { id: 'preflight', label: 'Pre-Flight', icon: 'ClipList' },
  { id: 'entry', label: 'Daily Data', icon: 'Edit', badge: 4 },
  { id: 'reports', label: 'Reports', icon: 'Report' },
];
const NAV_BOTTOM = [
  { id: 'archive', label: 'Report Archive', icon: 'Archive' },
  { id: 'settings', label: 'Settings', icon: 'Settings' },
];

function Sidebar({ active, onNav }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark"></div>
        <div style={{ minWidth: 0 }}>
          <div className="brand-name">Cadence</div>
          <div className="brand-sub">Performance OS</div>
        </div>
      </div>
      <div className="sidebar-section">Workspace</div>
      {NAV.map(n => {
        const I = window.Icon[n.icon];
        return (
          <button key={n.id} className="nav-item" data-active={active === n.id} onClick={() => onNav(n.id)}>
            <I className="nav-icon" />
            <span>{n.label}</span>
            {n.badge != null && <span className="nav-badge">{n.badge}</span>}
          </button>
        );
      })}
      <div className="sidebar-section">Library</div>
      {NAV_BOTTOM.map(n => {
        const I = window.Icon[n.icon];
        return (
          <button key={n.id} className="nav-item" data-active={active === n.id} onClick={() => onNav(n.id)}>
            <I className="nav-icon" />
            <span>{n.label}</span>
          </button>
        );
      })}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="avatar">MR</div>
          <div className="user-meta">
            <div className="user-name">Mara Reyes</div>
            <div className="user-role">Team Lead</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function Topbar({ crumbs, onCmdK, onToggleTheme, theme }) {
  const { Search, Bell, Plus, Sun, Moon, ChevronRight } = window.Icon;
  return (
    <header className="topbar">
      <nav className="crumbs">
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <ChevronRight className="sep" size={13} />}
            <span className={i === crumbs.length - 1 ? 'current' : ''}>{c}</span>
          </React.Fragment>
        ))}
      </nav>
      <button className="search-pill" onClick={onCmdK}>
        <Search size={13} />
        <span>Search clients, ads, reports…</span>
        <kbd>⌘K</kbd>
      </button>
      <button className="icon-btn" onClick={onToggleTheme} title="Toggle theme">
        {theme === 'dark' ? <Sun /> : <Moon />}
      </button>
      <button className="icon-btn" title="Notifications">
        <Bell />
      </button>
      <button className="btn btn-primary btn-sm" style={{ height: 32 }}>
        <Plus size={13} /> New ad
      </button>
    </header>
  );
}

// Reusable bits
function Badge({ tone, children }) {
  return <span className="badge" data-tone={tone}>
    {tone === 'live' && <span className="badge-dot"></span>}
    {children}
  </span>;
}

function PlatformIcon({ id }) {
  const p = window.DATA.PLATFORMS.find(p => p.id === id);
  return <span className="platform-icon" data-platform={id} title={p?.name}>{p?.short}</span>;
}

function ClientChip({ id, withName = true }) {
  const c = window.DATA.CLIENTS.find(c => c.id === id);
  if (!c) return null;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span className="client-logo" style={{ background: c.color }}>{c.short}</span>
      {withName && <span style={{ fontWeight: 500 }}>{c.name}</span>}
    </span>
  );
}

function fmtMoney(n, opts = {}) {
  if (n == null) return '—';
  const { decimals = 0 } = opts;
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
function fmtNum(n) { return n == null ? '—' : Math.round(n).toLocaleString('en-US'); }
function fmtPct(n, d = 2) { return n == null ? '—' : (n * 100).toFixed(d) + '%'; }

window.Shell = { Sidebar, Topbar, Badge, PlatformIcon, ClientChip, fmtMoney, fmtNum, fmtPct };
