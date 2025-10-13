import * as React from 'react';
import type { IDataProvider, Org, Relation } from '../../data/IDataProvider';
import { Card } from '../primitives/Card';
import type { HashNavigate } from '../navigation';

interface NetworkPageProps {
  provider: IDataProvider;
  onNavigate: HashNavigate;
}

interface RelationRow {
  id: string;
  type: string;
  sourceName: string;
  targetName: string;
  since?: string;
}

const formatDate = (iso?: string): string => {
  if (!iso) {
    return '—';
  }
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return iso;
  }
};

export const NetworkPage: React.FC<NetworkPageProps> = ({ provider, onNavigate }) => {
  const [rows, setRows] = React.useState<RelationRow[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    let active = true;
    setLoading(true);
    setError(undefined);

    provider
      .searchEntities()
      .then(async orgs => {
        if (!active) {
          return;
        }
        const byId = orgs.reduce<Record<string, Org>>((memo, item) => {
          memo[item.id] = item;
          return memo;
        }, {});

        const relationSets = await Promise.all(orgs.map(org => provider.getRelations(org.id)));
        if (!active) {
          return;
        }

        const dedup = new Map<string, Relation>();
        relationSets.forEach((list: Relation[]) => {
          list.forEach((relation: Relation) => {
            dedup.set(relation.id, relation);
          });
        });

        const dedupedRelations = Array.from(dedup.values() as Iterable<Relation>);
        const summary: RelationRow[] = dedupedRelations.map((relation: Relation) => ({
          id: relation.id,
          type: relation.type,
          sourceName: byId[relation.sourceId]?.name || relation.sourceId,
          targetName: byId[relation.targetId]?.name || relation.targetId,
          since: relation.since
        }));

        setRows(summary);
        setLoading(false);
      })
      .catch(err => {
        if (!active) {
          return;
        }
        setError(err instanceof Error ? err.message : String(err));
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [provider]);

  if (loading) {
    return <div>Loading network…</div>;
  }

  if (error) {
    return (
      <div role="alert">
        Failed to load network: {error}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0, fontSize: 26, color: '#0f172a' }}>Network</h1>
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
      </header>

      <Card title={`Relations (${rows.length})`}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#475569' }}>
              <th style={{ paddingBottom: 8 }}>Type</th>
              <th style={{ paddingBottom: 8 }}>Source</th>
              <th style={{ paddingBottom: 8 }}>Target</th>
              <th style={{ paddingBottom: 8 }}>Since</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.id} style={{ borderTop: '1px solid rgba(15, 23, 42, 0.08)' }}>
                <td style={{ padding: '8px 0' }}>{row.type}</td>
                <td style={{ padding: '8px 0' }}>{row.sourceName}</td>
                <td style={{ padding: '8px 0' }}>{row.targetName}</td>
                <td style={{ padding: '8px 0' }}>{formatDate(row.since)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default NetworkPage;
