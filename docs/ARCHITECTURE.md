# Arsitektur Teknis — GenZ Preneur OS

## 1. Stack & alasannya

| Lapisan | Pilihan | Kenapa |
|---|---|---|
| Tampilan (frontend) | **React 19 + Vite + TypeScript** | Permintaan Owner (React); Vite cepat & sederhana; TypeScript mencegah bug salah tipe data |
| Gaya | **Tailwind CSS v4** | Konsisten, ringan, mudah diubah |
| Rute | React Router 7 | Standar React |
| Login | **Firebase Authentication** (email + password) | Sudah dipakai Owner di proyek lain |
| Database | **Cloud Firestore** + Security Rules | Pengganti PostgreSQL + RLS di master prompt — fungsi setara: data tiap peserta dikunci di level server |
| Validasi | Zod | Satu skema dipakai di form & sebelum simpan |
| Server (Sprint 2+) | **Vercel Serverless Functions** (`/api`) | Webhook pembayaran & panggilan AI wajib di server agar kunci rahasia tidak bocor |
| Hosting | Vercel | Gratis di awal, deploy otomatis dari GitHub |
| Test | Vitest, Testing Library, Firebase Rules Unit Testing; Playwright di Sprint 7 | |

### Kenapa React murni tetap butuh "server kecil"
React berjalan di **browser pengguna**. Apa pun yang ada di browser bisa dilihat orang. Karena itu dua hal **tidak boleh** dilakukan di React:
1. **Menerima notifikasi pembayaran (webhook)** — payment gateway mengirim pesan "lunas" ke sebuah alamat server.
2. **Memanggil AI dengan API key** — kalau key ada di browser, orang bisa mencurinya dan tagihan AI jatuh ke Owner.

Solusinya folder `/api` di proyek yang sama; Vercel otomatis menjalankannya sebagai server. Mulai dipakai di Sprint 2.

## 2. Model data Firestore

Konvensi: ID dokumen = UID user untuk data 1-per-user; ID acak untuk data banyak. Semua dokumen punya `createdAt`/`updatedAt` (server time). Field kode berbahasa Inggris, label UI berbahasa Indonesia.

### Sudah dibangun (Sprint 1)
| Koleksi | Isi | Siapa boleh apa |
|---|---|---|
| `users/{uid}` | email, displayName, role, lastAuditId | Baca: diri sendiri, admin. Buat: diri sendiri dengan role `user` saja. Ubah: nama sendiri; role hanya oleh admin/owner **dengan audit log di batch yang sama**. Hapus: tidak dari browser |
| `passports/{uid}` | personal, skills, resources, interests, goals, ownerUid | Baca: pemilik, admin. Tulis & hapus: pemilik saja. Field asing ditolak |
| `auditLogs/{id}` | actorUid, action, targetId, before, after, reason | Buat: admin (actorUid harus dirinya). Baca: admin. **Tidak bisa diubah/dihapus siapa pun** |

### Rencana (Sprint 2–6)
| Koleksi | Sprint | Catatan |
|---|---|---|
| `products`, `plans`, `planEntitlements` | 2 | Paket dikonfigurasi admin; entitlement = daftar fitur + kuota + masa aktif |
| `orders/{id}`, `payments/{id}`, `paymentEvents/{id}` | 2 | **Hanya ditulis oleh server** (webhook). Browser hanya membaca milik sendiri |
| `entitlements/{uid}/grants/{id}` | 2 | Hak akses aktif per user. Ditulis server; dicek oleh Rules & API |
| `coupons/{code}` | 2 | Divalidasi di server saat checkout |
| `programs`, `batches`, `webinarSessions`, `enrollments`, `attendance` | 3 | |
| `courses/{id}/modules/{id}/lessons/{id}`, `lessonProgress/{uid}_{lessonId}` | 3 | Isi materi berbayar dicek entitlement |
| `assessments`, `assessmentResponses` (Entrepreneur DNA) | 4 | |
| `opportunityProjects`, `businessOffers`, `outreachDrafts` | 4 | `ownerUid` wajib, hanya pemilik |
| `crmProspects`, `crmActivities` | 5 | Data prospek milik peserta — tidak pernah dibagikan/ dipakai melatih model |
| `challenges`, `challengeTasks`, `challengeSubmissions` | 5 | Status `self_reported` vs `verified` dipisah |
| `portfolios`, `portfolioProjects` | 5 | Default privat; publikasi eksplisit |
| `aiConversations`, `aiMessages`, `aiUsageLogs` | 6 | Kuota & biaya per user |
| `certificates`, `supportTickets` | 3/7 | |

## 3. Security model

1. **Autentikasi:** Firebase Auth (sesi token dikelola Firebase, otomatis diperbarui).
2. **Otorisasi:** role (`user`, `mentor`, `admin`, `owner`) di `users/{uid}.role`. Status "Paid Member" **bukan role** — diturunkan dari entitlement aktif.
3. **Perlindungan data:** `firestore.rules` = sumber kebenaran. Penjaga rute di React hanya untuk kenyamanan tampilan.
4. **Hierarki role:** tak ada yang bisa mengubah role sendiri; admin hanya user⇄mentor; owner semua.
5. **Audit trail:** perubahan role mustahil tanpa entri `auditLogs` yang cocok (dicek `getAfter` di Rules).
6. **Default deny:** koleksi yang belum didefinisikan tertutup total.
7. **Rahasia:** hanya variabel `VITE_FIREBASE_*` (memang publik) di browser. Kunci payment & AI hanya di Vercel env tanpa prefix `VITE_`.
8. **Header keamanan:** `vercel.json` (nosniff, frame deny, referrer policy).
9. **Privasi (UU PDP):** consent saat daftar, ekspor JSON, hapus Passport mandiri.
10. **Rencana Sprint 2–7:** App Check + rate limiting di `/api`, verifikasi signature webhook + idempotensi, validasi upload (tipe & ukuran), prompt-injection defense (input pengguna selalu diperlakukan sebagai data), Sentry untuk error monitoring, ekspor Firestore terjadwal (backup).

## 4. Desain lapisan AI (Sprint 4/6)
`/api/ai/[tool].ts` → satu `aiService` yang: memuat system instruction per tool, mengambil konteks yang **diizinkan** (Passport, offer, progres) dari Firestore via Admin SDK, memvalidasi output dengan skema Zod (JSON terstruktur), mencatat token & biaya ke `aiUsageLogs`, mengecek kuota entitlement sebelum memanggil, retry 1x lalu fallback pesan + template statis. Kalkulator harga/komisi **tidak** memakai AI.

## 5. Struktur folder
```
src/
  auth/        AuthProvider (sesi login), guards (penjaga rute)
  components/  AppLayout, ui (toast, dialog, skeleton, empty/error state)
  config/      site.ts — konten publik sementara (pindah ke CMS di Sprint 3)
  lib/         firebase, data (akses Firestore), passport (skema), roles (RBAC)
  pages/       Home, AuthPages, Dashboard, PassportPage, SettingsPage, admin/*
tests/         firestore.rules.test.ts (uji Security Rules di emulator)
docs/          PRD, ARCHITECTURE, DEPLOYMENT
firestore.rules, firebase.json, vercel.json, .env.example
```

## 6. Decision log
| Tanggal | Keputusan | Alasan | Alternatif ditolak |
|---|---|---|---|
| 15 Okt 2026 | React (Vite) bukan Next.js | Permintaan Owner; konsisten dengan stack Ruang Tempa | Next.js (lebih kompleks untuk pemula) |
| 15 Okt 2026 | Firebase bukan Supabase | Konsisten dengan proyek Owner lain; satu ekosistem dipelajari | Supabase/Postgres (lebih kuat untuk analitik SQL — bisa dievaluasi ulang bila data > puluhan ribu user) |
| 15 Okt 2026 | Role ≠ status bayar | Master prompt: entitlement per produk, bukan hardcode paket | Role "member" |
| 15 Okt 2026 | Audit log ditegakkan di Rules | Tidak bisa dilewati walau ada bug di UI | Audit log opsional dari klien |
| 15 Okt 2026 | Menu hanya menampilkan modul yang sudah jadi | Aturan "no fake UI" | Menu lengkap dengan tombol non-aktif |

## 7. Production-readiness checklist (status Sprint 1)
- [x] Login, daftar, reset password, verifikasi email terkirim
- [x] RBAC + Security Rules + default deny
- [x] Data persisten di Firestore, kepemilikan ditegakkan server
- [x] Validasi input (Zod) di klien + validasi struktur di Rules
- [x] Loading, empty, error state; toast; dialog konfirmasi
- [x] Ekspor & hapus data Passport
- [x] Unit test lulus (25), build produksi lulus
- [ ] Uji Rules di emulator — **file siap, harus dijalankan di komputer Owner** (`npm run test:rules`)
- [ ] Halaman Syarat & Ketentuan, Privasi, Refund (Sprint 2 — butuh review hukum)
- [ ] Penghapusan akun penuh via server (Sprint 7)
- [ ] Monitoring error, backup terjadwal, e2e Playwright (Sprint 7)
