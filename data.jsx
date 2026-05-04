// data.jsx — sample data for the Cadence prototype

const CLIENTS = [
  { id: 'aurelia', name: 'Aurelia Skincare', short: 'AS', color: 'oklch(0.62 0.14 25)', industry: 'Beauty & Wellness', spend: 84200, cpl: 18.40, campaigns: 6 },
  { id: 'northwind', name: 'Northwind Logistics', short: 'NW', color: 'oklch(0.45 0.12 240)', industry: 'B2B SaaS', spend: 142800, cpl: 64.20, campaigns: 4 },
  { id: 'parable', name: 'Parable Coffee', short: 'PC', color: 'oklch(0.4 0.06 60)', industry: 'F&B', spend: 36400, cpl: 9.80, campaigns: 3 },
  { id: 'tilde', name: 'Tilde Financial', short: 'TF', color: 'oklch(0.55 0.14 155)', industry: 'Fintech', spend: 218000, cpl: 38.60, campaigns: 8 },
  { id: 'meridian', name: 'Meridian Health', short: 'MH', color: 'oklch(0.6 0.13 200)', industry: 'Healthcare', spend: 96300, cpl: 42.10, campaigns: 5 },
  { id: 'orbit', name: 'Orbit Studios', short: 'OS', color: 'oklch(0.5 0.18 305)', industry: 'Creative', spend: 28900, cpl: 14.20, campaigns: 2 },
];

const PLATFORMS = [
  { id: 'meta', name: 'Meta', short: 'M' },
  { id: 'google', name: 'Google', short: 'G' },
  { id: 'linkedin', name: 'LinkedIn', short: 'in' },
  { id: 'tiktok', name: 'TikTok', short: 'tt' },
  { id: 'x', name: 'X', short: 'x' },
];

const OBJECTIVES = ['Awareness', 'Engagement', 'Traffic', 'Conversion', 'Lead Gen', 'Retargeting', 'Testing'];
const FUNNELS = ['Cold', 'Warm', 'Retargeting'];

const ADS = [
  { id: 'a1', name: 'Spring Glow — Carousel A', client: 'aurelia', platform: 'meta', objective: 'Conversion', funnel: 'Cold', status: 'live', period: 'Apr 18 → May 18', spend: 4820, results: 312, cpl: 15.45, owner: 'M. Reyes', test: false },
  { id: 'a2', name: 'NW Q2 Demo Push', client: 'northwind', platform: 'linkedin', objective: 'Lead Gen', funnel: 'Cold', status: 'live', period: 'Apr 22 → May 22', spend: 12400, results: 168, cpl: 73.80, owner: 'J. Park', test: false },
  { id: 'a3', name: 'Pour Over Reels — Test 03', client: 'parable', platform: 'meta', objective: 'Engagement', funnel: 'Cold', status: 'live', period: 'May 01 → May 14', spend: 980, results: 4280, cpl: 0.23, owner: 'L. Adler', test: true },
  { id: 'a4', name: 'Tilde — Wealth Quiz Funnel', client: 'tilde', platform: 'meta', objective: 'Lead Gen', funnel: 'Cold', status: 'live', period: 'Apr 10 → May 31', spend: 18600, results: 482, cpl: 38.60, owner: 'M. Reyes', test: false },
  { id: 'a5', name: 'Meridian — Search Branded', client: 'meridian', platform: 'google', objective: 'Conversion', funnel: 'Warm', status: 'live', period: 'Mar 04 → Jun 30', spend: 9240, results: 218, cpl: 42.38, owner: 'A. Chen', test: false },
  { id: 'a6', name: 'Orbit — Founders Story', client: 'orbit', platform: 'tiktok', objective: 'Awareness', funnel: 'Cold', status: 'live', period: 'Apr 28 → May 12', spend: 1480, results: 86200, cpl: 0.017, owner: 'L. Adler', test: false },
  { id: 'a7', name: 'Aurelia — Retargeting Cart', client: 'aurelia', platform: 'meta', objective: 'Retargeting', funnel: 'Retargeting', status: 'live', period: 'May 02 → May 30', spend: 2180, results: 248, cpl: 8.79, owner: 'M. Reyes', test: false },
  { id: 'a8', name: 'NW — Whitepaper Promo', client: 'northwind', platform: 'google', objective: 'Lead Gen', funnel: 'Warm', status: 'live', period: 'Apr 15 → May 15', spend: 6200, results: 92, cpl: 67.39, owner: 'J. Park', test: false },
  { id: 'a9', name: 'Tilde — IG Reels Awareness', client: 'tilde', platform: 'meta', objective: 'Awareness', funnel: 'Cold', status: 'paused', period: 'Mar 12 → Apr 30', spend: 8400, results: 142000, cpl: 0.06, owner: 'A. Chen', test: false },
  { id: 'a10', name: 'Parable — Local Search', client: 'parable', platform: 'google', objective: 'Traffic', funnel: 'Cold', status: 'ended', period: 'Mar 01 → Apr 30', spend: 3200, results: 18400, cpl: 0.17, owner: 'L. Adler', test: false },
  { id: 'a11', name: 'Aurelia — Hero Reels Test', client: 'aurelia', platform: 'meta', objective: 'Testing', funnel: 'Cold', status: 'ended', period: 'Mar 14 → Mar 28', spend: 620, results: 184, cpl: 3.37, owner: 'M. Reyes', test: true },
  { id: 'a12', name: 'Tilde — LinkedIn TFM Q1', client: 'tilde', platform: 'linkedin', objective: 'Lead Gen', funnel: 'Cold', status: 'archived', period: 'Jan 10 → Mar 31', spend: 22400, results: 312, cpl: 71.79, owner: 'J. Park', test: false },
];

// Daily metric series — 14 days of data per ad. Generated to look real.
function makeSeries(seed, base, drift) {
  const out = [];
  let v = base;
  for (let i = 0; i < 14; i++) {
    const noise = (Math.sin(seed + i * 1.3) * 0.5 + Math.cos(seed * 2.1 + i * 0.7) * 0.5) * drift;
    v = Math.max(base * 0.4, base + noise + (i - 7) * (drift * 0.05));
    out.push(Math.round(v * 100) / 100);
  }
  return out;
}

const DAILY_SERIES = ADS.reduce((acc, ad, i) => {
  const dailySpend = ad.spend / 14;
  acc[ad.id] = {
    spend: makeSeries(i * 7.3, dailySpend, dailySpend * 0.4),
    impressions: makeSeries(i * 5.1, ad.spend * 14, ad.spend * 6),
    clicks: makeSeries(i * 3.7, Math.max(20, ad.results * 0.7), Math.max(8, ad.results * 0.3)),
    results: makeSeries(i * 4.2, ad.results / 14, ad.results / 14 * 0.4),
  };
  return acc;
}, {});

const REPORTS = [
  { id: 'r1', client: 'aurelia', type: 'Weekly', period: 'Apr 21 – Apr 27', generated: 'Apr 28', author: 'M. Reyes' },
  { id: 'r2', client: 'tilde', type: 'Monthly', period: 'March 2026', generated: 'Apr 02', author: 'A. Chen' },
  { id: 'r3', client: 'northwind', type: 'Weekly', period: 'Apr 21 – Apr 27', generated: 'Apr 28', author: 'J. Park' },
  { id: 'r4', client: 'parable', type: 'Weekly', period: 'Apr 14 – Apr 20', generated: 'Apr 21', author: 'L. Adler' },
  { id: 'r5', client: 'tilde', type: 'Weekly', period: 'Apr 21 – Apr 27', generated: 'Apr 28', author: 'A. Chen' },
  { id: 'r6', client: 'meridian', type: 'Monthly', period: 'March 2026', generated: 'Apr 03', author: 'A. Chen' },
];

window.DATA = { CLIENTS, PLATFORMS, OBJECTIVES, FUNNELS, ADS, DAILY_SERIES, REPORTS };
