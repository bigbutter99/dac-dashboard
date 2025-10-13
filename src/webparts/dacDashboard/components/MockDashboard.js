import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint max-lines: ["error", 4000] */
import * as React from 'react';
import { Search, Building2, Filter, ExternalLink, TrendingUp, DollarSign, Users, Factory, ClipboardList, BadgeCheck, AlertTriangle, BookOpen, Newspaper, ArrowUpRight, ShieldCheck, Timer, Printer, ArrowLeft, Globe2, MapPin } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, Area, AreaChart } from 'recharts';
import styles from './MockDashboard.module.scss';
import MockProvider from '../data/MockProvider';
import { Panel, PanelType } from '@fluentui/react';
const ALL_TABS = ['home', 'finder', 'company', 'funding', 'pubs', 'stale', 'map'];
const TABS = [
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
const FundingAxisTick = ({ x = 0, y = 0, payload }) => {
    const raw = payload?.value ?? '';
    const segments = raw.split(' ');
    const lines = segments.length > 2
        ? [segments.slice(0, segments.length - 1).join(' '), segments[segments.length - 1]]
        : segments;
    return (_jsx("g", { transform: `translate(${x},${y})`, children: _jsx("text", { textAnchor: "middle", fill: COLORS.slate, fontSize: 12, children: lines.map((line, index) => (_jsx("tspan", { x: 0, dy: index === 0 ? 0 : 14, children: line }, `${raw}-${index}`))) }) }));
};
const guessClaimChangeDate = (claim) => claim?.evidence?.[0]?.date ?? '2024-01-01';
const formatMoney = (value) => `$${(value / 1_000_000).toFixed(0)}M`;
const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);
const ragColor = (trust) => {
    switch (trust) {
        case 'Green':
            return COLORS.green;
        case 'Amber':
            return COLORS.amber;
        default:
            return COLORS.red;
    }
};
const buildTimeline = (company) => {
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
    company.publications.forEach(doc => events.push({ date: doc.date, type: 'publication', label: doc.title, icon: BookOpen, company: company.name, companyId: company.id }));
    company.patents.forEach(doc => events.push({ date: doc.date, type: 'patent', label: doc.title, icon: ClipboardList, company: company.name, companyId: company.id }));
    company.news.forEach(doc => events.push({ date: doc.date, type: 'news', label: doc.title, icon: Newspaper, company: company.name, companyId: company.id }));
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
const daysSince = (date) => {
    const ms = Date.now() - new Date(date).getTime();
    return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
};
const countEvidenceTypes = (company) => {
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
    return setToArray(types);
};
const getInitials = (value) => value
    .split(/\s+/)
    .map(part => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
const cloneClaim = (claim) => ({
    ...claim,
    evidence: claim.evidence ? [...claim.evidence.map(ev => ({ ...ev }))] : []
});
const cloneCompany = (company) => ({
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
function setToArray(input) {
    const result = [];
    input.forEach(value => result.push(value));
    return result;
}
function collectUnique(values) {
    const seen = {};
    const result = [];
    values.forEach(value => {
        if (!seen[value]) {
            seen[value] = true;
            result.push(value);
        }
    });
    return result;
}
function cloneStringSet(source) {
    const clone = new Set();
    source.forEach(value => clone.add(value));
    return clone;
}
const stageLabel = (stage) => {
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
const projectTypeLabel = (projectType) => {
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
const relationKindLabel = (relationType) => relationType.charAt(0).toUpperCase() + relationType.slice(1);
const ragToTrust = (rag) => {
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
const trustToScore = (trust) => {
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
const evidenceKindLabel = (kind) => {
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
const documentKindToCategory = (kind) => {
    switch (kind) {
        case 'publication':
            return 'Publication';
        case 'patent':
            return 'Patent';
        default:
            return 'News';
    }
};
const toDocumentItem = (document) => ({
    title: document.title,
    date: document.published_on,
    link: document.url,
    type: documentKindToCategory(document.kind)
});
const toFeedItem = (document) => ({
    id: document.id,
    date: document.published_on,
    title: document.title,
    type: documentKindToCategory(document.kind),
    source: document.source ?? 'External',
    link: document.url,
    orgIds: [document.orgId]
});
const hydrateCompanyFromProvider = (org, projects, claims, relations, documents, orgLookup) => {
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
        location: project.location ?? '—',
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
const getErrorMessage = (error) => {
    if (error && typeof error.message === 'string') {
        return error.message;
    }
    return 'Unexpected error';
};
const slugify = (value) => value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    || `org-${Date.now().toString(36)}`;
const parseHash = () => {
    if (typeof window === 'undefined') {
        return { view: 'home' };
    }
    const hash = window.location.hash.replace(/^#/, '');
    const params = new URLSearchParams(hash);
    const viewParam = params.get('view') ?? 'home';
    const orgId = params.get('org') ?? undefined;
    const q = params.get('q') ?? undefined;
    const modeParam = params.get('mode');
    if (viewParam === 'brief') {
        return { view: 'brief', orgId, q, mode: modeParam || undefined };
    }
    const normalizedView = ALL_TABS.indexOf(viewParam) !== -1 ? viewParam : 'home';
    return { view: normalizedView, orgId, q, mode: modeParam || undefined };
};
const buildHash = (view, orgId, extra) => {
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
const findCompanyById = (collection, id) => {
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
const Chip = ({ children, active, onClick }) => (_jsx("button", { type: "button", className: `${styles.chip} ${active ? styles.chipActive : ''}`, onClick: onClick, children: children }));
const Badge = ({ color, children }) => (_jsxs("span", { className: styles.badge, style: { background: `${color}1A`, color }, children: [_jsx("span", { className: styles.badgeSwatch, style: { background: color } }), children] }));
const Card = ({ title, actions, children }) => (_jsxs("div", { className: styles.card, children: [_jsxs("div", { className: styles.cardHeader, children: [_jsx("h3", { className: styles.cardTitle, children: title }), _jsx("div", { className: styles.cardActions, children: actions })] }), _jsx("div", { className: styles.cardBody, children: children })] }));
const Kpi = ({ label, value, icon: Icon, helper }) => (_jsxs("div", { className: styles.kpiCard, children: [_jsx("div", { className: styles.kpiIcon, children: _jsx(Icon, { size: 18, color: COLORS.brand }) }), _jsxs("div", { children: [_jsx("div", { className: styles.kpiLabel, children: label }), _jsx("div", { className: styles.kpiValue, children: value }), helper && _jsx("div", { className: styles.subtleText, children: helper })] })] }));
const HomePage = ({ companies, onNavigate, getLink, newsFeed }) => {
    const [newsWindow, setNewsWindow] = React.useState(14);
    const [newsType, setNewsType] = React.useState('All');
    const news = React.useMemo(() => {
        const cutoff = Date.now() - newsWindow * 24 * 60 * 60 * 1000;
        return newsFeed
            .filter(item => new Date(item.date).getTime() >= cutoff)
            .filter(item => (newsType === 'All' ? true : item.type === newsType))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [newsFeed, newsWindow, newsType]);
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
        const events = [];
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
    const stages = React.useMemo(() => collectUnique(companies.map(company => company.stage)), [companies]);
    const approaches = React.useMemo(() => collectUnique(companies.map(company => company.approach)), [companies]);
    const heatmapColumns = React.useMemo(() => {
        const base = 'minmax(220px, 2.4fr)';
        if (stages.length === 0) {
            return base;
        }
        return `${base} repeat(${stages.length}, minmax(0, 1fr))`;
    }, [stages]);
    return (_jsxs("div", { className: styles.main, children: [_jsxs("div", { className: styles.kpiGrid, children: [_jsx(Kpi, { label: "Organizations", value: totals.orgs, icon: Building2, helper: helperCopy.orgs }), _jsx(Kpi, { label: "Projects", value: totals.projects, icon: Factory, helper: helperCopy.projects }), _jsx(Kpi, { label: "Active pilots", value: totals.pilots, icon: Timer, helper: helperCopy.pilots }), _jsx(Kpi, { label: "Total funding", value: formatMoney(totals.funding), icon: DollarSign, helper: helperCopy.funding }), _jsx(Kpi, { label: "New items (90d)", value: totals.new90, icon: Newspaper, helper: helperCopy.new90 })] }), _jsxs("div", { className: styles.gridTwo, children: [_jsx(Card, { title: "Funding by organization", children: _jsx("div", { className: styles.chartArea, children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: companies.map(company => ({
                                        name: company.name,
                                        funding: (company.totalFunding ?? 0) / 1_000_000
                                    })), children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "name", interval: 0, height: 64, tick: _jsx(FundingAxisTick, {}), tickMargin: 12, tickLine: false }), _jsx(YAxis, { unit: "M" }), _jsx(Tooltip, { formatter: (value) => `${value}M` }), _jsx(Legend, {}), _jsx(Bar, { dataKey: "funding", name: "Funding (USD M)", fill: COLORS.brand, radius: [6, 6, 0, 0] })] }) }) }) }), _jsx(Card, { title: "Approach \u00D7 Stage heatmap (grid)", children: _jsxs("div", { className: styles.cardList, children: [_jsx("div", { className: styles.subtleText, children: "Distribution of observed companies by DAC approach and commercialization stage." }), _jsx("div", { children: _jsxs("div", { className: styles.heatmapGrid, style: { gridTemplateColumns: heatmapColumns }, children: [_jsx("div", { className: styles.heatmapHeader, children: "Approach" }), stages.map(stage => (_jsx("div", { className: styles.heatmapHeader, children: stage }, `stage-${stage}`))), approaches.map(approach => (_jsxs(React.Fragment, { children: [_jsx("div", { className: styles.heatmapRowLabel, children: approach }), stages.map(stage => {
                                                        const count = companies.filter(company => company.approach === approach && company.stage === stage).length;
                                                        const background = count ? `${COLORS.brand}22` : '#f1f5f9';
                                                        const border = count ? `${COLORS.brand}33` : '#e2e8f0';
                                                        return (_jsx("div", { className: styles.heatmapCell, children: _jsx("div", { className: styles.heatCell, style: { background, border: `1px solid ${border}` }, children: count || '' }) }, `${approach}-${stage}`));
                                                    })] }, approach)))] }) })] }) })] }), _jsx(Card, { title: "Recent news", actions: _jsxs("div", { className: styles.chipRow, children: [[7, 14, 30, 90].map(days => (_jsxs(Chip, { active: newsWindow === days, onClick: () => setNewsWindow(days), children: [days, "d"] }, days))), ['All', 'News', 'Publication', 'Patent'].map(t => (_jsx(Chip, { active: newsType === t, onClick: () => setNewsType(t), children: t }, t)))] }), children: _jsxs("div", { className: styles.newsList, children: [news.slice(0, 8).map(item => (_jsxs("div", { className: styles.newsItem, children: [_jsxs("div", { children: [_jsx("div", { className: styles.newsTitle, children: item.title }), _jsxs("div", { className: styles.newsMeta, children: [new Date(item.date).toLocaleDateString(), " \u00B7 ", item.type, " \u00B7 ", item.source] })] }), _jsxs("div", { className: styles.actionBar, children: [item.orgIds.map(orgId => (_jsx("a", { className: styles.secondaryButton, href: getLink('company', orgId), onClick: e => {
                                                e.preventDefault();
                                                onNavigate('company', orgId);
                                            }, children: "Open 360" }, `${item.id}-${orgId}`))), _jsx("a", { className: styles.secondaryButton, href: item.link, target: "_blank", rel: "noreferrer", children: "Source" })] })] }, item.id))), news.length === 0 && _jsx("div", { className: styles.subtleText, children: "No recent news in this window." })] }) }), _jsx(Card, { title: "What changed (last 30 days)", children: _jsxs("div", { className: styles.chipRow, children: [recentEvents.length === 0 && _jsx("div", { className: styles.subtleText, children: "No recent updates in mock data." }), recentEvents.map(event => (_jsxs("a", { className: styles.pill, href: getLink('company', event.companyId), onClick: evt => {
                                evt.preventDefault();
                                if (event.companyId) {
                                    onNavigate('company', event.companyId);
                                }
                            }, children: [_jsx(event.icon, { size: 14, color: COLORS.brand }), _jsx("span", { style: { fontWeight: 600 }, children: event.company }), _jsx("span", { children: event.label }), _jsx("span", { className: styles.subtleText, children: new Date(event.date).toLocaleDateString() })] }, `${event.label}-${event.date}`)))] }) })] }));
};
const FinderPage = ({ companies, onNavigate, getLink, initialQuery, mode }) => {
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
    const approaches = React.useMemo(() => collectUnique(companies.map(company => company.approach)), [companies]);
    const stages = React.useMemo(() => collectUnique(companies.map(company => company.stage)), [companies]);
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
    return (_jsx("div", { className: styles.main, children: _jsxs("div", { className: styles.cardList, children: [_jsxs("div", { className: styles.cardListItem, children: [_jsxs("div", { className: styles.cardListHeader, children: [_jsxs("div", { className: styles.search, children: [_jsx(Search, { size: 16, color: COLORS.slate }), _jsx("input", { className: styles.searchInput, value: query, onChange: event => setQuery(event.target.value), placeholder: "Search company, approach, country, concept\u2026" })] }), _jsxs("button", { type: "button", className: styles.secondaryButton, onClick: () => setShowFilters(!showFilters), "aria-expanded": showFilters, children: [_jsx(Filter, { size: 14 }), " Filters"] })] }), _jsx("div", { className: styles.subtleText, children: "Discovery chips" }), _jsxs("div", { className: styles.chipRow, children: [approaches.map(approach => (_jsx(Chip, { active: chips.approach.has(approach), onClick: () => {
                                        const next = cloneStringSet(chips.approach);
                                        if (next.has(approach)) {
                                            next.delete(approach);
                                        }
                                        else {
                                            next.add(approach);
                                        }
                                        setChips({ ...chips, approach: next });
                                    }, children: approach }, approach))), _jsx(Chip, { active: chips.pilot, onClick: () => setChips({ ...chips, pilot: !chips.pilot }), children: "Has active pilot" }), _jsx(Chip, { active: chips.under50, onClick: () => setChips({ ...chips, under50: !chips.under50 }), children: "Funding < $50M" })] }), showFilters && (_jsxs("div", { className: styles.filterPanel, children: [_jsxs("div", { className: styles.filterGroup, children: [_jsx("div", { className: styles.filterGroupTitle, children: "Stage" }), stages.map(stage => (_jsxs("label", { className: styles.filterOption, children: [_jsx("input", { type: "checkbox", checked: chips.stage.has(stage), onChange: () => {
                                                        const next = cloneStringSet(chips.stage);
                                                        if (next.has(stage)) {
                                                            next.delete(stage);
                                                        }
                                                        else {
                                                            next.add(stage);
                                                        }
                                                        setChips({ ...chips, stage: next });
                                                    } }), stage] }, stage)))] }), _jsxs("div", { className: styles.filterGroup, children: [_jsx("div", { className: styles.filterGroupTitle, children: "Quick filters" }), _jsxs("label", { className: styles.filterOption, children: [_jsx("input", { type: "checkbox", checked: chips.pilot, onChange: () => setChips({ ...chips, pilot: !chips.pilot }) }), "Has active pilot"] }), _jsxs("label", { className: styles.filterOption, children: [_jsx("input", { type: "checkbox", checked: chips.under50, onChange: () => setChips({ ...chips, under50: !chips.under50 }) }), "Funding < $50M"] })] })] }))] }), _jsx("div", { className: styles.cardsGrid, children: results.map(company => (_jsxs("div", { className: styles.cardListItem, children: [_jsxs("div", { className: styles.cardListHeader, children: [_jsxs("div", { className: styles.companyHeading, children: [_jsx("div", { className: styles.companyLogoSmall, children: company.logoUrl ? (_jsx("img", { src: company.logoUrl, alt: `${company.name} logo` })) : (_jsx("span", { children: getInitials(company.name) })) }), _jsxs("div", { children: [_jsx("div", { className: styles.cardTitle, children: company.name }), _jsxs("div", { className: styles.subtleText, children: [company.approach, " \u00B7 ", company.country] })] })] }), _jsxs("div", { className: styles.cardActions, children: [_jsx(Badge, { color: COLORS.brand, children: company.stage }), _jsx(Badge, { color: COLORS.slate, children: `Fresh ${company.freshnessDays}d` })] })] }), _jsx("p", { className: `${styles.subtleText} ${styles.lineClamp3}`, children: company.description }), _jsxs("div", { className: styles.cardListFooter, children: [_jsxs("span", { className: styles.subtleText, children: [_jsx(DollarSign, { size: 14, color: COLORS.slate }), " ", formatMoney(company.totalFunding), " total"] }), _jsxs("div", { className: styles.actionBar, children: [_jsxs("a", { className: styles.primaryButton, href: getLink('company', company.id), onClick: event => {
                                                    event.preventDefault();
                                                    onNavigate('company', company.id);
                                                }, children: ["Open 360 ", _jsx(ArrowUpRight, { size: 14, style: { marginLeft: 4 } })] }), _jsx("a", { className: styles.secondaryButton, href: getLink('company', company.id), target: "_blank", rel: "noreferrer", children: "New tab" })] })] })] }, company.id))) })] }) }));
};
const Company360Page = ({ company, onNavigate, getLink, onOpenBrief, openCuratorPanel, mode }) => {
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
    const keyMetrics = [
        { label: 'Stage', value: company.stage },
        { label: 'Total funding', value: formatMoney(company.totalFunding) },
        { label: 'Active pilots', value: pilotCount },
        { label: 'Freshness', value: `${company.freshnessDays} days` }
    ];
    return (_jsxs("div", { className: styles.main, children: [_jsxs("div", { className: styles.cardListItem, children: [_jsxs("div", { className: styles.cardListHeader, children: [_jsxs("div", { className: styles.companyHeading, children: [_jsx("div", { className: styles.companyLogo, children: company.logoUrl ? (_jsx("img", { src: company.logoUrl, alt: `${company.name} logo` })) : (_jsx("span", { children: getInitials(company.name) })) }), _jsxs("div", { children: [_jsxs("div", { className: styles.cardTitle, style: { display: 'flex', alignItems: 'center', gap: 8 }, children: [company.name, _jsxs("a", { href: company.website, target: "_blank", rel: "noreferrer", className: styles.subtleText, children: [_jsx(ExternalLink, { size: 12 }), " website"] })] }), _jsxs("div", { className: styles.subtleText, children: [company.approach, " \u00B7 ", company.country, " \u00B7 Founded ", company.founded] })] })] }), _jsxs("div", { className: styles.cardActions, children: [_jsx(Badge, { color: COLORS.brand, children: company.stage }), _jsxs(Badge, { color: COLORS.slate, children: ["Fresh ", company.freshnessDays, "d"] }), _jsxs(Badge, { color: COLORS.green, children: [formatMoney(company.totalFunding), " raised"] })] })] }), _jsx("p", { className: `${styles.subtleText}`, style: { marginTop: 12 }, children: company.description }), _jsxs("div", { className: styles.actionBar, style: { marginTop: 12 }, children: [_jsx("button", { type: "button", className: styles.primaryButton, onClick: () => onOpenBrief(company, false), children: "View brief" }), _jsx("button", { type: "button", className: styles.secondaryButton, onClick: () => onNavigate('map', company.id), children: "Locate on map" }), _jsx("a", { className: styles.secondaryButton, href: getLink('brief', company.id), target: "_blank", rel: "noreferrer", children: "Brief in new tab" })] })] }), _jsxs("div", { className: styles.gridTwo, children: [_jsx(Card, { title: "Key metrics", children: _jsx("div", { className: styles.metricList, children: keyMetrics.map(metric => (_jsxs("div", { className: styles.metricRow, children: [_jsx("span", { className: styles.metricLabel, children: metric.label }), _jsx("span", { className: styles.metricValue, children: metric.value })] }, metric.label))) }) }), _jsxs(Card, { title: "Projects & pilots", actions: mode === 'curator' ? _jsx("button", { className: styles.secondaryButton, type: "button", onClick: () => openCuratorPanel({ type: 'project', orgId: company.id }), children: "Add project" }) : undefined, children: [_jsxs("ul", { className: styles.listSimple, children: [company.projects.map(project => (_jsxs("li", { children: [_jsx("strong", { children: project.name }), " \u2014 ", project.type, " in ", project.location, " (", project.status, ")"] }, `${project.name}-${project.startDate}`))), company.projects.length === 0 && _jsx("li", { children: "No projects captured yet." })] }), operatingProjects.length > 0 && (_jsxs("div", { className: styles.subtleText, style: { marginTop: 8 }, children: [operatingProjects.length, " project(s) operating \u2022 ", pilotCount, " pilot(s)"] }))] })] }), _jsx(Card, { title: "Overview imagery", actions: mode === 'curator' ? (_jsx("button", { className: styles.secondaryButton, type: "button", onClick: () => openCuratorPanel({ type: 'image', orgId: company.id }), children: "Add image" })) : undefined, children: company.overviewImages?.length ? (_jsx("div", { className: styles.imageGrid, children: company.overviewImages.map((media, index) => (_jsxs("figure", { className: styles.imageCard, children: [_jsx("div", { className: styles.imageFrame, children: _jsx("img", { src: media.src, alt: media.caption ?? `${company.name} overview ${index + 1}` }) }), media.caption && _jsx("figcaption", { className: styles.imageCaption, children: media.caption })] }, `${company.id}-image-${index}`))) })) : (_jsx("div", { className: styles.subtleText, children: "No imagery captured yet." })) }), _jsxs("div", { className: styles.gridTwo, children: [_jsx(Card, { title: "Collaborations & partners", actions: mode === 'curator' ? _jsx("button", { className: styles.secondaryButton, type: "button", onClick: () => openCuratorPanel({ type: 'collab', orgId: company.id }), children: "Add collaboration" }) : undefined, children: _jsxs("ul", { className: styles.listSimple, children: [company.collaborations.map(collaboration => (_jsxs("li", { children: [_jsx("strong", { children: collaboration.with }), " \u00B7 ", collaboration.kind, " \u00B7 since ", new Date(collaboration.startDate).getFullYear()] }, `${collaboration.with}-${collaboration.startDate}`))), company.collaborations.length === 0 && _jsx("li", { children: "No collaborations captured." })] }) }), _jsx(Card, { title: "Interactions & notes", actions: mode === 'curator' ? _jsx("button", { className: styles.secondaryButton, type: "button", onClick: () => openCuratorPanel({ type: 'interaction', orgId: company.id }), children: "Add interaction" }) : undefined, children: _jsxs("ul", { className: styles.listSimple, children: [company.interactions.map(interaction => (_jsxs("li", { children: [new Date(interaction.date).toLocaleDateString(), " \u00B7 ", capitalize(interaction.type), " \u00B7 ", interaction.summary] }, `${interaction.date}-${interaction.type}`))), company.interactions.length === 0 && _jsx("li", { children: "No interactions recorded yet." })] }) })] }), _jsx(Card, { title: "Claims & risk signals", actions: _jsxs("div", { className: styles.actionBar, children: [_jsx("span", { className: styles.subtleText, children: "RAG + confidence" }), mode === 'curator' && (_jsx("button", { className: styles.secondaryButton, type: "button", onClick: () => openCuratorPanel({ type: 'claim', orgId: company.id }), children: "Add claim" }))] }), children: _jsxs("div", { className: styles.cardList, children: [company.claims.map(claim => (_jsxs("div", { className: styles.cardListItem, children: [_jsxs("div", { className: styles.cardListHeader, children: [_jsx("div", { className: styles.cardTitle, style: { fontSize: 14 }, children: claim.text }), _jsx(Badge, { color: ragColor(claim.trust), children: claim.trust })] }), _jsxs("div", { className: styles.subtleText, children: [claim.metricType, " \u00B7 ", claim.min, "\u2013", claim.max, " ", claim.unit, " (ML ", claim.ml, ")"] }), _jsxs("div", { className: styles.subtleText, style: { display: 'flex', gap: 8, marginTop: 8, alignItems: 'center', flexWrap: 'wrap' }, children: [_jsx(ShieldCheck, { size: 14, color: COLORS.slate }), "Trust ", claim.trustScore, "/100", claim.evidence.length > 0 && _jsx("span", { "aria-hidden": "true", children: "\u00B7" }), claim.evidence.map((evidence, index) => (_jsxs("a", { href: evidence.url, className: styles.secondaryButton, target: "_blank", rel: "noreferrer", children: [_jsx(ExternalLink, { size: 12 }), " ", capitalize(evidence.type)] }, `${claim.id}-evidence-${index}`)))] }), mode === 'curator' && (_jsx("button", { className: styles.secondaryButton, type: "button", onClick: () => openCuratorPanel({ type: 'evidence', orgId: company.id, claimId: claim.id }), children: "Add evidence" }))] }, claim.id))), company.claims.length === 0 && (_jsx("div", { className: styles.subtleText, children: "No claims captured for this organization yet." }))] }) }), _jsxs("div", { className: styles.gridTwo, children: [_jsx(Card, { title: "Evidence library", children: _jsxs("ul", { className: styles.listSimple, children: [company.publications.map(publication => (_jsx("li", { children: _jsxs("a", { href: publication.link, target: "_blank", rel: "noreferrer", children: [_jsx(BookOpen, { size: 12, style: { marginRight: 6 } }), publication.title, " (", new Date(publication.date).toLocaleDateString(), ")"] }) }, publication.title))), company.patents.map(patent => (_jsx("li", { children: _jsxs("a", { href: patent.link, target: "_blank", rel: "noreferrer", children: [_jsx(ClipboardList, { size: 12, style: { marginRight: 6 } }), patent.title, " (", new Date(patent.date).toLocaleDateString(), ")"] }) }, patent.title))), company.news.map(news => (_jsx("li", { children: _jsxs("a", { href: news.link, target: "_blank", rel: "noreferrer", children: [_jsx(Newspaper, { size: 12, style: { marginRight: 6 } }), news.title, " (", new Date(news.date).toLocaleDateString(), ")"] }) }, news.title))), company.publications.length + company.patents.length + company.news.length === 0 && (_jsx("li", { children: "No supporting documents captured." }))] }) }), _jsx(Card, { title: "Timeline recap", actions: _jsx("div", { className: styles.chipRow, children: Object.keys(filters).map(key => (_jsx(Chip, { active: filters[key], onClick: () => setFilters({ ...filters, [key]: !filters[key] }), children: capitalize(key) }, key))) }), children: _jsxs("div", { className: styles.timeline, children: [_jsx("div", { className: styles.timelineRail }), _jsxs("div", { className: styles.cardList, children: [timeline.map((event, index) => (_jsxs("div", { className: styles.timelineItem, children: [_jsx("div", { className: styles.timelineIcon, children: _jsx(event.icon, { size: 14 }) }), _jsxs("div", { className: styles.timelineCard, children: [_jsxs("div", { className: styles.timelineMeta, children: [new Date(event.date).toLocaleDateString(), " \u00B7 ", capitalize(event.type)] }), _jsx("div", { className: styles.timelineLabel, children: event.label })] })] }, `${event.label}-${index}`))), timeline.length === 0 && (_jsx("div", { className: styles.subtleText, style: { marginLeft: 12 }, children: "No recent activity logged." }))] })] }) })] })] }));
};
// Curator forms
const Field = ({ label, children }) => (_jsxs("label", { className: styles.filterOption, children: [_jsx("span", { style: { minWidth: 110 }, children: label }), children] }));
const CuratorProjectForm = ({ onSubmit, onCancel, submitting }) => {
    const initial = { name: '', type: 'Pilot', location: '', status: 'Planned', startDate: new Date().toISOString().slice(0, 10), capacity: '', partners: '' };
    const [p, setP] = React.useState(initial);
    return (_jsxs("form", { onSubmit: async (e) => {
            e.preventDefault();
            try {
                await onSubmit({ ...p, capacity: p.capacity ? Number(p.capacity) : undefined, partners: p.partners ? p.partners.split(',').map((s) => s.trim()).filter(Boolean) : [] });
                setP(initial);
            }
            catch {
                // parent handles error state
            }
        }, className: styles.filterGroup, children: [_jsx(Field, { label: "Name", children: _jsx("input", { required: true, value: p.name, onChange: e => setP({ ...p, name: e.target.value }) }) }), _jsx(Field, { label: "Type", children: _jsx("input", { value: p.type, onChange: e => setP({ ...p, type: e.target.value }) }) }), _jsx(Field, { label: "Location", children: _jsx("input", { value: p.location, onChange: e => setP({ ...p, location: e.target.value }) }) }), _jsx(Field, { label: "Status", children: _jsx("input", { value: p.status, onChange: e => setP({ ...p, status: e.target.value }) }) }), _jsx(Field, { label: "Start date", children: _jsx("input", { type: "date", value: p.startDate, onChange: e => setP({ ...p, startDate: e.target.value }) }) }), _jsx(Field, { label: "Capacity", children: _jsx("input", { value: p.capacity, onChange: e => setP({ ...p, capacity: e.target.value }), placeholder: "tCO2/yr" }) }), _jsx(Field, { label: "Partners", children: _jsx("input", { value: p.partners, onChange: e => setP({ ...p, partners: e.target.value }), placeholder: "Comma-separated" }) }), _jsxs("div", { className: styles.actionBar, children: [_jsx("button", { className: styles.primaryButton, type: "submit", disabled: submitting, children: "Add project" }), _jsx("button", { className: styles.secondaryButton, type: "button", onClick: () => { setP(initial); onCancel(); }, children: "Cancel" })] })] }));
};
const CuratorCollabForm = ({ onSubmit, onCancel, submitting }) => {
    const initial = { with: '', kind: 'Partner', startDate: new Date().toISOString().slice(0, 10) };
    const [c, setC] = React.useState(initial);
    return (_jsxs("form", { onSubmit: async (e) => {
            e.preventDefault();
            try {
                await onSubmit(c);
                setC(initial);
            }
            catch {
                // parent handles error state
            }
        }, className: styles.filterGroup, children: [_jsx(Field, { label: "With", children: _jsx("input", { required: true, value: c.with, onChange: e => setC({ ...c, with: e.target.value }) }) }), _jsx(Field, { label: "Kind", children: _jsx("input", { value: c.kind, onChange: e => setC({ ...c, kind: e.target.value }) }) }), _jsx(Field, { label: "Since", children: _jsx("input", { type: "date", value: c.startDate, onChange: e => setC({ ...c, startDate: e.target.value }) }) }), _jsxs("div", { className: styles.actionBar, children: [_jsx("button", { className: styles.primaryButton, type: "submit", disabled: submitting, children: "Add collaboration" }), _jsx("button", { className: styles.secondaryButton, type: "button", onClick: () => { setC(initial); onCancel(); }, children: "Cancel" })] })] }));
};
const CuratorInteractionForm = ({ onSubmit, onCancel, submitting }) => {
    const initial = { date: new Date().toISOString().slice(0, 10), type: 'Meeting', attendees: '', summary: '' };
    const [i, setI] = React.useState(initial);
    return (_jsxs("form", { onSubmit: async (e) => {
            e.preventDefault();
            try {
                await onSubmit({ ...i, attendees: (i.attendees || '').split(',').map((s) => s.trim()).filter(Boolean) });
                setI(initial);
            }
            catch {
                // parent handles error state
            }
        }, className: styles.filterGroup, children: [_jsx(Field, { label: "Date", children: _jsx("input", { type: "date", value: i.date, onChange: e => setI({ ...i, date: e.target.value }) }) }), _jsx(Field, { label: "Type", children: _jsx("input", { value: i.type, onChange: e => setI({ ...i, type: e.target.value }) }) }), _jsx(Field, { label: "Attendees", children: _jsx("input", { value: i.attendees, onChange: e => setI({ ...i, attendees: e.target.value }), placeholder: "Comma-separated" }) }), _jsx(Field, { label: "Summary", children: _jsx("input", { value: i.summary, onChange: e => setI({ ...i, summary: e.target.value }) }) }), _jsxs("div", { className: styles.actionBar, children: [_jsx("button", { className: styles.primaryButton, type: "submit", disabled: submitting, children: "Add interaction" }), _jsx("button", { className: styles.secondaryButton, type: "button", onClick: () => { setI(initial); onCancel(); }, children: "Cancel" })] })] }));
};
const CuratorClaimForm = ({ onSubmit, onCancel, submitting }) => {
    const initial = { text: '', metricType: '', unit: '', trust: 'Amber', trustScore: 60, min: '', ml: '', max: '' };
    const [c, setC] = React.useState(initial);
    return (_jsxs("form", { onSubmit: async (e) => {
            e.preventDefault();
            try {
                await onSubmit({ ...c, min: c.min ? Number(c.min) : undefined, ml: c.ml ? Number(c.ml) : undefined, max: c.max ? Number(c.max) : undefined });
                setC(initial);
            }
            catch {
                // parent handles error state
            }
        }, className: styles.filterGroup, children: [_jsx(Field, { label: "Text", children: _jsx("input", { required: true, value: c.text, onChange: e => setC({ ...c, text: e.target.value }) }) }), _jsx(Field, { label: "Metric", children: _jsx("input", { value: c.metricType, onChange: e => setC({ ...c, metricType: e.target.value }) }) }), _jsx(Field, { label: "Unit", children: _jsx("input", { value: c.unit, onChange: e => setC({ ...c, unit: e.target.value }) }) }), _jsx(Field, { label: "Min", children: _jsx("input", { value: c.min, onChange: e => setC({ ...c, min: e.target.value }) }) }), _jsx(Field, { label: "ML", children: _jsx("input", { value: c.ml, onChange: e => setC({ ...c, ml: e.target.value }) }) }), _jsx(Field, { label: "Max", children: _jsx("input", { value: c.max, onChange: e => setC({ ...c, max: e.target.value }) }) }), _jsx(Field, { label: "Trust", children: _jsx("input", { value: c.trust, onChange: e => setC({ ...c, trust: e.target.value }) }) }), _jsx(Field, { label: "Score", children: _jsx("input", { type: "number", min: 0, max: 100, value: c.trustScore, onChange: e => setC({ ...c, trustScore: Number(e.target.value) }) }) }), _jsxs("div", { className: styles.actionBar, children: [_jsx("button", { className: styles.primaryButton, type: "submit", disabled: submitting, children: "Add claim" }), _jsx("button", { className: styles.secondaryButton, type: "button", onClick: () => { setC(initial); onCancel(); }, children: "Cancel" })] })] }));
};
const CuratorEvidenceForm = ({ onSubmit, onCancel, submitting }) => {
    const initial = { type: 'Publication', title: '', url: '', date: new Date().toISOString().slice(0, 10) };
    const [evi, setEvi] = React.useState(initial);
    return (_jsxs("form", { onSubmit: async (e) => {
            e.preventDefault();
            try {
                await onSubmit(evi);
                setEvi(initial);
            }
            catch {
                // parent handles error state
            }
        }, className: styles.filterGroup, children: [_jsx(Field, { label: "Type", children: _jsx("input", { value: evi.type, onChange: e => setEvi({ ...evi, type: e.target.value }) }) }), _jsx(Field, { label: "Title", children: _jsx("input", { required: true, value: evi.title, onChange: e => setEvi({ ...evi, title: e.target.value }) }) }), _jsx(Field, { label: "URL", children: _jsx("input", { required: true, value: evi.url, onChange: e => setEvi({ ...evi, url: e.target.value }) }) }), _jsx(Field, { label: "Date", children: _jsx("input", { type: "date", value: evi.date, onChange: e => setEvi({ ...evi, date: e.target.value }) }) }), _jsxs("div", { className: styles.actionBar, children: [_jsx("button", { className: styles.primaryButton, type: "submit", disabled: submitting, children: "Add evidence" }), _jsx("button", { className: styles.secondaryButton, type: "button", onClick: () => { setEvi(initial); onCancel(); }, children: "Cancel" })] })] }));
};
const CuratorImageForm = ({ onSubmit, onCancel, submitting }) => {
    const initial = { src: '', caption: '' };
    const [img, setImg] = React.useState(initial);
    return (_jsxs("form", { onSubmit: async (e) => {
            e.preventDefault();
            if (!img.src.trim()) {
                return;
            }
            try {
                await onSubmit({ src: img.src.trim(), caption: img.caption?.trim() || undefined });
                setImg(initial);
            }
            catch {
                // parent handles error state
            }
        }, className: styles.filterGroup, children: [_jsx(Field, { label: "Image URL", children: _jsx("input", { required: true, value: img.src, onChange: e => setImg({ ...img, src: e.target.value }), placeholder: "https://..." }) }), _jsx(Field, { label: "Caption", children: _jsx("input", { value: img.caption, onChange: e => setImg({ ...img, caption: e.target.value }), placeholder: "Optional" }) }), _jsxs("div", { className: styles.actionBar, children: [_jsx("button", { className: styles.primaryButton, type: "submit", disabled: submitting, children: "Add image" }), _jsx("button", { className: styles.secondaryButton, type: "button", onClick: () => { setImg(initial); onCancel(); }, children: "Cancel" })] })] }));
};
const CuratorOrgForm = ({ onSubmit, onCancel, error }) => {
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
    const handleNameChange = (value) => {
        setOrg(prev => ({
            ...prev,
            name: value,
            slug: prev.slug ? prev.slug : slugify(value)
        }));
    };
    return (_jsxs("form", { onSubmit: e => {
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
        }, className: styles.filterGroup, children: [error && _jsx("div", { className: styles.subtleText, style: { color: COLORS.red }, children: error }), _jsx(Field, { label: "Name", children: _jsx("input", { required: true, value: org.name, onChange: e => handleNameChange(e.target.value) }) }), _jsx(Field, { label: "Slug", children: _jsx("input", { value: org.slug, onChange: e => setOrg({ ...org, slug: e.target.value }), placeholder: "example-startup" }) }), _jsx(Field, { label: "Approach", children: _jsx("input", { value: org.approach, onChange: e => setOrg({ ...org, approach: e.target.value }) }) }), _jsx(Field, { label: "Stage", children: _jsx("input", { value: org.stage, onChange: e => setOrg({ ...org, stage: e.target.value }) }) }), _jsx(Field, { label: "Country", children: _jsx("input", { value: org.country, onChange: e => setOrg({ ...org, country: e.target.value }) }) }), _jsx(Field, { label: "Founded", children: _jsx("input", { type: "number", value: org.founded, onChange: e => setOrg({ ...org, founded: e.target.value }) }) }), _jsx(Field, { label: "Description", children: _jsx("input", { value: org.description, onChange: e => setOrg({ ...org, description: e.target.value }) }) }), _jsxs("div", { className: styles.actionBar, children: [_jsx("button", { className: styles.primaryButton, type: "submit", children: "Create startup" }), _jsx("button", { className: styles.secondaryButton, type: "button", onClick: () => { setOrg(initial); onCancel(); }, children: "Cancel" })] })] }));
};
const FundingDealsPage = ({ companies }) => {
    const timelineData = React.useMemo(() => {
        const rows = [];
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
    const totals = React.useMemo(() => companies.map(company => ({
        name: company.name,
        total: (company.totalFunding ?? 0) / 1_000_000
    })), [companies]);
    return (_jsxs("div", { className: styles.gridTwo, children: [_jsx(Card, { title: "Funding timeline", children: _jsx("div", { className: styles.chartArea, children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(AreaChart, { data: timelineData, children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "fundingGradient", x1: "0", x2: "0", y1: "0", y2: "1", children: [_jsx("stop", { offset: "0%", stopColor: COLORS.brand, stopOpacity: 0.35 }), _jsx("stop", { offset: "100%", stopColor: COLORS.brand, stopOpacity: 0.05 })] }) }), _jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "date" }), _jsx(YAxis, { unit: "M" }), _jsx(Tooltip, { formatter: (value) => `${value}M` }), _jsx(Area, { dataKey: "amount", stroke: COLORS.brand, fill: "url(#fundingGradient)", name: "Round size (USD M)" })] }) }) }) }), _jsx(Card, { title: "Top funding (total)", children: _jsx("div", { className: styles.chartArea, children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: totals, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "name" }), _jsx(YAxis, { unit: "M" }), _jsx(Tooltip, { formatter: (value) => `${value}M` }), _jsx(Bar, { dataKey: "total", name: "Total (USD M)", fill: COLORS.brand, radius: [6, 6, 0, 0] })] }) }) }) })] }));
};
const PublicationsPatentsPage = ({ companies }) => {
    const rows = React.useMemo(() => {
        const items = [];
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
    return (_jsx(Card, { title: "Publications & patents (recent)", children: _jsxs("table", { className: styles.table, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Date" }), _jsx("th", { children: "Company" }), _jsx("th", { children: "Type" }), _jsx("th", { children: "Title" }), _jsx("th", {})] }) }), _jsx("tbody", { children: rows.map(row => (_jsxs("tr", { className: styles.tableRow, children: [_jsx("td", { className: styles.tableCell, children: new Date(row.date).toLocaleDateString() }), _jsx("td", { className: styles.tableCell, style: { fontWeight: 500 }, children: row.company }), _jsx("td", { className: styles.tableCell, children: _jsx(Badge, { color: row.type === 'Patent' ? COLORS.slate : COLORS.brand, children: row.type }) }), _jsx("td", { className: styles.tableCell, children: row.title }), _jsx("td", { className: styles.tableCell, children: _jsx("a", { href: row.link, className: styles.secondaryButton, target: "_blank", rel: "noreferrer", children: _jsx(ExternalLink, { size: 12 }) }) })] }, `${row.company}-${row.title}`))) })] }) }));
};
const StalenessPage = ({ companies }) => {
    const entities = React.useMemo(() => {
        const items = [];
        companies.forEach(company => {
            items.push({ kind: 'Org', name: company.name, fresh: company.freshnessDays, evidenceTypes: countEvidenceTypes(company) });
            company.projects.forEach(project => {
                items.push({
                    kind: 'Project',
                    name: `${company.name} – ${project.name}`,
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
            score: (entity.fresh > 60 ? 2 : entity.fresh > 30 ? 1 : 0) +
                (entity.evidenceTypes.length < 2 ? 1 : 0)
        }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);
        return scored;
    }, [entities]);
    return (_jsxs("div", { className: styles.gridTwo, children: [_jsx(Card, { title: "Freshness \u00D7 coverage heatmap (mock)", children: _jsx("div", { className: styles.cardList, children: entities.map(entity => (_jsxs("div", { className: styles.cardListItem, children: [_jsx("div", { className: styles.cardTitle, style: { fontSize: 13 }, children: entity.name }), _jsxs("div", { className: styles.subtleText, children: ["Fresh ", entity.fresh, "d \u00B7 Evidence types ", entity.evidenceTypes.length] })] }, entity.name))) }) }), _jsx(Card, { title: "Needs attention (top)", children: _jsx("div", { className: styles.cardList, children: needsAttention.map(entity => (_jsxs("div", { className: styles.needsItem, children: [_jsxs("div", { children: [_jsx("div", { className: styles.cardTitle, style: { fontSize: 14 }, children: entity.name }), _jsxs("div", { className: styles.needsMeta, children: [entity.kind, " \u00B7 Fresh ", entity.fresh, "d \u00B7 Evidence ", entity.evidenceTypes.length, " types"] })] }), _jsx("button", { type: "button", className: styles.primaryButton, children: "Assign" })] }, entity.name))) }) })] }));
};
const MapPage = ({ companies, onNavigate, getLink }) => {
    const [layer, setLayer] = React.useState('orgs');
    const legend = {
        orgs: { label: 'Headquarters', color: COLORS.brand },
        projects: { label: 'Projects', color: COLORS.green },
        pilots: { label: 'Pilots', color: COLORS.amber }
    };
    const legendItems = [legend.orgs, legend.projects, legend.pilots];
    const items = React.useMemo(() => {
        switch (layer) {
            case 'projects':
                {
                    const projectItems = [];
                    companies.forEach(company => {
                        company.projects.forEach(project => {
                            projectItems.push({
                                id: `${company.id}-${project.name}`,
                                title: project.name,
                                subtitle: `${project.type} · ${project.location}`,
                                companyId: company.id
                            });
                        });
                    });
                    return projectItems;
                }
            case 'pilots':
                {
                    const pilotItems = [];
                    companies.forEach(company => {
                        company.projects.forEach(project => {
                            if (project.type.toLowerCase().indexOf('pilot') !== -1) {
                                pilotItems.push({
                                    id: `${company.id}-${project.name}`,
                                    title: project.name,
                                    subtitle: `${company.name} · ${project.location} (${project.status})`,
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
                    subtitle: `${company.approach} · ${company.country}`,
                    companyId: company.id
                }));
        }
    }, [companies, layer]);
    const layerLabel = legend[layer].label.toLowerCase();
    return (_jsxs("div", { className: styles.mapContainer, children: [_jsxs("div", { className: styles.mapToolbar, children: [_jsxs("div", { className: styles.chipRow, children: [_jsx(Chip, { active: layer === 'orgs', onClick: () => setLayer('orgs'), children: "Organizations" }), _jsx(Chip, { active: layer === 'projects', onClick: () => setLayer('projects'), children: "Projects" }), _jsx(Chip, { active: layer === 'pilots', onClick: () => setLayer('pilots'), children: "Pilots" })] }), _jsx("div", { className: styles.mapLegend, children: legendItems.map(item => (_jsxs("span", { className: styles.mapLegendItem, children: [_jsx("span", { className: styles.mapLegendSwatch, style: { background: item.color } }), item.label] }, item.label))) })] }), _jsx("div", { className: styles.mapPlaceholder, children: _jsxs("div", { children: [_jsx("strong", { children: "Interactive map coming soon" }), _jsxs("div", { className: styles.subtleText, style: { marginTop: 8 }, children: ["Displaying ", layerLabel, ". Map tiles will render once SharePoint list data is wired in."] })] }) }), _jsx(Card, { title: "Highlights", children: _jsxs("div", { className: styles.cardList, children: [items.slice(0, 8).map(item => (_jsxs("div", { className: styles.cardListItem, children: [_jsxs("div", { className: styles.cardListHeader, children: [_jsxs("div", { children: [_jsx("div", { className: styles.cardTitle, style: { fontSize: 14 }, children: item.title }), _jsx("div", { className: styles.subtleText, children: item.subtitle })] }), _jsx(MapPin, { size: 16, color: legend[layer].color })] }), _jsxs("div", { className: styles.cardListFooter, children: [_jsx("a", { className: styles.secondaryButton, href: getLink('company', item.companyId), onClick: event => {
                                                event.preventDefault();
                                                onNavigate('company', item.companyId);
                                            }, children: "Open 360" }), _jsx("a", { className: styles.secondaryButton, href: getLink('company', item.companyId), target: "_blank", rel: "noreferrer", children: "New tab" })] })] }, item.id))), items.length === 0 && (_jsx("div", { className: styles.subtleText, children: "No records available for the selected layer." }))] }) })] }));
};
const CompanyBrief = ({ company, onBack, getLink }) => {
    const timeline = React.useMemo(() => buildTimeline(company).slice(-6).reverse(), [company]);
    const evidenceRows = React.useMemo(() => [
        ...company.publications.map(item => ({ ...item, type: 'Publication' })),
        ...company.patents.map(item => ({ ...item, type: 'Patent' })),
        ...company.news.map(item => ({ ...item, type: 'News' }))
    ], [company]);
    const pilotCount = React.useMemo(() => company.projects.filter(project => project.type.toLowerCase() === 'pilot').length, [company.projects]);
    const initials = React.useMemo(() => getInitials(company.name), [company.name]);
    return (_jsxs("div", { className: styles.briefPage, children: [_jsxs("div", { className: styles.briefActions, children: [_jsxs("button", { type: "button", className: styles.secondaryButton, onClick: onBack, children: [_jsx(ArrowLeft, { size: 16 }), " Back to dashboard"] }), _jsxs("div", { className: styles.actionBar, children: [_jsxs("a", { href: company.website, target: "_blank", rel: "noreferrer", className: styles.secondaryButton, children: [_jsx(ExternalLink, { size: 14 }), " Company site"] }), _jsxs("a", { href: getLink('company', company.id), className: styles.secondaryButton, children: [_jsx(ArrowUpRight, { size: 14 }), " Open 360 view"] }), _jsxs("button", { type: "button", className: styles.primaryButton, onClick: () => window.print(), children: [_jsx(Printer, { size: 16 }), " Print / save PDF"] })] })] }), _jsxs("div", { className: styles.briefContent, children: [_jsxs("div", { className: styles.briefHeader, children: [_jsxs("div", { style: { display: 'flex', gap: 12 }, children: [_jsx("div", { className: styles.briefLogo, children: company.logoUrl ? (_jsx("img", { src: company.logoUrl, alt: `${company.name} logo`, style: { width: '100%', height: '100%', borderRadius: 16, objectFit: 'contain' } })) : (initials) }), _jsxs("div", { children: [_jsx("h1", { className: styles.briefTitle, children: company.name }), _jsxs("div", { className: styles.briefSubtle, children: [company.approach, " \u00B7 ", company.country, " \u00B7 Founded ", company.founded] })] })] }), _jsxs("div", { className: styles.briefBlock, children: [_jsx("div", { className: styles.briefSectionTitle, children: "Updated" }), _jsx("div", { children: new Date().toLocaleDateString() }), _jsxs("div", { className: styles.briefSubtle, children: ["Freshness ", company.freshnessDays, " days"] })] })] }), _jsxs("section", { className: styles.briefSection, children: [_jsx("div", { className: styles.briefSectionTitle, children: "Executive summary" }), _jsx("p", { children: company.description })] }), _jsxs("section", { className: styles.briefSection, children: [_jsx("div", { className: styles.briefSectionTitle, children: "Key metrics" }), _jsxs("div", { className: styles.briefGrid, children: [_jsxs("div", { className: styles.briefBlock, children: [_jsx("div", { className: styles.briefSubtle, children: "Stage" }), _jsx("div", { children: company.stage })] }), _jsxs("div", { className: styles.briefBlock, children: [_jsx("div", { className: styles.briefSubtle, children: "Total funding" }), _jsx("div", { children: formatMoney(company.totalFunding) })] }), _jsxs("div", { className: styles.briefBlock, children: [_jsx("div", { className: styles.briefSubtle, children: "Projects" }), _jsxs("div", { children: [company.projects.length, " active \u00B7 ", pilotCount, " pilot(s)"] })] }), _jsxs("div", { className: styles.briefBlock, children: [_jsx("div", { className: styles.briefSubtle, children: "Collaborations" }), _jsxs("div", { children: [company.collaborations.length, " named partners"] })] })] })] }), _jsxs("section", { className: styles.briefSection, children: [_jsx("div", { className: styles.briefSectionTitle, children: "Projects & pilots" }), _jsxs("ul", { className: styles.briefList, children: [company.projects.map(project => (_jsxs("li", { children: [_jsx("strong", { children: project.name }), " \u2014 ", project.type, " in ", project.location, " (", project.status, ")"] }, `${project.name}-${project.startDate}`))), company.projects.length === 0 && _jsx("li", { children: "No projects captured yet." })] })] }), _jsxs("section", { className: styles.briefSection, children: [_jsx("div", { className: styles.briefSectionTitle, children: "Collaborations & partners" }), _jsxs("ul", { className: styles.briefList, children: [company.collaborations.slice(0, 6).map(collaboration => (_jsxs("li", { children: [_jsx("strong", { children: collaboration.with }), " \u00B7 ", collaboration.kind, " \u00B7 since ", new Date(collaboration.startDate).getFullYear()] }, `${collaboration.with}-${collaboration.startDate}`))), company.collaborations.length === 0 && _jsx("li", { children: "No collaborations captured yet." })] })] }), _jsxs("section", { className: styles.briefSection, children: [_jsx("div", { className: styles.briefSectionTitle, children: "Interactions & notes" }), _jsxs("ul", { className: styles.briefList, children: [company.interactions.map(interaction => (_jsxs("li", { children: [new Date(interaction.date).toLocaleDateString(), " \u00B7 ", capitalize(interaction.type), " \u00B7 ", interaction.summary] }, `${interaction.date}-${interaction.type}`))), company.interactions.length === 0 && _jsx("li", { children: "No interactions recorded yet." })] })] }), _jsxs("section", { className: styles.briefSection, children: [_jsx("div", { className: styles.briefSectionTitle, children: "Claims & confidence" }), _jsxs("ul", { className: styles.briefList, children: [company.claims.map(claim => (_jsxs("li", { children: [_jsx("strong", { children: claim.text }), " \u00B7 ", claim.metricType, " (", claim.unit, ") \u00B7", ' ', _jsx("span", { style: { color: ragColor(claim.trust) }, children: claim.trust }), " trust \u00B7 score ", claim.trustScore, "/100"] }, claim.id))), company.claims.length === 0 && _jsx("li", { children: "No claims captured." })] })] }), _jsxs("section", { className: styles.briefSection, children: [_jsx("div", { className: styles.briefSectionTitle, children: "Recent activity" }), _jsxs("ul", { className: styles.briefList, children: [timeline.map(event => (_jsxs("li", { children: [new Date(event.date).toLocaleDateString(), " \u00B7 ", capitalize(event.type), " \u00B7 ", event.label] }, `${event.label}-${event.date}`))), timeline.length === 0 && _jsx("li", { children: "No recent updates tracked." })] })] }), _jsxs("section", { className: styles.briefSection, children: [_jsx("div", { className: styles.briefSectionTitle, children: "Evidence digest" }), _jsxs("ul", { className: styles.briefList, children: [evidenceRows.map(item => (_jsxs("li", { children: [_jsx("strong", { children: item.type }), ": ", item.title, " (", new Date(item.date).toLocaleDateString(), ")"] }, `${item.type}-${item.title}`))), evidenceRows.length === 0 && _jsx("li", { children: "No supporting documents captured." })] })] }), company.overviewImages?.length ? (_jsxs("section", { className: styles.briefSection, children: [_jsx("div", { className: styles.briefSectionTitle, children: "Overview imagery" }), _jsx("div", { className: styles.briefImageGrid, children: company.overviewImages.map((media, index) => (_jsxs("figure", { className: styles.briefImageCard, children: [_jsx("div", { className: styles.briefImageFrame, children: _jsx("img", { src: media.src, alt: media.caption ?? `${company.name} figure ${index + 1}` }) }), media.caption && _jsx("figcaption", { className: styles.briefImageCaption, children: media.caption })] }, `${company.id}-brief-image-${index}`))) })] })) : null] })] }));
};
const MockDashboard = () => {
    React.useEffect(() => {
        // eslint-disable-next-line no-console
        console.log('[MockDashboard.tsx] rendering updated heatmap view');
    }, []);
    const [tab, setTab] = React.useState('home');
    const [viewMode, setViewMode] = React.useState('dashboard');
    const [mode, setMode] = React.useState('read');
    const [headerQuery, setHeaderQuery] = React.useState('');
    const [companies, setCompanies] = React.useState([]);
    const [selectedCompany, setSelectedCompany] = React.useState(null);
    const selectedCompanyRef = React.useRef(null);
    const [feedItems, setFeedItems] = React.useState([]);
    const [curatorPanel, setCuratorPanel] = React.useState(null);
    const [curatorPanelError, setCuratorPanelError] = React.useState(undefined);
    const [curatorPanelSaving, setCuratorPanelSaving] = React.useState(false);
    const [orgPanelOpen, setOrgPanelOpen] = React.useState(false);
    const [orgPanelError, setOrgPanelError] = React.useState(undefined);
    const [isLoading, setIsLoading] = React.useState(true);
    const [loadError, setLoadError] = React.useState(null);
    const providerRef = React.useRef(new MockProvider());
    const backgroundStyle = React.useMemo(() => ({
        '--bg-color': COLORS.bg
    }), []);
    React.useEffect(() => {
        selectedCompanyRef.current = selectedCompany ? cloneCompany(selectedCompany) : null;
    }, [selectedCompany]);
    React.useEffect(() => {
        let cancelled = false;
        const loadData = async () => {
            setIsLoading(true);
            setLoadError(null);
            try {
                const provider = providerRef.current;
                const orgs = await provider.searchEntities();
                const orgLookup = new Map(orgs.map(org => [org.id, org]));
                const results = await Promise.all(orgs.map(async (org) => {
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
                }));
                if (cancelled) {
                    return;
                }
                const hydratedCompanies = results.map(result => cloneCompany(result.company));
                const newsFeed = [];
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
                }
                else {
                    setSelectedCompany(null);
                    selectedCompanyRef.current = null;
                }
            }
            catch (error) {
                if (!cancelled) {
                    setLoadError(getErrorMessage(error));
                    setCompanies([]);
                    setFeedItems([]);
                    setSelectedCompany(null);
                    selectedCompanyRef.current = null;
                }
            }
            finally {
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
    const getLink = React.useCallback((view, orgId, extra) => {
        const hash = buildHash(view, orgId, extra);
        return baseUrl ? `${baseUrl}#${hash}` : `#${hash}`;
    }, [baseUrl]);
    const getLinkWithState = React.useCallback((view, orgId, extra) => getLink(view, orgId, { mode, q: headerQuery, ...extra }), [getLink, mode, headerQuery]);
    const applyCompanyUpdate = React.useCallback((orgId, updater) => {
        let updatedCompany = null;
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
    const openCuratorPanel = React.useCallback((panel) => {
        if (mode !== 'curator') {
            return;
        }
        setCuratorPanelError(undefined);
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
        }
        else {
            window.location.hash = hash;
        }
    }, []);
    const handleAddStartup = React.useCallback(async (org) => {
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
            const newCompany = {
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
        }
        catch (error) {
            setOrgPanelError(getErrorMessage(error));
        }
    }, [companies, headerQuery, navigate]);
    const handleCuratorPanelSubmit = React.useCallback(async (payload) => {
        if (!curatorPanel) {
            return;
        }
        const panel = curatorPanel;
        setCuratorPanelSaving(true);
        setCuratorPanelError(undefined);
        try {
            switch (panel.type) {
                case 'project': {
                    const projectPayload = payload;
                    await providerRef.current.proposeWrite('dossier_text', { action: 'project', orgId: panel.orgId, payload: projectPayload });
                    applyCompanyUpdate(panel.orgId, company => ({
                        ...company,
                        projects: [
                            ...company.projects,
                            {
                                name: projectPayload.name,
                                type: projectPayload.type ?? 'Project',
                                location: projectPayload.location ?? '—',
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
                    const collabPayload = payload;
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
                    const interactionPayload = payload;
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
                    const claimPayload = payload;
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
                    const evidencePayload = payload;
                    await providerRef.current.proposeWrite('dossier_text', {
                        action: 'evidence',
                        orgId: panel.orgId,
                        claimId: panel.claimId,
                        payload: evidencePayload
                    });
                    applyCompanyUpdate(panel.orgId, company => ({
                        ...company,
                        claims: company.claims.map(claim => claim.id === panel.claimId
                            ? {
                                ...claim,
                                evidence: [
                                    ...claim.evidence,
                                    { type: evidencePayload.type, title: evidencePayload.title, url: evidencePayload.url, date: evidencePayload.date }
                                ]
                            }
                            : claim)
                    }));
                    break;
                }
                case 'image': {
                    const imagePayload = payload;
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
        }
        catch (error) {
            setCuratorPanelError(getErrorMessage(error));
            throw error;
        }
        finally {
            setCuratorPanelSaving(false);
        }
    }, [applyCompanyUpdate, curatorPanel, dismissCuratorPanel]);
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
            }
            else {
                setViewMode('dashboard');
                setTab(view);
                if (view === 'company' && company && (!selectedCompanyRef.current || company.id !== selectedCompanyRef.current.id)) {
                    setSelectedCompany(cloneCompany(company));
                }
            }
            if (typeof q === 'string')
                setHeaderQuery(q);
            setMode(mode === 'curator' ? 'curator' : 'read');
        };
        applyRoute();
        window.addEventListener('hashchange', applyRoute);
        return () => window.removeEventListener('hashchange', applyRoute);
    }, [companies]);
    const handleTabClick = (tabId) => {
        setViewMode('dashboard');
        setTab(tabId);
        const orgId = tabId === 'company' || tabId === 'map' ? selectedCompanyRef.current?.id : undefined;
        navigate(tabId, orgId, { mode, q: headerQuery });
    };
    const handleSelectCompany = (companyId) => {
        const company = findCompanyById(companies, companyId);
        if (!company) {
            return;
        }
        setSelectedCompany(cloneCompany(company));
        if (viewMode === 'brief') {
            navigate('brief', company.id, { mode, q: headerQuery });
        }
        else if (tab === 'company') {
            navigate('company', company.id, { mode, q: headerQuery });
        }
        else if (tab === 'map') {
            navigate('map', company.id, { mode, q: headerQuery });
        }
    };
    const handleNavigate = (view, orgId) => {
        if (view === 'brief') {
            setViewMode('brief');
        }
        else {
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
    const handleOpenBrief = (company, openInNewTab) => {
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
    const handleBackFromBrief = () => {
        setViewMode('dashboard');
        setTab('company');
        navigate('company', selectedCompanyRef.current?.id, { mode, q: headerQuery });
    };
    if (isLoading) {
        return (_jsx("div", { className: styles.dashboard, style: backgroundStyle, children: _jsx("div", { className: styles.subtleText, style: { margin: '120px auto', textAlign: 'center' }, children: "Loading mock data\u2026" }) }));
    }
    if (loadError) {
        return (_jsx("div", { className: styles.dashboard, style: backgroundStyle, children: _jsx("div", { className: styles.subtleText, style: { margin: '120px auto', textAlign: 'center', color: COLORS.red }, children: loadError }) }));
    }
    if (!selectedCompany) {
        return (_jsx("div", { className: styles.dashboard, style: backgroundStyle, children: _jsx("div", { className: styles.subtleText, style: { margin: '120px auto', textAlign: 'center' }, children: "No organizations available in mock data." }) }));
    }
    if (viewMode === 'brief') {
        if (!selectedCompanyRef.current) {
            return (_jsx("div", { className: styles.dashboard, style: backgroundStyle, children: _jsx("div", { className: styles.subtleText, style: { margin: '120px auto', textAlign: 'center' }, children: "Loading brief\u2026" }) }));
        }
        return (_jsx("div", { className: styles.dashboard, style: backgroundStyle, children: _jsx(CompanyBrief, { company: selectedCompanyRef.current, onBack: handleBackFromBrief, getLink: getLinkWithState }) }));
    }
    return (_jsxs("div", { className: styles.dashboard, style: backgroundStyle, children: [_jsx("header", { className: styles.header, children: _jsxs("div", { className: styles.headerContent, children: [_jsxs("div", { className: styles.headerLeft, children: [_jsx("div", { className: styles.logo, children: "TE" }), _jsxs("div", { children: [_jsx("div", { className: styles.headerText, children: "CCUS Scouting \u2014 DAC (Mock)" }), _jsx("div", { className: styles.headerSubtitle, children: "Power BI front-end concept \u00B7 mock data \u00B7 TotalEnergies-inspired UI" })] })] }), _jsxs("div", { className: styles.headerControls, children: [_jsxs("div", { className: styles.search, children: [_jsx(Search, { size: 16, color: COLORS.slate }), _jsx("input", { className: styles.searchInput, placeholder: "Global search\u2026", value: headerQuery, onChange: e => setHeaderQuery(e.target.value), onKeyDown: e => {
                                                if (e.key === 'Enter') {
                                                    navigate('finder', undefined, { q: headerQuery, mode });
                                                }
                                            } })] }), _jsx("button", { type: "button", className: styles.secondaryButton, onClick: () => {
                                        const next = mode === 'read' ? 'curator' : 'read';
                                        setMode(next);
                                        navigate(tab, selectedCompanyRef.current?.id, { mode: next, q: headerQuery });
                                    }, title: "Toggle mode", children: mode === 'read' ? 'Read-only' : 'Curator' }), mode === 'curator' && (_jsx("button", { type: "button", className: styles.primaryButton, onClick: () => {
                                        setOrgPanelError(undefined);
                                        setOrgPanelOpen(true);
                                    }, children: "+ Add startup" }))] })] }) }), _jsxs("div", { className: styles.layout, children: [_jsxs("aside", { className: styles.sidebar, children: [TABS.map(tabItem => {
                                const isActive = tab === tabItem.id;
                                const className = `${styles.sidebarButton} ${isActive ? styles.sidebarButtonActive : ''}`;
                                return (_jsxs("button", { type: "button", className: className, onClick: () => handleTabClick(tabItem.id), children: [_jsx(tabItem.icon, { size: 16, color: isActive ? '#ffffff' : '#1f2937' }), tabItem.label] }, tabItem.id));
                            }), _jsx("div", { className: styles.sidebarDivider, children: "Demo controls" }), _jsxs("div", { className: styles.sidebarControl, children: [_jsx("label", { className: styles.sidebarLabel, htmlFor: "mock-company-select", children: "Select company" }), _jsx("select", { id: "mock-company-select", className: styles.sidebarSelect, value: selectedCompany.id, onChange: event => handleSelectCompany(event.target.value), children: companies.map(company => (_jsx("option", { value: company.id, children: company.name }, company.id))) })] }), _jsxs("div", { className: styles.sidebarControl, children: [_jsx("label", { className: styles.sidebarLabel, children: "Mode" }), _jsxs("div", { className: styles.chipRow, children: [_jsx(Chip, { active: mode === 'read', onClick: () => { setMode('read'); navigate(tab, selectedCompanyRef.current?.id, { mode: 'read', q: headerQuery }); }, children: "Read-only" }), _jsx(Chip, { active: mode === 'curator', onClick: () => { setMode('curator'); navigate(tab, selectedCompanyRef.current?.id, { mode: 'curator', q: headerQuery }); }, children: "Curator" })] })] })] }), _jsxs("main", { className: styles.main, children: [tab === 'home' && (_jsx(HomePage, { companies: companies, onNavigate: handleNavigate, getLink: getLinkWithState, newsFeed: feedItems })), tab === 'finder' && (_jsx(FinderPage, { companies: companies, onNavigate: handleNavigate, getLink: getLinkWithState, initialQuery: headerQuery, mode: mode })), tab === 'company' && (_jsx(Company360Page, { company: selectedCompany, onNavigate: handleNavigate, getLink: getLinkWithState, onOpenBrief: handleOpenBrief, openCuratorPanel: openCuratorPanel, mode: mode })), tab === 'funding' && _jsx(FundingDealsPage, { companies: companies }), tab === 'pubs' && _jsx(PublicationsPatentsPage, { companies: companies }), tab === 'map' && (_jsx(MapPage, { companies: companies, onNavigate: handleNavigate, getLink: getLinkWithState })), tab === 'stale' && _jsx(StalenessPage, { companies: companies })] })] }), _jsx("footer", { className: styles.footer, children: "Mock dashboard for illustration. Colors approximate TotalEnergies branding; data are fictional or simplified." }), mode === 'curator' && curatorPanel && (_jsxs(Panel, { isOpen: true, onDismiss: dismissCuratorPanel, type: PanelType.medium, headerText: curatorPanelTitle, closeButtonAriaLabel: "Close curator action", isLightDismiss: !curatorPanelSaving, children: [curatorPanelError && (_jsx("div", { className: styles.subtleText, style: { color: COLORS.red, marginBottom: 12 }, children: curatorPanelError })), curatorPanel.type === 'project' && (_jsx(CuratorProjectForm, { onSubmit: handleCuratorPanelSubmit, onCancel: dismissCuratorPanel, submitting: curatorPanelSaving }, `${curatorPanel.orgId}-project`)), curatorPanel.type === 'collab' && (_jsx(CuratorCollabForm, { onSubmit: handleCuratorPanelSubmit, onCancel: dismissCuratorPanel, submitting: curatorPanelSaving }, `${curatorPanel.orgId}-collab`)), curatorPanel.type === 'interaction' && (_jsx(CuratorInteractionForm, { onSubmit: handleCuratorPanelSubmit, onCancel: dismissCuratorPanel, submitting: curatorPanelSaving }, `${curatorPanel.orgId}-interaction`)), curatorPanel.type === 'claim' && (_jsx(CuratorClaimForm, { onSubmit: handleCuratorPanelSubmit, onCancel: dismissCuratorPanel, submitting: curatorPanelSaving }, `${curatorPanel.orgId}-claim`)), curatorPanel.type === 'evidence' && (_jsx(CuratorEvidenceForm, { onSubmit: handleCuratorPanelSubmit, onCancel: dismissCuratorPanel, submitting: curatorPanelSaving }, `${curatorPanel.orgId}-evidence-${curatorPanel.claimId}`)), curatorPanel.type === 'image' && (_jsx(CuratorImageForm, { onSubmit: handleCuratorPanelSubmit, onCancel: dismissCuratorPanel, submitting: curatorPanelSaving }, `${curatorPanel.orgId}-image`))] })), mode === 'curator' && (_jsx(Panel, { isOpen: orgPanelOpen, onDismiss: () => setOrgPanelOpen(false), type: PanelType.medium, headerText: "Add startup", closeButtonAriaLabel: "Close", children: _jsx(CuratorOrgForm, { onSubmit: handleAddStartup, onCancel: () => setOrgPanelOpen(false), error: orgPanelError }) }))] }));
};
export default MockDashboard;
