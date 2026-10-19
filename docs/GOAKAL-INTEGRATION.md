# GoAkal → voucher GenZ Preneur (revisi audit 19 Oktober 2026)

Integrasi ini menerima transaksi GoAkal yang sudah lunas, membuat **satu** voucher sekali pakai yang terikat ke email pembeli, lalu mengirim kode voucher lewat Resend. Webhook adalah jalur real-time; endpoint sync memakai External API GoAkal untuk memulihkan transaksi yang webhook-nya terlewat.

> Status: kode lulus tes lokal. **Belum** diuji dengan transaksi GoAkal nyata, belum dideploy, dan tidak menyentuh data produksi. Jangan anggap berjalan di produksi sebelum checklist staging (`docs/STAGING-GOAKAL-CHECKLIST.md`) lolos.

Dokumentasi resmi yang dicocokkan: <https://goakal.com/docs/developer/webhook> dan <https://goakal.com/docs/developer/api> (dibaca 19 Oktober 2026).

## 1. Alur

```
GoAkal (transaction.updated, PAID)
   │  POST /api/goakal/webhook   {event, data:{paymentId, status, user, service, priceScheme…}, token}
   ▼
Verifikasi token → filter service → baca goakalOrders/{sha256(paymentId)}
   ├─ order sudah "issued"  → pakai data TERSIMPAN (plan, kode, email); kirim email hanya bila belum terkirim
   ├─ price scheme "ignore" / service lain / belum lunas → 200, tidak menulis apa pun
   ├─ mapping kosong / email tidak valid → 200 + order "blocked" (dicatat, tanpa voucher)
   └─ baru → Firestore transaction: buat vouchers/{KODE} + goakalOrders/{id} sekaligus
                → Resend (Idempotency-Key per paymentId) → emailStatus "sent"

POST /api/goakal/sync (Bearer GOAKAL_SYNC_SECRET)
   → GET /services/:cuid/transactions?status=PAID dan status=SETTLED (100/halaman)
   → order yang sudah lengkap dilewati; sisanya diproses dengan fungsi yang sama dengan webhook
```

### Jaminan yang dites otomatis

| Kebutuhan | Cara dijamin |
|---|---|
| 1 paymentId = 1 voucher | ID order = hash paymentId; voucher & order dibuat dalam satu Firestore transaction dengan `create()` |
| Voucher sekali pakai | `maxUses: 1`; Rules hanya mengizinkan `uses` naik tepat +1 dan ≤ `maxUses` |
| Terikat email pembeli | `assignedEmail` (huruf kecil); Rules menolak baca & tukar dari email lain |
| Webhook ganda tidak membuat email kedua | status order `sent` + lease pengiriman 90 detik + Idempotency-Key Resend |
| Retry email memakai data lama | email dibangun dari dokumen order, bukan dari payload/mapping terbaru |
| Webhook terlewat | sync membaca status `PAID` **dan** `SETTLED` |
| Tidak bocor | respons publik hanya `{ok,status}`; log memakai email tersamar; error disaring dari token/API key |

## 2. Perubahan dibanding versi awal

1. **Idempotensi webhook ↔ sync diperbaiki.** Versi awal memakai `data.paymentId || data.id`. API transaksi hanya mengenal `paymentId`, jadi fallback ke `data.id` (cuid transaksi) bisa membuat dua order berbeda untuk satu pembayaran. Sekarang `paymentId` wajib; tanpa itu webhook dibalas 400. `data.id` disimpan terpisah sebagai `transactionId`.
2. **Sync membaca `SETTLED`.** API resmi memiliki status `PAID | SETTLED | PENDING | EXPIRED | FAILED`. Transaksi yang dananya sudah dicairkan berpindah ke `SETTLED`; versi awal hanya membaca `PAID` sehingga webhook lama yang terlewat tidak akan pernah ditemukan.
3. **Retry email dari data tersimpan.** Order yang sudah terbit tidak lagi memerlukan mapping terbaru. Jika mapping diubah/dihapus setelah voucher terbit, email tetap berisi paket & kode asli.
4. **Price scheme belum dipetakan / email tidak valid** sekarang dicatat sebagai order `blocked` dan dibalas 200 (tidak memicu retry tanpa akhir). Setelah mapping diperbaiki, jalankan sync → voucher terbit otomatis.
5. **paymentId sama, payload berbeda** (email/price scheme/service lain) → data tersimpan dipertahankan, tidak ada voucher atau email ke alamat baru, konflik dicatat (`conflictCount`, `lastConflictFields`).
6. **Race condition email.** Dua webhook bersamaan kini tidak bisa mengirim dua email: pengiriman di-"klaim" di dalam transaction (lease 90 detik). Resend Idempotency-Key tetap sebagai lapis kedua.
7. **Filter service.** Webhook dari service lain di organisasi GoAkal yang sama diabaikan (bukan dianggap "price scheme belum dipetakan").
8. **Validasi environment variables** dengan pesan jelas (hanya nama variabel, tidak pernah nilainya): kosong, JSON salah, ID bukan format cuid, secret terlalu pendek/sama, `EMAIL_FROM` @gmail.com, `APP_URL` bukan https.
9. **Sync realistis untuk Vercel.** Batas waktu internal 45 detik (function 60 detik), retry 429/5xx dengan `Retry-After`, satu `getAll` per 100 order, dan `resume` untuk melanjutkan. Mode `dry-run` (tanpa menulis) dan `check-config` (mencocokkan mapping dengan GoAkal).
10. **Firebase Admin & Vercel.** `firebase-admin` 14 butuh Node ≥ 22 → `package.json` kini `"engines": {"node": ">=22"}`. Inisialisasi malas & di-cache per instance, `private_key` dengan `\n` didukung, field wajib divalidasi. `vercel.json` menetapkan `maxDuration` 30 dtk (webhook) dan 60 dtk (sync).
11. **Rules:** voucher GoAkal hanya bisa **dibaca** oleh email pembeli & admin (sebelumnya semua orang yang login dan tahu kodenya dapat melihat email pembeli & paymentId). Voucher manual lama tanpa `assignedEmail` tetap terbaca semua peserta. `goakalOrders` dinyatakan eksplisit tertutup untuk browser.
13. **Payload nyata ≠ dokumentasi.** Webhook asli GoAkal (19 Okt 2026) mengirim pembeli di `data.payer` {name, email, phoneNumber}, bukan `data.user`. Keduanya kini didukung.
12. **Email** memakai nama paket resmi (GenZ Spark/Boost/Impact), tanggal kedaluwarsa, versi teks polos, dan warna brand.

## 3. Siapkan GoAkal

1. **Developer → API Keys** → buat key dengan scope `external_api`. Simpan langsung ke Vercel sebagai `GOAKAL_API_KEY`.
2. **School settings → webhook configuration**:
   - Webhook URL (lihat §6).
   - Verification token: buat nilai acak (lihat §4) → isi juga di Vercel sebagai `GOAKAL_WEBHOOK_TOKEN`.
3. Di dashboard service *webinar-b1* → **Enable webhook** (di screenshot sudah *enabled*).
4. ID yang dipakai (dari dashboard; **pastikan dengan tombol salin, bukan diketik ulang**):

| Nama di GoAkal | cuid | Mapping |
|---|---|---|
| Service / Landing Page | `cmvaf1zib0000l006kjpdm8x4` | `GOAKAL_SERVICE_IDS` |
| Webinar Only | `cmvanoylm000vlb0665cgbtq8` | `ignore` |
| GenZ Spark | `cmvanoyn8000xlb06lfpbcjzs` ⚠️ | `spark` |
| GENZ BOOST | `cmvanoynx000zlb06tcftyfdw` | `boost` |
| GENZ IMPACT | `cmvanoyon0011lb06e9t9qw43` ⚠️ | `impact` |

⚠️ Di screenshot, huruf `l` dan angka `1` tidak bisa dibedakan dengan pasti untuk Spark (`…lb06lfpb…` vs `…lb06 1fpb…`) dan Impact (`…0011lb06…`). Setelah deploy, jalankan **check-config** (§7). Jika ada ID salah, respons akan menampilkannya di `unknownMapKeys` dan ID yang benar di `unmapped`.

## 4. Environment variables di Vercel

Vercel → Project → **Settings → Environment Variables**. Isi untuk **Preview** dulu (staging), lalu **Production** setelah lolos. Centang *Sensitive* untuk semua secret. Jangan pernah memberi prefix `VITE_` — prefix itu membuat nilai ikut ke browser.

| Variabel | Isi | Rahasia? |
|---|---|---|
| `GOAKAL_API_KEY` | API key GoAkal scope external_api | Ya |
| `GOAKAL_WEBHOOK_TOKEN` | nilai acak ≥ 24 karakter, sama dengan di GoAkal | Ya |
| `GOAKAL_SYNC_SECRET` | nilai acak ≥ 24 karakter, **berbeda** dari token webhook | Ya |
| `VOUCHER_CODE_SECRET` | nilai acak ≥ 32 karakter; **jangan diganti** setelah voucher pertama terbit | Ya |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | isi file JSON service account (utuh) | Ya |
| `RESEND_API_KEY` | API key Resend | Ya |
| `GOAKAL_PRICE_MAP` | JSON satu baris (lihat `.env.example`) | Tidak |
| `GOAKAL_SERVICE_IDS` | `cmvaf1zib0000l006kjpdm8x4` | Tidak |
| `EMAIL_FROM` | `GenZ Preneur <akses@domain-terverifikasi>` | Tidak |
| `APP_URL` | URL aplikasi, tanpa `/` di akhir (Preview: URL preview; Production: domain utama) | Tidak |
| `VOUCHER_VALID_DAYS` | `30` (opsional) | Tidak |

**Membuat nilai acak** (di komputer sendiri, hasilnya langsung ditempel ke Vercel, jangan dikirim lewat chat):

PowerShell (Windows):
```powershell
$b = New-Object byte[] 36; [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($b); [Convert]::ToBase64String($b).Replace('+','-').Replace('/','_')
```
Node.js:
```bash
node -e "console.log(require('crypto').randomBytes(36).toString('base64url'))"
```
Jalankan tiga kali: untuk `GOAKAL_WEBHOOK_TOKEN`, `GOAKAL_SYNC_SECRET`, `VOUCHER_CODE_SECRET`.

**Service account Firebase:** Firebase Console → ⚙ Project settings → Service accounts → *Generate new private key* → buka file JSON dengan Notepad → salin semua isinya → tempel sebagai nilai `FIREBASE_SERVICE_ACCOUNT_JSON`. Setelah tersimpan di Vercel, hapus file JSON dari folder Downloads. Jangan taruh di folder proyek/GitHub.

Setelah menambah/mengubah variabel, **redeploy** agar nilai baru terbaca.

## 5. Siapkan email (Resend)

1. Resend → Domains → tambahkan domain (mis. `genzpreneur.id`) → pasang record DNS sampai *Verified*.
2. Resend → API Keys → buat key *Sending access* → simpan ke Vercel.
3. `EMAIL_FROM` harus memakai domain yang terverifikasi itu.

## 6. URL webhook

- Produksi: `https://genzpreneur-id.vercel.app/api/goakal/webhook` (ganti dengan domain custom bila sudah dipakai, mis. `https://app.genzpreneur.id/api/goakal/webhook`).
- Staging (Preview): `https://<url-preview>.vercel.app/api/goakal/webhook`.
  Bila Preview dilindungi *Vercel Authentication* (default), GoAkal akan mendapat 401 dari Vercel. Aktifkan **Settings → Deployment Protection → Protection Bypass for Automation**, lalu pakai
  `https://<url-preview>.vercel.app/api/goakal/webhook?x-vercel-protection-bypass=<BYPASS_SECRET>`.

⚠️ URL webhook GoAkal diatur di tingkat organisasi (*school settings*), jadi hanya satu URL aktif. Selama URL diarahkan ke staging, pembelian asli juga masuk ke staging. Lakukan uji staging di jam sepi, kembalikan URL ke produksi, lalu jalankan sync di produksi untuk menangkap transaksi yang sempat lewat staging.

## 7. Endpoint sync & pemeriksaan

PowerShell:
```powershell
$h = @{ Authorization = "Bearer $env:GZP_SYNC" }   # isi $env:GZP_SYNC dulu: $env:GZP_SYNC = Read-Host
# 1) Cocokkan mapping dengan GoAkal (read-only)
Invoke-RestMethod -Method Post -Uri https://DOMAIN/api/goakal/sync -Headers $h -ContentType 'application/json' -Body '{"mode":"check-config"}' | ConvertTo-Json -Depth 6
# 2) Lihat apa yang akan diproses tanpa menulis apa pun
Invoke-RestMethod -Method Post -Uri https://DOMAIN/api/goakal/sync -Headers $h -ContentType 'application/json' -Body '{"mode":"dry-run"}' | ConvertTo-Json -Depth 6
# 3) Sinkronisasi sungguhan
Invoke-RestMethod -Method Post -Uri https://DOMAIN/api/goakal/sync -Headers $h -ContentType 'application/json' -Body '{}' | ConvertTo-Json -Depth 6
```
curl:
```bash
curl -X POST https://DOMAIN/api/goakal/sync -H "Authorization: Bearer $GZP_SYNC" -H "Content-Type: application/json" -d '{"mode":"check-config"}'
```
Untuk Preview yang dilindungi, tambahkan header `x-vercel-protection-bypass: <BYPASS_SECRET>`.

Jika respons `"complete": false`, kirim ulang dengan body `{"resume": <nilai resume dari respons>}` sampai `complete: true`.

Arti ringkasan: `sent` (email baru terkirim), `skippedComplete` (sudah beres sebelumnya), `blocked` (butuh mapping/email), `failed` (error sementara—ulangi), `conflicts` (payload beda untuk paymentId sama), `ignored` (webinar only/service lain).

## 8. Data di Firestore

`goakalOrders/{sha256(paymentId)}` — hanya Admin SDK:

| Field | Arti |
|---|---|
| `state` | `issued` (voucher terbit) · `blocked` (butuh tindakan) · `ignored` |
| `blockReason` | `price_scheme_belum_dipetakan` · `email_pembeli_tidak_valid` · `price_scheme_kosong` |
| `emailStatus` | `sending` · `sent` · `failed` |
| `lastEmailError` | pesan singkat tanpa secret/email lengkap |
| `voucherCode`, `plan`, `voucherExpiresAtMs` | sumber kebenaran untuk retry email |
| `conflictCount`, `lastConflictFields` | payload berbeda untuk paymentId yang sama |

Jangan menghapus `goakalOrders`: koleksi ini adalah kunci idempotensi. Menghapus satu dokumen tidak membuat voucher ganda (kode deterministik per paymentId), tetapi bisa memicu email ulang.

**Menangani order `blocked` karena email tidak valid:** pembeli perlu dihubungi manual; buat voucher lewat Admin → Voucher seperti biasa.

## 9. Batasan yang masih ada

- Token webhook GoAkal dikirim di body (bukan tanda tangan HMAC). Siapa pun yang tahu token bisa memalsukan webhook. Jaga token, ganti bila bocor. Pemeriksaan silang ke API per webhook tidak dilakukan karena API tidak punya endpoint transaksi tunggal dan dibatasi 100 permintaan/menit.
- Urutan data API transaksi tidak didokumentasikan; transaksi baru yang masuk saat sync berjalan bisa menggeser halaman. Panggil sync lagi — yang sudah beres otomatis dilewati.
- Kebijakan retry GoAkal (berapa kali, jeda) tidak didokumentasikan. Jangan andalkan retry; jadwalkan sync berkala.
- Masa berlaku voucher dihitung sejak voucher terbit (bukan sejak pembayaran).
- Jika `VOUCHER_CODE_SECRET` diganti setelah ada voucher terbit, order lama tetap aman (kode diambil dari order), tetapi order yang dokumennya hilang akan mendapat kode baru.
- Firestore Rules emulator belum dijalankan di lingkungan pembuatan revisi ini (unduhan emulator diblokir). Wajib dijalankan di komputer ber-Java sebelum publish.
