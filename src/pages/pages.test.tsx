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
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Mulai langkahmu');
    expect(screen.getAllByText(/Rp\s?49\.000/).length).toBeGreaterThan(0);
    expect(screen.getByText('GenZ Boost', { exact: false, selector: 'h3' })).toBeInTheDocument();
    expect(document.body.textContent).toMatch(/coba GenZ Boost gratis 3 hari/);
    expect(document.body.textContent).toMatch(/coba GenZ Impact gratis 7 hari/);
    expect(document.body.textContent).toMatch(/Tidak ada jaminan penghasilan/);
    // 10 jalur mulai & FAQ tanpa fitur yang belum ada
    expect(screen.getByText('Banyak jalan ke cuan pertama.')).toBeInTheDocument();
    expect(screen.getByText('Digitalisasi UMKM')).toBeInTheDocument();
    // "AI Coach" hanya boleh disebut sebagai layanan di Heybinder (bukan fitur palsu di aplikasi ini).
    expect(document.body.textContent).toMatch(/AI Coach di Heybinder/);
    expect(document.body.textContent).not.toMatch(/AI Coach menggantikan/);
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
