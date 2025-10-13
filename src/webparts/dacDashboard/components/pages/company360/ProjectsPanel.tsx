import * as React from 'react';
import type { Project } from '../../../data/IDataProvider';
import { Card } from '../../primitives/Card';
import { formatDate, stageLabel } from './utils';

interface ProjectsPanelProps {
  projects: Project[];
}

export const ProjectsPanel: React.FC<ProjectsPanelProps> = ({ projects }) => (
  <Card title="Projects">
    {projects.length === 0 ? (
      <p style={{ margin: 0, color: '#94a3b8' }}>Projects pipeline is being assembled.</p>
    ) : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {projects.map(project => (
          <div key={project.id} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <strong style={{ fontSize: 15 }}>{project.name}</strong>
            <span style={{ fontSize: 13, color: '#475569' }}>
              {stageLabel(project.stage)} · {project.location || 'Site TBD'} · {project.status}
            </span>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>
              Start {formatDate(project.start_date)} · Capacity{' '}
              {project.capacity_tCO2_per_year ? `${project.capacity_tCO2_per_year.toLocaleString()} tCO₂/y` : 'TBD'}
            </span>
          </div>
        ))}
      </div>
    )}
  </Card>
);

export default ProjectsPanel;
