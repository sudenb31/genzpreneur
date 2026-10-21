import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
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
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Punya skill?Ubah jadi jasa pertamamu.');
    expect(screen.getAllByText(/Rp\s?49\.000/).length).toBeGreaterThan(0);
    expect(screen.getByText('GenZ Boost', { exact: false, selector: 'h3' })).toBeInTheDocument();
    expect(document.body.textContent).toMatch(/Trial aplikasi/);
    expect(document.body.textContent).toMatch(/7 hari/);
    expect(document.body.textContent).toMatch(/Tidak ada jaminan penghasilan/);
    // 10 jalur mulai & FAQ tanpa fitur yang belum ada
    expect(screen.getByText('Jalur referensi untuk dieksplorasi.')).toBeInTheDocument();
    expect(screen.getByText('Digitalisasi UMKM')).toBeInTheDocument();
    // "AI Coach" hanya boleh disebut sebagai layanan di Heybinder (bukan fitur palsu di aplikasi ini).
    expect(document.body.textContent).toMatch(/AI Coach di Heybinder/);
    expect(document.body.textContent).not.toMatch(/AI Coach menggantikan/);
    expect(document.querySelector('s')).toBeNull();
    // GenZ Impact dijual sebagai paket aplikasi saja; pendampingan tetap terpisah & belum dibuka.
    expect(screen.getByText('GenZ Impact', { exact: false, selector: 'h3' })).toBeInTheDocument();
    expect(document.body.textContent).toMatch(/Rp\s?299\.000/);
    expect(document.body.textContent).toMatch(/pendampingan bersama Bung Suden terpisah dan belum dibuka/);
    // Tombol beli langsung ke checkout GoAkal tiap paket.
    expect(screen.getByRole('link', { name: /Beli GenZ Spark/ })).toHaveAttribute('href', 'https://goakal.com/genzpreneur/webinar-b1/z7x0w/apply');
    expect(screen.getByRole('link', { name: /Beli GenZ Boost/ })).toHaveAttribute('href', 'https://goakal.com/genzpreneur/webinar-b1/tzu72/apply');
    expect(screen.getByRole('link', { name: /Beli GenZ Impact/ })).toHaveAttribute('href', 'https://goakal.com/genzpreneur/webinar-b1/2md0s/apply');
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

