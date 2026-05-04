// cmdk.jsx
const CmdK = ({ open, onClose, onNav, onOpenAd }) => {
  const { Search, Dashboard, Layers, Edit, Report, Users, ClipList, Plus, ArrowRight } = window.Icon;
  const [q, setQ] = React.useState('');
  const [sel, setSel] = React.useState(0);
  const inputRef = React.useRef();

  React.useEffect(() => {
    if (open) { setQ(''); setSel(0); setTimeout(() => inputRef.current?.focus(), 50); }
  }, [open]);

  if (!open) return null;

  const navs = [
    { kind: 'Page', icon: Dashboard, label: 'Dashboard', action: () => onNav('dashboard') },
    { kind: 'Page', icon: Users, label: 'Clients', action: () => onNav('clients') },
    { kind: 'Page', icon: Layers, label: 'Ads Registry', action: () => onNav('registry') },
    { kind: 'Page', icon: ClipList, label: 'Pre-Flight Checklist', action: () => onNav('preflight') },
    { kind: 'Page', icon: Edit, label: 'Daily Data Entry', action: () => onNav('entry') },
    { kind: 'Page', icon: Report, label: 'Report Builder', action: () => onNav('reports') },
  ];
  const actions = [
    { kind: 'Action', icon: Plus, label: 'New ad', shortcut: '⌘N', action: () => onNav('preflight') },
    { kind: 'Action', icon: Report, label: 'Generate report', action: () => onNav('reports') },
  ];
  const ads = window.DATA.ADS.filter(a => a.status === 'live').slice(0, 5).map(a => ({
    kind: 'Ad', icon: Layers, label: a.name, sub: window.DATA.CLIENTS.find(c => c.id === a.client)?.name,
    action: () => onOpenAd(a)
  }));

  const all = [...navs, ...actions, ...ads];
  const filtered = q ? all.filter(i => i.label.toLowerCase().includes(q.toLowerCase()) || (i.sub||'').toLowerCase().includes(q.toLowerCase())) : all;

  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel(s => Math.min(s+1, filtered.length-1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSel(s => Math.max(s-1, 0)); }
    if (e.key === 'Enter') { e.preventDefault(); filtered[sel]?.action(); onClose(); }
    if (e.key === 'Escape') onClose();
  };

  // group
  const grouped = filtered.reduce((acc, item, idx) => {
    (acc[item.kind] = acc[item.kind] || []).push({ ...item, idx });
    return acc;
  }, {});

  return (
    <div className="cmdk-overlay" onClick={onClose}>
      <div className="cmdk" onClick={e=>e.stopPropagation()}>
        <input
          ref={inputRef}
          className="cmdk-search"
          placeholder="Search clients, ads, reports, or run a command…"
          value={q}
          onChange={e=>{ setQ(e.target.value); setSel(0); }}
          onKeyDown={onKey}
        />
        <div className="cmdk-list">
          {Object.entries(grouped).map(([kind, items]) => (
            <div key={kind}>
              <div className="cmdk-section">{kind}</div>
              {items.map(i => {
                const Ic = i.icon;
                return (
                  <button
                    key={i.idx}
                    className="cmdk-item"
                    data-selected={i.idx === sel}
                    onMouseEnter={()=>setSel(i.idx)}
                    onClick={()=>{ i.action(); onClose(); }}
                  >
                    <Ic />
                    <span style={{ flex: 1 }}>{i.label}</span>
                    {i.sub && <span style={{ fontSize: 11.5, color: 'var(--text-subtle)' }}>{i.sub}</span>}
                    {i.shortcut && <kbd className="kbd">{i.shortcut}</kbd>}
                    <ArrowRight size={13} style={{ color: 'var(--text-faint)' }}/>
                  </button>
                );
              })}
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-subtle)', fontSize: 13 }}>
              No results for "{q}"
            </div>
          )}
        </div>
        <div className="cmdk-foot">
          <span><kbd className="kbd">↑↓</kbd> navigate <kbd className="kbd" style={{ marginLeft: 6 }}>↵</kbd> select</span>
          <span><kbd className="kbd">esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
};
window.CmdK = CmdK;
