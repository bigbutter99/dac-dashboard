import * as React from 'react';
import type { Claim, Document, Org, Project, Relation } from '../../data/IDataProvider';
import type { IDataProvider } from '../../data/IDataProvider';
import { stageLabel } from './company360/utils';
import { Card } from '../primitives/Card';
import { Chip } from '../primitives/Chip';
import ClaimsPanel from './company360/ClaimsPanel';
import RelationsPanel from './company360/RelationsPanel';
import DocumentsPanel from './company360/DocumentsPanel';
import ProjectsPanel from './company360/ProjectsPanel';
import type { HashNavigate } from '../navigation';

interface Company360PageProps {
  provider: IDataProvider;
  slug: string;
  onNavigate: HashNavigate;
  onOrgResolved?: (org: Org | undefined) => void;
}

const pageStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 24
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12
};

const headerTopStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 28,
  fontWeight: 700,
  color: '#0f172a'
};

const metaGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 16
};

const panelsGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: 16
};

export const Company360Page: React.FC<Company360PageProps> = ({ provider, slug, onNavigate, onOrgResolved }) => {
  const [org, setOrg] = React.useState<Org | undefined>(undefined);
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [claims, setClaims] = React.useState<Claim[]>([]);
  const [relations, setRelations] = React.useState<Relation[]>([]);
  const [documents, setDocuments] = React.useState<Document[]>([]);
  const [directory, setDirectory] = React.useState<Record<string, Org>>({});
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setLoading(true);
    setError(undefined);
    setOrg(undefined);
    if (onOrgResolved) {
      onOrgResolved(undefined);
    }

    provider
      .getEntityBySlug(slug)
      .then(async foundOrg => {
        if (!active || controller.signal.aborted) {
          return;
        }
        if (!foundOrg) {
          setError('Organization not found.');
          setLoading(false);
          if (onOrgResolved) {
            onOrgResolved(undefined);
          }
          return;
        }

        setOrg(foundOrg);
        if (onOrgResolved) {
          onOrgResolved(foundOrg);
        }

        try {
          const [projectsResult, claimsResult, relationsResult, documentsResult, directoryResult] = await Promise.all([
            provider.getProjects(foundOrg.id),
            provider.getClaims(foundOrg.id),
            provider.getRelations(foundOrg.id),
            provider.getDocuments(foundOrg.id),
            provider.searchEntities()
          ]);

          if (!active || controller.signal.aborted) {
            return;
          }

          const directoryMap = directoryResult.reduce<Record<string, Org>>((acc, item) => {
            acc[item.id] = item;
            return acc;
          }, {});

          setProjects(projectsResult);
          setClaims(claimsResult);
          setRelations(relationsResult);
          setDocuments(documentsResult);
          setDirectory(directoryMap);
        } catch (innerError) {
          if (!active || controller.signal.aborted) {
            return;
          }
          setError(innerError instanceof Error ? innerError.message : String(innerError));
        } finally {
          if (active && !controller.signal.aborted) {
            setLoading(false);
          }
        }
      })
      .catch(err => {
        if (!active || controller.signal.aborted) {
          return;
        }
        setError(err instanceof Error ? err.message : String(err));
        setLoading(false);
        if (onOrgResolved) {
          onOrgResolved(undefined);
        }
      });

    return () => {
      active = false;
      controller.abort();
      if (onOrgResolved) {
        onOrgResolved(undefined);
      }
    };
  }, [onOrgResolved, provider, slug]);

  if (loading) {
    return <div>Loading company dossier…</div>;
  }

  if (error) {
    return (
      <div role="alert" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <span>{error}</span>
        <button
          type="button"
          onClick={() => onNavigate('/')}
          style={{
            alignSelf: 'flex-start',
            background: '#2563eb',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: 8,
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Back to overview
        </button>
      </div>
    );
  }

  if (!org) {
    return <></>;
  }

  return (
    <div style={pageStyle}>
      <header style={headerStyle}>
        <div style={headerTopStyle}>
          <button
            type="button"
            onClick={() => onNavigate('/finder')}
            style={{
              background: 'transparent',
              border: '1px solid rgba(15, 23, 42, 0.18)',
              borderRadius: 8,
              padding: '6px 10px',
              cursor: 'pointer'
            }}
          >
            ← Finder
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            style={{
              background: '#0f172a',
              color: '#fff',
              borderRadius: 8,
              padding: '8px 14px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Print / Export
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <h1 style={titleStyle}>{org.name}</h1>
          <span style={{ color: '#475569', fontSize: 15 }}>{org.description || 'Description coming soon.'}</span>
        </div>
      </header>

      <section style={metaGridStyle}>
        <Card title="Stage">
          <strong style={{ fontSize: 20 }}>{stageLabel(org.stage)}</strong>
          <span style={{ fontSize: 13, color: '#475569' }}>{org.orgKind.replace(/_/g, ' ')}</span>
        </Card>
        <Card title="Approach">
          <strong style={{ fontSize: 20 }}>{org.approach}</strong>
          <span style={{ fontSize: 13, color: '#475569' }}>{org.country || 'Region TBD'}</span>
        </Card>
        <Card title="Founded / Funding">
          <strong style={{ fontSize: 20 }}>{org.foundedYear || '—'}</strong>
          <span style={{ fontSize: 13, color: '#475569' }}>
            Total funding {org.totalFundingUsd ? `$${org.totalFundingUsd.toLocaleString()}` : 'Undisclosed'}
          </span>
        </Card>
        <Card title="Aliases">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {(org.aliases || []).map(alias => (
              <Chip key={alias} label={alias} />
            ))}
            {(!org.aliases || org.aliases.length === 0) ? (
              <span style={{ fontSize: 13, color: '#94a3b8' }}>No aliases tracked.</span>
            ) : null}
          </div>
        </Card>
      </section>

      <section style={panelsGridStyle}>
        <ProjectsPanel projects={projects} />
        <ClaimsPanel claims={claims} />
        <RelationsPanel orgId={org.id} relations={relations} directory={directory} />
        <DocumentsPanel documents={documents} />
      </section>
    </div>
  );
};

export default Company360Page;
