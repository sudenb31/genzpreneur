import type { SimIndustryOps } from '../types';

export const RETAIL_OPS: SimIndustryOps = {
  ops: {
    rintis: {
      snapshot: {
        omzetBulan: 7.6, labaBulan: 1.8, marginKotor: 30, biayaTetapBulan: 0.3, kas: 4, stok: 3,
        pelanggan: '±170 pcs/bulan (±40 pcs/minggu) dari WA, IG, TikTok',
        catatan: 'Harga jual rata-rata Rp45rb/pcs. Margin kotor sudah dikurangi harga beli, ongkos ke Tanah Abang, dan plastik. Biaya tetap = kuota & ring light.',
      },
      roles: [
        {
          role: 'Kamu — topi Pembelian & stok', jumlah: 'kamu sendiri',
          misi: 'Stok yang laku, bukan stok yang menumpuk.',
          harian: ['Catat penjualan per warna/model'],
          mingguan: ['Belanja ke supplier berdasarkan data', 'Cek stok yang tidak laku 3 minggu'],
          kpi: ['Stok habis ≤4 minggu', '3 warna terlaris tidak pernah kosong'],
        },
        {
          role: 'Kamu — topi Konten & live', jumlah: 'kamu sendiri',
          misi: 'Penonton yang tepat dan membeli saat live.',
          harian: ['1 video pendek (cara pakai, mix & match)'],
          mingguan: ['Live 3× (Senin, Rabu, Jumat 19.00)', 'Evaluasi data tiap live'],
          kpi: ['20 pcs terjual per live', 'Penonton rata-rata 80'],
          prospek: ['Followers WA & IG lama (broadcast katalog baru)', 'Grup pengajian, arisan, kampus', 'Penonton live TikTok di jam pulang kerja', 'Reseller kecil di daerah'],
        },
        {
          role: 'Adik — packing', jumlah: '1 (bantu)', atasan: 'Kamu',
          misi: 'Paket rapi, benar, dan terkirim hari itu.',
          harian: ['Packing sebelum kurir jemput 16.00', 'Foto paket sebelum ditutup'],
          mingguan: ['Rekap resi & retur'],
          kpi: ['Salah kirim 0', 'Retur <5%'],
        },
      ],
      ritme: [
        { kapan: 'Senin, Rabu, Jumat 19.00', agenda: 'Live selling 60 menit', siapa: 'Kamu' },
        { kapan: 'Setiap hari 14.00–16.00', agenda: 'Konfirmasi COD & packing', siapa: 'Kamu + adik' },
        { kapan: 'Selasa', agenda: 'Belanja stok ke supplier', siapa: 'Kamu' },
        { kapan: 'Minggu', agenda: 'Rekap penjualan per model & rencana konten', siapa: 'Kamu' },
      ],
      funnel: { periode: 'per bulan', steps: [{ tahap: 'Penonton live & video', angka: 12000 }, { tahap: 'Tanya/klik keranjang', angka: 600 }, { tahap: 'Order', angka: 180 }, { tahap: 'Diterima (tidak retur)', angka: 170 }] },
    },
    tumbuh: {
      snapshot: {
        omzetBulan: 140, labaBulan: 9, marginKotor: 30, biayaTetapBulan: 30, kas: 45, stok: 95,
        pelanggan: '±2.800 pesanan/bulan dari 3 marketplace + TikTok Shop',
        catatan: 'Margin kotor dikurangi harga beli & biaya marketplace (±12–15%). Biaya tetap = gaji 4 orang, iklan, gudang rumah. 30% stok (±Rp28 juta) tidak bergerak 60 hari.',
      },
      roles: [
        {
          role: 'Owner & pembelian', jumlah: '1',
          misi: 'Membeli yang laku, menjaga margin per kanal.',
          harian: ['Dashboard: penjualan per SKU & kanal'],
          mingguan: ['Rapat tim Senin', 'Order ke supplier berdasarkan data'],
          kpi: ['Stok >60 hari <10%', 'Margin bersih ≥8%'],
        },
        {
          role: 'Host live', jumlah: '2', atasan: 'Owner',
          misi: 'Penjualan per sesi sesuai target.',
          harian: ['Live 2 sesi (siang & malam)', 'Latihan naskah 15 menit'],
          mingguan: ['Review rekaman & data sesi'],
          kpi: ['Rp1,5 juta omzet per sesi', 'Konversi penonton ≥3%'],
          prospek: ['Penonton TikTok jam 12.00 & 19.00–22.00', 'Pembeli lama (undangan live via WA)', 'Komunitas & reseller'],
        },
        {
          role: 'Admin marketplace', jumlah: '1', atasan: 'Owner',
          misi: 'Toko rapi, chat cepat, promo menguntungkan.',
          harian: ['Proses pesanan & balas chat', 'Update stok semua kanal'],
          mingguan: ['Atur promo & flash sale', 'Laporan biaya per kanal'],
          kpi: ['Rating ≥4,8', 'Pembatalan karena stok kosong 0'],
        },
        {
          role: 'Packing & gudang', jumlah: '1', atasan: 'Owner',
          misi: 'Stok tercatat, packing benar & cepat.',
          harian: ['Packing sebelum cut-off', 'Catat barang masuk'],
          mingguan: ['Opname 20 SKU terlaris', 'Laporan umur stok'],
          kpi: ['Salah kirim <0,5%', 'Selisih stok <2%'],
        },
      ],
      ritme: [
        { kapan: 'Senin', agenda: 'Rapat tim: penjualan per kanal, stok lambat, jadwal live', siapa: 'Semua' },
        { kapan: 'Setiap hari 12.00 & 19.00', agenda: 'Sesi live', siapa: 'Host live' },
        { kapan: 'Setiap hari 15.00', agenda: 'Cut-off packing', siapa: 'Gudang' },
        { kapan: 'Rabu', agenda: 'Belanja stok', siapa: 'Owner' },
        { kapan: 'Jumat', agenda: 'Opname & laporan umur stok', siapa: 'Gudang + owner' },
      ],
      funnel: { periode: 'per bulan', steps: [{ tahap: 'Pengunjung & penonton', angka: 150000 }, { tahap: 'Keranjang', angka: 9000 }, { tahap: 'Bayar', angka: 2800 }, { tahap: 'Repeat', angka: 500 }] },
    },
    skala: {
      snapshot: {
        omzetBulan: 650, labaBulan: 40, marginKotor: 38, biayaTetapBulan: 200, kas: 320, stok: 420,
        pelanggan: '±11.000 pesanan/bulan; 60% dari satu platform',
        catatan: 'Margin kotor lebih tinggi karena sebagian produk merek sendiri. Biaya tetap = gaji 16 orang, gudang sewaan, iklan rutin. Stok ≈ 1 bulan penjualan (nilai beli).',
      },
      roles: [
        {
          role: 'CEO', jumlah: '1',
          misi: 'Diversifikasi kanal, porsi merek sendiri, dan kas.',
          harian: ['Dashboard: omzet per kanal, margin, stok'],
          mingguan: ['Rapat pimpinan', 'Review produk merek sendiri'],
          kpi: ['Tidak ada kanal >45% penjualan', 'Merek sendiri ≥35%'],
        },
        {
          role: 'Merchandiser & purchasing', jumlah: '1', atasan: 'CEO',
          misi: 'Produk yang tepat, jumlah yang tepat.',
          harian: ['Pantau sell-through per SKU'],
          mingguan: ['Rencana beli & pre-order', 'Negosiasi supplier/konveksi'],
          kpi: ['Sell-through 60 hari ≥70%', 'Stok mati <5%'],
        },
        {
          role: 'Host live', jumlah: '4', atasan: 'CEO',
          misi: 'Penjualan per sesi & uji produk baru.',
          harian: ['2 sesi per host'],
          mingguan: ['Evaluasi naskah & data'],
          kpi: ['Omzet per jam live sesuai target', 'Pre-order produk baru terisi'],
          prospek: ['Pembeli lama (WA channel & membership)', 'Penonton di platform kedua & ketiga', 'Reseller & dropshipper resmi', 'Website & kanal milik sendiri'],
        },
        {
          role: 'Admin marketplace', jumlah: '3', atasan: 'CEO',
          misi: 'Toko patuh aturan, rating tinggi, stok sinkron.',
          harian: ['Chat, pesanan, komplain', 'Cek kebijakan & pelanggaran'],
          mingguan: ['Laporan kesehatan akun', 'Kampanye platform'],
          kpi: ['Skor kesehatan akun hijau', 'Overselling 0'],
        },
        {
          role: 'Gudang', jumlah: '5', atasan: 'Merchandiser',
          misi: 'Barcode, lokasi rak, opname bergilir, kirim tepat.',
          harian: ['Terima barang & scan barcode', 'Picking-packing sesuai cut-off'],
          mingguan: ['Opname bergilir (1 zona/hari)', 'Laporan selisih & retur'],
          kpi: ['Selisih stok <0,5%', 'Salah kirim <0,3%'],
        },
        {
          role: 'Finance', jumlah: '1', atasan: 'CEO',
          misi: 'Rekonsiliasi pencairan marketplace & arus kas.',
          harian: ['Rekonsiliasi saldo platform'],
          mingguan: ['Margin per kanal & proyeksi kas'],
          kpi: ['Selisih rekonsiliasi 0'],
        },
        {
          role: 'Desainer produk', jumlah: '1', atasan: 'Merchandiser',
          misi: 'Desain merek sendiri yang divalidasi pembeli.',
          harian: ['Desain & sampel'],
          mingguan: ['Uji 2 desain lewat live/pre-order'],
          kpi: ['2 desain lolos pre-order/bulan'],
        },
      ],
      ritme: [
        { kapan: 'Senin', agenda: 'Rapat pimpinan: kanal, margin, stok, kesehatan akun', siapa: 'CEO, merchandiser, admin lead, finance' },
        { kapan: 'Setiap hari', agenda: 'Live terjadwal 4 host + cut-off gudang', siapa: 'Host & gudang' },
        { kapan: 'Rabu', agenda: 'Review desain & pre-order', siapa: 'Merchandiser + desainer + host' },
        { kapan: 'Jumat', agenda: 'Opname zona & laporan selisih', siapa: 'Gudang' },
        { kapan: 'Bulanan', agenda: 'Rencana beli & produksi 2 bulan', siapa: 'CEO, merchandiser, finance' },
      ],
      funnel: { periode: 'per bulan', steps: [{ tahap: 'Pengunjung & penonton', angka: 600000 }, { tahap: 'Keranjang', angka: 35000 }, { tahap: 'Bayar', angka: 11000 }, { tahap: 'Repeat', angka: 2700 }] },
    },
  },
  exec: {
    rintis: [
      [
        { siapa: 'Kamu', tugas: 'Beli 6 warna × 8 pcs; catat penjualan per warna.' },
        { siapa: 'Kamu', tugas: 'Restock hanya warna yang habis dalam 2 minggu.' },
        { siapa: 'Kamu', tugas: 'Model baru dijual pre-order dulu (DP 50%).' },
      ],
      [
        { siapa: 'Kamu', tugas: 'Tetapkan jadwal live 3×/minggu di jam yang sama.' },
        { siapa: 'Kamu', tugas: 'Naskah 5 bagian: sapa, masalah, demo, promo, ajakan checkout.' },
        { siapa: 'Kamu', tugas: 'Catat penonton, klik, dan pcs terjual tiap sesi.' },
      ],
      [
        { siapa: 'Adik', tugas: 'Konfirmasi setiap pesanan COD lewat WA sebelum dikirim.' },
        { siapa: 'Kamu', tugas: 'Batasi COD untuk pembeli baru dengan alamat tidak lengkap.' },
        { siapa: 'Kamu', tugas: 'Bonus bros/ciput untuk pembeli yang transfer.' },
      ],
    ],
    tumbuh: [
      [
        { siapa: 'Gudang', tugas: 'Daftar semua SKU >60 hari beserta nilai belinya.' },
        { siapa: 'Admin', tugas: 'Bundling & flash sale untuk stok lambat; sisanya ke reseller.' },
        { siapa: 'Owner', tugas: 'Aturan baru: SKU >45 hari otomatis masuk promo.' },
      ],
      [
        { siapa: 'Admin', tugas: 'Hitung margin per SKU per kanal setelah biaya baru.' },
        { siapa: 'Owner', tugas: 'Naikkan harga selektif di kanal yang termahal.' },
        { siapa: 'Admin', tugas: 'Kartu di paket: "beli lagi via WA, gratis ongkir".' },
      ],
      [
        { siapa: 'Owner', tugas: 'Rekrut 2 host lewat audisi live 15 menit.' },
        { siapa: 'Owner', tugas: 'Skema gaji pokok + komisi per sesi; target jelas.' },
        { siapa: 'Host baru', tugas: 'Latihan naskah 2 minggu & review rekaman bersama owner.' },
      ],
    ],
    skala: [
      [
        { siapa: 'Merchandiser', tugas: 'Pilih 5 desain merek sendiri dari data produk supplier terlaris.' },
        { siapa: 'Host live', tugas: 'Uji lewat pre-order di live sebelum produksi besar.' },
        { siapa: 'Finance', tugas: 'Bandingkan margin merek sendiri vs barang supplier tiap bulan.' },
      ],
      [
        { siapa: 'CEO', tugas: 'Pilih sistem inventaris yang terhubung ke semua marketplace.' },
        { siapa: 'Gudang', tugas: 'Pasang barcode & kode lokasi rak; opname bergilir per zona.' },
        { siapa: 'Admin', tugas: 'Matikan update stok manual; semua lewat sistem.' },
      ],
      [
        { siapa: 'Admin', tugas: 'Ajukan banding dengan bukti perbaikan konten & SOP.' },
        { siapa: 'Host live', tugas: 'Pindahkan jadwal live ke platform kedua sementara.' },
        { siapa: 'CEO', tugas: 'Broadcast ke pembeli lama: belanja lewat kanal lain & website.' },
      ],
    ],
  },
};
