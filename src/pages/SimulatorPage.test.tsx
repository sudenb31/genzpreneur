import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SimulatorPage from './SimulatorPage';
import { SIM_DECISION_COUNT, SIM_PHASES, findScenario, phaseOf } from '../content/simulator';

const esc = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

describe('SimulatorPage', () => {
  beforeEach(() => { localStorage.clear(); });

  it('peserta menjalankan 90 hari (10 keputusan + laporan tiap bulan), lalu melihat skor dan blueprint', () => {
    render(<MemoryRouter initialEntries={['/app/simulasi']}><SimulatorPage /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: /Bayangkan bisnismu/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Kuliner & F&B/ }));
    fireEvent.click(screen.getByRole('button', { name: /Level 1 · Rintis/ }));

    const s = findScenario('fnb', 'rintis')!;
    expect(s.decisions).toHaveLength(SIM_DECISION_COUNT);
    expect(screen.getByRole('heading', { name: s.title })).toBeInTheDocument();
    // Laporan bisnis dengan periode eksplisit
    expect(screen.getByRole('heading', { name: /Laporan bisnis — rata-rata PER BULAN/ })).toBeInTheDocument();
    expect(screen.getAllByText(/per bulan · total penjualan kotor/).length).toBeGreaterThan(0);
    // Peta perjalanan 90 hari
    expect(screen.getByRole('heading', { name: /Perjalanan 90 hari · 10 keputusan/ })).toBeInTheDocument();
    // Tab tim & ritme
    fireEvent.click(screen.getByRole('tab', { name: /Tim & job desk/ }));
    expect(screen.getByText(s.ops.roles[0].role)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: /Ritme & funnel/ }));
    expect(screen.getByRole('heading', { name: /Ritme kerja/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Funnel penjualan/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Mulai sebagai founder/ }));

    s.decisions.forEach((d, i) => {
      expect(screen.getByRole('heading', { name: d.title })).toBeInTheDocument();
      expect(screen.getByText(new RegExp(`Keputusan ${i + 1} dari ${SIM_DECISION_COUNT}`))).toBeInTheDocument();
      const best = d.options.find((o) => o.best)!;
      fireEvent.click(screen.getByRole('button', { name: new RegExp(esc(best.label.slice(0, 25))) }));
      expect(screen.getByText(best.result)).toBeInTheDocument();
      expect(screen.getByText(/Begini timmu menjalankannya/)).toBeInTheDocument();
      expect(screen.getByText(d.execution[0].tugas)).toBeInTheDocument();
      const ph = phaseOf(i);
      if (i === s.decisions.length - 1) {
        fireEvent.click(screen.getByRole('button', { name: /Lihat hasil & blueprint/ }));
      } else if (ph.to === i) {
        fireEvent.click(screen.getByRole('button', { name: new RegExp(`Lihat laporan akhir ${ph.name}`) }));
        expect(screen.getByRole('heading', { name: new RegExp(`${ph.name} selesai`) })).toBeInTheDocument();
        expect(screen.getByText(`${ph.to - ph.from + 1}/${ph.to - ph.from + 1} keputusan tepat`)).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: new RegExp(`Mulai ${(SIM_PHASES as readonly { name: string }[])[ph.no].name}`) }));
      } else {
        fireEvent.click(screen.getByRole('button', { name: /Lanjut ke keputusan berikutnya/ }));
      }
    });

    expect(screen.getByRole('heading', { name: /Founder Mode/ })).toBeInTheDocument();
    expect(screen.getByText(`${SIM_DECISION_COUNT}/${SIM_DECISION_COUNT} keputusan terbaik`)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Rapor per area bisnis/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Pembahasan 90 hari/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Blueprint|Kuliner & F&B · Level 1 Rintis/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Salin blueprint/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Siapa ngapain di bisnis ini/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Coba Level 2 · Tumbuh/ })).toBeInTheDocument();
  });

  it('progres tersimpan: setelah halaman dibuka ulang, peserta lanjut dari keputusan terakhir', () => {
    const s = findScenario('retail', 'tumbuh')!;
    const url = '/app/simulasi?industri=retail&level=tumbuh';
    const first = render(<MemoryRouter initialEntries={[url]}><SimulatorPage /></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: /Mulai sebagai founder/ }));
    const best = s.decisions[0].options.find((o) => o.best)!;
    fireEvent.click(screen.getByRole('button', { name: new RegExp(esc(best.label.slice(0, 25))) }));
    first.unmount();

    render(<MemoryRouter initialEntries={[url]}><SimulatorPage /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: s.decisions[1].title })).toBeInTheDocument();
  });

  it('tautan langsung ke skenario lewat parameter URL', () => {
    render(<MemoryRouter initialEntries={['/app/simulasi?industri=tech&level=skala']}><SimulatorPage /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: findScenario('tech', 'skala')!.title })).toBeInTheDocument();
    expect(screen.getByText(/Runway ±6,2 bulan/)).toBeInTheDocument();
  });
});

describe('SimulatorPage — mode percobaan (Spark/Boost)', () => {
  beforeEach(() => { localStorage.clear(); });

  it('skenario Impact terkunci dan mengarah ke daftar tunggu GenZ Impact', () => {
    render(<MemoryRouter initialEntries={['/app/simulasi?industri=tech&level=skala']}><SimulatorPage fullAccess={false} /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: findScenario('tech', 'skala')!.title })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Mulai sebagai founder/ })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /29 skenario lain \+ playbook lengkap/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /daftar tunggu GenZ Impact/ })).toHaveAttribute('href', '/daftar?minat=impact');
    fireEvent.click(screen.getByRole('button', { name: /Main Kuliner & F&B · Level 1 gratis/ }));
    expect(screen.getByRole('heading', { name: findScenario('fnb', 'rintis')!.title })).toBeInTheDocument();
  });

  it('pemilih skenario menandai yang gratis & yang terkunci', () => {
    render(<MemoryRouter initialEntries={['/app/simulasi?industri=fnb']}><SimulatorPage fullAccess={false} /></MemoryRouter>);
    expect(screen.getByText(/Mode percobaan/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Level 1 · Rintis · ✨ Gratis/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Level 2 · Tumbuh · 🔒 Impact/ })).toBeInTheDocument();
  });

  it('skenario gratis bisa dimainkan penuh, lalu ditutup ajakan ke GenZ Impact', () => {
    const s = findScenario('fnb', 'rintis')!;
    render(<MemoryRouter initialEntries={['/app/simulasi?industri=fnb&level=rintis']}><SimulatorPage fullAccess={false} /></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: /Mulai sebagai founder/ }));
    s.decisions.forEach((d, i) => {
      const best = d.options.find((o) => o.best)!;
      fireEvent.click(screen.getByRole('button', { name: new RegExp(esc(best.label.slice(0, 25))) }));
      const ph = phaseOf(i);
      if (i === s.decisions.length - 1) fireEvent.click(screen.getByRole('button', { name: /Lihat hasil & blueprint/ }));
      else if (ph.to === i) { fireEvent.click(screen.getByRole('button', { name: /Lihat laporan akhir/ })); fireEvent.click(screen.getByRole('button', { name: /^Mulai Bulan/ })); }
      else fireEvent.click(screen.getByRole('button', { name: /Lanjut ke keputusan berikutnya/ }));
    });
    expect(screen.getByRole('heading', { name: /Founder Mode/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /29 skenario lain \+ playbook lengkap/ })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Coba Level 2/ })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Salin blueprint/ })).toBeInTheDocument();
  });
});
