# JejakPangan Frontend

Prototype frontend React + Tailwind CSS untuk JejakPangan.

## Fitur
- Dashboard internal dapur
- Summary batch Aman / Waspada / Tahan
- Monitoring bahan
- 5 titik kontrol paspor pangan
- Mock sensor ESP32: suhu, kelembapan, pintu chiller
- Timer keluar ke dapur dan masak → konsumsi
- Halaman transparansi konsumen mobile-first
- Portal klien + konfirmasi penerimaan
- Timer batas konsumsi
- Form laporan keluhan tertaut ke batch

## Menjalankan

```bash
npm install
npm run dev
```

Lalu buka alamat localhost yang diberikan Vite.

## Catatan
Semua data masih dummy dan disimpan di React state. Belum ada autentikasi, backend, database, QR scanner kamera, upload ke server, atau koneksi IoT/cloud.
