/* eslint max-lines: ["error", 4000] */
import * as React from 'react';
import {
  Search,
  Building2,
  Filter,
  ExternalLink,
  TrendingUp,
  DollarSign,
  Users,
  Factory,
  ClipboardList,
  BadgeCheck,
  AlertTriangle,
  BookOpen,
  Newspaper,
  ArrowUpRight,
  ShieldCheck,
  Timer,
  Printer,
  ArrowLeft,
  Globe2,
  MapPin
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Area,
  AreaChart
} from 'recharts';
import styles from './MockDashboard.module.scss';
import type {
  Claim as ProviderClaim,
  Document as ProviderDocument,
  Org,
  Project as ProviderProject,
  Relation as ProviderRelation
} from '../data/IDataProvider';
import type { IDataProvider } from '../data/IDataProvider';
import MockProvider from '../data/MockProvider';
import { Panel, PanelType } from '@fluentui/react';

type TrustLevel = 'Green' | 'Amber' | 'Red';

interface Collaboration {
  with: string;
  kind: string;
  startDate: string;
}

interface FundingRound {
  date: string;
  amount: number;
  roundType: string;
  investors: string[];
  source: string;
}

interface Project {
  name: string;
  type: string;
  location: string;
  capacity: number;
  status: string;
  startDate: string;
  partners: string[];
}

interface Interaction {
  date: string;
  type: string;
  attendees: string[];
  summary: string;
}

interface EvidenceItem {
  type: string;
  title: string;
  url: string;
  date: string;
}

interface Claim {
  id: string;
  text: string;
  metricType: string;
  unit: string;
  min: number;
  ml: number;
  max: number;
  trust: TrustLevel;
  trustScore: number;
  evidence: EvidenceItem[];
}

interface DocumentItem {
  title: string;
  date: string;
  link: string;
  type?: string;
}

interface Company {
  id: string;
  name: string;
  website: string;
  country: string;
  approach: string;
  stage: string;
  founded: number;
  totalFunding: number;
  freshnessDays: number;
  description: string;
  aliases: string[];
  collaborations: Collaboration[];
  fundingRounds: FundingRound[];
  projects: Project[];
  interactions: Interaction[];
  claims: Claim[];
  publications: DocumentItem[];
  patents: DocumentItem[];
  news: DocumentItem[];
  logoUrl?: string;
  overviewImages?: Array<{
    src: string;
    caption?: string;
  }>;
}

type IconComponent = React.ComponentType<{ size?: number | string; color?: string }>;

interface TimelineEvent {
  date: string;
  type: TimelineType;
  label: string;
  icon: IconComponent;
  company?: string;
  companyId?: string;
}

type TimelineType =
  | 'funding'
  | 'project'
  | 'interaction'
  | 'publication'
  | 'patent'
  | 'news'
  | 'claim';

type TabId = 'home' | 'finder' | 'company' | 'funding' | 'pubs' | 'stale' | 'map';
type ViewHash = TabId | 'brief';

type FeedCategory = 'News' | 'Publication' | 'Patent';

interface FeedItem {
  id: string;
  date: string;
  title: string;
  type: FeedCategory;
  source: string;
  link: string;
  orgIds: string[];
}

const ALL_TABS: TabId[] = ['home', 'finder', 'company', 'funding', 'pubs', 'stale', 'map'];

const TABS: { id: TabId; label: string; icon: IconComponent }[] = [
  { id: 'home', label: 'Home', icon: TrendingUp },
  { id: 'finder', label: 'Finder', icon: Search },
  { id: 'company', label: 'Company 360', icon: Building2 },
  { id: 'funding', label: 'Funding & Deals', icon: DollarSign },
  { id: 'pubs', label: 'Publications & Patents', icon: BookOpen },
  { id: 'map', label: 'Map', icon: Globe2 },
  { id: 'stale', label: 'Staleness', icon: AlertTriangle }
];

const COLORS = {
  brand: '#e4002b',
  brandDark: '#b30022',
  green: '#1db954',
  amber: '#f59e0b',
  red: '#ef4444',
  slate: '#64748b',
  bg: '#f8fafc'
};

const MIDDOT = '\u00B7';
const ELLIPSIS = '\u2026';
const ENDASH = '\u2013';
const TIMES = '\u00D7';



interface AxisTickProps {
  x?: number;
  y?: number;
  payload?: {
    value: string;
  };
}

const FundingAxisTick: React.FC<AxisTickProps> = ({ x = 0, y = 0, payload }) => {
  const raw = payload?.value ?? '';
  const segments = raw.split(' ');
  const lines =
    segments.length > 2
      ? [segments.slice(0, segments.length - 1).join(' '), segments[segments.length - 1]]
      : segments;

  return (
    <g transform={`translate(${x},${y})`}>
      <text textAnchor="middle" fill={COLORS.slate} fontSize={12}>
        {lines.map((line, index) => (
          <tspan key={`${raw}-${index}`} x={0} dy={index === 0 ? 0 : 14}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
};

const guessClaimChangeDate = (claim: Claim): string => claim?.evidence?.[0]?.date ?? '2024-01-01';

const formatMoney = (value: number): string => `$${(value / 1_000_000).toFixed(0)}M`;

const capitalize = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);

const ragColor = (trust: TrustLevel): string => {
  switch (trust) {
    case 'Green':
      return COLORS.green;
    case 'Amber':
      return COLORS.amber;
    default:
      return COLORS.red;
  }
};

const buildTimeline = (company: Company): TimelineEvent[] => {
  const events: TimelineEvent[] = [];

  company.fundingRounds.forEach(funding =>
    events.push({
      date: funding.date,
      type: 'funding',
      label: `${formatMoney(funding.amount)} ${funding.roundType}`,
      icon: DollarSign,
      company: company.name,
      companyId: company.id
    })
  );

  company.projects.forEach(project =>
    events.push({
      date: project.startDate,
      type: 'project',
      label: `${project.name} ${MIDDOT} ${project.type} @ ${project.location}`,
      icon: Factory,
      company: company.name,
      companyId: company.id
    })
  );

  company.interactions.forEach(interaction =>
    events.push({
      date: interaction.date,
      type: 'interaction',
      label: `${capitalize(interaction.type)} ${ENDASH} ${interaction.summary}`,
      icon: Users,
      company: company.name,
      companyId: company.id
    })
  );

  company.publications.forEach(doc =>
    events.push({ date: doc.date, type: 'publication', label: doc.title, icon: BookOpen, company: company.name, companyId: company.id })
  );

  company.patents.forEach(doc =>
    events.push({ date: doc.date, type: 'patent', label: doc.title, icon: ClipboardList, company: company.name, companyId: company.id })
  );

  company.news.forEach(doc =>
    events.push({ date: doc.date, type: 'news', label: doc.title, icon: Newspaper, company: company.name, companyId: company.id })
  );

  company.claims.forEach(claim =>
    events.push({
      date: guessClaimChangeDate(claim),
      type: 'claim',
      label: `${claim.text} (${claim.trust})`,
      icon: BadgeCheck,
      company: company.name,
      companyId: company.id
    })
  );

  return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

const daysSince = (date: string): number => {
  const ms = Date.now() - new Date(date).getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
};

const countEvidenceTypes = (company: Company): string[] => {
  const types = new Set<string>();

  if (company.publications?.length) {
    types.add('pub');
  }
  if (company.patents?.length) {
    types.add('pat');
  }
  if (company.news?.length) {
    types.add('news');
  }

  return setToArray(types);
};

const getInitials = (value: string): string =>
  value
    .split(/\s+/)
    .map(part => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');

const cloneClaim = (claim: Claim): Claim => ({
  ...claim,
  evidence: claim.evidence ? [...claim.evidence.map(ev => ({ ...ev }))] : []
});

const cloneCompany = (company: Company): Company => ({
  ...company,
  collaborations: [...(company.collaborations || []).map(co => ({ ...co }))],
  fundingRounds: [...(company.fundingRounds || []).map(fr => ({ ...fr }))],
  projects: [...(company.projects || []).map(project => ({ ...project }))],
  interactions: [...(company.interactions || []).map(interaction => ({ ...interaction }))],
  claims: [...(company.claims || []).map(cloneClaim)],
  publications: [...(company.publications || []).map(pub => ({ ...pub }))],
  patents: [...(company.patents || []).map(pat => ({ ...pat }))],
  news: [...(company.news || []).map(n => ({ ...n }))],
  overviewImages: company.overviewImages ? company.overviewImages.map(img => ({ ...img })) : undefined
});

function setToArray<T>(input: Set<T>): T[] {
  const result: T[] = [];
  input.forEach(value => result.push(value));
  return result;
}

function collectUnique(values: string[]): string[] {
  const seen: { [key: string]: true } = {};
  const result: string[] = [];
  values.forEach(value => {
    if (!seen[value]) {
      seen[value] = true;
      result.push(value);
    }
  });
  return result;
}

function cloneStringSet(source: Set<string>): Set<string> {
  const clone = new Set<string>();
  source.forEach(value => clone.add(value));
  return clone;
}

const stageLabel = (stage: Org['stage']): string => {
  switch (stage) {
    case 'commercial_pilot':
      return 'Commercial pilot';
    case 'commercial':
      return 'Commercial';
    case 'demo':
      return 'Demo';
    case 'pilot':
      return 'Pilot';
    case 'concept':
    default:
      return 'Concept';
  }
};

const projectTypeLabel = (projectType: ProviderProject['projectType']): string => {
  switch (projectType) {
    case 'commercial':
      return 'Commercial';
    case 'demo':
      return 'Demo';
    case 'research':
      return 'Research';
    case 'pilot':
    default:
      return 'Pilot';
  }
};

const relationKindLabel = (relationType: ProviderRelation['type']): string =>
  relationType.charAt(0).toUpperCase() + relationType.slice(1);

const ragToTrust = (rag: ProviderClaim['rag']): TrustLevel => {
  switch (rag) {
    case 'green':
      return 'Green';
    case 'amber':
      return 'Amber';
    case 'red':
    default:
      return 'Red';
  }
};

const trustToScore = (trust: ProviderClaim['trust']): number => {
  switch (trust) {
    case 'high':
      return 85;
    case 'medium':
      return 65;
    case 'low':
      return 45;
    default:
      return 55;
  }
};

const evidenceKindLabel = (kind: string): string => {
  switch (kind) {
    case 'publication':
      return 'Publication';
    case 'patent':
      return 'Patent';
    case 'news':
      return 'News';
    case 'report':
      return 'Report';
    default:
      return capitalize(kind);
  }
};

const documentKindToCategory = (kind: ProviderDocument['kind']): FeedCategory => {
  switch (kind) {
    case 'publication':
      return 'Publication';
    case 'patent':
      return 'Patent';
    default:
      return 'News';
  }
};

const toDocumentItem = (document: ProviderDocument): DocumentItem => ({
  title: document.title,
  date: document.published_on,
  link: document.url,
  type: documentKindToCategory(document.kind)
});

const toFeedItem = (document: ProviderDocument): FeedItem => ({
  id: document.id,
  date: document.published_on,
  title: document.title,
  type: documentKindToCategory(document.kind),
  source: document.source ?? 'External',
  link: document.url,
  orgIds: [document.orgId]
});

const hydrateCompanyFromProvider = (
  org: Org,
  projects: ProviderProject[],
  claims: ProviderClaim[],
  relations: ProviderRelation[],
  documents: ProviderDocument[],
  orgLookup: Map<string, Org>
): Company => {
  const fundingRounds = (org.fundingRounds ?? []).map(round => ({
    date: round.announced_on,
    amount: round.amountUsd,
    roundType: round.round,
    investors: [...round.investors],
    source: round.source ?? 'External'
  }));

  const collaborations = relations.map(relation => {
    const counterpartyId = relation.sourceId === org.id ? relation.targetId : relation.sourceId;
    const counterparty = orgLookup.get(counterpartyId);
    return {
      with: counterparty?.name ?? counterpartyId,
      kind: relationKindLabel(relation.type),
      startDate: relation.since ?? new Date().toISOString().slice(0, 10)
    };
  });

  const mappedProjects = projects.map(project => ({
    name: project.name,
    type: projectTypeLabel(project.projectType),
    location: project.location ?? '-',
    capacity: project.capacity_tCO2_per_year ?? 0,
    status: project.status,
    startDate: project.start_date ?? '',
    partners: (project.partners ?? []).map(partnerId => orgLookup.get(partnerId)?.name ?? partnerId)
  }));

  const mappedInteractions = (org.interactions ?? []).map(interaction => ({
    date: interaction.occurred_on,
    type: interaction.type,
    attendees: [...(interaction.attendees ?? [])],
    summary: interaction.summary ?? ''
  }));

  const mappedClaims = claims.map(providerClaim => ({
    id: providerClaim.id,
    text: providerClaim.statement,
    metricType: providerClaim.metric,
    unit: providerClaim.unit,
    min: providerClaim.min ?? 0,
    ml: providerClaim.ml ?? 0,
    max: providerClaim.max ?? 0,
    trust: ragToTrust(providerClaim.rag),
    trustScore: trustToScore(providerClaim.trust),
    evidence: providerClaim.evidence.map(ev => ({
      type: evidenceKindLabel(ev.kind),
      title: ev.title,
      url: ev.url ?? '#',
      date: ev.published_on ?? ''
    }))
  }));

  const documentItems = documents.map(toDocumentItem);
  const publications = documentItems.filter(item => item.type === 'Publication');
  const patents = documentItems.filter(item => item.type === 'Patent');
  const news = documentItems.filter(item => item.type === 'News');

  return {
    id: org.id,
    name: org.name,
    website: org.website ?? '#',
    country: org.country ?? '',
    approach: org.approach,
    stage: stageLabel(org.stage),
    founded: org.foundedYear ?? new Date().getFullYear(),
    totalFunding: org.totalFundingUsd ?? 0,
    freshnessDays: org.freshnessDays ?? 0,
    description: org.description ?? '',
    aliases: org.aliases ?? [],
    collaborations,
    fundingRounds,
    projects: mappedProjects,
    interactions: mappedInteractions,
    claims: mappedClaims,
    publications,
    patents,
    news,
    logoUrl: org.logoUrl,
  overviewImages: org.overviewImages?.map(media => ({ src: media.src, caption: media.caption }))
  };
};

const getErrorMessage = (error: unknown): string => {
  if (error && typeof (error as { message?: unknown }).message === 'string') {
    return (error as { message: string }).message;
  }
  return 'Unexpected error';
};

const slugify = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    || `org-${Date.now().toString(36)}`;

const parseHash = (): { view: ViewHash; orgId?: string; q?: string; mode?: 'read' | 'curator' } => {
  if (typeof window === 'undefined') {
    return { view: 'home' };
  }

  const hash = window.location.hash.replace(/^#/, '');
  const params = new URLSearchParams(hash);
  const viewParam = params.get('view') ?? 'home';
  const orgId = params.get('org') ?? undefined;
  const q = params.get('q') ?? undefined;
  const modeParam = params.get('mode') as ('read' | 'curator') | null;

  if (viewParam === 'brief') {
    return { view: 'brief', orgId, q, mode: modeParam || undefined };
  }

  const normalizedView = ALL_TABS.indexOf(viewParam as TabId) !== -1 ? (viewParam as TabId) : 'home';
  return { view: normalizedView, orgId, q, mode: modeParam || undefined };
};

const buildHash = (view: ViewHash, orgId?: string, extra?: Record<string, string | undefined>): string => {
  const params = new URLSearchParams();
  params.set('view', view);
  if (orgId) {
    params.set('org', orgId);
  }
  if (extra) {
    for (const key in extra) {
      if (Object.prototype.hasOwnProperty.call(extra, key)) {
        const value = extra[key];
        if (value !== undefined) {
          params.set(key, value);
        }
      }
    }
  }
  return params.toString();
};

const findCompanyById = (collection: Company[], id?: string): Company | undefined => {
  if (!id) {
    return undefined;
  }
  for (let index = 0; index < collection.length; index++) {
    const candidate = collection[index];
    if (candidate.id === id) {
      return candidate;
    }
  }
  return undefined;
};

interface ChipProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

const Chip: React.FC<ChipProps> = ({ children, active, onClick }) => (
  <button
    type="button"
    className={`${styles.chip} ${active ? styles.chipActive : ''}`}
    onClick={onClick}
  >
    {children}
  </button>
);

interface BadgeProps {
  color: string;
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ color, children }) => (
  <span className={styles.badge} style={{ background: `${color}1A`, color }}>
    <span className={styles.badgeSwatch} style={{ background: color }} />
    {children}
  </span>
);

interface CardProps {
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, actions, children }) => (
  <div className={styles.card}>
    <div className={styles.cardHeader}>
      <h3 className={styles.cardTitle}>{title}</h3>
      <div className={styles.cardActions}>{actions}</div>
    </div>
    <div className={styles.cardBody}>{children}</div>
  </div>
);

interface KpiProps {
  label: string;
  value: string | number;
  icon: IconComponent;
  helper?: string;
}

const Kpi: React.FC<KpiProps> = ({ label, value, icon: Icon, helper }) => (
  <div className={styles.kpiCard}>
    <div className={styles.kpiIcon}>
      <Icon size={18} color={COLORS.brand} />
    </div>
    <div>
      <div className={styles.kpiLabel}>{label}</div>
      <div className={styles.kpiValue}>{value}</div>
      {helper && <div className={styles.subtleText}>{helper}</div>}
    </div>
  </div>
);

interface HomePageProps {
  companies: Company[];
  onNavigate: (view: ViewHash, orgId?: string) => void;
  getLink: (view: ViewHash, orgId?: string) => string;
  newsFeed: FeedItem[];
}

const HomePage: React.FC<HomePageProps> = ({ companies, onNavigate, getLink, newsFeed }) => {
  const [newsWindow, setNewsWindow] = React.useState<number>(14);
  const [newsType, setNewsType] = React.useState<'All' | 'News' | 'Publication' | 'Patent'>('All');

  const news = React.useMemo(() => {
    const cutoff = Date.now() - newsWindow * 24 * 60 * 60 * 1000;
    return newsFeed
      .filter(item => new Date(item.date).getTime() >= cutoff)
      .filter(item => (newsType === 'All' ? true : item.type === newsType))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [newsFeed, newsWindow, newsType]);
  const totals = React.useMemo(
    () => ({
      orgs: companies.length,
      projects: companies.reduce((acc, company) => acc + company.projects.length, 0),
      pilots: companies.reduce(
        (acc, company) =>
          acc + company.projects.filter(project => project.type.toLowerCase() === 'pilot').length,
        0
      ),
      funding: companies.reduce((acc, company) => acc + (company.totalFunding ?? 0), 0),
      new90: companies.reduce(
        (acc, company) =>
          acc + company.news.filter(item => daysSince(item.date) <= 90).length,
        0
      )
    }),
    [companies]
  );

  const helperCopy = React.useMemo(
    () => ({
      orgs: `${companies.filter(company => company.freshnessDays <= 30).length} touched in 30 days`,
      projects: `${companies.filter(company => company.projects.length > 0).length} portfolios active`,
      pilots: `${companies.filter(company => company.projects.some(project => project.type.toLowerCase() === 'pilot')).length} orgs piloting`,
      funding: `${formatMoney(totals.funding / Math.max(1, totals.orgs))} avg/org`,
      new90: `${companies.filter(company => company.news.length > 0).length} orgs surfaced`
    }),
    [companies, totals.funding, totals.orgs]
  );

  const recentEvents = React.useMemo(() => {
    const events: TimelineEvent[] = [];
    companies.forEach(company => {
      const timeline = buildTimeline(company);
      timeline.forEach(event => {
        if (daysSince(event.date) <= 30) {
          events.push({ ...event, company: company.name, companyId: company.id });
        }
      });
    });
    const sliceStart = Math.max(0, events.length - 12);
    return events.slice(sliceStart).reverse();
  }, [companies]);

  const stages = React.useMemo(
    () => collectUnique(companies.map(company => company.stage)),
    [companies]
  );

  const approaches = React.useMemo(
    () => collectUnique(companies.map(company => company.approach)),
    [companies]
  );

  const heatmapColumns = React.useMemo(() => {
    const base = 'minmax(180px, 2.2fr)';
    if (stages.length === 0) {
      return base;
    }
    return `${base} repeat(${stages.length}, minmax(0, 1fr))`;
  }, [stages]);

  return (
    <div className={styles.main}>
      <div className={styles.kpiGrid}>
        <Kpi label="Organizations" value={totals.orgs} icon={Building2} helper={helperCopy.orgs} />
        <Kpi label="Projects" value={totals.projects} icon={Factory} helper={helperCopy.projects} />
        <Kpi label="Active pilots" value={totals.pilots} icon={Timer} helper={helperCopy.pilots} />
        <Kpi label="Total funding" value={formatMoney(totals.funding)} icon={DollarSign} helper={helperCopy.funding} />
        <Kpi label="New items (90d)" value={totals.new90} icon={Newspaper} helper={helperCopy.new90} />
      </div>

      <div className={styles.gridTwo}>
        <Card title="Funding by organization">
          <div className={styles.chartArea}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={companies.map(company => ({
                  name: company.name,
                  funding: (company.totalFunding ?? 0) / 1_000_000
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  interval={0}
                  height={64}
                  tick={<FundingAxisTick />}
                  tickMargin={12}
                  tickLine={false}
                />
                <YAxis unit="M" />
                <Tooltip formatter={(value: number) => `${value}M`} />
                <Legend />
                <Bar dataKey="funding" name="Funding (USD M)" fill={COLORS.brand} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title={`Approach ${TIMES} Stage heatmap (grid)`}>
          <div className={styles.cardList}>
            <div className={styles.subtleText}>
              Distribution of observed companies by DAC approach and commercialization stage.
            </div>
            <div>
              <div className={styles.heatmapGrid} style={{ gridTemplateColumns: heatmapColumns }}>
                <div className={styles.heatmapHeader}>Approach</div>
                {stages.map(stage => (
                  <div
                    key={`stage-${stage}`}
                    className={`${styles.heatmapHeader} ${styles.heatmapHeaderStage}`}
                    title={stage}
                  >
                    {stage}
                  </div>
                ))}

                {approaches.map(approach => (
                  <React.Fragment key={approach}>
                    <div className={styles.heatmapRowLabel}>{approach}</div>
                    {stages.map(stage => {
                      const count = companies.filter(
                        company => company.approach === approach && company.stage === stage
                      ).length;
                      const background = count ? `${COLORS.brand}22` : '#f1f5f9';
                      const border = count ? `${COLORS.brand}33` : '#e2e8f0';

                      return (
                        <div key={`${approach}-${stage}`} className={styles.heatmapCell}>
                          <div className={styles.heatCell} style={{ background, border: `1px solid ${border}` }}>
                            {count || ''}
                          </div>
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card
        title="Recent news"
        actions={
          <div className={styles.chipRow}>
            {[7, 14, 30, 90].map(days => (
              <Chip key={days} active={newsWindow === days} onClick={() => setNewsWindow(days)}>
                {days}d
              </Chip>
            ))}
            {(['All', 'News', 'Publication', 'Patent'] as const).map(t => (
              <Chip key={t} active={newsType === t} onClick={() => setNewsType(t)}>
                {t}
              </Chip>
            ))}
          </div>
        }
      >
        <div className={styles.newsList}>
          {news.slice(0, 8).map(item => (
            <div key={item.id} className={styles.newsItem}>
              <div>
                <div className={styles.newsTitle}>{item.title}</div>
                <div className={styles.newsMeta}>
                  {new Date(item.date).toLocaleDateString()} {MIDDOT} {item.type} {MIDDOT} {item.source}
                </div>
              </div>
              <div className={styles.actionBar}>
                {item.orgIds.map(orgId => (
                  <a
                    key={`${item.id}-${orgId}`}
                    className={styles.secondaryButton}
                    href={getLink('company', orgId)}
                    onClick={e => {
                      e.preventDefault();
                      onNavigate('company', orgId);
                    }}
                  >
                    Open 360
                  </a>
                ))}
                <a className={styles.secondaryButton} href={item.link} target="_blank" rel="noreferrer">
                  Source
                </a>
              </div>
            </div>
          ))}
          {news.length === 0 && <div className={styles.subtleText}>No recent news in this window.</div>}
        </div>
      </Card>

      <Card title="What changed (last 30 days)">
        <div className={styles.chipRow}>
          {recentEvents.length === 0 && <div className={styles.subtleText}>No recent updates in mock data.</div>}
          {recentEvents.map(event => (
            <a
              key={`${event.label}-${event.date}`}
              className={styles.pill}
              href={getLink('company', event.companyId)}
              onClick={evt => {
                evt.preventDefault();
                if (event.companyId) {
                  onNavigate('company', event.companyId);
                }
              }}
            >
              <event.icon size={14} color={COLORS.brand} />
              <span style={{ fontWeight: 600 }}>{event.company}</span>
              <span>{event.label}</span>
              <span className={styles.subtleText}>
                {new Date(event.date).toLocaleDateString()}
              </span>
            </a>
          ))}
        </div>
      </Card>

    </div>
  );
};

interface FinderPageProps {
  companies: Company[];
  onNavigate: (view: ViewHash, orgId?: string) => void;
  getLink: (view: ViewHash, orgId?: string) => string;
  initialQuery?: string;
  mode?: 'read' | 'curator';
}

const FinderPage: React.FC<FinderPageProps> = ({ companies, onNavigate, getLink, initialQuery, mode }) => {
  const [query, setQuery] = React.useState(initialQuery || '');
  const [chips, setChips] = React.useState({
    approach: new Set<string>(),
    stage: new Set<string>(),
    pilot: false,
    under50: false
  });
  const [showFilters, setShowFilters] = React.useState(false);
  const filtersPanelRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    setQuery(initialQuery || '');
  }, [initialQuery]);

  const hasActiveFilters = React.useMemo(
    () => Boolean(query.trim()) || chips.approach.size > 0 || chips.stage.size > 0 || chips.pilot || chips.under50,
    [query, chips]
  );

  const clearFilters = React.useCallback(() => {
    setQuery('');
    setChips({
      approach: new Set<string>(),
      stage: new Set<string>(),
      pilot: false,
      under50: false
    });
    setShowFilters(false);
  }, []);

  React.useEffect(() => {
    if (!showFilters) {
      return;
    }
    const timer = window.setTimeout(() => {
      const candidate = filtersPanelRef.current?.querySelector('input, button, select, textarea, a') as HTMLElement | null;
      candidate?.focus();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [showFilters]);

  const approaches = React.useMemo(
    () => collectUnique(companies.map(company => company.approach)),
    [companies]
  );

  const stages = React.useMemo(
    () => collectUnique(companies.map(company => company.stage)),
    [companies]
  );

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return companies.filter(company => {
      const searchable = `${company.name} ${company.approach} ${company.country} ${company.description ?? ''}`.toLowerCase();
      const matchesQuery = q ? searchable.indexOf(q) !== -1 : true;
      const matchesApproach = chips.approach.size ? chips.approach.has(company.approach) : true;
      const matchesStage = chips.stage.size ? chips.stage.has(company.stage) : true;
      const matchesPilot = chips.pilot
        ? company.projects.some(project => project.type.toLowerCase() === 'pilot' && project.status.toLowerCase() !== 'planned')
        : true;
      const matchesUnder50 = chips.under50 ? (company.totalFunding ?? 0) < 50_000_000 : true;

      return matchesQuery && matchesApproach && matchesStage && matchesPilot && matchesUnder50;
    });
  }, [companies, query, chips]);

  const appliedFilters = React.useMemo(() => {
    const items: Array<{ key: string; label: string; onRemove: () => void }> = [];
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      items.push({ key: 'q', label: `Query: ${trimmedQuery}`, onRemove: () => setQuery('') });
    }
    chips.approach.forEach(value => {
      items.push({
        key: `approach:${value}`,
        label: `Approach: ${value}`,
        onRemove: () => {
          const next = cloneStringSet(chips.approach);
          next.delete(value);
          setChips({ ...chips, approach: next });
        }
      });
    });
    chips.stage.forEach(value => {
      items.push({
        key: `stage:${value}`,
        label: `Stage: ${value}`,
        onRemove: () => {
          const next = cloneStringSet(chips.stage);
          next.delete(value);
          setChips({ ...chips, stage: next });
        }
      });
    });
    if (chips.pilot) {
      items.push({ key: 'pilot', label: 'Has active pilot', onRemove: () => setChips({ ...chips, pilot: false }) });
    }
    if (chips.under50) {
      items.push({ key: 'under50', label: 'Funding < $50M', onRemove: () => setChips({ ...chips, under50: false }) });
    }
    return items;
  }, [chips, query]);

  return (
    <div className={styles.main}>
      <div className={styles.cardList}>
        <div className={styles.cardListItem}>
          <div className={styles.cardListHeader}>
            <div className={styles.search}>
              <Search size={16} color={COLORS.slate} />
              <input
                className={styles.searchInput}
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder={`Search company, approach, country, concept${ELLIPSIS}`}
              />
            </div>
            <div className={styles.actionBar}>
              {hasActiveFilters && (
                <button type="button" className={styles.secondaryButton} onClick={clearFilters}>
                  Clear
                </button>
              )}
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => setShowFilters(!showFilters)}
                aria-expanded={showFilters}
              >
                <Filter size={14} /> Filters
              </button>
            </div>
          </div>
          <div className={styles.subtleText}>
            Showing {results.length} of {companies.length} orgs {hasActiveFilters ? `(filters applied)` : null}
          </div>
          {appliedFilters.length > 0 && (
            <div className={styles.chipRow} style={{ marginTop: 8 }} aria-label="Active filters">
              {appliedFilters.map(filter => (
                <button
                  key={filter.key}
                  type="button"
                  className={`${styles.chip} ${styles.chipApplied}`}
                  onClick={filter.onRemove}
                  aria-label={`Remove filter: ${filter.label}`}
                  title="Remove filter"
                >
                  {filter.label} <span aria-hidden="true">{TIMES}</span>
                </button>
              ))}
            </div>
          )}
          <div className={styles.chipRow}>
            {approaches.map(approach => (
              <Chip
                key={approach}
                active={chips.approach.has(approach)}
                onClick={() => {
                  const next = cloneStringSet(chips.approach);
                  if (next.has(approach)) {
                    next.delete(approach);
                  } else {
                    next.add(approach);
                  }
                  setChips({ ...chips, approach: next });
                }}
              >
                {approach}
              </Chip>
            ))}
            <Chip
              active={chips.pilot}
              onClick={() => setChips({ ...chips, pilot: !chips.pilot })}
            >
              Has active pilot
            </Chip>
            <Chip
              active={chips.under50}
              onClick={() => setChips({ ...chips, under50: !chips.under50 })}
            >
              Funding &lt; $50M
            </Chip>
          </div>
          {showFilters && (
            <div
              ref={filtersPanelRef}
              className={styles.filterPanel}
              onKeyDown={event => {
                if (event.key === 'Escape') {
                  setShowFilters(false);
                }
              }}
            >
              <div className={styles.filterGroup}>
                <div className={styles.filterGroupTitle}>Stage</div>
                {stages.map(stage => (
                  <label key={stage} className={styles.filterOption}>
                    <input
                      type="checkbox"
                      checked={chips.stage.has(stage)}
                      onChange={() => {
                        const next = cloneStringSet(chips.stage);
                        if (next.has(stage)) {
                          next.delete(stage);
                        } else {
                          next.add(stage);
                        }
                        setChips({ ...chips, stage: next });
                      }}
                    />
                    {stage}
                  </label>
                ))}
              </div>
              <div className={styles.filterGroup}>
                <div className={styles.filterGroupTitle}>Quick filters</div>
                <label className={styles.filterOption}>
                  <input
                    type="checkbox"
                    checked={chips.pilot}
                    onChange={() => setChips({ ...chips, pilot: !chips.pilot })}
                  />
                  Has active pilot
                </label>
                <label className={styles.filterOption}>
                  <input
                    type="checkbox"
                    checked={chips.under50}
                    onChange={() => setChips({ ...chips, under50: !chips.under50 })}
                  />
                  Funding &lt; $50M
                </label>
              </div>
            </div>
          )}
        </div>

        <div className={styles.cardsGrid}>
          {results.map(company => (
            <div key={company.id} className={styles.cardListItem}>
              <div className={styles.cardListHeader}>
                <div className={styles.companyHeading}>
                  <div className={styles.companyLogoSmall}>
                    {company.logoUrl ? (
                      <img src={company.logoUrl} alt={`${company.name} logo`} />
                    ) : (
                      <span>{getInitials(company.name)}</span>
                    )}
                  </div>
                  <div>
                    <div className={styles.cardTitle}>{company.name}</div>
                    <div className={styles.subtleText}>
                      {company.approach} {MIDDOT} {company.country}
                    </div>
                  </div>
                </div>
                <div className={styles.cardActions}>
                  <Badge color={COLORS.brand}>{company.stage}</Badge>
                  <Badge color={COLORS.slate}>{`Fresh ${company.freshnessDays}d`}</Badge>
                </div>
              </div>
              <p className={`${styles.subtleText} ${styles.lineClamp3}`}>
                {company.description}
              </p>
              <div className={styles.cardListFooter}>
                <span className={styles.subtleText}>
                  <DollarSign size={14} color={COLORS.slate} /> {formatMoney(company.totalFunding)} total
                </span>
                <div className={styles.actionBar}>
                  <a
                    className={styles.primaryButton}
                    href={getLink('company', company.id)}
                    onClick={event => {
                      event.preventDefault();
                      onNavigate('company', company.id);
                    }}
                  >
                    Open 360 <ArrowUpRight size={14} style={{ marginLeft: 4 }} />
                  </a>
                  <a
                    className={styles.secondaryButton}
                    href={getLink('company', company.id)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    New tab
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

type CuratorPanelState =
  | { type: 'project' | 'collab' | 'interaction' | 'claim' | 'image'; orgId: string }
  | { type: 'evidence'; orgId: string; claimId: string };

interface Company360PageProps {
  company: Company;
  onNavigate: (view: ViewHash, orgId?: string) => void;
  getLink: (view: ViewHash, orgId?: string) => string;
  onOpenBrief: (company: Company, openInNewTab?: boolean) => void;
  openCuratorPanel: (panel: CuratorPanelState) => void;
  mode: 'read' | 'curator';
}

const Company360Page: React.FC<Company360PageProps> = ({ company, onNavigate, getLink, onOpenBrief, openCuratorPanel, mode }) => {
  const scrollToSection = React.useCallback((id: string) => {
    const node = document.getElementById(id);
    node?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const [filters, setFilters] = React.useState<Record<TimelineType, boolean>>({
    funding: true,
    project: true,
    interaction: true,
    publication: true,
    patent: true,
    news: true,
    claim: true
  });

  const timeline = React.useMemo(
    () => buildTimeline(company).filter(event => filters[event.type]),
    [company, filters]
  );

  const pilotCount = company.projects.filter(project => project.type.toLowerCase() === 'pilot').length;
  const operatingProjects = company.projects.filter(project => project.status.toLowerCase() === 'operating');

  const keyMetrics = [
    { label: 'Stage', value: company.stage },
    { label: 'Total funding', value: formatMoney(company.totalFunding) },
    { label: 'Active pilots', value: pilotCount },
    { label: 'Freshness', value: `${company.freshnessDays} days` }
  ];

  return (
    <div className={styles.main}>
      <div id="dac-company-top" />
      <div className={styles.cardListItem}>
        <div className={styles.cardListHeader}>
          <div className={styles.companyHeading}>
            <div className={styles.companyLogo}>
              {company.logoUrl ? (
                <img src={company.logoUrl} alt={`${company.name} logo`} />
              ) : (
                <span>{getInitials(company.name)}</span>
              )}
            </div>
            <div>
              <div className={styles.cardTitle} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {company.name}
                <a href={company.website} target="_blank" rel="noreferrer" className={styles.subtleText}>
                  <ExternalLink size={12} /> website
                </a>
              </div>
              <div className={styles.subtleText}>
                {company.approach} {MIDDOT} {company.country} {MIDDOT} Founded {company.founded}
              </div>
            </div>
          </div>
          <div className={styles.cardActions}>
            <Badge color={COLORS.brand}>{company.stage}</Badge>
            <Badge color={COLORS.slate}>Fresh {company.freshnessDays}d</Badge>
            <Badge color={COLORS.green}>{formatMoney(company.totalFunding)} raised</Badge>
          </div>
        </div>
        <p className={`${styles.subtleText}`} style={{ marginTop: 12 }}>
          {company.description}
        </p>
        <div className={styles.jumpNav} aria-label="Jump to sections">
          <button type="button" className={styles.jumpButton} onClick={() => scrollToSection('dac-company-projects')}>Projects</button>
          <button type="button" className={styles.jumpButton} onClick={() => scrollToSection('dac-company-claims')}>Claims</button>
          <button type="button" className={styles.jumpButton} onClick={() => scrollToSection('dac-company-evidence')}>Evidence</button>
          <button type="button" className={styles.jumpButton} onClick={() => scrollToSection('dac-company-timeline')}>Timeline</button>
          {company.overviewImages?.length ? (
            <button type="button" className={styles.jumpButton} onClick={() => scrollToSection('dac-company-imagery')}>Imagery</button>
          ) : null}
          <button type="button" className={styles.jumpButton} onClick={() => scrollToSection('dac-company-top')}>Top</button>
        </div>
        <div className={styles.actionBar} style={{ marginTop: 12 }}>
          <button type="button" className={styles.primaryButton} onClick={() => onOpenBrief(company, false)}>
            View brief
          </button>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => onNavigate('map', company.id)}
          >
            Locate on map
          </button>
          <a className={styles.secondaryButton} href={getLink('brief', company.id)} target="_blank" rel="noreferrer">
            Brief in new tab
          </a>
        </div>
      </div>

      <div className={styles.gridTwo}>
        <Card title="Key metrics">
          <div className={styles.metricList}>
            {keyMetrics.map(metric => (
              <div key={metric.label} className={styles.metricRow}>
                <span className={styles.metricLabel}>{metric.label}</span>
                <span className={styles.metricValue}>{metric.value}</span>
              </div>
            ))}
          </div>
        </Card>
        <div id="dac-company-projects" />
        <Card
          title="Projects & pilots"
          actions={mode === 'curator' ? <button className={styles.secondaryButton} type="button" onClick={() => openCuratorPanel({ type: 'project', orgId: company.id })}>Add project</button> : undefined}
        >
          <ul className={styles.listSimple}>
            {company.projects.map(project => (
              <li key={`${project.name}-${project.startDate}`}>
                <strong>{project.name}</strong> {ENDASH} {project.type} in {project.location} ({project.status})
              </li>
            ))}
            {company.projects.length === 0 && <li>No projects captured yet.</li>}
          </ul>
          {operatingProjects.length > 0 && (
            <div className={styles.subtleText} style={{ marginTop: 8 }}>
              {operatingProjects.length} operating {MIDDOT} {pilotCount} pilot(s)
            </div>
          )}
        </Card>
      </div>

      <div id="dac-company-imagery" />
      <Card
        title="Overview imagery"
        actions={mode === 'curator' ? (
          <button
            className={styles.secondaryButton}
            type="button"
            onClick={() => openCuratorPanel({ type: 'image', orgId: company.id })}
          >
            Add image
          </button>
        ) : undefined}
      >
        {company.overviewImages?.length ? (
          <div className={styles.imageGrid}>
            {company.overviewImages.map((media, index) => (
              <figure key={`${company.id}-image-${index}`} className={styles.imageCard}>
                <div className={styles.imageFrame}>
                  <img src={media.src} alt={media.caption ?? `${company.name} overview ${index + 1}`} />
                </div>
                {media.caption && <figcaption className={styles.imageCaption}>{media.caption}</figcaption>}
              </figure>
            ))}
          </div>
        ) : (
          <div className={styles.subtleText}>No imagery captured yet.</div>
        )}
      </Card>

      <div className={styles.gridTwo}>
        <Card
          title="Collaborations & partners"
          actions={mode === 'curator' ? <button className={styles.secondaryButton} type="button" onClick={() => openCuratorPanel({ type: 'collab', orgId: company.id })}>Add collaboration</button> : undefined}
        >
          <ul className={styles.listSimple}>
            {company.collaborations.map(collaboration => (
              <li key={`${collaboration.with}-${collaboration.startDate}`}>
                <strong>{collaboration.with}</strong> {MIDDOT} {collaboration.kind} {MIDDOT} since {new Date(collaboration.startDate).getFullYear()}
              </li>
            ))}
            {company.collaborations.length === 0 && <li>No collaborations captured.</li>}
          </ul>
        </Card>
        <Card
          title="Interactions & notes"
          actions={mode === 'curator' ? <button className={styles.secondaryButton} type="button" onClick={() => openCuratorPanel({ type: 'interaction', orgId: company.id })}>Add interaction</button> : undefined}
        >
          <ul className={styles.listSimple}>
            {company.interactions.map(interaction => (
              <li key={`${interaction.date}-${interaction.type}`}>
                {new Date(interaction.date).toLocaleDateString()} {MIDDOT} {capitalize(interaction.type)} {MIDDOT} {interaction.summary}
              </li>
            ))}
            {company.interactions.length === 0 && <li>No interactions recorded yet.</li>}
          </ul>
        </Card>
      </div>

      <div id="dac-company-claims" />
      <Card
        title="Claims & risk signals"
        actions={
          <div className={styles.actionBar}>
            <span className={styles.subtleText}>RAG + confidence</span>
            {mode === 'curator' && (
              <button className={styles.secondaryButton} type="button" onClick={() => openCuratorPanel({ type: 'claim', orgId: company.id })}>Add claim</button>
            )}
          </div>
        }
      >
        <div className={styles.cardList}>
          {company.claims.map(claim => (
            <div key={claim.id} className={styles.cardListItem}>
              <div className={styles.cardListHeader}>
                <div className={styles.cardTitle} style={{ fontSize: 14 }}>
                  {claim.text}
                </div>
                <Badge color={ragColor(claim.trust)}>{claim.trust}</Badge>
              </div>
              <div className={styles.subtleText}>
                {claim.metricType} {MIDDOT} {claim.min}{ENDASH}{claim.max} {claim.unit} (ML {claim.ml})
              </div>
              <div className={styles.subtleText} style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <ShieldCheck size={14} color={COLORS.slate} />
                Trust {claim.trustScore}/100
                {claim.evidence.length > 0 && <span aria-hidden="true">{MIDDOT}</span>}
                {claim.evidence.map((evidence, index) => (
                  <a key={`${claim.id}-evidence-${index}`} href={evidence.url} className={styles.secondaryButton} target="_blank" rel="noreferrer">
                    <ExternalLink size={12} /> {capitalize(evidence.type)}
                  </a>
                ))}
              </div>
              {mode === 'curator' && (
                <button className={styles.secondaryButton} type="button" onClick={() => openCuratorPanel({ type: 'evidence', orgId: company.id, claimId: claim.id })}>
                  Add evidence
                </button>
              )}
            </div>
          ))}
          {company.claims.length === 0 && (
            <div className={styles.subtleText}>No claims captured for this organization yet.</div>
          )}
        </div>
      </Card>

      <div className={styles.gridTwo}>
        <div id="dac-company-evidence" />
        <Card title="Evidence library">
          <ul className={styles.listSimple}>
            {company.publications.map(publication => (
              <li key={publication.title}>
                <a href={publication.link} target="_blank" rel="noreferrer">
                  <BookOpen size={12} style={{ marginRight: 6 }} />
                  {publication.title} ({new Date(publication.date).toLocaleDateString()})
                </a>
              </li>
            ))}
            {company.patents.map(patent => (
              <li key={patent.title}>
                <a href={patent.link} target="_blank" rel="noreferrer">
                  <ClipboardList size={12} style={{ marginRight: 6 }} />
                  {patent.title} ({new Date(patent.date).toLocaleDateString()})
                </a>
              </li>
            ))}
            {company.news.map(news => (
              <li key={news.title}>
                <a href={news.link} target="_blank" rel="noreferrer">
                  <Newspaper size={12} style={{ marginRight: 6 }} />
                  {news.title} ({new Date(news.date).toLocaleDateString()})
                </a>
              </li>
            ))}
            {company.publications.length + company.patents.length + company.news.length === 0 && (
              <li>No supporting documents captured.</li>
            )}
          </ul>
        </Card>
        <div id="dac-company-timeline" />
        <Card
          title="Timeline recap"
          actions={
            <div className={styles.chipRow}>
              {(Object.keys(filters) as TimelineType[]).map(key => (
                <Chip
                  key={key}
                  active={filters[key]}
                  onClick={() => setFilters({ ...filters, [key]: !filters[key] })}
                >
                  {capitalize(key)}
                </Chip>
              ))}
            </div>
          }
        >
      <div className={styles.timeline}>
        <div className={styles.timelineRail} />
        <div className={styles.cardList}>
          {timeline.map((event, index) => (
            <div key={`${event.label}-${index}`} className={styles.timelineItem}>
                  <div className={styles.timelineIcon}>
                    <event.icon size={14} />
                  </div>
                  <div className={styles.timelineCard}>
                    <div className={styles.timelineMeta}>
                      {new Date(event.date).toLocaleDateString()} {MIDDOT} {capitalize(event.type)}
                    </div>
                    <div className={styles.timelineLabel}>{event.label}</div>
                  </div>
                </div>
              ))}
              {timeline.length === 0 && (
                <div className={styles.subtleText} style={{ marginLeft: 12 }}>No recent activity logged.</div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Curator forms
const SCRIPT_URL_PREFIX = 'javascript' + String.fromCharCode(58);

const isSafeRelativeUrl = (value: string): boolean => {
  const trimmed = value.trim();
  if (!trimmed) {
    return false;
  }
  if (trimmed.charAt(0) !== '/') {
    return false;
  }
  if (trimmed.length > 1 && trimmed.charAt(1) === '/') {
    return false;
  }
  return true;
};

const isSafeHttpUrl = (value: string): boolean => {
  const trimmed = value.trim();
  try {
    const url = new URL(trimmed);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
};

const isSafeEvidenceUrl = (value: string): boolean => isSafeRelativeUrl(value) || isSafeHttpUrl(value);

const isSafeImageSrc = (value: string): boolean => {
  const trimmed = value.trim();
  if (!trimmed) {
    return false;
  }
  const lower = trimmed.toLowerCase();
  if (lower.slice(0, SCRIPT_URL_PREFIX.length) === SCRIPT_URL_PREFIX) {
    return false;
  }
  return (
    lower.indexOf('data:image/') === 0 ||
    lower.indexOf('blob:') === 0 ||
    isSafeRelativeUrl(trimmed) ||
    isSafeHttpUrl(trimmed)
  );
};

const isValidSlug = (value: string): boolean => /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(value);

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <label className={styles.filterOption}>
    <span style={{ minWidth: 110 }}>{label}</span>
    {children}
  </label>
);

interface ProjectFormState {
  name: string;
  type: string;
  location: string;
  status: string;
  startDate: string;
  capacity: string;
  partners: string;
}

interface ProjectFormSubmission {
  name: string;
  type: string;
  location: string;
  status: string;
  startDate: string;
  capacity?: number;
  partners: string[];
}

const CuratorProjectForm: React.FC<{ onSubmit: (p: ProjectFormSubmission) => Promise<void> | void; onCancel: () => void; submitting?: boolean }> = ({ onSubmit, onCancel, submitting }) => {
  const initial: ProjectFormState = { name: '', type: 'Pilot', location: '', status: 'Planned', startDate: new Date().toISOString().slice(0, 10), capacity: '', partners: '' };
  const [p, setP] = React.useState<ProjectFormState>(initial);
  return (
    <form
      onSubmit={async e => {
        e.preventDefault();
        try {
          await onSubmit({ ...p, capacity: p.capacity ? Number(p.capacity) : undefined, partners: p.partners ? p.partners.split(',').map((s: string) => s.trim()).filter(Boolean) : [] });
          setP(initial);
        } catch {
          // parent handles error state
        }
      }}
      className={styles.filterGroup}
    >
      <Field label="Name"><input autoFocus required value={p.name} onChange={e => setP({ ...p, name: e.target.value })} /></Field>
      <Field label="Type"><input value={p.type} onChange={e => setP({ ...p, type: e.target.value })} /></Field>
      <Field label="Location"><input value={p.location} onChange={e => setP({ ...p, location: e.target.value })} /></Field>
      <Field label="Status"><input value={p.status} onChange={e => setP({ ...p, status: e.target.value })} /></Field>
      <Field label="Start date"><input type="date" value={p.startDate} onChange={e => setP({ ...p, startDate: e.target.value })} /></Field>
      <Field label="Capacity"><input value={p.capacity} onChange={e => setP({ ...p, capacity: e.target.value })} placeholder="tCO2/yr" inputMode="numeric" /></Field>
      <Field label="Partners"><input value={p.partners} onChange={e => setP({ ...p, partners: e.target.value })} placeholder="Comma-separated" /></Field>
      <div className={styles.actionBar}>
        <button className={styles.primaryButton} type="submit" disabled={submitting}>{submitting ? `Saving${ELLIPSIS}` : 'Add project'}</button>
        <button className={styles.secondaryButton} type="button" onClick={() => { setP(initial); onCancel(); }}>Cancel</button>
      </div>
    </form>
  );
};

interface CollaborationFormState {
  with: string;
  kind: string;
  startDate: string;
}

const CuratorCollabForm: React.FC<{ onSubmit: (c: CollaborationFormState) => Promise<void> | void; onCancel: () => void; submitting?: boolean }> = ({ onSubmit, onCancel, submitting }) => {
  const initial: CollaborationFormState = { with: '', kind: 'Partner', startDate: new Date().toISOString().slice(0, 10) };
  const [c, setC] = React.useState<CollaborationFormState>(initial);
  return (
    <form
      onSubmit={async e => {
        e.preventDefault();
        try {
          await onSubmit(c);
          setC(initial);
        } catch {
          // parent handles error state
        }
      }}
      className={styles.filterGroup}
    >
      <Field label="With"><input autoFocus required value={c.with} onChange={e => setC({ ...c, with: e.target.value })} /></Field>
      <Field label="Kind"><input value={c.kind} onChange={e => setC({ ...c, kind: e.target.value })} /></Field>
      <Field label="Since"><input type="date" value={c.startDate} onChange={e => setC({ ...c, startDate: e.target.value })} /></Field>
      <div className={styles.actionBar}>
        <button className={styles.primaryButton} type="submit" disabled={submitting}>{submitting ? `Saving${ELLIPSIS}` : 'Add collaboration'}</button>
        <button className={styles.secondaryButton} type="button" onClick={() => { setC(initial); onCancel(); }}>Cancel</button>
      </div>
    </form>
  );
};

interface InteractionFormState {
  date: string;
  type: string;
  attendees: string;
  summary: string;
}

interface InteractionFormSubmission {
  date: string;
  type: string;
  attendees: string[];
  summary: string;
}

const CuratorInteractionForm: React.FC<{ onSubmit: (i: InteractionFormSubmission) => Promise<void> | void; onCancel: () => void; submitting?: boolean }> = ({ onSubmit, onCancel, submitting }) => {
  const initial: InteractionFormState = { date: new Date().toISOString().slice(0, 10), type: 'Meeting', attendees: '', summary: '' };
  const [i, setI] = React.useState<InteractionFormState>(initial);
  return (
    <form
      onSubmit={async e => {
        e.preventDefault();
        try {
          await onSubmit({ ...i, attendees: (i.attendees || '').split(',').map((s: string) => s.trim()).filter(Boolean) });
          setI(initial);
        } catch {
          // parent handles error state
        }
      }}
      className={styles.filterGroup}
    >
      <Field label="Date"><input type="date" value={i.date} onChange={e => setI({ ...i, date: e.target.value })} /></Field>
      <Field label="Type"><input value={i.type} onChange={e => setI({ ...i, type: e.target.value })} /></Field>
      <Field label="Attendees"><input value={i.attendees} onChange={e => setI({ ...i, attendees: e.target.value })} placeholder="Comma-separated" /></Field>
      <Field label="Summary"><input autoFocus value={i.summary} onChange={e => setI({ ...i, summary: e.target.value })} /></Field>
      <div className={styles.actionBar}>
        <button className={styles.primaryButton} type="submit" disabled={submitting}>{submitting ? `Saving${ELLIPSIS}` : 'Add interaction'}</button>
        <button className={styles.secondaryButton} type="button" onClick={() => { setI(initial); onCancel(); }}>Cancel</button>
      </div>
    </form>
  );
};

interface ClaimFormState {
  text: string;
  metricType: string;
  unit: string;
  trust: TrustLevel;
  trustScore: number;
  min: string;
  ml: string;
  max: string;
}

interface ClaimFormSubmission {
  text: string;
  metricType: string;
  unit: string;
  trust: TrustLevel;
  trustScore: number;
  min?: number;
  ml?: number;
  max?: number;
}

const CuratorClaimForm: React.FC<{ onSubmit: (cl: ClaimFormSubmission) => Promise<void> | void; onCancel: () => void; submitting?: boolean }> = ({ onSubmit, onCancel, submitting }) => {
  const initial: ClaimFormState = { text: '', metricType: '', unit: '', trust: 'Amber', trustScore: 60, min: '', ml: '', max: '' };
  const [c, setC] = React.useState<ClaimFormState>(initial);
  return (
    <form
      onSubmit={async e => {
        e.preventDefault();
        try {
          await onSubmit({ ...c, min: c.min ? Number(c.min) : undefined, ml: c.ml ? Number(c.ml) : undefined, max: c.max ? Number(c.max) : undefined });
          setC(initial);
        } catch {
          // parent handles error state
        }
      }}
      className={styles.filterGroup}
    >
      <Field label="Text"><input autoFocus required value={c.text} onChange={e => setC({ ...c, text: e.target.value })} /></Field>
      <Field label="Metric"><input value={c.metricType} onChange={e => setC({ ...c, metricType: e.target.value })} /></Field>
      <Field label="Unit"><input value={c.unit} onChange={e => setC({ ...c, unit: e.target.value })} /></Field>
      <Field label="Min"><input value={c.min} onChange={e => setC({ ...c, min: e.target.value })} /></Field>
      <Field label="ML"><input value={c.ml} onChange={e => setC({ ...c, ml: e.target.value })} /></Field>
      <Field label="Max"><input value={c.max} onChange={e => setC({ ...c, max: e.target.value })} /></Field>
      <Field label="Trust">
        <select value={c.trust} onChange={e => setC({ ...c, trust: e.target.value as TrustLevel })}>
          <option value="Green">Green</option>
          <option value="Amber">Amber</option>
          <option value="Red">Red</option>
        </select>
      </Field>
      <Field label="Score"><input type="number" min={0} max={100} value={c.trustScore} onChange={e => setC({ ...c, trustScore: Number(e.target.value) })} /></Field>
      <div className={styles.actionBar}>
        <button className={styles.primaryButton} type="submit" disabled={submitting}>{submitting ? `Saving${ELLIPSIS}` : 'Add claim'}</button>
        <button className={styles.secondaryButton} type="button" onClick={() => { setC(initial); onCancel(); }}>Cancel</button>
      </div>
    </form>
  );
};

interface EvidenceFormState {
  type: string;
  title: string;
  url: string;
  date: string;
}

const CuratorEvidenceForm: React.FC<{ onSubmit: (ev: EvidenceFormState) => Promise<void> | void; onCancel: () => void; submitting?: boolean }> = ({ onSubmit, onCancel, submitting }) => {
  const initial: EvidenceFormState = { type: 'Publication', title: '', url: '', date: new Date().toISOString().slice(0, 10) };
  const [evi, setEvi] = React.useState<EvidenceFormState>(initial);

  const urlError = React.useMemo(() => {
    const value = evi.url.trim();
    if (!value) {
      return 'URL is required.';
    }
    if (!isSafeEvidenceUrl(value)) {
      return 'Use an https:// URL or a SharePoint-relative path (starting with /).';
    }
    return undefined;
  }, [evi.url]);
  return (
    <form
      onSubmit={async e => {
        e.preventDefault();
        if (urlError) {
          return;
        }
        try {
          await onSubmit(evi);
          setEvi(initial);
        } catch {
          // parent handles error state
        }
      }}
      className={styles.filterGroup}
    >
      <div className={styles.formHint}>Evidence links open in a new tab.</div>
      <Field label="Type">
        <select value={evi.type} onChange={e => setEvi({ ...evi, type: e.target.value })}>
          <option value="Publication">Publication</option>
          <option value="Patent">Patent</option>
          <option value="News">News</option>
        </select>
      </Field>
      <Field label="Title"><input autoFocus required value={evi.title} onChange={e => setEvi({ ...evi, title: e.target.value })} /></Field>
      <Field label="URL"><input required type="url" value={evi.url} onChange={e => setEvi({ ...evi, url: e.target.value })} placeholder="https://..." /></Field>
      {urlError && <div className={styles.formError}>{urlError}</div>}
      <Field label="Date"><input type="date" value={evi.date} onChange={e => setEvi({ ...evi, date: e.target.value })} /></Field>
      <div className={styles.actionBar}>
        <button className={styles.primaryButton} type="submit" disabled={submitting || Boolean(urlError)}>
          {submitting ? `Saving${ELLIPSIS}` : 'Add evidence'}
        </button>
        <button className={styles.secondaryButton} type="button" onClick={() => { setEvi(initial); onCancel(); }}>Cancel</button>
      </div>
    </form>
  );
};

interface ImageFormState {
  src: string;
  caption: string;
}

interface ImageFormSubmission {
  src: string;
  caption?: string;
}

const CuratorImageForm: React.FC<{ onSubmit: (img: ImageFormSubmission) => Promise<void> | void; onCancel: () => void; submitting?: boolean }> = ({ onSubmit, onCancel, submitting }) => {
  const initial: ImageFormState = { src: '', caption: '' };
  const [img, setImg] = React.useState<ImageFormState>(initial);

  const srcError = React.useMemo(() => {
    const value = img.src.trim();
    if (!value) {
      return 'Image source is required.';
    }
    if (!isSafeImageSrc(value)) {
      return 'Use a data:image/... URI, an https:// URL, or a SharePoint-relative path (starting with /).';
    }
    return undefined;
  }, [img.src]);
  return (
    <form
      onSubmit={async e => {
        e.preventDefault();
        if (srcError) {
          return;
        }
        try {
          await onSubmit({ src: img.src.trim(), caption: img.caption?.trim() || undefined });
          setImg(initial);
        } catch {
          // parent handles error state
        }
      }}
      className={styles.filterGroup}
    >
      <div className={styles.formHint}>For offline-safe mock mode, prefer `data:image/svg+xml,...`.</div>
      <Field label="Image source"><input autoFocus required value={img.src} onChange={e => setImg({ ...img, src: e.target.value })} placeholder="data:image/svg+xml,..." /></Field>
      {srcError && <div className={styles.formError}>{srcError}</div>}
      <Field label="Caption"><input value={img.caption} onChange={e => setImg({ ...img, caption: e.target.value })} placeholder="Optional" /></Field>
      <div className={styles.actionBar}>
        <button className={styles.primaryButton} type="submit" disabled={submitting || Boolean(srcError)}>
          {submitting ? `Saving${ELLIPSIS}` : 'Add image'}
        </button>
        <button className={styles.secondaryButton} type="button" onClick={() => { setImg(initial); onCancel(); }}>Cancel</button>
      </div>
    </form>
  );
};

interface OrgFormState {
  name: string;
  slug: string;
  approach: string;
  stage: string;
  country: string;
  website: string;
  founded: string;
  description: string;
}

interface OrgFormSubmission {
  name: string;
  slug: string;
  approach: string;
  stage: string;
  country: string;
  website?: string;
  founded?: number;
  description: string;
}

const CuratorOrgForm: React.FC<{ onSubmit: (org: OrgFormSubmission) => void; onCancel: () => void; error?: string }> = ({ onSubmit, onCancel, error }) => {
  const initial: OrgFormState = {
    name: '',
    slug: '',
    approach: '',
    stage: '',
    country: '',
    website: '',
    founded: new Date().getFullYear().toString(),
    description: ''
  };
  const [org, setOrg] = React.useState<OrgFormState>(initial);

  const slugError = React.useMemo(() => {
    const value = org.slug.trim();
    if (!value) {
      return undefined;
    }
    return isValidSlug(value) ? undefined : 'Slug must be lowercase letters, numbers, and hyphens.';
  }, [org.slug]);

  const websiteError = React.useMemo(() => {
    const value = org.website.trim();
    if (!value) {
      return undefined;
    }
    return isSafeHttpUrl(value) ? undefined : 'Website must be an http(s) URL.';
  }, [org.website]);

  const handleNameChange = (value: string): void => {
    setOrg(prev => ({
      ...prev,
      name: value,
      slug: prev.slug ? prev.slug : slugify(value)
    }));
  };

  return (
    <form
      onSubmit={e => {
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
          website: org.website.trim() ? org.website.trim() : undefined,
          founded: org.founded ? Number(org.founded) : undefined,
          description: org.description
        });
        setOrg(initial);
      }}
      className={styles.filterGroup}
    >
      {error && <div className={styles.subtleText} style={{ color: COLORS.red }}>{error}</div>}
      <Field label="Name"><input autoFocus required value={org.name} onChange={e => handleNameChange(e.target.value)} /></Field>
      <Field label="Slug"><input value={org.slug} onChange={e => setOrg({ ...org, slug: e.target.value })} placeholder="example-startup" /></Field>
      {slugError && <div className={styles.formError}>{slugError}</div>}
      <Field label="Approach"><input value={org.approach} onChange={e => setOrg({ ...org, approach: e.target.value })} /></Field>
      <Field label="Stage"><input value={org.stage} onChange={e => setOrg({ ...org, stage: e.target.value })} /></Field>
      <Field label="Country"><input value={org.country} onChange={e => setOrg({ ...org, country: e.target.value })} /></Field>
      <Field label="Website"><input value={org.website} onChange={e => setOrg({ ...org, website: e.target.value })} placeholder="https://..." /></Field>
      {websiteError && <div className={styles.formError}>{websiteError}</div>}
      <Field label="Founded"><input type="number" value={org.founded} onChange={e => setOrg({ ...org, founded: e.target.value })} /></Field>
      <Field label="Description"><input value={org.description} onChange={e => setOrg({ ...org, description: e.target.value })} /></Field>
      <div className={styles.actionBar}>
        <button className={styles.primaryButton} type="submit" disabled={Boolean(slugError) || Boolean(websiteError)}>Create startup</button>
        <button className={styles.secondaryButton} type="button" onClick={() => { setOrg(initial); onCancel(); }}>Cancel</button>
      </div>
    </form>
  );
};

interface FundingDealsPageProps {
  companies: Company[];
}

const FundingDealsPage: React.FC<FundingDealsPageProps> = ({ companies }) => {
  const timelineData = React.useMemo(() => {
    const rows: { company: string; date: string; amount: number }[] = [];
    companies.forEach(company => {
      company.fundingRounds.forEach(round => {
        rows.push({
          company: company.name,
          date: round.date,
          amount: round.amount / 1_000_000
        });
      });
    });
    rows.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return rows;
  }, [companies]);

  const totals = React.useMemo(
    () =>
      companies.map(company => ({
        name: company.name,
        total: (company.totalFunding ?? 0) / 1_000_000
      })),
    [companies]
  );

  return (
    <div className={styles.gridTwo}>
      <Card title="Funding timeline">
        <div className={styles.chartArea}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="fundingGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.brand} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={COLORS.brand} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis unit="M" />
              <Tooltip formatter={(value: number) => `${value}M`} />
              <Area
                dataKey="amount"
                stroke={COLORS.brand}
                fill="url(#fundingGradient)"
                name="Round size (USD M)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card title="Top funding (total)">
        <div className={styles.chartArea}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={totals}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis unit="M" />
              <Tooltip formatter={(value: number) => `${value}M`} />
              <Bar dataKey="total" name="Total (USD M)" fill={COLORS.brand} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

interface PublicationsPatentsPageProps {
  companies: Company[];
}

const PublicationsPatentsPage: React.FC<PublicationsPatentsPageProps> = ({ companies }) => {
  const rows = React.useMemo(() => {
    const items: Array<{ company: string; type: string; title: string; date: string; link: string }> = [];
    companies.forEach(company => {
      company.publications.forEach(item => {
        items.push({ company: company.name, type: 'Publication', title: item.title, date: item.date, link: item.link });
      });
      company.patents.forEach(item => {
        items.push({ company: company.name, type: 'Patent', title: item.title, date: item.date, link: item.link });
      });
    });
    items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return items;
  }, [companies]);

  return (
    <Card title="Publications & patents (recent)">
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Company</th>
            <th>Type</th>
            <th>Title</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={`${row.company}-${row.title}`} className={styles.tableRow}>
              <td className={styles.tableCell}>{new Date(row.date).toLocaleDateString()}</td>
              <td className={styles.tableCell} style={{ fontWeight: 500 }}>
                {row.company}
              </td>
              <td className={styles.tableCell}>
                <Badge color={row.type === 'Patent' ? COLORS.slate : COLORS.brand}>{row.type}</Badge>
              </td>
              <td className={styles.tableCell}>{row.title}</td>
              <td className={styles.tableCell}>
                <a href={row.link} className={styles.secondaryButton} target="_blank" rel="noreferrer">
                  <ExternalLink size={12} />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};

interface StalenessPageProps {
  companies: Company[];
}

const StalenessPage: React.FC<StalenessPageProps> = ({ companies }) => {
  const entities = React.useMemo(() => {
    const items: Array<{ kind: string; name: string; fresh: number; evidenceTypes: string[] }> = [];
    companies.forEach(company => {
      items.push({ kind: 'Org', name: company.name, fresh: company.freshnessDays, evidenceTypes: countEvidenceTypes(company) });
      company.projects.forEach(project => {
        items.push({
          kind: 'Project',
          name: `${company.name} ${ENDASH} ${project.name}`,
          fresh: daysSince(project.startDate),
          evidenceTypes: ['news']
        });
      });
    });
    return items;
  }, [companies]);

  const needsAttention = React.useMemo(() => {
    const scored = entities
      .map(entity => ({
        ...entity,
        score:
          (entity.fresh > 60 ? 2 : entity.fresh > 30 ? 1 : 0) +
          (entity.evidenceTypes.length < 2 ? 1 : 0)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    return scored;
  }, [entities]);

  return (
    <div className={styles.gridTwo}>
      <Card title={`Freshness ${TIMES} coverage heatmap (mock)`}>
        <div className={styles.cardList}>
          {entities.map(entity => (
            <div key={entity.name} className={styles.cardListItem}>
              <div className={styles.cardTitle} style={{ fontSize: 13 }}>
                {entity.name}
              </div>
              <div className={styles.subtleText}>
                Fresh {entity.fresh}d {MIDDOT} Evidence types {entity.evidenceTypes.length}
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Needs attention (top)">
        <div className={styles.cardList}>
          {needsAttention.map(entity => (
            <div key={entity.name} className={styles.needsItem}>
              <div>
                <div className={styles.cardTitle} style={{ fontSize: 14 }}>
                  {entity.name}
                </div>
                <div className={styles.needsMeta}>
                  {entity.kind} {MIDDOT} Fresh {entity.fresh}d {MIDDOT} Evidence {entity.evidenceTypes.length} types
                </div>
              </div>
              <button type="button" className={styles.primaryButton}>
                Assign
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

interface MapPageProps {
  companies: Company[];
  onNavigate: (view: ViewHash, orgId?: string) => void;
  getLink: (view: ViewHash, orgId?: string) => string;
}

const MapPage: React.FC<MapPageProps> = ({ companies, onNavigate, getLink }) => {
  type MapLayer = 'orgs' | 'projects' | 'pilots';
  const [layer, setLayer] = React.useState<MapLayer>('orgs');

  const legend: Record<MapLayer, { label: string; color: string }> = {
    orgs: { label: 'Headquarters', color: COLORS.brand },
    projects: { label: 'Projects', color: COLORS.green },
    pilots: { label: 'Pilots', color: COLORS.amber }
  };
  const legendItems = [legend.orgs, legend.projects, legend.pilots];

  const items = React.useMemo(() => {
    switch (layer) {
      case 'projects':
        {
          const projectItems: Array<{ id: string; title: string; subtitle: string; companyId: string }> = [];
          companies.forEach(company => {
            company.projects.forEach(project => {
              projectItems.push({
                id: `${company.id}-${project.name}`,
                title: project.name,
                subtitle: `${project.type} ${MIDDOT} ${project.location}`,
                companyId: company.id
              });
            });
          });
          return projectItems;
        }
      case 'pilots':
        {
          const pilotItems: Array<{ id: string; title: string; subtitle: string; companyId: string }> = [];
          companies.forEach(company => {
            company.projects.forEach(project => {
              if (project.type.toLowerCase().indexOf('pilot') !== -1) {
                pilotItems.push({
                  id: `${company.id}-${project.name}`,
                  title: project.name,
                  subtitle: `${company.name} ${MIDDOT} ${project.location} (${project.status})`,
                  companyId: company.id
                });
              }
            });
          });
          return pilotItems;
        }
      default:
        return companies.map(company => ({
          id: company.id,
          title: company.name,
          subtitle: `${company.approach} ${MIDDOT} ${company.country}`,
          companyId: company.id
        }));
    }
  }, [companies, layer]);

  const layerLabel = legend[layer].label.toLowerCase();

  return (
    <div className={styles.mapContainer}>
      <div className={styles.mapToolbar}>
        <div className={styles.chipRow}>
          <Chip active={layer === 'orgs'} onClick={() => setLayer('orgs')}>
            Organizations
          </Chip>
          <Chip active={layer === 'projects'} onClick={() => setLayer('projects')}>
            Projects
          </Chip>
          <Chip active={layer === 'pilots'} onClick={() => setLayer('pilots')}>
            Pilots
          </Chip>
        </div>
        <div className={styles.mapLegend}>
          {legendItems.map(item => (
            <span key={item.label} className={styles.mapLegendItem}>
              <span className={styles.mapLegendSwatch} style={{ background: item.color }} />
              {item.label}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.mapPlaceholder}>
        <div>
          <strong>Interactive map coming soon</strong>
          <div className={styles.subtleText} style={{ marginTop: 8 }}>
            Displaying {layerLabel}. Map tiles will render once SharePoint list data is wired in.
          </div>
        </div>
      </div>

      <Card title="Highlights">
        <div className={styles.cardList}>
          {items.slice(0, 8).map(item => (
            <div key={item.id} className={styles.cardListItem}>
              <div className={styles.cardListHeader}>
                <div>
                  <div className={styles.cardTitle} style={{ fontSize: 14 }}>
                    {item.title}
                  </div>
                  <div className={styles.subtleText}>{item.subtitle}</div>
                </div>
                <MapPin size={16} color={legend[layer].color} />
              </div>
              <div className={styles.cardListFooter}>
                <a
                  className={styles.secondaryButton}
                  href={getLink('company', item.companyId)}
                  onClick={event => {
                    event.preventDefault();
                    onNavigate('company', item.companyId);
                  }}
                >
                  Open 360
                </a>
                <a className={styles.secondaryButton} href={getLink('company', item.companyId)} target="_blank" rel="noreferrer">
                  New tab
                </a>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className={styles.subtleText}>No records available for the selected layer.</div>
          )}
        </div>
      </Card>
    </div>
  );
};

interface CompanyBriefProps {
  company: Company;
  onBack: () => void;
  getLink: (view: ViewHash, orgId?: string) => string;
}

const CompanyBrief: React.FC<CompanyBriefProps> = ({ company, onBack, getLink }) => {
  const timeline = React.useMemo(() => buildTimeline(company).slice(-6).reverse(), [company]);
  const evidenceRows = React.useMemo(
    () => [
      ...company.publications.map(item => ({ ...item, type: 'Publication' })),
      ...company.patents.map(item => ({ ...item, type: 'Patent' })),
      ...company.news.map(item => ({ ...item, type: 'News' }))
    ],
    [company]
  );
  const pilotCount = React.useMemo(
    () => company.projects.filter(project => project.type.toLowerCase() === 'pilot').length,
    [company.projects]
  );
  const initials = React.useMemo(() => getInitials(company.name), [company.name]);

  return (
    <div className={styles.briefPage}>
      <div className={styles.briefActions}>
        <button type="button" className={styles.secondaryButton} onClick={onBack}>
          <ArrowLeft size={16} /> Back to dashboard
        </button>
        <div className={styles.actionBar}>
          <a href={company.website} target="_blank" rel="noreferrer" className={styles.secondaryButton}>
            <ExternalLink size={14} /> Company site
          </a>
          <a href={getLink('company', company.id)} className={styles.secondaryButton}>
            <ArrowUpRight size={14} /> Open 360 view
          </a>
          <button type="button" className={styles.primaryButton} onClick={() => window.print()}>
            <Printer size={16} /> Print / save PDF
          </button>
        </div>
      </div>

      <div className={styles.briefContent}>
        <div className={styles.briefHeader}>
          <div style={{ display: 'flex', gap: 12 }}>
            <div className={styles.briefLogo}>
              {company.logoUrl ? (
                <img
                  src={company.logoUrl}
                  alt={`${company.name} logo`}
                  style={{ width: '100%', height: '100%', borderRadius: 16, objectFit: 'contain' }}
                />
              ) : (
                initials
              )}
            </div>
            <div>
              <h1 className={styles.briefTitle}>{company.name}</h1>
              <div className={styles.briefSubtle}>
                {company.approach} {MIDDOT} {company.country} {MIDDOT} Founded {company.founded}
              </div>
            </div>
          </div>
          <div className={styles.briefBlock}>
            <div className={styles.briefSectionTitle}>Updated</div>
            <div>{new Date().toLocaleDateString()}</div>
            <div className={styles.briefSubtle}>Freshness {company.freshnessDays} days</div>
          </div>
        </div>

        <section className={styles.briefSection}>
          <div className={styles.briefSectionTitle}>Executive summary</div>
          <p>{company.description}</p>
        </section>

        <section className={styles.briefSection}>
          <div className={styles.briefSectionTitle}>Key metrics</div>
          <div className={styles.briefGrid}>
            <div className={styles.briefBlock}>
              <div className={styles.briefSubtle}>Stage</div>
              <div>{company.stage}</div>
            </div>
            <div className={styles.briefBlock}>
              <div className={styles.briefSubtle}>Total funding</div>
              <div>{formatMoney(company.totalFunding)}</div>
            </div>
            <div className={styles.briefBlock}>
              <div className={styles.briefSubtle}>Projects</div>
              <div>
                {company.projects.length} active {MIDDOT} {pilotCount} pilot(s)
              </div>
            </div>
            <div className={styles.briefBlock}>
              <div className={styles.briefSubtle}>Collaborations</div>
              <div>{company.collaborations.length} named partners</div>
            </div>
          </div>
        </section>

        <section className={styles.briefSection}>
          <div className={styles.briefSectionTitle}>Projects & pilots</div>
          <ul className={styles.briefList}>
            {company.projects.map(project => (
              <li key={`${project.name}-${project.startDate}`}>
                <strong>{project.name}</strong> {ENDASH} {project.type} in {project.location} ({project.status})
              </li>
            ))}
            {company.projects.length === 0 && <li>No projects captured yet.</li>}
          </ul>
        </section>

        <section className={styles.briefSection}>
          <div className={styles.briefSectionTitle}>Collaborations & partners</div>
          <ul className={styles.briefList}>
            {company.collaborations.slice(0, 6).map(collaboration => (
              <li key={`${collaboration.with}-${collaboration.startDate}`}>
                <strong>{collaboration.with}</strong> {MIDDOT} {collaboration.kind} {MIDDOT} since {new Date(collaboration.startDate).getFullYear()}
              </li>
            ))}
            {company.collaborations.length === 0 && <li>No collaborations captured yet.</li>}
          </ul>
        </section>

        <section className={styles.briefSection}>
          <div className={styles.briefSectionTitle}>Interactions & notes</div>
          <ul className={styles.briefList}>
            {company.interactions.map(interaction => (
              <li key={`${interaction.date}-${interaction.type}`}>
                {new Date(interaction.date).toLocaleDateString()} {MIDDOT} {capitalize(interaction.type)} {MIDDOT} {interaction.summary}
              </li>
            ))}
            {company.interactions.length === 0 && <li>No interactions recorded yet.</li>}
          </ul>
        </section>

        <section className={styles.briefSection}>
          <div className={styles.briefSectionTitle}>Claims & confidence</div>
          <ul className={styles.briefList}>
            {company.claims.map(claim => (
              <li key={claim.id}>
                <strong>{claim.text}</strong> {MIDDOT} {claim.metricType} ({claim.unit}) {MIDDOT}{' '}
                <span style={{ color: ragColor(claim.trust) }}>{claim.trust}</span> trust {MIDDOT} score {claim.trustScore}/100
              </li>
            ))}
            {company.claims.length === 0 && <li>No claims captured.</li>}
          </ul>
        </section>

        <section className={styles.briefSection}>
          <div className={styles.briefSectionTitle}>Recent activity</div>
          <ul className={styles.briefList}>
            {timeline.map(event => (
              <li key={`${event.label}-${event.date}`}>
                {new Date(event.date).toLocaleDateString()} {MIDDOT} {capitalize(event.type)} {MIDDOT} {event.label}
              </li>
            ))}
            {timeline.length === 0 && <li>No recent updates tracked.</li>}
          </ul>
        </section>

        <section className={styles.briefSection}>
          <div className={styles.briefSectionTitle}>Evidence digest</div>
          <ul className={styles.briefList}>
            {evidenceRows.map(item => (
              <li key={`${item.type}-${item.title}`}>
                <strong>{item.type}</strong>: {item.title} ({new Date(item.date).toLocaleDateString()})
              </li>
            ))}
            {evidenceRows.length === 0 && <li>No supporting documents captured.</li>}
          </ul>
        </section>

        {company.overviewImages?.length ? (
          <section className={styles.briefSection}>
            <div className={styles.briefSectionTitle}>Overview imagery</div>
            <div className={styles.briefImageGrid}>
              {company.overviewImages.map((media, index) => (
                <figure key={`${company.id}-brief-image-${index}`} className={styles.briefImageCard}>
                  <div className={styles.briefImageFrame}>
                    <img src={media.src} alt={media.caption ?? `${company.name} figure ${index + 1}`} />
                  </div>
                  {media.caption && <figcaption className={styles.briefImageCaption}>{media.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
};

const MockDashboard: React.FC = () => {
  const [tab, setTab] = React.useState<TabId>('home');
  const [viewMode, setViewMode] = React.useState<'dashboard' | 'brief'>('dashboard');
  const [mode, setMode] = React.useState<'read' | 'curator'>('read');
  const [headerQuery, setHeaderQuery] = React.useState('');
  const [companies, setCompanies] = React.useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = React.useState<Company | null>(null);
  const selectedCompanyRef = React.useRef<Company | null>(null);
  const [feedItems, setFeedItems] = React.useState<FeedItem[]>([]);
  const [curatorPanel, setCuratorPanel] = React.useState<CuratorPanelState | null>(null);
  const [curatorPanelError, setCuratorPanelError] = React.useState<string | undefined>(undefined);
  const [curatorPanelSaving, setCuratorPanelSaving] = React.useState(false);
  const [orgPanelOpen, setOrgPanelOpen] = React.useState(false);
  const [orgPanelError, setOrgPanelError] = React.useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);
  const providerRef = React.useRef<IDataProvider>(new MockProvider());

  const backgroundStyle = React.useMemo(
    () =>
      ({
        '--bg-color': COLORS.bg
      }) as React.CSSProperties,
    []
  );

  React.useEffect(() => {
    selectedCompanyRef.current = selectedCompany ? cloneCompany(selectedCompany) : null;
  }, [selectedCompany]);

  React.useEffect(() => {
    let cancelled = false;
    const loadData = async (): Promise<void> => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const provider = providerRef.current;
        const orgs = await provider.searchEntities();
        const orgLookup = new Map(orgs.map(org => [org.id, org]));
        const results = await Promise.all(
          orgs.map(async org => {
            const [projects, claims, relations, documents] = await Promise.all([
              provider.getProjects(org.id),
              provider.getClaims(org.id),
              provider.getRelations(org.id),
              provider.getDocuments(org.id)
            ]);
            return {
              company: hydrateCompanyFromProvider(org, projects, claims, relations, documents, orgLookup),
              documents
            };
          })
        );
        if (cancelled) {
          return;
        }
        const hydratedCompanies = results.map(result => cloneCompany(result.company));
        const newsFeed: FeedItem[] = [];
        results.forEach(result => {
          result.documents.forEach(document => {
            newsFeed.push(toFeedItem(document));
          });
        });
        newsFeed.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setCompanies(hydratedCompanies);
        setFeedItems(newsFeed);
        if (hydratedCompanies.length > 0) {
          const initial = cloneCompany(hydratedCompanies[0]);
          setSelectedCompany(initial);
          selectedCompanyRef.current = initial;
        } else {
          setSelectedCompany(null);
          selectedCompanyRef.current = null;
        }
      } catch (error: unknown) {
        if (!cancelled) {
          setLoadError(getErrorMessage(error));
          setCompanies([]);
          setFeedItems([]);
          setSelectedCompany(null);
          selectedCompanyRef.current = null;
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };
    loadData().catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const baseUrl = React.useMemo(() => {
    if (typeof window === 'undefined') {
      return '';
    }
    const { origin, pathname, search } = window.location;
    return `${origin}${pathname}${search}`;
  }, []);

  const getLink = React.useCallback(
    (view: ViewHash, orgId?: string, extra?: Record<string, string | undefined>) => {
      const hash = buildHash(view, orgId, extra);
      return baseUrl ? `${baseUrl}#${hash}` : `#${hash}`;
    },
    [baseUrl]
  );

  const getLinkWithState = React.useCallback(
    (view: ViewHash, orgId?: string, extra?: Record<string, string | undefined>) =>
      getLink(view, orgId, { mode, q: headerQuery, ...extra }),
    [getLink, mode, headerQuery]
  );

  const applyCompanyUpdate = React.useCallback((orgId: string, updater: (company: Company) => Company) => {
    let updatedCompany: Company | null = null;
    setCompanies(prev => {
      let changed = false;
      const next = prev.map(company => {
        if (company.id !== orgId) {
          return company;
        }
        changed = true;
        const refreshed = updater(cloneCompany(company));
        updatedCompany = refreshed;
        return refreshed;
      });
      return changed ? next : prev;
    });
    if (updatedCompany) {
      const cloneSource = updatedCompany;
      setSelectedCompany(prev => {
        if (prev && prev.id === orgId) {
          const cloned = cloneCompany(cloneSource);
          selectedCompanyRef.current = cloned;
          return cloned;
        }
        return prev;
      });
    }
  }, []);

  const dismissCuratorPanel = React.useCallback(() => {
    setCuratorPanel(null);
    setCuratorPanelError(undefined);
    setCuratorPanelSaving(false);
  }, []);

  const openCuratorPanel = React.useCallback((panel: CuratorPanelState) => {
    if (mode !== 'curator') {
      return;
    }
    setCuratorPanelError(undefined);
    setCuratorPanelSaving(false);
    setCuratorPanel(panel);
  }, [mode]);

  const navigate = React.useCallback((view: ViewHash, orgId?: string, extra?: Record<string, string | undefined>) => {
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

  const handleAddStartup = React.useCallback(async (org: OrgFormSubmission): Promise<void> => {
    const id = (org.slug || slugify(org.name)).toLowerCase();
    if (!org.name) {
      setOrgPanelError('Name is required');
      return;
    }
    if (companies.some(company => company.id === id)) {
      setOrgPanelError('Organization already exists');
      return;
    }
    try {
      await providerRef.current.proposeWrite('dossier_text', { action: 'add_org', payload: { ...org, id } });
      const newCompany: Company = {
        id,
        name: org.name,
        website: org.website ?? '#',
        country: org.country ?? '',
        approach: org.approach ?? '',
        stage: org.stage ?? 'Not set',
        founded: org.founded ?? new Date().getFullYear(),
        totalFunding: 0,
        freshnessDays: 0,
        description: org.description ?? '',
        aliases: [],
        collaborations: [],
        fundingRounds: [],
        projects: [],
        interactions: [],
        claims: [],
        publications: [],
        patents: [],
        news: [],
        overviewImages: []
      };
      const hydrated = cloneCompany(newCompany);
      setCompanies(prev => [...prev, hydrated]);
      setSelectedCompany(hydrated);
      selectedCompanyRef.current = hydrated;
      setOrgPanelError(undefined);
      setOrgPanelOpen(false);
      setMode('curator');
      navigate('company', id, { mode: 'curator', q: headerQuery });
    } catch (error: unknown) {
      setOrgPanelError(getErrorMessage(error));
    }
  }, [companies, headerQuery, navigate]);

  const handleCuratorPanelSubmit = React.useCallback(
    async (payload: unknown): Promise<void> => {
      if (!curatorPanel) {
        return;
      }
      const panel = curatorPanel;
      setCuratorPanelSaving(true);
      setCuratorPanelError(undefined);
      try {
        switch (panel.type) {
          case 'project': {
            const projectPayload = payload as ProjectFormSubmission;
            await providerRef.current.proposeWrite('dossier_text', { action: 'project', orgId: panel.orgId, payload: projectPayload });
            applyCompanyUpdate(panel.orgId, company => ({
              ...company,
              projects: [
                ...company.projects,
                {
                  name: projectPayload.name,
                  type: projectPayload.type ?? 'Project',
                  location: projectPayload.location ?? '-',
                  status: projectPayload.status ?? 'Planned',
                  startDate: projectPayload.startDate ?? '',
                  capacity: projectPayload.capacity ?? 0,
                  partners: projectPayload.partners ?? []
                }
              ]
            }));
            break;
          }
          case 'collab': {
            const collabPayload = payload as CollaborationFormState;
            await providerRef.current.proposeWrite('relation', { orgId: panel.orgId, payload: collabPayload });
            applyCompanyUpdate(panel.orgId, company => ({
              ...company,
              collaborations: [
                ...company.collaborations,
                { with: collabPayload.with, kind: collabPayload.kind, startDate: collabPayload.startDate }
              ]
            }));
            break;
          }
          case 'interaction': {
            const interactionPayload = payload as InteractionFormSubmission;
            await providerRef.current.proposeWrite('dossier_text', { action: 'interaction', orgId: panel.orgId, payload: interactionPayload });
            applyCompanyUpdate(panel.orgId, company => ({
              ...company,
              interactions: [
                ...company.interactions,
                {
                  date: interactionPayload.date,
                  type: interactionPayload.type,
                  attendees: interactionPayload.attendees ?? [],
                  summary: interactionPayload.summary ?? ''
                }
              ]
            }));
            break;
          }
          case 'claim': {
            const claimPayload = payload as ClaimFormSubmission;
            await providerRef.current.proposeWrite('claim', { orgId: panel.orgId, payload: claimPayload });
            applyCompanyUpdate(panel.orgId, company => ({
              ...company,
              claims: [
                ...company.claims,
                {
                  id: `claim-${Date.now().toString(36)}`,
                  text: claimPayload.text,
                  metricType: claimPayload.metricType,
                  unit: claimPayload.unit,
                  min: claimPayload.min ?? 0,
                  ml: claimPayload.ml ?? 0,
                  max: claimPayload.max ?? 0,
                  trust: claimPayload.trust,
                  trustScore: claimPayload.trustScore ?? 60,
                  evidence: []
                }
              ]
            }));
            break;
          }
          case 'evidence': {
            const evidencePayload = payload as EvidenceFormState;
            await providerRef.current.proposeWrite('dossier_text', {
              action: 'evidence',
              orgId: panel.orgId,
              claimId: panel.claimId,
              payload: evidencePayload
            });
            applyCompanyUpdate(panel.orgId, company => ({
              ...company,
              claims: company.claims.map(claim =>
                claim.id === panel.claimId
                  ? {
                      ...claim,
                      evidence: [
                        ...claim.evidence,
                        { type: evidencePayload.type, title: evidencePayload.title, url: evidencePayload.url, date: evidencePayload.date }
                      ]
                    }
                  : claim
              )
            }));
            break;
          }
          case 'image': {
            const imagePayload = payload as ImageFormSubmission;
            await providerRef.current.proposeWrite('dossier_text', { action: 'image', orgId: panel.orgId, payload: imagePayload });
            applyCompanyUpdate(panel.orgId, company => ({
              ...company,
              overviewImages: [...(company.overviewImages ?? []), { src: imagePayload.src, caption: imagePayload.caption }]
            }));
            break;
          }
          default:
            throw new Error('Unsupported curator action');
        }
        dismissCuratorPanel();
      } catch (error: unknown) {
        setCuratorPanelError(getErrorMessage(error));
        throw error;
      } finally {
        setCuratorPanelSaving(false);
      }
    },
    [applyCompanyUpdate, curatorPanel, dismissCuratorPanel]
  );

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
    const applyRoute = (): void => {
      const { view, orgId, q, mode } = parseHash();
      if (companies.length === 0) {
        return;
      }
      const fallback = selectedCompanyRef.current ?? companies[0];
      const company = findCompanyById(companies, orgId) ?? fallback;

      if (view === 'brief') {
        setViewMode('brief');
        if (company && (!selectedCompanyRef.current || company.id !== selectedCompanyRef.current.id)) {
          setSelectedCompany(cloneCompany(company));
        }
      } else {
        setViewMode('dashboard');
        setTab(view);
        if (view === 'company' && company && (!selectedCompanyRef.current || company.id !== selectedCompanyRef.current.id)) {
          setSelectedCompany(cloneCompany(company));
        }
      }
      if (typeof q === 'string') setHeaderQuery(q);
      setMode(mode === 'curator' ? 'curator' : 'read');
    };

    applyRoute();
    window.addEventListener('hashchange', applyRoute);
    return () => window.removeEventListener('hashchange', applyRoute);
  }, [companies]);

  const handleTabClick = (tabId: TabId): void => {
    setViewMode('dashboard');
    setTab(tabId);
    const orgId = tabId === 'company' || tabId === 'map' ? selectedCompanyRef.current?.id : undefined;
    navigate(tabId, orgId, { mode, q: headerQuery });
  };

  const handleSelectCompany = (companyId: string): void => {
    const company = findCompanyById(companies, companyId);
    if (!company) {
      return;
    }
    setSelectedCompany(cloneCompany(company));
    if (viewMode === 'brief') {
      navigate('brief', company.id, { mode, q: headerQuery });
    } else if (tab === 'company') {
      navigate('company', company.id, { mode, q: headerQuery });
    } else if (tab === 'map') {
      navigate('map', company.id, { mode, q: headerQuery });
    }
  };

  const handleNavigate = (view: ViewHash, orgId?: string): void => {
    if (view === 'brief') {
      setViewMode('brief');
    } else {
      setViewMode('dashboard');
      setTab(view);
    }
    if (orgId) {
      const company = findCompanyById(companies, orgId);
      if (company) {
        setSelectedCompany(cloneCompany(company));
      }
    }
    navigate(view, orgId, { mode, q: headerQuery });
  };

  const handleOpenBrief = (company: Company, openInNewTab?: boolean): void => {
    if (openInNewTab) {
      const href = getLinkWithState('brief', company.id);
      if (typeof window !== 'undefined') {
        window.open(href, '_blank', 'noopener');
      }
      return;
    }

    setSelectedCompany(cloneCompany(company));
    setViewMode('brief');
    navigate('brief', company.id, { mode, q: headerQuery });
  };

  const handleBackFromBrief = (): void => {
    setViewMode('dashboard');
    setTab('company');
    navigate('company', selectedCompanyRef.current?.id, { mode, q: headerQuery });
  };

  if (isLoading) {
    return (
      <div className={styles.dashboard} style={backgroundStyle}>
        <div className={styles.subtleText} style={{ margin: '120px auto', textAlign: 'center' }}>
          Loading mock data{ELLIPSIS}
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className={styles.dashboard} style={backgroundStyle}>
        <div className={styles.subtleText} style={{ margin: '120px auto', textAlign: 'center', color: COLORS.red }}>
          {loadError}
        </div>
      </div>
    );
  }

  if (!selectedCompany) {
    return (
      <div className={styles.dashboard} style={backgroundStyle}>
        <div className={styles.subtleText} style={{ margin: '120px auto', textAlign: 'center' }}>
          No organizations available in mock data.
        </div>
      </div>
    );
  }

  if (viewMode === 'brief') {
    if (!selectedCompanyRef.current) {
      return (
        <div className={styles.dashboard} style={backgroundStyle}>
          <div className={styles.subtleText} style={{ margin: '120px auto', textAlign: 'center' }}>
            Loading brief{ELLIPSIS}
          </div>
        </div>
      );
    }
    return (
      <div className={styles.dashboard} style={backgroundStyle}>
        <CompanyBrief company={selectedCompanyRef.current} onBack={handleBackFromBrief} getLink={getLinkWithState} />
      </div>
    );
  }

  return (
    <div className={styles.dashboard} style={backgroundStyle}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <div className={styles.logo}>TE</div>
            <div>
              <div className={styles.headerText}>{`CCUS Scouting ${ENDASH} DAC (Mock)`}</div>
              <div className={styles.headerSubtitle}>
                Power BI front-end concept {MIDDOT} mock data {MIDDOT} TotalEnergies-inspired UI
              </div>
            </div>
          </div>
          <div className={styles.headerControls}>
            <div className={styles.search}>
              <Search size={16} color={COLORS.slate} />
              <input
                className={styles.searchInput}
                placeholder={`Global search${ELLIPSIS}`}
                value={headerQuery}
                onChange={e => setHeaderQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    navigate('finder', undefined, { q: headerQuery, mode });
                  }
                }}
              />
            </div>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => {
                const next = mode === 'read' ? 'curator' : 'read';
                setMode(next);
                navigate(tab, selectedCompanyRef.current?.id, { mode: next, q: headerQuery });
              }}
              title="Toggle mode"
            >
              {mode === 'read' ? 'Read-only' : 'Curator'}
            </button>
            {mode === 'curator' && (
              <button
                type="button"
                className={styles.primaryButton}
                onClick={() => {
      setOrgPanelError(undefined);
                  setOrgPanelOpen(true);
                }}
              >
                + Add startup
              </button>
            )}
          </div>
        </div>
      </header>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          {TABS.map(tabItem => {
            const isActive = tab === tabItem.id;
            const className = `${styles.sidebarButton} ${isActive ? styles.sidebarButtonActive : ''}`;

            return (
              <button
                key={tabItem.id}
                type="button"
                className={className}
                onClick={() => handleTabClick(tabItem.id)}
              >
                <tabItem.icon size={16} color={isActive ? '#ffffff' : '#1f2937'} />
                {tabItem.label}
              </button>
            );
          })}
          <div className={styles.sidebarDivider}>Demo controls</div>
          <div className={styles.sidebarControl}>
            <label className={styles.sidebarLabel} htmlFor="mock-company-select">
              Select company
            </label>
            <select
              id="mock-company-select"
              className={styles.sidebarSelect}
              value={selectedCompany.id}
              onChange={event => handleSelectCompany(event.target.value)}
            >
              {companies.map(company => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.sidebarControl}>
            <label className={styles.sidebarLabel}>Mode</label>
            <div className={styles.chipRow}>
              <Chip active={mode === 'read'} onClick={() => { setMode('read'); navigate(tab, selectedCompanyRef.current?.id, { mode: 'read', q: headerQuery }); }}>Read-only</Chip>
              <Chip active={mode === 'curator'} onClick={() => { setMode('curator'); navigate(tab, selectedCompanyRef.current?.id, { mode: 'curator', q: headerQuery }); }}>Curator</Chip>
            </div>
          </div>
        </aside>

        <main className={styles.main}>
          {tab === 'home' && (
            <HomePage
              companies={companies}
              onNavigate={handleNavigate}
              getLink={getLinkWithState}
              newsFeed={feedItems}
            />
          )}

          {tab === 'finder' && (
            <FinderPage
              companies={companies}
              onNavigate={handleNavigate}
              getLink={getLinkWithState}
              initialQuery={headerQuery}
              mode={mode}
            />
          )}

          {tab === 'company' && (
            <Company360Page
              company={selectedCompany}
              onNavigate={handleNavigate}
              getLink={getLinkWithState}
              onOpenBrief={handleOpenBrief}
              openCuratorPanel={openCuratorPanel}
              mode={mode}
            />
          )}

          {tab === 'funding' && <FundingDealsPage companies={companies} />}

          {tab === 'pubs' && <PublicationsPatentsPage companies={companies} />}

          {tab === 'map' && (
            <MapPage
              companies={companies}
              onNavigate={handleNavigate}
              getLink={getLinkWithState}
            />
          )}

          {tab === 'stale' && <StalenessPage companies={companies} />}
        </main>
      </div>

      <footer className={styles.footer}>
        Mock dashboard for illustration. Colors approximate TotalEnergies branding; data are fictional
        or simplified.
      </footer>

      {mode === 'curator' && curatorPanel && (
        <Panel
          isOpen
          onDismiss={dismissCuratorPanel}
          type={PanelType.medium}
          headerText={curatorPanelTitle}
          closeButtonAriaLabel="Close curator action"
          isLightDismiss={!curatorPanelSaving}
        >
          {curatorPanelError && (
            <div className={styles.subtleText} style={{ color: COLORS.red, marginBottom: 12 }}>
              {curatorPanelError}
            </div>
          )}
          {curatorPanel.type === 'project' && (
            <CuratorProjectForm
              key={`${curatorPanel.orgId}-project`}
              onSubmit={handleCuratorPanelSubmit}
              onCancel={dismissCuratorPanel}
              submitting={curatorPanelSaving}
            />
          )}
          {curatorPanel.type === 'collab' && (
            <CuratorCollabForm
              key={`${curatorPanel.orgId}-collab`}
              onSubmit={handleCuratorPanelSubmit}
              onCancel={dismissCuratorPanel}
              submitting={curatorPanelSaving}
            />
          )}
          {curatorPanel.type === 'interaction' && (
            <CuratorInteractionForm
              key={`${curatorPanel.orgId}-interaction`}
              onSubmit={handleCuratorPanelSubmit}
              onCancel={dismissCuratorPanel}
              submitting={curatorPanelSaving}
            />
          )}
          {curatorPanel.type === 'claim' && (
            <CuratorClaimForm
              key={`${curatorPanel.orgId}-claim`}
              onSubmit={handleCuratorPanelSubmit}
              onCancel={dismissCuratorPanel}
              submitting={curatorPanelSaving}
            />
          )}
          {curatorPanel.type === 'evidence' && (
            <CuratorEvidenceForm
              key={`${curatorPanel.orgId}-evidence-${curatorPanel.claimId}`}
              onSubmit={handleCuratorPanelSubmit}
              onCancel={dismissCuratorPanel}
              submitting={curatorPanelSaving}
            />
          )}
          {curatorPanel.type === 'image' && (
            <CuratorImageForm
              key={`${curatorPanel.orgId}-image`}
              onSubmit={handleCuratorPanelSubmit}
              onCancel={dismissCuratorPanel}
              submitting={curatorPanelSaving}
            />
          )}
        </Panel>
      )}

      {mode === 'curator' && (
        <Panel
          isOpen={orgPanelOpen}
          onDismiss={() => setOrgPanelOpen(false)}
          type={PanelType.medium}
          headerText="Add startup"
          closeButtonAriaLabel="Close"
        >
          <CuratorOrgForm
            onSubmit={handleAddStartup}
            onCancel={() => setOrgPanelOpen(false)}
            error={orgPanelError}
          />
        </Panel>
      )}
    </div>
  );
};

export default MockDashboard;
