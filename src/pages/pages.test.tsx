import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../auth/AuthProvider';
import { RequireAuth } from '../auth/guards';
import { ToastProvider } from '../components/ui';
import Home from './Home';
import { LoginPage, WaitlistPage, waitlistSchema } from './AuthPages';

const wrap = (ui: React.ReactNode, path = '/') => (
  <MemoryRouter initialEntries={[path]}>
    <ToastProvider><AuthProvider>{ui}</AuthProvider></ToastProvider>
  </MemoryRouter>
);

describe('halaman publik', () => {
  it('Home tampil tanpa klaim jaminan penghasilan', () => {
    render(wrap(<Home />));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Nunggu modal?Skip.');
    expect(screen.getAllByText(/Rp\s?79\.000/).length).toBeGreaterThan(0);
    expect(screen.getByText('GenZ Boost', { exact: false, selector: 'h3' })).toBeInTheDocument();
    expect(document.body.textContent).toMatch(/Trial bisa kamu mulai sendiri/);
    expect(document.body.textContent).toMatch(/Impact gratis 7 hari/);
    expect(document.body.textContent).toMatch(/Tidak ada jaminan penghasilan/);
    // Satu janji + tiga pintu peluang, satu urutan langkah (tanpa duplikasi).
    for (const d of ['Tawarkan jasa', 'Ajak kolaborasi', 'Dekati senior']) expect(screen.getByRole('heading', { name: d })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { name: /Caranya/ })).toHaveLength(1);
    // "AI Coach" hanya boleh disebut sebagai layanan di Heybinder (bukan fitur palsu di aplikasi ini).
    expect(document.body.textContent).toMatch(/AI Coach di Heybinder/);
    expect(document.querySelector('s')).toBeNull();
    // GenZ Impact dijual sebagai paket aplikasi saja; sesi Bung Suden terpisah.
    expect(screen.getByText('GenZ Impact', { exact: false, selector: 'h3' })).toBeInTheDocument();
    expect(document.body.textContent).toMatch(/Rp\s?299\.000/);
    expect(document.body.textContent).toMatch(/Belum termasuk sesi bersama Bung Suden/);
    // Tombol beli langsung ke checkout GoAkal tiap paket.
    expect(screen.getByRole('link', { name: /Beli GenZ Spark/ })).toHaveAttribute('href', 'https://goakal.com/genzpreneur/webinar-b1/z7x0w/apply');
    expect(screen.getByRole('link', { name: /Beli GenZ Boost/ })).toHaveAttribute('href', 'https://goakal.com/genzpreneur/webinar-b1/tzu72/apply');
    expect(screen.getByRole('link', { name: /Beli GenZ Impact/ })).toHaveAttribute('href', 'https://goakal.com/genzpreneur/webinar-b1/2md0s/apply');
  });

  it('tombol ke bagian harga selalu menggulir, walau alamat sudah #harga', () => {
    const spy = vi.fn();
    Element.prototype.scrollIntoView = spy;
    render(wrap(<Home />, '/#harga'));
    spy.mockClear();
    fireEvent.click(screen.getAllByRole('link', { name: /Mulai dari/ })[0]);
    expect(spy).toHaveBeenCalled();
    fireEvent.click(screen.getByRole('link', { name: 'Pilih paket' }));
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('minat Impact tetap daftar minat tanpa kepastian jadwal', () => {
    render(wrap(<WaitlistPage />, '/daftar?minat=impact'));
    expect(screen.getByRole('button', { name: /Impact/ })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(/Pendampingan belum dibuka/)).toBeInTheDocument();
  });

  it('rute /app tanpa konfigurasi Firebase menampilkan layar setup, bukan crash', () => {
    render(wrap(<Routes><Route path="/app" element={<RequireAuth><p>rahasia</p></RequireAuth>} /></Routes>, '/app'));
    expect(screen.getByText('Firebase belum terhubung')).toBeInTheDocument();
    expect(screen.queryByText('rahasia')).not.toBeInTheDocument();
  });

  it('tidak ada pendaftaran mandiri: /daftar adalah daftar tunggu tanpa password', () => {
    render(wrap(<WaitlistPage />));
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Nomor WhatsApp')).toBeInTheDocument();
    expect(screen.queryByLabelText('Password')).not.toBeInTheDocument();
  });
});

describe('login tanpa password', () => {
  it('halaman masuk default: hanya email + kirim link, tanpa password', () => {
    render(wrap(<LoginPage />));
    expect(screen.getByRole('button', { name: 'Kirim link masuk' })).toBeInTheDocument();
    expect(screen.queryByLabelText('Password')).not.toBeInTheDocument();
    expect(screen.getByText('Gabung daftar tunggu')).toBeInTheDocument();
  });
});

describe('validasi daftar tunggu', () => {
  const ok = { name: 'Rani', email: 'rani@mail.com', whatsapp: '081234567890', interest: 'boost' as const, message: '', consent: true as const };
  it('valid', () => expect(waitlistSchema.safeParse(ok).success).toBe(true));
  it('nomor WA tidak valid ditolak', () => expect(waitlistSchema.safeParse({ ...ok, whatsapp: '12345' }).success).toBe(false));
  it('email tidak valid ditolak', () => expect(waitlistSchema.safeParse({ ...ok, email: 'rani' }).success).toBe(false));
  it('tanpa persetujuan ditolak', () => expect(waitlistSchema.safeParse({ ...ok, consent: false }).success).toBe(false));
});

