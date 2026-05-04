// preflight.jsx
const Preflight = ({ onSubmit }) => {
  const { Badge, ClientChip, PlatformIcon, fmtMoney } = window.Shell;
  const { Check, Upload, ChevronDown, Image, Sparkles } = window.Icon;
  const { CLIENTS, PLATFORMS, OBJECTIVES, FUNNELS } = window.DATA;

  const [open, setOpen] = React.useState({ s1: true, s2: true, s3: true, s4: true });
  const [form, setForm] = React.useState({
    client: 'aurelia',
    name: '',
    platform: 'meta',
    objective: 'Conversion',
    funnel: 'Cold',
    message: '',
    audience: '',
    audienceSize: '',
    variants: 3,
    start: '2026-05-05',
    end: '2026-06-05',
    budgetTotal: '',
    budgetDaily: '',
    test: false,
    metric: 'CPL',
    metricTarget: '',
    checks: { links: false, utms: false, pixel: false, mobile: false, brand: false }
  });

  const [errors, setErrors] = React.useState({});

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleCheck = (k) => setForm(f => ({ ...f, checks: { ...f.checks, [k]: !f.checks[k] } }));

  const sec1Done = form.client && form.name && form.platform && form.objective;
  const sec2Done = form.message && form.audience;
  const sec3Done = form.budgetTotal && form.budgetDaily;
  const sec4Done = Object.values(form.checks).every(Boolean);
  const completion = [sec1Done, sec2Done, sec3Done, sec4Done].filter(Boolean).length;

  const checkItems = [
    { k: 'links', label: 'Destination links tested', help: 'All landing URLs resolve and load < 3s' },
    { k: 'utms', label: 'UTM parameters tagged', help: 'utm_source, medium, campaign, content set' },
    { k: 'pixel', label: 'Pixel firing verified', help: 'Conversion events tracked in test mode' },
    { k: 'mobile', label: 'Mobile preview approved', help: 'Layout passes on iPhone & Android' },
    { k: 'brand', label: 'Brand & legal sign-off', help: 'Approved by client point of contact' },
  ];

  const handleSubmit = () => {
    const e = {};
    if (!form.name) e.name = 'Required';
    if (!form.message) e.message = 'Required';
    if (!form.audience) e.audience = 'Required';
    if (!form.budgetTotal) e.budgetTotal = 'Required';
    if (!form.budgetDaily) e.budgetDaily = 'Required';
    if (Object.keys(e).length) { setErrors(e); return; }
    onSubmit && onSubmit(form);
  };

  const Section = ({ id, num, title, meta, children, done }) => (
    <div className="form-section" data-open={open[id]}>
      <div className="form-section-head" onClick={() => setOpen(o => ({ ...o, [id]: !o[id] }))}>
        <span className="form-section-num" data-done={done}>{done ? <Check size={11}/> : num}</span>
        <span className="form-section-title">{title}</span>
        <span className="form-section-meta">{meta}</span>
        <ChevronDown size={14} style={{ color: 'var(--text-subtle)', transform: open[id] ? 'rotate(0)' : 'rotate(-90deg)', transition: 'transform 150ms' }}/>
      </div>
      <div className="form-section-body">{children}</div>
    </div>
  );

  const client = CLIENTS.find(c => c.id === form.client);
  const platform = PLATFORMS.find(p => p.id === form.platform);

  return (
    <div className="content-inner" style={{ maxWidth: 1280 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Pre-Flight Checklist</h1>
          <p className="page-sub">Standardize every launch. Submitted ads land directly in the registry.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{completion}/4 sections complete</div>
          <div style={{ width: 100 }}>
            <div className="progress"><div className="progress-fill" style={{ width: `${completion/4*100}%` }}/></div>
          </div>
          <button className="btn btn-secondary">Save draft</button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Submit & launch <window.Icon.ArrowRight size={13}/>
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20, alignItems: 'flex-start' }}>
        <div>
          <Section id="s1" num="1" title="Client & Campaign" meta="Who and what" done={sec1Done}>
            <div className="field-row">
              <div className="field">
                <label className="label"><span className="req"></span>Client</label>
                <select className="select" value={form.client} onChange={e=>update('client', e.target.value)}>
                  {CLIENTS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="field">
                <label className="label"><span className="req"></span>Ad name</label>
                <input className="input" data-error={!!errors.name} placeholder="e.g. Summer Glow — Reels A" value={form.name} onChange={e=>{update('name', e.target.value); setErrors(er=>({...er, name: undefined}));}} />
                {errors.name && <span className="error">{errors.name}</span>}
              </div>
            </div>
            <div className="field-row-3">
              <div className="field">
                <label className="label"><span className="req"></span>Platform</label>
                <select className="select" value={form.platform} onChange={e=>update('platform', e.target.value)}>
                  {PLATFORMS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="field">
                <label className="label"><span className="req"></span>Objective</label>
                <select className="select" value={form.objective} onChange={e=>update('objective', e.target.value)}>
                  {OBJECTIVES.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div className="field">
                <label className="label">Funnel stage</label>
                <select className="select" value={form.funnel} onChange={e=>update('funnel', e.target.value)}>
                  {FUNNELS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
            </div>
            <div className="checkbox" data-checked={form.test} onClick={()=>update('test', !form.test)} style={{ cursor: 'default' }}>
              <span className="check-box"><Check /></span>
              <div>
                <div className="check-label">This is a test ad</div>
                <div className="check-help">Test ads run on smaller budgets and inform full launches</div>
              </div>
            </div>
          </Section>

          <Section id="s2" num="2" title="Creative & Targeting" meta="The message and the audience" done={sec2Done}>
            <div className="field">
              <label className="label"><span className="req"></span>Primary copy / message</label>
              <textarea className="textarea" data-error={!!errors.message} placeholder="The hook headline + body that runs in the ad…" value={form.message} onChange={e=>{update('message', e.target.value); setErrors(er=>({...er, message: undefined}));}} />
              <span className="help">{form.message.length}/280 characters</span>
            </div>
            <div className="field-row">
              <div className="field">
                <label className="label"><span className="req"></span>Target audience</label>
                <textarea className="textarea" style={{ minHeight: 76 }} placeholder="Women 28–45, beauty-curious, Tier 1 cities…" value={form.audience} onChange={e=>{update('audience', e.target.value); setErrors(er=>({...er, audience: undefined}));}} />
              </div>
              <div className="field">
                <label className="label">Estimated audience size</label>
                <input className="input" placeholder="e.g. 2.4M" value={form.audienceSize} onChange={e=>update('audienceSize', e.target.value)} />
                <label className="label" style={{ marginTop: 8 }}>Creative variants</label>
                <input className="input" type="number" value={form.variants} onChange={e=>update('variants', e.target.value)} />
              </div>
            </div>
            <div>
              <label className="label">Creative assets</label>
              <div style={{ display: 'flex', gap: 10, marginTop: 6, flexWrap: 'wrap' }}>
                {[1,2,3].map(i => (
                  <div key={i} style={{ width: 96, height: 96, borderRadius: 8, border: '1px solid var(--border)', background: 'repeating-linear-gradient(135deg, var(--bg-sunken) 0 8px, var(--bg-hover) 8px 16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-faint)', position: 'relative' }}>
                    <Image size={18} />
                    <span style={{ position: 'absolute', bottom: 6, left: 8, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)' }}>v{i}.mp4</span>
                  </div>
                ))}
                <button style={{ width: 96, height: 96, borderRadius: 8, border: '1.5px dashed var(--border-strong)', background: 'transparent', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, fontSize: 11.5 }}>
                  <Upload size={16} /> Add
                </button>
              </div>
            </div>
          </Section>

          <Section id="s3" num="3" title="Budget & Period" meta="When and how much" done={sec3Done}>
            <div className="field-row">
              <div className="field">
                <label className="label"><span className="req"></span>Start date</label>
                <input className="input" type="date" value={form.start} onChange={e=>update('start', e.target.value)} />
              </div>
              <div className="field">
                <label className="label"><span className="req"></span>End date</label>
                <input className="input" type="date" value={form.end} onChange={e=>update('end', e.target.value)} />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label className="label"><span className="req"></span>Total budget</label>
                <input className="input" data-error={!!errors.budgetTotal} placeholder="$" value={form.budgetTotal} onChange={e=>{update('budgetTotal', e.target.value); setErrors(er=>({...er, budgetTotal: undefined}));}} />
              </div>
              <div className="field">
                <label className="label"><span className="req"></span>Daily budget</label>
                <input className="input" data-error={!!errors.budgetDaily} placeholder="$" value={form.budgetDaily} onChange={e=>{update('budgetDaily', e.target.value); setErrors(er=>({...er, budgetDaily: undefined}));}} />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label className="label">Success metric</label>
                <select className="select" value={form.metric} onChange={e=>update('metric', e.target.value)}>
                  <option>CPL</option><option>CPA</option><option>ROAS</option><option>CTR</option><option>CPC</option>
                </select>
              </div>
              <div className="field">
                <label className="label">Target value</label>
                <input className="input" placeholder="e.g. < $30" value={form.metricTarget} onChange={e=>update('metricTarget', e.target.value)} />
              </div>
            </div>
          </Section>

          <Section id="s4" num="4" title="Quality Checks" meta={`${Object.values(form.checks).filter(Boolean).length}/5 verified`} done={sec4Done}>
            <div style={{ display: 'grid', gap: 8 }}>
              {checkItems.map(c => (
                <div key={c.k} className="checkbox" data-checked={form.checks[c.k]} onClick={() => toggleCheck(c.k)}>
                  <span className="check-box"><Check /></span>
                  <div>
                    <div className="check-label">{c.label}</div>
                    <div className="check-help">{c.help}</div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>

        <aside style={{ position: 'sticky', top: 0 }}>
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-faint)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Live preview</span>
              <Badge tone="testing">{form.test ? 'Test' : 'Live'}</Badge>
            </div>
            <div style={{ height: 200, background: 'repeating-linear-gradient(135deg, var(--bg-sunken) 0 10px, var(--bg-hover) 10px 20px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-faint)', position: 'relative' }}>
              <Image size={28} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, marginTop: 6 }}>creative.mp4</span>
              <span style={{ position: 'absolute', top: 10, right: 10 }}><PlatformIcon id={form.platform}/></span>
            </div>
            <div style={{ padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <ClientChip id={form.client} />
                <span style={{ fontSize: 11, color: 'var(--text-subtle)' }}>· Sponsored</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, color: 'var(--text)', lineHeight: 1.35 }}>
                {form.name || <span style={{ color: 'var(--text-faint)' }}>Ad name appears here</span>}
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 14 }}>
                {form.message || <span style={{ color: 'var(--text-faint)' }}>Your primary copy will preview here as you type…</span>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 11.5 }}>
                <div><div style={{ color: 'var(--text-subtle)' }}>Objective</div><div style={{ fontWeight: 500, marginTop: 2 }}>{form.objective}</div></div>
                <div><div style={{ color: 'var(--text-subtle)' }}>Funnel</div><div style={{ fontWeight: 500, marginTop: 2 }}>{form.funnel}</div></div>
                <div><div style={{ color: 'var(--text-subtle)' }}>Period</div><div style={{ fontWeight: 500, fontFamily: 'var(--font-mono)', fontSize: 11, marginTop: 2 }}>{form.start} → {form.end}</div></div>
                <div><div style={{ color: 'var(--text-subtle)' }}>Daily budget</div><div style={{ fontWeight: 500, fontFamily: 'var(--font-mono)', marginTop: 2 }}>{form.budgetDaily ? '$'+form.budgetDaily : '—'}</div></div>
              </div>
            </div>
            <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '12px 18px', background: 'var(--bg-sunken)', fontSize: 11.5, color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={12} style={{ color: 'var(--brand-solid)' }}/>
                <span>This will be added to the registry on submit.</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
window.Preflight = Preflight;
