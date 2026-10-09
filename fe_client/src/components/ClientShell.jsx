import {ShieldCheck, FileSearch, ScanLine} from "lucide-react";

const navigation = [
  {
    id: "consumer",
    label: "Detail Makanan",
    icon: FileSearch,
  },
  {
    id: "client",
    label: "Penerimaan",
    icon: ScanLine,
  },
];

export default function ClientShell({ page, setPage, children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-green-700 text-white">
              <ShieldCheck size={22} />
            </div>

            <div>
              <p className="text-sm font-black tracking-tight">
                JejakPangan
              </p>
              <p className="text-xs text-slate-500">
                Portal Klien
              </p>
            </div>
          </div>

          <span className="hidden rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-800 sm:inline-flex">
            Transparansi Pangan
          </span>
        </div>
      </header>

      {/* Navigasi */}
      <nav className="sticky top-16.25 z-10 border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-2 px-4 py-2">
          {navigation.map(({ id, label, icon: Icon }) => {
            const active = page === id;

            return (
              <button
                key={id}
                type="button"
                onClick={() => setPage(id)}
                aria-current={active ? "page" : undefined}
                className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold transition ${
                  active
                    ? "bg-green-700 text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Konten halaman */}
      <main className="mx-auto max-w-5xl">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-4 py-5">
        <p className="text-center text-xs text-slate-400">
          JejakPangan · Sistem Paspor Digital dan Transparansi Pangan
        </p>
      </footer>
    </div>
  );
}