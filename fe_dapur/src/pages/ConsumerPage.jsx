import { CheckCircle2, Clock3, MapPin, Package, ShieldCheck, Star, Store } from "lucide-react";
import { consumerData } from "../data/mockData";
import StatusBadge from "../components/StatusBadge";

export default function ConsumerPage() {
  const data = consumerData;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-md px-4 py-5">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-green-700">JejakPangan</p>
            <p className="text-xs text-slate-500">Paspor Digital Makanan</p>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-green-700 text-white"><ShieldCheck size={21} /></div>
        </header>

        <section className="mt-5 rounded-3xl bg-green-700 p-5 text-white shadow-soft">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-green-100">Status keamanan</p>
              <h1 className="mt-1 text-3xl font-black">Aman</h1>
              <p className="mt-2 text-sm text-green-100">Indikator risiko batch dalam batas aman.</p>
            </div>
            <div className="rounded-2xl bg-white/15 p-3"><CheckCircle2 size={28} /></div>
          </div>
        </section>

        <section className="card mt-4 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Katering</p>
          <h2 className="mt-1 text-xl font-black">{data.catering}</h2>
          <div className="mt-3"><StatusBadge status="Aman" large /></div>
        </section>

        <section className="card mt-4 divide-y divide-slate-100">
          <Info icon={Package} label="Menu" value={data.menu} />
          <Info icon={Store} label="Jenis layanan" value={data.service} />
          <Info icon={MapPin} label="Asal bahan utama" value={data.supplier} />
          <Info icon={Clock3} label="Waktu masak" value={data.cookedAt} />
          <Info icon={MapPin} label="Waktu tiba di klien" value={data.arrivedAt} />
          <Info icon={Clock3} label="Durasi masak → tiba" value={data.duration} />
        </section>

        <section className="card mt-4 p-5">
          <p className="text-sm font-extrabold">Status hidangan saat ini</p>
          <div className="mt-3 rounded-2xl bg-green-50 p-4">
            <p className="font-bold text-green-800">{data.currentStatus}</p>
            <p className="mt-1 text-xs text-green-700">Batch: {data.batchId}</p>
          </div>
        </section>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="card p-5">
            <Star className="text-amber-500" size={20} />
            <p className="mt-3 text-xs text-slate-500">Skor kepatuhan mingguan</p>
            <p className="mt-1 text-3xl font-black">{data.weeklyScore}<span className="text-base text-slate-400">/100</span></p>
          </div>
          <div className="card p-5">
            <ShieldCheck className="text-green-700" size={20} />
            <p className="mt-3 text-xs text-slate-500">Insiden 30 hari</p>
            <p className="mt-1 text-3xl font-black">{data.incidents}</p>
          </div>
        </div>

        <p className="px-2 py-5 text-center text-[11px] leading-5 text-slate-400">
          JejakPangan menampilkan indikator risiko suhu, waktu, dan kepatuhan prosedur. Status Aman bukan jaminan bebas bakteri atau racun.
        </p>
      </div>
    </div>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-3 p-4">
      <Icon className="mt-0.5 shrink-0 text-green-700" size={18} />
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="mt-0.5 text-sm font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}