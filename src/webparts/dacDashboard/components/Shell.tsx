import * as React from 'react';

export interface ShellProps {
  children: React.ReactNode;
  onSearch: (query: string) => void;
  onAskAI: () => void;
  onOpenDrafts: () => void;
  isCurator: boolean;
}

const rootStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: '#f8fafc'
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 16,
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 24px',
  backgroundColor: '#ffffff',
  borderBottom: '1px solid rgba(15, 23, 42, 0.08)'
};

const brandStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4
};

const searchRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8
};

const actionsStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8
};

const mainStyle: React.CSSProperties = {
  flex: 1,
  padding: 24
};

const primaryButton: React.CSSProperties = {
  borderRadius: 8,
  border: '1px solid rgba(37, 99, 235, 0.45)',
  backgroundColor: '#2563eb',
  color: '#ffffff',
  padding: '8px 16px',
  fontWeight: 600,
  cursor: 'pointer'
};

const secondaryButton: React.CSSProperties = {
  ...primaryButton,
  backgroundColor: '#0f172a'
};

export const Shell: React.FC<ShellProps> = ({ children, onSearch, onAskAI, onOpenDrafts, isCurator }) => {
  const [searchValue, setSearchValue] = React.useState<string>('');

  const runSearch = React.useCallback(() => {
    onSearch(searchValue.trim());
  }, [onSearch, searchValue]);

  return (
    <div style={rootStyle}>
      <header style={headerStyle}>
        <div style={brandStyle}>
          <strong style={{ fontSize: 18, color: '#0f172a' }}>Direct Air Capture workspace</strong>
          <span style={{ fontSize: 13, color: '#475569' }}>Track portfolio execution, counterparties, and risk signals.</span>
        </div>
        <div style={searchRowStyle}>
          <input
            type="search"
            value={searchValue}
            placeholder="Search organizations, regions, approaches…"
            onChange={event => setSearchValue(event.target.value)}
            onKeyDown={event => {
              if (event.key === 'Enter') {
                event.preventDefault();
                runSearch();
              }
            }}
            style={{
              minWidth: 260,
              padding: '8px 12px',
              borderRadius: 999,
              border: '1px solid rgba(15, 23, 42, 0.16)',
              fontSize: 14
            }}
          />
          <button type="button" style={primaryButton} onClick={runSearch}>
            Search
          </button>
        </div>
        <div style={actionsStyle}>
          <button type="button" style={secondaryButton} onClick={onAskAI}>
            Ask AI
          </button>
          {isCurator ? (
            <button type="button" style={primaryButton} onClick={onOpenDrafts}>
              Proposed Changes
            </button>
          ) : null}
        </div>
      </header>
      <main style={mainStyle}>{children}</main>
    </div>
  );
};

export default Shell;
