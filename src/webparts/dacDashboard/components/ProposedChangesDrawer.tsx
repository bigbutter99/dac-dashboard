import * as React from 'react';
import type { Draft, IDataProvider } from '../data/IDataProvider';
import useTelemetry from './hooks/useTelemetry';

export interface ProposedChangesDrawerProps {
  provider: IDataProvider;
  isOpen: boolean;
  onClose: () => void;
  isCurator: boolean;
}

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(15, 23, 42, 0.42)',
  display: 'flex',
  justifyContent: 'flex-end',
  zIndex: 999
};

const drawerStyle: React.CSSProperties = {
  width: '420px',
  maxWidth: '100%',
  height: '100%',
  backgroundColor: '#ffffff',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '-8px 0 24px rgba(15, 23, 42, 0.16)'
};

const headerStyle: React.CSSProperties = {
  padding: '20px 24px',
  borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
};

const listStyle: React.CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  padding: 24,
  display: 'flex',
  flexDirection: 'column',
  gap: 16
};

const cardStyle: React.CSSProperties = {
  border: '1px solid rgba(15, 23, 42, 0.1)',
  borderRadius: 12,
  padding: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  background: '#f8fafc'
};

const buttonRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  justifyContent: 'flex-end'
};

const approveButtonStyle: React.CSSProperties = {
  borderRadius: 8,
  border: '1px solid rgba(22, 163, 74, 0.4)',
  background: '#16a34a',
  color: '#ffffff',
  padding: '6px 12px',
  fontWeight: 600,
  cursor: 'pointer'
};

const rejectButtonStyle: React.CSSProperties = {
  borderRadius: 8,
  border: '1px solid rgba(220, 38, 38, 0.4)',
  background: '#dc2626',
  color: '#ffffff',
  padding: '6px 12px',
  fontWeight: 600,
  cursor: 'pointer'
};

const closeButtonStyle: React.CSSProperties = {
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  fontSize: 16
};

const citationListStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  fontSize: 12
};

const findCitations = (data: unknown): { title?: string; url?: string }[] => {
  if (!data || typeof data !== 'object') {
    return [];
  }
  const citations: { title?: string; url?: string }[] = [];
  const stack: unknown[] = [data];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) {
      continue;
    }
    if (Array.isArray(current)) {
      current.forEach(item => stack.push(item));
      continue;
    }
    if (typeof current === 'object') {
      const entry = current as Record<string, unknown>;
      if (entry.url || entry.href) {
        citations.push({
          title: typeof entry.title === 'string' ? entry.title : undefined,
          url: typeof entry.url === 'string' ? entry.url : typeof entry.href === 'string' ? entry.href : undefined
        });
      }
      Object.keys(entry).forEach(key => stack.push(entry[key]));
    }
  }

  return citations.filter(item => item.url);
};

const useDrafts = (provider: IDataProvider, isOpen: boolean): { drafts: Draft[]; refresh: () => void; loading: boolean } => {
  const [drafts, setDrafts] = React.useState<Draft[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  const refresh = React.useCallback(() => {
    setLoading(true);
    provider
      .listDrafts()
      .then(items => {
        setDrafts(items);
        setLoading(false);
      })
      .catch(() => {
        setDrafts([]);
        setLoading(false);
      });
  }, [provider]);

  React.useEffect(() => {
    if (isOpen) {
      refresh();
    }
  }, [isOpen, refresh]);

  return { drafts, refresh, loading };
};

export const ProposedChangesDrawer: React.FC<ProposedChangesDrawerProps> = ({ provider, isOpen, onClose, isCurator }) => {
  const telemetry = useTelemetry();
  const { drafts, refresh, loading } = useDrafts(provider, isOpen);
  const [submitting, setSubmitting] = React.useState<string | undefined>(undefined);

  const handleApprove = React.useCallback(
    async (draftId: string) => {
      try {
        setSubmitting(draftId);
        telemetry.track('approve_write', { draftId });
        await provider.approveWrite(draftId);
        refresh();
      } finally {
        setSubmitting(undefined);
      }
    },
    [provider, refresh, telemetry]
  );

  if (!isOpen) {
    return null;
  }

  return (
    <div style={overlayStyle} role="dialog" aria-modal="true">
      <div style={drawerStyle}>
        <div style={headerStyle}>
          <div>
            <strong style={{ fontSize: 16, color: '#0f172a' }}>Proposed Changes</strong>
            <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>
              AI and analyst submissions pending curator approval.
            </p>
          </div>
          <button type="button" onClick={onClose} style={closeButtonStyle} aria-label="Close proposed changes">
            ×
          </button>
        </div>
        <div style={listStyle}>
          {loading ? <div>Loading drafts…</div> : null}
          {!loading && drafts.length === 0 ? (
            <div style={{ color: '#94a3b8', fontSize: 13 }}>No proposed changes outstanding.</div>
          ) : null}
          {drafts.map(draft => {
            let payloadText: string;
            try {
              payloadText = JSON.stringify(draft.payload, null, 2);
            } catch {
              payloadText = String(draft.payload);
            }
            const citations = findCitations(draft.payload);
            return (
              <div key={draft.id} style={cardStyle}>
                <div>
                  <strong style={{ color: '#0f172a' }}>{draft.kind.toUpperCase()}</strong>
                  <span style={{ display: 'block', fontSize: 12, color: '#64748b' }}>Draft #{draft.id}</span>
                </div>
                <pre
                  style={{
                    margin: 0,
                    padding: 12,
                    background: '#ffffff',
                    borderRadius: 8,
                    border: '1px solid rgba(15, 23, 42, 0.08)',
                    maxHeight: 220,
                    overflow: 'auto',
                    fontSize: 12
                  }}
                >
                  {payloadText}
                </pre>
                {citations.length > 0 ? (
                  <div style={citationListStyle}>
                    <strong style={{ fontSize: 12, color: '#0f172a' }}>Citations</strong>
                    {citations.map((citation, index) => (
                      <a
                        key={`${draft.id}-citation-${index}`}
                        href={citation.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: '#2563eb' }}
                      >
                        {citation.title || citation.url}
                      </a>
                    ))}
                  </div>
                ) : null}
                {isCurator ? (
                  <div style={buttonRowStyle}>
                    <button
                      type="button"
                      style={rejectButtonStyle}
                      disabled={submitting === draft.id}
                      onClick={() => {
                        // Placeholder for future reject flow
                        console.log('Rejecting draft', draft.id);
                      }}
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      style={approveButtonStyle}
                      disabled={submitting === draft.id}
                      onClick={() => handleApprove(draft.id)}
                    >
                      Approve
                    </button>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProposedChangesDrawer;
