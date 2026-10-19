# GoAkal → voucher GenZ Preneur

Integrasi ini menerima transaksi GoAkal berstatus `PAID`, membuat satu voucher yang terikat ke email pembeli, lalu mengirim email voucher melalui Resend. Webhook adalah jalur real-time. Endpoint sinkronisasi memakai External API GoAkal untuk memulihkan transaksi bila webhook pernah gagal.

## Alur

1. GoAkal mengirim `transaction.updated` berstatus `PAID` ke `/api/goakal/webhook`.
2. Server memverifikasi `token` webhook dan memetakan `priceScheme.id` ke Spark, Boost, atau Impact.
3. Firestore transaction membuat `goakalOrders/{hashPaymentId}` dan `vouchers/{code}` secara atomik.
4. Resend mengirim kode serta link `/voucher?code=...` ke email pembeli.
5. Webhook duplikat memakai order dan kode yang sama. Email menggunakan idempotency key berdasarkan `paymentId`.
6. Peserta masuk memakai email pembelian. Firestore Rules menolak penukaran dari email lain.

Koleksi `goakalOrders` hanya ditulis lewat Firebase Admin SDK dan tetap tertutup bagi browser oleh default-deny Rules.

## 1. Siapkan GoAkal

1. Dashboard GoAkal → **Developer → API Keys**.
2. Buat key dengan scope `external_api`. Simpan sebagai `GOAKAL_API_KEY` di Vercel, jangan di file frontend dan jangan memakai prefix `VITE_`.
3. Catat `cuid` service dan `cuid` setiap price scheme dari External API atau dashboard.
4. School settings → webhook configuration: buat verification token acak.
5. URL webhook produksi: `https://DOMAIN-ANDA/api/goakal/webhook`.
6. Isi token yang sama sebagai `GOAKAL_WEBHOOK_TOKEN` di Vercel.
7. Aktifkan webhook pada service GenZ Preneur yang menerima pembayaran.

Dokumentasi resmi: <https://goakal.com/docs/developer/webhook> dan <https://goakal.com/docs/developer/api>.

## 2. Siapkan email

Integrasi memakai Resend API langsung, tanpa SDK tambahan.

1. Verifikasi domain pengirim di Resend.
2. Buat API key dan simpan sebagai `RESEND_API_KEY`.
3. Atur `EMAIL_FROM`, contoh `GenZ Preneur <akses@genzpreneur.id>`.
4. Jangan memakai alamat `@gmail.com` sebagai sender produksi. Pakai domain yang sudah diverifikasi.

## 3. Siapkan Firebase Admin

1. Firebase Console → Project settings → Service accounts → Generate new private key.
2. Simpan seluruh JSON sebagai satu environment variable `FIREBASE_SERVICE_ACCOUNT_JSON` di Vercel.
3. Jangan commit JSON tersebut. Service account memberi akses server penuh ke Firestore.

## 4. Environment variables Vercel

```text
GOAKAL_API_KEY=ak_...
GOAKAL_WEBHOOK_TOKEN=rahasia-webhook-yang-panjang
GOAKAL_PRICE_MAP={"cmvanoylm000vlb0665cgbtq8":"ignore","cmvanoyn8000xlb06lfpbcjzs":"spark","cmvanoynx000zlb06tcftyfdw":"boost","cmvanoyon0011lb06e9t9qw43":"impact"}
GOAKAL_SERVICE_IDS=cmvaf1zib0000l006kjpdm8x4
VOUCHER_CODE_SECRET=rahasia-acak-minimal-24-karakter
GOAKAL_SYNC_SECRET=rahasia-sync-yang-berbeda
FIREBASE_SERVICE_ACCOUNT_JSON={...}
RESEND_API_KEY=re_...
EMAIL_FROM=GenZ Preneur <akses@domain-anda.id>
APP_URL=https://genzpreneur-id.vercel.app
VOUCHER_VALID_DAYS=30
```

Gunakan ID price scheme, bukan judul paket. Judul dapat diubah di GoAkal; ID menjadi pengenal yang stabil. Nilai `ignore` dipakai untuk **webinar only**, sehingga transaksi tersebut dilewati tanpa membuat voucher aplikasi dan tanpa memicu retry webhook.

## 5. Publish dan tes staging

Perubahan ini menyentuh `firestore.rules`, jadi rules wajib dipublish sebelum integrasi produksi digunakan:

```bash
firebase deploy --only firestore:rules
```

Setelah source di-push ke GitHub dan preview Vercel selesai:

1. Isi environment variables pada Preview.
2. Arahkan webhook GoAkal test ke URL preview yang bisa diakses GoAkal.
3. Lakukan satu pembayaran uji paket termurah.
4. Pastikan tepat satu dokumen `goakalOrders`, satu voucher `maxUses: 1`, dan satu email diterima.
5. Kirim ulang payload yang sama. Pastikan tidak membuat voucher atau email baru.
6. Masuk dengan email berbeda dan pastikan voucher ditolak; masuk dengan email pembelian dan pastikan berhasil.
7. Setelah lolos, salin variables ke Production dan gunakan URL produksi.

## 6. Sinkronisasi transaksi yang terlewat

Panggil endpoint ini dari terminal admin atau scheduler server tepercaya:

```bash
curl -X POST https://DOMAIN-ANDA/api/goakal/sync \
  -H "Authorization: Bearer NILAI_GOAKAL_SYNC_SECRET"
```

Endpoint membaca transaksi `PAID` untuk seluruh `GOAKAL_SERVICE_IDS`. Transaksi yang sudah diproses dilewati. Jangan memanggil endpoint ini dari browser atau menyimpan secret di source.

## Batasan operasional

- Email transaksi bergantung pada Resend dan domain pengirim yang sudah diverifikasi.
- Sinkronisasi mengambil maksimal 2.000 transaksi per service per eksekusi (20 halaman × 100).
- Jika price scheme belum ada di `GOAKAL_PRICE_MAP`, transaksi tidak dipenuhi sampai mapping diperbaiki lalu webhook/sync diulang.
- Voucher kedaluwarsa sesuai `VOUCHER_VALID_DAYS`, default 30 hari.
- Jangan menghapus `goakalOrders`; koleksi itu adalah kunci idempotensi dan jejak pemenuhan voucher.

