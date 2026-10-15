# Panduan Setup & Deploy (langkah demi langkah)

Total waktu ± 45–60 menit untuk pertama kali. Tidak perlu kartu kredit.

## A. Yang perlu disiapkan
1. Akun Google (untuk Firebase).
2. Akun GitHub dan Vercel (login Vercel pakai GitHub).
3. **Node.js versi 20 atau lebih baru** di laptop → unduh di nodejs.org (pilih "LTS").
4. (Opsional, untuk menguji Security Rules) **Java 11+** → unduh "Temurin" di adoptium.net.

Cek di Terminal/Command Prompt:
```bash
node -v    # harus v20 ke atas
```

## B. Buat proyek Firebase
1. Buka console.firebase.google.com → **Add project** → nama: `genz-preneur-os` → Analytics boleh dimatikan.
2. Menu **Build → Authentication → Get started → Sign-in method → Email/Password → Enable → Save**.
3. Menu **Build → Firestore Database → Create database** → mode **Production** → lokasi **asia-southeast2 (Jakarta)**. Lokasi tidak bisa diubah setelah dibuat.
4. **Project settings (ikon gerigi) → General → Your apps → ikon `</>` (Web)** → nama app bebas → **Register**. Salin nilai `firebaseConfig`.
5. Authentication → **Settings → Authorized domains** → nanti tambahkan domain Vercel kamu (langkah E).

## C. Jalankan di laptop
```bash
cd genz-preneur-os
npm install                 # unduh semua library (sekali saja)
cp .env.example .env.local  # Windows: copy .env.example .env.local
```
Buka `.env.local`, isi 6 nilai dari `firebaseConfig`:
| Di firebaseConfig | Di .env.local |
|---|---|
| apiKey | VITE_FIREBASE_API_KEY |
| authDomain | VITE_FIREBASE_AUTH_DOMAIN |
| projectId | VITE_FIREBASE_PROJECT_ID |
| storageBucket | VITE_FIREBASE_STORAGE_BUCKET |
| messagingSenderId | VITE_FIREBASE_MESSAGING_SENDER_ID |
| appId | VITE_FIREBASE_APP_ID |

Lalu:
```bash
npm run dev
```
Buka alamat yang muncul (biasanya http://localhost:5173).

## D. Pasang Security Rules (WAJIB sebelum ada user sungguhan)
```bash
npx firebase login
npx firebase use --add          # pilih proyek genz-preneur-os
npx firebase deploy --only firestore:rules
```
Tanpa langkah ini database tertutup total (mode Production) dan aplikasi akan gagal menyimpan data.

## E. Jadikan dirimu Super Admin (sekali saja)
Karena aturan keamanan melarang siapa pun menaikkan role sendiri, Super Admin pertama dibuat manual:
1. Daftar akun di aplikasi seperti user biasa.
2. Firebase Console → Firestore → koleksi `users` → klik dokumen dengan email kamu.
3. Ubah field `role` dari `user` menjadi `owner` → Update.
4. Muat ulang aplikasi → menu **Command Center** muncul.

## F. Deploy ke Vercel
1. Upload folder proyek ke repo GitHub baru (privat), misalnya `genz-preneur-os`. Pastikan `.env.local` **tidak** ikut (sudah diatur `.gitignore`).
2. vercel.com → **Add New → Project** → pilih repo → Framework: **Vite** (terdeteksi otomatis).
3. **Environment Variables** → masukkan 6 variabel `VITE_FIREBASE_*` yang sama.
4. **Deploy**. Setelah selesai, salin domain (mis. `genz-preneur-os.vercel.app`) → tambahkan di Firebase **Authentication → Settings → Authorized domains**.

Setiap kali kamu push ke GitHub, Vercel otomatis deploy ulang.

## G. Perintah yang berguna
| Perintah | Fungsi |
|---|---|
| `npm run dev` | Jalankan di laptop |
| `npm test` | Unit test |
| `npm run test:rules` | Uji Security Rules di emulator (butuh Java) |
| `npm run typecheck` | Cek kesalahan tipe |
| `npm run build` | Build produksi (dilakukan Vercel otomatis) |
| `npx firebase deploy --only firestore:rules` | Pasang ulang rules setelah diubah |

## H. Jika ada masalah
| Gejala | Penyebab umum |
|---|---|
| Layar "Firebase belum terhubung" | `.env.local` belum diisi / server dev belum di-restart |
| "Metode login Email/Password belum diaktifkan" | Langkah B2 terlewat |
| Gagal menyimpan Passport / "Missing or insufficient permissions" | Rules belum di-deploy (langkah D) |
| Login gagal di domain Vercel | Domain belum ditambahkan di Authorized domains |
