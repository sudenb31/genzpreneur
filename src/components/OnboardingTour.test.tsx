import { beforeEach, describe, expect, it } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { OnboardingTour, TOUR_STEPS, hasSeenTour, openTour } from './OnboardingTour';

const wrap = (plan: 'spark' | 'boost' | 'impact' = 'spark') => render(
  <MemoryRouter><OnboardingTour uid="u1" plan={plan} isAdmin={false} /></MemoryRouter>,
);

describe('OnboardingTour', () => {
  beforeEach(() => { localStorage.clear(); });

  it('peserta baru disambut lalu dibawa melewati 5 langkah', () => {
    wrap();
    expect(screen.getByRole('heading', { name: /Selamat datang di GenZ Preneur/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Mulai tur/ }));
    for (let i = 1; i < TOUR_STEPS.length; i += 1) {
      expect(screen.getByRole('heading', { name: TOUR_STEPS[i].title })).toBeInTheDocument();
      expect(screen.getByText(`Langkah ${i} dari ${TOUR_STEPS.length - 1}`)).toBeInTheDocument();
      if (i < TOUR_STEPS.length - 1) fireEvent.click(screen.getByRole('button', { name: /Lanjut/ }));
    }
    expect(TOUR_STEPS.length - 1).toBe(5);
    fireEvent.click(screen.getByRole('button', { name: /Mulai Misi Pertama/ }));
    expect(hasSeenTour('u1')).toBe(true);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('fitur yang belum termasuk paket diberi tanda gembok', () => {
    wrap('spark');
    fireEvent.click(screen.getByRole('button', { name: /Mulai tur/ }));
    for (let i = 1; i < 4; i += 1) fireEvent.click(screen.getByRole('button', { name: /Lanjut/ }));
    expect(screen.getByText(/Fitur ini ada di/)).toBeInTheDocument();
  });

  it('tidak muncul lagi setelah dilewati, tapi bisa dibuka ulang', () => {
    const first = wrap();
    fireEvent.click(screen.getByRole('button', { name: 'Lewati' }));
    first.unmount();
    wrap();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    act(() => openTour());
    expect(screen.getByRole('heading', { name: /Selamat datang/ })).toBeInTheDocument();
  });
});
