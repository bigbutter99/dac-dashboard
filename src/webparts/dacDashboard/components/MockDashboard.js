import * as React from 'react';
import { Search, Building2, Filter, ExternalLink, TrendingUp, DollarSign, Users, Factory, ClipboardList, BadgeCheck, AlertTriangle, BookOpen, Newspaper, ArrowUpRight, ShieldCheck, Timer, Printer, ArrowLeft, Globe2, MapPin } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, Area, AreaChart } from 'recharts';
import styles from './MockDashboard.module.scss';
import { MockProvider } from '../data/MockProvider';
import { Panel, PanelType } from '@fluentui/react';
const ALL_TABS = ['home', 'finder', 'company', 'funding', 'pubs', 'stale', 'map'];
const TABS = [{
  id: 'home',
  label: 'Home',
  icon: TrendingUp
}, {
  id: 'finder',
  label: 'Finder',
  icon: Search
}, {
  id: 'company',
  label: 'Company 360',
  icon: Building2
}, {
  id: 'funding',
  label: 'Funding & Deals',
  icon: DollarSign
}, {
  id: 'pubs',
  label: 'Publications & Patents',
  icon: BookOpen
}, {
  id: 'map',
  label: 'Map',
  icon: Globe2
}, {
  id: 'stale',
  label: 'Staleness',
  icon: AlertTriangle
}];
const COLORS = {
  brand: '#e4002b',
  brandDark: '#b30022',
  green: '#1db954',
  amber: '#f59e0b',
  red: '#ef4444',
  slate: '#64748b',
  bg: '#f8fafc'
};
const MOCK_COMPANIES = [{
  id: 'climeworks',
  name: 'Climeworks',
  website: 'https://www.climeworks.com',
  country: 'Switzerland',
  approach: 'S-DAC (solid sorbent)',
  stage: 'Commercial pilot',
  founded: 2009,
  totalFunding: 850_000_000,
  freshnessDays: 11,
  description: 'Builds modular solid-sorbent DAC plants (e.g., Orca, Mammoth). Focus on high-up-time modular arrays and renewable integration.',
  aliases: ['Clime Works'],
  collaborations: [{
    with: 'Carbfix',
    kind: 'storage',
    startDate: '2021-06-01'
  }, {
    with: 'Microsoft',
    kind: 'offtake',
    startDate: '2023-01-10'
  }],
  fundingRounds: [{
    date: '2022-04-01',
    amount: 650_000_000,
    roundType: 'Equity',
    investors: ['GIC', 'OTHERS'],
    source: 'news'
  }, {
    date: '2020-05-10',
    amount: 75_000_000,
    roundType: 'Equity',
    investors: ['Private'],
    source: 'news'
  }],
  projects: [{
    name: 'Orca',
    type: 'Pilot',
    location: 'Iceland',
    capacity: 4000,
    status: 'Operating',
    startDate: '2021-09-01',
    partners: ['Carbfix']
  }, {
    name: 'Mammoth',
    type: 'Demo',
    location: 'Iceland',
    capacity: 36000,
    status: 'Construction',
    startDate: '2023-06-01',
    partners: ['Carbfix']
  }],
  interactions: [{
    date: '2024-02-14',
    type: 'meeting',
    attendees: ['TTE New Energy'],
    summary: 'Intro on offtake potential'
  }, {
    date: '2024-11-07',
    type: 'site_visit',
    attendees: ['TTE CCUS'],
    summary: 'Mammoth status review'
  }],
  claims: [{
    id: 'c1',
    text: 'Specific energy use 1,800–2,200 kWh/tCO₂ at plant scale',
    metricType: 'EnergyUse',
    unit: 'kWh/tCO2',
    min: 1800,
    ml: 2000,
    max: 2200,
    trust: 'Amber',
    trustScore: 66,
    evidence: [{
      type: 'publication',
      title: 'Peer-reviewed LCA',
      url: '#',
      date: '2023-09-01'
    }, {
      type: 'news',
      title: 'Plant datasheet',
      url: '#',
      date: '2024-03-12'
    }]
  }, {
    id: 'c2',
    text: 'Capture cost <$600/t at current generation',
    metricType: 'LCOC',
    unit: 'USD/tCO2',
    min: 450,
    ml: 580,
    max: 650,
    trust: 'Red',
    trustScore: 40,
    evidence: [{
      type: 'news',
      title: 'Company blog post',
      url: '#',
      date: '2024-05-22'
    }]
  }],
  publications: [{
    title: 'DAC sorbent aging study',
    date: '2023-07-10',
    link: '#',
    type: 'Publication'
  }],
  patents: [{
    title: 'Modular contactor array',
    date: '2022-11-05',
    link: '#',
    type: 'Patent'
  }],
  news: [{
    title: 'Mammoth modules delivered',
    date: '2025-04-18',
    link: '#',
    type: 'News'
  }],
  logoUrl: 'https://placehold.co/80x80/FFE5E9/7A1624?text=CL',
  overviewImages: [{
    src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80',
    caption: 'Modular solid sorbent array concept (mock)'
  }]
}, {
  id: 'carbon-engineering',
  name: 'Carbon Engineering',
  website: 'https://carbonengineering.com',
  country: 'Canada',
  approach: 'L-DAC (liquid solvent)',
  stage: 'Demo',
  founded: 2009,
  totalFunding: 500_000_000,
  freshnessDays: 23,
  description: 'Liquid-solvent DAC using KOH capture and CaCO₃ calcination; large-scale partnership approach.',
  aliases: ['CE', 'Carbon Eng'],
  collaborations: [{
    with: 'Oxy/1PointFive',
    kind: 'project',
    startDate: '2022-08-01'
  }, {
    with: 'Air Liquide',
    kind: 'technology',
    startDate: '2023-04-12'
  }],
  fundingRounds: [{
    date: '2019-03-01',
    amount: 68_000_000,
    roundType: 'Equity',
    investors: ['Chevron', 'Oxy', 'BHP'],
    source: 'news'
  }, {
    date: '2021-03-10',
    amount: 25_000_000,
    roundType: 'Grant',
    investors: ['Gov CA'],
    source: 'news'
  }],
  projects: [{
    name: 'Direct Air Capture 1A',
    type: 'Demo',
    location: 'Permian Basin (US)',
    capacity: 500000,
    status: 'Development',
    startDate: '2024-10-01',
    partners: ['1PointFive']
  }],
  interactions: [{
    date: '2024-05-20',
    type: 'call',
    attendees: ['TTE Strategy'],
    summary: 'Introductory call'
  }],
  claims: [{
    id: 'ce1',
    text: 'Heat integration reduces energy by 12–18% vs prior design',
    metricType: 'EnergyUse',
    unit: '%',
    min: 12,
    ml: 15,
    max: 18,
    trust: 'Green',
    trustScore: 82,
    evidence: [{
      type: 'patent',
      title: 'Heat recovery for DAC',
      url: '#',
      date: '2023-02-01'
    }]
  }],
  publications: [{
    title: 'Solvent regeneration kinetics',
    date: '2022-10-01',
    link: '#',
    type: 'Publication'
  }],
  patents: [{
    title: 'Pellet reactor optimization',
    date: '2021-06-01',
    link: '#',
    type: 'Patent'
  }],
  news: [{
    title: 'Project 1A FEED complete',
    date: '2025-01-15',
    link: '#',
    type: 'News'
  }],
  logoUrl: 'https://placehold.co/80x80/E4F1FF/0B1D35?text=CE',
  overviewImages: [{
    src: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=80',
    caption: 'Solvent loop schematic (illustrative)'
  }]
}, {
  id: 'heirloom',
  name: 'Heirloom',
  website: 'https://www.heirloomcarbon.com',
  country: 'USA',
  approach: 'M-DAC (mineral looping)',
  stage: 'Pilot',
  founded: 2020,
  totalFunding: 250_000_000,
  freshnessDays: 6,
  description: 'Mineralization loop leveraging calcium oxide cycle; rapid carbonation surfaces with engineered trays.',
  aliases: [],
  collaborations: [{
    with: 'Lafarge',
    kind: 'materials',
    startDate: '2023-09-10'
  }, {
    with: 'Microsoft',
    kind: 'offtake',
    startDate: '2024-03-01'
  }],
  fundingRounds: [{
    date: '2023-10-12',
    amount: 53_000_000,
    roundType: 'Series B',
    investors: ['Breakthrough Energy Ventures'],
    source: 'news'
  }],
  projects: [{
    name: 'Tracy Pilot',
    type: 'Pilot',
    location: 'Tracy, CA',
    capacity: 1000,
    status: 'Operating',
    startDate: '2023-11-01',
    partners: ['City of Tracy']
  }],
  interactions: [{
    date: '2025-03-04',
    type: 'meeting',
    attendees: ['TTE Ventures'],
    summary: 'Technology roadmap discussion'
  }],
  claims: [{
    id: 'h1',
    text: 'Ambient carbonation achieves >60% in 2 hours',
    metricType: 'Kinetics',
    unit: '% in 2h',
    min: 55,
    ml: 62,
    max: 68,
    trust: 'Amber',
    trustScore: 61,
    evidence: [{
      type: 'publication',
      title: 'Tray kinetics report',
      url: '#',
      date: '2024-08-19'
    }]
  }],
  publications: [{
    title: 'Mineral loop scaling challenges',
    date: '2024-06-20',
    link: '#',
    type: 'Publication'
  }],
  patents: [{
    title: 'High-surface tray architecture',
    date: '2024-01-12',
    link: '#',
    type: 'Patent'
  }],
  news: [{
    title: 'Tracy pilot milestone',
    date: '2025-05-02',
    link: '#',
    type: 'News'
  }],
  logoUrl: 'https://placehold.co/80x80/E6F7F0/104235?text=HE',
  overviewImages: [{
    src: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80',
    caption: 'Tray-based mineral looping pilot (illustrative)'
  }]
}, {
  id: 'verdox',
  name: 'Verdox',
  website: 'https://verdox.com',
  country: 'USA',
  approach: 'E-DAC (electro-swing)',
  stage: 'Early pilot',
  founded: 2019,
  totalFunding: 200_000_000,
  freshnessDays: 15,
  description: 'Electro-swing adsorption using redox-active materials for low-energy capture and release.',
  aliases: [],
  collaborations: [{
    with: 'Chemours',
    kind: 'materials',
    startDate: '2023-01-01'
  }],
  fundingRounds: [{
    date: '2022-02-01',
    amount: 80_000_000,
    roundType: 'Series A',
    investors: ['Breakthrough Energy Ventures'],
    source: 'news'
  }],
  projects: [{
    name: 'Electro-swing Pilot A',
    type: 'Pilot',
    location: 'USA (Northeast)',
    capacity: 200,
    status: 'Construction',
    startDate: '2025-01-05',
    partners: []
  }],
  interactions: [{
    date: '2024-09-12',
    type: 'meeting',
    attendees: ['TTE R&D'],
    summary: 'Prototype discussion'
  }],
  claims: [{
    id: 'v1',
    text: 'Energy < 1,000 kWh/t at scale',
    metricType: 'EnergyUse',
    unit: 'kWh/tCO2',
    min: 800,
    ml: 950,
    max: 1000,
    trust: 'Red',
    trustScore: 38,
    evidence: [{
      type: 'news',
      title: 'Press release',
      url: '#',
      date: '2024-07-01'
    }]
  }],
  publications: [{
    title: 'Electro-swing electrode aging',
    date: '2023-12-01',
    link: '#',
    type: 'Publication'
  }],
  patents: [{
    title: 'Redox capture device',
    date: '2022-05-20',
    link: '#',
    type: 'Patent'
  }],
  news: [{
    title: 'Pilot site secured',
    date: '2025-02-11',
    link: '#',
    type: 'News'
  }],
  logoUrl: 'https://placehold.co/80x80/F2ECFF/2C0D5C?text=VE',
  overviewImages: [{
    src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
    caption: 'Electro-swing DAC module rendering (mock)'
  }]
}];
const guessClaimChangeDate = claim => claim?.evidence?.[0]?.date ?? '2024-01-01';
const formatMoney = value => `$${(value / 1_000_000).toFixed(0)}M`;
const capitalize = value => value.charAt(0).toUpperCase() + value.slice(1);
const ragColor = trust => {
  switch (trust) {
    case 'Green':
      return COLORS.green;
    case 'Amber':
      return COLORS.amber;
    default:
      return COLORS.red;
  }
};
const buildTimeline = company => {
  const events = [];
  company.fundingRounds.forEach(funding => events.push({
    date: funding.date,
    type: 'funding',
    label: `${formatMoney(funding.amount)} ${funding.roundType}`,
    icon: DollarSign,
    company: company.name,
    companyId: company.id
  }));
  company.projects.forEach(project => events.push({
    date: project.startDate,
    type: 'project',
    label: `${project.name} · ${project.type} @ ${project.location}`,
    icon: Factory,
    company: company.name,
    companyId: company.id
  }));
  company.interactions.forEach(interaction => events.push({
    date: interaction.date,
    type: 'interaction',
    label: `${capitalize(interaction.type)} – ${interaction.summary}`,
    icon: Users,
    company: company.name,
    companyId: company.id
  }));
  company.publications.forEach(doc => events.push({
    date: doc.date,
    type: 'publication',
    label: doc.title,
    icon: BookOpen,
    company: company.name,
    companyId: company.id
  }));
  company.patents.forEach(doc => events.push({
    date: doc.date,
    type: 'patent',
    label: doc.title,
    icon: ClipboardList,
    company: company.name,
    companyId: company.id
  }));
  company.news.forEach(doc => events.push({
    date: doc.date,
    type: 'news',
    label: doc.title,
    icon: Newspaper,
    company: company.name,
    companyId: company.id
  }));
  company.claims.forEach(claim => events.push({
    date: guessClaimChangeDate(claim),
    type: 'claim',
    label: `${claim.text} (${claim.trust})`,
    icon: BadgeCheck,
    company: company.name,
    companyId: company.id
  }));
  return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};
const daysSince = date => {
  const ms = Date.now() - new Date(date).getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
};
const countEvidenceTypes = company => {
  const types = new Set();
  if (company.publications?.length) {
    types.add('pub');
  }
  if (company.patents?.length) {
    types.add('pat');
  }
  if (company.news?.length) {
    types.add('news');
  }
  return Array.from(types);
};
const getInitials = value => value.split(/\s+/).map(part => part.charAt(0).toUpperCase()).slice(0, 2).join('');
const cloneClaim = claim => ({
  ...claim,
  evidence: claim.evidence ? [...claim.evidence.map(ev => ({
    ...ev
  }))] : []
});
const cloneCompany = company => ({
  ...company,
  collaborations: [...(company.collaborations || []).map(co => ({
    ...co
  }))],
  fundingRounds: [...(company.fundingRounds || []).map(fr => ({
    ...fr
  }))],
  projects: [...(company.projects || []).map(project => ({
    ...project
  }))],
  interactions: [...(company.interactions || []).map(interaction => ({
    ...interaction
  }))],
  claims: [...(company.claims || []).map(cloneClaim)],
  publications: [...(company.publications || []).map(pub => ({
    ...pub
  }))],
  patents: [...(company.patents || []).map(pat => ({
    ...pat
  }))],
  news: [...(company.news || []).map(n => ({
    ...n
  }))],
  overviewImages: company.overviewImages ? company.overviewImages.map(img => ({
    ...img
  })) : undefined
});
const slugify = value => value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `org-${Date.now().toString(36)}`;
const parseHash = () => {
  if (typeof window === 'undefined') {
    return {
      view: 'home'
    };
  }
  const hash = window.location.hash.replace(/^#/, '');
  const params = new URLSearchParams(hash);
  const viewParam = params.get('view') ?? 'home';
  const orgId = params.get('org') ?? undefined;
  const q = params.get('q') ?? undefined;
  const modeParam = params.get('mode');
  if (viewParam === 'brief') {
    return {
      view: 'brief',
      orgId,
      q,
      mode: modeParam || undefined
    };
  }
  const normalizedView = ALL_TABS.includes(viewParam) ? viewParam : 'home';
  return {
    view: normalizedView,
    orgId,
    q,
    mode: modeParam || undefined
  };
};
const buildHash = (view, orgId, extra) => {
  const params = new URLSearchParams();
  params.set('view', view);
  if (orgId) {
    params.set('org', orgId);
  }
  if (extra) {
    for (const [k, v] of Object.entries(extra)) {
      if (v) params.set(k, v);
    }
  }
  return params.toString();
};
const findCompanyById = (collection, id) => id ? collection.find(company => company.id === id) : undefined;
const Chip = ({
  children,
  active,
  onClick
}) => /*#__PURE__*/React.createElement("button", {
  type: "button",
  className: `${styles.chip} ${active ? styles.chipActive : ''}`,
  onClick: onClick
}, children);
const Badge = ({
  color,
  children
}) => /*#__PURE__*/React.createElement("span", {
  className: styles.badge,
  style: {
    background: `${color}1A`,
    color
  }
}, /*#__PURE__*/React.createElement("span", {
  className: styles.badgeSwatch,
  style: {
    background: color
  }
}), children);
const Card = ({
  title,
  actions,
  children
}) => /*#__PURE__*/React.createElement("div", {
  className: styles.card
}, /*#__PURE__*/React.createElement("div", {
  className: styles.cardHeader
}, /*#__PURE__*/React.createElement("h3", {
  className: styles.cardTitle
}, title), /*#__PURE__*/React.createElement("div", {
  className: styles.cardActions
}, actions)), /*#__PURE__*/React.createElement("div", {
  className: styles.cardBody
}, children));
const Kpi = ({
  label,
  value,
  icon: Icon,
  helper
}) => /*#__PURE__*/React.createElement("div", {
  className: styles.kpiCard
}, /*#__PURE__*/React.createElement("div", {
  className: styles.kpiIcon
}, /*#__PURE__*/React.createElement(Icon, {
  size: 18,
  color: COLORS.brand
})), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  className: styles.kpiLabel
}, label), /*#__PURE__*/React.createElement("div", {
  className: styles.kpiValue
}, value), helper && /*#__PURE__*/React.createElement("div", {
  className: styles.subtleText
}, helper)));
const HomePage = ({
  companies,
  onNavigate,
  getLink
}) => {
  const providerRef = React.useRef(new MockProvider(companies));
  const [news, setNews] = React.useState([]);
  const [newsWindow, setNewsWindow] = React.useState(14);
  const [newsType, setNewsType] = React.useState('All');
  React.useEffect(() => {
    providerRef.current.getNews(newsWindow).then(setNews);
  }, [newsWindow, companies]);
  const totals = React.useMemo(() => ({
    orgs: companies.length,
    projects: companies.reduce((acc, company) => acc + company.projects.length, 0),
    pilots: companies.reduce((acc, company) => acc + company.projects.filter(project => project.type.toLowerCase() === 'pilot').length, 0),
    funding: companies.reduce((acc, company) => acc + (company.totalFunding ?? 0), 0),
    new90: companies.reduce((acc, company) => acc + company.news.filter(item => daysSince(item.date) <= 90).length, 0)
  }), [companies]);
  const helperCopy = React.useMemo(() => ({
    orgs: `${companies.filter(company => company.freshnessDays <= 30).length} touched in 30 days`,
    projects: `${companies.filter(company => company.projects.length > 0).length} portfolios active`,
    pilots: `${companies.filter(company => company.projects.some(project => project.type.toLowerCase() === 'pilot')).length} orgs piloting`,
    funding: `${formatMoney(totals.funding / Math.max(1, totals.orgs))} avg/org`,
    new90: `${companies.filter(company => company.news.length > 0).length} orgs surfaced`
  }), [companies, totals.funding, totals.orgs]);
  const recentEvents = React.useMemo(() => {
    const events = companies.flatMap(company => buildTimeline(company).filter(event => daysSince(event.date) <= 30).map(event => ({
      ...event,
      company: company.name,
      companyId: company.id
    })));
    return events.slice(-12).reverse();
  }, [companies]);
  const stages = React.useMemo(() => Array.from(new Set(companies.map(company => company.stage))), [companies]);
  const approaches = React.useMemo(() => Array.from(new Set(companies.map(company => company.approach))), [companies]);
  return /*#__PURE__*/React.createElement("div", {
    className: styles.main
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.kpiGrid
  }, /*#__PURE__*/React.createElement(Kpi, {
    label: "Organizations",
    value: totals.orgs,
    icon: Building2,
    helper: helperCopy.orgs
  }), /*#__PURE__*/React.createElement(Kpi, {
    label: "Projects",
    value: totals.projects,
    icon: Factory,
    helper: helperCopy.projects
  }), /*#__PURE__*/React.createElement(Kpi, {
    label: "Active pilots",
    value: totals.pilots,
    icon: Timer,
    helper: helperCopy.pilots
  }), /*#__PURE__*/React.createElement(Kpi, {
    label: "Total funding",
    value: formatMoney(totals.funding),
    icon: DollarSign,
    helper: helperCopy.funding
  }), /*#__PURE__*/React.createElement(Kpi, {
    label: "New items (90d)",
    value: totals.new90,
    icon: Newspaper,
    helper: helperCopy.new90
  })), /*#__PURE__*/React.createElement("div", {
    className: styles.gridTwo
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Funding by organization"
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.chartArea
  }, /*#__PURE__*/React.createElement(ResponsiveContainer, {
    width: "100%",
    height: "100%"
  }, /*#__PURE__*/React.createElement(BarChart, {
    data: companies.map(company => ({
      name: company.name,
      funding: (company.totalFunding ?? 0) / 1_000_000
    }))
  }, /*#__PURE__*/React.createElement(CartesianGrid, {
    strokeDasharray: "3 3"
  }), /*#__PURE__*/React.createElement(XAxis, {
    dataKey: "name"
  }), /*#__PURE__*/React.createElement(YAxis, {
    unit: "M"
  }), /*#__PURE__*/React.createElement(Tooltip, {
    formatter: value => `${value}M`
  }), /*#__PURE__*/React.createElement(Legend, null), /*#__PURE__*/React.createElement(Bar, {
    dataKey: "funding",
    name: "Funding (USD M)",
    fill: COLORS.brand,
    radius: [6, 6, 0, 0]
  }))))), /*#__PURE__*/React.createElement(Card, {
    title: "Approach \xD7 Stage heatmap (mock)"
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.cardList
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.subtleText
  }, "Distribution of observed companies by DAC approach and commercialization stage."), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("table", {
    className: styles.table
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Approach"), stages.map(stage => /*#__PURE__*/React.createElement("th", {
    key: stage
  }, stage)))), /*#__PURE__*/React.createElement("tbody", null, approaches.map(approach => /*#__PURE__*/React.createElement("tr", {
    key: approach,
    className: styles.tableRow
  }, /*#__PURE__*/React.createElement("td", {
    className: styles.tableCell
  }, approach), stages.map(stage => {
    const count = companies.filter(company => company.approach === approach && company.stage === stage).length;
    const background = count ? `${COLORS.brand}22` : '#f1f5f9';
    const border = count ? `${COLORS.brand}33` : '#e2e8f0';
    return /*#__PURE__*/React.createElement("td", {
      key: `${approach}-${stage}`,
      className: styles.tableCell
    }, /*#__PURE__*/React.createElement("div", {
      className: styles.heatCell,
      style: {
        background,
        border: `1px solid ${border}`
      }
    }, count || ''));
  }))))))))), /*#__PURE__*/React.createElement(Card, {
    title: "Recent news",
    actions: /*#__PURE__*/React.createElement("div", {
      className: styles.chipRow
    }, [7, 14, 30, 90].map(days => /*#__PURE__*/React.createElement(Chip, {
      key: days,
      active: newsWindow === days,
      onClick: () => setNewsWindow(days)
    }, days, "d")), ['All', 'News', 'Publication', 'Patent'].map(t => /*#__PURE__*/React.createElement(Chip, {
      key: t,
      active: newsType === t,
      onClick: () => setNewsType(t)
    }, t)))
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.newsList
  }, news.filter(n => newsType === 'All' ? true : n.type === newsType).slice(0, 8).map(item => /*#__PURE__*/React.createElement("div", {
    key: item.id,
    className: styles.newsItem
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: styles.newsTitle
  }, item.title), /*#__PURE__*/React.createElement("div", {
    className: styles.newsMeta
  }, new Date(item.date).toLocaleDateString(), " \xB7 ", item.type, " \xB7 ", item.source)), /*#__PURE__*/React.createElement("div", {
    className: styles.actionBar
  }, item.orgIds.map(orgId => /*#__PURE__*/React.createElement("a", {
    key: `${item.id}-${orgId}`,
    className: styles.secondaryButton,
    href: getLink('company', orgId),
    onClick: e => {
      e.preventDefault();
      onNavigate('company', orgId);
    }
  }, "Open 360")), /*#__PURE__*/React.createElement("a", {
    className: styles.secondaryButton,
    href: item.link,
    target: "_blank",
    rel: "noreferrer"
  }, "Source")))), news.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: styles.subtleText
  }, "No recent news in this window."))), /*#__PURE__*/React.createElement(Card, {
    title: "What changed (last 30 days)"
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.chipRow
  }, recentEvents.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: styles.subtleText
  }, "No recent updates in mock data."), recentEvents.map(event => /*#__PURE__*/React.createElement("a", {
    key: `${event.label}-${event.date}`,
    className: styles.pill,
    href: getLink('company', event.companyId),
    onClick: evt => {
      evt.preventDefault();
      if (event.companyId) {
        onNavigate('company', event.companyId);
      }
    }
  }, /*#__PURE__*/React.createElement(event.icon, {
    size: 14,
    color: COLORS.brand
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600
    }
  }, event.company), /*#__PURE__*/React.createElement("span", null, event.label), /*#__PURE__*/React.createElement("span", {
    className: styles.subtleText
  }, new Date(event.date).toLocaleDateString()))))));
};
const FinderPage = ({
  companies,
  onNavigate,
  getLink,
  initialQuery,
  mode
}) => {
  const [query, setQuery] = React.useState(initialQuery || '');
  const [chips, setChips] = React.useState({
    approach: new Set(),
    stage: new Set(),
    pilot: false,
    under50: false
  });
  const [showFilters, setShowFilters] = React.useState(false);
  React.useEffect(() => {
    setQuery(initialQuery || '');
  }, [initialQuery]);
  const approaches = React.useMemo(() => Array.from(new Set(companies.map(company => company.approach))), [companies]);
  const stages = React.useMemo(() => Array.from(new Set(companies.map(company => company.stage))), [companies]);
  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return companies.filter(company => {
      const searchable = `${company.name} ${company.approach} ${company.country} ${company.description ?? ''}`.toLowerCase();
      const matchesQuery = q ? searchable.includes(q) : true;
      const matchesApproach = chips.approach.size ? chips.approach.has(company.approach) : true;
      const matchesStage = chips.stage.size ? chips.stage.has(company.stage) : true;
      const matchesPilot = chips.pilot ? company.projects.some(project => project.type.toLowerCase() === 'pilot' && project.status.toLowerCase() !== 'planned') : true;
      const matchesUnder50 = chips.under50 ? (company.totalFunding ?? 0) < 50_000_000 : true;
      return matchesQuery && matchesApproach && matchesStage && matchesPilot && matchesUnder50;
    });
  }, [companies, query, chips]);
  return /*#__PURE__*/React.createElement("div", {
    className: styles.main
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.cardList
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.cardListItem
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.cardListHeader
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.search
  }, /*#__PURE__*/React.createElement(Search, {
    size: 16,
    color: COLORS.slate
  }), /*#__PURE__*/React.createElement("input", {
    className: styles.searchInput,
    value: query,
    onChange: event => setQuery(event.target.value),
    placeholder: "Search company, approach, country, concept\u2026"
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: styles.secondaryButton,
    onClick: () => setShowFilters(!showFilters),
    "aria-expanded": showFilters
  }, /*#__PURE__*/React.createElement(Filter, {
    size: 14
  }), " Filters")), /*#__PURE__*/React.createElement("div", {
    className: styles.subtleText
  }, "Discovery chips"), /*#__PURE__*/React.createElement("div", {
    className: styles.chipRow
  }, approaches.map(approach => /*#__PURE__*/React.createElement(Chip, {
    key: approach,
    active: chips.approach.has(approach),
    onClick: () => {
      const next = new Set(chips.approach);
      next.has(approach) ? next.delete(approach) : next.add(approach);
      setChips({
        ...chips,
        approach: next
      });
    }
  }, approach)), /*#__PURE__*/React.createElement(Chip, {
    active: chips.pilot,
    onClick: () => setChips({
      ...chips,
      pilot: !chips.pilot
    })
  }, "Has active pilot"), /*#__PURE__*/React.createElement(Chip, {
    active: chips.under50,
    onClick: () => setChips({
      ...chips,
      under50: !chips.under50
    })
  }, "Funding < $50M")), showFilters && /*#__PURE__*/React.createElement("div", {
    className: styles.filterPanel
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.filterGroup
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.filterGroupTitle
  }, "Stage"), stages.map(stage => /*#__PURE__*/React.createElement("label", {
    key: stage,
    className: styles.filterOption
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: chips.stage.has(stage),
    onChange: () => {
      const next = new Set(chips.stage);
      next.has(stage) ? next.delete(stage) : next.add(stage);
      setChips({
        ...chips,
        stage: next
      });
    }
  }), stage))), /*#__PURE__*/React.createElement("div", {
    className: styles.filterGroup
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.filterGroupTitle
  }, "Quick filters"), /*#__PURE__*/React.createElement("label", {
    className: styles.filterOption
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: chips.pilot,
    onChange: () => setChips({
      ...chips,
      pilot: !chips.pilot
    })
  }), "Has active pilot"), /*#__PURE__*/React.createElement("label", {
    className: styles.filterOption
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: chips.under50,
    onChange: () => setChips({
      ...chips,
      under50: !chips.under50
    })
  }), "Funding < $50M")))), /*#__PURE__*/React.createElement("div", {
    className: styles.cardsGrid
  }, results.map(company => /*#__PURE__*/React.createElement("div", {
    key: company.id,
    className: styles.cardListItem
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.cardListHeader
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.companyHeading
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.companyLogoSmall
  }, company.logoUrl ? /*#__PURE__*/React.createElement("img", {
    src: company.logoUrl,
    alt: `${company.name} logo`
  }) : /*#__PURE__*/React.createElement("span", null, getInitials(company.name))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: styles.cardTitle
  }, company.name), /*#__PURE__*/React.createElement("div", {
    className: styles.subtleText
  }, company.approach, " \xB7 ", company.country))), /*#__PURE__*/React.createElement("div", {
    className: styles.cardActions
  }, /*#__PURE__*/React.createElement(Badge, {
    color: COLORS.brand
  }, company.stage), /*#__PURE__*/React.createElement(Badge, {
    color: COLORS.slate
  }, `Fresh ${company.freshnessDays}d`))), /*#__PURE__*/React.createElement("p", {
    className: `${styles.subtleText} ${styles.lineClamp3}`
  }, company.description), /*#__PURE__*/React.createElement("div", {
    className: styles.cardListFooter
  }, /*#__PURE__*/React.createElement("span", {
    className: styles.subtleText
  }, /*#__PURE__*/React.createElement(DollarSign, {
    size: 14,
    color: COLORS.slate
  }), " ", formatMoney(company.totalFunding), " total"), /*#__PURE__*/React.createElement("div", {
    className: styles.actionBar
  }, /*#__PURE__*/React.createElement("a", {
    className: styles.primaryButton,
    href: getLink('company', company.id),
    onClick: event => {
      event.preventDefault();
      onNavigate('company', company.id);
    }
  }, "Open 360 ", /*#__PURE__*/React.createElement(ArrowUpRight, {
    size: 14,
    style: {
      marginLeft: 4
    }
  })), /*#__PURE__*/React.createElement("a", {
    className: styles.secondaryButton,
    href: getLink('company', company.id),
    target: "_blank",
    rel: "noreferrer"
  }, "New tab"))))))));
};
const Company360Page = ({
  company,
  onNavigate,
  getLink,
  onOpenBrief,
  openCuratorPanel,
  mode
}) => {
  const [filters, setFilters] = React.useState({
    funding: true,
    project: true,
    interaction: true,
    publication: true,
    patent: true,
    news: true,
    claim: true
  });
  const timeline = React.useMemo(() => buildTimeline(company).filter(event => filters[event.type]), [company, filters]);
  const pilotCount = company.projects.filter(project => project.type.toLowerCase() === 'pilot').length;
  const operatingProjects = company.projects.filter(project => project.status.toLowerCase() === 'operating');
  const keyMetrics = [{
    label: 'Stage',
    value: company.stage
  }, {
    label: 'Total funding',
    value: formatMoney(company.totalFunding)
  }, {
    label: 'Active pilots',
    value: pilotCount
  }, {
    label: 'Freshness',
    value: `${company.freshnessDays} days`
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: styles.main
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.cardListItem
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.cardListHeader
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.companyHeading
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.companyLogo
  }, company.logoUrl ? /*#__PURE__*/React.createElement("img", {
    src: company.logoUrl,
    alt: `${company.name} logo`
  }) : /*#__PURE__*/React.createElement("span", null, getInitials(company.name))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: styles.cardTitle,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, company.name, /*#__PURE__*/React.createElement("a", {
    href: company.website,
    target: "_blank",
    rel: "noreferrer",
    className: styles.subtleText
  }, /*#__PURE__*/React.createElement(ExternalLink, {
    size: 12
  }), " website")), /*#__PURE__*/React.createElement("div", {
    className: styles.subtleText
  }, company.approach, " \xB7 ", company.country, " \xB7 Founded ", company.founded))), /*#__PURE__*/React.createElement("div", {
    className: styles.cardActions
  }, /*#__PURE__*/React.createElement(Badge, {
    color: COLORS.brand
  }, company.stage), /*#__PURE__*/React.createElement(Badge, {
    color: COLORS.slate
  }, "Fresh ", company.freshnessDays, "d"), /*#__PURE__*/React.createElement(Badge, {
    color: COLORS.green
  }, formatMoney(company.totalFunding), " raised"))), /*#__PURE__*/React.createElement("p", {
    className: `${styles.subtleText}`,
    style: {
      marginTop: 12
    }
  }, company.description), /*#__PURE__*/React.createElement("div", {
    className: styles.actionBar,
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: styles.primaryButton,
    onClick: () => onOpenBrief(company, false)
  }, "View brief"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: styles.secondaryButton,
    onClick: () => onNavigate('map', company.id)
  }, "Locate on map"), /*#__PURE__*/React.createElement("a", {
    className: styles.secondaryButton,
    href: getLink('brief', company.id),
    target: "_blank",
    rel: "noreferrer"
  }, "Brief in new tab"))), /*#__PURE__*/React.createElement("div", {
    className: styles.gridTwo
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Key metrics"
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.metricList
  }, keyMetrics.map(metric => /*#__PURE__*/React.createElement("div", {
    key: metric.label,
    className: styles.metricRow
  }, /*#__PURE__*/React.createElement("span", {
    className: styles.metricLabel
  }, metric.label), /*#__PURE__*/React.createElement("span", {
    className: styles.metricValue
  }, metric.value))))), /*#__PURE__*/React.createElement(Card, {
    title: "Projects & pilots",
    actions: mode === 'curator' ? /*#__PURE__*/React.createElement("button", {
      className: styles.secondaryButton,
      type: "button",
      onClick: () => openCuratorPanel({
        type: 'project',
        orgId: company.id
      })
    }, "Add project") : undefined
  }, /*#__PURE__*/React.createElement("ul", {
    className: styles.listSimple
  }, company.projects.map(project => /*#__PURE__*/React.createElement("li", {
    key: `${project.name}-${project.startDate}`
  }, /*#__PURE__*/React.createElement("strong", null, project.name), " \u2014 ", project.type, " in ", project.location, " (", project.status, ")")), company.projects.length === 0 && /*#__PURE__*/React.createElement("li", null, "No projects captured yet.")), operatingProjects.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: styles.subtleText,
    style: {
      marginTop: 8
    }
  }, operatingProjects.length, " project(s) operating \u2022 ", pilotCount, " pilot(s)"))), /*#__PURE__*/React.createElement(Card, {
    title: "Overview imagery",
    actions: mode === 'curator' ? /*#__PURE__*/React.createElement("button", {
      className: styles.secondaryButton,
      type: "button",
      onClick: () => openCuratorPanel({
        type: 'image',
        orgId: company.id
      })
    }, "Add image") : undefined
  }, company.overviewImages?.length ? /*#__PURE__*/React.createElement("div", {
    className: styles.imageGrid
  }, company.overviewImages.map((media, index) => /*#__PURE__*/React.createElement("figure", {
    key: `${company.id}-image-${index}`,
    className: styles.imageCard
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.imageFrame
  }, /*#__PURE__*/React.createElement("img", {
    src: media.src,
    alt: media.caption ?? `${company.name} overview ${index + 1}`
  })), media.caption && /*#__PURE__*/React.createElement("figcaption", {
    className: styles.imageCaption
  }, media.caption)))) : /*#__PURE__*/React.createElement("div", {
    className: styles.subtleText
  }, "No imagery captured yet.")), /*#__PURE__*/React.createElement("div", {
    className: styles.gridTwo
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Collaborations & partners",
    actions: mode === 'curator' ? /*#__PURE__*/React.createElement("button", {
      className: styles.secondaryButton,
      type: "button",
      onClick: () => openCuratorPanel({
        type: 'collab',
        orgId: company.id
      })
    }, "Add collaboration") : undefined
  }, /*#__PURE__*/React.createElement("ul", {
    className: styles.listSimple
  }, company.collaborations.map(collaboration => /*#__PURE__*/React.createElement("li", {
    key: `${collaboration.with}-${collaboration.startDate}`
  }, /*#__PURE__*/React.createElement("strong", null, collaboration.with), " \xB7 ", collaboration.kind, " \xB7 since ", new Date(collaboration.startDate).getFullYear())), company.collaborations.length === 0 && /*#__PURE__*/React.createElement("li", null, "No collaborations captured."))), /*#__PURE__*/React.createElement(Card, {
    title: "Interactions & notes",
    actions: mode === 'curator' ? /*#__PURE__*/React.createElement("button", {
      className: styles.secondaryButton,
      type: "button",
      onClick: () => openCuratorPanel({
        type: 'interaction',
        orgId: company.id
      })
    }, "Add interaction") : undefined
  }, /*#__PURE__*/React.createElement("ul", {
    className: styles.listSimple
  }, company.interactions.map(interaction => /*#__PURE__*/React.createElement("li", {
    key: `${interaction.date}-${interaction.type}`
  }, new Date(interaction.date).toLocaleDateString(), " \xB7 ", capitalize(interaction.type), " \xB7 ", interaction.summary)), company.interactions.length === 0 && /*#__PURE__*/React.createElement("li", null, "No interactions recorded yet.")))), /*#__PURE__*/React.createElement(Card, {
    title: "Claims & risk signals",
    actions: /*#__PURE__*/React.createElement("div", {
      className: styles.actionBar
    }, /*#__PURE__*/React.createElement("span", {
      className: styles.subtleText
    }, "RAG + confidence"), mode === 'curator' && /*#__PURE__*/React.createElement("button", {
      className: styles.secondaryButton,
      type: "button",
      onClick: () => openCuratorPanel({
        type: 'claim',
        orgId: company.id
      })
    }, "Add claim"))
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.cardList
  }, company.claims.map(claim => /*#__PURE__*/React.createElement("div", {
    key: claim.id,
    className: styles.cardListItem
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.cardListHeader
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.cardTitle,
    style: {
      fontSize: 14
    }
  }, claim.text), /*#__PURE__*/React.createElement(Badge, {
    color: ragColor(claim.trust)
  }, claim.trust)), /*#__PURE__*/React.createElement("div", {
    className: styles.subtleText
  }, claim.metricType, " \xB7 ", claim.min, "\u2013", claim.max, " ", claim.unit, " (ML ", claim.ml, ")"), /*#__PURE__*/React.createElement("div", {
    className: styles.subtleText,
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 8,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(ShieldCheck, {
    size: 14,
    color: COLORS.slate
  }), "Trust ", claim.trustScore, "/100", claim.evidence.length > 0 && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\xB7"), claim.evidence.map((evidence, index) => /*#__PURE__*/React.createElement("a", {
    key: `${claim.id}-evidence-${index}`,
    href: evidence.url,
    className: styles.secondaryButton,
    target: "_blank",
    rel: "noreferrer"
  }, /*#__PURE__*/React.createElement(ExternalLink, {
    size: 12
  }), " ", capitalize(evidence.type)))), mode === 'curator' && /*#__PURE__*/React.createElement("button", {
    className: styles.secondaryButton,
    type: "button",
    onClick: () => openCuratorPanel({
      type: 'evidence',
      orgId: company.id,
      claimId: claim.id
    })
  }, "Add evidence"))), company.claims.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: styles.subtleText
  }, "No claims captured for this organization yet."))), /*#__PURE__*/React.createElement("div", {
    className: styles.gridTwo
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Evidence library"
  }, /*#__PURE__*/React.createElement("ul", {
    className: styles.listSimple
  }, company.publications.map(publication => /*#__PURE__*/React.createElement("li", {
    key: publication.title
  }, /*#__PURE__*/React.createElement("a", {
    href: publication.link,
    target: "_blank",
    rel: "noreferrer"
  }, /*#__PURE__*/React.createElement(BookOpen, {
    size: 12,
    style: {
      marginRight: 6
    }
  }), publication.title, " (", new Date(publication.date).toLocaleDateString(), ")"))), company.patents.map(patent => /*#__PURE__*/React.createElement("li", {
    key: patent.title
  }, /*#__PURE__*/React.createElement("a", {
    href: patent.link,
    target: "_blank",
    rel: "noreferrer"
  }, /*#__PURE__*/React.createElement(ClipboardList, {
    size: 12,
    style: {
      marginRight: 6
    }
  }), patent.title, " (", new Date(patent.date).toLocaleDateString(), ")"))), company.news.map(news => /*#__PURE__*/React.createElement("li", {
    key: news.title
  }, /*#__PURE__*/React.createElement("a", {
    href: news.link,
    target: "_blank",
    rel: "noreferrer"
  }, /*#__PURE__*/React.createElement(Newspaper, {
    size: 12,
    style: {
      marginRight: 6
    }
  }), news.title, " (", new Date(news.date).toLocaleDateString(), ")"))), company.publications.length + company.patents.length + company.news.length === 0 && /*#__PURE__*/React.createElement("li", null, "No supporting documents captured."))), /*#__PURE__*/React.createElement(Card, {
    title: "Timeline recap",
    actions: /*#__PURE__*/React.createElement("div", {
      className: styles.chipRow
    }, Object.keys(filters).map(key => /*#__PURE__*/React.createElement(Chip, {
      key: key,
      active: filters[key],
      onClick: () => setFilters({
        ...filters,
        [key]: !filters[key]
      })
    }, capitalize(key))))
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.timeline
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.timelineRail
  }), /*#__PURE__*/React.createElement("div", {
    className: styles.cardList
  }, timeline.map((event, index) => /*#__PURE__*/React.createElement("div", {
    key: `${event.label}-${index}`,
    className: styles.timelineItem
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.timelineIcon
  }, /*#__PURE__*/React.createElement(event.icon, {
    size: 14
  })), /*#__PURE__*/React.createElement("div", {
    className: styles.timelineCard
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.timelineMeta
  }, new Date(event.date).toLocaleDateString(), " \xB7 ", capitalize(event.type)), /*#__PURE__*/React.createElement("div", {
    className: styles.timelineLabel
  }, event.label)))), timeline.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: styles.subtleText,
    style: {
      marginLeft: 12
    }
  }, "No recent activity logged."))))));
};

// Curator forms
const Field = ({
  label,
  children
}) => /*#__PURE__*/React.createElement("label", {
  className: styles.filterOption
}, /*#__PURE__*/React.createElement("span", {
  style: {
    minWidth: 110
  }
}, label), children);
const CuratorProjectForm = ({
  onSubmit,
  onCancel,
  submitting
}) => {
  const initial = {
    name: '',
    type: 'Pilot',
    location: '',
    status: 'Planned',
    startDate: new Date().toISOString().slice(0, 10),
    capacity: '',
    partners: ''
  };
  const [p, setP] = React.useState(initial);
  return /*#__PURE__*/React.createElement("form", {
    onSubmit: async e => {
      e.preventDefault();
      try {
        await onSubmit({
          ...p,
          capacity: p.capacity ? Number(p.capacity) : undefined,
          partners: p.partners ? p.partners.split(',').map(s => s.trim()).filter(Boolean) : []
        });
        setP(initial);
      } catch {
        // parent handles error state
      }
    },
    className: styles.filterGroup
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Name"
  }, /*#__PURE__*/React.createElement("input", {
    required: true,
    value: p.name,
    onChange: e => setP({
      ...p,
      name: e.target.value
    })
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Type"
  }, /*#__PURE__*/React.createElement("input", {
    value: p.type,
    onChange: e => setP({
      ...p,
      type: e.target.value
    })
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Location"
  }, /*#__PURE__*/React.createElement("input", {
    value: p.location,
    onChange: e => setP({
      ...p,
      location: e.target.value
    })
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Status"
  }, /*#__PURE__*/React.createElement("input", {
    value: p.status,
    onChange: e => setP({
      ...p,
      status: e.target.value
    })
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Start date"
  }, /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: p.startDate,
    onChange: e => setP({
      ...p,
      startDate: e.target.value
    })
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Capacity"
  }, /*#__PURE__*/React.createElement("input", {
    value: p.capacity,
    onChange: e => setP({
      ...p,
      capacity: e.target.value
    }),
    placeholder: "tCO2/yr"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Partners"
  }, /*#__PURE__*/React.createElement("input", {
    value: p.partners,
    onChange: e => setP({
      ...p,
      partners: e.target.value
    }),
    placeholder: "Comma-separated"
  })), /*#__PURE__*/React.createElement("div", {
    className: styles.actionBar
  }, /*#__PURE__*/React.createElement("button", {
    className: styles.primaryButton,
    type: "submit",
    disabled: submitting
  }, "Add project"), /*#__PURE__*/React.createElement("button", {
    className: styles.secondaryButton,
    type: "button",
    onClick: () => {
      setP(initial);
      onCancel();
    }
  }, "Cancel")));
};
const CuratorCollabForm = ({
  onSubmit,
  onCancel,
  submitting
}) => {
  const initial = {
    with: '',
    kind: 'Partner',
    startDate: new Date().toISOString().slice(0, 10)
  };
  const [c, setC] = React.useState(initial);
  return /*#__PURE__*/React.createElement("form", {
    onSubmit: async e => {
      e.preventDefault();
      try {
        await onSubmit(c);
        setC(initial);
      } catch {
        // parent handles error state
      }
    },
    className: styles.filterGroup
  }, /*#__PURE__*/React.createElement(Field, {
    label: "With"
  }, /*#__PURE__*/React.createElement("input", {
    required: true,
    value: c.with,
    onChange: e => setC({
      ...c,
      with: e.target.value
    })
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Kind"
  }, /*#__PURE__*/React.createElement("input", {
    value: c.kind,
    onChange: e => setC({
      ...c,
      kind: e.target.value
    })
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Since"
  }, /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: c.startDate,
    onChange: e => setC({
      ...c,
      startDate: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: styles.actionBar
  }, /*#__PURE__*/React.createElement("button", {
    className: styles.primaryButton,
    type: "submit",
    disabled: submitting
  }, "Add collaboration"), /*#__PURE__*/React.createElement("button", {
    className: styles.secondaryButton,
    type: "button",
    onClick: () => {
      setC(initial);
      onCancel();
    }
  }, "Cancel")));
};
const CuratorInteractionForm = ({
  onSubmit,
  onCancel,
  submitting
}) => {
  const initial = {
    date: new Date().toISOString().slice(0, 10),
    type: 'Meeting',
    attendees: '',
    summary: ''
  };
  const [i, setI] = React.useState(initial);
  return /*#__PURE__*/React.createElement("form", {
    onSubmit: async e => {
      e.preventDefault();
      try {
        await onSubmit({
          ...i,
          attendees: (i.attendees || '').split(',').map(s => s.trim()).filter(Boolean)
        });
        setI(initial);
      } catch {
        // parent handles error state
      }
    },
    className: styles.filterGroup
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Date"
  }, /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: i.date,
    onChange: e => setI({
      ...i,
      date: e.target.value
    })
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Type"
  }, /*#__PURE__*/React.createElement("input", {
    value: i.type,
    onChange: e => setI({
      ...i,
      type: e.target.value
    })
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Attendees"
  }, /*#__PURE__*/React.createElement("input", {
    value: i.attendees,
    onChange: e => setI({
      ...i,
      attendees: e.target.value
    }),
    placeholder: "Comma-separated"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Summary"
  }, /*#__PURE__*/React.createElement("input", {
    value: i.summary,
    onChange: e => setI({
      ...i,
      summary: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: styles.actionBar
  }, /*#__PURE__*/React.createElement("button", {
    className: styles.primaryButton,
    type: "submit",
    disabled: submitting
  }, "Add interaction"), /*#__PURE__*/React.createElement("button", {
    className: styles.secondaryButton,
    type: "button",
    onClick: () => {
      setI(initial);
      onCancel();
    }
  }, "Cancel")));
};
const CuratorClaimForm = ({
  onSubmit,
  onCancel,
  submitting
}) => {
  const initial = {
    text: '',
    metricType: '',
    unit: '',
    trust: 'Amber',
    trustScore: 60,
    min: '',
    ml: '',
    max: ''
  };
  const [c, setC] = React.useState(initial);
  return /*#__PURE__*/React.createElement("form", {
    onSubmit: async e => {
      e.preventDefault();
      try {
        await onSubmit({
          ...c,
          min: c.min ? Number(c.min) : undefined,
          ml: c.ml ? Number(c.ml) : undefined,
          max: c.max ? Number(c.max) : undefined
        });
        setC(initial);
      } catch {
        // parent handles error state
      }
    },
    className: styles.filterGroup
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Text"
  }, /*#__PURE__*/React.createElement("input", {
    required: true,
    value: c.text,
    onChange: e => setC({
      ...c,
      text: e.target.value
    })
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Metric"
  }, /*#__PURE__*/React.createElement("input", {
    value: c.metricType,
    onChange: e => setC({
      ...c,
      metricType: e.target.value
    })
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Unit"
  }, /*#__PURE__*/React.createElement("input", {
    value: c.unit,
    onChange: e => setC({
      ...c,
      unit: e.target.value
    })
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Min"
  }, /*#__PURE__*/React.createElement("input", {
    value: c.min,
    onChange: e => setC({
      ...c,
      min: e.target.value
    })
  })), /*#__PURE__*/React.createElement(Field, {
    label: "ML"
  }, /*#__PURE__*/React.createElement("input", {
    value: c.ml,
    onChange: e => setC({
      ...c,
      ml: e.target.value
    })
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Max"
  }, /*#__PURE__*/React.createElement("input", {
    value: c.max,
    onChange: e => setC({
      ...c,
      max: e.target.value
    })
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Trust"
  }, /*#__PURE__*/React.createElement("input", {
    value: c.trust,
    onChange: e => setC({
      ...c,
      trust: e.target.value
    })
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Score"
  }, /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: 0,
    max: 100,
    value: c.trustScore,
    onChange: e => setC({
      ...c,
      trustScore: Number(e.target.value)
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: styles.actionBar
  }, /*#__PURE__*/React.createElement("button", {
    className: styles.primaryButton,
    type: "submit",
    disabled: submitting
  }, "Add claim"), /*#__PURE__*/React.createElement("button", {
    className: styles.secondaryButton,
    type: "button",
    onClick: () => {
      setC(initial);
      onCancel();
    }
  }, "Cancel")));
};
const CuratorEvidenceForm = ({
  onSubmit,
  onCancel,
  submitting
}) => {
  const initial = {
    type: 'Publication',
    title: '',
    url: '',
    date: new Date().toISOString().slice(0, 10)
  };
  const [evi, setEvi] = React.useState(initial);
  return /*#__PURE__*/React.createElement("form", {
    onSubmit: async e => {
      e.preventDefault();
      try {
        await onSubmit(evi);
        setEvi(initial);
      } catch {
        // parent handles error state
      }
    },
    className: styles.filterGroup
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Type"
  }, /*#__PURE__*/React.createElement("input", {
    value: evi.type,
    onChange: e => setEvi({
      ...evi,
      type: e.target.value
    })
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Title"
  }, /*#__PURE__*/React.createElement("input", {
    required: true,
    value: evi.title,
    onChange: e => setEvi({
      ...evi,
      title: e.target.value
    })
  })), /*#__PURE__*/React.createElement(Field, {
    label: "URL"
  }, /*#__PURE__*/React.createElement("input", {
    required: true,
    value: evi.url,
    onChange: e => setEvi({
      ...evi,
      url: e.target.value
    })
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Date"
  }, /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: evi.date,
    onChange: e => setEvi({
      ...evi,
      date: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: styles.actionBar
  }, /*#__PURE__*/React.createElement("button", {
    className: styles.primaryButton,
    type: "submit",
    disabled: submitting
  }, "Add evidence"), /*#__PURE__*/React.createElement("button", {
    className: styles.secondaryButton,
    type: "button",
    onClick: () => {
      setEvi(initial);
      onCancel();
    }
  }, "Cancel")));
};
const CuratorImageForm = ({
  onSubmit,
  onCancel,
  submitting
}) => {
  const initial = {
    src: '',
    caption: ''
  };
  const [img, setImg] = React.useState(initial);
  return /*#__PURE__*/React.createElement("form", {
    onSubmit: async e => {
      e.preventDefault();
      if (!img.src.trim()) {
        return;
      }
      try {
        await onSubmit({
          src: img.src.trim(),
          caption: img.caption?.trim() || undefined
        });
        setImg(initial);
      } catch {
        // parent handles error state
      }
    },
    className: styles.filterGroup
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Image URL"
  }, /*#__PURE__*/React.createElement("input", {
    required: true,
    value: img.src,
    onChange: e => setImg({
      ...img,
      src: e.target.value
    }),
    placeholder: "https://..."
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Caption"
  }, /*#__PURE__*/React.createElement("input", {
    value: img.caption,
    onChange: e => setImg({
      ...img,
      caption: e.target.value
    }),
    placeholder: "Optional"
  })), /*#__PURE__*/React.createElement("div", {
    className: styles.actionBar
  }, /*#__PURE__*/React.createElement("button", {
    className: styles.primaryButton,
    type: "submit",
    disabled: submitting
  }, "Add image"), /*#__PURE__*/React.createElement("button", {
    className: styles.secondaryButton,
    type: "button",
    onClick: () => {
      setImg(initial);
      onCancel();
    }
  }, "Cancel")));
};
const CuratorOrgForm = ({
  onSubmit,
  onCancel,
  error
}) => {
  const initial = {
    name: '',
    slug: '',
    approach: '',
    stage: '',
    country: '',
    founded: new Date().getFullYear().toString(),
    description: ''
  };
  const [org, setOrg] = React.useState(initial);
  const handleNameChange = value => {
    setOrg(prev => ({
      ...prev,
      name: value,
      slug: prev.slug ? prev.slug : slugify(value)
    }));
  };
  return /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      if (!org.name) {
        return;
      }
      onSubmit({
        name: org.name,
        slug: org.slug || slugify(org.name),
        approach: org.approach,
        stage: org.stage,
        country: org.country,
        founded: org.founded ? Number(org.founded) : undefined,
        description: org.description
      });
      setOrg(initial);
    },
    className: styles.filterGroup
  }, error && /*#__PURE__*/React.createElement("div", {
    className: styles.subtleText,
    style: {
      color: COLORS.red
    }
  }, error), /*#__PURE__*/React.createElement(Field, {
    label: "Name"
  }, /*#__PURE__*/React.createElement("input", {
    required: true,
    value: org.name,
    onChange: e => handleNameChange(e.target.value)
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Slug"
  }, /*#__PURE__*/React.createElement("input", {
    value: org.slug,
    onChange: e => setOrg({
      ...org,
      slug: e.target.value
    }),
    placeholder: "example-startup"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Approach"
  }, /*#__PURE__*/React.createElement("input", {
    value: org.approach,
    onChange: e => setOrg({
      ...org,
      approach: e.target.value
    })
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Stage"
  }, /*#__PURE__*/React.createElement("input", {
    value: org.stage,
    onChange: e => setOrg({
      ...org,
      stage: e.target.value
    })
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Country"
  }, /*#__PURE__*/React.createElement("input", {
    value: org.country,
    onChange: e => setOrg({
      ...org,
      country: e.target.value
    })
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Founded"
  }, /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: org.founded,
    onChange: e => setOrg({
      ...org,
      founded: e.target.value
    })
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Description"
  }, /*#__PURE__*/React.createElement("input", {
    value: org.description,
    onChange: e => setOrg({
      ...org,
      description: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: styles.actionBar
  }, /*#__PURE__*/React.createElement("button", {
    className: styles.primaryButton,
    type: "submit"
  }, "Create startup"), /*#__PURE__*/React.createElement("button", {
    className: styles.secondaryButton,
    type: "button",
    onClick: () => {
      setOrg(initial);
      onCancel();
    }
  }, "Cancel")));
};
const FundingDealsPage = ({
  companies
}) => {
  const timelineData = React.useMemo(() => companies.flatMap(company => company.fundingRounds.map(round => ({
    company: company.name,
    date: round.date,
    amount: round.amount / 1_000_000
  }))).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()), [companies]);
  const totals = React.useMemo(() => companies.map(company => ({
    name: company.name,
    total: (company.totalFunding ?? 0) / 1_000_000
  })), [companies]);
  return /*#__PURE__*/React.createElement("div", {
    className: styles.gridTwo
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Funding timeline"
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.chartArea
  }, /*#__PURE__*/React.createElement(ResponsiveContainer, {
    width: "100%",
    height: "100%"
  }, /*#__PURE__*/React.createElement(AreaChart, {
    data: timelineData
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "fundingGradient",
    x1: "0",
    x2: "0",
    y1: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: COLORS.brand,
    stopOpacity: 0.35
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: COLORS.brand,
    stopOpacity: 0.05
  }))), /*#__PURE__*/React.createElement(CartesianGrid, {
    strokeDasharray: "3 3"
  }), /*#__PURE__*/React.createElement(XAxis, {
    dataKey: "date"
  }), /*#__PURE__*/React.createElement(YAxis, {
    unit: "M"
  }), /*#__PURE__*/React.createElement(Tooltip, {
    formatter: value => `${value}M`
  }), /*#__PURE__*/React.createElement(Area, {
    dataKey: "amount",
    stroke: COLORS.brand,
    fill: "url(#fundingGradient)",
    name: "Round size (USD M)"
  }))))), /*#__PURE__*/React.createElement(Card, {
    title: "Top funding (total)"
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.chartArea
  }, /*#__PURE__*/React.createElement(ResponsiveContainer, {
    width: "100%",
    height: "100%"
  }, /*#__PURE__*/React.createElement(BarChart, {
    data: totals
  }, /*#__PURE__*/React.createElement(CartesianGrid, {
    strokeDasharray: "3 3"
  }), /*#__PURE__*/React.createElement(XAxis, {
    dataKey: "name"
  }), /*#__PURE__*/React.createElement(YAxis, {
    unit: "M"
  }), /*#__PURE__*/React.createElement(Tooltip, {
    formatter: value => `${value}M`
  }), /*#__PURE__*/React.createElement(Bar, {
    dataKey: "total",
    name: "Total (USD M)",
    fill: COLORS.brand,
    radius: [6, 6, 0, 0]
  }))))));
};
const PublicationsPatentsPage = ({
  companies
}) => {
  const rows = React.useMemo(() => companies.flatMap(company => [...company.publications.map(item => ({
    company: company.name,
    type: 'Publication',
    title: item.title,
    date: item.date,
    link: item.link
  })), ...company.patents.map(item => ({
    company: company.name,
    type: 'Patent',
    title: item.title,
    date: item.date,
    link: item.link
  }))]).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [companies]);
  return /*#__PURE__*/React.createElement(Card, {
    title: "Publications & patents (recent)"
  }, /*#__PURE__*/React.createElement("table", {
    className: styles.table
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Date"), /*#__PURE__*/React.createElement("th", null, "Company"), /*#__PURE__*/React.createElement("th", null, "Type"), /*#__PURE__*/React.createElement("th", null, "Title"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, rows.map(row => /*#__PURE__*/React.createElement("tr", {
    key: `${row.company}-${row.title}`,
    className: styles.tableRow
  }, /*#__PURE__*/React.createElement("td", {
    className: styles.tableCell
  }, new Date(row.date).toLocaleDateString()), /*#__PURE__*/React.createElement("td", {
    className: styles.tableCell,
    style: {
      fontWeight: 500
    }
  }, row.company), /*#__PURE__*/React.createElement("td", {
    className: styles.tableCell
  }, /*#__PURE__*/React.createElement(Badge, {
    color: row.type === 'Patent' ? COLORS.slate : COLORS.brand
  }, row.type)), /*#__PURE__*/React.createElement("td", {
    className: styles.tableCell
  }, row.title), /*#__PURE__*/React.createElement("td", {
    className: styles.tableCell
  }, /*#__PURE__*/React.createElement("a", {
    href: row.link,
    className: styles.secondaryButton,
    target: "_blank",
    rel: "noreferrer"
  }, /*#__PURE__*/React.createElement(ExternalLink, {
    size: 12
  }))))))));
};
const StalenessPage = ({
  companies
}) => {
  const entities = React.useMemo(() => {
    const items = companies.flatMap(company => [{
      kind: 'Org',
      name: company.name,
      fresh: company.freshnessDays,
      evidenceTypes: countEvidenceTypes(company)
    }, ...company.projects.map(project => ({
      kind: 'Project',
      name: `${company.name} – ${project.name}`,
      fresh: daysSince(project.startDate),
      evidenceTypes: ['news']
    }))]);
    return items;
  }, [companies]);
  const needsAttention = React.useMemo(() => {
    const scored = entities.map(entity => ({
      ...entity,
      score: (entity.fresh > 60 ? 2 : entity.fresh > 30 ? 1 : 0) + (entity.evidenceTypes.length < 2 ? 1 : 0)
    })).sort((a, b) => b.score - a.score).slice(0, 10);
    return scored;
  }, [entities]);
  return /*#__PURE__*/React.createElement("div", {
    className: styles.gridTwo
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Freshness \xD7 coverage heatmap (mock)"
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.cardList
  }, entities.map(entity => /*#__PURE__*/React.createElement("div", {
    key: entity.name,
    className: styles.cardListItem
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.cardTitle,
    style: {
      fontSize: 13
    }
  }, entity.name), /*#__PURE__*/React.createElement("div", {
    className: styles.subtleText
  }, "Fresh ", entity.fresh, "d \xB7 Evidence types ", entity.evidenceTypes.length))))), /*#__PURE__*/React.createElement(Card, {
    title: "Needs attention (top)"
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.cardList
  }, needsAttention.map(entity => /*#__PURE__*/React.createElement("div", {
    key: entity.name,
    className: styles.needsItem
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: styles.cardTitle,
    style: {
      fontSize: 14
    }
  }, entity.name), /*#__PURE__*/React.createElement("div", {
    className: styles.needsMeta
  }, entity.kind, " \xB7 Fresh ", entity.fresh, "d \xB7 Evidence ", entity.evidenceTypes.length, " types")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: styles.primaryButton
  }, "Assign"))))));
};
const MapPage = ({
  companies,
  onNavigate,
  getLink
}) => {
  const [layer, setLayer] = React.useState('orgs');
  const legend = {
    orgs: {
      label: 'Headquarters',
      color: COLORS.brand
    },
    projects: {
      label: 'Projects',
      color: COLORS.green
    },
    pilots: {
      label: 'Pilots',
      color: COLORS.amber
    }
  };
  const items = React.useMemo(() => {
    switch (layer) {
      case 'projects':
        return companies.flatMap(company => company.projects.map(project => ({
          id: `${company.id}-${project.name}`,
          title: project.name,
          subtitle: `${project.type} · ${project.location}`,
          companyId: company.id
        })));
      case 'pilots':
        return companies.flatMap(company => company.projects.filter(project => project.type.toLowerCase().includes('pilot')).map(project => ({
          id: `${company.id}-${project.name}`,
          title: project.name,
          subtitle: `${company.name} · ${project.location} (${project.status})`,
          companyId: company.id
        })));
      default:
        return companies.map(company => ({
          id: company.id,
          title: company.name,
          subtitle: `${company.approach} · ${company.country}`,
          companyId: company.id
        }));
    }
  }, [companies, layer]);
  const layerLabel = legend[layer].label.toLowerCase();
  return /*#__PURE__*/React.createElement("div", {
    className: styles.mapContainer
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.mapToolbar
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.chipRow
  }, /*#__PURE__*/React.createElement(Chip, {
    active: layer === 'orgs',
    onClick: () => setLayer('orgs')
  }, "Organizations"), /*#__PURE__*/React.createElement(Chip, {
    active: layer === 'projects',
    onClick: () => setLayer('projects')
  }, "Projects"), /*#__PURE__*/React.createElement(Chip, {
    active: layer === 'pilots',
    onClick: () => setLayer('pilots')
  }, "Pilots")), /*#__PURE__*/React.createElement("div", {
    className: styles.mapLegend
  }, Object.values(legend).map(item => /*#__PURE__*/React.createElement("span", {
    key: item.label,
    className: styles.mapLegendItem
  }, /*#__PURE__*/React.createElement("span", {
    className: styles.mapLegendSwatch,
    style: {
      background: item.color
    }
  }), item.label)))), /*#__PURE__*/React.createElement("div", {
    className: styles.mapPlaceholder
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Interactive map coming soon"), /*#__PURE__*/React.createElement("div", {
    className: styles.subtleText,
    style: {
      marginTop: 8
    }
  }, "Displaying ", layerLabel, ". Map tiles will render once SharePoint list data is wired in."))), /*#__PURE__*/React.createElement(Card, {
    title: "Highlights"
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.cardList
  }, items.slice(0, 8).map(item => /*#__PURE__*/React.createElement("div", {
    key: item.id,
    className: styles.cardListItem
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.cardListHeader
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: styles.cardTitle,
    style: {
      fontSize: 14
    }
  }, item.title), /*#__PURE__*/React.createElement("div", {
    className: styles.subtleText
  }, item.subtitle)), /*#__PURE__*/React.createElement(MapPin, {
    size: 16,
    color: legend[layer].color
  })), /*#__PURE__*/React.createElement("div", {
    className: styles.cardListFooter
  }, /*#__PURE__*/React.createElement("a", {
    className: styles.secondaryButton,
    href: getLink('company', item.companyId),
    onClick: event => {
      event.preventDefault();
      onNavigate('company', item.companyId);
    }
  }, "Open 360"), /*#__PURE__*/React.createElement("a", {
    className: styles.secondaryButton,
    href: getLink('company', item.companyId),
    target: "_blank",
    rel: "noreferrer"
  }, "New tab")))), items.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: styles.subtleText
  }, "No records available for the selected layer."))));
};
const CompanyBrief = ({
  company,
  onBack,
  getLink
}) => {
  const timeline = React.useMemo(() => buildTimeline(company).slice(-6).reverse(), [company]);
  const evidenceRows = React.useMemo(() => [...company.publications.map(item => ({
    ...item,
    type: 'Publication'
  })), ...company.patents.map(item => ({
    ...item,
    type: 'Patent'
  })), ...company.news.map(item => ({
    ...item,
    type: 'News'
  }))], [company]);
  const pilotCount = React.useMemo(() => company.projects.filter(project => project.type.toLowerCase() === 'pilot').length, [company.projects]);
  const initials = React.useMemo(() => getInitials(company.name), [company.name]);
  return /*#__PURE__*/React.createElement("div", {
    className: styles.briefPage
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.briefActions
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: styles.secondaryButton,
    onClick: onBack
  }, /*#__PURE__*/React.createElement(ArrowLeft, {
    size: 16
  }), " Back to dashboard"), /*#__PURE__*/React.createElement("div", {
    className: styles.actionBar
  }, /*#__PURE__*/React.createElement("a", {
    href: company.website,
    target: "_blank",
    rel: "noreferrer",
    className: styles.secondaryButton
  }, /*#__PURE__*/React.createElement(ExternalLink, {
    size: 14
  }), " Company site"), /*#__PURE__*/React.createElement("a", {
    href: getLink('company', company.id),
    className: styles.secondaryButton
  }, /*#__PURE__*/React.createElement(ArrowUpRight, {
    size: 14
  }), " Open 360 view"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: styles.primaryButton,
    onClick: () => window.print()
  }, /*#__PURE__*/React.createElement(Printer, {
    size: 16
  }), " Print / save PDF"))), /*#__PURE__*/React.createElement("div", {
    className: styles.briefContent
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.briefHeader
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.briefLogo
  }, company.logoUrl ? /*#__PURE__*/React.createElement("img", {
    src: company.logoUrl,
    alt: `${company.name} logo`,
    style: {
      width: '100%',
      height: '100%',
      borderRadius: 16,
      objectFit: 'contain'
    }
  }) : initials), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: styles.briefTitle
  }, company.name), /*#__PURE__*/React.createElement("div", {
    className: styles.briefSubtle
  }, company.approach, " \xB7 ", company.country, " \xB7 Founded ", company.founded))), /*#__PURE__*/React.createElement("div", {
    className: styles.briefBlock
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.briefSectionTitle
  }, "Updated"), /*#__PURE__*/React.createElement("div", null, new Date().toLocaleDateString()), /*#__PURE__*/React.createElement("div", {
    className: styles.briefSubtle
  }, "Freshness ", company.freshnessDays, " days"))), /*#__PURE__*/React.createElement("section", {
    className: styles.briefSection
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.briefSectionTitle
  }, "Executive summary"), /*#__PURE__*/React.createElement("p", null, company.description)), /*#__PURE__*/React.createElement("section", {
    className: styles.briefSection
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.briefSectionTitle
  }, "Key metrics"), /*#__PURE__*/React.createElement("div", {
    className: styles.briefGrid
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.briefBlock
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.briefSubtle
  }, "Stage"), /*#__PURE__*/React.createElement("div", null, company.stage)), /*#__PURE__*/React.createElement("div", {
    className: styles.briefBlock
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.briefSubtle
  }, "Total funding"), /*#__PURE__*/React.createElement("div", null, formatMoney(company.totalFunding))), /*#__PURE__*/React.createElement("div", {
    className: styles.briefBlock
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.briefSubtle
  }, "Projects"), /*#__PURE__*/React.createElement("div", null, company.projects.length, " active \xB7 ", pilotCount, " pilot(s)")), /*#__PURE__*/React.createElement("div", {
    className: styles.briefBlock
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.briefSubtle
  }, "Collaborations"), /*#__PURE__*/React.createElement("div", null, company.collaborations.length, " named partners")))), /*#__PURE__*/React.createElement("section", {
    className: styles.briefSection
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.briefSectionTitle
  }, "Projects & pilots"), /*#__PURE__*/React.createElement("ul", {
    className: styles.briefList
  }, company.projects.map(project => /*#__PURE__*/React.createElement("li", {
    key: `${project.name}-${project.startDate}`
  }, /*#__PURE__*/React.createElement("strong", null, project.name), " \u2014 ", project.type, " in ", project.location, " (", project.status, ")")), company.projects.length === 0 && /*#__PURE__*/React.createElement("li", null, "No projects captured yet."))), /*#__PURE__*/React.createElement("section", {
    className: styles.briefSection
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.briefSectionTitle
  }, "Collaborations & partners"), /*#__PURE__*/React.createElement("ul", {
    className: styles.briefList
  }, company.collaborations.slice(0, 6).map(collaboration => /*#__PURE__*/React.createElement("li", {
    key: `${collaboration.with}-${collaboration.startDate}`
  }, /*#__PURE__*/React.createElement("strong", null, collaboration.with), " \xB7 ", collaboration.kind, " \xB7 since ", new Date(collaboration.startDate).getFullYear())), company.collaborations.length === 0 && /*#__PURE__*/React.createElement("li", null, "No collaborations captured yet."))), /*#__PURE__*/React.createElement("section", {
    className: styles.briefSection
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.briefSectionTitle
  }, "Interactions & notes"), /*#__PURE__*/React.createElement("ul", {
    className: styles.briefList
  }, company.interactions.map(interaction => /*#__PURE__*/React.createElement("li", {
    key: `${interaction.date}-${interaction.type}`
  }, new Date(interaction.date).toLocaleDateString(), " \xB7 ", capitalize(interaction.type), " \xB7 ", interaction.summary)), company.interactions.length === 0 && /*#__PURE__*/React.createElement("li", null, "No interactions recorded yet."))), /*#__PURE__*/React.createElement("section", {
    className: styles.briefSection
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.briefSectionTitle
  }, "Claims & confidence"), /*#__PURE__*/React.createElement("ul", {
    className: styles.briefList
  }, company.claims.map(claim => /*#__PURE__*/React.createElement("li", {
    key: claim.id
  }, /*#__PURE__*/React.createElement("strong", null, claim.text), " \xB7 ", claim.metricType, " (", claim.unit, ") \xB7", ' ', /*#__PURE__*/React.createElement("span", {
    style: {
      color: ragColor(claim.trust)
    }
  }, claim.trust), " trust \xB7 score ", claim.trustScore, "/100")), company.claims.length === 0 && /*#__PURE__*/React.createElement("li", null, "No claims captured."))), /*#__PURE__*/React.createElement("section", {
    className: styles.briefSection
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.briefSectionTitle
  }, "Recent activity"), /*#__PURE__*/React.createElement("ul", {
    className: styles.briefList
  }, timeline.map(event => /*#__PURE__*/React.createElement("li", {
    key: `${event.label}-${event.date}`
  }, new Date(event.date).toLocaleDateString(), " \xB7 ", capitalize(event.type), " \xB7 ", event.label)), timeline.length === 0 && /*#__PURE__*/React.createElement("li", null, "No recent updates tracked."))), /*#__PURE__*/React.createElement("section", {
    className: styles.briefSection
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.briefSectionTitle
  }, "Evidence digest"), /*#__PURE__*/React.createElement("ul", {
    className: styles.briefList
  }, evidenceRows.map(item => /*#__PURE__*/React.createElement("li", {
    key: `${item.type}-${item.title}`
  }, /*#__PURE__*/React.createElement("strong", null, item.type), ": ", item.title, " (", new Date(item.date).toLocaleDateString(), ")")), evidenceRows.length === 0 && /*#__PURE__*/React.createElement("li", null, "No supporting documents captured."))), company.overviewImages?.length ? /*#__PURE__*/React.createElement("section", {
    className: styles.briefSection
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.briefSectionTitle
  }, "Overview imagery"), /*#__PURE__*/React.createElement("div", {
    className: styles.briefImageGrid
  }, company.overviewImages.map((media, index) => /*#__PURE__*/React.createElement("figure", {
    key: `${company.id}-brief-image-${index}`,
    className: styles.briefImageCard
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.briefImageFrame
  }, /*#__PURE__*/React.createElement("img", {
    src: media.src,
    alt: media.caption ?? `${company.name} figure ${index + 1}`
  })), media.caption && /*#__PURE__*/React.createElement("figcaption", {
    className: styles.briefImageCaption
  }, media.caption))))) : null));
};
const MockDashboard = () => {
  const [tab, setTab] = React.useState('home');
  const [viewMode, setViewMode] = React.useState('dashboard');
  const [mode, setMode] = React.useState('read');
  const [headerQuery, setHeaderQuery] = React.useState('');
  const [companies, setCompanies] = React.useState(() => MOCK_COMPANIES.map(cloneCompany));
  const [selectedCompany, setSelectedCompany] = React.useState(() => cloneCompany(MOCK_COMPANIES[0]));
  const selectedCompanyRef = React.useRef(cloneCompany(MOCK_COMPANIES[0]));
  const [curatorPanel, setCuratorPanel] = React.useState(null);
  const [curatorPanelError, setCuratorPanelError] = React.useState(null);
  const [curatorPanelSaving, setCuratorPanelSaving] = React.useState(false);
  const [orgPanelOpen, setOrgPanelOpen] = React.useState(false);
  const [orgPanelError, setOrgPanelError] = React.useState(null);
  const backgroundStyle = React.useMemo(() => ({
    '--bg-color': COLORS.bg
  }), []);
  React.useEffect(() => {
    selectedCompanyRef.current = selectedCompany;
  }, [selectedCompany]);
  const baseUrl = React.useMemo(() => {
    if (typeof window === 'undefined') {
      return '';
    }
    const {
      origin,
      pathname,
      search
    } = window.location;
    return `${origin}${pathname}${search}`;
  }, []);
  const getLink = React.useCallback((view, orgId, extra) => {
    const hash = buildHash(view, orgId, extra);
    return baseUrl ? `${baseUrl}#${hash}` : `#${hash}`;
  }, [baseUrl]);
  const getLinkWithState = React.useCallback((view, orgId, extra) => getLink(view, orgId, {
    mode,
    q: headerQuery,
    ...extra
  }), [getLink, mode, headerQuery]);
  const refreshOrganization = React.useCallback(orgId => {
    let updatedClone = null;
    setCompanies(prev => {
      const source = prev.find(c => c.id === orgId);
      if (!source) {
        return prev;
      }
      updatedClone = cloneCompany(source);
      return prev.map(c => c.id === orgId ? updatedClone : c);
    });
    if (updatedClone) {
      setSelectedCompany(updatedClone);
      selectedCompanyRef.current = updatedClone;
    }
  }, []);
  const dismissCuratorPanel = React.useCallback(() => {
    setCuratorPanel(null);
    setCuratorPanelError(null);
    setCuratorPanelSaving(false);
  }, []);
  const openCuratorPanel = React.useCallback(panel => {
    if (mode !== 'curator') {
      return;
    }
    setCuratorPanelError(null);
    setCuratorPanelSaving(false);
    setCuratorPanel(panel);
  }, [mode]);
  const navigate = React.useCallback((view, orgId, extra) => {
    if (typeof window === 'undefined') {
      return;
    }
    const hash = buildHash(view, orgId, extra);
    const fullHash = `#${hash}`;
    if (window.location.hash === fullHash) {
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    } else {
      window.location.hash = hash;
    }
  }, []);
  const handleAddStartup = React.useCallback(async org => {
    const provider = new MockProvider(companies);
    try {
      const id = await provider.addOrganization(org);
      setOrgPanelError(null);
      refreshOrganization(id);
      setOrgPanelOpen(false);
      setMode('curator');
      navigate('company', id, {
        mode: 'curator',
        q: headerQuery
      });
    } catch (error) {
      setOrgPanelError(error?.message ?? 'Unable to add startup');
    }
  }, [companies, headerQuery, navigate, refreshOrganization]);
  const handleCuratorPanelSubmit = React.useCallback(async payload => {
    if (!curatorPanel) {
      return;
    }
    const panel = curatorPanel;
    const provider = new MockProvider(companies);
    setCuratorPanelSaving(true);
    setCuratorPanelError(null);
    try {
      switch (panel.type) {
        case 'project':
          await provider.addProject(panel.orgId, payload);
          break;
        case 'collab':
          await provider.addCollaboration(panel.orgId, payload);
          break;
        case 'interaction':
          await provider.addInteraction(panel.orgId, payload);
          break;
        case 'claim':
          await provider.addClaim(panel.orgId, payload);
          break;
        case 'evidence':
          await provider.addClaimEvidence(panel.orgId, panel.claimId, payload);
          break;
        case 'image':
          await provider.addOverviewImage(panel.orgId, payload);
          break;
        default:
          throw new Error('Unsupported curator action');
      }
      refreshOrganization(panel.orgId);
      dismissCuratorPanel();
    } catch (error) {
      setCuratorPanelError(error?.message ?? 'Unable to save');
      throw error;
    } finally {
      setCuratorPanelSaving(false);
    }
  }, [companies, curatorPanel, refreshOrganization, dismissCuratorPanel]);
  const curatorPanelTitle = React.useMemo(() => {
    if (!curatorPanel) {
      return '';
    }
    switch (curatorPanel.type) {
      case 'project':
        return 'Add project';
      case 'collab':
        return 'Add collaboration';
      case 'interaction':
        return 'Add interaction';
      case 'claim':
        return 'Add claim';
      case 'evidence':
        return 'Add claim evidence';
      case 'image':
        return 'Add overview image';
      default:
        return 'Curator action';
    }
  }, [curatorPanel]);
  React.useEffect(() => {
    if (mode !== 'curator') {
      dismissCuratorPanel();
    }
  }, [mode, dismissCuratorPanel]);
  React.useEffect(() => {
    const applyRoute = () => {
      const {
        view,
        orgId,
        q,
        mode
      } = parseHash();
      const company = findCompanyById(companies, orgId) ?? selectedCompanyRef.current ?? companies[0];
      if (view === 'brief') {
        setViewMode('brief');
        if (company && company.id !== selectedCompanyRef.current.id) {
          setSelectedCompany(company);
        }
      } else {
        setViewMode('dashboard');
        setTab(view);
        if (view === 'company' && company && company.id !== selectedCompanyRef.current.id) {
          setSelectedCompany(company);
        }
      }
      if (typeof q === 'string') setHeaderQuery(q);
      setMode(mode === 'curator' ? 'curator' : 'read');
    };
    applyRoute();
    window.addEventListener('hashchange', applyRoute);
    return () => window.removeEventListener('hashchange', applyRoute);
  }, [companies]);
  const handleTabClick = tabId => {
    setViewMode('dashboard');
    setTab(tabId);
    const orgId = tabId === 'company' || tabId === 'map' ? selectedCompanyRef.current.id : undefined;
    navigate(tabId, orgId, {
      mode,
      q: headerQuery
    });
  };
  const handleSelectCompany = companyId => {
    const company = findCompanyById(companies, companyId);
    if (!company) {
      return;
    }
    setSelectedCompany(company);
    if (viewMode === 'brief') {
      navigate('brief', company.id, {
        mode,
        q: headerQuery
      });
    } else if (tab === 'company') {
      navigate('company', company.id, {
        mode,
        q: headerQuery
      });
    } else if (tab === 'map') {
      navigate('map', company.id, {
        mode,
        q: headerQuery
      });
    }
  };
  const handleNavigate = (view, orgId) => {
    if (view === 'brief') {
      setViewMode('brief');
    } else {
      setViewMode('dashboard');
      setTab(view);
    }
    if (orgId) {
      const company = findCompanyById(companies, orgId);
      if (company) {
        setSelectedCompany(company);
      }
    }
    navigate(view, orgId, {
      mode,
      q: headerQuery
    });
  };
  const handleOpenBrief = (company, openInNewTab) => {
    if (openInNewTab) {
      const href = getLinkWithState('brief', company.id);
      if (typeof window !== 'undefined') {
        window.open(href, '_blank', 'noopener');
      }
      return;
    }
    setSelectedCompany(company);
    setViewMode('brief');
    navigate('brief', company.id, {
      mode,
      q: headerQuery
    });
  };
  const handleBackFromBrief = () => {
    setViewMode('dashboard');
    setTab('company');
    navigate('company', selectedCompanyRef.current.id, {
      mode,
      q: headerQuery
    });
  };
  if (viewMode === 'brief') {
    return /*#__PURE__*/React.createElement("div", {
      className: styles.dashboard,
      style: backgroundStyle
    }, /*#__PURE__*/React.createElement(CompanyBrief, {
      company: selectedCompanyRef.current,
      onBack: handleBackFromBrief,
      getLink: getLinkWithState
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: styles.dashboard,
    style: backgroundStyle
  }, /*#__PURE__*/React.createElement("header", {
    className: styles.header
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.headerContent
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.headerLeft
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.logo
  }, "TE"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: styles.headerText
  }, "CCUS Scouting \u2014 DAC (Mock)"), /*#__PURE__*/React.createElement("div", {
    className: styles.headerSubtitle
  }, "Power BI front-end concept \xB7 mock data \xB7 TotalEnergies-inspired UI"))), /*#__PURE__*/React.createElement("div", {
    className: styles.headerControls
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.search
  }, /*#__PURE__*/React.createElement(Search, {
    size: 16,
    color: COLORS.slate
  }), /*#__PURE__*/React.createElement("input", {
    className: styles.searchInput,
    placeholder: "Global search\u2026",
    value: headerQuery,
    onChange: e => setHeaderQuery(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter') {
        navigate('finder', undefined, {
          q: headerQuery,
          mode
        });
      }
    }
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: styles.secondaryButton,
    onClick: () => {
      const next = mode === 'read' ? 'curator' : 'read';
      setMode(next);
      navigate(tab, selectedCompanyRef.current?.id, {
        mode: next,
        q: headerQuery
      });
    },
    title: "Toggle mode"
  }, mode === 'read' ? 'Read-only' : 'Curator'), mode === 'curator' && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: styles.primaryButton,
    onClick: () => {
      setOrgPanelError(null);
      setOrgPanelOpen(true);
    }
  }, "+ Add startup")))), /*#__PURE__*/React.createElement("div", {
    className: styles.layout
  }, /*#__PURE__*/React.createElement("aside", {
    className: styles.sidebar
  }, TABS.map(tabItem => {
    const isActive = tab === tabItem.id;
    const className = `${styles.sidebarButton} ${isActive ? styles.sidebarButtonActive : ''}`;
    return /*#__PURE__*/React.createElement("button", {
      key: tabItem.id,
      type: "button",
      className: className,
      onClick: () => handleTabClick(tabItem.id)
    }, /*#__PURE__*/React.createElement(tabItem.icon, {
      size: 16,
      color: isActive ? '#ffffff' : '#1f2937'
    }), tabItem.label);
  }), /*#__PURE__*/React.createElement("div", {
    className: styles.sidebarDivider
  }, "Demo controls"), /*#__PURE__*/React.createElement("div", {
    className: styles.sidebarControl
  }, /*#__PURE__*/React.createElement("label", {
    className: styles.sidebarLabel,
    htmlFor: "mock-company-select"
  }, "Select company"), /*#__PURE__*/React.createElement("select", {
    id: "mock-company-select",
    className: styles.sidebarSelect,
    value: selectedCompany.id,
    onChange: event => handleSelectCompany(event.target.value)
  }, MOCK_COMPANIES.map(company => /*#__PURE__*/React.createElement("option", {
    key: company.id,
    value: company.id
  }, company.name)))), /*#__PURE__*/React.createElement("div", {
    className: styles.sidebarControl
  }, /*#__PURE__*/React.createElement("label", {
    className: styles.sidebarLabel
  }, "Mode"), /*#__PURE__*/React.createElement("div", {
    className: styles.chipRow
  }, /*#__PURE__*/React.createElement(Chip, {
    active: mode === 'read',
    onClick: () => {
      setMode('read');
      navigate(tab, selectedCompanyRef.current?.id, {
        mode: 'read',
        q: headerQuery
      });
    }
  }, "Read-only"), /*#__PURE__*/React.createElement(Chip, {
    active: mode === 'curator',
    onClick: () => {
      setMode('curator');
      navigate(tab, selectedCompanyRef.current?.id, {
        mode: 'curator',
        q: headerQuery
      });
    }
  }, "Curator")))), /*#__PURE__*/React.createElement("main", {
    className: styles.main
  }, tab === 'home' && /*#__PURE__*/React.createElement(HomePage, {
    companies: companies,
    onNavigate: handleNavigate,
    getLink: getLinkWithState
  }), tab === 'finder' && /*#__PURE__*/React.createElement(FinderPage, {
    companies: companies,
    onNavigate: handleNavigate,
    getLink: getLinkWithState,
    initialQuery: headerQuery,
    mode: mode
  }), tab === 'company' && /*#__PURE__*/React.createElement(Company360Page, {
    company: selectedCompany,
    onNavigate: handleNavigate,
    getLink: getLinkWithState,
    onOpenBrief: handleOpenBrief,
    openCuratorPanel: openCuratorPanel,
    mode: mode
  }), tab === 'funding' && /*#__PURE__*/React.createElement(FundingDealsPage, {
    companies: companies
  }), tab === 'pubs' && /*#__PURE__*/React.createElement(PublicationsPatentsPage, {
    companies: companies
  }), tab === 'map' && /*#__PURE__*/React.createElement(MapPage, {
    companies: companies,
    onNavigate: handleNavigate,
    getLink: getLinkWithState
  }), tab === 'stale' && /*#__PURE__*/React.createElement(StalenessPage, {
    companies: companies
  }))), /*#__PURE__*/React.createElement("footer", {
    className: styles.footer
  }, "Mock dashboard for illustration. Colors approximate TotalEnergies branding; data are fictional or simplified."), mode === 'curator' && curatorPanel && /*#__PURE__*/React.createElement(Panel, {
    isOpen: true,
    onDismiss: dismissCuratorPanel,
    type: PanelType.medium,
    headerText: curatorPanelTitle,
    closeButtonAriaLabel: "Close curator action",
    isLightDismiss: !curatorPanelSaving
  }, curatorPanelError && /*#__PURE__*/React.createElement("div", {
    className: styles.subtleText,
    style: {
      color: COLORS.red,
      marginBottom: 12
    }
  }, curatorPanelError), curatorPanel.type === 'project' && /*#__PURE__*/React.createElement(CuratorProjectForm, {
    key: `${curatorPanel.orgId}-project`,
    onSubmit: handleCuratorPanelSubmit,
    onCancel: dismissCuratorPanel,
    submitting: curatorPanelSaving
  }), curatorPanel.type === 'collab' && /*#__PURE__*/React.createElement(CuratorCollabForm, {
    key: `${curatorPanel.orgId}-collab`,
    onSubmit: handleCuratorPanelSubmit,
    onCancel: dismissCuratorPanel,
    submitting: curatorPanelSaving
  }), curatorPanel.type === 'interaction' && /*#__PURE__*/React.createElement(CuratorInteractionForm, {
    key: `${curatorPanel.orgId}-interaction`,
    onSubmit: handleCuratorPanelSubmit,
    onCancel: dismissCuratorPanel,
    submitting: curatorPanelSaving
  }), curatorPanel.type === 'claim' && /*#__PURE__*/React.createElement(CuratorClaimForm, {
    key: `${curatorPanel.orgId}-claim`,
    onSubmit: handleCuratorPanelSubmit,
    onCancel: dismissCuratorPanel,
    submitting: curatorPanelSaving
  }), curatorPanel.type === 'evidence' && /*#__PURE__*/React.createElement(CuratorEvidenceForm, {
    key: `${curatorPanel.orgId}-evidence-${curatorPanel.claimId}`,
    onSubmit: handleCuratorPanelSubmit,
    onCancel: dismissCuratorPanel,
    submitting: curatorPanelSaving
  }), curatorPanel.type === 'image' && /*#__PURE__*/React.createElement(CuratorImageForm, {
    key: `${curatorPanel.orgId}-image`,
    onSubmit: handleCuratorPanelSubmit,
    onCancel: dismissCuratorPanel,
    submitting: curatorPanelSaving
  })), mode === 'curator' && /*#__PURE__*/React.createElement(Panel, {
    isOpen: orgPanelOpen,
    onDismiss: () => setOrgPanelOpen(false),
    type: PanelType.medium,
    headerText: "Add startup",
    closeButtonAriaLabel: "Close"
  }, /*#__PURE__*/React.createElement(CuratorOrgForm, {
    onSubmit: handleAddStartup,
    onCancel: () => setOrgPanelOpen(false),
    error: orgPanelError
  })));
};
export default MockDashboard;