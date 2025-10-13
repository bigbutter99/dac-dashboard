import * as React from 'react';
import styles from './DacDashboard.module.scss';
import type { IDacDashboardProps } from './IDacDashboardProps';
import MockDashboard from './MockDashboard';

export default class DacDashboard extends React.Component<IDacDashboardProps, {}> {
  public render(): React.ReactElement<IDacDashboardProps> {
    return (
      <section className={`${styles.dacDashboard} ${this.props.hasTeamsContext ? styles.teams : ''}`}>
        <MockDashboard />
      </section>
    );
  }
}
