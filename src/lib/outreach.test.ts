import { describe, expect, it } from 'vitest';
import { buildAiPrompt, buildMessage, CHANNELS, SCENARIOS, TONES, whatsappLink, type OutreachInput } from './outreach';

const base: OutreachInput = {
  scenario: 'mentor', channel: 'whatsapp', tone: 'casual', myName: 'Rani', myContext: 'mahasiswa', targetName: 'Budi',
  businessName: 'Kopi Senja', industry: 'fnb', offer: 'foto menu', observation: 'menu belum ada fotonya',
};

describe('buildMessage', () => {
  it('semua kombinasi menghasilkan pesan berisi nama bisnis & tanpa placeholder kosong', () => {
    for (const s of SCENARIOS) for (const c of CHANNELS) for (const t of TONES) {
      const m = buildMessage({ ...base, scenario: s.key, channel: c.key, tone: t.key });
      expect(m.body).toContain('Kopi Senja');
      expect(m.body).not.toContain('undefined');
      expect(m.body).not.toMatch(/\[nama (bisnis|kamu)\]/);
      if (c.key === 'email') expect(m.subject).toBeTruthy();
      if (c.key === 'email' || c.key === 'linkedin') expect(m.body).not.toMatch(/👋|🙏|😊/);
    }
  });
  it('memakai observasi spesifik', () => {
    expect(buildMessage(base).body).toContain('menu belum ada fotonya');
  });
  it('placeholder muncul bila data kosong (tidak mengarang)', () => {
    const m = buildMessage({ ...base, businessName: '', myName: '' });
    expect(m.body).toContain('[nama bisnis]');
  });
  it('sales partner menyebut komisi dari order lunas', () => {
    expect(buildMessage({ ...base, scenario: 'sales_partner' }).body).toMatch(/lunas/);
  });
});

describe('buildAiPrompt & whatsappLink', () => {
  it('prompt melarang klaim palsu', () => {
    expect(buildAiPrompt(base)).toMatch(/jangan menjanjikan hasil/i);
  });
  it('tautan WA ter-encode', () => {
    expect(whatsappLink('Halo Kak & teman')).toBe('https://wa.me/?text=Halo%20Kak%20%26%20teman');
  });
});
