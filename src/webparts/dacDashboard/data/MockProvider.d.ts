import type { AskAiContext, Claim, Document, Draft, IDataProvider, Id, Org, Project, Relation, Signal } from './IDataProvider';
import { RelationType } from './IDataProvider';
export default class MockProvider implements IDataProvider {
    searchEntities(q?: string, filters?: Record<string, unknown>): Promise<Org[]>;
    getEntityBySlug(slug: string): Promise<Org | undefined>;
    getProjects(orgId: Id): Promise<Project[]>;
    getClaims(orgId: Id): Promise<Claim[]>;
    getRelations(entityId: Id, opts?: {
        since?: string;
        types?: RelationType[];
    }): Promise<Relation[]>;
    getDocuments(orgId: Id): Promise<Document[]>;
    getSignals(filters?: Record<string, unknown>): Promise<Signal[]>;
    listDrafts(): Promise<Draft[]>;
    proposeWrite(kind: 'relation' | 'claim' | 'dossier_text', payload: unknown): Promise<{
        draftId: Id;
    }>;
    approveWrite(draftId: Id): Promise<void>;
    askAI(query: string, ctx?: AskAiContext): Promise<{
        answer: string;
        citations: {
            title: string;
            url: string;
        }[];
    }>;
    validateDossier(json: unknown): Promise<{
        ok: boolean;
        errors: string[];
        warnings: string[];
        patched?: unknown;
    }>;
}
