# Kondisi Awal dan titik masuk peserta — 19 Oktober 2026

Revisi disiapkan untuk ditinjau. Tidak ada deploy, perubahan akun atau perubahan data produksi.

## Temuan audit sebelum perubahan

| Area dan rujukan sumber | Sudah tersedia | Kekurangan yang ditangani |
|---|---|---|
| `src/lib/assessment.ts:44`, `src/pages/AssessmentPage.tsx` | Assessment berbobot untuk industri, jalur dan profil; hasil disimpan melalui `assessments/{uid}`. | Tidak mengukur kemampuan menyelesaikan bantuan kecil. Algoritme dan jawaban minat tidak diubah atau dipakai untuk menentukan kesiapan. |
| `src/auth/guards.tsx:14`, `src/main.tsx:60`, `src/pages/AuthPages.tsx` | Masuk lewat akun berundang/voucher, rute aplikasi terlindungi autentikasi; pengguna masuk ke Dashboard. | Belum ada pemetaan kondisi kerja yang terpisah. Tidak ditambahkan redirect wajib atau prasyarat profil baru. |
| `src/pages/MissionPage.tsx`, `src/lib/mission.ts` | Sembilan tahap bebas dipilih, draf teks/tautan, centang mandiri dan ekspor; catatan lama tetap ada. | Tahap pertama yang belum dicentang belum tentu titik masuk paling relevan. Belum ada pemeriksaan singkat bekal tahap lanjutan. |
| `src/pages/Dashboard.tsx` | Fokus Misi, materi, alat dan tautan refleksi. | Saran fokus belum memakai kondisi awal yang dinyatakan peserta. |
| `src/lib/data.ts:253`, `firestore.rules:190` | Progres memuat lessons, plan.tasks dan plan.notes. Pemilik akun menulis dengan merge; pemilik/admin membaca. | Struktur ini bisa dipakai ulang untuk satu catatan pemetaan tanpa koleksi baru atau migrasi. |
| `src/pages/admin/AdminMembers.tsx`, `src/lib/roles.ts` | Daftar akun/paket dan peran admin/owner. | Tidak ditemukan alur review artefak dengan catatan peninjau dan timestamp yang dapat menjadi bukti telah ditinjau. Peran mentor saja bukan akses baca progres peserta lain. |

Tidak ditemukan AGENTS.md pada jalur induk workspace/proyek dan direktori sumber yang diperiksa. Stack terverifikasi dari package.json dan sumber: React, Vite, Firebase; konfigurasi Vercel tersedia. Tidak menyimpulkan deployment produksi telah menjalankan versi lokal ini.

## Perubahan minimum

1. Halaman `/app/kondisi-awal` yang opsional, empat bagian singkat. Draf sebagian dan jawaban belum tahu dapat disimpan lalu dibuka kembali. Peserta lama bisa langsung melanjutkan Misi.
2. Data minimum: tujuan, skill, pekerjaan yang bisa dikerjakan, keyakinan saat ini, penerima/masalah, contoh opsional dan relevansinya, status penawaran, pengalaman dan keterkaitannya, waktu/perangkat/kendala.
3. Tidak ada upload file, permintaan pendapatan, agama, identitas pelanggan atau panggilan AI. Contoh boleh fiktif/publik dengan sumber. Tautan ditampilkan sebagai teks, tidak diambil atau dinilai otomatis.
4. Enam kebutuhan ditampilkan terpisah: kemampuan kerja, masalah/penerima, contoh, penawaran, pengalaman mencoba, dan kendala. Hasil juga menjelaskan bekal yang disebutkan, yang belum jelas, alasan saran dan satu pekerjaan berikutnya.
5. Peserta boleh mengubah jawaban, memilih tahap manual, atau kembali ke saran aturan. Pilihan manual tidak menyelesaikan tahap lain. Mengubah jawaban menghapus pilihan manual pada catatan pemetaan agar saran dihitung ulang; draf dan centang Misi tetap utuh.
6. Dashboard dan pembukaan Misi mengutamakan pilihan tahap yang sengaja disimpan. Tanpa pilihan manual, draf Misi yang sudah ada dilanjutkan dahulu. Tanpa pekerjaan lama, dipakai saran dari Kondisi Awal. Tanpa pemetaan, perilaku awal tetap tersedia.
7. Tahap Misi lanjutan mempunyai bagian “Cek singkat bekal untuk tahap ini”: keluaran yang perlu dibawa, status ada/belum ada draf, dan tautan melengkapinya. Hasil kerja dari luar aplikasi boleh diringkas pada tahap sekarang, tanpa memaksa ulang semua tahap.
8. Daftar peserta admin menggunakan komponen ringkasan baca yang sama. Data hanya diminta saat admin membuka satu peserta; tidak memuat seluruh progres sekaligus. Membuka ringkasan tidak membuat status review.

## Aturan rekomendasi versi 1

Tidak ada AI, skor kepribadian, persentase kesiapan atau peluang sukses. Sumbernya adalah laporan peserta, bukan pengujian skill.

| Kondisi | Saran utama |
|---|---|
| A: belum dapat menyebut pekerjaan kecil atau belum yakin mengerjakannya | Bekal/latihan dan contoh sederhana. Business 101 ditautkan sebagai pengenalan nilai bantuan, dengan penjelasan bahwa ini bukan pelatihan skill teknis dari nol. |
| B: bisa menyebut pekerjaan, penerima/masalah belum jelas | Pilih masalah, kemudian tentukan bantuan kecil. |
| C: penerima/masalah jelas, contoh relevan belum tersedia | Buat atau periksa contoh yang relevan. |
| D: contoh relevan dilaporkan tersedia | Cakupan, penawaran dan harga; bila penawaran juga dilaporkan siap, pemeriksaan penawaran dan pendekatan personal. |
| E: pernah mencoba menawarkan/mengerjakan bantuan yang sama | Evaluasi aktivitas dan respons faktual, termasuk penolakan/nonrespons, lalu tentukan perbaikan. Pengalaman pada bantuan lain tidak otomatis menentukan tahap ini. |

Jika informasi penting belum jelas atau bertentangan—misalnya belum pernah tetapi mengaku pengalaman terkait, contoh belum ada tetapi disebut relevan, atau pengalaman lama tidak selaras dengan kemampuan saat ini—hasil diberi bahasa sementara dan satu pertanyaan klarifikasi. Tombol membawa peserta ke bagian jawaban yang relevan. Tidak perlu menyelesaikan klarifikasi sebagai syarat mengakses Misi.

Teks seperti “belum tahu”, “belum ada”, “belum pernah”, tanda tanya atau tanda hubung tidak dianggap deskripsi pekerjaan/masalah yang jelas. Ini pemeriksaan sederhana terhadap teks dan pilihan jawaban, bukan validasi makna yang canggih. Pernyataan “bisa” tetap perlu dibuktikan dalam pekerjaan nyata.

Contoh tanpa teks/tautan tetap boleh dilaporkan tersedia; status itu tidak disamakan dengan contoh yang disediakan untuk dibaca. Jika teks/tautan disediakan, tampil sebagai contoh yang belum diperiksa. Tidak ada status “ditinjau mentor” karena belum ada bukti review yang sah dalam implementasi ini.

## Penyimpanan dan batas akses

Catatan disimpan sebagai JSON pada `progress/{uid}.plan.notes.entry-map-v1`, dengan `questionVersion: 1`, `ruleVersion: 1`, jawaban serta `selectedStage`. Progres Misi tetap memakai key work-v1-*; catatan tujuh hari tetap d1–d7. API saveEntry hanya mengirim satu key pemetaan dengan setDoc merge:true, bukan mengganti map progres.

Validasi klien memakai Zod, batas panjang dan daftar nilai yang diizinkan. Format/versi tak dikenal tidak ditimpa oleh form ini. Validasi tersebut bukan kontrol akses server atau jaminan isi catatan bebas data sensitif. Rules yang sudah ada mengizinkan teks catatan umum dan tidak memvalidasi semantik JSON pemetaan secara khusus.

Kontrol akses tetap di Firestore Rules: pemilik yang merupakan member dapat menulis progres sendiri; pemilik serta admin/owner dapat membaca; peserta lain, mentor biasa dan anonim tidak mendapat baca progres tersebut. Admin tidak bisa menulis progres orang lain. Penjagaan UI dan RequireRole hanya melengkapi aturan server, bukan menggantikannya. Tidak ada perluasan peran maupun pengiriman data ke Heybinder.

## Daftar perubahan sumber

Baru:

- `src/lib/entry.ts`: skema versi, serialisasi, enam dimensi, aturan A–E, prioritas melanjutkan pekerjaan dan bekal tahap.
- `src/content/entryQuestions.ts`: empat bagian pertanyaan dan pilihan belum tahu/belum pernah.
- `src/pages/EntryPage.tsx`: isi, simpan, lanjutkan, lihat saran, klarifikasi dan pilih titik masuk manual.
- `src/components/EntrySummary.tsx`: ringkasan peserta/admin tanpa status review palsu.
- `src/components/AdminEntrySummary.tsx`: baca progres satu peserta atas tindakan admin.
- `src/lib/entry.test.ts`, `src/pages/EntryPage.test.tsx`, `src/components/AdminEntrySummary.test.tsx`: tes baru.

Diubah:

- `src/lib/data.ts`, `src/main.tsx`: simpan dengan merge dan rute autentikasi.
- `src/pages/Dashboard.tsx`, `src/pages/MissionPage.tsx`: saran/pilihan titik masuk, kelanjutan pekerjaan dan cek bekal.
- `src/pages/AssessmentPage.tsx`: memperjelas eksplorasi minat terpisah dari kesiapan kerja.
- `src/pages/admin/AdminMembers.tsx`: ringkasan baca pada peserta yang sudah memiliki akun.
- `src/components/AppLayout.tsx`: tautan Kondisi Awal.
- `src/lib/missionPersistence.test.ts`, `tests/firestore.rules.test.ts`: tes payload merge dan skenario akses/progres lama.

ZIP ini juga membawa perubahan logo resmi dan sidebar ☰ yang sebelumnya dikerjakan lokal tetapi belum masuk ZIP Misi Pertama. Aset logo asli disertakan, komponen Logo digunakan bersama, sidebar desktop bisa disembunyikan tanpa menyisakan kolom dan preferensinya disimpan di browser. Browser memeriksa buka/tutup serta inert pada sidebar tersembunyi. Fitur ini tidak terkait aturan rekomendasi.

## Verifikasi dan batasnya

Tes aplikasi mencakup A–E, jawaban tidak tahu, contoh opsional, pertentangan, versi tak dikenal, simpan/muat ulang melalui remount dengan mock, error simpan, perubahan jawaban/pilihan, kelanjutan pekerjaan lama, bentuk payload merge serta penjagaan UI admin/mentor.

Browser lokal memakai fixture yang jelas berlabel DATA CONTOH LOKAL. Diuji: skill ada tetapi masalah belum jelas → saran tahap masalah; simpan dan ubah jawaban; memilih contoh sebagai titik masuk → Misi tahap contoh dengan semua tahap lain masih kosong; tampilan desktop dan HP 390 × 844 tanpa overflow horizontal pada halaman yang diperiksa; Tab dari tujuan ke skill; tombol sidebar tutup/buka dan kolom tertutup menjadi nol. Ini bukan bukti auth/Firestore produksi berfungsi.

Tes emulator akses antar-akun/admin telah ditambahkan, termasuk pemeriksaan catatan lama tetap utuh sesudah merge. Percobaan menjalankan `npm run test:rules` terhenti sebelum tes karena Java tidak tersedia. Upaya memperoleh runtime portable resmi juga ditolak HTTP 403. Karena itu akses lintas akun dan merge belum diuji terhadap server emulator dalam sesi ini; kesimpulan akses berasal dari pembacaan Rules, bukan klaim tes emulator lulus. Jalankan tes emulator di lingkungan yang mempunyai Java sebelum rilis produksi. Tidak perlu memberi akses akun produksi untuk pemeriksaan tersebut.

Hasil akhir typecheck, seluruh tes aplikasi dan build dicatat pada BACA-DULU.txt/PANDUAN-KONDISI-AWAL.txt. Firestore Rules, dependency dan konfigurasi Firebase tidak diubah. Peringatan bundle besar tetap perlu ditangani terpisah.

## Keterbatasan dan keputusan yang masih perlu diuji

- Saran tidak mengesahkan kemampuan, relevansi kebutuhan atau kualitas contoh. Uji dengan beberapa peserta apakah alasan saran dan langkah berikutnya dipahami.
- Tidak ada review personal, waktu respons, pemantauan mentor atau integrasi AI baru. Jika nantinya perlu status review, harus ada identitas peninjau, bukti dan aturan akses yang dirancang terpisah.
- Penyimpanan dilakukan saat tombol Simpan ditekan. Ada peringatan saat meninggalkan lewat tautan atau menutup/memuat ulang halaman; belum ada dialog khusus untuk Back/Forward SPA. Simpan sebelum menggunakannya. Tidak ada autosave/offline draft.
- Catatan menyimpan satu versi kondisi terbaru. Riwayat perubahan, deteksi konflik edit dua perangkat dan analitik tidak ditambahkan.
- Rekomendasi A mengungkap kekurangan produk yang nyata: tidak ada janji pelatihan skill teknis lengkap. Tentukan kelak apakah kurasi sumber atau latihan teknis dibutuhkan berdasarkan kebuntuan peserta.
- Empat bagian boleh diisi tidak berurutan. Ukur beban pengisian dalam pilot; jika peserta hanya mengejar kelengkapan, sederhanakan pertanyaan, jangan menambah skor.
- Periksa akun uji pada deployment staging setelah tes emulator tersedia. Revisi ini belum diunggah atau dideploy ke produksi.
