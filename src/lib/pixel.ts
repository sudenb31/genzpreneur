/**
 * Meta Pixel (dataset kolaborasi Heybinder) — ID publik, aman di frontend.
 * Hanya aktif di domain produksi, tidak jalan di tes/lokal/build standalone.
 * Event: PageView (tiap pindah halaman), ViewContent (bagian harga terlihat), InitiateCheckout (klik Beli).
 */
export const META_PIXEL_ID = '28315681628041079';

type Fbq = ((...args: unknown[]) => void) & { callMethod?: (...a: unknown[]) => void; queue?: unknown[]; loaded?: boolean; version?: string; push?: unknown };
declare global { interface Window { fbq?: Fbq; _fbq?: Fbq } }

function enabled(): boolean {
  if (typeof window === 'undefined' || import.meta.env.MODE !== 'production') return false;
  return /(^|\.)genzpreneur\.id$/.test(window.location.hostname);
}

let initialized = false;

export function initPixel() {
  if (initialized || !enabled()) return;
  initialized = true;
  /* Kode dasar resmi Meta Pixel (dirapikan). */
  const n: Fbq = function (...args: unknown[]) {
    if (n.callMethod) n.callMethod(...args); else n.queue!.push(args);
  } as Fbq;
  if (!window._fbq) window._fbq = n;
  n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
  window.fbq = n;
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(s);
  window.fbq('init', META_PIXEL_ID);
}

export function trackPixel(event: 'PageView' | 'ViewContent' | 'InitiateCheckout', params?: Record<string, unknown>) {
  if (!enabled()) return;
  initPixel();
  try { window.fbq?.('track', event, params); } catch { /* pelacakan tidak boleh mengganggu aplikasi */ }
}
