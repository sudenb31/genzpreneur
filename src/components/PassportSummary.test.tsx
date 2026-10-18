import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PassportSummary from './PassportSummary';
import { emptyPassport } from '../lib/passport';

describe('PassportSummary', () => {
  it('menampilkan level, langkah berikutnya, dan profil cuan dari assessment', () => {
    const p = emptyPassport('Suden Bahaudin');
    render(
      <MemoryRouter>
        <PassportSummary passport={p} completion={100} assessment={{ topIndustries: ['fnb', 'retail', 'event'], topProfiles: ['creator', 'star'] }} onEdit={vi.fn()} />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Level kesiapan: Starter/)).toBeInTheDocument();
    expect(screen.getByText(/Langkah berikutnya buatmu/)).toBeInTheDocument();
    expect(screen.getByText(/Si Pencipta/)).toBeInTheDocument();
    expect(screen.getByTestId('readiness')).toHaveTextContent('0');
  });
  it('tanpa assessment → ajak mulai assessment', () => {
    render(
      <MemoryRouter>
        <PassportSummary passport={emptyPassport('A')} completion={40} assessment={null} onEdit={vi.fn()} />
      </MemoryRouter>,
    );
    expect(screen.getByText(/40% lengkap/)).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /assessment/i }).length).toBeGreaterThan(0);
  });
});
