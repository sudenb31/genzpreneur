import type { SimIndustryOps } from '../types';

export const EVENT_OPS: SimIndustryOps = {
  ops: {
    rintis: {
      snapshot: {
        omzetBulan: 4.5, labaBulan: 1.5, marginKotor: 45, biayaTetapBulan: 0.2, kas: 5,
        pelanggan: 'Target 60 peserta × Rp75rb dalam 1 workshop',
        catatan: 'Ini target untuk 1 workshop (dianggap 1 event/bulan). Biaya per event = venue, pembicara, snack, sertifikat. Biaya tetap = desain & tools.',
      },
      roles: [
        {
          role: 'Kamu — project lead', jumlah: '1',
          misi: 'Event terjadi tepat waktu, tidak rugi, dan peserta puas.',
          harian: ['Cek penjualan tiket & kas', 'Update timeline H-30 → H+3'],
          mingguan: ['Rapat panitia 30 menit', 'Negosiasi venue & pembicara'],
          kpi: ['60 tiket terjual', 'Laba ≥Rp1,5 juta', 'Rating ≥4,5'],
        },
        {
          role: 'Panitia — tiket & partner', jumlah: '1 teman', atasan: 'Kamu',
          misi: 'Tiket laku lewat komunitas.',
          harian: ['Balas DM & WA peserta'],
          mingguan: ['Hubungi 5 komunitas/BEM untuk partner', 'Laporan penjualan per kode partner'],
          kpi: ['50% tiket dari partner komunitas'],
          prospek: ['BEM & himpunan jurusan', 'Komunitas karier/LinkedIn mahasiswa', 'Grup alumni & organisasi kampus', 'Akun info event kampus'],
        },
        {
          role: 'Panitia — acara & logistik', jumlah: '1 teman', atasan: 'Kamu',
          misi: 'Rundown, venue, sound, registrasi berjalan.',
          harian: ['Checklist logistik'],
          mingguan: ['Konfirmasi venue & vendor'],
          kpi: ['Registrasi <5 menit/orang', 'Acara mulai tepat waktu'],
        },
      ],
      ritme: [
        { kapan: 'H-30', agenda: 'Kunci tanggal, pembicara, pre-sale', siapa: 'Kamu' },
        { kapan: 'Setiap Senin', agenda: 'Rapat panitia: tiket, kas, logistik', siapa: 'Semua' },
        { kapan: 'H-14 s/d H-7', agenda: 'Dorong partner komunitas', siapa: 'Panitia tiket' },
        { kapan: 'H-3', agenda: 'Gladi & konfirmasi semua vendor', siapa: 'Panitia acara' },
        { kapan: 'H+3', agenda: 'Survei, laporan keuangan, terima kasih ke partner', siapa: 'Kamu' },
      ],
      funnel: { periode: 'per event', steps: [{ tahap: 'Melihat poster', angka: 4000 }, { tahap: 'Klik link', angka: 400 }, { tahap: 'Beli tiket', angka: 60 }, { tahap: 'Hadir', angka: 52 }] },
    },
    tumbuh: {
      snapshot: {
        omzetBulan: 55, labaBulan: 5, marginKotor: 35, biayaTetapBulan: 13, kas: 50, piutang: 20,
        pelanggan: '1 seminar besar per kuartal + 2–3 workshop/bulan',
        catatan: 'Pendapatan event naik-turun, jadi angka ini RATA-RATA per bulan. Seminar 600 orang sendiri bernilai ±Rp120 juta biaya. Biaya tetap = gaji 4 staf inti & tools.',
      },
      roles: [
        {
          role: 'Event director (kamu)', jumlah: '1',
          misi: 'Profit per event, keselamatan, dan reputasi.',
          harian: ['Cek dashboard: tiket, sponsor, kas'],
          mingguan: ['Rapat koordinasi', 'Review anggaran vs realisasi'],
          kpi: ['Margin per event ≥20%', '0 insiden keselamatan'],
        },
        {
          role: 'Koordinator sponsor', jumlah: '1', atasan: 'Event director',
          misi: 'Sponsor yang tepat, terbayar, dan mau kembali.',
          harian: ['Follow-up proposal'],
          mingguan: ['Kirim 5 proposal spesifik', '2 meeting brand'],
          kpi: ['Sponsor menutup ≥40% biaya', 'DP sponsor sebelum H-14'],
          prospek: ['Brand yang menyasar anak muda: bank digital, e-wallet, telko, edtech', 'HR perusahaan (employer branding & rekrutmen)', 'Sponsor event serupa tahun lalu', 'Media partner untuk barter publikasi'],
        },
        {
          role: 'Koordinator acara', jumlah: '1', atasan: 'Event director',
          misi: 'Rundown, vendor, venue, izin, keselamatan.',
          harian: ['Update checklist produksi'],
          mingguan: ['Konfirmasi vendor', 'Site visit'],
          kpi: ['Semua izin selesai H-14', 'Vendor sesuai anggaran'],
        },
        {
          role: 'Desainer & media sosial', jumlah: '1', atasan: 'Event director',
          misi: 'Tiket laku lewat konten & iklan.',
          harian: ['Konten countdown & testimoni'],
          mingguan: ['Laporan penjualan per kanal'],
          kpi: ['Biaya iklan per tiket <Rp15rb'],
        },
        {
          role: 'Panitia lepas hari H', jumlah: '15', atasan: 'Koordinator acara',
          misi: 'Registrasi, usher, keamanan, backstage.',
          harian: ['Briefing hari H 06.00'],
          mingguan: ['Gladi H-1'],
          kpi: ['Antrian registrasi <10 menit'],
        },
      ],
      ritme: [
        { kapan: 'H-60', agenda: 'Kunci venue, anggaran, proposal sponsor', siapa: 'Director + sponsor' },
        { kapan: 'Senin', agenda: 'Rapat koordinasi: tiket, sponsor, produksi', siapa: 'Tim inti' },
        { kapan: 'H-14', agenda: 'Izin, asuransi, DP sponsor masuk', siapa: 'Koord. acara + sponsor' },
        { kapan: 'H-1', agenda: 'Gladi & briefing panitia', siapa: 'Semua + panitia lepas' },
        { kapan: 'H+7', agenda: 'Laporan sponsor (leads, foto) & penagihan', siapa: 'Koord. sponsor' },
      ],
      funnel: { periode: 'per seminar besar', steps: [{ tahap: 'Brand di-pitch', angka: 40 }, { tahap: 'Meeting', angka: 12 }, { tahap: 'Negosiasi', angka: 6 }, { tahap: 'Sponsor deal', angka: 3 }] },
    },
    skala: {
      snapshot: {
        omzetBulan: 150, labaBulan: 10, marginKotor: 35, biayaTetapBulan: 40, kas: 400, piutang: 120,
        pelanggan: '1 festival/tahun (4.000 pengunjung, 60 tenant, 12 sponsor) + event korporat',
        catatan: 'RATA-RATA per bulan dari setahun. Festival sendiri ±Rp1,1 miliar pendapatan dalam 1 bulan; bulan lain dari event korporat. Sangat musiman, jadi kas harus kuat.',
      },
      roles: [
        {
          role: 'CEO', jumlah: '1',
          misi: 'Festival berkelanjutan: pendapatan berulang, bukan taruhan tahunan.',
          harian: ['Dashboard: tiket, sponsor, kas, risiko'],
          mingguan: ['Rapat pimpinan', 'Meeting sponsor utama'],
          kpi: ['Laba festival ≥15%', 'Sponsor perpanjang ≥60%'],
        },
        {
          role: 'Head of partnership', jumlah: '1', atasan: 'CEO',
          misi: 'Sponsor & tenant terisi, terbayar, puas.',
          harian: ['Pipeline sponsor & tenant'],
          mingguan: ['5 meeting sponsor', 'Laporan penjualan booth'],
          kpi: ['80% booth terjual H-60', 'DP sponsor 50% H-30'],
          prospek: ['Brand FMCG & minuman', 'Bank, e-wallet, telko', 'UMKM kuliner & fashion untuk tenant (database tahun lalu)', 'Pemda/dinas pariwisata (dukungan & izin)'],
        },
        {
          role: 'Head of production', jumlah: '1 + 7 tim operasional', atasan: 'Festival director',
          misi: 'Panggung, listrik, keamanan, kebersihan, rencana darurat.',
          harian: ['Update rencana produksi & risiko'],
          mingguan: ['Rapat vendor', 'Simulasi skenario cuaca & evakuasi'],
          kpi: ['0 insiden keselamatan', 'Rencana cuaca siap H-14'],
        },
        {
          role: 'Marketing', jumlah: '3', atasan: 'Festival director',
          misi: 'Tiket laku & komunitas aktif sepanjang tahun.',
          harian: ['Konten & iklan'],
          mingguan: ['Laporan tiket per gelombang'],
          kpi: ['60% tiket terjual sebelum H-14'],
        },
        {
          role: 'Finance', jumlah: '1', atasan: 'CEO',
          misi: 'Arus kas, termin vendor, penagihan sponsor.',
          harian: ['Rekonsiliasi transaksi tiket & booth'],
          mingguan: ['Proyeksi kas 12 minggu'],
          kpi: ['Kas tidak pernah di bawah 2 bulan biaya tetap'],
        },
      ],
      ritme: [
        { kapan: 'H-180', agenda: 'Konsep, tanggal, venue, target sponsor', siapa: 'CEO + director' },
        { kapan: 'Setiap Senin', agenda: 'Rapat pimpinan', siapa: 'CEO, director, partnership, production, finance' },
        { kapan: 'H-30', agenda: 'Rencana darurat final (cuaca, evakuasi, medis)', siapa: 'Production' },
        { kapan: 'Hari H', agenda: 'War room tiap 2 jam', siapa: 'Semua head' },
        { kapan: 'H+14', agenda: 'Post-mortem & laporan sponsor', siapa: 'Semua head' },
      ],
      funnel: { periode: 'per festival', steps: [{ tahap: 'Reach kampanye', angka: 600000 }, { tahap: 'Kunjungi halaman tiket', angka: 30000 }, { tahap: 'Beli tiket', angka: 4000 }, { tahap: 'Datang', angka: 3700 }] },
    },
  },
  exec: {
    rintis: [
      [
        { siapa: 'Kamu', tugas: 'Booking venue tanpa DP dulu (hold 7 hari) dan konfirmasi pembicara.' },
        { siapa: 'Panitia tiket', tugas: 'Buka pre-sale early bird Rp50rb selama 7 hari, target 30 tiket.' },
        { siapa: 'Kamu', tugas: 'Bayar DP venue dari uang tiket jika target tercapai.' },
      ],
      [
        { siapa: 'Panitia tiket', tugas: 'Hubungi 5 komunitas; beri kode diskon 10% + komisi Rp10rb/tiket.' },
        { siapa: 'Desainer/kamu', tugas: 'Buat kit promosi untuk partner (poster, caption, link).' },
        { siapa: 'Panitia tiket', tugas: 'Laporan harian tiket per kode partner.' },
      ],
      [
        { siapa: 'Kamu', tugas: 'Hubungi pembicara cadangan yang sudah kamu siapkan sejak awal.' },
        { siapa: 'Panitia tiket', tugas: 'Umumkan perubahan dengan jujur & tawarkan refund penuh.' },
        { siapa: 'Panitia acara', tugas: 'Perbarui rundown, materi, dan backdrop.' },
      ],
    ],
    tumbuh: [
      [
        { siapa: 'Koord. sponsor', tugas: 'Pilih 15 brand yang menyasar audiens ini; riset kampanye mereka.' },
        { siapa: 'Koord. sponsor', tugas: 'Proposal spesifik: profil audiens, aktivasi booth, target leads.' },
        { siapa: 'Event director', tugas: 'Follow-up & presentasi ke 6 brand teratas.' },
      ],
      [
        { siapa: 'Koord. acara', tugas: 'Ajukan izin keramaian & koordinasi keamanan.' },
        { siapa: 'Koord. acara', tugas: 'Siapkan tim medis, jalur evakuasi, dan asuransi acara.' },
        { siapa: 'Panitia lepas', tugas: 'Briefing keselamatan & posisi pada H-1.' },
      ],
      [
        { siapa: 'Koord. sponsor', tugas: 'Masukkan DP 50% di kontrak sponsor.' },
        { siapa: 'Event director', tugas: 'Negosiasi termin vendor: DP + pelunasan H+7.' },
        { siapa: 'Event director', tugas: 'Proyeksi kas mingguan sampai H+30.' },
      ],
    ],
    skala: [
      [
        { siapa: 'Head of production', tugas: 'Bandingkan 3 platform tiket QR & cashless, uji dengan event kecil.' },
        { siapa: 'Finance', tugas: 'Hubungkan data transaksi tenant ke laporan harian.' },
        { siapa: 'Tim operasional', tugas: 'Latihan check-in & tambah gerbang untuk jam ramai.' },
      ],
      [
        { siapa: 'Head of partnership', tugas: 'Tawarkan eksklusivitas hanya untuk kategori minuman kemasan.' },
        { siapa: 'CEO', tugas: 'Pastikan kontrak melindungi tenant lokal & jadwal pembayaran sponsor.' },
        { siapa: 'Marketing', tugas: 'Kampanye bersama sponsor tanpa menghapus identitas lokal.' },
      ],
      [
        { siapa: 'Head of production', tugas: 'Aktifkan rencana cuaca: tenda, geser jadwal, cek struktur panggung.' },
        { siapa: 'Marketing', tugas: 'Kirim info real-time ke pemegang tiket & media sosial.' },
        { siapa: 'Head of partnership', tugas: 'Kabari sponsor & tenant tentang jadwal baru.' },
      ],
    ],
  },
};
