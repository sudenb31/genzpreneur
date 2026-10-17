# Revisi desain GenZ Preneur OS — 17 Oktober 2026

## Apa yang berubah
- Identitas hitam, krem, dan oranye dipertahankan. Area kerja memakai warna lime/lilac/sky/pink, garis hitam, bayangan tegas, teks yang mudah dibaca, dan tombol dengan tujuan yang jelas.
- Dashboard: Fokus hari ini, progres asli, pelajaran berikutnya yang dapat diakses, arah/profil, dan alat cepat. Passport tidak wajib lengkap untuk mulai belajar.
- Menu desktop dikelompokkan menurut kegiatan. Di HP tersedia Beranda, Belajar, Alat, dan Akun, serta tombol Menu untuk semua fitur dan halaman admin.
- Tombol Kembali ke Dashboard tersedia di halaman dalam aplikasi dan di voucher untuk akun peserta. Logo dalam aplikasi menuju dashboard; Situs utama tetap tersedia.
- Belajar: pencarian modul berdasarkan judul/tagline/judul pelajaran, rekomendasi melanjutkan pelajaran, dan kartu modul berwarna sesuai Season.
- Pelajaran: kolom baca lebih nyaman, daftar pelajaran bisa dilipat, simpan draf tanpa menandai selesai, status penyimpanan, dan konfirmasi saat meninggalkan latihan yang belum disimpan melalui tombol/tautan.
- Alat Bisnis: pilihan alat dalam kartu, pencarian prompt, kategori, dan panduan yang bisa disembunyikan.
- Landing: penjelasan hasil kerja, menu publik HP, kartu benefit berwarna, daftar jalur statis, dan tautan assessment yang benar untuk akun login.
- Akun & Paket: akses langsung ke voucher, pilihan paket, dan hasil tersimpan.
- Notifikasi dan pengingat simpan ditempatkan di atas navigasi bawah HP.

## Yang perlu dipahami
- Pencarian berjalan pada materi/prompt yang sudah ada, tanpa layanan pencarian baru.
- Pelajaran berikutnya berarti draf yang belum selesai, atau pelajaran pertama yang belum selesai dan boleh dibuka sesuai akses. Ini bukan pencatatan waktu terakhir membuka halaman.
- Progres dihitung dari data yang benar-benar tersimpan; tidak ada angka peserta, omzet, atau testimoni buatan.
- Tombol Simpan draf tetap memakai penyimpanan latihan yang sudah ada. Tidak ada perubahan skema database atau Security Rules.
- Konfirmasi latihan melindungi tombol pindah dan tautan biasa dalam aplikasi. Tombol Back/Forward browser dalam satu aplikasi belum memiliki pemblokiran khusus; simpan latihan sebelum memakai tombol tersebut.
- Pengujian visual memakai data contoh lokal di lingkungan pemeriksaan terpisah, tidak disertakan dalam ZIP dan tidak menulis ke Firebase produksi.

## Pemeriksaan setelah deploy
1. Masuk sebagai admin dan peserta. Buka voucher, lalu kembali ke dashboard.
2. Di HP: cek empat menu bawah, buka/tutup Menu, dan pastikan semua fitur tetap dapat ditemukan.
3. Belajar: cari `harga`, hapus pencarian, lalu buka sebuah pelajaran.
4. Ketik latihan, pilih Simpan draf, buka ulang pelajaran, lalu pastikan jawabannya ada dan belum ditandai selesai.
5. Ubah latihan, klik pelajaran berikutnya, lalu pilih Kembali ke latihan untuk memastikan perubahan tetap ada.
6. Alat Bisnis: pilih HPP, hitung harga; pindah ke prompt lalu cari berdasarkan pekerjaan.
7. Tes akun Spark saat mode Sesuai paket: fitur terkunci tetap menunjukkan informasi akses.
8. Pastikan pengingat simpan tidak tertutup menu bawah di Passport dan Kontrak Mimpi.

## Firebase
firestore.rules tidak diubah oleh revisi desain ini. Tidak perlu Publish ulang Rules khusus untuk revisi ini. Status Rules yang sudah aktif di Firebase tetap perlu sesuai dengan versi aplikasi sebelumnya.
## Koreksi arah visual — Founder Studio
Seluruh aplikasi diarahkan menjadi ruang kreatif calon founder: enerjik, berani, dan tetap praktis dipakai. Warna menandai kelompok fitur serta Season. Komponen bersama (header, tombol, kartu, input, chip, navigasi, dan tabel admin) memiliki garis hitam dan identitas yang konsisten. Area baca tetap putih. Revisi ini mempertahankan perilaku dan model data dari revisi navigasi sebelumnya.