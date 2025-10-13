import * as React from 'react';
import { Card } from '../../primitives/Card';
import { Chip } from '../../primitives/Chip';
import { optionLabel } from './utils';

interface FinderActiveFiltersProps {
  stages: string[];
  approaches: string[];
  regions: string[];
  onToggle: (kind: 'stage' | 'approach' | 'region', value: string) => void;
}

export const FinderActiveFilters: React.FC<FinderActiveFiltersProps> = ({ stages, approaches, regions, onToggle }) => (
  <Card title="Active filters">
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {stages.map(stage => (
        <Chip key={`stage-${stage}`} label={optionLabel(stage)} selected onClick={() => onToggle('stage', stage)} />
      ))}
      {approaches.map(approach => (
        <Chip key={`approach-${approach}`} label={approach} selected onClick={() => onToggle('approach', approach)} />
      ))}
      {regions.map(region => (
        <Chip key={`region-${region}`} label={region} selected onClick={() => onToggle('region', region)} />
      ))}
      {stages.length === 0 && approaches.length === 0 && regions.length === 0 ? (
        <span style={{ fontSize: 13, color: '#64748b' }}>No filters applied.</span>
      ) : null}
    </div>
  </Card>
);

export default FinderActiveFilters;
