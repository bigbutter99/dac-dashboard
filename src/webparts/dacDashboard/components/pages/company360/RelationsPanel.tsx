import * as React from 'react';
import type { Org, Relation } from '../../../data/IDataProvider';
import { Card } from '../../primitives/Card';
import { formatDate } from './utils';
import { Trust } from '../../../data/IDataProvider';
import { Badge, type BadgeTone } from '../../primitives/Badge';

interface RelationsPanelProps {
  orgId: string;
  relations: Relation[];
  directory: Record<string, Org>;
}

const resolveKindBadge = (org?: Org): { label: string; tone: BadgeTone } | undefined => {
  if (!org) {
    return undefined;
  }
  switch (org.orgKind) {
    case 'major':
    case 'buyer':
      return { label: 'Major', tone: 'info' };
    case 'technology_vendor':
    case 'startup':
      return { label: 'Startup', tone: 'success' };
    case 'research_partner':
    case 'lab':
      return { label: 'Lab', tone: 'warning' };
    case 'storage_partner':
    case 'mrv':
      return { label: 'MRV', tone: 'neutral' };
    default:
      return undefined;
  }
};

export const RelationsPanel: React.FC<RelationsPanelProps> = ({ orgId, relations, directory }) => {
  const groups = React.useMemo(() => {
    const grouped: Record<string, Relation[]> = {};
    relations.forEach(relation => {
      const bucket = grouped[relation.type] || [];
      bucket.push(relation);
      grouped[relation.type] = bucket;
    });
    return grouped;
  }, [relations]);

  return (
    <Card title="Relations">
      {relations.length === 0 ? (
        <p style={{ margin: 0, color: '#94a3b8' }}>No recorded relations for this entity.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {Object.keys(groups).map(type => (
            <div key={type} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <h4 style={{ margin: 0, fontSize: 14, textTransform: 'uppercase', letterSpacing: 0.8, color: '#0f172a' }}>
                {type}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {groups[type].map(relation => {
                  const counterpartyId = relation.sourceId === orgId ? relation.targetId : relation.sourceId;
                  const counterparty = directory[counterpartyId];
                  const badge = resolveKindBadge(counterparty);
                  return (
                    <div key={relation.id} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <strong style={{ fontSize: 15 }}>
                          {counterparty ? counterparty.name : `Unknown entity (${counterpartyId})`}
                        </strong>
                        {badge ? <Badge tone={badge.tone}>{badge.label}</Badge> : null}
                      </div>
                      <span style={{ fontSize: 13, color: '#475569' }}>
                        Since {formatDate(relation.since)} · Confidence {relation.confidence ?? Trust.Unknown}
                      </span>
                      <p style={{ margin: 0, fontSize: 13, color: '#334155' }}>
                        {relation.description || 'No context provided.'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default RelationsPanel;
