// registry.jsx
const Registry = ({ extraAds = [], onOpenAd }) => {
  const { Badge, ClientChip, PlatformIcon, fmtMoney, fmtNum } = window.Shell;
  const { Filter, Plus, More, ChevronDown, Search, ArrowRight } = window.Icon;
  const { ADS, CLIENTS, PLATFORMS } = window.DATA;

  const all = [...extraAds, ...ADS];
  const [query, setQuery] = React.useState('');
  const [client, setClient] = React.useState('all');
  const [platform, setPlatform] = React.useState('all');
  const [objective, setObjective] = React.useState('all');
  const [showDormant, setShowDormant] = React.useState(false);

  const matches = (a) => {
    if (query && !a.name.toLowerCase().includes(query.toLowerCase())) return false;
    if (client !== 'all' && a.client !== client) return false;
    if (platform !== 'all' && a.platform !== platform) return false;
    if (objective !== 'all' && a.objective !== objective) return false;
    return true;
  };
  const live = all.filter(a => a.status === 'live' && matches(a));
  const dormant = all.filter(a => a.status !== 'live' && matches(a));

  const Row = ({ a }) => (
    <tr onClick={() => onOpenAd && onOpenAd(a)} style={{ cursor: 'default' }}>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {a.status === 'live' && <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--pos)', boxShadow: '0 0 0 3px var(--pos-bg)' }}></span>}
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 500, color: 'var(--text)' }}>{a.name}</div>
            <div style={{ fontSize: 11.5, color: 'var(--text-subtle)', marginTop: 2 }}>{a.objective} · {a.funnel}</div>
          </div>
        </div>
      </td>
      <td><ClientChip id={a.client} /></td>
      <td><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><PlatformIcon id={a.platform}/><span>{PLATFORMS.find(p=>p.id===a.platform)?.name}</span></div></td>
      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>{a.period}</td>
      <td><Badge tone={a.test ? 'testing' : a.status}>{a.test ? 'Testing' : a.status[0].toUpperCase()+a.status.slice(1)}</Badge></td>
      <td style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{a.owner}</td>
      <td className="num" style={{ fontFamily: 'var(--font-mono)' }}>{fmtMoney(a.spend)}</td>
      <td><button className="icon-btn" style={{ width: 26, height: 26, border: 'none', background: 'transparent' }}><More size={14}/></button></td>
    </tr>
  );

  return (
    <div className="content-inner">
      <div className="page-header">
        <div>
          <h1 className="page-title">Ads Registry</h1>
          <p className="page-sub">Every ad ever launched. Live ads pinned to the top.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary"><window.Icon.Download size={13}/> Export</button>
          <button className="btn btn-primary"><Plus size={13}/> New ad</button>
        </div>
      </div>

      <div className="filter-row">
        <input className="search-input" placeholder="Search ads…" value={query} onChange={e=>setQuery(e.target.value)} />
        <select className="filter-pill" value={client} onChange={e=>setClient(e.target.value)} style={{ paddingRight: 26 }}>
          <option value="all">All clients</option>
          {CLIENTS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className="filter-pill" value={platform} onChange={e=>setPlatform(e.target.value)}>
          <option value="all">All platforms</option>
          {PLATFORMS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select className="filter-pill" value={objective} onChange={e=>setObjective(e.target.value)}>
          <option value="all">All objectives</option>
          {window.DATA.OBJECTIVES.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <button className="filter-pill"><Filter/> More filters</button>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-subtle)' }}>{live.length + dormant.length} ads · {live.length} live</span>
      </div>

      <div className="card" style={{ marginBottom: 18 }}>
        <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--pos)', boxShadow: '0 0 0 3px var(--pos-bg)' }}></span>
          <span style={{ fontSize: 13.5, fontWeight: 600 }}>Live ads</span>
          <span className="badge" data-tone="live">{live.length}</span>
          <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-subtle)' }}>Sorted by client · most recent</span>
        </div>
        {live.length === 0 ? (
          <div className="empty">
            <div className="empty-icon"><window.Icon.Layers/></div>
            <div className="empty-title">No live ads match your filters</div>
            <div className="empty-sub">Try clearing filters or launch a new ad.</div>
          </div>
        ) : (
          <table className="table">
            <thead><tr><th>Ad</th><th>Client</th><th>Platform</th><th>Period</th><th>Status</th><th>Owner</th><th className="num">Spend</th><th></th></tr></thead>
            <tbody>{live.map(a => <Row key={a.id} a={a}/>)}</tbody>
          </table>
        )}
      </div>

      <div className="card">
        <button onClick={()=>setShowDormant(!showDormant)} style={{ width: '100%', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 10, background: 'transparent', border: 'none', borderBottom: showDormant ? '1px solid var(--border-subtle)' : 'none', textAlign: 'left' }}>
          <ChevronDown size={14} style={{ color: 'var(--text-muted)', transform: showDormant ? 'rotate(0)' : 'rotate(-90deg)', transition: 'transform 150ms' }}/>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)' }}>Dormant & past ads</span>
          <span className="badge" data-tone="archived">{dormant.length}</span>
          <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-subtle)' }}>Paused, ended, archived</span>
        </button>
        {showDormant && (
          <table className="table">
            <thead><tr><th>Ad</th><th>Client</th><th>Platform</th><th>Period</th><th>Status</th><th>Owner</th><th className="num">Spend</th><th></th></tr></thead>
            <tbody>{dormant.map(a => <Row key={a.id} a={a}/>)}</tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const AdSidePanel = ({ ad, onClose }) => {
  if (!ad) return null;
  const { Badge, ClientChip, PlatformIcon, fmtMoney, fmtNum } = window.Shell;
  const { Close, Pause, Edit, Copy, Archive, Sparkles } = window.Icon;
  const { LineChart } = window.Charts;
  const series = window.DATA.DAILY_SERIES[ad.id];
  const labels = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14'];

  return (
    <>
      <div className="side-panel-overlay" onClick={onClose}/>
      <div className="side-panel">
        <div className="panel-head">
          {ad.status === 'live' && <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--pos)' }}></span>}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="panel-title" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ad.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-subtle)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
              <ClientChip id={ad.client}/> · <PlatformIcon id={ad.platform}/> {window.DATA.PLATFORMS.find(p=>p.id===ad.platform).name}
            </div>
          </div>
          <button className="icon-btn" onClick={onClose}><Close/></button>
        </div>
        <div className="panel-body">
          <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
            <button className="btn btn-secondary btn-sm"><Edit size={12}/> Edit</button>
            <button className="btn btn-secondary btn-sm"><Pause size={12}/> Pause</button>
            <button className="btn btn-secondary btn-sm"><Copy size={12}/> Duplicate</button>
            <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }}><Archive size={12}/> Archive</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 22 }}>
            {[
              ['Spend', fmtMoney(ad.spend)],
              ['Results', fmtNum(ad.results)],
              ['CPL', '$'+ad.cpl.toFixed(2)],
            ].map(([l,v]) => (
              <div key={l} style={{ background: 'var(--bg-sunken)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ fontSize: 11, color: 'var(--text-subtle)' }}>{l}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 600, marginTop: 2 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>14-day trend</div>
            <div className="card">
              <div style={{ padding: 8 }}>
                <LineChart series={[{ data: series.spend, labels, color: 'var(--brand-1)' }]} height={160} formatY={v=>'$'+v}/>
              </div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Pre-flight details</div>
            <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: '120px 1fr', rowGap: 10, columnGap: 12, fontSize: 13 }}>
              <dt style={{ color: 'var(--text-subtle)' }}>Objective</dt><dd style={{ margin: 0 }}>{ad.objective}</dd>
              <dt style={{ color: 'var(--text-subtle)' }}>Funnel</dt><dd style={{ margin: 0 }}>{ad.funnel}</dd>
              <dt style={{ color: 'var(--text-subtle)' }}>Period</dt><dd style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: 12 }}>{ad.period}</dd>
              <dt style={{ color: 'var(--text-subtle)' }}>Owner</dt><dd style={{ margin: 0 }}>{ad.owner}</dd>
              <dt style={{ color: 'var(--text-subtle)' }}>Status</dt><dd style={{ margin: 0 }}><Badge tone={ad.status}>{ad.status}</Badge></dd>
            </dl>
          </div>
        </div>
      </div>
    </>
  );
};

window.Registry = Registry;
window.AdSidePanel = AdSidePanel;
