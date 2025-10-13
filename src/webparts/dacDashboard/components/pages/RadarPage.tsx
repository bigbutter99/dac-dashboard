import * as React from 'react';
import type { IDataProvider, Signal } from '../../data/IDataProvider';
import { Card } from '../primitives/Card';
import { Badge, type BadgeTone } from '../primitives/Badge';
import type { HashNavigate } from '../navigation';
import { RAG } from '../../data/IDataProvider';

interface RadarPageProps {
  provider: IDataProvider;
  onNavigate: HashNavigate;
}

const ragTone = (rag: RAG): BadgeTone => {
  switch (rag) {
    case RAG.Green:
      return 'success';
    case RAG.Amber:
      return 'warning';
    case RAG.Red:
      return 'danger';
    default:
      return 'neutral';
  }
};

const formatDate = (iso: string): string => {
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return iso;
  }
};

export const RadarPage: React.FC<RadarPageProps> = ({ provider, onNavigate }) => {
  const [signals, setSignals] = React.useState<Signal[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    let active = true;
    setLoading(true);
    setError(undefined);

    provider
      .getSignals()
      .then(results => {
        if (!active) {
          return;
        }
        setSignals(results);
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
    return <div>Loading radar…</div>;
  }

  if (error) {
    return (
      <div role="alert">
        Unable to load radar: {error}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0, fontSize: 26, color: '#0f172a' }}>Radar</h1>
        <button
          type="button"
          onClick={() => onNavigate('/')}
          style={{
            background: 'transparent',
            border: '1px solid rgba(15, 23, 42, 0.18)',
            borderRadius: 8,
            padding: '6px 10px',
            cursor: 'pointer'
          }}
        >
          ← Home
        </button>
      </header>

      <Card title={`Signals (${signals.length})`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {signals.map(signal => (
            <div
              key={signal.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                paddingBottom: 12,
                borderBottom: '1px solid rgba(15, 23, 42, 0.08)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Badge tone={ragTone(signal.rag)}>{signal.rag.toUpperCase()}</Badge>
                <span style={{ fontSize: 13, color: '#475569' }}>Updated {formatDate(signal.updated_on)}</span>
                {signal.source ? <span style={{ fontSize: 12, color: '#94a3b8' }}>{signal.source}</span> : null}
              </div>
              <p style={{ margin: 0, fontSize: 15, color: '#0f172a', fontWeight: 600 }}>{signal.message}</p>
              {signal.tags && signal.tags.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {signal.tags.map(tag => (
                    <Badge key={tag} tone="neutral">
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : null}
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  style={{
                    background: '#16a34a',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '6px 12px',
                    cursor: 'pointer'
                  }}
                >
                  Accept
                </button>
                <button
                  type="button"
                  style={{
                    background: '#f59e0b',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '6px 12px',
                    cursor: 'pointer'
                  }}
                >
                  Snooze
                </button>
                <button
                  type="button"
                  style={{
                    background: '#dc2626',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '6px 12px',
                    cursor: 'pointer'
                  }}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
          {signals.length === 0 ? <span style={{ color: '#94a3b8' }}>No signals pending review.</span> : null}
        </div>
      </Card>
    </div>
  );
};

export default RadarPage;
