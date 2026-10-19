# Checklist staging GoAkal → voucher

Tujuan: membuktikan integrasi bekerja dengan transaksi nyata **sebelum** dipakai pembeli. Isi kolom ✅/❌ dan catatan. Tidak ada langkah di sini yang boleh memakai data produksi.

## 0. Persiapan (sekali)

- [ ] **Firebase staging terpisah** (disarankan): buat proyek mis. `genzpreneur-staging`, aktifkan Auth email link + Firestore. Di Vercel **Preview** isi `VITE_FIREBASE_*` proyek staging dan `FIREBASE_SERVICE_ACCOUNT_JSON` staging. Tanpa ini, uji Preview akan menulis ke Firestore produksi.
- [ ] `firebase deploy --only firestore:rules --project genzpreneur-staging` (lihat BACA-DULU).
- [ ] Semua env var Preview terisi (docs/GOAKAL-INTEGRATION.md §4). `APP_URL` = URL Preview.
- [ ] Deployment Protection: aktifkan *Protection Bypass for Automation* dan catat secret-nya.
- [ ] Deploy Preview berstatus **Ready**.
- [ ] `check-config` → `ok: true`, `unknownMapKeys: []`, `unmapped: []` (selain price scheme yang memang mau diabaikan, yang harus dipetakan `ignore`).
- [ ] `dry-run` → catat jumlah `wouldProcess` (transaksi lama yang akan diproses saat sync pertama). Jika > 0 dan itu transaksi asli, putuskan dulu: apakah pembeli lama memang harus menerima voucher?
- [ ] Siapkan 2 alamat email uji milik sendiri: **A** (pembeli) dan **B** (penyusup).
- [ ] Jam sepi dipilih; URL webhook organisasi GoAkal diarahkan ke Preview (`…/api/goakal/webhook?x-vercel-protection-bypass=…`).

Cara melihat hasil: Firebase Console (staging) → Firestore → `goakalOrders` dan `vouchers`; Vercel → Deployment → **Logs** (filter `goakal`); Resend → **Emails**.

## Skenario

| # | Skenario | Langkah | Hasil yang diharapkan | ✅/❌ |
|---|---|---|---|---|
| 1 | Satu transaksi PAID | Beli paket termurah (Spark) di GoAkal memakai email A. | Log: `status: 'sent'`. Firestore: 1 dok `goakalOrders` (`state: issued`, `emailStatus: sent`), 1 dok `vouchers` `SPARK-…` (`maxUses 1`, `uses 0`, `assignedEmail` = A huruf kecil, `source goakal`, `expiresAt` +30 hari). | |
| 2 | Webhook duplikat | Bila GoAkal menyediakan tombol kirim ulang, pakai itu. Jika tidak: ulangi lewat sync (#9). | Respons `already_sent`; tetap 1 order, 1 voucher; Resend tetap 1 email. | |
| 3 | Email Resend berhasil | Buka inbox A. | Ada nama paket, kode, tombol **Aktifkan akses** → `/voucher?code=KODE`, instruksi masuk memakai email A. Cek juga folder spam. | |
| 4 | Resend gagal lalu retry | Di Preview, ubah sementara `RESEND_API_KEY` ke nilai salah → redeploy → beli transaksi kedua (email A) → kembalikan key benar → redeploy → jalankan sync. | Webhook pertama 500; order `emailStatus: failed` + `lastEmailError` tanpa key. Voucher sudah ada. Setelah sync: `sent: 1`, tetap 1 voucher untuk transaksi itu, email isinya sama. | |
| 5 | Price Scheme belum dipetakan | Hapus sementara satu entri dari `GOAKAL_PRICE_MAP` (mis. Spark) → redeploy → beli Spark → kembalikan mapping → redeploy → sync. | Webhook 200 `blocked`; order `state: blocked`, `blockReason: price_scheme_belum_dipetakan`, tanpa voucher. Setelah sync: voucher terbit, email terkirim, `blockReason` hilang. | |
| 6 | Email pembeli kosong/tidak valid | Biasanya dicegah form GoAkal. Uji otomatis sudah mencakup (`goakal-flow.test.js`). Bila memungkinkan, coba checkout dengan email aneh. | Order `blocked` + `email_pembeli_tidak_valid`; tanpa voucher/email. Admin menghubungi pembeli manual. | |
| 7 | paymentId sama, payload berbeda | Tidak bisa dibuat lewat GoAkal; tercakup tes otomatis. Opsional: kirim POST manual ke webhook Preview dengan token benar, `paymentId` transaksi #1 tetapi email B. | 200 `already_sent`; voucher tetap milik A; tidak ada email ke B; order mencatat `conflictCount: 1`, `lastConflictFields`. | |
| 8 | Voucher dipakai email berbeda | Buka link voucher dari email A, tapi masuk memakai email B. | Pesan “Voucher ini hanya bisa dipakai dengan email yang digunakan saat membeli di GoAkal.” `uses` tetap 0. Lalu masuk dengan A → berhasil, paket aktif, `uses: 1`. Coba tukar lagi (akun lain, email A) → ditolak. | |
| 9 | Sync dipanggil dua kali | Jalankan sync normal dua kali berturut-turut. | Panggilan ke-2: `sent: 0`, `skippedComplete` = jumlah transaksi lunas yang dipetakan; tidak ada email baru di Resend. | |
| 10 | Webhook terlewat, ditemukan sync | Matikan sementara webhook service di GoAkal (atau isi URL webhook dengan alamat salah) → beli transaksi → pastikan tidak ada order → nyalakan lagi → sync. | Sync: `sent: 1`; 1 voucher & 1 email untuk transaksi tersebut. | |

## Tambahan

- [ ] Voucher manual lama (dibuat dari Admin → Voucher, tanpa email) masih bisa ditukar peserta mana pun.
- [ ] Peserta lama: progress, membership, dan redemption lama tidak berubah setelah deploy.
- [ ] Respons webhook/sync dan log Vercel tidak memuat API key, token, service account, atau email lengkap.
- [ ] Setelah selesai: kembalikan URL webhook GoAkal ke produksi, kembalikan semua env Preview yang diubah, jalankan `dry-run` lalu sync di **produksi** untuk transaksi yang sempat masuk ke staging.

## Kriteria lulus

Semua 10 skenario ✅ → boleh mengulang env vars, Rules, dan deploy di Production, lalu lakukan 1 transaksi produksi (skenario 1 + 3 + 8) sebagai uji akhir.
