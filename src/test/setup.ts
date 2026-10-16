import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Bersihkan DOM setelah tiap test agar render antar-test tidak saling menumpuk.
afterEach(() => cleanup());
