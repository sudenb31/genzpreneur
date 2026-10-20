import type { SimIndustryOps } from '../types';

export const EDUCATION_OPS: SimIndustryOps = {
  ops: {
    rintis: {
      snapshot: {
        omzetBulan: 3, labaBulan: 2, marginKotor: 85, biayaTetapBulan: 0.3, kas: 2,
        pelanggan: 'Target 1 batch/bulan, ±25 peserta',
        catatan: 'Angka ini target bulan pertama (belum ada batch berjalan). Biaya per batch = moderator & bonus materi. Biaya tetap = Zoom & Canva Pro.',
      },
      roles: [
        {
          role: 'Kamu — topi Mentor', jumlah: 'kamu sendiri',
          misi: 'Peserta benar-benar bisa membuat desain sendiri di akhir kelas.',
          harian: ['Beri feedback tugas di grup (maks. 1 jam)'],
          mingguan: ['Mengajar 2 sesi live', 'Siapkan materi & tugas minggu depan'],
          kpi: ['Tingkat penyelesaian ≥70%', 'Rating ≥4,5'],
        },
        {
          role: 'Kamu — topi Marketing & Pendaftaran', jumlah: 'kamu sendiri',
          misi: 'Kelas terisi peserta yang serius.',
          harian: ['Posting 1 konten tips desain', 'Balas DM calon peserta'],
          mingguan: ['Kelas gratis 30 menit (Jumat)', 'Kirim testimoni/hasil karya alumni'],
          kpi: ['25 peserta/batch', 'Konversi kelas gratis → bayar ≥15%'],
          prospek: ['Mahasiswa organisasi kampus (pengurus media/humas)', 'UMKM yang ingin desain konten sendiri', 'Grup komunitas freelancer pemula', 'Teman yang selama ini minta diajari'],
        },
        {
          role: 'Moderator', jumlah: '1 teman (per kelas)', atasan: 'Kamu',
          misi: 'Kelas lancar: absen, chat, teknis Zoom, pengingat.',
          harian: ['Pengingat H-1 & 1 jam sebelum kelas'],
          mingguan: ['Rekap kehadiran & tugas'],
          kpi: ['Kehadiran ≥75%'],
        },
      ],
      ritme: [
        { kapan: 'Senin', agenda: 'Konten & DM calon peserta', siapa: 'Kamu' },
        { kapan: 'Selasa & Kamis malam', agenda: 'Sesi live', siapa: 'Kamu + moderator' },
        { kapan: 'Rabu', agenda: 'Feedback tugas', siapa: 'Kamu' },
        { kapan: 'Jumat', agenda: 'Kelas gratis untuk batch berikutnya', siapa: 'Kamu' },
        { kapan: 'Akhir batch', agenda: 'Kumpulkan testimoni & karya', siapa: 'Moderator' },
      ],
      funnel: { periode: 'per batch (±1 bulan)', steps: [{ tahap: 'Lihat konten/promosi', angka: 3000 }, { tahap: 'Ikut kelas gratis', angka: 150 }, { tahap: 'Daftar & bayar', angka: 25 }, { tahap: 'Lulus', angka: 18 }] },
    },
    tumbuh: {
      snapshot: {
        omzetBulan: 72, labaBulan: 12, marginKotor: 80, biayaTetapBulan: 44, kas: 45, piutang: 8,
        pelanggan: '1 batch/bulan × 60 peserta × Rp1,2 juta; 300 alumni',
        catatan: 'Margin kotor dikurangi honor asisten mentor per batch. Biaya tetap = gaji 3 staf, iklan rutin, LMS & Zoom. Piutang = peserta yang mencicil.',
      },
      roles: [
        {
          role: 'Founder & mentor utama', jumlah: '1',
          misi: 'Kurikulum & kualitas, lalu melepas jam mengajar ke tim.',
          harian: ['Mengajar/merekam materi (target turun ke 30% waktu)'],
          mingguan: ['Review data kehadiran & tugas', 'Latih asisten mentor 1 jam'],
          kpi: ['Penyelesaian ≥70%', 'Jam mengajar founder −50% dalam 3 bulan'],
        },
        {
          role: 'Admin & CS', jumlah: '1', atasan: 'Founder',
          misi: 'Pendaftaran, pembayaran, dan pengalaman peserta lancar.',
          harian: ['Balas pertanyaan calon & peserta', 'Verifikasi pembayaran & cicilan'],
          mingguan: ['Telepon peserta yang absen 2×', 'Laporan kehadiran'],
          kpi: ['Respon <1 jam', 'Cicilan tertagih ≥95%'],
        },
        {
          role: 'Marketing konten', jumlah: '1', atasan: 'Founder',
          misi: 'Calon peserta yang tepat & mau bayar.',
          harian: ['1 konten edukasi', 'Kelola iklan'],
          mingguan: ['Webinar gratis', 'Kumpulkan cerita alumni yang dapat kerja/klien'],
          kpi: ['60 peserta/batch', 'Biaya iklan per peserta <Rp200rb'],
          prospek: ['Fresh graduate & mahasiswa tingkat akhir', 'Karyawan non-desain yang mau pindah karier', 'Alumni yang merekomendasikan teman (komisi referral)', 'Kampus & organisasi (paket kelompok)'],
        },
        {
          role: 'Asisten mentor', jumlah: '2 part-time', atasan: 'Founder',
          misi: 'Feedback tugas cepat sesuai rubrik.',
          harian: ['Feedback tugas di grup'],
          mingguan: ['Sesi tanya jawab', 'Rapat kalibrasi rubrik'],
          kpi: ['Feedback <24 jam', 'Rating mentor ≥4,5'],
        },
      ],
      ritme: [
        { kapan: 'Senin', agenda: 'Rapat tim: pendaftaran, kehadiran, masalah peserta', siapa: 'Semua' },
        { kapan: 'Selasa & Kamis', agenda: 'Sesi live', siapa: 'Founder/asisten' },
        { kapan: 'Rabu', agenda: 'Webinar gratis untuk batch berikutnya', siapa: 'Marketing + founder' },
        { kapan: 'Jumat', agenda: 'Kalibrasi rubrik & latihan mentor', siapa: 'Founder + asisten' },
        { kapan: 'Akhir batch', agenda: 'Survei kepuasan & data karier alumni', siapa: 'Admin' },
      ],
      funnel: { periode: 'per batch (±1 bulan)', steps: [{ tahap: 'Leads (form/webinar)', angka: 900 }, { tahap: 'Ikut webinar', angka: 350 }, { tahap: 'Konsultasi WA', angka: 140 }, { tahap: 'Bayar', angka: 60 }] },
    },
    skala: {
      snapshot: {
        omzetBulan: 300, labaBulan: 26, marginKotor: 75, biayaTetapBulan: 195, kas: 320, piutang: 40,
        pelanggan: '±100 peserta/bulan di 3 program + 4 klien B2B/kampus',
        catatan: 'Margin kotor dikurangi honor mentor per batch & platform. Biaya tetap = gaji 18 orang, iklan, kantor. Piutang dari kampus & korporat (termin).',
      },
      roles: [
        {
          role: 'CEO', jumlah: '1',
          misi: 'Strategi program, kemitraan, dan kesehatan keuangan.',
          harian: ['Dashboard: pendaftaran, penyelesaian, kas'],
          mingguan: ['Rapat pimpinan', '2 meeting kampus/korporat'],
          kpi: ['Pendapatan B2B ≥30%', 'Net margin ≥15%'],
        },
        {
          role: 'Kepala akademik', jumlah: '1', atasan: 'CEO',
          misi: 'Kurikulum, standar mentor, dan hasil belajar.',
          harian: ['Observasi kelas acak'],
          mingguan: ['Review data penyelesaian per kelas', 'Sertifikasi mentor baru'],
          kpi: ['Penyelesaian ≥75%', 'Kepuasan ≥4,5'],
        },
        {
          role: 'Program manager', jumlah: '3', atasan: 'Kepala akademik',
          misi: 'Satu program berjalan lancar dari pendaftaran sampai alumni.',
          harian: ['Pantau peserta berisiko (absen/tugas telat)'],
          mingguan: ['Rapat mentor', 'Laporan program'],
          kpi: ['Peserta berisiko diintervensi <48 jam'],
        },
        {
          role: 'Mentor tetap', jumlah: '8', atasan: 'Program manager',
          misi: 'Mengajar & feedback sesuai rubrik.',
          harian: ['Feedback tugas'],
          mingguan: ['2–3 sesi live'],
          kpi: ['Rating ≥4,5', 'Feedback <24 jam'],
        },
        {
          role: 'Marketing & partnership', jumlah: '3', atasan: 'CEO',
          misi: 'Peserta B2C & kerja sama B2B.',
          harian: ['Iklan & konten', 'Follow-up leads B2B'],
          mingguan: ['Webinar', 'Proposal ke 3 kampus/HR'],
          kpi: ['CAC < 20% harga program', '1 klien B2B baru/bulan'],
          prospek: ['HR & L&D perusahaan (upskilling karyawan)', 'Kampus: program MBKM/sertifikasi', 'Pemerintah daerah & program pelatihan kerja', 'Alumni (program lanjutan)'],
        },
        {
          role: 'Finance & admin', jumlah: '2', atasan: 'CEO',
          misi: 'Pembayaran peserta, termin B2B, gaji mentor.',
          harian: ['Rekonsiliasi pembayaran'],
          mingguan: ['Laporan piutang B2B'],
          kpi: ['Piutang >60 hari = 0'],
        },
      ],
      ritme: [
        { kapan: 'Senin', agenda: 'Rapat pimpinan: pendaftaran, penyelesaian, kas', siapa: 'CEO, akademik, PM, marketing, finance' },
        { kapan: 'Selasa', agenda: 'Rapat mentor per program', siapa: 'PM + mentor' },
        { kapan: 'Rabu', agenda: 'Observasi kelas acak', siapa: 'Kepala akademik' },
        { kapan: 'Kamis', agenda: 'Meeting & proposal B2B', siapa: 'Partnership' },
        { kapan: 'Bulanan', agenda: 'Review kurikulum dari data', siapa: 'Akademik + PM' },
      ],
      funnel: { periode: 'per bulan', steps: [{ tahap: 'Leads', angka: 2500 }, { tahap: 'Webinar/konsultasi', angka: 700 }, { tahap: 'Bayar', angka: 100 }, { tahap: 'Lulus', angka: 75 }] },
    },
  },
  exec: {
    rintis: [
      [
        { siapa: 'Kamu', tugas: 'Tulis janji hasil: "Dalam 4 minggu kamu bisa membuat 10 desain konten sendiri".' },
        { siapa: 'Kamu', tugas: 'Buka early bird Rp99rb untuk 10 kursi pertama, harga normal Rp149rb.' },
        { siapa: 'Moderator', tugas: 'Kelola form pendaftaran & batasi 30 peserta.' },
      ],
      [
        { siapa: 'Moderator', tugas: 'Kirim pengingat H-1 dan 1 jam sebelum kelas.' },
        { siapa: 'Kamu', tugas: 'Bagikan rekaman + ringkasan 1 halaman setelah kelas.' },
        { siapa: 'Moderator', tugas: 'Pasangkan peserta jadi buddy & tagih tugas kecil.' },
      ],
      [
        { siapa: 'Kamu', tugas: 'Refund peserta ini dan tanyakan alasannya.' },
        { siapa: 'Kamu', tugas: 'Tulis kebijakan refund (mis. maks. setelah sesi 1) di halaman pendaftaran.' },
      ],
    ],
    tumbuh: [
      [
        { siapa: 'Founder', tugas: 'Rekam materi inti; sesi live dipakai untuk praktik & tanya jawab.' },
        { siapa: 'Founder', tugas: 'Buat rubrik penilaian & latih 2 asisten mentor.' },
        { siapa: 'Admin', tugas: 'Siapkan jadwal 2 batch paralel dan pantau kehadiran.' },
      ],
      [
        { siapa: 'Founder', tugas: 'Pilih 3 alumni terbaik; latih 4 minggu dengan rubrik.' },
        { siapa: 'Marketing', tugas: 'Undang 1 praktisi senior per batch sebagai sesi tamu.' },
        { siapa: 'Admin', tugas: 'Kumpulkan rating per mentor setiap sesi.' },
      ],
      [
        { siapa: 'Founder', tugas: 'Negosiasi MoU: jumlah peserta, ukuran keberhasilan, termin 40/60.' },
        { siapa: 'Admin', tugas: 'Invoice DP 40% sebelum kelas dimulai.' },
        { siapa: 'Asisten mentor', tugas: 'Laporan progres mingguan ke dosen pengampu kampus.' },
      ],
    ],
    skala: [
      [
        { siapa: 'Kepala akademik', tugas: 'Tentukan data progres yang wajib dipantau (kehadiran, tugas, kuis).' },
        { siapa: 'Program manager', tugas: 'Intervensi peserta berisiko dalam 48 jam (telepon/WA).' },
        { siapa: 'Finance', tugas: 'Bandingkan biaya LMS siap pakai vs bangun sendiri selama 3 tahun.' },
      ],
      [
        { siapa: 'Kepala akademik', tugas: 'Wawancara 20 peserta & observasi kelas dengan rating rendah.' },
        { siapa: 'Program manager', tugas: 'Revisi materi minggu yang terlalu padat.' },
        { siapa: 'Kepala akademik', tugas: 'Sertifikasi ulang semua mentor dengan observasi kelas.' },
      ],
      [
        { siapa: 'CEO', tugas: 'Cek legalitas lembaga sertifikasi dan skema uji kompetensinya.' },
        { siapa: 'Kepala akademik', tugas: 'Sesuaikan kurikulum dengan standar kompetensi.' },
        { siapa: 'Marketing', tugas: 'Jual paket premium dengan uji kompetensi; jelaskan prosesnya apa adanya.' },
      ],
    ],
  },
};
