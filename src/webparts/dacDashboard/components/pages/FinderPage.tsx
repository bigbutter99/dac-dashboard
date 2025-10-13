import * as React from 'react';
import type { IDataProvider, Org } from '../../data/IDataProvider';
import type { HashNavigate } from '../navigation';
import FinderFilters from './finder/FinderFilters';
import FinderActiveFilters from './finder/FinderActiveFilters';
import FinderResults from './finder/FinderResults';
import { trim, ensureSorted } from './finder/utils';

interface FinderPageProps {
  provider: IDataProvider;
  query: string;
  stages: string[];
  approaches: string[];
  regions: string[];
  onNavigate: HashNavigate;
}

const layoutStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '280px 1fr',
  gap: 24
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 26,
  fontWeight: 700,
  color: '#0f172a'
};

const subStyle: React.CSSProperties = {
  margin: 0,
  color: '#475569'
};

const toParam = (values: string[]): string | undefined => (values.length > 0 ? values.join(',') : undefined);

export const FinderPage: React.FC<FinderPageProps> = ({ provider, query, stages, approaches, regions, onNavigate }) => {
  const [allOrgs, setAllOrgs] = React.useState<Org[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [searchInput, setSearchInput] = React.useState<string>(query);

  React.useEffect(() => {
    setSearchInput(query);
  }, [query]);

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
        setAllOrgs(results);
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

  const handleSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const trimmed = trim(searchInput);
      onNavigate('/finder', {
        q: trimmed ? trimmed : undefined,
        stage: toParam(ensureSorted(stages)),
        approach: toParam(ensureSorted(approaches)),
        region: toParam(ensureSorted(regions))
      });
    },
    [approaches, onNavigate, regions, searchInput, stages]
  );

  const toggleFilter = React.useCallback(
    (kind: 'stage' | 'approach' | 'region', value: string) => {
      const current = kind === 'stage' ? stages : kind === 'approach' ? approaches : regions;
      const nextValues = current.indexOf(value) === -1 ? [...current, value] : current.filter(item => item !== value);
      const params = {
        q: query ? query : undefined,
        stage: kind === 'stage' ? toParam(ensureSorted(nextValues)) : toParam(ensureSorted(stages)),
        approach: kind === 'approach' ? toParam(ensureSorted(nextValues)) : toParam(ensureSorted(approaches)),
        region: kind === 'region' ? toParam(ensureSorted(nextValues)) : toParam(ensureSorted(regions))
      };
      onNavigate('/finder', params);
    },
    [approaches, onNavigate, query, regions, stages]
  );

  const resetFilters = React.useCallback(() => {
    onNavigate('/finder', query ? { q: query } : undefined);
  }, [onNavigate, query]);

  const availableApproaches = React.useMemo(
    () => ensureSorted(Array.from(new Set(allOrgs.map(org => org.approach).filter(Boolean) as string[]))),
    [allOrgs]
  );
  const availableStages = React.useMemo(
    () => ensureSorted(Array.from(new Set(allOrgs.map(org => org.stage)) as Iterable<string>)),
    [allOrgs]
  );
  const availableRegions = React.useMemo(
    () => ensureSorted(Array.from(new Set(allOrgs.map(org => org.country).filter(Boolean) as string[]))),
    [allOrgs]
  );

  const filtered = React.useMemo(() => {
    const term = trim(query).toLowerCase();
    return allOrgs.filter(org => {
      const haystack = [org.name, org.approach, org.country, ...(org.aliases || [])]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      const matchesTerm = term ? haystack.indexOf(term) !== -1 : true;
      const matchesStage = stages.length > 0 ? stages.indexOf(org.stage) !== -1 : true;
      const matchesApproach = approaches.length > 0 ? approaches.indexOf(org.approach) !== -1 : true;
      const orgRegion = org.country || 'Unspecified';
      const matchesRegion = regions.length > 0 ? regions.indexOf(orgRegion) !== -1 : true;
      return matchesTerm && matchesStage && matchesApproach && matchesRegion;
    });
  }, [allOrgs, approaches, query, regions, stages]);

  if (loading) {
    return <div>Loading finder…</div>;
  }

  if (error) {
    return (
      <div role="alert">
        Finder data unavailable: {error}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <header style={headerStyle}>
        <h1 style={titleStyle}>Finder</h1>
        <p style={subStyle}>
          Filter by technology approach, stage, and geography. Hit enter in the search box to update the shared URL.
        </p>
      </header>

      <div style={layoutStyle}>
        <FinderFilters
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          onSubmit={handleSubmit}
          stageOptions={availableStages}
          selectedStages={stages}
          approachOptions={availableApproaches}
          selectedApproaches={approaches}
          regionOptions={availableRegions}
          selectedRegions={regions}
          onToggle={toggleFilter}
          onReset={resetFilters}
        />

        <main style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <FinderActiveFilters stages={stages} approaches={approaches} regions={regions} onToggle={toggleFilter} />
          <FinderResults matches={filtered} onNavigate={onNavigate} />
        </main>
      </div>
    </div>
  );
};

export default FinderPage;
