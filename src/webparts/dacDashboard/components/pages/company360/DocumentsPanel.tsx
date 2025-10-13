import * as React from 'react';
import type { Document } from '../../../data/IDataProvider';
import { Card } from '../../primitives/Card';
import { Badge } from '../../primitives/Badge';
import { formatDate } from './utils';

interface DocumentsPanelProps {
  documents: Document[];
}

export const DocumentsPanel: React.FC<DocumentsPanelProps> = ({ documents }) => (
  <Card title="Documents">
    {documents.length === 0 ? (
      <p style={{ margin: 0, color: '#94a3b8' }}>Documents ingestion pending.</p>
    ) : (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {documents.map(document => (
          <li key={document.id} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Badge tone="neutral">{document.kind.toUpperCase()}</Badge>
              <span style={{ fontSize: 13, color: '#475569' }}>{formatDate(document.published_on)}</span>
            </div>
            <a
              href={document.url}
              style={{ color: '#1d4ed8', fontWeight: 600, textDecoration: 'none' }}
              target="_blank"
              rel="noreferrer"
            >
              {document.title}
            </a>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>{document.source || 'Source TBD'}</span>
          </li>
        ))}
      </ul>
    )}
  </Card>
);

export default DocumentsPanel;
