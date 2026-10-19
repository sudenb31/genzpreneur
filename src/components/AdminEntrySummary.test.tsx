import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { emptyEntry, encodeEntry, ENTRY_KEY } from '../lib/entry';
import AdminEntrySummary from './AdminEntrySummary';
const mocks=vi.hoisted(()=>({role:'admin',load:vi.fn()}));
vi.mock('../auth/AuthProvider',()=>({useAuth:()=>({profile:{uid:'admin-user',role:mocks.role}})}));
vi.mock('../lib/data',()=>({getProgress:mocks.load}));
beforeEach(()=>{mocks.role='admin';mocks.load.mockReset().mockResolvedValue({notes:{[ENTRY_KEY]:encodeEntry(emptyEntry())}});});
describe('existing admin surface',()=>{
  it('loads only the selected participant on demand and exposes no review write action',async()=>{
    render(<AdminEntrySummary uid="participant"/>);expect(mocks.load).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button',{name:'Lihat ringkasan kondisi awal'}));
    expect(await screen.findByText(/Membuka ringkasan tidak memberi status/)).toBeInTheDocument();
    expect(mocks.load).toHaveBeenCalledWith('participant');expect(screen.queryByRole('button',{name:'Tandai ditinjau'})).not.toBeInTheDocument();
  });
  it.each(['user','mentor'])('does not expose admin reads for %s',role=>{
    mocks.role=role;render(<AdminEntrySummary uid="participant"/>);expect(screen.queryByRole('button')).not.toBeInTheDocument();expect(mocks.load).not.toHaveBeenCalled();
  });
});
