import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../auth/AuthProvider';
import { RequireAuth } from '../auth/guards';
import { ToastProvider } from '../components/ui';
import Home from './Home';
import { RegisterPage } from './AuthPages';
import { registerSchema } from './AuthPages';

const wrap = (ui: React.ReactNode, path = '/') => (
  <MemoryRouter initialEntries={[path]}>
    <ToastProvider><AuthProvider>{ui}</AuthProvider></ToastProvider>
  </MemoryRouter>
);

describe('halaman publik', () => {
  it('Home tampil tanpa klaim jaminan penghasilan', () => {
    render(wrap(<Home />));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Mulai aja dulu');
    expect(screen.getAllByText(/Rp\s?99\.000/).length).toBeGreaterThan(0);
    expect(document.body.textContent).toMatch(/Tidak ada jaminan penghasilan/);
  });

  it('rute /app tanpa konfigurasi Firebase menampilkan layar setup, bukan crash', () => {
    render(wrap(<Routes><Route path="/app" element={<RequireAuth><p>rahasia</p></RequireAuth>} /></Routes>, '/app'));
    expect(screen.getByText('Firebase belum terhubung')).toBeInTheDocument();
    expect(screen.queryByText('rahasia')).not.toBeInTheDocument();
  });

  it('form daftar dirender', () => {
    render(wrap(<RegisterPage />));
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });
});

describe('validasi pendaftaran', () => {
  const ok = { name: 'Rani', email: 'rani@mail.com', password: 'abcd1234', confirm: 'abcd1234', consent: true };
  it('valid', () => expect(registerSchema.safeParse(ok).success).toBe(true));
  it('password tanpa angka ditolak', () => expect(registerSchema.safeParse({ ...ok, password: 'abcdefgh', confirm: 'abcdefgh' }).success).toBe(false));
  it('konfirmasi tidak sama ditolak', () => expect(registerSchema.safeParse({ ...ok, confirm: 'x' }).success).toBe(false));
  it('tanpa persetujuan ditolak', () => expect(registerSchema.safeParse({ ...ok, consent: false }).success).toBe(false));
});
