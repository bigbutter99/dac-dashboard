import * as React from 'react';

declare const __SPFX_MOCK_DASHBOARD__: string;

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { error?: Error }> {
  public state: { error?: Error } = {};

  public static getDerivedStateFromError(error: Error): { error: Error } {
    return { error };
  }

  public render(): React.ReactNode {
    if (!this.state.error) {
      return this.props.children;
    }

    return (
      <div style={{ maxWidth: 900, margin: '48px auto', padding: 16, fontFamily: 'system-ui, -apple-system, Segoe UI, sans-serif' }}>
        <h2 style={{ margin: 0, fontSize: 18 }}>Playground failed to load the dashboard</h2>
        <p style={{ marginTop: 8, color: '#475569' }}>
          If this happened right after a UI change, it is usually a Vite “outside of root” file access issue or a module load error.
        </p>
        <pre style={{ whiteSpace: 'pre-wrap', background: '#0b1220', color: '#e2e8f0', padding: 12, borderRadius: 12, fontSize: 12 }}>
          {String(this.state.error.message || this.state.error)}
        </pre>
        <p style={{ marginTop: 12, color: '#475569' }}>
          Try restarting `npm run dev` and check the browser console/network tab for a blocked `/@fs/...` request.
        </p>
      </div>
    );
  }
}

const MockDashboard = React.lazy(async () => {
  const moduleExports: unknown = await import(/* @vite-ignore */ __SPFX_MOCK_DASHBOARD__);
  const defaultExport = (moduleExports as { default?: unknown }).default ?? moduleExports;
  return { default: defaultExport as React.ComponentType<Record<string, unknown>> };
});

const App: React.FC = () => (
  <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
    <ErrorBoundary>
      <React.Suspense
        fallback={
          <div style={{ maxWidth: 900, margin: '48px auto', padding: 16, color: '#475569', fontFamily: 'system-ui, -apple-system, Segoe UI, sans-serif' }}>
            Loading dashboard…
          </div>
        }
      >
        <MockDashboard />
      </React.Suspense>
    </ErrorBoundary>
  </div>
);

export default App;
