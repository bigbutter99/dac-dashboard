import * as React from 'react';
import MockDashboard from '../../src/webparts/dacDashboard/components/MockDashboard';

const App: React.FC = () => (
  <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
    <MockDashboard />
  </div>
);

export default App;
