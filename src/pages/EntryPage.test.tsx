import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { emptyEntry, encodeEntry, ENTRY_KEY } from '../lib/entry';
import EntryPage from './EntryPage';
const mocks=vi.hoisted(()=>({load:vi.fn(),save:vi.fn()}));
vi.mock('../auth/AuthProvider',()=>({useAuth:()=>({profile:{uid:'test'}})}));
vi.mock('../lib/data',()=>({getProgress:mocks.load,saveEntry:mocks.save}));
beforeEach(()=>{mocks.load.mockReset().mockResolvedValue({lessons:{},tasks:{old:true},notes:{d1:'Old day note'}});mocks.save.mockReset().mockImplementation(async(_uid,record)=>encodeEntry(record));window.scrollTo=vi.fn();});
const view=()=>render(<MemoryRouter><EntryPage /></MemoryRouter>);
describe('optional condition mapping',()=>{
  it('saves unknown partial answers, reloads them and does not force a profile',async()=>{
    const first=view();const task=await screen.findByLabelText('Pekerjaan kecil apa yang bisa kamu selesaikan sekarang?');
    fireEvent.change(task,{target:{value:'Merapikan deskripsi menu'}});
    fireEvent.click(screen.getByRole('button',{name:'Simpan draf kondisi awal'}));
    await screen.findByText(/Kondisi awal tersimpan/);
    expect(mocks.save).toHaveBeenCalledWith('test',expect.objectContaining({questionVersion:1,ruleVersion:1,answers:expect.objectContaining({task:'Merapikan deskripsi menu',ability:'unknown'})}));
    const saved=mocks.save.mock.calls[0][1];first.unmount();mocks.load.mockResolvedValue({lessons:{},tasks:{old:true},notes:{d1:'Old day note',[ENTRY_KEY]:encodeEntry(saved)}});view();
    fireEvent.click(await screen.findByRole('button',{name:'Ubah jawaban / lanjutkan pengisian'}));
    expect(screen.getByLabelText('Pekerjaan kecil apa yang bisa kamu selesaikan sekarang?')).toHaveValue('Merapikan deskripsi menu');
  });
  it('shows one clarification, allows choosing another entry and never writes mission progress',async()=>{
    mocks.load.mockResolvedValue({lessons:{},tasks:{old:true},notes:{[ENTRY_KEY]:encodeEntry(emptyEntry())}});view();
    expect(await screen.findByText(/Satu pertanyaan:/)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Tahap pilihanmu'),{target:{value:'sample'}});
    fireEvent.click(screen.getByRole('button',{name:'Simpan pilihan titik masuk'}));
    await waitFor(()=>expect(mocks.save).toHaveBeenCalledWith('test',expect.objectContaining({selectedStage:'sample'})));
    expect(await screen.findByRole('link',{name:'Buka pekerjaan: Buat contoh hasil kerja →'})).toHaveAttribute('href','/app/action-plan?tahap=sample');
    fireEvent.click(screen.getByRole('button',{name:'Ubah jawaban / lanjutkan pengisian'}));
    fireEvent.change(screen.getByLabelText('Skill apa yang dirasa sudah kamu miliki?'),{target:{value:'Menulis'}});
    fireEvent.click(screen.getByRole('button',{name:'Simpan & lihat saran'}));
    await waitFor(()=>expect(mocks.save).toHaveBeenLastCalledWith('test',expect.objectContaining({selectedStage:null})));
  });
  it('keeps the current form when saving fails',async()=>{
    mocks.save.mockRejectedValue(new Error('offline'));view();
    fireEvent.change(await screen.findByLabelText('Skill apa yang dirasa sudah kamu miliki?'),{target:{value:'Menulis'}});
    fireEvent.click(screen.getByRole('button',{name:'Simpan & lihat saran'}));
    expect(await screen.findByRole('alert')).toHaveTextContent('Jawaban tetap ada di layar');
    expect(screen.getByLabelText('Skill apa yang dirasa sudah kamu miliki?')).toHaveValue('Menulis');
  });
  it('does not overwrite an unsupported stored version',async()=>{
    mocks.load.mockResolvedValue({lessons:{},tasks:{},notes:{[ENTRY_KEY]:'{"questionVersion":99}'}});view();
    expect(await screen.findByText('Data kondisi awal belum bisa dibaca')).toBeInTheDocument();
    expect(screen.queryByRole('button',{name:'Simpan & lihat saran'})).not.toBeInTheDocument();expect(mocks.save).not.toHaveBeenCalled();
  });
});
