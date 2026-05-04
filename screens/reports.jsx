// reports.jsx
const ReportBuilder = () => {
  const { ClientChip, fmtMoney, fmtNum } = window.Shell;
  const { Sparkles, Download, Calendar, Eye, ChevronDown } = window.Icon;
  const { LineChart, BarChart } = window.Charts;
  const { CLIENTS, ADS } = window.DATA;

  const [client, setClient] = React.useState('aurelia');
  const [type, setType] = React.useState('Weekly');
  const [period, setPeriod] = React.useState('Apr 28 – May 4');
  const [content, setContent] = React.useState({
    summary: 'Aurelia delivered a strong week, with the Spring Glow campaign reaching CPL targets seven days ahead of plan. Retargeting CPL hit a 30-day low, driven by improved creative variants and audience trimming.',
    worked: '• Carousel A continues to outperform — CTR 2.1× the account average\n• Retargeting cart-abandoners cut CPL to $8.79\n• Hero video v3 increased watch-through to 47%',
    didnt: '• Awareness placement on Reels saw rising CPM\n• Mobile carousel suffered drop-off on slide 3',
    learnings: 'Bottom-funnel creative responds to brand-tone copy more than offer-led. Recommend doubling down on retention storytelling next sprint.',
    next: '• Scale Carousel A by 25% on Tuesday\n• Launch new retargeting variant focused on shade-matching\n• A/B headline test for Reels',
  });

  const c = CLIENTS.find(x => x.id === client);
  const ads = ADS.filter(a => a.client === client);
  const totalSpend = ads.reduce((s, a) => s + a.spend, 0);
  const totalResults = ads.reduce((s, a) => s + a.results, 0);
  const blendedCpl = totalResults ? totalSpend / totalResults : 0;

  const labels = ['Apr 28','29','30','May 1','2','3','4'];
  const series = [{ data: [1240, 1380, 1290, 1420, 1510, 1480, 1620], labels, color: c.color }];
  const barData = [
    { label: 'Mon', value: 1240 },
    { label: 'Tue', value: 1380 },
    { label: 'Wed', value: 1290 },
    { label: 'Thu', value: 1420 },
    { label: 'Fri', value: 1510 },
    { label: 'Sat', value: 1480 },
    { label: 'Sun', value: 1620 },
  ];

  const Field = ({ label, value, k, rows = 4 }) => (
    <div style={{ marginBottom: 16 }}>
      <label className="label" style={{ marginBottom: 6 }}>{label}</label>
      <textarea
        className="textarea"
        style={{ minHeight: rows * 22, fontSize: 13, lineHeight: 1.55 }}
        value={value}
        onChange={e => setContent(c => ({ ...c, [k]: e.target.value }))}
      />
    </div>
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, height: '100%', minHeight: 0 }}>
      {/* Editor */}
      <div style={{ overflow: 'auto', padding: '24px 28px 64px', borderRight: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h1 className="page-title" style={{ marginBottom: 4 }}>Report builder</h1>
            <p className="page-sub" style={{ fontSize: 13 }}>Auto-pulled metrics + your narrative</p>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 18, padding: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1.4fr', gap: 10 }}>
            <div>
              <label className="label">Client</label>
              <select className="select" value={client} onChange={e=>setClient(e.target.value)}>
                {CLIENTS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Type</label>
              <div style={{ display: 'flex', gap: 4, padding: 3, background: 'var(--bg-sunken)', borderRadius: 7, border: '1px solid var(--border)' }}>
                {['Weekly','Monthly'].map(t => (
                  <button key={t} onClick={()=>setType(t)} className="btn btn-sm" style={{ flex: 1, height: 28, background: type === t ? 'var(--surface)' : 'transparent', border: type === t ? '1px solid var(--border)' : '1px solid transparent', boxShadow: type === t ? 'var(--shadow-sm)' : 'none' }}>{t}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Period</label>
              <input className="input" value={period} onChange={e=>setPeriod(e.target.value)} />
            </div>
          </div>
        </div>

        <Field label="Executive summary" value={content.summary} k="summary" rows={4} />
        <Field label="What worked" value={content.worked} k="worked" rows={5} />
        <Field label="What didn't" value={content.didnt} k="didnt" rows={3} />
        <Field label="Learnings" value={content.learnings} k="learnings" rows={4} />
        <Field label="Next steps" value={content.next} k="next" rows={5} />

        <button className="btn btn-ghost btn-sm" style={{ marginTop: 6 }}><Sparkles size={12}/> Draft with AI</button>
      </div>

      {/* Preview */}
      <div style={{ overflow: 'auto', padding: '24px 28px 64px', background: 'var(--bg-sunken)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Live preview</div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn btn-secondary btn-sm"><Eye size={12}/> Full preview</button>
            <button className="btn btn-primary btn-sm"><Download size={12}/> Download PDF</button>
          </div>
        </div>

        <div style={{ background: 'white', color: '#1a1a1a', borderRadius: 8, boxShadow: 'var(--shadow-md)', overflow: 'hidden', fontFamily: 'var(--font-sans)' }}>
          {/* PDF cover */}
          <div style={{ padding: '32px 32px 24px', borderBottom: `4px solid ${c.color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
              <span className="client-logo" style={{ background: c.color, width: 36, height: 36, fontSize: 14, borderRadius: 8 }}>{c.short}</span>
              <div>
                <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Performance Report</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: '#1a1a1a' }}>{c.name}</div>
              </div>
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: '#888' }}>{type} · {period}</div>
                <div style={{ fontSize: 10, color: '#aaa', marginTop: 2, fontFamily: 'var(--font-mono)' }}>by Cadence</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {[
                ['Total spend', fmtMoney(totalSpend)],
                ['Results', fmtNum(totalResults)],
                ['Blended CPL', '$'+blendedCpl.toFixed(2)],
              ].map(([l,v]) => (
                <div key={l}>
                  <div style={{ fontSize: 10.5, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{l}</div>
                  <div style={{ fontSize: 22, fontWeight: 600, color: '#1a1a1a', marginTop: 4, fontFamily: 'var(--font-mono)' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: '24px 32px 32px' }}>
            <Section h="Executive summary" body={content.summary}/>
            <div style={{ marginBottom: 22 }}>
              <H>Performance trend</H>
              <div style={{ background: '#fafafa', borderRadius: 6, padding: 8, border: '1px solid #eee' }}>
                <LineChart series={series} height={180} color={c.color} formatY={v=>'$'+v}/>
              </div>
            </div>
            <Section h="What worked" body={content.worked}/>
            <Section h="What didn't" body={content.didnt}/>
            <div style={{ marginBottom: 22 }}>
              <H>Daily spend</H>
              <div style={{ background: '#fafafa', borderRadius: 6, padding: 8, border: '1px solid #eee' }}>
                <BarChart data={barData} height={160} formatY={v=>'$'+v}/>
              </div>
            </div>
            <Section h="Learnings" body={content.learnings}/>
            <Section h="Next steps" body={content.next}/>
          </div>
        </div>
      </div>
    </div>
  );
};

const H = ({ children }) => <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 8 }}>{children}</div>;
const Section = ({ h, body }) => (
  <div style={{ marginBottom: 22 }}>
    <H>{h}</H>
    <div style={{ fontSize: 12.5, lineHeight: 1.65, color: '#1a1a1a', whiteSpace: 'pre-line' }}>{body}</div>
  </div>
);

window.ReportBuilder = ReportBuilder;
