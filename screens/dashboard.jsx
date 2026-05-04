// dashboard.jsx
const Dashboard = () => {
  const { LineChart, Sparkline, Donut } = window.Charts;
  const { Badge, ClientChip, PlatformIcon, fmtMoney, fmtNum } = window.Shell;
  const { TrendUp, TrendDown, Dollar, Target, Layers, Users, AlertCircle, Clock, ArrowRight } = window.Icon;

  const stats = [
    { label: 'Live ads', value: '12', delta: '+3', dir: 'up', icon: 'Layers', spark: [4,6,5,7,9,8,10,12] },
    { label: 'Spend this month', value: '$84.2k', delta: '+12.4%', dir: 'up', icon: 'Dollar', spark: [12,18,22,30,42,58,72,84] },
    { label: 'Blended CPL', value: '$32.40', delta: '−4.8%', dir: 'up', icon: 'Target', spark: [38,36,35,34,33,33,32,32] },
    { label: 'Active clients', value: '6', delta: 'flat', dir: 'flat', icon: 'Users', spark: [6,6,6,6,6,6,6,6] },
  ];

  const labels = ['Apr 21','22','23','24','25','26','27','28','29','30','May 1','2','3','4'];
  const series = [
    { key: 'spend', label: 'Spend', color: 'var(--brand-1)', labels, data: [3200,3850,3120,4100,4800,4400,4950,5200,4980,5380,5640,5920,6120,6480] },
    { key: 'cpl', label: 'CPL', color: 'var(--brand-2)', labels, data: [2800,3100,2700,3500,4100,3900,4200,4600,4400,4700,4900,5100,5300,5500] },
  ];

  const tasks = [
    { type: 'data', client: 'aurelia', text: 'Spring Glow — Carousel A', meta: 'Yesterday — missing spend & results', tone: 'warn' },
    { type: 'data', client: 'tilde', text: 'Wealth Quiz Funnel', meta: 'Yesterday — partial data', tone: 'warn' },
    { type: 'review', client: 'northwind', text: 'Q2 Demo Push — pre-flight pending review', meta: 'Submitted 2h ago by J. Park', tone: 'info' },
    { type: 'report', client: 'parable', text: 'Weekly report — draft ready', meta: 'Due Friday', tone: 'brand' },
    { type: 'budget', client: 'meridian', text: 'Search Branded — 87% of budget consumed', meta: 'Ends in 4 days', tone: 'warn' },
  ];

  const channelSplit = [
    { label: 'Meta', value: 42, color: 'oklch(0.55 0.22 295)' },
    { label: 'Google', value: 28, color: 'oklch(0.6 0.22 15)' },
    { label: 'LinkedIn', value: 18, color: 'oklch(0.55 0.14 240)' },
    { label: 'TikTok', value: 12, color: 'oklch(0.5 0.06 270)' },
  ];

  const topAds = window.DATA.ADS.filter(a => a.status === 'live').slice(0, 5);

  return (
    <div className="content-inner">
      <div className="page-header">
        <div>
          <h1 className="page-title">Good morning, Mara.</h1>
          <p className="page-sub">Tuesday, May 4 · 12 live ads across 6 clients · 4 ads waiting on yesterday's data</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary"><window.Icon.Calendar size={13}/> Last 14 days</button>
          <button className="btn btn-primary"><window.Icon.Sparkles size={13}/> Generate report</button>
        </div>
      </div>

      <div className="stat-grid">
        {stats.map((s, i) => {
          const I = window.Icon[s.icon];
          const Trend = s.dir === 'up' ? TrendUp : s.dir === 'down' ? TrendDown : null;
          return (
            <div className="stat-card" key={i}>
              <div className="stat-label"><I /> {s.label}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-delta" data-dir={s.dir}>
                {Trend && <Trend size={12}/>}
                {s.delta}
                <span style={{ color: 'var(--text-faint)', marginLeft: 4, fontWeight: 400 }}>vs last month</span>
              </div>
              <div className="stat-spark">
                <Sparkline data={s.spark} color={s.dir === 'up' ? 'var(--brand-1)' : s.dir === 'down' ? 'var(--neg)' : 'var(--text-faint)'} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="row-grid">
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Performance trend</div>
              <div style={{ fontSize: 12, color: 'var(--text-subtle)', marginTop: 2 }}>Spend vs results · daily, last 14 days</div>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {['Spend','CPL','CTR','Results'].map((m, i) => (
                <button key={m} className="filter-pill" data-active={i === 0}>{m}</button>
              ))}
            </div>
          </div>
          <div style={{ padding: '8px 14px 14px' }}>
            <div style={{ display: 'flex', gap: 18, padding: '6px 6px 14px', fontSize: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--brand-1)' }}></span>
                <span style={{ color: 'var(--text-muted)' }}>Spend</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>$68.4k</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--brand-2)' }}></span>
                <span style={{ color: 'var(--text-muted)' }}>Results</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>2,148</span>
              </div>
            </div>
            <LineChart series={series} height={220} formatY={(v)=>`$${(v/1000).toFixed(1)}k`} />
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div className="card-title">Today's queue</div>
            <span className="badge" data-tone="brand">{tasks.length}</span>
          </div>
          <div style={{ padding: '4px 0' }}>
            {tasks.map((t, i) => (
              <button key={i} style={{ width: '100%', border: 'none', background: 'transparent', padding: '12px 18px', display: 'flex', gap: 10, alignItems: 'flex-start', borderBottom: i < tasks.length-1 ? '1px solid var(--border-subtle)' : 'none', textAlign: 'left' }}>
                <span style={{ marginTop: 2 }}>
                  {t.tone === 'warn' && <AlertCircle size={14} style={{ color: 'var(--warn)' }}/>}
                  {t.tone === 'info' && <Clock size={14} style={{ color: 'var(--info)' }}/>}
                  {t.tone === 'brand' && <window.Icon.Sparkles size={14} style={{ color: 'var(--brand-solid)' }}/>}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.text}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-subtle)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ClientChip id={t.client} withName={false}/>
                    <span>{window.DATA.CLIENTS.find(c=>c.id===t.client)?.name}</span>
                    <span style={{ color: 'var(--text-faint)' }}>·</span>
                    <span>{t.meta}</span>
                  </div>
                </div>
                <ArrowRight size={13} style={{ color: 'var(--text-faint)', marginTop: 4 }}/>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 18, marginTop: 18 }}>
        <div className="card">
          <div className="card-head">
            <div className="card-title">Top performing ads</div>
            <button className="btn btn-ghost btn-sm">View all <ArrowRight size={12}/></button>
          </div>
          <table className="table">
            <thead><tr><th>Ad</th><th>Platform</th><th className="num">Spend</th><th className="num">Results</th><th className="num">CPL</th></tr></thead>
            <tbody>
              {topAds.map(a => (
                <tr key={a.id}>
                  <td>
                    <div style={{ fontWeight: 500, color: 'var(--text)' }}>{a.name}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-subtle)', marginTop: 2 }}><ClientChip id={a.client} /></div>
                  </td>
                  <td><PlatformIcon id={a.platform} /></td>
                  <td className="num" style={{ fontFamily: 'var(--font-mono)' }}>{fmtMoney(a.spend)}</td>
                  <td className="num" style={{ fontFamily: 'var(--font-mono)' }}>{fmtNum(a.results)}</td>
                  <td className="num" style={{ fontFamily: 'var(--font-mono)', color: a.cpl < 30 ? 'var(--pos)' : 'var(--text)' }}>${a.cpl.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-head">
            <div className="card-title">Channel split</div>
            <span style={{ fontSize: 12, color: 'var(--text-subtle)' }}>by spend</span>
          </div>
          <div style={{ padding: '20px 18px', display: 'flex', alignItems: 'center', gap: 24 }}>
            <Donut data={channelSplit} size={160} thickness={20} />
            <div style={{ flex: 1, display: 'grid', gap: 10 }}>
              {channelSplit.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: c.color }}></span>
                  <span style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>{c.label}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>{c.value}%</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 10, marginTop: 4, fontSize: 12, color: 'var(--text-subtle)' }}>
                Total managed spend
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 17, fontWeight: 600, color: 'var(--text)', marginTop: 2 }}>$606,600</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

window.Dashboard = Dashboard;
