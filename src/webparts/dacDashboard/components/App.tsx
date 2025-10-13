import * as React from 'react';
import type { IDataProvider, Org } from '../data/IDataProvider';

type HashQuery = { [key: string]: string | undefined };
type HashNavigate = (path: string, qs?: HashQuery) => void;

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

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  try {
    return JSON.stringify(error);
  } catch {
    return 'Unknown error';
  }
};

const HomePage: React.FC<{
  orgs: Org[];
  loading: boolean;
  error?: string;
  onNavigate: HashNavigate;
}> = ({ orgs, loading, error, onNavigate }) => {
  if (loading) {
    return <div>Loading organizations…</div>;
  }

  if (error) {
    return (
      <div role="alert">
        Failed to load organizations: {error}
      </div>
    );
  }

  return (
    <div>
      <h1>Direct Air Capture tracker</h1>
      <p>
        Tracking <strong>{orgs.length}</strong> organizations.
      </p>
      <ul>
        {orgs.slice(0, 5).map(org => (
          <li key={org.id}>
            <button type="button" onClick={() => onNavigate(`/org/${org.slug}`)}>
              {org.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const FinderPage: React.FC<{
  orgs: Org[];
  loading: boolean;
  error?: string;
  query: string;
  onQueryChange: (next: string) => void;
  onNavigate: HashNavigate;
}> = ({ orgs, loading, error, query, onQueryChange, onNavigate }) => {
  const filtered = React.useMemo(() => {
    const term = trim(query.toLowerCase());
    if (!term) {
      return orgs;
    }
    return orgs.filter(org => {
      const haystack = `${org.name} ${org.approach || ''} ${org.country || ''}`.toLowerCase();
      return haystack.indexOf(term) !== -1;
    });
  }, [orgs, query]);

  if (loading) {
    return <div>Searching organizations…</div>;
  }

  if (error) {
    return (
      <div role="alert">
        Failed to load organizations: {error}
      </div>
    );
  }

  return (
    <div>
      <h1>Finder</h1>
      <label htmlFor="finder-query">
        Search
        <input
          id="finder-query"
          type="search"
          value={query}
          onChange={event => onQueryChange(event.target.value)}
          placeholder="Search by name, approach, or country"
        />
      </label>
      <p>{filtered.length} matches</p>
      <ul>
        {filtered.map(org => (
          <li key={org.id}>
            <button type="button" onClick={() => onNavigate(`/org/${org.slug}`)}>
              {org.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Company360Page: React.FC<{ slug: string; provider: IDataProvider; onNavigate: HashNavigate }> = ({
  slug,
  provider,
  onNavigate
}) => {
  const [org, setOrg] = React.useState<Org | undefined>(undefined);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    let active = true;
    setLoading(true);
    setError(undefined);

    provider
      .getEntityBySlug(slug)
      .then(result => {
        if (!active) {
          return;
        }
        setOrg(result);
        setLoading(false);
      })
      .catch(err => {
        if (!active) {
          return;
        }
        setError(getErrorMessage(err));
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [provider, slug]);

  if (loading) {
    return <div>Loading {slug}…</div>;
  }

  if (error) {
    return (
      <div role="alert">
        Failed to load organization: {error}
      </div>
    );
  }

  if (!org) {
    return (
      <div>
        <p>Organization not found.</p>
        <button type="button" onClick={() => onNavigate('/')}>
          Back to overview
        </button>
      </div>
    );
  }

  return (
    <div>
      <button type="button" onClick={() => onNavigate('/')}>
        ← Back
      </button>
      <h1>{org.name}</h1>
      <p>{org.description || 'No description available.'}</p>
      <dl>
        <dt>Country</dt>
        <dd>{org.country || '—'}</dd>
        <dt>Stage</dt>
        <dd>{org.stage}</dd>
        <dt>Approach</dt>
        <dd>{org.approach || '—'}</dd>
        <dt>Total funding (USD)</dt>
        <dd>{org.totalFundingUsd ? org.totalFundingUsd.toLocaleString() : '—'}</dd>
      </dl>
    </div>
  );
};

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div>
    <h1>{title}</h1>
    <p>Content coming soon.</p>
  </div>
);

const App: React.FC<{ provider: IDataProvider }> = ({ provider }) => {
  const { path, qs, nav } = useHashRoute();
  const [orgs, setOrgs] = React.useState<Org[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    let active = true;
    setLoading(true);
    setError(undefined);
    provider
      .searchEntities()
      .then(results => {
        if (!active) {
          return;
        }
        setOrgs(results);
        setLoading(false);
      })
      .catch(err => {
        if (!active) {
          return;
        }
        setError(getErrorMessage(err));
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [provider]);

  const normalizedPath = path || '/';
  const finderQuery = qs.get('q') || '';

  const handleFinderQueryChange = React.useCallback(
    (value: string) => {
      nav('/finder', trim(value) ? { q: value } : undefined);
    },
    [nav]
  );

  let content: React.ReactNode;

  if (normalizedPath === '/') {
    content = <HomePage orgs={orgs} loading={loading} error={error} onNavigate={nav} />;
  } else if (normalizedPath === '/finder') {
    content = (
      <FinderPage
        orgs={orgs}
        loading={loading}
        error={error}
        query={finderQuery}
        onQueryChange={handleFinderQueryChange}
        onNavigate={nav}
      />
    );
  } else if (normalizedPath.length > 5 && normalizedPath.substr(0, 5) === '/org/') {
    const slug = decodeURIComponent(normalizedPath.substring(5));
    content = <Company360Page slug={slug} provider={provider} onNavigate={nav} />;
  } else if (normalizedPath === '/network') {
    content = <PlaceholderPage title="Network" />;
  } else if (normalizedPath === '/radar') {
    content = <PlaceholderPage title="Radar" />;
  } else if (normalizedPath === '/triage') {
    content = <PlaceholderPage title="Triage" />;
  } else {
    content = (
      <div>
        <h1>Not found</h1>
        <button type="button" onClick={() => nav('/')}>
          Back to home
        </button>
      </div>
    );
  }

  return <div>{content}</div>;
};

export default App;
