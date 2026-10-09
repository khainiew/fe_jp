import { ShieldCheck, LayoutDashboard, ScanLine } from "lucide-react";

const nav = [
  ["dashboard", "Dashboard", LayoutDashboard],
  ["control", "5 Titik Kontrol", ScanLine],
  ["consumer", "Transparansi", LayoutDashboard],
];

export default function AppShell({ page, setPage, children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-6">
          <button onClick={() => setPage("dashboard")} className="flex items-center gap-3 text-left">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-green-700 text-white shadow-xs">
              <ShieldCheck size={23} />
            </div>
            <div>
              <p className="text-sm font-extrabold text-green-800">JejakPangan</p>
              <p className="text-[11px] text-slate-500">Digital Food Passport</p>
            </div>
          </button>

          <nav className="hidden gap-1 lg:flex">
            {nav.map(([key, label, Icon]) => (
              <button
                key={key}
                onClick={() => setPage(key)}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold ${
                  page === key ? "bg-green-50 text-green-800" : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <Icon size={17} />
                {label}
              </button>
            ))}
          </nav>

          <div className="hidden rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-800 sm:block">
            MOCK MODE
          </div>
        </div>
        <div className="overflow-x-auto border-t border-slate-100 lg:hidden">
          <nav className="mx-auto flex max-w-7xl min-w-max gap-1 px-4 py-2">
            {nav.map(([key, label, Icon]) => (
              <button
                key={key}
                onClick={() => setPage(key)}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold ${
                  page === key ? "bg-green-700 text-white" : "bg-white text-slate-600"
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}