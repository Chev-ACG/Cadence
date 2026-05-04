// charts.jsx — minimalist SVG charts

function LineChart({ series, height = 220, color = 'var(--brand-solid)', gradient = true, showGrid = true, showAxis = true, formatY = (v) => v }) {
  const padding = { top: 12, right: 16, bottom: showAxis ? 28 : 12, left: showAxis ? 44 : 12 };
  const width = 800;
  const W = width - padding.left - padding.right;
  const H = height - padding.top - padding.bottom;
  const flat = series.flatMap(s => s.data);
  const max = Math.max(...flat) * 1.1;
  const min = 0;
  const xStep = W / Math.max(1, series[0].data.length - 1);
  const y = (v) => padding.top + H - ((v - min) / (max - min)) * H;
  const x = (i) => padding.left + i * xStep;

  const gridLines = 4;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height, display: 'block' }} preserveAspectRatio="none">
      <defs>
        {series.map((s, i) => (
          <linearGradient key={i} id={`grad-${i}-${s.key || i}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={s.color || color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={s.color || color} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>
      {showGrid && Array.from({ length: gridLines + 1 }).map((_, i) => {
        const yy = padding.top + (H / gridLines) * i;
        const v = max - ((max - min) / gridLines) * i;
        return (
          <g key={i}>
            <line x1={padding.left} y1={yy} x2={width - padding.right} y2={yy} stroke="var(--border-subtle)" strokeWidth="1" strokeDasharray={i === gridLines ? '0' : '2 4'} />
            {showAxis && <text x={padding.left - 8} y={yy + 3} fontSize="10.5" fill="var(--text-faint)" textAnchor="end" fontFamily="var(--font-mono)">{formatY(Math.round(v))}</text>}
          </g>
        );
      })}
      {showAxis && series[0].labels && series[0].labels.map((label, i) => i % 2 === 0 && (
        <text key={i} x={x(i)} y={height - 8} fontSize="10.5" fill="var(--text-faint)" textAnchor="middle" fontFamily="var(--font-mono)">{label}</text>
      ))}
      {series.map((s, idx) => {
        const path = s.data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(v)}`).join(' ');
        const area = `${path} L ${x(s.data.length - 1)} ${padding.top + H} L ${x(0)} ${padding.top + H} Z`;
        return (
          <g key={idx}>
            {gradient && <path d={area} fill={`url(#grad-${idx}-${s.key || idx})`} />}
            <path d={path} fill="none" stroke={s.color || color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
            {s.data.map((v, i) => (
              <circle key={i} cx={x(i)} cy={y(v)} r="2.5" fill="var(--bg-elev)" stroke={s.color || color} strokeWidth="1.5" opacity={i === s.data.length - 1 ? 1 : 0} />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

function Sparkline({ data, color = 'var(--brand-solid)', width = 80, height = 32, fill = true }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const xStep = width / (data.length - 1);
  const points = data.map((v, i) => [i * xStep, height - 2 - ((v - min) / range) * (height - 4)]);
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');
  const area = `${path} L ${width} ${height} L 0 ${height} Z`;
  const id = `sp-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={area} fill={`url(#${id})`} />}
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function BarChart({ data, height = 200, color = 'var(--brand-solid)', formatY = (v) => v }) {
  const padding = { top: 12, right: 12, bottom: 28, left: 44 };
  const width = 800;
  const W = width - padding.left - padding.right;
  const H = height - padding.top - padding.bottom;
  const max = Math.max(...data.map(d => d.value)) * 1.1;
  const barW = W / data.length * 0.6;
  const gap = W / data.length * 0.4;
  const id = `bg-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height, display: 'block' }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--brand-1)" />
          <stop offset="100%" stopColor="var(--brand-2)" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
        const yy = padding.top + H * p;
        const v = max * (1 - p);
        return (
          <g key={i}>
            <line x1={padding.left} y1={yy} x2={width - padding.right} y2={yy} stroke="var(--border-subtle)" strokeWidth="1" strokeDasharray={p === 1 ? '0' : '2 4'} />
            <text x={padding.left - 8} y={yy + 3} fontSize="10.5" fill="var(--text-faint)" textAnchor="end" fontFamily="var(--font-mono)">{formatY(Math.round(v))}</text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const h = (d.value / max) * H;
        const xx = padding.left + i * (W / data.length) + gap / 2;
        const yy = padding.top + H - h;
        return (
          <g key={i}>
            <rect x={xx} y={yy} width={barW} height={h} rx="3" fill={`url(#${id})`} opacity="0.92" />
            <text x={xx + barW / 2} y={height - 8} fontSize="10.5" fill="var(--text-faint)" textAnchor="middle" fontFamily="var(--font-mono)">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

function Donut({ data, size = 140, thickness = 16 }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = size / 2 - thickness / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border-subtle)" strokeWidth={thickness} />
      {data.map((d, i) => {
        const len = (d.value / total) * c;
        const dash = `${len} ${c - len}`;
        const seg = (
          <circle key={i} cx={size/2} cy={size/2} r={r} fill="none" stroke={d.color} strokeWidth={thickness} strokeDasharray={dash} strokeDashoffset={-offset} strokeLinecap="butt" />
        );
        offset += len;
        return seg;
      })}
    </svg>
  );
}

window.Charts = { LineChart, Sparkline, BarChart, Donut };
