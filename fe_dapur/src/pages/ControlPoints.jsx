
import { useEffect, useId, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import {Camera, CheckCircle2, Clock3, DoorOpen, QrCode, ScanLine, Thermometer, Upload, Wind} from "lucide-react";
import Timer from "../components/Timer";

const points = [
  { id: 1, title: "Terima", subtitle: "Scan supplier & cek bahan" },
  { id: 2, title: "Penyimpanan", subtitle: "Pantau sensor penyimpanan" },
  { id: 3, title: "Keluar ke dapur", subtitle: "Mulai timer suhu ruang" },
  { id: 4, title: "Selesai masak", subtitle: "Tautkan menu & mulai timer" },
  { id: 5, title: "Kirim klien", subtitle: "Scan & hentikan timer" },
];

// Dummy data untuk empat lokasi node sensor
const sensorNodes = [
  {
    id: "gudang",
    name: "Gudang Kering",
    node: "S4",
    description: "Pemantauan bahan kering dan kelembapan gudang",
    history: [
      { time: "08:00:00", temp: 28.1, humidity: 62, door: 0 },
      { time: "08:15:00", temp: 28.3, humidity: 63, door: 12 },
      { time: "08:30:00", temp: 28.4, humidity: 63, door: 0 },
      { time: "08:45:00", temp: 28.2, humidity: 62, door: 8 },
      { time: "09:00:00", temp: 28.2, humidity: 62, door: 0 },
    ],
  },
  {
    id: "chiller1",
    name: "Chiller 1",
    node: "S1",
    description: "Pemantauan penyimpanan bahan segar",
    history: [
      { time: "08:00:00", temp: 3.8, humidity: 67, door: 0 },
      { time: "08:15:00", temp: 4.1, humidity: 68, door: 10 },
      { time: "08:30:00", temp: 4.3, humidity: 69, door: 18 },
      { time: "08:45:00", temp: 4.0, humidity: 67, door: 5 },
      { time: "09:00:00", temp: 3.9, humidity: 66, door: 0 },
    ],
  },
  {
    id: "chiller2",
    name: "Chiller 2",
    node: "S2",
    description: "Pemantauan penyimpanan bahan segar",
    history: [
      { time: "08:00:00", temp: 3.5, humidity: 65, door: 0 },
      { time: "08:15:00", temp: 3.7, humidity: 66, door: 6 },
      { time: "08:30:00", temp: 4.0, humidity: 66, door: 14 },
      { time: "08:45:00", temp: 3.8, humidity: 65, door: 0 },
      { time: "09:00:00", temp: 3.6, humidity: 65, door: 0 },
    ],
  },
  {
    id: "freezer",
    name: "Freezer",
    node: "S3",
    description: "Pemantauan penyimpanan bahan beku",
    history: [
      { time: "08:00:00", temp: -18.5, humidity: 48, door: 0 },
      { time: "08:15:00", temp: -18.2, humidity: 49, door: 4 },
      { time: "08:30:00", temp: -17.8, humidity: 49, door: 10 },
      { time: "08:45:00", temp: -18.1, humidity: 48, door: 0 },
      { time: "09:00:00", temp: -18.4, humidity: 48, door: 0 },
    ],
  },
];

export default function ControlPoints() {
  const [active, setActive] = useState(1);
  const [selectedSensor, setSelectedSensor] = useState("chiller1");

  const [form, setForm] = useState({
    qr: "",
    temp: "4.2",
    category: "Protein hewani",
    photo: null,
    menu: "Nasi Ayam Teriyaki",
  });

  const [started, setStarted] = useState(false);
  const [cooked, setCooked] = useState(false);
  const [received, setReceived] = useState(false);

  const update = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleQrScan = (decodedText) => {
    const code = decodedText.trim();

      if (!code) {
        setScanError("QR tidak berisi kode batch yang valid.");
        setScanTarget(null);
        return;
      }

      // Batch yang sama harus digunakan di setiap titik proses.
      if (batchCode && code !== batchCode) {
        setScanError(
          `Kode berbeda. Batch aktif: ${batchCode}. Scan QR batch yang sama.`
        );
        setScanTarget(null);
        return;
      }

      setBatchCode(code);
      setScanError("");

      if (scanTarget === 3) {
        setStarted(true);
      }

      if (scanTarget === 4) {
        setCooked(true);
      }

      if (scanTarget === 5) {
        setDispatchReady(true);
      }

      setScanTarget(null);
    };

  const [scanTarget, setScanTarget] = useState(null);
  const [batchCode, setBatchCode] = useState("");
  const [dispatchReady, setDispatchReady] = useState(false);
  const [scanError, setScanError] = useState("");

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
      <div className="mb-6">
        <p className="text-sm font-semibold text-green-700">
          Paspor Pangan
        </p>
        <h1 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
          5 Titik Kontrol
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Alur pencatatan batch dari bahan diterima sampai diterima klien.
        </p>
      </div>

      <div className="mb-6 grid gap-2 md:grid-cols-5">
        {points.map((point) => (
          <button
            key={point.id}
            onClick={() => setActive(point.id)}
            className={`rounded-2xl border p-4 text-left transition ${
              active === point.id
                ? "border-green-600 bg-green-50 shadow-xs"
                : "border-slate-200 bg-white hover:border-green-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`grid h-8 w-8 place-items-center rounded-full text-sm font-black ${
                  active === point.id
                    ? "bg-green-700 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {point.id}
              </span>
              <span className="font-bold text-slate-800">
                {point.title}
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {point.subtitle}
            </p>
          </button>
        ))}
      </div>

      {/* TITIK 1 — TERIMA: dipertahankan */}
      {active === 1 && (
        <section className="card p-5 sm:p-6">
          <div className="mb-5 flex items-start gap-3">
            <div className="rounded-xl bg-green-100 p-3 text-green-700">
              <QrCode />
            </div>
            <div>
              <h2 className="text-lg font-extrabold">
                Titik 1 — Terima
              </h2>
              <p className="text-sm text-slate-500">
                Data supplier, suhu tiba, foto bahan, dan kategori risiko.
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-bold">
                QR Supplier
              </span>
              <div className="relative">
                <QrCode
                  className="absolute left-3 top-3 text-slate-400"
                  size={18}
                />
                <input
                  className="input pl-10"
                  placeholder="Scan / masukkan kode QR"
                  value={form.qr}
                  onChange={(e) => update("qr", e.target.value)}
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold">
                Suhu saat tiba (°C)
              </span>
              <div className="relative">
                <Thermometer
                  className="absolute left-3 top-3 text-slate-400"
                  size={18}
                />
                <input
                  className="input pl-10"
                  type="number"
                  step="0.1"
                  value={form.temp}
                  onChange={(e) => update("temp", e.target.value)}
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold">
                Kategori risiko
              </span>
              <select
                className="input"
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
              >
                <option>Protein hewani</option>
                <option>Telur & susu</option>
                <option>Protein nabati basah</option>
                <option>Sayur & buah</option>
                <option>Bahan kering</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold">
                Foto bahan
              </span>
              <div className="relative flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-dashed border-slate-300 px-3 text-sm text-slate-500 hover:border-green-500">
                <Upload size={17} />
                {form.photo ? form.photo.name : "Unggah foto bahan"}
                <input
                  className="absolute inset-0 cursor-pointer opacity-0"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    update("photo", e.target.files?.[0] ?? null)
                  }
                />
              </div>
            </label>
          </div>

          <button className="btn-primary mt-6">
            <ScanLine size={18} /> Simpan & Validasi Batch
          </button>
        </section>
      )}

      {/* TITIK 2 — SIMPAN: pilihan 4 node sensor */}
      {active === 2 && (
        <section className="space-y-6">
          <div>
            <p className="text-sm font-semibold text-green-700">
              Monitoring IoT
            </p>
            <h2 className="mt-1 text-xl font-extrabold text-slate-900">
              Monitoring Penyimpanan
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Pilih lokasi untuk melihat waktu, suhu, kelembapan, dan
              durasi pintu terbuka.
            </p>
          </div>

          {/* Empat tombol lokasi */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {sensorNodes.map((sensor) => {
              const selected = selectedSensor === sensor.id;
              const latestData =
                sensor.history[sensor.history.length - 1];

              return (
                <button
                  type="button"
                  key={sensor.id}
                  onClick={() => setSelectedSensor(sensor.id)}
                  className={`rounded-2xl border p-5 text-left transition ${
                    selected
                      ? "border-green-600 bg-green-50 ring-2 ring-green-100"
                      : "border-slate-200 bg-white hover:border-green-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`grid h-11 w-11 place-items-center rounded-xl ${
                        selected
                          ? "bg-green-700 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <Thermometer size={22} />
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        selected
                          ? "bg-green-200 text-green-800"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {sensor.node}
                    </span>
                  </div>

                  <h3 className="mt-4 font-extrabold text-slate-900">
                    {sensor.name}
                  </h3>
                  <p className="mt-1 min-h-10 text-xs leading-5 text-slate-500">
                    {sensor.description}
                  </p>

                  <div className="mt-4 flex items-end justify-between border-t border-slate-200 pt-4">
                    <div>
                      <p className="text-xs text-slate-500">
                        Suhu terakhir
                      </p>
                      <p className="mt-1 text-2xl font-black text-slate-900">
                        {latestData.temp}°C
                      </p>
                    </div>
                    <span
                      className={`text-sm font-bold ${
                        selected ? "text-green-700" : "text-slate-400"
                      }`}
                    >
                      {selected ? "Dipilih ✓" : "Lihat detail →"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detail sensor terpilih */}
          {sensorNodes
            .filter((sensor) => sensor.id === selectedSensor)
            .map((sensor) => {
              const latestData =
                sensor.history[sensor.history.length - 1];

              return (
                <div key={sensor.id} className="space-y-5">
                  <div className="card overflow-hidden">
                    <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <span className="grid h-11 w-11 place-items-center rounded-xl bg-green-100 text-green-700">
                          <Thermometer size={21} />
                        </span>
                        <div>
                          <h3 className="font-extrabold text-slate-900">
                            Detail {sensor.name}
                          </h3>
                          <p className="text-xs text-slate-500">
                            Node sensor {sensor.node}
                          </p>
                        </div>
                      </div>

                      <span className="inline-flex w-fit items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                        Data simulasi
                      </span>
                    </div>

                    <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
                      <SensorMetric
                        icon={Clock3}
                        label="Waktu pencatatan"
                        value={latestData.time}
                      />
                      <SensorMetric
                        icon={Thermometer}
                        label="Suhu terakhir"
                        value={`${latestData.temp}°C`}
                      />
                      <SensorMetric
                        icon={Wind}
                        label="Kelembapan"
                        value={`${latestData.humidity}%`}
                      />
                      <SensorMetric
                        icon={DoorOpen}
                        label="Pintu terbuka"
                        value={`${latestData.door} detik`}
                      />
                    </div>
                  </div>

                  <div className="card overflow-hidden">
                    <div className="border-b border-slate-200 p-5">
                      <h3 className="font-extrabold text-slate-900">
                        Riwayat Sensor — {sensor.name}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Riwayat pembacaan sensor berdasarkan lokasi.
                      </p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full min-w-150 text-left text-sm">
                        <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500">
                          <tr>
                            <th className="px-5 py-3">Waktu</th>
                            <th className="px-5 py-3">Suhu</th>
                            <th className="px-5 py-3">Kelembapan</th>
                            <th className="px-5 py-3">Durasi pintu</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {sensor.history.map((row) => (
                            <tr
                              key={row.time}
                              className="hover:bg-slate-50"
                            >
                              <td className="px-5 py-3 font-semibold text-slate-700">
                                {row.time}
                              </td>
                              <td className="px-5 py-3">
                                {row.temp}°C
                              </td>
                              <td className="px-5 py-3">
                                {row.humidity}%
                              </td>
                              <td className="px-5 py-3">
                                {row.door} detik
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })}
        </section>
      )}

      {/* TITIK 3 — dipertahankan */}
      {active === 3 && (
        <ActionCard
          title="Titik 3 — Keluar ke dapur"
          description="Petugas scan QR batch sebelum bahan keluar dari penyimpanan. Timer suhu ruang dimulai setelah scan berhasil."
          button="Scan QR Batch"
          active={started}
          onClick={() => {
            setScanError("");
            setScanTarget(3);
          }}
          icon={ScanLine}
        >
          {started && (
            <>
              <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                <p className="font-bold">Batch berhasil dipindai.</p>
                <p className="mt-1">Kode batch: {batchCode}</p>
                <p>Waktu keluar tercatat dalam simulasi.</p>
              </div>
              <Timer initialSeconds={7200} />
            </>
          )}
        </ActionCard>
      )}

      {/* TITIK 4 — dipertahankan */}
      {active === 4 && (
        <section className="card mx-auto max-w-2xl space-y-5 p-6 sm:p-8">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-green-100 text-green-700">
            <CheckCircle2 size={30} />
          </div>

          <div className="text-center">
            <h2 className="text-xl font-extrabold">
              Titik 4 — Selesai masak
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Scan QR batch setelah proses memasak selesai untuk mengaitkan
              batch dengan menu dan memulai timer masak → konsumsi.
            </p>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-bold">Menu</span>
            <input
              className="input"
              value={form.menu}
              onChange={(e) => update("menu", e.target.value)}
              placeholder="Masukkan nama menu"
            />
          </label>

          {!cooked ? (
            <button
              type="button"
              onClick={() => {
                setScanError("");
                setScanTarget(4);
              }}
              className="btn-primary w-full justify-center"
            >
              <ScanLine size={18} />
              Scan Selesai Masak
            </button>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                <p className="font-bold">Batch berhasil dipindai.</p>
                <p className="mt-1">Kode batch: {batchCode}</p>
                <p>Menu: {form.menu}</p>
                <p>Timer masak → konsumsi telah dimulai.</p>
              </div>
              <Timer initialSeconds={7200} />
            </div>
          )}
        </section>
      )}

      {/* TITIK 5 — dipertahankan */}
      {active === 5 && (
        <ActionCard
          title="Titik 5 — Siap dikirim ke klien"
          description="Petugas dapur memindai QR batch untuk memvalidasi pesanan sebelum pengiriman. Timer masak → konsumsi tetap berjalan sampai klien mengonfirmasi penerimaan."
          button="Scan Batch Sebelum Kirim"
          active={dispatchReady}
          onClick={() => {
            setScanError("");
            setScanTarget(5);
          }}
          icon={ScanLine}
        >
          {dispatchReady && (
            <div className="space-y-4">
              <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                <p className="font-extrabold">
                  Batch siap dikirim.
                </p>
                <p className="mt-1">Kode batch: {batchCode}</p>
                <p>Menu: {form.menu}</p>
                <p>Status: Menunggu konfirmasi penerimaan klien.</p>
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                <p className="font-bold">Timer masih berjalan.</p>
                <p className="mt-1">
                  Pemindaian pengiriman tidak menghentikan timer.
                  Klien harus mengonfirmasi penerimaan melalui halaman
                  Halaman Klien.
                </p>
              </div>

              <button
                type="button"
                className="btn-primary w-full justify-center"
                onClick={() => window.print()}
              >
                Cetak / Simpan Bukti Pengiriman
              </button>
            </div>
          )}
        </ActionCard>
      )}

      {scanError && (
        <div
          role="alert"
          className="fixed bottom-5 left-1/2 z-60 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 shadow-lg"
        >
          {scanError}
          <button
            type="button"
            className="ml-3 underline"
            onClick={() => setScanError("")}
          >
            Tutup
          </button>
        </div>
      )}

      {scanTarget !== null && (
        <QRScannerModal
          title={
            scanTarget === 3
              ? "Scan Keluar ke Dapur"
              : scanTarget === 4
                ? "Scan Selesai Masak"
                : "Scan Batch Sebelum Pengiriman"
          }
          onScan={handleQrScan}
          onClose={() => setScanTarget(null)}
        />
      )}
    </div>
  );
}

function SensorMetric({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2 text-green-700">
        <Icon size={18} />
        <span className="text-xs font-semibold text-slate-500">
          {label}
        </span>
      </div>
      <p className="mt-3 text-xl font-black text-slate-900">
        {value}
      </p>
    </div>
  );
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="card p-5">
      <Icon className="text-green-700" size={20} />
      <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-2xl font-black">{value}</p>
    </div>
  );
}

function ActionCard({
  title,
  description,
  button,
  onClick,
  active,
  icon: Icon,
  children,
}) {
  return (
    <section className="card mx-auto max-w-2xl p-6 sm:p-8">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-green-100 text-green-700">
        <Icon size={30} />
      </div>
      <div className="mt-5 text-center">
        <h2 className="text-xl font-extrabold">{title}</h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">
          {description}
        </p>
      </div>

      {!active && (
        <button
          onClick={onClick}
          className="btn-primary mx-auto mt-6 w-full sm:w-auto"
        >
          <ScanLine size={18} /> {button}
        </button>
      )}

      {active && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-2 rounded-xl bg-green-50 p-3 text-sm font-semibold text-green-800">
            <CheckCircle2 size={18} /> Aksi berhasil dicatat.
          </div>
          {children}
        </div>
      )}
    </section>
  );
}


function QRScannerModal({ title, onScan, onClose }) {
  const scannerId = useId().replace(/:/g, "");
  const onScanRef = useRef(onScan);
  const [cameraError, setCameraError] = useState("");

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    const scanner = new Html5Qrcode(scannerId);
    let disposed = false;
    let handled = false;

    const startScanner = async () => {
      try {
        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 240, height: 240 },
            aspectRatio: 1,
          },
          async (decodedText) => {
            if (disposed || handled) return;

            handled = true;

            try {
              if (scanner.isScanning) {
                await scanner.stop();
              }
            } catch {
              // Kamera mungkin sudah dihentikan saat modal ditutup.
            }

            if (!disposed) {
              onScanRef.current(decodedText);
            }
          },
          () => {
            // QR belum terbaca; lanjutkan pemindaian.
          }
        );
      } catch {
        if (!disposed) {
          setCameraError(
            "Kamera tidak dapat dibuka. Izinkan akses kamera atau masukkan kode batch secara manual."
          );
        }
      }
    };

    startScanner();

    return () => {
      disposed = true;

      if (scanner.isScanning) {
        scanner
          .stop()
          .then(() => scanner.clear())
          .catch(() => {});
      } else {
        try {
          scanner.clear();
        } catch {
          // Scanner mungkin belum selesai diinisialisasi.
        }
      }
    };
  }, [scannerId]);

  const [manualCode, setManualCode] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-green-700">
              JejakPangan
            </p>
            <h2 className="mt-1 text-lg font-extrabold text-slate-900">
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100"
          >
            Tutup
          </button>
        </div>

        <div className="rounded-2xl bg-slate-950 p-3">
          <div
            id={scannerId}
            className="min-h-65 overflow-hidden rounded-xl"
          />
        </div>

        {cameraError && (
          <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
            {cameraError}
          </p>
        )}

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-semibold text-slate-400">
            ATAU MASUKKAN MANUAL
          </span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();

            if (manualCode.trim()) {
              onScan(manualCode.trim());
            }
          }}
          className="space-y-3"
        >
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">
              Kode QR / Batch
            </span>
            <input
              className="input"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="Contoh: JP-BATCH-001"
            />
          </label>

          <button
            type="submit"
            disabled={!manualCode.trim()}
            className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ScanLine size={18} />
            Validasi Kode Batch
          </button>
        </form>

        <p className="mt-4 text-xs leading-5 text-slate-500">
          Pastikan QR yang dipindai sesuai dengan batch yang sedang diproses.
          Input manual hanya untuk simulasi atau kondisi kamera tidak tersedia.
        </p>
      </section>
    </div>
  );
}
