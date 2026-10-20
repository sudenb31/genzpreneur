import type { SimIndustryOps } from '../types';

export const BEAUTY_OPS: SimIndustryOps = {
  ops: {
    rintis: {
      snapshot: {
        omzetBulan: 6, labaBulan: 1.2, marginKotor: 28, biayaTetapBulan: 0.2, kas: 10, stok: 4,
        pelanggan: '±50 pembeli/bulan dari followers & teman',
        catatan: 'Angka = target bulan pertama sebagai reseller brand ber-BPOM (margin 25–30%). Biaya tetap = packing & kuota.',
      },
      roles: [
        {
          role: 'Kamu — topi Konten & Edukasi', jumlah: 'kamu sendiri',
          misi: 'Dipercaya karena edukasi yang jujur, bukan klaim berlebihan.',
          harian: ['1 konten edukasi jenis kulit/bahan aktif', 'Balas pertanyaan DM'],
          mingguan: ['Live/Q&A 30 menit', 'Catat 10 masalah kulit yang paling sering ditanya'],
          kpi: ['50 pembeli/bulan', 'Data 100 pertanyaan pelanggan dalam 3 bulan'],
          prospek: ['Followers yang sering bertanya rekomendasi', 'Grup kampus & kantor', 'Komunitas skincare lokal', 'Pembeli lama (refill)'],
        },
        {
          role: 'Kamu — topi Order & Packing', jumlah: 'kamu sendiri',
          misi: 'Pesanan benar, cepat, dan stok tidak kadaluarsa.',
          harian: ['Packing & kirim sebelum jam 15.00', 'Catat order di spreadsheet'],
          mingguan: ['Cek stok & tanggal kedaluwarsa', 'Restock dari distributor resmi'],
          kpi: ['Kirim di hari yang sama', '0 produk kedaluwarsa terjual'],
        },
        {
          role: 'Kamu — topi Retensi', jumlah: 'kamu sendiri',
          misi: 'Pembeli kembali saat produk habis.',
          harian: ['Tandai tanggal beli tiap pelanggan di spreadsheet'],
          mingguan: ['Kirim pengingat ke pembeli minggu ke-5'],
          kpi: ['Repeat order ≥25%'],
        },
      ],
      ritme: [
        { kapan: 'Senin', agenda: 'Rencana konten & cek stok', siapa: 'Kamu' },
        { kapan: 'Setiap hari 13.00–15.00', agenda: 'Packing & kirim', siapa: 'Kamu' },
        { kapan: 'Rabu malam', agenda: 'Live Q&A', siapa: 'Kamu' },
        { kapan: 'Jumat', agenda: 'Pengingat isi ulang & restock', siapa: 'Kamu' },
        { kapan: 'Akhir bulan', agenda: 'Rekap penjualan & pertanyaan terbanyak', siapa: 'Kamu' },
      ],
      funnel: { periode: 'per bulan', steps: [{ tahap: 'Lihat konten', angka: 15000 }, { tahap: 'DM/tanya', angka: 200 }, { tahap: 'Beli', angka: 50 }, { tahap: 'Beli lagi', angka: 13 }] },
    },
    tumbuh: {
      snapshot: {
        omzetBulan: 105, labaBulan: 14, marginKotor: 65, biayaTetapBulan: 50, kas: 80, stok: 45,
        pelanggan: '±1.500 pcs/bulan, 70% marketplace, 30% kanal sendiri',
        catatan: 'Margin kotor dikurangi HPP maklon & biaya marketplace. Biaya tetap = gaji 3 staf, iklan & KOL rutin, gudang kecil.',
      },
      roles: [
        {
          role: 'Founder (brand)', jumlah: '1',
          misi: 'Positioning, produk, dan alokasi kas antara stok vs iklan.',
          harian: ['Dashboard: penjualan, ROAS, stok hari'],
          mingguan: ['Rapat tim Senin', 'Review kampanye creator'],
          kpi: ['Margin kontribusi ≥25%', 'Stok aman 6–8 minggu'],
        },
        {
          role: 'Admin marketplace & CS', jumlah: '1', atasan: 'Founder',
          misi: 'Toko rapi, ulasan bagus, pertanyaan terjawab.',
          harian: ['Proses pesanan & chat <30 menit', 'Tanggapi ulasan negatif'],
          mingguan: ['Atur promo & voucher', 'Laporan komplain'],
          kpi: ['Rating ≥4,8', 'Chat response ≥95%'],
        },
        {
          role: 'Content creator', jumlah: '1', atasan: 'Founder',
          misi: 'Konten edukasi & kelola program nano creator.',
          harian: ['1 konten edukasi/testimoni', 'Hubungi creator baru'],
          mingguan: ['Kirim produk ke 6 nano creator', 'Laporan konversi kode affiliate'],
          kpi: ['25 creator aktif/bulan', 'Biaya per pembeli < Rp35rb'],
          prospek: ['Nano creator skincare 3–30 ribu followers', 'Pembeli yang memberi ulasan foto bagus', 'Komunitas skincare & beauty enthusiast', 'Klinik/MUA lokal untuk kerja sama'],
        },
        {
          role: 'Packing & gudang', jumlah: '1', atasan: 'Founder',
          misi: 'Pesanan benar, FEFO (kedaluwarsa duluan keluar), stok tercatat.',
          harian: ['Packing semua pesanan sebelum cut-off kurir', 'Update stok keluar'],
          mingguan: ['Stock opname', 'Laporan stok per batch & tanggal kedaluwarsa'],
          kpi: ['Salah kirim <0,5%', 'Selisih stok 0'],
        },
      ],
      ritme: [
        { kapan: 'Senin', agenda: 'Rapat tim: penjualan, stok, kampanye', siapa: 'Semua' },
        { kapan: 'Setiap hari 14.00', agenda: 'Cut-off packing', siapa: 'Gudang' },
        { kapan: 'Rabu', agenda: 'Kirim produk ke creator baru', siapa: 'Content creator' },
        { kapan: 'Jumat', agenda: 'Stock opname & proyeksi order maklon', siapa: 'Gudang + founder' },
        { kapan: 'Bulanan', agenda: 'Review per kanal: marketplace vs kanal sendiri', siapa: 'Founder + admin' },
      ],
      funnel: { periode: 'per bulan', steps: [{ tahap: 'Pengunjung toko', angka: 60000 }, { tahap: 'Masuk keranjang', angka: 4500 }, { tahap: 'Bayar', angka: 1300 }, { tahap: 'Repeat', angka: 350 }] },
    },
    skala: {
      snapshot: {
        omzetBulan: 600, labaBulan: 55, marginKotor: 68, biayaTetapBulan: 340, kas: 550, stok: 380, piutang: 30,
        pelanggan: '6 SKU, ±8.000 pesanan/bulan, mayoritas online',
        catatan: 'Biaya tetap = gaji 25 orang, marketing & KOL rutin, gudang & kantor. Stok besar karena 6 SKU × minimum order maklon.',
      },
      roles: [
        {
          role: 'CEO', jumlah: '1',
          misi: 'Portofolio produk, kanal, dan keamanan produk.',
          harian: ['Dashboard: penjualan per SKU, kas, stok'],
          mingguan: ['Rapat pimpinan', 'Review komplain keamanan produk'],
          kpi: ['Net margin ≥10%', '0 kasus keamanan tanpa tindak lanjut 24 jam'],
        },
        {
          role: 'Brand manager + marketing', jumlah: '1 + 6', atasan: 'CEO',
          misi: 'Hero product kuat, kampanye yang menguntungkan.',
          harian: ['Optimasi iklan & creator'],
          mingguan: ['Laporan ROAS per SKU', 'Riset komunitas untuk SKU baru'],
          kpi: ['ROAS gabungan ≥3', 'Hero product ≥45% penjualan'],
        },
        {
          role: 'Head of sales (online & offline)', jumlah: '1', atasan: 'CEO',
          misi: 'Kanal baru tanpa merusak kas & harga.',
          harian: ['Pantau sell-out & stok toko'],
          mingguan: ['Kunjungi 3 toko pilot', 'Laporan sell-out mingguan'],
          kpi: ['Sell-out ≥60%/bulan di toko pilot', 'Piutang retail sesuai termin'],
          prospek: ['Jaringan toko kosmetik regional', 'Apotek & drugstore', 'Reseller resmi per kota', 'Marketplace mall/official store'],
        },
        {
          role: 'Product development', jumlah: '1', atasan: 'CEO',
          misi: 'Formula aman, legal (BPOM), dan divalidasi pelanggan.',
          harian: ['Koordinasi maklon'],
          mingguan: ['Uji stabilitas & review keluhan'],
          kpi: ['Semua SKU ber-notifikasi BPOM', 'Waktu peluncuran ≤6 bulan'],
        },
        {
          role: 'Tim gudang', jumlah: '6', atasan: 'Head of sales',
          misi: 'FEFO, kondisi penyimpanan, akurasi kirim.',
          harian: ['Picking & packing', 'Cek suhu ruang simpan'],
          mingguan: ['Opname per lokasi', 'Isolasi stok bermasalah'],
          kpi: ['Akurasi stok ≥99,5%', 'Kirim H+0 ≥95%'],
        },
        {
          role: 'CS', jumlah: '4', atasan: 'Brand manager',
          misi: 'Komplain ditangani cepat & tercatat per batch.',
          harian: ['Chat & komplain'],
          mingguan: ['Laporan komplain per SKU & batch'],
          kpi: ['Resolusi <24 jam', 'Komplain tercatat 100% dengan nomor batch'],
        },
      ],
      ritme: [
        { kapan: 'Senin', agenda: 'Rapat pimpinan: penjualan, kas, stok, komplain', siapa: 'CEO + semua head' },
        { kapan: 'Setiap hari', agenda: 'Cut-off gudang & cek suhu', siapa: 'Gudang' },
        { kapan: 'Rabu', agenda: 'Review kampanye & creator', siapa: 'Brand manager + marketing' },
        { kapan: 'Jumat', agenda: 'Laporan sell-out toko & komplain per batch', siapa: 'Sales + CS' },
        { kapan: 'Bulanan', agenda: 'Rencana produksi maklon 3 bulan', siapa: 'CEO, product dev, gudang, finance' },
      ],
      funnel: { periode: 'per bulan', steps: [{ tahap: 'Pengunjung', angka: 350000 }, { tahap: 'Keranjang', angka: 25000 }, { tahap: 'Bayar', angka: 8000 }, { tahap: 'Repeat', angka: 2400 }] },
    },
  },
  exec: {
    rintis: [
      [
        { siapa: 'Kamu', tugas: 'Daftar jadi reseller resmi 2 brand ber-BPOM; cek nomor notifikasinya.' },
        { siapa: 'Kamu', tugas: 'Mulai stok kecil (Rp4 juta) untuk 5 produk paling ditanya.' },
        { siapa: 'Kamu', tugas: 'Catat setiap pertanyaan kulit pelanggan di spreadsheet.' },
      ],
      [
        { siapa: 'Kamu', tugas: 'Ganti klaim jadi klaim yang diizinkan ("membantu mencerahkan").' },
        { siapa: 'Kamu', tugas: 'Buat konten pemakaian nyata 4 minggu dengan pencahayaan sama.' },
      ],
      [
        { siapa: 'Kamu', tugas: 'Kirim pengingat isi ulang di minggu ke-5 setelah pembelian.' },
        { siapa: 'Kamu', tugas: 'Buat bundling hemat (sabun + serum) & grup konsultasi pelanggan.' },
      ],
    ],
    tumbuh: [
      [
        { siapa: 'Gudang', tugas: 'Hitung stok hari & rata-rata penjualan 8 minggu.' },
        { siapa: 'Founder', tugas: 'Order 3.000 pcs; negosiasi harga untuk komitmen 3 order berturut-turut.' },
        { siapa: 'Founder', tugas: 'Sisihkan anggaran iklan & creator sebelum bayar maklon.' },
      ],
      [
        { siapa: 'Content creator', tugas: 'Pilih 25 nano creator dengan audiens sesuai; kirim produk & kode affiliate.' },
        { siapa: 'Admin', tugas: 'Lacak penjualan per kode tiap minggu.' },
        { siapa: 'Founder', tugas: 'Perbesar budget ke 5 creator dengan konversi terbaik.' },
      ],
      [
        { siapa: 'Founder', tugas: 'Tahan harga; buat bundling bernilai (gratis travel size).' },
        { siapa: 'Admin', tugas: 'Masukkan kartu "beli lagi di WA/website" di setiap paket.' },
        { siapa: 'Content creator', tugas: 'Konten perbandingan keaslian & kualitas.' },
      ],
    ],
    skala: [
      [
        { siapa: 'Brand manager', tugas: 'Survei komunitas untuk 5 ide produk; pilih 2 dengan minat tertinggi.' },
        { siapa: 'Product dev', tugas: 'Formulasi & notifikasi BPOM untuk 2 SKU terpilih.' },
        { siapa: 'Marketing', tugas: 'Perkuat hero product dengan kampanye baru.' },
      ],
      [
        { siapa: 'Head of sales', tugas: 'Pilih 15 toko dengan trafik terbaik untuk pilot 3 bulan.' },
        { siapa: 'Gudang', tugas: 'Kirim stok konsinyasi terbatas; catat per toko.' },
        { siapa: 'Head of sales', tugas: 'Laporan sell-out mingguan; tentukan ekspansi dari data.' },
      ],
      [
        { siapa: 'Tim CS', tugas: 'Hubungi pelanggan, catat nomor batch, tawarkan refund & dokter jika perlu.' },
        { siapa: 'Gudang', tugas: 'Isolasi batch terkait dan hentikan pengiriman.' },
        { siapa: 'Product dev', tugas: 'Uji ulang di lab bersama maklon; lapor ke BPOM bila diperlukan.' },
        { siapa: 'CEO', tugas: 'Umumkan temuan & tindakan secara terbuka.' },
      ],
    ],
  },
};
