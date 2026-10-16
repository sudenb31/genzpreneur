import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../auth/AuthProvider';
import { ToastProvider } from './ui';
import HppCalculator from './HppCalculator';
import ToolIntro from './ToolIntro';
import { TOOL_GUIDES } from '../content/toolGuides';

const wrap = (ui: React.ReactNode) => (
  <MemoryRouter><ToastProvider><AuthProvider>{ui}</AuthProvider></ToastProvider></MemoryRouter>
);

describe('Kalkulator HPP', () => {
  it('langsung menampilkan contoh produk dan hasilnya', () => {
    render(wrap(<HppCalculator />));
    expect(screen.getByText(/Es kopi susu gula aren/)).toBeInTheDocument();
    expect(screen.getByText('Harga jual rekomendasi')).toBeInTheDocument();
    expect(document.body.textContent).toMatch(/14\.000/); // harga rekomendasi
    expect(document.body.textContent).toMatch(/10\.252/); // biaya penuh
  });
  it('mode jasa memuat contoh jasa; harga Rp250rb ditandai margin tipis', () => {
    render(wrap(<HppCalculator />));
    fireEvent.click(screen.getByRole('button', { name: '🛠️ Jasa' }));
    expect(screen.getByText(/Jasa desain 9 feed/)).toBeInTheDocument();
    expect(screen.getByText('MARGIN TIPIS')).toBeInTheDocument();
    expect(document.body.textContent).toMatch(/343\.000/);
  });
  it('isian tidak valid menampilkan pesan, bukan crash', () => {
    render(wrap(<HppCalculator />));
    fireEvent.change(screen.getByLabelText(/1 batch menghasilkan/), { target: { value: '0' } });
    expect(screen.getByText(/Ada isian yang perlu dicek/)).toBeInTheDocument();
  });
});

describe('Panduan alat', () => {
  it('setiap alat punya panduan lengkap', () => {
    for (const g of Object.values(TOOL_GUIDES)) {
      expect(g.what.length).toBeGreaterThan(40);
      expect(g.steps.length).toBeGreaterThanOrEqual(3);
      expect(g.when.length).toBeGreaterThanOrEqual(2);
    }
  });
  it('bisa disembunyikan dan ditampilkan lagi', () => {
    render(<ToolIntro tool="hpp" />);
    expect(screen.getByText('🪜 Cara pakai')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Sembunyikan panduan' }));
    expect(screen.queryByText('🪜 Cara pakai')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Tampilkan panduan' }));
    expect(screen.getByText('🪜 Cara pakai')).toBeInTheDocument();
  });
});
