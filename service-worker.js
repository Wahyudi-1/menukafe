/* =========================================
   NAMA CACHE (MEMORI SEMENTARA)
   Jika ada pembaruan kode, ubah versi ini (contoh: v2, v3) 
   agar browser tahu harus mengunduh ulang file terbaru.
   ========================================= */
const CACHE_NAME = 'menu-kafe-cache-v1';

/* Daftar file yang wajib disimpan ke memori HP (di-cache) */
const FILE_YANG_DISIMPAN = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json',
    // Catatan: Jika ada gambar lokal seperti logo, masukkan juga di sini
    // './icon-192x192.png',
    // './icon-512x512.png'
];

/* =========================================
   TAHAP 1: INSTALL (Memasang Service Worker)
   Membuka wadah memori (cache) dan memasukkan semua file di atas.
   ========================================= */
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Berhasil membuat cache file');
                return cache.addAll(FILE_YANG_DISIMPAN);
            })
    );
});

/* =========================================
   TAHAP 2: ACTIVATE (Membersihkan Memori Lama)
   Jika CACHE_NAME diubah (misal jadi v2), file versi v1 akan dihapus
   agar HP pengguna tidak penuh dengan file usang.
   ========================================= */
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((daftarCache) => {
            return Promise.all(
                daftarCache.map((namaCache) => {
                    if (namaCache !== CACHE_NAME) {
                        console.log('Service Worker: Menghapus cache lama', namaCache);
                        return caches.delete(namaCache);
                    }
                })
            );
        })
    );
});

/* =========================================
   TAHAP 3: FETCH (Menyediakan Akses Offline)
   Saat pengguna membuka web, periksa dulu apakah ada di cache.
   Jika ada, gunakan yang dari cache (cepat & offline).
   Jika tidak, baru cari ke internet (jaringan).
   ========================================= */
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Jika file ditemukan di memori cache, langsung tampilkan!
                if (response) {
                    return response;
                }
                // Jika tidak ada di cache, coba ambil dari internet
                return fetch(event.request);
            })
    );
});
