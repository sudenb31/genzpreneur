import type { SimIndustryOps } from '../types';

export const B2B_OPS: SimIndustryOps = {
  ops: {
    rintis: {
      snapshot: {
        omzetBulan: 0, labaBulan: -0.3, marginKotor: 100, biayaTetapBulan: 0.3, kas: 3,
        pelanggan: 'Belum ada pembeli',
        catatan: 'Pendapatanmu = komisi 5–6% dari belanja klien. Contoh: 1 kantor belanja Rp3 juta/bulan → komisi ±Rp180rb/bulan. Butuh ±10 kantor rutin untuk Rp2 juta/bulan. Biaya tetap = bensin, pulsa, cetak katalog.',
      },
      roles: [
        {
          role: 'Kamu — topi Prospecting', jumlah: 'kamu sendiri',
          misi: 'Menemukan orang yang memutuskan pembelian (PIC pengadaan/GA).',
          harian: ['Cari 10 nama PIC baru (LinkedIn, Google Maps, satpam/resepsionis)', 'Kirim 10 pesan personal'],
          mingguan: ['Kunjungi 1 kawasan perkantoran', 'Update daftar prospek'],
          kpi: ['50 pesan personal/minggu', '5 meeting/bulan'],
          prospek: ['Kantor kecil 10–50 orang: konsultan, notaris, klinik, sekolah swasta', 'Ruko & coworking di sekitarmu', 'Bagian GA/admin di LinkedIn', 'Referral dari klien yang sudah membeli'],
        },
        {
          role: 'Kamu — topi Presentasi & Penawaran', jumlah: 'kamu sendiri',
          misi: 'Menunjukkan penghematan & kemudahan, bukan sekadar katalog.',
          harian: ['Follow-up penawaran 2–3 hari setelah kirim'],
          mingguan: ['Siapkan penawaran berdasarkan daftar belanja klien'],
          kpi: ['Konversi meeting → pembeli ≥30%'],
        },
        {
          role: 'Kamu — topi Layanan klien', jumlah: 'kamu sendiri',
          misi: 'Klien belanja rutin tiap bulan.',
          harian: ['Teruskan order ke distributor & pastikan terkirim'],
          mingguan: ['Telepon klien: stok apa yang menipis'],
          kpi: ['Repeat order bulanan ≥80%'],
        },
      ],
      ritme: [
        { kapan: 'Senin', agenda: 'Riset 50 PIC & tulis pesan', siapa: 'Kamu' },
        { kapan: 'Selasa–Kamis', agenda: 'Kirim pesan, follow-up, meeting', siapa: 'Kamu' },
        { kapan: 'Jumat', agenda: 'Cek pengiriman & komisi dari distributor', siapa: 'Kamu' },
        { kapan: 'Tanggal 25', agenda: 'Tanya kebutuhan bulan depan ke klien', siapa: 'Kamu' },
      ],
      funnel: { periode: 'per bulan', steps: [{ tahap: 'Pesan personal', angka: 200 }, { tahap: 'Membalas', angka: 30 }, { tahap: 'Meeting/kirim penawaran', angka: 8 }, { tahap: 'Pembeli rutin', angka: 2 }] },
    },
    tumbuh: {
      snapshot: {
        omzetBulan: 180, labaBulan: 6, marginKotor: 18, biayaTetapBulan: 24, kas: 70, piutang: 95, stok: 60,
        pelanggan: '60 kantor & sekolah',
        catatan: 'Margin kotor tipis (18%) karena ini distribusi. Biaya tetap = gaji 6 orang, sewa gudang mini, bensin. Piutang Rp95 juta ≈ 16 hari omzet tertahan di klien.',
      },
      roles: [
        {
          role: 'Owner', jumlah: '1',
          misi: 'Margin, kas, kebijakan kredit, dan pemasok.',
          harian: ['Cek kas, piutang jatuh tempo, stok kritis'],
          mingguan: ['Rapat pipeline Senin', 'Negosiasi dengan pabrik'],
          kpi: ['Hari piutang <30', 'Margin kotor ≥18%'],
        },
        {
          role: 'Sales', jumlah: '2', atasan: 'Owner',
          misi: 'Akun baru yang membayar tepat waktu & order rutin.',
          harian: ['Kunjungi/telepon 8 klien & prospek', 'Catat semua aktivitas di CRM'],
          mingguan: ['5 penawaran baru', 'Update pipeline'],
          kpi: ['3 akun baru/bulan per sales', 'Kunjungan 40/bulan'],
          prospek: ['Sekolah swasta & yayasan (belanja tiap semester)', 'Kantor cabang bank/asuransi', 'Klinik & lab', 'Pabrik kecil (alat kebersihan & ATK)', 'Tender pengadaan kecil di LPSE/e-katalog'],
          tools: ['CRM sederhana', 'Daftar harga & batas diskon'],
        },
        {
          role: 'Admin & penagihan', jumlah: '1', atasan: 'Owner',
          misi: 'Invoice tepat & piutang tertagih.',
          harian: ['Invoice di hari kirim', 'Telepon klien jatuh tempo'],
          mingguan: ['Laporan umur piutang (0–30, 31–45, >45)'],
          kpi: ['Piutang >45 hari <5%'],
        },
        {
          role: 'Staf gudang', jumlah: '1', atasan: 'Owner',
          misi: 'Stok akurat, picking benar.',
          harian: ['Siapkan pesanan dengan picking list', 'Catat barang masuk/keluar'],
          mingguan: ['Opname barang cepat laku'],
          kpi: ['Akurasi stok ≥98%', 'Salah ambil <1%'],
        },
        {
          role: 'Kurir', jumlah: '1', atasan: 'Staf gudang',
          misi: 'Kirim tepat waktu dengan bukti terima.',
          harian: ['Rute pengiriman', 'Foto tanda terima'],
          mingguan: ['Laporan keterlambatan'],
          kpi: ['On-time ≥95%'],
        },
      ],
      ritme: [
        { kapan: 'Senin 08.30', agenda: 'Rapat pipeline: deal minggu ini, piutang', siapa: 'Owner, sales, admin' },
        { kapan: 'Setiap hari 07.30', agenda: 'Picking & rute pengiriman', siapa: 'Gudang + kurir' },
        { kapan: 'Rabu', agenda: 'Telepon penagihan', siapa: 'Admin' },
        { kapan: 'Jumat', agenda: 'Opname & order ke pabrik', siapa: 'Gudang + owner' },
        { kapan: 'Akhir bulan', agenda: 'Komisi sales dari omzet tertagih', siapa: 'Owner + admin' },
      ],
      funnel: { periode: 'per bulan', steps: [{ tahap: 'Prospek dikunjungi/ditelepon', angka: 120 }, { tahap: 'Minta penawaran', angka: 25 }, { tahap: 'Negosiasi', angka: 10 }, { tahap: 'Akun baru', angka: 6 }] },
    },
    skala: {
      snapshot: {
        omzetBulan: 1200, labaBulan: 35, marginKotor: 16, biayaTetapBulan: 150, kas: 600, piutang: 850, stok: 1100,
        pelanggan: '±600 akun: modern trade, hotel, gedung, pabrik',
        catatan: 'Distribusi = omzet besar, margin tipis. Biaya tetap = gaji 30 orang, gudang 600 m², armada. Piutang ≈ 21 hari omzet, stok ≈ 33 hari penjualan.',
      },
      roles: [
        {
          role: 'CEO', jumlah: '1',
          misi: 'Hubungan principal, modal kerja, dan pertumbuhan menguntungkan.',
          harian: ['Dashboard: omzet, margin, piutang, stok hari'],
          mingguan: ['Rapat pimpinan', 'Review dengan principal'],
          kpi: ['Margin kotor ≥16%', 'Modal kerja <45 hari'],
        },
        {
          role: 'Sales manager', jumlah: '1', atasan: 'CEO',
          misi: 'Tim 10 sales mencapai target dengan margin sehat.',
          harian: ['Coaching 2 sales di lapangan'],
          mingguan: ['Rapat pipeline per segmen', 'Review diskon di atas batas'],
          kpi: ['Target principal per segmen', 'Diskon rata-rata <5%'],
        },
        {
          role: 'Sales lapangan', jumlah: '10 (3 per segmen + key account)', atasan: 'Sales manager',
          misi: 'Kunjungan rutin, order, akun baru di segmennya.',
          harian: ['6–8 kunjungan dengan check-in CRM', 'Input order sebelum 15.00'],
          mingguan: ['3 akun baru diprospek', 'Laporan kompetitor'],
          kpi: ['Omzet tertagih sesuai target', '2 akun baru/bulan'],
          prospek: ['Hotel & gedung perkantoran (facility management)', 'Rumah sakit & klinik', 'Pabrik & kawasan industri', 'Modern trade & toko bangunan', 'Kontraktor kebersihan (outsourcing cleaning)'],
        },
        {
          role: 'Kepala gudang & logistik', jumlah: '1 + 9', atasan: 'CEO',
          misi: 'Barang benar, tepat waktu, stok akurat.',
          harian: ['Picking list per rute', 'Muat sesuai urutan rute', 'Terima barang principal'],
          mingguan: ['Opname bergilir', 'Laporan on-time & stok lambat'],
          kpi: ['On-time ≥96%', 'Akurasi stok ≥99%', 'Stok >90 hari <5%'],
          tools: ['Lokasi rak (kode A-01)', 'FIFO', 'Aplikasi rute'],
        },
        {
          role: 'Finance', jumlah: '3', atasan: 'CEO',
          misi: 'Kredit, penagihan, pajak, laporan principal.',
          harian: ['Penagihan jatuh tempo', 'Cek limit kredit sebelum kirim'],
          mingguan: ['Umur piutang & proyeksi kas 13 minggu'],
          kpi: ['DSO <25 hari', 'Bad debt <0,5%'],
        },
        {
          role: 'Admin & CS', jumlah: '4', atasan: 'Sales manager',
          misi: 'Order masuk benar, keluhan selesai.',
          harian: ['Input order & konfirmasi kirim', 'Tangani keluhan'],
          mingguan: ['Laporan keluhan'],
          kpi: ['Order error <0,5%'],
        },
      ],
      ritme: [
        { kapan: 'Senin 08.00', agenda: 'Rapat pimpinan: omzet, margin, piutang, stok', siapa: 'CEO, sales mgr, gudang, finance' },
        { kapan: 'Setiap hari 07.00', agenda: 'Muat & berangkat sesuai rute', siapa: 'Gudang & logistik' },
        { kapan: 'Setiap hari 16.00', agenda: 'Order cut-off & cek limit kredit', siapa: 'Admin + finance' },
        { kapan: 'Rabu', agenda: 'Rapat pipeline per segmen', siapa: 'Sales manager + sales' },
        { kapan: 'Bulanan', agenda: 'Review dengan principal & insentif sales', siapa: 'CEO, sales mgr, finance' },
      ],
      funnel: { periode: 'per bulan', steps: [{ tahap: 'Prospek dikunjungi', angka: 300 }, { tahap: 'Penawaran', angka: 70 }, { tahap: 'Order percobaan', angka: 35 }, { tahap: 'Akun rutin', angka: 20 }] },
    },
  },
  exec: {
    rintis: [
      [
        { siapa: 'Kamu', tugas: 'Daftar 30 kantor dalam radius 3 km dari Google Maps.' },
        { siapa: 'Kamu', tugas: 'Cari nama PIC pengadaan/GA lewat LinkedIn atau tanya resepsionis.' },
        { siapa: 'Kamu', tugas: 'Kirim pesan personal + tawarkan cek harga dari daftar belanja mereka.' },
      ],
      [
        { siapa: 'Kamu', tugas: 'Ajukan ke distributor: mereka kirim, menagih, dan menanggung tempo.' },
        { siapa: 'Distributor', tugas: 'Cek kelayakan kredit klien & tagih langsung.' },
        { siapa: 'Kamu', tugas: 'Pantau pembayaran klien agar komisi cair.' },
      ],
      [
        { siapa: 'Kamu', tugas: 'Minta perjanjian tertulis: komisi %, tanggal bayar, promo, kepemilikan klien.' },
        { siapa: 'Kamu', tugas: 'Simpan daftar klien yang kamu bawa & cocokkan dengan laporan distributor tiap bulan.' },
      ],
    ],
    tumbuh: [
      [
        { siapa: 'Owner', tugas: 'Tetapkan limit kredit per klien & aturan stop kirim di 45 hari.' },
        { siapa: 'Admin', tugas: 'Telepon semua klien >30 hari; tawarkan diskon 1% untuk bayar ≤14 hari.' },
        { siapa: 'Sales', tugas: 'Cek status piutang klien sebelum menerima order baru.' },
      ],
      [
        { siapa: 'Owner', tugas: 'Cari distributor besar yang mau menanggung jaminan & modal tender.' },
        { siapa: 'Sales', tugas: 'Siapkan dokumen teknis & penawaran harga bersama mitra.' },
        { siapa: 'Gudang', tugas: 'Siapkan jadwal kirim jika tender menang.' },
      ],
      [
        { siapa: 'Owner', tugas: 'Pasang CRM sederhana; data klien milik perusahaan.' },
        { siapa: 'Sales', tugas: 'Input setiap kunjungan & penawaran di hari yang sama.' },
        { siapa: 'Owner', tugas: 'Rapat pipeline Senin & hitung komisi dari data CRM.' },
      ],
    ],
    skala: [
      [
        { siapa: 'Sales manager', tugas: 'Petakan potensi per segmen (hotel, RS, pabrik, ritel) dari data.' },
        { siapa: 'CEO', tugas: 'Rekrut 3 sales untuk 2 segmen dengan potensi terbesar.' },
        { siapa: 'CEO', tugas: 'Negosiasi target bertahap dengan principal (kuartal per kuartal).' },
      ],
      [
        { siapa: 'Kepala gudang', tugas: 'Beri kode lokasi rak & terapkan FIFO.' },
        { siapa: 'Kepala gudang', tugas: 'Picking list per rute; muat sesuai urutan pengiriman.' },
        { siapa: 'Finance', tugas: 'Daftar stok >90 hari untuk promo/retur ke principal.' },
      ],
      [
        { siapa: 'CEO + finance', tugas: 'Hitung komisi dari margin yang sudah tertagih, bukan omzet.' },
        { siapa: 'Sales manager', tugas: 'Tambah bonus untuk akun baru & sosialisasikan dengan contoh hitungan.' },
        { siapa: 'Finance', tugas: 'Laporan komisi per sales setiap bulan.' },
      ],
    ],
  },
};
