/**
 * DATA UJI — semua jawaban di file ini fiktif, hanya untuk pengujian.
 * Firestore di-mock: yang diuji adalah perilaku halaman (simpan, lanjutkan, hasil, ganti titik masuk).
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ToastProvider } from '../components/ui';
import { emptyAnswers, type BaselineAnswers } from '../lib/baseline';
import type { BaselineRecord } from '../lib/data';

const getBaseline = vi.fn();
const saveBaseline = vi.fn();
const setChosenEntry = vi.fn();
vi.mock('../lib/data', () => ({
  getBaseline: (...a: unknown[]) => getBaseline(...a),
  saveBaseline: (...a: unknown[]) => saveBaseline(...a),
  setChosenEntry: (...a: unknown[]) => setChosenEntry(...a),
}));
vi.mock('../auth/AuthProvider', () => ({ useAuth: () => ({ profile: { uid: 'uji-1', displayName: 'Peserta Uji' } }) }));

import BaselinePage from './BaselinePage';

type RecInput = Partial<Omit<BaselineRecord, 'answers'>> & { answers?: Partial<BaselineAnswers> };
const rec = (over: RecInput = {}): BaselineRecord => ({
  exists: true, step: 0, status: 'draft', chosenEntry: null, result: null, questionsVersion: 'v1', updatedAt: null,
  ...over,
  answers: { ...emptyAnswers(), ...(over.answers ?? {}) },
});

const view = () => render(<MemoryRouter><ToastProvider><BaselinePage /></ToastProvider></MemoryRouter>);

beforeEach(() => {
  getBaseline.mockReset(); saveBaseline.mockReset(); setChosenEntry.mockReset();
  saveBaseline.mockResolvedValue(undefined); setChosenEntry.mockResolvedValue(undefined);
  window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
});

describe('Kondisi Awal — formulir', () => {
  it('peserta baru: mulai di langkah 1, ada opsi "Belum tahu", simpan lalu pindah langkah', async () => {
    getBaseline.mockResolvedValue(rec({ exists: false }));
    view();
    expect(await screen.findByRole('heading', { name: '1. Tujuanmu' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('radio', { name: 'Belum tahu' }));
    fireEvent.click(screen.getByRole('button', { name: /Simpan & lanjut/ }));
    expect(await screen.findByRole('heading', { name: '2. Skill & pekerjaan kecil' })).toBeInTheDocument();
    expect(saveBaseline).toHaveBeenCalledTimes(1);
    const [uid, p] = saveBaseline.mock.calls[0];
    expect(uid).toBe('uji-1');
    expect(p).toMatchObject({ step: 1, complete: false, isNew: true });
    expect(p.answers.goal).toBe('unsure');
    // Label formulir terhubung ke input (aksesibilitas)
    expect(screen.getByLabelText('Satu pekerjaan kecil yang bisa kamu selesaikan sekarang')).toBeInTheDocument();
  });

  it('draf lama: lanjut di langkah tersimpan dengan jawaban tersimpan + pengingat privasi', async () => {
    getBaseline.mockResolvedValue(rec({ step: 3, answers: { customerType: 'Kedai kopi (uji)' } }));
    view();
    expect(await screen.findByRole('heading', { name: '4. Calon penerima bantuan' })).toBeInTheDocument();
    expect(screen.getByLabelText('Jenis bisnis yang ingin kamu bantu (opsional)')).toHaveValue('Kedai kopi (uji)');
    expect(screen.getByText(/Jangan tulis nama, kontak, atau data rahasia/)).toBeInTheDocument();
  });

  it('jawaban terlalu panjang: pesan kesalahan tampil dan tidak disimpan', async () => {
    getBaseline.mockResolvedValue(rec({ step: 0 }));
    view();
    const t = await screen.findByLabelText('Ceritakan singkat (opsional)');
    fireEvent.change(t, { target: { value: 'x'.repeat(301) } });
    expect(screen.getByText(/Terlalu panjang \(301\/300\)/)).toBeInTheDocument();
    expect(t).toHaveAttribute('aria-invalid', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Simpan draf' }));
    expect(saveBaseline).not.toHaveBeenCalled();
  });

  it('gagal menyimpan: pesan error, jawaban tetap di layar, tidak pindah langkah', async () => {
    getBaseline.mockResolvedValue(rec({ step: 0 }));
    saveBaseline.mockRejectedValue(new Error('offline'));
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    view();
    fireEvent.click(await screen.findByRole('radio', { name: 'Belajar dasar bisnis dulu' }));
    fireEvent.click(screen.getByRole('button', { name: /Simpan & lanjut/ }));
    expect(await screen.findByText(/Gagal menyimpan/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '1. Tujuanmu' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Belajar dasar bisnis dulu' })).toBeChecked();
    // Jawaban peserta tidak boleh masuk log
    expect(JSON.stringify(log.mock.calls)).not.toMatch(/learn_basics|Belajar dasar/);
    log.mockRestore();
  });

  it('langkah terakhir menyimpan sebagai selesai lalu menampilkan hasil', async () => {
    getBaseline.mockResolvedValue(rec({ step: 5, answers: { taskConfidence: 'done_before', smallTask: 'desain 3 postingan (uji)', customerClarity: 'unsure' } }));
    view();
    fireEvent.click(await screen.findByRole('button', { name: /Lihat rekomendasi/ }));
    expect(await screen.findByText('Langkah berikutnya untukmu')).toBeInTheDocument();
    expect(saveBaseline.mock.calls[0][1]).toMatchObject({ step: 5, complete: true });
  });
});

describe('Kondisi Awal — hasil', () => {
  it('jawaban bertentangan → rekomendasi SEMENTARA + satu pertanyaan klarifikasi', async () => {
    getBaseline.mockResolvedValue(rec({ status: 'complete', answers: { experience: 'offered', taskConfidence: 'none' } }));
    view();
    expect(await screen.findByText('Rekomendasi sementara')).toBeInTheDocument();
    expect(screen.getByText(/belum cukup jelas/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Jawab pertanyaan ini' }));
    expect(await screen.findByRole('heading', { name: '2. Skill & pekerjaan kecil' })).toBeInTheDocument();
  });

  it('status jujur: "Dilaporkan peserta", tanpa "Ditinjau mentor", tanpa persentase/label kemampuan', async () => {
    getBaseline.mockResolvedValue(rec({ status: 'complete', answers: { taskConfidence: 'done_before', smallTask: 'edit video (uji)', exampleStatus: 'practice', exampleRelevance: 'relevant', customerClarity: 'clear', customerType: 'warung (uji)', customerProblem: 'foto gelap (uji)' } }));
    view();
    expect(await screen.findByText('📝 Dilaporkan peserta')).toBeInTheDocument();
    expect(screen.getByText('📎 Contoh tersedia (dilaporkan)')).toBeInTheDocument();
    const body = document.body.textContent ?? '';
    expect(body).not.toMatch(/Ditinjau mentor/);
    expect(body).not.toMatch(/\d+\s?%/);
    expect(body).not.toMatch(/Starter|Builder|Runner|unggul|lemah/);
    expect(body).toMatch(/bukan sertifikasi kemampuan dan bukan penilaian mentor/);
    expect(screen.getByText('Rapikan ruang lingkup, penawaran, harga & pendekatan')).toBeInTheDocument();
  });

  it('pilih titik masuk lain: hanya chosenEntry yang disimpan — jawaban/progres tidak ditimpa', async () => {
    getBaseline.mockResolvedValue(rec({ status: 'complete', answers: { taskConfidence: 'none' } }));
    view();
    fireEvent.click(await screen.findByRole('button', { name: /Pilih titik masuk lain/ }));
    const group = screen.getByRole('group', { name: 'Titik masuk' });
    fireEvent.click(within(group).getByRole('radio', { name: /Rapikan ruang lingkup/ }));
    // Prasyarat yang belum ada ditampilkan, bukan dianggap selesai
    expect(screen.getByText(/Titik ini membutuhkan:/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Simpan pilihan' }));
    await waitFor(() => expect(setChosenEntry).toHaveBeenCalledWith('uji-1', 'D'));
    expect(saveBaseline).not.toHaveBeenCalled();
    expect(await screen.findByText('Titik masuk pilihanmu')).toBeInTheDocument();
    expect(screen.getByText('Cek cepat sebelum mulai')).toBeInTheDocument();
  });

  it('tombol aksi hanya menuju rute yang ada', async () => {
    getBaseline.mockResolvedValue(rec({ status: 'complete', answers: { taskConfidence: 'none' } }));
    view();
    await screen.findByText('Langkah berikutnya untukmu');
    const links = screen.getAllByRole('link', { name: 'Buka →' }).map((a) => a.getAttribute('href'));
    expect(links.length).toBeGreaterThan(0);
    links.forEach((h) => expect(h).toMatch(/^\/app\/(belajar\/[a-z0-9-]+|toolkit(\?tab=\w+)?|action-plan|outreach)$/));
  });
});
