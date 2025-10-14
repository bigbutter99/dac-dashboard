export type Id = string;

export type ISODate = string;

export enum EntityType {
  Org = 'org',
  Project = 'project',
  Claim = 'claim',
  Document = 'document',
  Signal = 'signal',
  Draft = 'draft'
}

export enum Stage {
  Concept = 'concept',
  Pilot = 'pilot',
  Demo = 'demo',
  CommercialPilot = 'commercial_pilot',
  Commercial = 'commercial'
}

export enum ProjectType {
  Pilot = 'pilot',
  Demo = 'demo',
  Commercial = 'commercial',
  Research = 'research'
}

export enum RelationType {
  Offtake = 'offtake',
  Storage = 'storage',
  Technology = 'technology',
  Investment = 'investment',
  Collaboration = 'collaboration'
}

export enum Trust {
  High = 'high',
  Medium = 'medium',
  Low = 'low',
  Unknown = 'unknown'
}

export enum RAG {
  Green = 'green',
  Amber = 'amber',
  Red = 'red'
}

export interface FundingRound {
  id: Id;
  orgId: Id;
  announced_on: ISODate;
  round: string;
  amountUsd: number;
  investors: string[];
  source?: string;
}

export interface Interaction {
  id: Id;
  orgId: Id;
  occurred_on: ISODate;
  type: string;
  summary?: string;
  attendees?: string[];
}

export interface MediaAsset {
  id: Id;
  orgId: Id;
  src: string;
  caption?: string;
}

export interface Org {
  id: Id;
  slug: string;
  entityType: EntityType.Org;
  name: string;
  orgKind: 'technology_vendor' | 'buyer' | 'storage_partner' | 'research_partner' | 'major' | 'startup' | 'lab' | 'mrv';
  stage: Stage;
  approach: string;
  description?: string;
  country?: string;
  website?: string;
  foundedYear?: number;
  totalFundingUsd?: number;
  freshnessDays?: number;
  aliases?: string[];
  logoUrl?: string;
  fundingRounds?: FundingRound[];
  interactions?: Interaction[];
  overviewImages?: MediaAsset[];
}

export interface Project {
  id: Id;
  orgId: Id;
  name: string;
  projectType: ProjectType;
  stage: Stage;
  status: string;
  location?: string;
  capacity_tCO2_per_year?: number;
  start_date?: ISODate;
  partners?: Id[];
}

export type EvidenceKind = 'news' | 'publication' | 'patent' | 'report' | 'other';

export interface Evidence {
  id: Id;
  claimId: Id;
  kind: EvidenceKind;
  title: string;
  url?: string;
  published_on?: ISODate;
  summary?: string;
}

export interface Claim {
  id: Id;
  orgId: Id;
  statement: string;
  metric: string;
  unit: string;
  min?: number;
  ml?: number;
  max?: number;
  trust: Trust;
  rag: RAG;
  asserted_on: ISODate;
  valid_from?: ISODate;
  valid_to?: ISODate;
  evidence: Evidence[];
}

export interface Relation {
  id: Id;
  sourceId: Id;
  targetId: Id;
  type: RelationType;
  description?: string;
  since?: ISODate;
  until?: ISODate;
  confidence?: Trust;
}

export type DocumentKind = 'news' | 'publication' | 'patent' | 'blog';

export interface Document {
  id: Id;
  orgId: Id;
  kind: DocumentKind;
  title: string;
  url: string;
  published_on: ISODate;
  summary?: string;
  source?: string;
}

export interface Signal {
  id: Id;
  entityId: Id;
  rag: RAG;
  message: string;
  updated_on: ISODate;
  tags?: string[];
  source?: string;
}

export interface Draft {
  id: Id;
  kind: 'relation' | 'claim' | 'dossier_text';
  payload: unknown;
  created_on: ISODate;
  state: 'proposed' | 'approved';
}

export interface AskAiContext {
  entityId?: Id;
  filters?: Record<string, unknown>;
  includeWeb?: boolean;
}

export interface IDataProvider {
  searchEntities(q?: string, filters?: Record<string, unknown>): Promise<Org[]>;
  getEntityBySlug(slug: string): Promise<Org | undefined>;
  getProjects(orgId: Id): Promise<Project[]>;
  getClaims(orgId: Id): Promise<Claim[]>;
  getRelations(entityId: Id, opts?: { since?: ISODate; types?: RelationType[] }): Promise<Relation[]>;
  getDocuments(orgId: Id): Promise<Document[]>;
  getSignals(filters?: Record<string, unknown>): Promise<Signal[]>;
  listDrafts(): Promise<Draft[]>;
  proposeWrite(kind: 'relation' | 'claim' | 'dossier_text', payload: unknown): Promise<{ draftId: Id }>;
  approveWrite(draftId: Id): Promise<void>;
  askAI(query: string, ctx?: AskAiContext): Promise<{ answer: string; citations: { title: string; url: string }[] }>;
  validateDossier(json: unknown): Promise<{ ok: boolean; errors: string[]; warnings: string[]; patched?: unknown }>;
}
