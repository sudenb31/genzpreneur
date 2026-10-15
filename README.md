# GenZ Preneur OS

**Future Entrepreneurs — Learn. Execute. Build.**
Platform belajar-ke-eksekusi kewirausahaan berbasis AI untuk Gen Z Indonesia. Produk digital GenZ Prime Corp (terpisah dari GenZ Outfit).

Stack: React 19 · Vite · TypeScript · Tailwind v4 · Firebase Auth + Firestore · Vercel.

## Status: Sprint 1 — Platform Foundation ✅
| Fitur | Keterangan |
|---|---|
| Landing page | Hero, alur, 3 jalur, narasumber, harga perkenalan, FAQ, CTA |
| Akun | Daftar (dengan consent data), masuk, lupa password, verifikasi email |
| RBAC | Peserta · Mentor · Admin · Super Admin, ditegakkan di Firestore Security Rules |
| Entrepreneur Passport | 5 bagian (profil, skill, sumber daya, minat, target), validasi, simpan, kelengkapan %, ekspor JSON, hapus |
| Dashboard | Kelengkapan Passport, langkah berikutnya yang dihitung otomatis, peta perjalanan |
| Command Center | Kelola role pengguna (cari, filter) + Audit Log permanen |
| Pengaturan | Ubah nama, kirim ulang verifikasi |

## Mulai cepat
```bash
npm install
cp .env.example .env.local   # isi kredensial Firebase
npm run dev
```
Panduan lengkap untuk pemula: **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)**.

## Dokumen
- [docs/PRD.md](docs/PRD.md) — kebutuhan produk, metrik, keputusan yang perlu diambil, risiko
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — stack, model data, security model, desain AI, decision log, checklist produksi
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — setup Firebase & Vercel langkah demi langkah

## Test
```bash
npm test            # 25 unit/komponen test
npm run test:rules  # uji Security Rules (butuh Java 11+)
```
