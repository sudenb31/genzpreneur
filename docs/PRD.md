# GenZ Preneur OS — Product Requirements Document (v0.1, 15 Okt 2026)

## 1. Ringkasan
GenZ Preneur OS adalah **produk digital B2C** (terpisah dari GenZ Outfit / GenZ Outfit OS): sistem belajar-ke-eksekusi kewirausahaan untuk Gen Z Indonesia 18–27 tahun. Pintu masuknya webinar berbayar; nilai jangka panjangnya adalah tools yang mengubah materi menjadi aksi nyata.

**Filosofi:** *You don't need to own a business to start becoming an entrepreneur.*

## 2. Masalah
| Segmen | Masalah utama | Yang mereka butuhkan |
|---|---|---|
| Mahasiswa | Ingin penghasilan/pengalaman, merasa butuh modal & ide besar dulu | Jalur mulai dari skill yang ada |
| Fresh graduate | Portofolio tipis, belum punya pengalaman komersial | Proyek nyata yang bisa dibuktikan |
| Profesional muda | Ingin penghasilan tambahan, waktu terbatas | Langkah yang realistis untuk 5–10 jam/minggu |

## 3. Alur inti
DISCOVER → LEARN → PRACTICE → OFFER → EXECUTE → REVIEW → GROW.
Setiap tahap menghasilkan output yang dipakai ulang (Passport → DNA → Opportunity → Offer → Outreach → CRM → Challenge → Portfolio).

## 4. Metrik keberhasilan (diukur dari data sistem, bukan klaim)
- **North Star:** jumlah peserta yang menyelesaikan Execution Challenge 7 hari dengan bukti terverifikasi admin.
- Aktivasi: % pendaftar yang melengkapi Passport 100% dalam 48 jam.
- Konversi: % akun → pembelian paket (Sprint 2).
- Kehadiran webinar & penyelesaian challenge (Sprint 3–5).
- Biaya AI per peserta aktif (Sprint 6).

## 5. Ruang lingkup per sprint
| Sprint | Isi | Status |
|---|---|---|
| 0 | PRD, arsitektur, skema, security model | ✅ dokumen ini + ARCHITECTURE.md |
| 1 | Fondasi: auth, RBAC, Passport, dashboard, admin user & audit log, landing awal | ✅ dibangun |
| 2 | Commerce: katalog, checkout, payment gateway, entitlement, invoice, kupon, halaman legal | Berikutnya |
| 3 | LMS + webinar + replay + admin CMS | |
| 4 | Entrepreneur DNA, Opportunity Finder, Offer Builder, Outreach Studio | |
| 5 | Mini CRM, Challenge 7 hari, kalkulator harga/komisi, Portfolio | |
| 6 | AI Coach, Sales Roleplay, kuota & analitik AI | |
| 7 | Hardening: e2e test, security & a11y review, monitoring, backup | |

## 6. Prinsip non-negosiasi
Tidak ada UI palsu · entitlement ditegakkan di server · data milik peserta hanya bisa diakses pemiliknya · perhitungan finansial deterministik & teruji · tidak ada janji penghasilan, testimoni, atau metrik fiktif · tidak ada otomasi spam.

## 7. Decision required (perlu jawaban Owner)
| # | Keputusan | Opsi | Rekomendasi |
|---|---|---|---|
| D1 | Payment gateway | Midtrans · Xendit · Mayar/Scalev (no-code) | **Midtrans** atau **Xendit** (QRIS + VA + e-wallet, webhook bertanda tangan). Butuh dokumen badan usaha/NPWP untuk akun produksi. |
| D2 | Hosting fungsi server (webhook, AI) | Vercel Functions · Firebase Cloud Functions | **Vercel Functions** — sudah satu tempat dengan hosting; Firebase Functions mewajibkan paket Blaze (kartu kredit). |
| D3 | Provider AI | Anthropic Claude · OpenAI · Google Gemini | Adapter dibuat provider-agnostic; pilih setelah uji biaya per peserta di Sprint 4. |
| D4 | Domain | — | Perlu domain sendiri sebelum Sprint 2 (email transaksi & link pembayaran). |
| D5 | Posisi terhadap Ruang Tempa | Lihat catatan risiko di bawah | Bedakan pesan, segmen, dan promesa secara tegas sebelum launch. |

## 8. Risiko utama
1. **Kanibalisasi dengan Ruang Tempa** — sama-sama webinar berbayar murah, harga pintu Rp99rb, segmen fresh graduate, narasumber sama. Wajib dibedakan: GenZ Preneur = *skill komersial & eksekusi bisnis* (unisex, 18–27); Ruang Tempa = *pembentukan diri* (laki-laki 22–26).
2. **Overbuild sebelum validasi** — 12 tools adalah 3–5 bulan kerja. Rekomendasi: jual webinar batch pertama segera setelah Sprint 2, sebelum Sprint 4–6 selesai.
3. **Biaya AI tak terkendali** — wajib kuota per paket sebelum AI dibuka.
4. **Kepatuhan UU PDP** — consent, ekspor, dan penghapusan data sudah dimulai di Sprint 1.
