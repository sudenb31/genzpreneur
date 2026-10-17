import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { emptyPassport } from '../lib/passport';
import { emptyDreamPact } from '../lib/dreamPact';
import { MODULES } from '../content/modules';
import { ToastProvider } from '../components/ui';
import Dashboard from './Dashboard';
import ModulePage from './ModulePage';

const mocks = vi.hoisted(() => ({
  saveLesson: vi.fn(),
  can: vi.fn(() => true),
}));
vi.mock('../auth/AuthProvider', () => ({ useAuth: () => ({ profile: { uid: 'test', displayName: 'Rani', email: 'test@example.com' }, firebaseUser: { emailVerified: true } }) }));
vi.mock('../auth/AccessProvider', () => ({ useAccess: () => ({ loading: false, can: mocks.can }), LockedFeature: () => <p>Materi terkunci</p> }));
vi.mock('../lib/data', () => ({
  getPassport: async () => ({ exists: false, data: emptyPassport('Rani') }),
  getDreamPact: async () => ({ exists: false, data: emptyDreamPact('Rani') }),
  getAssessment: async () => null,
  getProgress: async () => ({ lessons: {}, tasks: {}, notes: {} }),
  saveLesson: mocks.saveLesson,
}));

beforeEach(() => {
  mocks.can.mockReset().mockReturnValue(true);
  mocks.saveLesson.mockReset().mockResolvedValue(undefined);
  window.scrollTo = vi.fn();
  HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  HTMLDialogElement.prototype.close = function () { this.open = false; };
});

describe('dashboard action guidance', () => {
  it('offers a real task even when the Passport is incomplete', async () => {
    render(<MemoryRouter><Dashboard /></MemoryRouter>);
    expect(await screen.findByRole('link', { name: 'Lanjut Misi Pertama →' })).toHaveAttribute('href', '/app/action-plan?tahap=start');
    expect(screen.getByRole('link', { name: 'Lanjutkan pelajaran →' })).toHaveAttribute('href', expect.stringContaining('/app/belajar/'));
    expect(screen.queryByRole('link', { name: 'Lengkapi Passport' })).not.toBeInTheDocument();
  });
  it('falls back to available learning when Action Plan is locked', async () => {
    mocks.can.mockImplementation((...args: unknown[]) => args[0] !== 'actionPlan');
    render(<MemoryRouter><Dashboard /></MemoryRouter>);
    expect(await screen.findByRole('link', { name: 'Buka pelajaran →' })).toHaveAttribute('href', expect.stringContaining('/app/belajar/'));
    expect(screen.queryByRole('link', { name: 'Lanjut Misi Pertama →' })).not.toBeInTheDocument();
  });
});

const first = MODULES[0];
const renderLesson = () => render(<MemoryRouter initialEntries={[`/app/belajar/${first.slug}`]}><ToastProvider><Routes><Route path="/app/belajar/:slug" element={<ModulePage />} /></Routes></ToastProvider></MemoryRouter>);

describe('lesson drafts and navigation', () => {
  it('saves a draft without marking the lesson complete', async () => {
    renderLesson();
    const field = await screen.findByLabelText('✍️ Latihan');
    fireEvent.change(field, { target: { value: 'Contoh latihan saya' } });
    fireEvent.click(screen.getByRole('button', { name: 'Simpan draf' }));
    await waitFor(() => expect(mocks.saveLesson).toHaveBeenCalledWith('test', first.lessons[0].id, { done: false, reflection: 'Contoh latihan saya' }));
    expect(await screen.findByText(/Jawaban tersimpan di akunmu/)).toBeInTheDocument();
  });
  it('keeps the draft when cancelling a lesson switch', async () => {
    renderLesson();
    const field = await screen.findByLabelText('✍️ Latihan');
    fireEvent.change(field, { target: { value: 'Jangan hilangkan latihan ini' } });
    fireEvent.click(screen.getByRole('button', { name: 'Pelajaran berikutnya →' }));
    expect(await screen.findByRole('dialog')).toHaveTextContent('Latihan belum disimpan');
    fireEvent.click(screen.getByRole('button', { name: 'Kembali ke latihan' }));
    expect(field).toHaveValue('Jangan hilangkan latihan ini');
    expect(mocks.saveLesson).not.toHaveBeenCalled();
  });
  it('preserves the answer when saving fails', async () => {
    mocks.saveLesson.mockRejectedValueOnce(new Error('offline'));
    renderLesson();
    const field = await screen.findByLabelText('✍️ Latihan');
    fireEvent.change(field, { target: { value: 'Masih tersimpan di layar' } });
    fireEvent.click(screen.getByRole('button', { name: 'Simpan draf' }));
    expect(await screen.findByText(/Gagal menyimpan. Jawabanmu masih ada/)).toBeInTheDocument();
    expect(field).toHaveValue('Masih tersimpan di layar');
    expect(screen.getByRole('button', { name: 'Simpan draf' })).toBeEnabled();
  });
});
