import type { SimIndustryOps } from '../types';

export const CREATOR_OPS: SimIndustryOps = {
  ops: {
    rintis: {
      snapshot: {
        omzetBulan: 1.5, labaBulan: 1.1, marginKotor: 95, biayaTetapBulan: 0.3, kas: 3,
        pelanggan: '1–2 brand kecil per bulan + komisi affiliate',
        catatan: 'Pendapatan belum stabil: bulan bagus Rp2,5 juta, bulan sepi Rp400rb. Biaya tetap = kuota, aplikasi edit, lampu.',
      },
      roles: [
        {
          role: 'Kamu — topi Kreatif (ide & syuting)', jumlah: 'kamu sendiri',
          misi: 'Konten yang ditonton sampai habis oleh audiens yang tepat (mahasiswa).',
          harian: ['Catat 3 ide dari komentar & DM', 'Balas komentar 20 menit setelah posting'],
          mingguan: ['Syuting borongan 4 video (Sabtu)', 'Edit & jadwalkan posting (Minggu)', 'Lihat 3 video teratas & terbawah: kenapa?'],
          kpi: ['Rata-rata tonton ≥40% durasi', 'Followers +2 ribu/bulan dari audiens target'],
          tools: ['Notes ide per pilar konten', 'CapCut + template', 'Analytics TikTok'],
        },
        {
          role: 'Kamu — topi Bisnis (brand & affiliate)', jumlah: 'kamu sendiri',
          misi: 'Penghasilan dari brand yang relevan tanpa merusak kepercayaan audiens.',
          harian: ['Cek email/DM brand, balas maks. 24 jam'],
          mingguan: ['Kirim media kit ke 5 brand yang relevan', 'Update daftar produk affiliate yang kamu pakai'],
          kpi: ['2 brand deal/bulan', 'Komisi affiliate ≥Rp1 juta/bulan'],
          prospek: ['Brand aplikasi produktivitas, alat tulis, laptop/aksesori, kursus', 'Brand yang sudah endorse creator setipe (cek tagar #ad di niche-mu)', 'Agensi influencer & platform creator marketplace', 'Brand lokal yang produknya memang kamu pakai'],
        },
        {
          role: 'Kamu — topi Admin & Keuangan', jumlah: 'kamu sendiri',
          misi: 'Tahu uang masuk, tenggat konten, dan pisahkan uang pribadi.',
          harian: ['Catat brief & tenggat tiap deal'],
          mingguan: ['Catat pemasukan & tagih brand yang lewat tenggat'],
          kpi: ['0 deadline brand terlewat', 'Rekening usaha terpisah'],
        },
      ],
      ritme: [
        { kapan: 'Senin', agenda: 'Review analytics minggu lalu, pilih 4 ide', siapa: 'Kamu' },
        { kapan: 'Selasa–Jumat', agenda: 'Posting 1 video/hari + balas komentar', siapa: 'Kamu' },
        { kapan: 'Rabu', agenda: 'Kirim media kit ke 5 brand', siapa: 'Kamu' },
        { kapan: 'Sabtu', agenda: 'Syuting borongan', siapa: 'Kamu' },
        { kapan: 'Minggu', agenda: 'Edit & jadwalkan', siapa: 'Kamu' },
      ],
      funnel: { periode: 'per bulan', steps: [{ tahap: 'Brand dihubungi', angka: 20 }, { tahap: 'Membalas', angka: 6 }, { tahap: 'Negosiasi', angka: 3 }, { tahap: 'Deal dibayar', angka: 2 }] },
    },
    tumbuh: {
      snapshot: {
        omzetBulan: 25, labaBulan: 11, marginKotor: 90, biayaTetapBulan: 10, kas: 30, piutang: 15,
        pelanggan: '±6 brand deal/bulan + affiliate (±30% pendapatan)',
        catatan: 'Margin kotor dikurangi biaya produksi per kampanye (properti, transport). Biaya tetap = gaji editor & admin, alat. Brand biasanya bayar 30–45 hari setelah tayang.',
      },
      roles: [
        {
          role: 'Kamu — talent & kepala konten', jumlah: '1',
          misi: 'Ide, wajah channel, dan keputusan arah konten.',
          harian: ['Syuting 1–2 jam', 'Balas komentar teratas'],
          mingguan: ['Rapat konten Senin: data → ide', 'Uji 1 format baru'],
          kpi: ['Views median ≥30 ribu', '1 kanal milik sendiri (newsletter/WA channel) tumbuh +1.000/bulan'],
        },
        {
          role: 'Editor', jumlah: '1 full-time', atasan: 'Kamu',
          misi: 'Video rapi, cepat, dengan hook kuat.',
          harian: ['Edit 1–2 video', 'Siapkan thumbnail & caption draf'],
          mingguan: ['Laporan retensi 3 detik pertama per video'],
          kpi: ['Video siap H-1 sebelum jadwal', 'Retensi 3 detik ≥65%'],
        },
        {
          role: 'Admin & negosiasi brand', jumlah: '1 part-time', atasan: 'Kamu',
          misi: 'Pipeline brand penuh, kontrak jelas, tagihan cair.',
          harian: ['Balas inquiry brand', 'Update pipeline brand di spreadsheet'],
          mingguan: ['Pitch 10 brand baru', 'Kirim laporan hasil kampanye', 'Tagih invoice jatuh tempo'],
          kpi: ['6 deal/bulan', 'Piutang >45 hari = 0', 'Repeat brand ≥40%'],
          prospek: ['Brand yang pernah deal (repeat order + paket 3 bulan)', 'Kategori dengan budget besar: fintech, edtech, gadget, FMCG anak muda', 'Agensi media & influencer', 'Brand kompetitor dari brand yang sudah kerja sama'],
          tools: ['Rate card & media kit', 'Template kontrak (cakupan, revisi, hak pakai)', 'Template laporan kampanye'],
        },
      ],
      ritme: [
        { kapan: 'Senin 10.00', agenda: 'Rapat konten: data minggu lalu → 5 ide', siapa: 'Kamu + editor' },
        { kapan: 'Selasa & Kamis', agenda: 'Hari syuting', siapa: 'Kamu + editor' },
        { kapan: 'Rabu', agenda: 'Pitch brand & follow-up', siapa: 'Admin' },
        { kapan: 'Jumat', agenda: 'Laporan kampanye + penagihan', siapa: 'Admin' },
        { kapan: 'Akhir bulan', agenda: 'Review pendapatan per sumber', siapa: 'Kamu + admin' },
      ],
      funnel: { periode: 'per bulan', steps: [{ tahap: 'Brand di-pitch / inquiry masuk', angka: 40 }, { tahap: 'Minta rate card', angka: 15 }, { tahap: 'Negosiasi', angka: 9 }, { tahap: 'Deal', angka: 6 }] },
    },
    skala: {
      snapshot: {
        omzetBulan: 240, labaBulan: 40, marginKotor: 80, biayaTetapBulan: 145, kas: 260, piutang: 90,
        pelanggan: '±25 sponsor aktif/bulan, 4 creator roster',
        catatan: 'Margin kotor dikurangi bagi hasil creator & biaya produksi. Biaya tetap = gaji 12 staf, studio, tools. 80% pendapatan dari sponsor = rawan.',
      },
      roles: [
        {
          role: 'CEO & talent utama', jumlah: '1',
          misi: 'Arah media brand, deal besar, dan diversifikasi pendapatan.',
          harian: ['Dashboard: views, pipeline sponsor, kas'],
          mingguan: ['Rapat kepemimpinan Senin', 'Tampil di 2 konten utama'],
          kpi: ['Pendapatan non-sponsor ≥30%', 'Net margin ≥18%'],
        },
        {
          role: 'Head of content + 3 editor', jumlah: '1 + 3', atasan: 'CEO',
          misi: 'Kalender konten semua creator, standar kualitas & cek fakta.',
          harian: ['Review naskah sebelum syuting (cek fakta)', 'Antrian edit'],
          mingguan: ['Rapat redaksi', 'Review performa per creator'],
          kpi: ['0 konten tayang tanpa cek fakta', 'Views median per creator naik'],
        },
        {
          role: 'Sales sponsor', jumlah: '1 (+1 rencana)', atasan: 'CEO',
          misi: 'Paket sponsor multi-creator & kontrak kuartalan.',
          harian: ['Follow-up pipeline', 'Kirim proposal'],
          mingguan: ['5 meeting brand/agensi', 'Update forecast pendapatan'],
          kpi: ['60% pendapatan dari kontrak ≥3 bulan', 'Win rate proposal ≥30%'],
          prospek: ['Marketing manager brand fintech, edtech, SaaS, perbankan digital', 'Media agency (biasanya pegang budget beberapa brand)', 'Sponsor event & kampus', 'Brand yang deal dengan 1 creator → tawarkan paket roster'],
        },
        {
          role: 'Community manager', jumlah: '1', atasan: 'Head of content',
          misi: 'Komunitas & kanal milik sendiri yang menjadi pasar produk.',
          harian: ['Moderasi komentar & grup', 'Kumpulkan pertanyaan audiens'],
          mingguan: ['Newsletter/WA channel', 'Laporan sentimen'],
          kpi: ['Anggota kanal sendiri +3.000/bulan', 'Respon krisis <2 jam'],
        },
        {
          role: 'Admin keuangan', jumlah: '1', atasan: 'CEO',
          misi: 'Tagihan sponsor, bagi hasil creator, laporan bulanan.',
          harian: ['Invoice & penagihan'],
          mingguan: ['Rekap bagi hasil per creator'],
          kpi: ['Hari piutang <30', 'Bagi hasil dibayar tepat tanggal'],
        },
      ],
      ritme: [
        { kapan: 'Senin 10.00', agenda: 'Rapat kepemimpinan: pendapatan, pipeline, konten', siapa: 'CEO, head of content, sales, finance' },
        { kapan: 'Selasa', agenda: 'Rapat redaksi & cek fakta', siapa: 'Head of content + creator' },
        { kapan: 'Rabu–Kamis', agenda: 'Produksi & meeting sponsor', siapa: 'Creator/editor, sales' },
        { kapan: 'Jumat', agenda: 'Laporan sponsor & sentimen komunitas', siapa: 'Sales, community manager' },
        { kapan: 'Tanggal 5', agenda: 'Bayar bagi hasil creator + laporan per creator', siapa: 'Finance' },
      ],
      funnel: { periode: 'per bulan', steps: [{ tahap: 'Brand/agensi dihubungi', angka: 80 }, { tahap: 'Meeting', angka: 20 }, { tahap: 'Proposal', angka: 12 }, { tahap: 'Kontrak', angka: 5 }] },
    },
  },
  exec: {
    rintis: [
      [
        { siapa: 'Kamu', tugas: 'Balas brand dengan sopan: belum cocok untuk audiens, terima kasih.' },
        { siapa: 'Kamu', tugas: 'Buat media kit 1 halaman: audiens, views rata-rata, 3 contoh konten, harga.' },
        { siapa: 'Kamu', tugas: 'Kirim ke 10 brand yang produknya kamu pakai; follow-up H+5.' },
      ],
      [
        { siapa: 'Kamu', tugas: 'Tetapkan 3 pilar konten (tips kuliah, produktivitas, day-in-life).' },
        { siapa: 'Kamu', tugas: 'Sabtu syuting 4 video sekaligus; Minggu edit & jadwalkan.' },
        { siapa: 'Kamu', tugas: 'Senin catat retensi tiap video, ulangi format pemenang.' },
      ],
      [
        { siapa: 'Kamu', tugas: 'Pilih 5 produk yang benar-benar kamu pakai dari katalog affiliate.' },
        { siapa: 'Kamu', tugas: 'Buat 1 video review jujur per produk (kelebihan + kekurangan).' },
        { siapa: 'Kamu', tugas: 'Pasang link di bio & pin komentar; cek konversi tiap minggu.' },
      ],
    ],
    tumbuh: [
      [
        { siapa: 'Admin', tugas: 'Susun rate card 3 paket (1 video, 3 video, bundle IG+TikTok) + hak pakai iklan terpisah.' },
        { siapa: 'Admin', tugas: 'Siapkan template kontrak: cakupan, revisi, tenggat bayar 30 hari.' },
        { siapa: 'Editor', tugas: 'Rekap hasil tiap kampanye (views, klik, kode promo) untuk laporan ke brand.' },
      ],
      [
        { siapa: 'Kamu + editor', tugas: 'Bedah 20 video terakhir: hook, durasi, topik mana yang turun.' },
        { siapa: 'Editor', tugas: 'Uji 2 format baru selama 2 minggu (4 video per format).' },
        { siapa: 'Admin', tugas: 'Buka WA channel/newsletter; ajak audiens bergabung di setiap video.' },
      ],
      [
        { siapa: 'Admin', tugas: 'Minta draf kontrak dan tandai pasal eksklusivitas & hak pakai.' },
        { siapa: 'Kamu', tugas: 'Negosiasi: eksklusif hanya kategori yang sama, hak pakai iklan 3 bulan.' },
        { siapa: 'Admin', tugas: 'Catat kategori yang terkunci agar tidak menerima brand pesaing.' },
      ],
    ],
    skala: [
      [
        { siapa: 'Community manager', tugas: 'Survei 2.000 anggota: masalah terbesar & harga yang wajar.' },
        { siapa: 'Head of content', tugas: 'Rancang kurikulum kelas cohort 4 minggu dari hasil survei.' },
        { siapa: 'Sales + community', tugas: 'Buka pre-order; produksi hanya jika ≥300 pembeli.' },
        { siapa: 'Finance', tugas: 'Pisahkan uang pre-order sampai kelas selesai (bisa refund).' },
      ],
      [
        { siapa: 'Finance', tugas: 'Siapkan laporan biaya & pendapatan per creator.' },
        { siapa: 'CEO', tugas: '1-on-1 dengan creator: tunjukkan angka, tawarkan bagi hasil berbasis performa.' },
        { siapa: 'Head of content', tugas: 'Tulis aturan kepemilikan IP & konten di kontrak baru.' },
      ],
      [
        { siapa: 'Head of content', tugas: 'Takedown konten, verifikasi ulang data dalam 2 jam.' },
        { siapa: 'CEO', tugas: 'Video permintaan maaf spesifik: salahnya apa, koreksinya apa.' },
        { siapa: 'Community manager', tugas: 'Balas komentar utama & pantau sentimen 3 hari.' },
        { siapa: 'Head of content', tugas: 'Tambahkan checklist cek fakta wajib sebelum syuting.' },
      ],
    ],
  },
};
