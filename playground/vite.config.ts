import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const playgroundDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(playgroundDir, '..');
const mockDashboardPath = path.resolve(repoRoot, 'src', 'webparts', 'dacDashboard', 'components', 'MockDashboard.tsx');
const mockDashboardFsUrl = `/@fs/${mockDashboardPath.replace(/\\\\/g, '/')}`;

export default defineConfig({
  plugins: [react()],
  define: {
    __SPFX_MOCK_DASHBOARD__: JSON.stringify(mockDashboardFsUrl)
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json', '.mjs']
  },
  server: {
    port: 5173,
    open: true,
    fs: {
      allow: [repoRoot]
    }
  }
});
