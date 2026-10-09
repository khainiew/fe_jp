export default function StatusBadge({ status, large = false }) {
  const styles = {
    AMAN: "bg-green-100 text-green-800 border-green-200",
    Aman: "bg-green-100 text-green-800 border-green-200",
    WASPADA: "bg-amber-100 text-amber-800 border-amber-200",
    Waspada: "bg-amber-100 text-amber-800 border-amber-200",
    TAHAN: "bg-red-700 text-white border-red-700",
    Tahan: "bg-red-700 text-white border-red-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 font-bold ${
        large ? "text-sm" : "text-[11px]"
      } ${styles[status] ?? "bg-slate-100 text-slate-700 border-slate-200"}`}
    >
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}