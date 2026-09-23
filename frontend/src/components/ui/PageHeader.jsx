import { FiPlus, FiSearch } from "react-icons/fi";
import orgSeal from "../../assets/al-fataah-seal.jpg";

export default function PageHeader({
  title,
  subtitle,
  search,
  onSearchChange,
  searchPlaceholder = "بحث...",
  onAdd,
  addLabel = "إضافة",
  extra,
}) {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <img src={orgSeal} alt="" className="w-11 h-11 rounded-full object-cover shrink-0" />
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{title}</h1>
            {subtitle && <p className="text-slate-500 dark:text-slate-400 text-base font-semibold mt-1">{subtitle}</p>}
          </div>
        </div>
        {onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base px-4 py-2.5 rounded-xl shadow-sm transition"
          >
            <FiPlus size={18} />
            {addLabel}
          </button>
        )}
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        {onSearchChange && (
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <FiSearch className="absolute top-1/2 -translate-y-1/2 right-3 text-slate-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
            />
          </div>
        )}
        {extra}
      </div>
    </div>
  );
}
