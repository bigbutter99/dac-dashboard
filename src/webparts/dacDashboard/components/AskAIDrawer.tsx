import * as React from 'react';
import type { AskAiContext, IDataProvider } from '../data/IDataProvider';

interface AskAIDrawerProps {
  provider: IDataProvider;
  isOpen: boolean;
  onClose: () => void;
  context?: AskAiContext;
}

interface AskAIResult {
  answer: string;
  citations: { title: string; url: string }[];
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
  width: 480,
  maxWidth: '100%',
  height: '100%',
  background: '#ffffff',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '-8px 0 24px rgba(15, 23, 42, 0.16)'
};

const headerStyle: React.CSSProperties = {
  padding: '20px 24px',
  borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const bodyStyle: React.CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  padding: 24,
  display: 'flex',
  flexDirection: 'column',
  gap: 16
};

const answerStyle: React.CSSProperties = {
  background: '#f8fafc',
  borderRadius: 12,
  padding: 16,
  border: '1px solid rgba(15, 23, 42, 0.08)',
  whiteSpace: 'pre-wrap',
  fontSize: 14,
  color: '#0f172a'
};

const actionsStyle: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  alignItems: 'center'
};

const buttonStyle: React.CSSProperties = {
  borderRadius: 8,
  border: '1px solid rgba(37, 99, 235, 0.4)',
  background: '#2563eb',
  color: '#ffffff',
  padding: '8px 12px',
  fontWeight: 600,
  cursor: 'pointer'
};

const secondaryButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  background: '#0f172a'
};

export const AskAIDrawer: React.FC<AskAIDrawerProps> = ({ provider, isOpen, onClose, context }) => {
  const [query, setQuery] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [result, setResult] = React.useState<AskAIResult | undefined>(undefined);
  const [submittingCitations, setSubmittingCitations] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResult(undefined);
      setError(undefined);
    }
  }, [isOpen]);

  const handleRun = React.useCallback(async () => {
    const trimmed = query.trim();
    if (!trimmed) {
      setError('Enter a question for Ask AI.');
      return;
    }
    setLoading(true);
    setError(undefined);
    try {
      const response = await provider.askAI(trimmed, context);
      setResult(response);
    } catch (askError) {
      setError(askError instanceof Error ? askError.message : String(askError));
    } finally {
      setLoading(false);
    }
  }, [context, provider, query]);

  const handleProposeRelation = React.useCallback(
    async (citationKey: string) => {
      setSubmittingCitations(prev => ({ ...prev, [citationKey]: true }));
      try {
        await provider.proposeWrite('relation', { demo: true, citationKey });
      } finally {
        setSubmittingCitations(prev => {
          const next = { ...prev };
          delete next[citationKey];
          return next;
        });
      }
    },
    [provider]
  );

  if (!isOpen) {
    return null;
  }

  return (
    <div style={overlayStyle} role="dialog" aria-modal="true">
      <div style={drawerStyle}>
        <div style={headerStyle}>
          <div>
            <strong style={{ fontSize: 16, color: '#0f172a' }}>Ask AI</strong>
            <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>
              Ask contextual questions. Draft responses keep citations handy for curator review.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ border: 'none', background: 'transparent', fontSize: 16, cursor: 'pointer' }}
            aria-label="Close Ask AI"
          >
            ×
          </button>
        </div>
        <div style={bodyStyle}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label htmlFor="ask-ai-input" style={{ fontSize: 13, color: '#0f172a' }}>
              Question
            </label>
            <textarea
              id="ask-ai-input"
              value={query}
              onChange={event => setQuery(event.target.value)}
              rows={4}
              placeholder="What are the latest procurement signals for this entity?"
              style={{
                resize: 'vertical',
                minHeight: 120,
                padding: 12,
                borderRadius: 12,
                border: '1px solid rgba(15, 23, 42, 0.12)',
                fontSize: 14
              }}
            />
            <div style={actionsStyle}>
              <button type="button" style={secondaryButtonStyle} disabled={loading} onClick={handleRun}>
                {loading ? 'Running…' : 'Run'}
              </button>
              {context?.entityId ? (
                <span style={{ fontSize: 12, color: '#475569' }}>Context: {context.entityId}</span>
              ) : (
                <span style={{ fontSize: 12, color: '#94a3b8' }}>No entity context</span>
              )}
            </div>
            {error ? (
              <div role="alert" style={{ color: '#dc2626', fontSize: 12 }}>
                {error}
              </div>
            ) : null}
          </div>
          {result ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <strong style={{ fontSize: 14, color: '#0f172a' }}>Answer</strong>
                <div style={answerStyle}>{result.answer}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <strong style={{ fontSize: 14, color: '#0f172a' }}>Citations</strong>
                {result.citations.map((citation, index) => {
                  const key = `${citation.url}-${index}`;
                  return (
                    <div
                      key={key}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 12,
                        padding: 10,
                        borderRadius: 8,
                        border: '1px solid rgba(15, 23, 42, 0.08)'
                      }}
                    >
                      <a href={citation.url} target="_blank" rel="noreferrer" style={{ color: '#2563eb', fontSize: 13 }}>
                        {citation.title || citation.url}
                      </a>
                      <button
                        type="button"
                        style={buttonStyle}
                        onClick={() => handleProposeRelation(key)}
                        disabled={!!submittingCitations[key]}
                      >
                        {submittingCitations[key] ? 'Proposing…' : 'Propose relation'}
                      </button>
                    </div>
                  );
                })}
                {result.citations.length === 0 ? (
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>No citations returned.</span>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AskAIDrawer;
