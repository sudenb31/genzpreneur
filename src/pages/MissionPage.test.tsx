import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ToastProvider } from '../components/ui';
import { MISSION_STEPS } from '../content/mission';
import { encodeMissionDraft } from '../lib/mission';
import MissionPage from './MissionPage';

const mocks = vi.hoisted(() => ({ save: vi.fn(), can: vi.fn(), load: vi.fn() }));
vi.mock('../auth/AuthProvider', () => ({ useAuth: () => ({ profile: { uid: 'test' } }) }));
vi.mock('../auth/AccessProvider', () => ({ useAccess: () => ({ loading: false, can: mocks.can }) }));
vi.mock('../lib/data', () => ({ getProgress: mocks.load, saveMissionArtifact: mocks.save }));
beforeEach(() => {
  mocks.can.mockReset().mockReturnValue(true);
  mocks.load.mockReset().mockResolvedValue({ lessons: {}, tasks: { 'd1-passport': true }, notes: { d1: 'Catatan lama tetap ada' } });
  mocks.save.mockReset().mockImplementation(async (_uid, _id, draft) => encodeMissionDraft(draft));
  window.scrollTo = vi.fn();
  HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  HTMLDialogElement.prototype.close = function () { this.open = false; };
});
const wrap = (path = '/app/action-plan') => <MemoryRouter initialEntries={[path]}><ToastProvider><MissionPage /></ToastProvider></MemoryRouter>;

describe('Misi Pertama', () => {
  it('saves partial work without requiring a complete profile or all checkboxes', async () => {
    render(wrap());
    const field = await screen.findByLabelText('Hasil kerjamu');
    fireEvent.change(field, { target: { value: 'Saya punya HP dan waktu dua jam.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Simpan hasil kerja' }));
    await waitFor(() => expect(mocks.save).toHaveBeenCalledWith('test', 'start', { text: 'Saya punya HP dan waktu dua jam.', checks: [] }));
    expect(await screen.findByText(/Versi ini tersimpan/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /checklist & catatan tujuh hari/ })).toHaveAttribute('href', '/app/action-plan/arsip');
  });
  it('clears self checks when the work changes', async () => {
    render(wrap());
    const field = await screen.findByLabelText('Hasil kerjamu');
    fireEvent.change(field, { target: { value: 'Contoh pertama' } });
    const check = screen.getByRole('checkbox', { name: MISSION_STEPS[0].criteria[0] });
    fireEvent.click(check);
    expect(check).toBeChecked();
    fireEvent.change(field, { target: { value: 'Contoh yang diubah' } });
    expect(check).not.toBeChecked();
  });
  it('keeps unsaved work when cancelling a stage switch', async () => {
    render(wrap());
    const field = await screen.findByLabelText('Hasil kerjamu');
    fireEvent.change(field, { target: { value: 'Draf belum disimpan' } });
    fireEvent.click(screen.getByRole('button', { name: 'Tahap berikutnya →' }));
    expect(await screen.findByRole('dialog')).toHaveTextContent('Hasil kerja belum disimpan');
    fireEvent.click(screen.getByRole('button', { name: 'Kembali ke draf' }));
    expect(field).toHaveValue('Draf belum disimpan');
    expect(mocks.save).not.toHaveBeenCalled();
  });
  it('preserves the draft when backend persistence fails', async () => {
    mocks.save.mockRejectedValueOnce(new Error('offline'));
    render(wrap());
    const field = await screen.findByLabelText('Hasil kerjamu');
    fireEvent.change(field, { target: { value: 'Jangan hilangkan contoh ini' } });
    fireEvent.click(screen.getByRole('button', { name: 'Simpan hasil kerja' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Draf tetap ada di layar');
    expect(field).toHaveValue('Jangan hilangkan contoh ini');
    expect(screen.getByRole('button', { name: 'Simpan hasil kerja' })).toBeEnabled();
  });
  it('offers manual work even when optional tools are locked', async () => {
    mocks.can.mockReturnValue(false);
    render(wrap('/app/action-plan?tahap=offer'));
    expect(await screen.findByLabelText('Hasil kerjamu')).toBeEnabled();
    expect(screen.queryByRole('link', { name: /HPP & Harga/ })).not.toBeInTheDocument();
    expect(screen.getByText(/Alat tambahan bukan syarat/)).toBeInTheDocument();
  });
});
