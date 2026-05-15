import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock global de fetch para que los componentes no fallen
vi.stubGlobal('fetch', vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]),
    ok: true
  })
));