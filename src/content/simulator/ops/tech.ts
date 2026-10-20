import type { SimIndustryOps } from '../types';

export const TECH_OPS: SimIndustryOps = {
  ops: {
    rintis: {
      snapshot: {
        omzetBulan: 0, labaBulan: -0.15, marginKotor: 90, biayaTetapBulan: 0.15, kas: 5,
        pelanggan: 'Belum ada pengguna',
        catatan: 'Belum ada pendapatan. Biaya tetap = domain & hosting/no-code. Di software, pendapatan dihitung sebagai MRR (pendapatan langganan per bulan).',
      },
      roles: [
        {
          role: 'Kamu — topi Produk', jumlah: 'kamu sendiri',
          misi: 'Memahami masalah pemilik kos lebih baik daripada mereka sendiri.',
          harian: ['Catat keluhan & permintaan pengguna'],
          mingguan: ['Wawancara 5 pemilik kos', 'Tentukan 1 fitur untuk dibangun'],
          kpi: ['15 wawancara sebelum membangun', '4 dari 5 pengguna aktif mingguan'],
        },
        {
          role: 'Kamu — topi Builder', jumlah: 'kamu sendiri',
          misi: 'MVP sederhana yang jalan, bukan aplikasi sempurna.',
          harian: ['Bangun/perbaiki 1 hal kecil'],
          mingguan: ['Rilis versi baru tiap Jumat'],
          kpi: ['MVP dalam 2 minggu', 'Bug kritis diperbaiki <24 jam'],
          tools: ['No-code / framework sederhana', 'Spreadsheet sebagai database awal'],
        },
        {
          role: 'Kamu — topi Penjualan', jumlah: 'kamu sendiri',
          misi: 'Pengguna pertama yang mau membayar.',
          harian: ['Kunjungi/WA 3 pemilik kos'],
          mingguan: ['Demo ke 5 calon pengguna'],
          kpi: ['3 pengguna berbayar di bulan ke-2'],
          prospek: ['Kos di sekitar kampus (papan "Terima kos")', 'Grup Facebook/WA pemilik kos', 'Pengelola kos multi-gedung', 'Pemilik kos di jaringan keluarga'],
        },
        {
          role: 'Teman desainer', jumlah: '1 (sukarela)', atasan: 'Kamu',
          misi: 'Tampilan sederhana & mudah dipakai orang tua.',
          harian: ['Catat layar yang membuat pengguna bingung saat uji'],
          mingguan: ['1 perbaikan tampilan dari hasil uji'],
          kpi: ['Pemilik kos bisa membuat tagihan tanpa dibantu'],
        },
      ],
      ritme: [
        { kapan: 'Senin–Selasa', agenda: 'Wawancara & kunjungan pemilik kos', siapa: 'Kamu' },
        { kapan: 'Rabu–Kamis', agenda: 'Membangun', siapa: 'Kamu + desainer' },
        { kapan: 'Jumat', agenda: 'Rilis & uji ke pengguna', siapa: 'Kamu' },
        { kapan: 'Minggu', agenda: 'Review: apa yang dipakai, apa yang tidak', siapa: 'Kamu' },
      ],
      funnel: { periode: 'per bulan', steps: [{ tahap: 'Pemilik kos dihubungi', angka: 60 }, { tahap: 'Wawancara/demo', angka: 15 }, { tahap: 'Coba gratis', angka: 5 }, { tahap: 'Bayar', angka: 3 }] },
    },
    tumbuh: {
      snapshot: {
        omzetBulan: 18, labaBulan: -40, marginKotor: 85, biayaTetapBulan: 55, kas: 110,
        pelanggan: '280 pemilik kos & properti kecil, rata-rata Rp64rb/bulan',
        catatan: 'Omzet = MRR (pendapatan langganan per bulan). Margin kotor dikurangi server & biaya WhatsApp API. Biaya tetap = gaji 4 orang + tools. Rugi Rp40 juta/bulan = burn → runway ±2,7 bulan kalau tidak berubah.',
      },
      roles: [
        {
          role: 'CEO/produk', jumlah: '1',
          misi: 'Retensi dulu, lalu pertumbuhan; jaga runway.',
          harian: ['Dashboard: MRR, churn, aktivasi, kas'],
          mingguan: ['Telepon 5 pelanggan yang berhenti', 'Prioritas roadmap'],
          kpi: ['Churn bulanan <5%', 'Runway ≥9 bulan'],
        },
        {
          role: 'Developer', jumlah: '2', atasan: 'CEO',
          misi: 'Fitur yang menurunkan churn & stabilitas sistem.',
          harian: ['Kerjakan tiket sprint', 'Review kode'],
          mingguan: ['Rilis Jumat', 'Perbaiki 3 bug teratas'],
          kpi: ['Uptime ≥99,5%', 'Rilis tiap minggu'],
        },
        {
          role: 'Customer success', jumlah: '1', atasan: 'CEO',
          misi: 'Setiap pelanggan baru berhasil membuat tagihan pertama.',
          harian: ['Onboarding pelanggan baru via WA/video call', 'Balas tiket bantuan'],
          mingguan: ['Hubungi pelanggan yang tidak login 7 hari', 'Laporan alasan churn'],
          kpi: ['Aktivasi minggu 1 ≥80%', 'Respon tiket <2 jam'],
        },
        {
          role: 'Marketing', jumlah: '1', atasan: 'CEO',
          misi: 'Calon pelanggan yang cocok dengan biaya terkendali.',
          harian: ['Konten tips mengelola kos', 'Kelola iklan kecil'],
          mingguan: ['Webinar/demo grup', 'Program referral pemilik kos'],
          kpi: ['CAC < 3 bulan langganan', '30 trial/minggu'],
          prospek: ['Grup & forum pemilik kos per kota', 'Pengelola properti & kontrakan', 'Referral pelanggan (gratis 1 bulan)', 'Kerja sama dengan platform iklan kos'],
        },
      ],
      ritme: [
        { kapan: 'Senin', agenda: 'Rapat metrik: MRR, churn, aktivasi, kas', siapa: 'Semua' },
        { kapan: 'Setiap hari 09.30', agenda: 'Stand-up 15 menit', siapa: 'CEO + developer' },
        { kapan: 'Rabu', agenda: 'Review alasan churn → tiket produk', siapa: 'CEO + CS' },
        { kapan: 'Jumat', agenda: 'Rilis & catatan rilis ke pelanggan', siapa: 'Developer + CS' },
        { kapan: 'Bulanan', agenda: 'Update investor: MRR, churn, runway', siapa: 'CEO' },
      ],
      funnel: { periode: 'per bulan', steps: [{ tahap: 'Pengunjung website', angka: 4000 }, { tahap: 'Daftar trial', angka: 120 }, { tahap: 'Aktif (buat tagihan)', angka: 70 }, { tahap: 'Bayar', angka: 35 }] },
    },
    skala: {
      snapshot: {
        omzetBulan: 120, labaBulan: -130, marginKotor: 84, biayaTetapBulan: 230, kas: 800,
        pelanggan: '2.000 pelanggan (pemilik kos, kontrakan, properti kecil)',
        catatan: 'Omzet = MRR. Biaya tetap = gaji 16 orang, server, kantor, tools. Burn Rp130 juta/bulan → runway ±6 bulan. Keputusan rekrutmen menentukan hidup-matinya startup.',
      },
      roles: [
        {
          role: 'CEO', jumlah: '1',
          misi: 'Runway, fundraising, dan fokus pasar.',
          harian: ['Dashboard: MRR, burn, runway, churn'],
          mingguan: ['Rapat pimpinan', 'Ngobrol dengan 3 pelanggan'],
          kpi: ['Runway ≥18 bulan', 'MRR tumbuh ≥6%/bulan'],
        },
        {
          role: 'CTO + engineer', jumlah: '1 + 6', atasan: 'CEO',
          misi: 'Sistem aman, stabil, dan bisa menampung 10× pengguna.',
          harian: ['Sprint & review kode', 'Pantau log keamanan'],
          mingguan: ['Rilis', 'Review akses & celah keamanan'],
          kpi: ['Uptime ≥99,9%', '0 data pribadi tanpa enkripsi', 'Celah kritis ditutup <24 jam'],
        },
        {
          role: 'Head of growth', jumlah: '1', atasan: 'CEO',
          misi: 'Akuisisi efisien & segmen baru.',
          harian: ['Kelola kanal akuisisi'],
          mingguan: ['Eksperimen kanal', 'Laporan CAC & payback'],
          kpi: ['Payback CAC <6 bulan'],
        },
        {
          role: 'Sales & CS', jumlah: '3', atasan: 'Head of growth',
          misi: 'Akun properti menengah, onboarding, dan paket tahunan.',
          harian: ['Demo & onboarding', 'Tiket bantuan'],
          mingguan: ['10 demo ke pengelola properti menengah', 'Upsell paket tahunan'],
          kpi: ['20 akun Pro/bulan', 'Net revenue retention ≥100%'],
          prospek: ['Pengelola kos 20–200 kamar & coliving', 'Pengelola apartemen sewa', 'Developer properti kecil', 'Asosiasi pemilik kos per kota'],
        },
        {
          role: 'Finance & HR', jumlah: '1', atasan: 'CEO',
          misi: 'Burn sesuai rencana, rekrutmen sesuai milestone.',
          harian: ['Approval pengeluaran'],
          mingguan: ['Laporan burn vs rencana'],
          kpi: ['Burn ≤ anggaran ±5%'],
        },
        {
          role: 'Product designer', jumlah: '1', atasan: 'CTO',
          misi: 'Alur yang mudah untuk pemilik properti non-teknis.',
          harian: ['Desain fitur sprint'],
          mingguan: ['Uji usability dengan 3 pengguna'],
          kpi: ['Aktivasi minggu 1 ≥80%'],
        },
      ],
      ritme: [
        { kapan: 'Senin', agenda: 'Rapat pimpinan: MRR, burn, runway, keamanan', siapa: 'CEO, CTO, growth, finance' },
        { kapan: 'Setiap hari', agenda: 'Stand-up tim produk', siapa: 'CTO + engineer + designer' },
        { kapan: 'Rabu', agenda: 'Review keamanan & akses data', siapa: 'CTO' },
        { kapan: 'Kamis', agenda: 'Review pipeline akun Pro', siapa: 'Growth + sales' },
        { kapan: 'Bulanan', agenda: 'Laporan investor & rencana rekrutmen per milestone', siapa: 'CEO + finance' },
      ],
      funnel: { periode: 'per bulan', steps: [{ tahap: 'Pengunjung', angka: 30000 }, { tahap: 'Trial', angka: 900 }, { tahap: 'Aktif', angka: 500 }, { tahap: 'Bayar', angka: 220 }] },
    },
  },
  exec: {
    rintis: [
      [
        { siapa: 'Kamu', tugas: 'Wawancara 15 pemilik kos: bagaimana mencatat, apa yang paling menyebalkan.' },
        { siapa: 'Kamu + desainer', tugas: 'Bangun MVP 2 minggu: daftar kamar, tagihan, status bayar.' },
        { siapa: 'Kamu', tugas: 'Dampingi 5 pengguna pertama & catat yang mereka pakai.' },
      ],
      [
        { siapa: 'Kamu', tugas: 'Beri 1 bulan gratis, lalu tawarkan Rp49rb/bulan.' },
        { siapa: 'Kamu', tugas: 'Telepon pengguna yang tidak membayar: kenapa?' },
      ],
      [
        { siapa: 'Kamu', tugas: 'Hitung biaya server & pesan WA per pelanggan.' },
        { siapa: 'Kamu', tugas: 'Kurangi pesan otomatis yang tidak perlu; ubah harga berdasarkan jumlah kamar.' },
      ],
    ],
    tumbuh: [
      [
        { siapa: 'CEO + CS', tugas: 'Telepon 30 pelanggan yang berhenti; kelompokkan alasannya.' },
        { siapa: 'Developer', tugas: 'Perbaiki onboarding: buat tagihan pertama dalam 10 menit.' },
        { siapa: 'Marketing', tugas: 'Tahan iklan besar sampai churn <6%.' },
      ],
      [
        { siapa: 'CEO', tugas: 'Rekrut 1 engineer + 1 CS/sales hybrid.' },
        { siapa: 'CS/sales baru', tugas: 'Tawarkan paket tahunan (diskon 2 bulan) ke pelanggan aktif.' },
        { siapa: 'CEO', tugas: 'Update investor: runway setelah kas paket tahunan masuk.' },
      ],
      [
        { siapa: 'CEO', tugas: 'Ubah permintaan custom menjadi fitur multi-properti untuk semua.' },
        { siapa: 'Developer', tugas: 'Bangun paket Pro; klien besar membayar di muka sebagai pembeli pertama.' },
        { siapa: 'Marketing', tugas: 'Tawarkan paket Pro ke 50 pelanggan dengan >1 properti.' },
      ],
    ],
    skala: [
      [
        { siapa: 'CEO + finance', tugas: 'Rencana rekrutmen yang terkait milestone MRR.' },
        { siapa: 'Finance', tugas: 'Laporan burn vs rencana setiap minggu.' },
        { siapa: 'CEO', tugas: 'Tahan rekrutmen yang tidak terkait milestone sampai runway ≥18 bulan.' },
      ],
      [
        { siapa: 'CTO', tugas: 'Tutup celah, cabut akses bocor, simpan log.' },
        { siapa: 'CTO + engineer', tugas: 'Investigasi data apa yang terdampak & siapa saja.' },
        { siapa: 'CEO', tugas: 'Beri tahu pengguna terdampak sesuai UU PDP & sampaikan langkah perlindungan.' },
        { siapa: 'CTO', tugas: 'Audit keamanan pihak ketiga & enkripsi data KTP.' },
      ],
      [
        { siapa: 'Head of growth', tugas: 'Validasi segmen properti menengah lewat 20 demo.' },
        { siapa: 'CEO', tugas: 'Kerja sama mitra pembayaran berizin (bukan bangun sendiri).' },
        { siapa: 'Sales & CS', tugas: 'Onboarding akun Pro dengan migrasi data dibantu.' },
      ],
    ],
  },
};
