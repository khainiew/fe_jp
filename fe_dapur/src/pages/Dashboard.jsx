import { AlertTriangle, CheckCircle2, PackageCheck, ShieldAlert, Thermometer } from "lucide-react";
import { batches } from "../data/mockData";
import StatusBadge from "../components/StatusBadge";
import SummaryCard from "../components/SummaryCard";

export default function Dashboard() {
  const counts = {
    total: batches.length,
    aman: batches.filter((b) => b.status === "AMAN").length,
    waspada: batches.filter((b) => b.status === "WASPADA").length,
    tahan: batches.filter((b) => b.status === "TAHAN").length,
  };

  const hasAlert = counts.waspada + counts.tahan > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
      <div className="mb-6">
        <p className="text-sm font-semibold text-green-700">Internal Dapur</p>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          JejakPangan — Dashboard Katering
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          Pantau status risiko batch, paparan suhu, dan proses keamanan pangan secara real-time.
        </p>
      </div>

      {hasAlert && (
        <div className="mb-6 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="mt-0.5 shrink-0 text-amber-700" size={21} />
          <div>
            <p className="font-bold text-amber-900">Perlu perhatian petugas</p>
            <p className="mt-1 text-sm text-amber-800">
              Terdapat {counts.waspada} batch Waspada dan {counts.tahan} batch Tahan. Batch Tahan harus dikunci sampai ada keputusan supervisor.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Batch aktif" value={counts.total} icon={PackageCheck} tone="slate" />
        <SummaryCard label="Aman" value={counts.aman} icon={CheckCircle2} tone="green" />
        <SummaryCard label="Waspada" value={counts.waspada} icon={ShieldAlert} tone="amber" />
        <SummaryCard label="Tahan" value={counts.tahan} icon={AlertTriangle} tone="red" />
      </div>

      <div className="card mt-6 overflow-hidden">
        <div className="flex flex-col gap-2 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-extrabold text-slate-900">Monitoring Bahan</h2>
            <p className="text-sm text-slate-500">Status berdasarkan indikator suhu × waktu dan prosedur.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="h-2 w-2 rounded-full bg-green-500" /> Sensor terhubung
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3">Batch</th>
                <th className="px-5 py-3">Bahan</th>
                <th className="px-5 py-3">Lokasi</th>
                <th className="px-5 py-3">Suhu / Paparan</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {batches.map((batch) => (
                <tr key={batch.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-mono text-xs font-bold text-green-800">{batch.id}</td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800">{batch.bahan}</p>
                    <p className="text-xs text-slate-400">{batch.kategori}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">{batch.lokasi}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <Thermometer size={15} />
                      {batch.suhu}
                    </div>
                    <p className="mt-1 text-xs text-slate-400">Paparan: {batch.paparan}</p>
                  </td>
                  <td className="px-5 py-4"><StatusBadge status={batch.status} large /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-400">
        Catatan: status adalah indikator risiko, bukan jaminan bebas bakteri/racun. Keputusan akhir untuk batch berisiko dicatat oleh supervisor.
      </p>
    </div>
  );
}