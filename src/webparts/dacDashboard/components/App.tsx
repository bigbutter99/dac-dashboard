import * as React from 'react';
import type { IDataProvider } from '../data/IDataProvider';
import type { HashNavigate, HashQuery } from './navigation';
import HomePage from './pages/HomePage';
import FinderPage from './pages/FinderPage';
import Company360Page from './pages/Company360Page';
import NetworkPage from './pages/NetworkPage';
import RadarPage from './pages/RadarPage';
import TriagePage from './pages/TriagePage';
import Shell from './Shell';
import ProposedChangesDrawer from './ProposedChangesDrawer';
import AskAIDrawer from './AskAIDrawer';
import type { AskAiContext } from '../data/IDataProvider';
import useTelemetry from './hooks/useTelemetry';

interface HashRouteState {
  path: string;
  qs: URLSearchParams;
}

const trim = (value: string): string => value.replace(/^\s+|\s+$/g, '');

const ensureLeadingSlash = (value: string): string =>
  value.length > 0 && value.charAt(0) === '/' ? value : `/${value}`;

const normalizePath = (value: string | undefined): string => {
  if (!value) {
    return '/';
  }
  const trimmed = trim(value);
  if (!trimmed || trimmed === '#') {
    return '/';
  }
  return ensureLeadingSlash(trimmed);
};

const stripHash = (hash: string): string =>
  hash.length > 0 && hash.charAt(0) === '#' ? hash.substring(1) : hash;

const parseHash = (hash: string): HashRouteState => {
  if (typeof window === 'undefined') {
    return { path: '/', qs: new URLSearchParams() };
  }
  const raw = stripHash(hash);
  if (!raw) {
    return { path: '/', qs: new URLSearchParams() };
  }
  const questionIndex = raw.indexOf('?');
  const hasQuery = questionIndex !== -1;
  const rawPath = hasQuery ? raw.substring(0, questionIndex) : raw;
  const rawQuery = hasQuery ? raw.substring(questionIndex + 1) : '';
  return {
    path: normalizePath(rawPath),
    qs: new URLSearchParams(rawQuery)
  };
};

const buildParams = (qs?: HashQuery): URLSearchParams => {
  const params = new URLSearchParams();
  if (!qs) {
    return params;
  }
  for (const key in qs) {
    if (Object.prototype.hasOwnProperty.call(qs, key)) {
      const value = qs[key];
      if (value !== undefined && value !== '') {
        params.set(key, value);
      }
    }
  }
  return params;
};

export const useHashRoute = (): { path: string; qs: URLSearchParams; nav: HashNavigate } => {
  const initialState =
    typeof window === 'undefined' ? { path: '/', qs: new URLSearchParams() } : parseHash(window.location.hash);
  const [state, setState] = React.useState<HashRouteState>(initialState);

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }
    const handleHashChange = (): void => {
      setState(parseHash(window.location.hash));
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const nav = React.useCallback<HashNavigate>((path, qs) => {
    const nextPath = normalizePath(path);
    const params = buildParams(qs);
    const queryString = params.toString();
    const nextHash = `#${nextPath}${queryString ? `?${queryString}` : ''}`;

    if (typeof window === 'undefined') {
      setState({ path: nextPath, qs: params });
      return;
    }

    if (window.location.hash === nextHash) {
      setState({ path: nextPath, qs: params });
    } else {
      window.location.hash = nextHash;
    }
  }, []);

  return React.useMemo(
    () => ({
      path: state.path,
      qs: state.qs,
      nav
    }),
    [nav, state.path, state.qs]
  );
};

const parseList = (value: string | undefined): string[] => {
  if (value === undefined || value === '') {
    return [];
  }
  return Array.from(
    new Set(
      value
        .split(',')
        .map(item => trim(item))
        .filter(Boolean)
    )
  );
};

const App: React.FC<{ provider: IDataProvider }> = ({ provider }) => {
  const telemetry = useTelemetry();
  const { path, qs, nav } = useHashRoute();
  const [draftsOpen, setDraftsOpen] = React.useState<boolean>(false);
  const [aiOpen, setAiOpen] = React.useState<boolean>(false);
  const [aiContext, setAiContext] = React.useState<AskAiContext | undefined>(undefined);
  const normalizedPath = path || '/';

  const trackedNav = React.useCallback<HashNavigate>(
    (nextPath, nextQs) => {
      const normalized = normalizePath(nextPath);
      const params = buildParams(nextQs);
      telemetry.track('nav', { to: normalized, qs: params.toString() || undefined });
      nav(nextPath, nextQs);
    },
    [nav, telemetry]
  );

  const finderQuery = qs.get('q') || '';
  const finderStages = parseList(qs.get('stage') ?? undefined);
  const finderApproaches = parseList(qs.get('approach') ?? undefined);
  const finderRegions = parseList(qs.get('region') ?? undefined);
  const handleGlobalSearch = React.useCallback(
    (query: string) => {
      const trimmed = trim(query);
      if (trimmed) {
        trackedNav('/finder', { q: trimmed });
      } else {
        trackedNav('/finder');
      }
    },
    [trackedNav]
  );

  const handleAskAI = React.useCallback(() => {
    setAiOpen(true);
  }, []);

  const handleOpenDrafts = React.useCallback(() => {
    setDraftsOpen(true);
  }, []);

  const handleCloseDrafts = React.useCallback(() => {
    setDraftsOpen(false);
  }, []);
  const handleCloseAskAI = React.useCallback(() => {
    setAiOpen(false);
  }, []);

  const isCurator = true;

  let content: React.ReactNode;

  React.useEffect(() => {
    if (!normalizedPath.startsWith('/org/')) {
      setAiContext(undefined);
    }
  }, [normalizedPath]);

  if (normalizedPath === '/') {
    content = <HomePage provider={provider} onNavigate={trackedNav} />;
  } else if (normalizedPath === '/finder') {
    content = (
      <FinderPage
        provider={provider}
        query={finderQuery}
        stages={finderStages}
        approaches={finderApproaches}
        regions={finderRegions}
        onNavigate={trackedNav}
      />
    );
  } else if (normalizedPath.startsWith('/org/')) {
    const slug = decodeURIComponent(normalizedPath.substring('/org/'.length));
    content = (
      <Company360Page
        provider={provider}
        slug={slug}
        onNavigate={trackedNav}
        onOrgResolved={org => {
          if (org) {
            setAiContext({ entityId: org.id });
          } else {
            setAiContext(undefined);
          }
        }}
      />
    );
  } else if (normalizedPath === '/network') {
    content = <NetworkPage provider={provider} onNavigate={trackedNav} />;
  } else if (normalizedPath === '/radar') {
    content = <RadarPage provider={provider} onNavigate={trackedNav} />;
  } else if (normalizedPath === '/triage') {
    content = <TriagePage onNavigate={trackedNav} />;
  } else {
    content = (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h1 style={{ margin: 0 }}>Not found</h1>
        <button
          type="button"
          onClick={() => trackedNav('/')}
          style={{
            alignSelf: 'flex-start',
            background: '#2563eb',
            color: '#ffffff',
            padding: '6px 12px',
            borderRadius: 8,
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Back home
        </button>
      </div>
    );
  }

  return (
    <Shell
      onSearch={handleGlobalSearch}
      onAskAI={handleAskAI}
      onOpenDrafts={handleOpenDrafts}
      isCurator={isCurator}
      askAiDrawer={<AskAIDrawer provider={provider} isOpen={aiOpen} onClose={handleCloseAskAI} context={aiContext} />}
      draftsDrawer={
        <ProposedChangesDrawer
          provider={provider}
          isOpen={draftsOpen}
          onClose={handleCloseDrafts}
          isCurator={isCurator}
        />
      }
    >
      {content}
    </Shell>
  );
};

export default App;
