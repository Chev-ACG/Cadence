// entry.jsx — Daily data entry
const Entry = () => {
  const { Badge, ClientChip, PlatformIcon, fmtMoney, fmtNum } = window.Shell;
  const { Check, CheckCircle, Sparkles } = window.Icon;
  const { ADS, CLIENTS } = window.DATA;

  const liveAds = ADS.filter(a => a.status === 'live');

  // initial entries — about half logged
  const initial = {};
  liveAds.forEach((a, i) => {
    if (i < 8) {
      initial[a.id] = {
        spend: Math.round(a.spend / 14),
        impressions: Math.round(a.spend * 14),
        clicks: Math.round(Math.max(20, a.results * 0.7)),
        results: Math.round(a.results / 14),
        notes: '',
        saved: true,
      };
    } else {
      initial[a.id] = { spend: '', impressions: '', clicks: '', results: '', notes: '', saved: false };
    }
  });

  const [entries, setEntries] = React.useState(initial);
  const [flashed, setFlashed] = React.useState({});

  const update = (id, k, v) => {
    setEntries(e => ({ ...e, [id]: { ...e[id], [k]: v, saved: false } }));
  };
  const onBlur = (id) => {
    setEntries(e => {
      const en = e[id];
      if (!en.spend && !en.impressions && !en.clicks && !en.results) return e;
      return { ...e, [id]: { ...en, saved: true } };
    });
    setFlashed(f => ({ ...f, [id]: Date.now() }));
    setTimeout(() => setFlashed(f => { const nf = { ...f }; delete nf[id]; return nf; }), 800);
  };

  const calc = (e) => {
    const sp = parseFloat(e.spend) || 0;
    const im = parseFloat(e.impressions) || 0;
    const cl = parseFloat(e.clicks) || 0;
    const re = parseFloat(e.results) || 0;
    return {
      ctr: im ? cl / im : null,
      cpc: cl ? sp / cl : null,
      cpm: im ? (sp / im) * 1000 : null,
      cpr: re ? sp / re : null,
    };
  };

  const logged = Object.values(entries).filter(e => e.saved && (e.spend || e.results)).length;
  const total = liveAds.length;

  // group by client
  const byClient = {};
  liveAds.forEach(a => {
    (byClient[a.client] = byClient[a.client] || []).push(a);
  });

  const today = 'Tue, May 4 2026';

  return (
    <div className="content-inner">
      <div className="page-header">
        <div>
          <h1 className="page-title">Daily Performance</h1>
          <p className="page-sub">Log yesterday's metrics for every live ad. Saved automatically.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Yesterday · <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>Mon, May 3 2026</span>
          </div>
          <button className="btn btn-secondary"><window.Icon.Calendar size={13}/> Change date</button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{logged} of {total} ads logged for yesterday</div>
          <div style={{ fontSize: 12, color: 'var(--text-subtle)', marginTop: 2 }}>{total - logged} remaining · auto-saved as you type</div>
        </div>
        <div style={{ width: 220 }}>
          <div className="progress"><div className="progress-fill" style={{ width: `${logged/total*100}%` }}/></div>
        </div>
        <Badge tone={logged === total ? 'live' : 'paused'}>
          {logged === total ? <><CheckCircle size={11}/> Complete</> : `${total-logged} pending`}
        </Badge>
      </div>

      {Object.entries(byClient).map(([cid, ads]) => {
        const client = CLIENTS.find(c => c.id === cid);
        const clientLogged = ads.filter(a => entries[a.id]?.saved).length;
        return (
          <div key={cid} className="card" style={{ marginBottom: 16 }}>
            <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <ClientChip id={cid}/>
              <span className="badge" data-tone="archived" style={{ marginLeft: 8 }}>{clientLogged}/{ads.length}</span>
              <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' }}>{client.industry}</span>
            </div>
            <div>
              {ads.map((a, idx) => {
                const e = entries[a.id];
                const c = calc(e);
                const flash = flashed[a.id];
                return (
                  <div key={a.id} className={flash ? 'saved-flash' : ''} style={{ padding: '14px 18px', borderBottom: idx < ads.length-1 ? '1px solid var(--border-subtle)' : 'none', display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) repeat(4, minmax(0,1fr)) 80px', gap: 14, alignItems: 'center' }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <PlatformIcon id={a.platform}/>
                        <span style={{ fontSize: 13.5, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.name}</span>
                      </div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-subtle)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>{a.objective}</span><span style={{color:'var(--text-faint)'}}>·</span><span>{a.owner}</span>
                      </div>
                    </div>
                    {[
                      ['spend', 'Spend', '$'],
                      ['impressions', 'Impressions'],
                      ['clicks', 'Clicks'],
                      ['results', 'Results'],
                    ].map(([k, label, prefix]) => (
                      <div key={k}>
                        <div style={{ fontSize: 10.5, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 3 }}>{label}</div>
                        <input
                          className="input"
                          style={{ height: 32, fontFamily: 'var(--font-mono)', fontSize: 13 }}
                          placeholder={prefix ? prefix : '—'}
                          value={e[k]}
                          onChange={ev => update(a.id, k, ev.target.value)}
                          onBlur={() => onBlur(a.id)}
                        />
                        {k === 'clicks' && c.ctr != null && (
                          <div style={{ fontSize: 10.5, color: 'var(--text-subtle)', marginTop: 3, fontFamily: 'var(--font-mono)' }}>CTR {(c.ctr*100).toFixed(2)}%</div>
                        )}
                        {k === 'spend' && c.cpc != null && (
                          <div style={{ fontSize: 10.5, color: 'var(--text-subtle)', marginTop: 3, fontFamily: 'var(--font-mono)' }}>CPC ${c.cpc.toFixed(2)}</div>
                        )}
                        {k === 'impressions' && c.cpm != null && (
                          <div style={{ fontSize: 10.5, color: 'var(--text-subtle)', marginTop: 3, fontFamily: 'var(--font-mono)' }}>CPM ${c.cpm.toFixed(2)}</div>
                        )}
                        {k === 'results' && c.cpr != null && (
                          <div style={{ fontSize: 10.5, color: c.cpr < 30 ? 'var(--pos)' : 'var(--text-subtle)', marginTop: 3, fontFamily: 'var(--font-mono)' }}>CPR ${c.cpr.toFixed(2)}</div>
                        )}
                      </div>
                    ))}
                    <div style={{ minWidth: 80, textAlign: 'right' }}>
                      {e.saved && (e.spend || e.results) ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11.5, color: 'var(--pos)', fontWeight: 500 }}>
                          <CheckCircle size={12}/> Saved
                        </span>
                      ) : !e.spend && !e.results ? (
                        <span style={{ fontSize: 11.5, color: 'var(--warn)', fontWeight: 500 }}>Pending</span>
                      ) : (
                        <span style={{ fontSize: 11.5, color: 'var(--text-subtle)' }}>Editing…</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
window.Entry = Entry;
