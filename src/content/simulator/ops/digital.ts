import type { SimIndustryOps } from '../types';

export const DIGITAL_OPS: SimIndustryOps = {
  ops: {
    rintis: {
      snapshot: {
        omzetBulan: 1.2, labaBulan: 0.8, marginKotor: 90, biayaTetapBulan: 0.25, kas: 2,
        pelanggan: '2 klien UMKM (kedai kopi & toko hijab), retainer Rp600rb/bulan masing-masing',
        catatan: 'Biaya tetap = langganan aplikasi desain & penjadwal posting. Jam kerjamu ±60 jam/bulan → bayaranmu ±Rp20rb/jam.',
      },
      roles: [
        {
          role: 'Kamu — topi Strategi & Akun klien', jumlah: 'kamu sendiri',
          misi: 'Memahami tujuan bisnis klien dan menjaga hubungan, bukan sekadar membuat posting.',
          harian: ['Balas klien di jam kerja (09.00–18.00)', 'Cek komentar & DM akun klien'],
          mingguan: ['Rapat 15 menit dengan tiap klien (tujuan minggu ini)', 'Hubungi 10 UMKM baru dengan contoh perbaikan untuk IG mereka'],
          kpi: ['Klien bertahan ≥3 bulan', '2 studi kasus dengan angka'],
          prospek: ['UMKM dengan rating Google Maps bagus tapi IG jarang update', 'Komunitas/bazar UMKM & asosiasi pedagang lokal', 'Referral dari klien yang puas (beri diskon 1 bulan)', 'Pemilik usaha di jaringan keluarga & kampus'],
        },
        {
          role: 'Kamu — topi Produksi konten', jumlah: 'kamu sendiri',
          misi: 'Konten tepat waktu sesuai kalender dan identitas merek klien.',
          harian: ['Posting sesuai jadwal', 'Desain & caption untuk 2–3 konten'],
          mingguan: ['Produksi borongan untuk minggu depan (Selasa–Rabu)', 'Kirim konten ke klien untuk persetujuan (Kamis)'],
          kpi: ['0 posting terlewat', 'Maks. 2 revisi per konten'],
          tools: ['Template desain per klien', 'Aplikasi penjadwal posting'],
        },
        {
          role: 'Kamu — topi Admin & Keuangan', jumlah: 'kamu sendiri',
          misi: 'Dibayar tepat waktu dan tahu waktu yang habis per klien.',
          harian: ['Catat jam kerja per klien'],
          mingguan: ['Siapkan laporan hasil sederhana (reach, DM masuk)'],
          kpi: ['Invoice dibayar di muka setiap tanggal 1', 'Jam per klien <20/bulan'],
        },
      ],
      ritme: [
        { kapan: 'Senin pagi', agenda: 'Susun kalender konten semua klien minggu depan', siapa: 'Kamu' },
        { kapan: 'Selasa–Rabu', agenda: 'Produksi konten borongan', siapa: 'Kamu' },
        { kapan: 'Kamis', agenda: 'Kirim draf untuk persetujuan klien', siapa: 'Kamu' },
        { kapan: 'Jumat', agenda: 'Jadwalkan posting + prospek baru', siapa: 'Kamu' },
        { kapan: 'Tanggal 1', agenda: 'Laporan bulanan + invoice bulan berikutnya', siapa: 'Kamu' },
      ],
      funnel: { periode: 'per bulan', steps: [{ tahap: 'UMKM dihubungi', angka: 40 }, { tahap: 'Membalas', angka: 10 }, { tahap: 'Meeting/discovery', angka: 4 }, { tahap: 'Klien baru', angka: 1 }] },
    },
    tumbuh: {
      snapshot: {
        omzetBulan: 58, labaBulan: 9, marginKotor: 85, biayaTetapBulan: 36, kas: 35, piutang: 14,
        pelanggan: '9 klien retainer (1 klien properti = 40% pendapatan)',
        catatan: 'Margin kotor dikurangi freelancer & tools per klien. Biaya tetap = gaji 5 orang ±Rp30 juta, coworking, software.',
      },
      roles: [
        {
          role: 'Founder', jumlah: '1',
          misi: 'Strategi, akuisisi klien baru, dan melepas review harian ke senior.',
          harian: ['Review prioritas tim 09.30', 'Maksimal 1 jam review kreatif (target turun ke 0 setelah ada senior)'],
          mingguan: ['3 discovery call calon klien', 'Review profitabilitas per klien (Jumat)'],
          kpi: ['Tidak ada klien >25% pendapatan', '2 klien baru/bulan'],
          prospek: ['Bisnis properti, klinik, F&B multi-outlet (anggaran iklan rutin)', 'LinkedIn: owner/marketing manager UMKM menengah', 'Webinar/kelas gratis untuk pemilik usaha → leads', 'Kemitraan dengan agensi web/branding (saling rujuk)'],
        },
        {
          role: 'Account manager', jumlah: '1', atasan: 'Founder',
          misi: 'Klien puas, brief jelas, dan semua pekerjaan tepat waktu.',
          harian: ['Update status di tools proyek', 'Komunikasi semua klien (satu pintu)'],
          mingguan: ['Rapat mingguan dengan tiap klien', 'Laporan hasil mingguan singkat'],
          kpi: ['Retensi klien ≥90%', 'Brief lengkap sebelum produksi 100%'],
        },
        {
          role: 'Desainer', jumlah: '2', atasan: 'Founder (nanti: creative lead)',
          misi: 'Desain sesuai brand guideline klien.',
          harian: ['Produksi sesuai antrean tugas'],
          mingguan: ['Perbarui template per klien'],
          kpi: ['Revisi rata-rata ≤1,5 per konten'],
        },
        {
          role: 'Videografer/editor', jumlah: '1', atasan: 'Founder',
          misi: 'Video pendek yang menahan penonton.',
          harian: ['Edit video sesuai jadwal'],
          mingguan: ['Syuting borongan 1 hari untuk 2–3 klien'],
          kpi: ['Retensi 3 detik pertama ≥60%'],
        },
        {
          role: 'Copywriter', jumlah: '1', atasan: 'Founder',
          misi: 'Caption & naskah yang menjual.',
          harian: ['Caption & naskah sesuai kalender'],
          mingguan: ['Riset 3 kompetitor per klien'],
          kpi: ['Deadline 100%'],
        },
      ],
      ritme: [
        { kapan: 'Setiap hari 09.30 (15 menit)', agenda: 'Stand-up: tugas hari ini, hambatan', siapa: 'Semua tim' },
        { kapan: 'Senin', agenda: 'Status semua klien di dashboard proyek', siapa: 'Founder + AM' },
        { kapan: 'Rabu', agenda: 'Review kreatif (nanti dipegang senior)', siapa: 'Founder/senior + kreatif' },
        { kapan: 'Jumat', agenda: 'Laporan klien & profitabilitas per klien', siapa: 'Founder + AM' },
        { kapan: 'Tanggal 1', agenda: 'Invoice di muka semua klien', siapa: 'Admin/AM' },
      ],
      funnel: { periode: 'per bulan', steps: [{ tahap: 'Prospek dihubungi', angka: 60 }, { tahap: 'Discovery call', angka: 15 }, { tahap: 'Proposal', angka: 6 }, { tahap: 'Klien baru', angka: 2 }] },
    },
    skala: {
      snapshot: {
        omzetBulan: 260, labaBulan: 35, marginKotor: 85, biayaTetapBulan: 172, kas: 220, piutang: 60,
        pelanggan: '±28 klien retainer (UMKM menengah & korporat)',
        catatan: 'Biaya tetap = gaji 20 orang ±Rp150 juta, kantor, software. Net margin ±13%.',
      },
      roles: [
        {
          role: 'CEO', jumlah: '1',
          misi: 'Positioning agensi, klien besar, talenta, dan transformasi AI.',
          harian: ['Dashboard: utilisasi tim, pipeline, kesehatan akun'],
          mingguan: ['Rapat kepemimpinan Senin', '2 pitch klien besar'],
          kpi: ['Net margin ≥18%', 'Retensi klien ≥85%/tahun'],
        },
        {
          role: 'Account director + account manager', jumlah: '1 + 2', atasan: 'CEO',
          misi: 'Akun sehat, upsell, dan setiap akun punya 2 PIC.',
          harian: ['Komunikasi klien & eskalasi masalah'],
          mingguan: ['Health check akun (merah/kuning/hijau)', 'Business review dengan 2 klien'],
          kpi: ['Net revenue retention ≥100%', 'Akun merah <10%'],
          prospek: ['Upsell ke klien lama (iklan, video, AI content)', 'Rujukan dari klien puas', 'Industri dengan anggaran digital besar: properti, edukasi, kesehatan'],
        },
        {
          role: 'Creative director', jumlah: '1', atasan: 'CEO',
          misi: 'Standar kualitas & alur kerja kreatif berbantuan AI.',
          harian: ['Review kreatif sesuai checklist'],
          mingguan: ['Pelatihan tim (AI tools, format baru)'],
          kpi: ['Waktu produksi −30%', 'Revisi ≤1 per konten'],
        },
        {
          role: 'Tim kreatif', jumlah: '10', atasan: 'Creative director',
          misi: 'Produksi konten & video sesuai paket.',
          harian: ['Produksi sesuai antrean'],
          mingguan: ['Berbagi 1 eksperimen format terbaik'],
          kpi: ['Utilisasi 75–80%'],
        },
        {
          role: 'Performance marketer', jumlah: '2', atasan: 'Account director',
          misi: 'Iklan klien menghasilkan leads/penjualan terukur.',
          harian: ['Optimasi kampanye'],
          mingguan: ['Laporan ROAS/CPL per klien'],
          kpi: ['ROAS/CPL sesuai target tiap klien'],
        },
        {
          role: 'Finance & HR', jumlah: '2', atasan: 'CEO',
          misi: 'Invoice, gaji, kontrak, dan data profitabilitas.',
          harian: ['Penagihan & pembayaran'],
          mingguan: ['Laporan profitabilitas per klien & per paket'],
          kpi: ['Hari piutang <15', 'Turnover <20%/tahun'],
        },
      ],
      ritme: [
        { kapan: 'Setiap hari 09.30', agenda: 'Stand-up per tim (kreatif, akun, performance)', siapa: 'Lead masing-masing tim' },
        { kapan: 'Senin 10.00', agenda: 'Rapat kepemimpinan: pipeline, utilisasi, akun merah', siapa: 'CEO, CD, AD, finance' },
        { kapan: 'Rabu', agenda: 'Review kreatif & eksperimen AI', siapa: 'CD + kreatif' },
        { kapan: 'Jumat', agenda: 'Health check akun & laporan ROAS', siapa: 'AD, AM, performance' },
        { kapan: 'Kuartalan', agenda: 'Business review dengan setiap klien', siapa: 'AD + AM + klien' },
      ],
      funnel: { periode: 'per bulan', steps: [{ tahap: 'Prospek', angka: 120 }, { tahap: 'Discovery call', angka: 25 }, { tahap: 'Proposal/pitch', angka: 10 }, { tahap: 'Klien baru', angka: 4 }] },
    },
  },
  exec: {
    rintis: [
      [
        { siapa: 'Kamu', tugas: 'Tulis ringkasan layanan 1 halaman: 12 konten/bulan, 2× revisi, revisi tambahan Rp50rb, jam respons 09.00–18.00.' },
        { siapa: 'Kamu', tugas: 'Buat form brief 6 pertanyaan supaya permintaan klien jelas sejak awal.' },
        { siapa: 'Klien', tugas: 'Menyetujui ringkasan layanan lewat chat ("Setuju").' },
      ],
      [
        { siapa: 'Kamu', tugas: 'Susun 3 paket (Basic/Growth/Pro) dengan daftar deliverable & laporan.' },
        { siapa: 'Kamu', tugas: 'Ubah hasil 2 klien jadi studi kasus singkat (sebelum–sesudah, angka reach/DM).' },
        { siapa: 'Kamu', tugas: 'Presentasikan ke klinik dalam 20 menit; tutup dengan pilihan paket.' },
      ],
      [
        { siapa: 'Kamu', tugas: 'Rekrut 1 desainer junior lewat tes kecil berbayar (2 desain).' },
        { siapa: 'Kamu', tugas: 'Siapkan template brand per klien (font, warna, contoh) + SOP serah terima.' },
        { siapa: 'Freelancer', tugas: 'Kerjakan desain dari template; kamu fokus strategi & caption.' },
      ],
    ],
    tumbuh: [
      [
        { siapa: 'Account manager', tugas: 'Siapkan laporan hasil 6 bulan klien properti (leads, biaya per leads).' },
        { siapa: 'Founder', tugas: 'Tawarkan paket ramping (−20% harga, −35% deliverable).' },
        { siapa: 'Founder', tugas: 'Target 2 klien baru bulan ini: 15 discovery call dari daftar prospek.' },
      ],
      [
        { siapa: 'Founder', tugas: 'Rekrut senior content strategist dengan tes kasus nyata.' },
        { siapa: 'Senior (baru)', tugas: 'Bulan 1: playbook kualitas + template per klien; ambil alih review kreatif.' },
        { siapa: 'Desainer & copywriter', tugas: 'Ikut sesi pelatihan mingguan dari senior.' },
      ],
      [
        { siapa: 'Founder', tugas: 'Tulis kebijakan penagihan & kirim ke semua klien.' },
        { siapa: 'Account manager', tugas: 'Pengingat H+7; tawarkan kesepakatan cicilan tertulis untuk tunggakan lama.' },
        { siapa: 'Admin/AM', tugas: 'Mulai bulan depan, invoice di muka setiap tanggal 1.' },
      ],
    ],
    skala: [
      [
        { siapa: 'Creative director', tugas: 'Pilih AI tools & susun alur kerja (draf AI → kurasi → finishing manusia).' },
        { siapa: 'Tim kreatif', tugas: 'Pelatihan 2 minggu + ukur waktu produksi sebelum & sesudah.' },
        { siapa: 'Account director', tugas: 'Jual ulang paket berbasis hasil ke 3 klien yang menekan harga.' },
      ],
      [
        { siapa: 'CEO + CD', tugas: 'Rancang 3 paket standar + harga premium untuk custom.' },
        { siapa: 'Account manager', tugas: 'Onboarding 5 hari dengan checklist untuk setiap klien baru.' },
        { siapa: 'Finance', tugas: 'Ukur profitabilitas per paket setiap bulan.' },
      ],
      [
        { siapa: 'CEO', tugas: 'Bicara 1-on-1: jalur karier & bonus retensi klien.' },
        { siapa: 'Account director', tugas: 'Pasang PIC kedua untuk 4 akun yang ia pegang.' },
        { siapa: 'Finance & HR', tugas: 'Dokumentasi akun (brief, akses, histori) di sistem perusahaan.' },
      ],
    ],
  },
};
