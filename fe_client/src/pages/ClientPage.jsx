import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import {
  AlertTriangle,
  CheckCircle2,
  MapPin,
  MessageSquareWarning,
  ScanLine,
  X,
  Clock3,
} from "lucide-react";
import Timer from "../components/Timer";

const BATCH_ID = "JP-2607-001";

// Ganti dengan nomor WhatsApp resmi pihak dapur.
// Gunakan format kode negara tanpa tanda + atau angka 0 di depan.
const NOMOR_WHATSAPP_DAPUR = "6285960655827";

export default function ClientPage() {
  const [scannedBatch, setScannedBatch] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [scanMessage, setScanMessage] = useState("");
  const [scanning, setScanning] = useState(false);

  const scannerRef = useRef(null);
  const scannerRegionId = "jejakpangan-qr-reader";

  // Menghentikan kamera dan membersihkan scanner.
  const stopScanner = async () => {
    const scanner = scannerRef.current;

    if (!scanner) {
      setScanning(false);
      return;
    }

    try {
      if (scanner.isScanning) {
        await scanner.stop();
      }

      scanner.clear();
    } catch (error) {
      console.error("Gagal menghentikan scanner:", error);
    } finally {
      if (scannerRef.current === scanner) {
        scannerRef.current = null;
      }

      setScanning(false);
    }
  };

  // Membuka kamera dan membaca QR.
  const startScanner = async () => {
    if (scanning || confirmed) return;

    setScanMessage("");
    setScannedBatch("");

    try {
      const scanner = new Html5Qrcode(scannerRegionId);
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 220, height: 220 },
          aspectRatio: 1,
        },
        async (decodedText) => {
          if (scannerRef.current !== scanner) return;

          const batch = decodedText.trim();

          setScannedBatch(batch);
          setScanMessage("QR berhasil dibaca.");

          await stopScanner();
        },
        () => {
          // Kesalahan pembacaan sementara diabaikan
          // sampai kamera menemukan QR.
        }
      );

      setScanning(true);
    } catch (error) {
      console.error("Scanner error:", error);

      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
        } catch {
          // Abaikan kegagalan pembersihan.
        }
      }

      scannerRef.current = null;
      setScanning(false);
      setScanMessage(
        "Kamera tidak dapat dibuka. Periksa izin kamera dan pastikan halaman menggunakan localhost atau HTTPS."
      );
    }
  };

  // Pastikan kamera dibersihkan saat halaman ditutup.
  useEffect(() => {
    return () => {
      const scanner = scannerRef.current;

      if (scanner?.isScanning) {
        scanner
          .stop()
          .then(() => scanner.clear())
          .catch((error) => {
            console.error("Gagal membersihkan scanner:", error);
          });
      } else if (scanner) {
        try {
          scanner.clear();
        } catch (error) {
          console.error("Gagal membersihkan scanner:", error);
        }
      }

      scannerRef.current = null;
    };
  }, []);

  // Validasi hasil scan sebelum konfirmasi.
  const handleConfirm = () => {
    if (confirmed) return;

    if (!scannedBatch) {
      setScanMessage("Scan QR batch terlebih dahulu.");
      return;
    }

    if (scannedBatch !== BATCH_ID) {
      setScanMessage(
        `Batch ${scannedBatch} tidak cocok dengan batch yang dituju.`
      );
      return;
    }

    setConfirmed(true);
    setScanMessage("");
  };

  // Membuka WhatsApp dengan pesan laporan otomatis.
  const reportViaWhatsApp = () => {
    if (
      !NOMOR_WHATSAPP_DAPUR ||
      NOMOR_WHATSAPP_DAPUR === "6281234567890"
    ) {
      setScanMessage(
        "Nomor WhatsApp dapur belum dikonfigurasi. Hubungi administrator."
      );
      return;
    }

    const message =
      `Halo, pihak dapur JejakPangan.\n\n` +
      `Saya ingin melaporkan kondisi makanan pada batch ${BATCH_ID}.\n` +
      `Mohon dilakukan pemeriksaan dan tindak lanjut.\n\n` +
      `Terima kasih.`;

    const url =
      `https://wa.me/${NOMOR_WHATSAPP_DAPUR}` +
      `?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-md px-4 py-5">
        {/* Header */}
        <header>
          <p className="text-xs font-bold uppercase tracking-widest text-green-700">
            JejakPangan
          </p>

          <h1 className="mt-1 text-2xl font-black">
            Portal Klien
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Konfirmasi penerimaan dan pelaporan batch.
          </p>
        </header>

        {/* Informasi batch dan scanner */}
        <section className="card mt-5 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-slate-400">Batch</p>

              <p className="font-mono text-sm font-black text-green-800">
                {BATCH_ID}
              </p>
            </div>

            <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-800">
              DATA CONTOH
            </span>
          </div>

          <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white shadow-xs">
              <ScanLine className="text-green-700" size={32} />
            </div>

            <p className="mt-3 font-bold">
              Scan QR batch
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Arahkan kamera ke QR pada paspor digital makanan.
            </p>

            {/* Area kamera */}
            <div
              id={scannerRegionId}
              className={
                scanning
                  ? "mt-4 overflow-hidden rounded-xl bg-white p-2"
                  : "hidden"
              }
            />

            {!scanning && !confirmed && (
              <button
                type="button"
                onClick={startScanner}
                className="btn-primary mt-4 w-full"
              >
                <ScanLine size={18} />
                Scan QR Batch
              </button>
            )}

            {scanning && (
              <button
                type="button"
                onClick={stopScanner}
                className="btn-secondary mt-4 w-full"
              >
                <X size={18} />
                Tutup Kamera
              </button>
            )}

            {scannedBatch && (
              <div className="mt-3 rounded-xl bg-green-50 p-3 text-left">
                <p className="text-xs text-slate-500">
                  Hasil pemindaian
                </p>

                <p className="mt-1 break-all text-sm font-bold text-green-800">
                  {scannedBatch}
                </p>
              </div>
            )}

            {scanMessage && (
              <p
                role="status"
                aria-live="polite"
                className="mt-3 text-xs font-medium text-slate-600"
              >
                {scanMessage}
              </p>
            )}
          </div>

          {/* Konfirmasi penerimaan */}
          {!confirmed ? (
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!scannedBatch}
              className="btn-primary mt-5 w-full"
            >
              <CheckCircle2 size={18} />
              Konfirmasi Penerimaan
            </button>
          ) : (
            <div
              role="status"
              className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 size={20} />

                <p className="font-extrabold">
                  Penerimaan terkonfirmasi
                </p>
              </div>

              <p className="mt-2 leading-5">
                Konfirmasi berhasil pada sesi browser ini. Integrasi
                backend diperlukan untuk menyimpan catatan penerimaan
                secara permanen.
              </p>
            </div>
          )}
        </section>

        {/* Timer */}
        <section className="mt-4">
          <div className="mb-2 flex items-center gap-2">
            <AlertTriangle
              className="text-amber-600"
              size={18}
            />

            <h2 className="font-extrabold">
              Timer batas konsumsi
            </h2>
          </div>

          <Timer
            initialSeconds={5400}
            running={!confirmed}
            dangerAt={1800}
          />

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Timer ini merupakan indikator waktu operasional, bukan
            penentu tunggal keamanan pangan.
          </p>
        </section>

        {/* Lokasi penerima dan laporan */}
        <section className="card mt-4 p-5">
          <div className="flex gap-3">
            <MapPin
              className="mt-0.5 shrink-0 text-green-700"
              size={18}
            />

            <div>
              <p className="text-xs text-slate-400">
                Lokasi penerima
              </p>

              <p className="text-sm font-bold">
                Kantor Contoh, Depok
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex gap-3">
              <MessageSquareWarning
                className="mt-0.5 shrink-0 text-amber-700"
                size={20}
              />

              <div>
                <p className="text-sm font-extrabold text-amber-900">
                  Ada masalah dengan makanan?
                </p>

                <p className="mt-1 text-xs leading-5 text-amber-800">
                  Hubungi pihak dapur melalui WhatsApp untuk
                  melaporkan kondisi makanan dan meminta tindak lanjut.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={reportViaWhatsApp}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
            >
              <MessageSquareWarning size={18} />
              Hubungi Dapur via WhatsApp
            </button>
          </div>
        </section>

        {/* Informasi sistem */}
        <p className="px-2 py-5 text-center text-[11px] leading-5 text-slate-400">
          JejakPangan mendukung penelusuran batch dan tindak lanjut
          kondisi pangan. Status sistem harus didasarkan pada data
          pemeriksaan dan pemantauan yang tervalidasi.
        </p>
      </div>
    </div>
  );
}
