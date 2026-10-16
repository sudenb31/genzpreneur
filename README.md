# GenZ Preneur OS

**Future Entrepreneurs — Learn. Execute. Build.**
Platform belajar-ke-eksekusi kewirausahaan berbasis AI untuk Gen Z Indonesia. Produk digital GenZ Prime Corp (terpisah dari GenZ Outfit).

Stack: React 19 · Vite · TypeScript · Tailwind v4 · Firebase Auth + Firestore · Vercel.

## Status: Sprint 1 + Benefit Program ✅

### Benefit Program (baru)
| Benefit | Isi |
|---|---|
| 🧭 Assessment Industri + 💰 Profil Cuan | 36 pertanyaan dalam 2 bagian → top 3 dari 10 industri, jalur (Sales/Marketing Partner, Business Builder), cara mulai modal Rp0, **+ 8 Profil Cuan** (Pencipta, Bintang, Penggerak, Pembuat Transaksi, Pedagang, Pengumpul Aset, Raja Sistem, Perakit Sistem) dengan contoh tokoh dunia & tokoh Muslim. Terinspirasi konsep Roger Hamilton, ditulis ulang — bukan tes Wealth Dynamics resmi |
| 🪪 Rangkuman Passport | Skor kesiapan 0–100 (Starter/Builder/Runner), senjata utama vs area latihan, data ringkas, langkah berikutnya otomatis |
| 💬 Outreach Studio | 6 skenario (mentor, sales partner komisi, jasa ke UMKM, uji coba gratis, follow-up, kolaborasi) × 4 kanal × 2 gaya bahasa + prompt AI + jawaban keberatan |
| 🧠 Entrepreneur Mindset | 4 pelajaran + latihan tersimpan |
| 📈 Sales & Marketing Skills | 4 pelajaran + latihan |
| 🤝 Business Partner Strategy | 4 pelajaran (5 jalur modal Rp0, skema komisi/fee) |
| ⚡ AI Business Toolkit | 12 prompt siap salin (terisi otomatis dari Passport/Assessment), kalkulator komisi, template proposal |
| ✅ Practical Action Plan | 7 hari × 3 misi + catatan harian |
| 📌 Tersimpan | Semua pesan/prompt/proposal/simulasi/problem map yang disimpan |
| 🗺️ Business 101 | 10 pelajaran peta dunia bisnis: 5 organ bisnis, value, marketing vs sales vs branding, STP, closing & penolakan, brand = janji × bukti × konsistensi, delivery & bottleneck, omzet/untung/cash + BEP, strategi (5 tekanan, SWOT), eksperimen & negosiasi. Tiap pelajaran ada Mitos vs Fakta + Kamus Kilat. Terinspirasi The Personal MBA & The Visual MBA, ditulis ulang orisinal |
| 📚 Kurikulum 4 Season | 10 modul · 46 pelajaran: Wake Up (Business 101, Mindset, Read The Game), Find Your Why & Edge (Why Engine, Find Your Edge), Build & Sell (Sales & Marketing, Business Partner), Lead & Last (Lead The Squad, Life Ops, Future Proof) |
| 🧩 Problem Map | Fenomena → masalah inti → akar → dampak → terdampak → langkah awal → validasi, dengan 6 Zona Dampak |
| 🌟 Dream Pact | Pakta Mimpi: Personal WHY, Edge, Dream Statement, 6 level milestone (Launch Pad → Dream Unlocked) dengan usia/tahun otomatis, Skill Tree 4 cabang, Plan 12 bulan (Level Up/Cuan/Impact), komitmen + tanda tangan, **versi cetak A4** |

Tidak memakai API AI berbayar: generator berbasis template + prompt untuk ditempel ke ChatGPT/Claude/Gemini.

### Fondasi (Sprint 1)
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
npm test            # 73 unit/komponen test
npm run test:rules  # uji Security Rules (butuh Java 11+)
```
