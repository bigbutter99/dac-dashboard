export class MockProvider {
    companies;
    constructor(companies) {
        this.companies = companies;
    }
    async searchOrgs(filters) {
        const q = (filters.q || '').trim().toLowerCase();
        const ids = this.companies.filter(c => {
            const text = `${c.name} ${c.approach} ${c.country} ${c.description || ''}`.toLowerCase();
            const matchQ = q ? text.includes(q) : true;
            const matchApproach = filters.approaches && filters.approaches.length ? filters.approaches.includes(c.approach) : true;
            const matchStage = filters.stages && filters.stages.length ? filters.stages.includes(c.stage) : true;
            const matchPilot = filters.hasActivePilot ? c.projects?.some((p) => (p.type || '').toLowerCase() === 'pilot' && (p.status || '').toLowerCase() !== 'planned') : true;
            const matchFunding = filters.maxFundingUsd ? (c.totalFunding || 0) <= filters.maxFundingUsd : true;
            return matchQ && matchApproach && matchStage && matchPilot && matchFunding;
        }).map(c => c.id);
        return Promise.resolve(ids);
    }
    async getNews(sinceDays = 30) {
        const cutoff = Date.now() - sinceDays * 24 * 60 * 60 * 1000;
        const items = [];
        for (const c of this.companies) {
            (c.news || []).forEach((n, i) => {
                items.push({
                    id: `${c.id}-news-${i}`,
                    date: n.date,
                    title: n.title,
                    type: 'News',
                    source: 'External',
                    link: n.link,
                    orgIds: [c.id]
                });
            });
            (c.publications || []).forEach((p, i) => {
                items.push({
                    id: `${c.id}-pub-${i}`,
                    date: p.date,
                    title: p.title,
                    type: 'Publication',
                    source: 'External',
                    link: p.link,
                    orgIds: [c.id]
                });
            });
            (c.patents || []).forEach((p, i) => {
                items.push({
                    id: `${c.id}-pat-${i}`,
                    date: p.date,
                    title: p.title,
                    type: 'Patent',
                    source: 'External',
                    link: p.link,
                    orgIds: [c.id]
                });
            });
        }
        return Promise.resolve(items.filter(i => new Date(i.date).getTime() >= cutoff).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
    findCompany(orgId) {
        const c = this.companies.find(c => c.id === orgId);
        if (!c)
            throw new Error('Org not found');
        return c;
    }
    async addOrganization(org) {
        const id = org.slug || `org-${Date.now().toString(36)}`;
        if (this.companies.some(c => c.id === id)) {
            throw new Error('Organization already exists');
        }
        const newOrg = {
            id,
            name: org.name,
            website: org.website || '#',
            country: org.country,
            approach: org.approach,
            stage: org.stage,
            founded: org.founded ?? new Date().getFullYear(),
            totalFunding: 0,
            freshnessDays: 0,
            description: org.description || '',
            aliases: [],
            collaborations: [],
            fundingRounds: [],
            projects: [],
            interactions: [],
            claims: [],
            publications: [],
            patents: [],
            news: [],
            overviewImages: [],
            logoUrl: org.logoUrl || undefined
        };
        this.companies.push(newOrg);
        return id;
    }
    async addProject(orgId, project) {
        const c = this.findCompany(orgId);
        c.projects = c.projects || [];
        c.projects.push({
            name: project.name,
            type: project.type,
            location: project.location,
            status: project.status,
            startDate: project.startDate,
            capacity: project.capacity || 0,
            partners: project.partners || []
        });
    }
    async addCollaboration(orgId, collab) {
        const c = this.findCompany(orgId);
        c.collaborations = c.collaborations || [];
        c.collaborations.push({ with: collab.with, kind: collab.kind, startDate: collab.startDate });
    }
    async addInteraction(orgId, interaction) {
        const c = this.findCompany(orgId);
        c.interactions = c.interactions || [];
        c.interactions.push({
            date: interaction.date,
            type: interaction.type,
            attendees: interaction.attendees || [],
            summary: interaction.summary || ''
        });
    }
    async addClaim(orgId, claim) {
        const c = this.findCompany(orgId);
        c.claims = c.claims || [];
        const id = `clm-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
        c.claims.push({
            id,
            text: claim.text,
            metricType: claim.metricType,
            unit: claim.unit,
            min: claim.min ?? null,
            ml: claim.ml ?? null,
            max: claim.max ?? null,
            trust: claim.trust,
            trustScore: claim.trustScore ?? 50,
            evidence: []
        });
        return id;
    }
    async addClaimEvidence(orgId, claimId, evidence) {
        const c = this.findCompany(orgId);
        const cl = (c.claims || []).find((x) => x.id === claimId);
        if (!cl)
            throw new Error('Claim not found');
        cl.evidence = cl.evidence || [];
        cl.evidence.push({ type: evidence.type, title: evidence.title, url: evidence.url, date: evidence.date });
    }
    async addOverviewImage(orgId, image) {
        const c = this.findCompany(orgId);
        c.overviewImages = c.overviewImages || [];
        c.overviewImages.push({
            src: image.src,
            caption: image.caption || undefined
        });
    }
}
