import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SimulatorPage from './SimulatorPage';
import { findScenario } from '../content/simulator';

describe('SimulatorPage', () => {
  it('peserta memilih industri & level, mengambil 3 keputusan, lalu melihat skor dan blueprint', () => {
    render(<MemoryRouter initialEntries={['/app/simulasi']}><SimulatorPage /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: /Bayangkan bisnismu/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Kuliner & F&B/ }));
    fireEvent.click(screen.getByRole('button', { name: /Level 1 · Rintis/ }));

    const s = findScenario('fnb', 'rintis')!;
    expect(screen.getByRole('heading', { name: s.title })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Mulai sebagai founder/ }));

    s.decisions.forEach((d, i) => {
      expect(screen.getByRole('heading', { name: d.title })).toBeInTheDocument();
      const best = d.options.find((o) => o.best)!;
      fireEvent.click(screen.getByRole('button', { name: new RegExp(best.label.slice(0, 25).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) }));
      expect(screen.getByText(best.result)).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: i === 2 ? /Lihat hasil & blueprint/ : /Lanjut ke keputusan berikutnya/ }));
    });

    expect(screen.getByRole('heading', { name: /Founder Mode/ })).toBeInTheDocument();
    expect(screen.getByText('3/3 keputusan terbaik')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Blueprint|Kuliner & F&B · Level 1 Rintis/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Salin blueprint/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Coba Level 2 · Tumbuh/ })).toBeInTheDocument();
  });

  it('tautan langsung ke skenario lewat parameter URL', () => {
    render(<MemoryRouter initialEntries={['/app/simulasi?industri=tech&level=skala']}><SimulatorPage /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: findScenario('tech', 'skala')!.title })).toBeInTheDocument();
  });
});
