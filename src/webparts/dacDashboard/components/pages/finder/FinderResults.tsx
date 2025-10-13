import * as React from 'react';
import type { Org } from '../../../data/IDataProvider';
import { Card } from '../../primitives/Card';
import { optionLabel } from './utils';
import type { HashNavigate } from '../../navigation';

interface FinderResultsProps {
  matches: Org[];
  onNavigate: HashNavigate;
}

export const FinderResults: React.FC<FinderResultsProps> = ({ matches, onNavigate }) => (
  <Card title={`Matches (${matches.length})`}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {matches.map(org => (
        <div
          key={org.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
            paddingBottom: 12
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <strong style={{ fontSize: 16 }}>{org.name}</strong>
            <span style={{ fontSize: 13, color: '#475569' }}>
              {optionLabel(org.stage)} · {org.approach} · {org.country || 'Region TBD'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate(`/org/${org.slug}`)}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              border: '1px solid rgba(37, 99, 235, 0.4)',
              background: '#2563eb',
              color: '#ffffff',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Open profile
          </button>
        </div>
      ))}
      {matches.length === 0 ? (
        <div style={{ color: '#94a3b8', fontSize: 14 }}>No organizations match the current filters.</div>
      ) : null}
    </div>
  </Card>
);

export default FinderResults;
