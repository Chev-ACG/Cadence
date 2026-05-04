// clients.jsx — Clients list + Client detail (with tabs) + Reports archive
const Clients = ({ onOpen }) => {
  const { ClientChip, fmtMoney } = window.Shell;
  const { Sparkline } = window.Charts;
  const { CLIENTS, ADS } = window.DATA;

  return (
    <div className="content-inner">
      <div className="page-header">
        <div>
          <h1 className="page-title">Clients</h1>
          <p className="page-sub">{CLIENTS.length} active clients · $606,600 managed this month</p>
        </div>
        <button className="btn btn-primary"><window.Icon.Plus size={13}/> Add client</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {CLIENTS.map(c => {
          const cl = ADS.filter(a => a.client === c.id && a.status === 'live').length;
          return (
            <button key={c.id} className="card" style={{ textAlign: 'left', padding: 0, cursor: 'default' }} onClick={() => onOpen(c.id)}>
              <div style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border-subtle)' }}>
                <span className="client-logo" style={{ background: c.color, width: 38, height: 38, borderRadius: 9, fontSize: 14 }}>{c.short}</span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-subtle)', marginTop: 2 }}>{c.industry}</div>
                </div>
                <span className="badge" data-tone="live"><span className="badge-dot"></span>{cl} live</span>
              </div>
              <div style={{ padding: '14px 18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-subtle)' }}>Spend (MTD)</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 600, marginTop: 2 }}>{fmtMoney(c.spend)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-subtle)' }}>Blended CPL</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 600, marginTop: 2 }}>${c.cpl.toFixed(2)}</div>
                </div>
              </div>
              <div style={{ padding: '0 12px 14px' }}>
                <Sparkline data={[12,18,15,22,28,26,32,30,38,42,40,46,52,58]} color={c.color} width={300} height={32} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const ClientDetail = ({ id, onBack }) => {
  const { ClientChip, fmtMoney, fmtNum, Badge, PlatformIcon } = window.Shell;
  const { LineChart } = window.Charts;
  const { CLIENTS, ADS, REPORTS } = window.DATA;
  const c = CLIENTS.find(c => c.id === id);
  const ads = ADS.filter(a => a.client === id);
  const reports = REPORTS.filter(r => r.client === id);
  const [tab, setTab] = React.useState('overview');

  const liveAds = ads.filter(a => a.status === 'live');
  const labels = ['Apr 21','22','23','24','25','26','27','28','29','30','May 1','2','3','4'];

  return (
    <div className="content-inner">
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, paddingBottom: 16, borderBottom: '1px solid var(--border-subtle)', marginBottom: 0 }}>
        <span className="client-logo" style={{ background: c.color, width: 56, height: 56, borderRadius: 12, fontSize: 20 }}>{c.short}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: 'var(--text-subtle)', marginBottom: 4 }}>{c.industry}</div>
          <h1 className="page-title" style={{ marginBottom: 4 }}>{c.name}</h1>
          <div style={{ display: 'flex', gap: 28, marginTop: 14 }}>
            {[
              ['Active campaigns', liveAds.length],
              ['Spend (MTD)', fmtMoney(c.spend)],
              ['Blended CPL', '$'+c.cpl.toFixed(2)],
              ['Total results', fmtNum(ads.reduce((s,a)=>s+a.results,0))],
            ].map(([l, v]) => (
              <div key={l}>
                <div style={{ fontSize: 11, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 500 }}>{l}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 600, marginTop: 4 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary"><window.Icon.Sparkles size={13}/> Generate report</button>
          <button className="btn btn-primary"><window.Icon.Plus size={13}/> New ad</button>
        </div>
      </div>

      <div className="tabs" style={{ marginTop: 4 }}>
        {['overview','ads','reports','settings'].map(t => (
          <button key={t} className="tab" data-active={tab===t} onClick={()=>setTab(t)}>
            {t[0].toUpperCase()+t.slice(1)}{t==='ads' && ` (${ads.length})`}{t==='reports' && ` (${reports.length})`}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 18 }}>
          <div className="card">
            <div className="card-head"><div className="card-title">Performance trend · last 14 days</div></div>
            <div style={{ padding: 14 }}>
              <LineChart series={[{ data: [820,940,890,1080,1240,1180,1320,1410,1380,1490,1560,1620,1710,1820], labels, color: c.color }]} height={220} formatY={v=>'$'+v}/>
            </div>
          </div>
          <div className="card">
            <div className="card-head"><div className="card-title">Top performing ads</div></div>
            <div style={{ padding: '4px 0' }}>
              {liveAds.slice(0, 4).map((a, i, arr) => (
                <div key={a.id} style={{ padding: '12px 18px', borderBottom: i < arr.length-1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><PlatformIcon id={a.platform}/><span style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.name}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
                    <span>{fmtMoney(a.spend)} spent</span>
                    <span style={{ color: a.cpl < 30 ? 'var(--pos)' : 'var(--text)' }}>${a.cpl.toFixed(2)} CPL</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'ads' && (
        <div className="card">
          <table className="table">
            <thead><tr><th>Ad</th><th>Platform</th><th>Period</th><th>Status</th><th className="num">Spend</th><th className="num">CPL</th></tr></thead>
            <tbody>
              {ads.map(a => (
                <tr key={a.id}>
                  <td><div style={{ fontWeight: 500 }}>{a.name}</div><div style={{ fontSize: 11.5, color: 'var(--text-subtle)', marginTop: 2 }}>{a.objective}</div></td>
                  <td><PlatformIcon id={a.platform}/></td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>{a.period}</td>
                  <td><Badge tone={a.status}>{a.status}</Badge></td>
                  <td className="num" style={{ fontFamily: 'var(--font-mono)' }}>{fmtMoney(a.spend)}</td>
                  <td className="num" style={{ fontFamily: 'var(--font-mono)' }}>${a.cpl.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'reports' && <ReportArchive client={id}/>}

      {tab === 'settings' && (
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <div><label className="label">Client name</label><input className="input" defaultValue={c.name}/></div>
            <div><label className="label">Industry</label><input className="input" defaultValue={c.industry}/></div>
            <div><label className="label">Brand color</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="client-logo" style={{ background: c.color, width: 36, height: 36, borderRadius: 8 }}/>
                <input className="input" defaultValue={c.color} style={{ fontFamily: 'var(--font-mono)' }}/>
              </div>
            </div>
            <div><label className="label">Main contact</label><input className="input" defaultValue="contact@aurelia.com"/></div>
          </div>
        </div>
      )}
    </div>
  );
};

const ReportArchive = ({ client }) => {
  const { ClientChip } = window.Shell;
  const { Download, Calendar } = window.Icon;
  const { REPORTS, CLIENTS } = window.DATA;
  const list = client ? REPORTS.filter(r => r.client === client) : REPORTS;

  const Thumb = ({ c, t }) => (
    <div style={{ width: 56, height: 72, background: 'white', borderRadius: 4, border: '1px solid var(--border)', overflow: 'hidden', flexShrink: 0, boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ height: 8, background: c.color }}/>
      <div style={{ padding: '6px 4px' }}>
        <div style={{ height: 4, background: '#e8e8e8', borderRadius: 1, marginBottom: 3, width: '70%' }}/>
        <div style={{ height: 3, background: '#eee', borderRadius: 1, marginBottom: 2 }}/>
        <div style={{ height: 3, background: '#eee', borderRadius: 1, marginBottom: 2, width: '85%' }}/>
        <div style={{ height: 14, background: '#f4f4f4', borderRadius: 2, margin: '6px 0' }}/>
        <div style={{ height: 3, background: '#eee', borderRadius: 1, marginBottom: 2 }}/>
        <div style={{ height: 3, background: '#eee', borderRadius: 1, width: '60%' }}/>
      </div>
    </div>
  );

  return (
    <div className="card">
      <table className="table">
        <thead><tr><th></th><th>Report</th><th>Client</th><th>Period</th><th>Generated</th><th>Author</th><th></th></tr></thead>
        <tbody>
          {list.map(r => {
            const c = CLIENTS.find(x => x.id === r.client);
            return (
              <tr key={r.id}>
                <td style={{ width: 76, paddingLeft: 16 }}><Thumb c={c} t={r.type}/></td>
                <td>
                  <div style={{ fontWeight: 500 }}>{r.type} · {r.period}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-subtle)', marginTop: 2 }}>4-page summary · 6 charts</div>
                </td>
                <td><ClientChip id={r.client}/></td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>{r.period}</td>
                <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.generated}</td>
                <td style={{ fontSize: 12 }}>{r.author}</td>
                <td><button className="btn btn-secondary btn-sm"><Download size={12}/> PDF</button></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

window.Clients = Clients;
window.ClientDetail = ClientDetail;
window.ReportArchive = ReportArchive;
