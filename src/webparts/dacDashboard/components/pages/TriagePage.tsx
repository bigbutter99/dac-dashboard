import * as React from 'react';
import { Card } from '../primitives/Card';
import { Chip } from '../primitives/Chip';
import type { HashNavigate } from '../navigation';

interface LeaderboardRow {
  org: string;
  score: number;
  rationale: string[];
}

const mockRows: LeaderboardRow[] = [
  { org: 'Climeworks', score: 92, rationale: ['Expansion milestone', 'Procurement opportunity'] },
  { org: 'Heirloom', score: 88, rationale: ['Execution risk', 'New target uncovered'] },
  { org: 'Carbon Engineering', score: 76, rationale: ['Policy follow-up', 'Financing conversation'] },
  { org: 'Carbfix', score: 65, rationale: ['Storage interface', 'Buyer interest'] }
];

export const TriagePage: React.FC<{ onNavigate: HashNavigate }> = ({ onNavigate }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <h1 style={{ margin: 0, fontSize: 26, color: '#0f172a' }}>Triage</h1>
      <button
        type="button"
        onClick={() => onNavigate('/radar')}
        style={{
          background: 'transparent',
          border: '1px solid rgba(15, 23, 42, 0.18)',
          borderRadius: 8,
          padding: '6px 10px',
          cursor: 'pointer'
        }}
      >
        ← Radar
      </button>
    </header>

    <Card title="Engagement leaderboard" footer="Scores blend signal urgency, pipeline value, and relationship strength.">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {mockRows.map(row => (
          <div
            key={row.org}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
              paddingBottom: 10
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <strong style={{ fontSize: 16 }}>{row.org}</strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {row.rationale.map(reason => (
                  <Chip key={reason} label={reason} />
                ))}
              </div>
            </div>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>{row.score}</span>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

export default TriagePage;
