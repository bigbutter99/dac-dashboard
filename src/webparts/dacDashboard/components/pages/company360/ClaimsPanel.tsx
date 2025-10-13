import * as React from 'react';
import type { Claim } from '../../../data/IDataProvider';
import { Badge } from '../../primitives/Badge';
import { Chip } from '../../primitives/Chip';
import { Card } from '../../primitives/Card';
import { formatDate, ragTone, trustScore } from './utils';

interface ClaimsPanelProps {
  claims: Claim[];
}

export const ClaimsPanel: React.FC<ClaimsPanelProps> = ({ claims }) => (
  <Card title="Claims">
    {claims.length === 0 ? (
      <p style={{ margin: 0, color: '#94a3b8' }}>No analyst-curated claims yet.</p>
    ) : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {claims.map(claim => (
          <div key={claim.id} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <Badge tone={ragTone(claim.rag)}>{claim.rag.toUpperCase()}</Badge>
              <Badge tone="info">Trust {trustScore(claim.trust)}</Badge>
              <span style={{ fontSize: 13, color: '#475569' }}>
                Asserted {formatDate(claim.asserted_on)} · Valid from {formatDate(claim.valid_from)}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 15, color: '#0f172a', fontWeight: 600 }}>{claim.statement}</p>
            <div style={{ fontSize: 13, color: '#475569' }}>
              {claim.metric} · {claim.unit} · Range {claim.min ?? '—'} – {claim.max ?? '—'} (Most likely {claim.ml ?? '—'})
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {claim.evidence.map(evidence => (
                <Chip
                  key={evidence.id}
                  label={evidence.title}
                  icon={<span style={{ fontSize: 11, opacity: 0.7 }}>{evidence.kind.toUpperCase()}</span>}
                  onClick={() => {
                    if (evidence.url) {
                      window.open(evidence.url, '_blank', 'noopener');
                    }
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    )}
  </Card>
);

export default ClaimsPanel;
