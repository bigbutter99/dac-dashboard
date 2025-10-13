import { EntityType, ProjectType, RAG, RelationType, Stage, Trust } from './IDataProvider';
const ORGS = [
    { id: 'org-climeworks', slug: 'climeworks', entityType: EntityType.Org, name: 'Climeworks', orgKind: 'technology_vendor', stage: Stage.CommercialPilot, approach: 'S-DAC (solid sorbent)', description: 'Builds modular solid-sorbent DAC plants (e.g., Orca, Mammoth). Focus on high-up-time modular arrays and renewable integration.', country: 'Switzerland', website: 'https://www.climeworks.com', foundedYear: 2009, totalFundingUsd: 850_000_000, freshnessDays: 11, aliases: ['Clime Works'], logoUrl: 'https://placehold.co/80x80/FFE5E9/7A1624?text=CL' },
    { id: 'org-carbon-engineering', slug: 'carbon-engineering', entityType: EntityType.Org, name: 'Carbon Engineering', orgKind: 'technology_vendor', stage: Stage.Demo, approach: 'L-DAC (liquid solvent)', description: 'Liquid-solvent DAC using KOH capture and CaCO₃ calcination; large-scale partnership approach.', country: 'Canada', website: 'https://carbonengineering.com', foundedYear: 2009, totalFundingUsd: 500_000_000, freshnessDays: 23, aliases: ['CE', 'Carbon Eng'], logoUrl: 'https://placehold.co/80x80/E4F1FF/0B1D35?text=CE' },
    { id: 'org-heirloom', slug: 'heirloom', entityType: EntityType.Org, name: 'Heirloom', orgKind: 'technology_vendor', stage: Stage.Pilot, approach: 'M-DAC (mineral looping)', description: 'Mineralization loop leveraging calcium oxide cycle; rapid carbonation surfaces with engineered trays.', country: 'USA', website: 'https://www.heirloomcarbon.com', foundedYear: 2020, totalFundingUsd: 250_000_000, freshnessDays: 6, logoUrl: 'https://placehold.co/80x80/F4F1FF/22115A?text=HE' },
    { id: 'org-carbfix', slug: 'carbfix', entityType: EntityType.Org, name: 'Carbfix', orgKind: 'storage_partner', stage: Stage.Commercial, approach: 'CO₂ mineralization storage', description: 'Icelandic subsurface injection and mineralization operator partnering with DAC vendors.', country: 'Iceland', website: 'https://www.carbfix.com', foundedYear: 2007, freshnessDays: 14, logoUrl: 'https://placehold.co/80x80/E4FFF5/0B5730?text=CF' },
    { id: 'org-microsoft', slug: 'microsoft', entityType: EntityType.Org, name: 'Microsoft', orgKind: 'buyer', stage: Stage.Commercial, approach: 'Corporate carbon removal procurement', description: 'Enterprise-scale offtake buyer with multi-year DAC commitments.', country: 'USA', website: 'https://www.microsoft.com', foundedYear: 1975, freshnessDays: 3, logoUrl: 'https://placehold.co/80x80/EBF4FF/1E3A8A?text=MS' }
];
const FUNDING_ROUNDS = [
    { id: 'round-climeworks-2022', orgId: 'org-climeworks', announced_on: '2022-04-01', round: 'Equity', amountUsd: 650_000_000, investors: ['GIC', 'OTHERS'], source: 'news' },
    { id: 'round-climeworks-2020', orgId: 'org-climeworks', announced_on: '2020-05-10', round: 'Equity', amountUsd: 75_000_000, investors: ['Private'], source: 'news' },
    { id: 'round-carbon-engineering-2019', orgId: 'org-carbon-engineering', announced_on: '2019-03-01', round: 'Equity', amountUsd: 68_000_000, investors: ['Chevron', 'Oxy', 'BHP'], source: 'news' },
    { id: 'round-carbon-engineering-2021', orgId: 'org-carbon-engineering', announced_on: '2021-03-10', round: 'Grant', amountUsd: 25_000_000, investors: ['Government of Canada'], source: 'news' },
    { id: 'round-heirloom-2023', orgId: 'org-heirloom', announced_on: '2023-10-12', round: 'Series B', amountUsd: 53_000_000, investors: ['Breakthrough Energy Ventures'], source: 'news' }
];
const INTERACTIONS = [
    { id: 'interaction-climeworks-2024-02-14', orgId: 'org-climeworks', occurred_on: '2024-02-14', type: 'meeting', attendees: ['TTE New Energy'], summary: 'Intro on offtake potential' },
    { id: 'interaction-climeworks-2024-11-07', orgId: 'org-climeworks', occurred_on: '2024-11-07', type: 'site_visit', attendees: ['TTE CCUS'], summary: 'Mammoth status review' },
    { id: 'interaction-carbon-engineering-2024-05-20', orgId: 'org-carbon-engineering', occurred_on: '2024-05-20', type: 'call', attendees: ['TTE Strategy'], summary: 'Introductory call on DAC 1A' },
    { id: 'interaction-heirloom-2025-03-04', orgId: 'org-heirloom', occurred_on: '2025-03-04', type: 'meeting', attendees: ['TTE Ventures'], summary: 'Technology roadmap discussion' }
];
const MEDIA_ASSETS = [
    { id: 'media-climeworks-1', orgId: 'org-climeworks', src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80', caption: 'Modular solid sorbent array concept (mock)' },
    { id: 'media-carbon-engineering-1', orgId: 'org-carbon-engineering', src: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=80', caption: 'Solvent loop schematic (illustrative)' }
];
const PROJECTS = [
    { id: 'project-orca', orgId: 'org-climeworks', name: 'Orca', projectType: ProjectType.Pilot, stage: Stage.Commercial, status: 'Operating', location: 'Iceland', capacity_tCO2_per_year: 4_000, start_date: '2021-09-01', partners: ['org-carbfix'] },
    { id: 'project-mammoth', orgId: 'org-climeworks', name: 'Mammoth', projectType: ProjectType.Demo, stage: Stage.Demo, status: 'Construction', location: 'Iceland', capacity_tCO2_per_year: 36_000, start_date: '2023-06-01', partners: ['org-carbfix'] },
    { id: 'project-dac1a', orgId: 'org-carbon-engineering', name: 'Direct Air Capture 1A', projectType: ProjectType.Demo, stage: Stage.Demo, status: 'Development', location: 'Permian Basin (US)', capacity_tCO2_per_year: 500_000, start_date: '2024-10-01', partners: ['org-microsoft'] },
    { id: 'project-tracy', orgId: 'org-heirloom', name: 'Tracy Pilot', projectType: ProjectType.Pilot, stage: Stage.Pilot, status: 'Operating', location: 'Tracy, CA', capacity_tCO2_per_year: 1_000, start_date: '2023-11-01', partners: ['org-microsoft'] }
];
const EVIDENCE = [
    { id: 'evidence-climeworks-lca', claimId: 'claim-climeworks-energy', kind: 'publication', title: 'Peer-reviewed LCA on Orca energy performance', url: '#', published_on: '2023-09-01' },
    { id: 'evidence-climeworks-datasheet', claimId: 'claim-climeworks-energy', kind: 'news', title: 'Plant datasheet release', url: '#', published_on: '2024-03-12' },
    { id: 'evidence-climeworks-cost', claimId: 'claim-climeworks-cost', kind: 'news', title: 'Company blog post on capture costs', url: '#', published_on: '2024-05-22' },
    { id: 'evidence-carbon-engineering-patent', claimId: 'claim-carbon-engineering-heat', kind: 'patent', title: 'Heat recovery for DAC process', url: '#', published_on: '2023-02-01' },
    { id: 'evidence-heirloom-scale', claimId: 'claim-heirloom-scale', kind: 'publication', title: 'Mineral loop pilot performance brief', url: '#', published_on: '2024-04-16' }
];
const CLAIMS = [
    { id: 'claim-climeworks-energy', orgId: 'org-climeworks', statement: 'Specific energy use 1,800–2,200 kWh/tCO₂ at plant scale', metric: 'energy_use', unit: 'kWh/tCO2', min: 1_800, ml: 2_000, max: 2_200, trust: Trust.Medium, rag: RAG.Amber, asserted_on: '2024-03-12', valid_from: '2023-09-01', valid_to: undefined },
    { id: 'claim-climeworks-cost', orgId: 'org-climeworks', statement: 'Capture cost <$600/t at current generation', metric: 'lcoc', unit: 'USD/tCO2', min: 450, ml: 580, max: 650, trust: Trust.Low, rag: RAG.Red, asserted_on: '2024-05-22', valid_from: '2024-01-01', valid_to: undefined },
    { id: 'claim-carbon-engineering-heat', orgId: 'org-carbon-engineering', statement: 'Heat integration reduces energy by 12–18% vs prior design', metric: 'energy_reduction', unit: '%', min: 12, ml: 15, max: 18, trust: Trust.High, rag: RAG.Green, asserted_on: '2023-02-01', valid_from: '2023-02-01', valid_to: '2025-02-01' },
    { id: 'claim-heirloom-scale', orgId: 'org-heirloom', statement: 'Tray design enables 1kt/y capture within 18 months from build', metric: 'scale_rate', unit: 'tCO2/year', min: 900, ml: 1_000, max: 1_200, trust: Trust.Medium, rag: RAG.Green, asserted_on: '2024-04-16', valid_from: '2024-04-16', valid_to: undefined }
];
const RELATIONS = [
    { id: 'rel-climeworks-carbfix-storage', sourceId: 'org-climeworks', targetId: 'org-carbfix', type: RelationType.Storage, since: '2021-06-01', description: 'Carbfix provides subsurface mineralization for Orca and Mammoth', confidence: Trust.High },
    { id: 'rel-climeworks-microsoft-offtake', sourceId: 'org-microsoft', targetId: 'org-climeworks', type: RelationType.Offtake, since: '2023-01-10', description: 'Microsoft multi-year offtake for Climeworks plants', confidence: Trust.Medium },
    { id: 'rel-carbon-engineering-microsoft-collab', sourceId: 'org-carbon-engineering', targetId: 'org-microsoft', type: RelationType.Collaboration, since: '2024-05-20', description: 'Strategic collaboration around DAC 1A procurement', confidence: Trust.Medium },
    { id: 'rel-heirloom-microsoft-offtake', sourceId: 'org-microsoft', targetId: 'org-heirloom', type: RelationType.Offtake, since: '2024-03-01', description: 'Offtake agreement tied to Tracy pilot volumes', confidence: Trust.Medium },
    { id: 'rel-heirloom-carbfix-technology', sourceId: 'org-heirloom', targetId: 'org-carbfix', type: RelationType.Technology, since: '2024-09-15', description: 'Exploring mineralization logistics for future sites', confidence: Trust.Low }
];
const DOCUMENTS = [
    { id: 'doc-climeworks-news-2025-04-18', orgId: 'org-climeworks', kind: 'news', title: 'Mammoth modules delivered', url: '#', published_on: '2025-04-18', source: 'External' },
    { id: 'doc-climeworks-publication-2023-07-10', orgId: 'org-climeworks', kind: 'publication', title: 'DAC sorbent aging study', url: '#', published_on: '2023-07-10', source: 'External' },
    { id: 'doc-climeworks-patent-2022-11-05', orgId: 'org-climeworks', kind: 'patent', title: 'Modular contactor array', url: '#', published_on: '2022-11-05', source: 'External' },
    { id: 'doc-carbon-engineering-news-2025-01-15', orgId: 'org-carbon-engineering', kind: 'news', title: 'Project 1A FEED complete', url: '#', published_on: '2025-01-15', source: 'External' },
    { id: 'doc-carbon-engineering-publication-2022-10-01', orgId: 'org-carbon-engineering', kind: 'publication', title: 'Solvent regeneration kinetics', url: '#', published_on: '2022-10-01', source: 'External' },
    { id: 'doc-carbon-engineering-patent-2021-06-01', orgId: 'org-carbon-engineering', kind: 'patent', title: 'Pellet reactor optimization', url: '#', published_on: '2021-06-01', source: 'External' },
    { id: 'doc-heirloom-news-2024-12-12', orgId: 'org-heirloom', kind: 'news', title: 'Tracy pilot hits nameplate capacity', url: '#', published_on: '2024-12-12', source: 'External' },
    { id: 'doc-heirloom-publication-2024-04-16', orgId: 'org-heirloom', kind: 'publication', title: 'Mineral loop pilot performance brief', url: '#', published_on: '2024-04-16', source: 'External' }
];
const SIGNALS = [
    { id: 'signal-climeworks-energy-risk', entityId: 'org-climeworks', rag: RAG.Amber, message: 'Energy intensity remains above 1,800 kWh/tCO2 at current loads.', updated_on: '2025-03-28', tags: ['energy', 'performance'], source: 'Analyst note' },
    { id: 'signal-heirloom-scale-risk', entityId: 'org-heirloom', rag: RAG.Green, message: 'Pilot meeting throughput milestones for 2025 procurement.', updated_on: '2025-04-20', tags: ['scale', 'execution'], source: 'Vendor update' },
    { id: 'signal-carbon-engineering-policy', entityId: 'org-carbon-engineering', rag: RAG.Amber, message: 'Awaiting clarity on US IRA transferability for DAC 1A project.', updated_on: '2025-03-15', tags: ['policy', 'financing'], source: 'Policy tracker' }
];
let drafts = [];
const hydrateOrg = (record) => ({
    ...record,
    fundingRounds: FUNDING_ROUNDS.filter(round => round.orgId === record.id).map(round => ({ ...round })),
    interactions: INTERACTIONS.filter(interaction => interaction.orgId === record.id).map(interaction => ({ ...interaction })),
    overviewImages: MEDIA_ASSETS.filter(asset => asset.orgId === record.id).map(asset => ({ ...asset }))
});
const hydrateClaim = (record) => ({
    ...record,
    evidence: EVIDENCE.filter(item => item.claimId === record.id).map(item => ({ ...item }))
});
const matchesFilter = (record, q, filters) => {
    const haystack = [record.name, record.approach, record.country, ...(record.aliases ?? [])]
        .join(' ')
        .toLowerCase();
    const qMatch = q ? haystack.indexOf(q.toLowerCase()) !== -1 : true;
    if (!filters) {
        return qMatch;
    }
    let matchesStage = true;
    const stageFilter = filters.stage;
    if (Array.isArray(stageFilter)) {
        matchesStage = stageFilter.indexOf(record.stage) !== -1;
    }
    else if (typeof stageFilter === 'string') {
        matchesStage = record.stage === stageFilter;
    }
    let matchesKind = true;
    const kindFilter = filters.orgKind;
    if (Array.isArray(kindFilter)) {
        matchesKind = kindFilter.indexOf(record.orgKind) !== -1;
    }
    else if (typeof kindFilter === 'string') {
        matchesKind = record.orgKind === kindFilter;
    }
    return qMatch && matchesStage && matchesKind;
};
const todayIso = () => new Date().toISOString().slice(0, 10);
export default class MockProvider {
    async searchEntities(q, filters) {
        return ORGS.filter(record => matchesFilter(record, q, filters)).map(record => hydrateOrg(record));
    }
    async getEntityBySlug(slug) {
        let match;
        for (let index = 0; index < ORGS.length; index++) {
            const candidate = ORGS[index];
            if (candidate.slug === slug) {
                match = candidate;
                break;
            }
        }
        return match ? hydrateOrg(match) : undefined;
    }
    async getProjects(orgId) {
        return PROJECTS.filter(project => project.orgId === orgId).map(project => ({ ...project, partners: project.partners ? [...project.partners] : undefined }));
    }
    async getClaims(orgId) {
        return CLAIMS.filter(claim => claim.orgId === orgId).map(claim => hydrateClaim(claim));
    }
    async getRelations(entityId, opts) {
        return RELATIONS.filter(relation => {
            if (relation.sourceId !== entityId && relation.targetId !== entityId) {
                return false;
            }
            if (opts?.types && opts.types.indexOf(relation.type) === -1) {
                return false;
            }
            if (opts?.since && relation.since && relation.since < opts.since) {
                return false;
            }
            return true;
        }).map(relation => ({ ...relation }));
    }
    async getDocuments(orgId) {
        return DOCUMENTS.filter(document => document.orgId === orgId).map(document => ({ ...document }));
    }
    async getSignals(filters) {
        const entityId = typeof filters?.entityId === 'string' ? filters.entityId : undefined;
        const rag = typeof filters?.rag === 'string' ? filters.rag : undefined;
        return SIGNALS.filter(signal => (entityId ? signal.entityId === entityId : true) && (rag ? signal.rag === rag : true)).map(signal => ({ ...signal, tags: signal.tags ? [...signal.tags] : undefined }));
    }
    async listDrafts() {
        return drafts.map(draft => JSON.parse(JSON.stringify(draft)));
    }
    async proposeWrite(kind, payload) {
        const draft = { id: `draft-${Date.now().toString(36)}`, kind, payload, created_on: todayIso(), state: 'proposed' };
        drafts = [...drafts, draft];
        return { draftId: draft.id };
    }
    async approveWrite(draftId) {
        drafts = drafts.filter(draft => draft.id !== draftId);
    }
    async askAI(query, ctx) {
        const contextSuffix = ctx?.entityId ? ` for entity ${ctx.entityId}` : '';
        return {
            answer: `This is a stubbed AI answer about "${query}"${contextSuffix}.`,
            citations: [
                { title: 'IEA DAC report (mock)', url: '#' },
                { title: 'Company disclosure (mock)', url: '#' },
                { title: 'Analyst synthesis (mock)', url: '#' }
            ]
        };
    }
    async validateDossier(json) {
        return { ok: true, errors: [], warnings: [], patched: json };
    }
}
