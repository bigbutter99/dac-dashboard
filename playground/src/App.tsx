import * as React from 'react';

const spfxMockDashboardModulePath = '../../src/webparts/dacDashboard/components/MockDashboard';

const MockDashboard = React.lazy(async () => {
  const moduleExports: unknown = await import(/* @vite-ignore */ spfxMockDashboardModulePath);
  const defaultExport = (moduleExports as { default?: unknown }).default ?? moduleExports;
  return { default: defaultExport as React.ComponentType<Record<string, unknown>> };
});

const App: React.FC = () => (
  <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
    <React.Suspense fallback={null}>
      <MockDashboard />
    </React.Suspense>
  </div>
);

export default App;
