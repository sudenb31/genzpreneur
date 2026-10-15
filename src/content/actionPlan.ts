/** Practical Action Plan — 7 hari pertama. Status = dilaporkan sendiri (self-reported). */
export interface PlanTask { id: string; label: string; link?: { to: string; label: string } }
export interface PlanDay { day: number; title: string; goal: string; tasks: PlanTask[] }

export const ACTION_PLAN: PlanDay[] = [
  {
    day: 1, title: 'Kenali Dirimu', goal: 'Tahu titik mulaimu dan arah yang paling masuk akal.',
    tasks: [
      { id: 'd1-passport', label: 'Lengkapi Entrepreneur Passport', link: { to: '/app/passport', label: 'Passport' } },
      { id: 'd1-assessment', label: 'Selesaikan Assessment industri', link: { to: '/app/assessment', label: 'Assessment' } },
      { id: 'd1-mindset', label: 'Pelajari materi Mindset pelajaran 1', link: { to: '/app/belajar/mindset', label: 'Mindset' } },
    ],
  },
  {
    day: 2, title: 'Pilih Jalur & Riset', goal: 'Pilih satu jalur modal Rp0 dan satu segmen calon klien.',
    tasks: [
      { id: 'd2-route', label: 'Pelajari "5 jalur bisnis modal Rp0" dan pilih satu', link: { to: '/app/belajar/business-partner', label: 'Business Partner' } },
      { id: 'd2-ideas', label: 'Jalankan prompt "10 ide layanan modal Rp0"', link: { to: '/app/toolkit?tab=prompts', label: 'AI Toolkit' } },
      { id: 'd2-prospects', label: 'Tulis 20 calon prospek beserta alasan cocok', link: { to: '/app/belajar/sales-marketing', label: 'Materi prospek' } },
    ],
  },
  {
    day: 3, title: 'Susun Penawaran', goal: 'Punya penawaran yang jelas dan bisa langsung dikirim.',
    tasks: [
      { id: 'd3-offer', label: 'Pelajari rumus Masalah → Hasil → Bukti → Ajakan', link: { to: '/app/belajar/sales-marketing', label: 'Sales & Marketing' } },
      { id: 'd3-proposal', label: 'Buat proposal di Template Proposal & simpan', link: { to: '/app/toolkit?tab=proposal', label: 'Template Proposal' } },
      { id: 'd3-calc', label: 'Hitung harga/komisi dengan kalkulator', link: { to: '/app/toolkit?tab=calculator', label: 'Kalkulator' } },
    ],
  },
  {
    day: 4, title: 'Siapkan Bukti', goal: 'Punya minimal 1 contoh hasil kerja untuk ditunjukkan.',
    tasks: [
      { id: 'd4-sample', label: 'Buat 1 contoh hasil kerja (desain/konten/rencana) untuk 1 prospek', },
      { id: 'd4-pilot', label: 'Tentukan batas uji coba gratis (jumlah, durasi)', link: { to: '/app/outreach', label: 'Outreach Studio' } },
      { id: 'd4-portfolio', label: 'Pelajari "Dari satu klien menjadi portofolio"', link: { to: '/app/belajar/business-partner', label: 'Business Partner' } },
    ],
  },
  {
    day: 5, title: 'Mulai Outreach', goal: 'Mengirim pesan personal pertama — satu per satu, bukan broadcast.',
    tasks: [
      { id: 'd5-mentor', label: 'Kirim 1 pesan ke calon mentor', link: { to: '/app/outreach', label: 'Outreach Studio' } },
      { id: 'd5-five', label: 'Kirim 5 pesan personal ke prospek', link: { to: '/app/outreach', label: 'Outreach Studio' } },
      { id: 'd5-log', label: 'Catat siapa saja yang dihubungi & tanggalnya' },
    ],
  },
  {
    day: 6, title: 'Follow-up & Latihan', goal: 'Menindaklanjuti dan siap menjawab keberatan.',
    tasks: [
      { id: 'd6-five', label: 'Kirim 5 pesan baru ke prospek berikutnya', link: { to: '/app/outreach', label: 'Outreach Studio' } },
      { id: 'd6-objection', label: 'Latihan keberatan dengan prompt roleplay', link: { to: '/app/toolkit?tab=prompts', label: 'AI Toolkit' } },
      { id: 'd6-lesson', label: 'Pelajari "Follow-up, keberatan, dan closing"', link: { to: '/app/belajar/sales-marketing', label: 'Sales & Marketing' } },
    ],
  },
  {
    day: 7, title: 'Review & Rencana Berikutnya', goal: 'Evaluasi jujur dan tentukan 7 hari berikutnya.',
    tasks: [
      { id: 'd7-count', label: 'Hitung: berapa dihubungi, dibalas, dan lanjut ngobrol' },
      { id: 'd7-improve', label: 'Tulis 1 hal yang akan diperbaiki di pesanmu' },
      { id: 'd7-next', label: 'Tentukan target aktivitas minggu depan' },
    ],
  },
];

export const ALL_TASK_IDS = ACTION_PLAN.flatMap((d) => d.tasks.map((t) => t.id));
