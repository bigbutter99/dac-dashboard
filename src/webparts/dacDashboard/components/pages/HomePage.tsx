import * as React from 'react';
import type { IDataProvider, Org } from '../../data/IDataProvider';
import { Stage } from '../../data/IDataProvider';
import { Card } from '../primitives/Card';
import type { HashNavigate } from '../navigation';

interface HomePageProps {
  provider: IDataProvider;
  onNavigate: HashNavigate;
}

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 16
};

const heroStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12
};

const heroTitleStyle: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 700,
  color: '#0f172a',
  margin: 0
};

const heroSubStyle: React.CSSProperties = {
  color: '#475569',
  fontSize: 15,
  margin: 0
};

const linkStyle: React.CSSProperties = {
  color: '#2563eb',
  textDecoration: 'none',
  fontWeight: 600
};

const formatNumber = (value: number | undefined): string => {
  if (value === undefined || Number.isNaN(value)) {
    return '—';
  }
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toString();
};

export const HomePage: React.FC<HomePageProps> = ({ provider, onNavigate }) => {
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
        setError(err instanceof Error ? err.message : String(err));
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [provider]);

  if (loading) {
    return <div>Loading portfolio…</div>;
  }

  if (error) {
    return (
      <div role="alert">
        Failed to load portfolio: {error}
      </div>
    );
  }

  const totalFunding = orgs.reduce((sum, org) => sum + (org.totalFundingUsd || 0), 0);
  const approaches = Array.from(new Set(orgs.map(org => org.approach).filter(Boolean)));
  const countries = Array.from(new Set(orgs.map(org => org.country).filter(Boolean)));
  const averageFreshness =
    orgs.length > 0
      ? Math.round(orgs.reduce((sum, org) => sum + (org.freshnessDays || 0), 0) / orgs.length)
      : undefined;
  const commercialCount = orgs.filter(
    org => org.stage === Stage.Commercial || org.stage === Stage.CommercialPilot
  ).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <header style={heroStyle}>
        <h1 style={heroTitleStyle}>Direct Air Capture tracker</h1>
        <p style={heroSubStyle}>
          Monitoring technology vendors, buyers, storage partners, and their execution signals.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <a style={linkStyle} href="#/finder">
            Explore directory →
          </a>
          <a style={linkStyle} href="#/network">
            Map relationships →
          </a>
          <a style={linkStyle} href="#/radar">
            Operational radar →
          </a>
        </div>
      </header>

      <section style={gridStyle}>
        <Card title="Organizations tracked">
          <strong style={{ fontSize: 32 }}>{orgs.length}</strong>
          <p style={{ margin: 0, color: '#475569' }}>Active profiles sourced in the last update cycle.</p>
        </Card>
        <Card title="Total disclosed funding (USD)">
          <strong style={{ fontSize: 32 }}>{formatNumber(totalFunding)}</strong>
          <p style={{ margin: 0, color: '#475569' }}>Across public and private rounds captured.</p>
        </Card>
        <Card title="Approach diversity">
          <strong style={{ fontSize: 32 }}>{approaches.length}</strong>
          <p style={{ margin: 0, color: '#475569' }}>Distinct capture approaches represented.</p>
        </Card>
        <Card title="Geographic coverage">
          <strong style={{ fontSize: 32 }}>{countries.length}</strong>
          <p style={{ margin: 0, color: '#475569' }}>Countries hosting current DAC activity.</p>
        </Card>
        <Card title="Commercial & pilots">
          <strong style={{ fontSize: 32 }}>{commercialCount}</strong>
          <p style={{ margin: 0, color: '#475569' }}>Organizations operating at commercial or pilot scale.</p>
        </Card>
        <Card title="Average data freshness">
          <strong style={{ fontSize: 32 }}>{averageFreshness !== undefined ? `${averageFreshness}d` : '—'}</strong>
          <p style={{ margin: 0, color: '#475569' }}>Mean days since latest update.</p>
        </Card>
      </section>

      <Card
        title="What changed (30d)"
        headerActions={
          <button
            type="button"
            onClick={() => onNavigate('/radar')}
            style={{
              border: '1px solid rgba(37, 99, 235, 0.4)',
              background: '#1d4ed8',
              color: '#fff',
              borderRadius: 999,
              padding: '6px 14px',
              fontSize: 12,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 0.6,
              cursor: 'pointer'
            }}
          >
            View radar
          </button>
        }
        footer="Recent changes are derived from news monitoring, vendor reports, and analyst annotations."
      >
        <p style={{ margin: 0, color: '#475569' }}>
          Change log dashboards are in progress. Expect deployment volume, new partnerships, and procurement signals
          captured here soon.
        </p>
      </Card>
    </div>
  );
};

export default HomePage;
