import * as React from 'react';
import AppShell from '../../src/webparts/dacDashboard/components/App';
import MockProvider from '../../src/webparts/dacDashboard/data/MockProvider';

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <AppShell provider={new MockProvider()} />
    </div>
  );
}
