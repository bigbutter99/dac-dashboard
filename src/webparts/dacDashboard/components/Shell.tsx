import * as React from 'react';

export interface ShellProps {
  children: React.ReactNode;
  onSearch: (query: string) => void;
  onAskAI: () => void;
  onOpenDrafts: () => void;
  isCurator: boolean;
  draftsDrawer?: React.ReactNode;
  askAiDrawer?: React.ReactNode;
}

const headerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  padding: '16px 24px',
  borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
  background: '#ffffff'
};

const topRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16
};

const brandStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4
};

const navStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8
};

const actionsStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8
};

const layoutStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100%',
  background: '#f8fafc'
};

const mainStyle: React.CSSProperties = {
  flex: 1,
  padding: 24
};

const buttonStyle: React.CSSProperties = {
  borderRadius: 8,
  border: '1px solid rgba(15, 23, 42, 0.1)',
  background: '#1d4ed8',
  color: '#ffffff',
  padding: '8px 12px',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer'
};

const secondaryButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  background: '#0f172a'
};

export const Shell: React.FC<ShellProps> = ({
  children,
  onSearch,
  onAskAI,
  onOpenDrafts,
  isCurator,
  draftsDrawer,
  askAiDrawer
}) => {
  const [searchInput, setSearchInput] = React.useState<string>('');

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        const trimmed = searchInput.trim();
        onSearch(trimmed);
      }
    },
    [onSearch, searchInput]
  );

  return (
    <div style={layoutStyle}>
      <header style={headerStyle}>
        <div style={topRowStyle}>
          <div style={brandStyle}>
            <strong style={{ fontSize: 18, color: '#0f172a' }}>Direct Air Capture Intelligence</strong>
            <span style={{ fontSize: 13, color: '#475569' }}>Signals, diligence, and operations in one workspace.</span>
          </div>
          <div style={navStyle}>
            <input
              type="search"
              value={searchInput}
              onChange={event => setSearchInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search organizations, projects, relations..."
              style={{
                minWidth: 280,
                padding: '8px 12px',
                borderRadius: 999,
                border: '1px solid rgba(15, 23, 42, 0.16)',
                fontSize: 14
              }}
            />
            <button
              type="button"
              style={buttonStyle}
              onClick={() => {
                const trimmed = searchInput.trim();
                onSearch(trimmed);
              }}
            >
              Search
            </button>
          </div>
          <div style={actionsStyle}>
            <button type="button" style={secondaryButtonStyle} onClick={onAskAI}>
              Ask AI
            </button>
            {isCurator ? (
              <button type="button" style={buttonStyle} onClick={onOpenDrafts}>
                Proposed Changes
              </button>
            ) : null}
          </div>
        </div>
      </header>
      <main style={mainStyle}>{children}</main>
      {askAiDrawer}
      {draftsDrawer}
    </div>
  );
};

export default Shell;
