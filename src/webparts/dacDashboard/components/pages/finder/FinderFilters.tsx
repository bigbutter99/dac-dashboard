import * as React from 'react';
import { Card } from '../../primitives/Card';
import { optionLabel } from './utils';

const filtersStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16
};

const checklistStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8
};

interface FinderFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  stageOptions: string[];
  selectedStages: string[];
  approachOptions: string[];
  selectedApproaches: string[];
  regionOptions: string[];
  selectedRegions: string[];
  onToggle: (kind: 'stage' | 'approach' | 'region', value: string) => void;
  onReset: () => void;
}

export const FinderFilters: React.FC<FinderFiltersProps> = ({
  searchValue,
  onSearchChange,
  onSubmit,
  stageOptions,
  selectedStages,
  approachOptions,
  selectedApproaches,
  regionOptions,
  selectedRegions,
  onToggle,
  onReset
}) => (
  <div style={filtersStyle}>
    <Card title="Search">
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <input
          type="search"
          value={searchValue}
          onChange={event => onSearchChange(event.target.value)}
          placeholder="Search by name, approach, country"
          style={{
            padding: '10px 12px',
            borderRadius: 8,
            border: '1px solid rgba(15, 23, 42, 0.18)',
            fontSize: 14
          }}
        />
        <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>Press enter to apply.</p>
      </form>
    </Card>

    <Card
      title="Filters"
      headerActions={
        selectedStages.length > 0 || selectedApproaches.length > 0 || selectedRegions.length > 0 ? (
          <button
            type="button"
            onClick={onReset}
            style={{
              border: 'none',
              background: 'transparent',
              color: '#2563eb',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600
            }}
          >
            Clear all
          </button>
        ) : null
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <section>
          <h4 style={{ margin: '0 0 6px', fontSize: 13, color: '#0f172a', textTransform: 'uppercase', letterSpacing: 0.8 }}>
            Stage
          </h4>
          <div style={checklistStyle}>
            {stageOptions.map(stage => (
              <label key={stage} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                <input type="checkbox" checked={selectedStages.indexOf(stage) !== -1} onChange={() => onToggle('stage', stage)} />
                {optionLabel(stage)}
              </label>
            ))}
          </div>
        </section>

        <section>
          <h4 style={{ margin: '0 0 6px', fontSize: 13, color: '#0f172a', textTransform: 'uppercase', letterSpacing: 0.8 }}>
            Approach
          </h4>
          <div style={checklistStyle}>
            {approachOptions.map(approach => (
              <label key={approach} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                <input
                  type="checkbox"
                  checked={selectedApproaches.indexOf(approach) !== -1}
                  onChange={() => onToggle('approach', approach)}
                />
                {approach}
              </label>
            ))}
          </div>
        </section>

        <section>
          <h4 style={{ margin: '0 0 6px', fontSize: 13, color: '#0f172a', textTransform: 'uppercase', letterSpacing: 0.8 }}>
            Region
          </h4>
          <div style={checklistStyle}>
            {regionOptions.map(region => (
              <label key={region} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                <input type="checkbox" checked={selectedRegions.indexOf(region) !== -1} onChange={() => onToggle('region', region)} />
                {region}
              </label>
            ))}
          </div>
        </section>
      </div>
    </Card>
  </div>
);

export default FinderFilters;
