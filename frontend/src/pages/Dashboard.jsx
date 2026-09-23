import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import api from "../api/client";
import { PageSpinner } from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";
import orgSeal from "../assets/al-fataah-seal.jpg";

const cards = [
  { key: "total_books", label: "إجمالي الكتاب", color: "emerald", to: "/books" },
  { key: "total_authors", label: "إجمالي المؤلفين", color: "sky", to: "/authors" },
  { key: "total_publishers", label: "إجمالي دور النشر", color: "amber", to: "/publishers" },
  { key: "total_arts", label: "إجمالي الفنون", color: "violet", to: "/arts" },
  { key: "total_pdfs", label: "إجمالي ملفات PDF", color: "rose", to: "/books" },
];

const colorClasses = {
  emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  sky: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  violet: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  rose: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/dashboard/stats")
      .then(({ data }) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageSpinner />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">لوحة التحكم</h1>
        <p className="text-slate-500 dark:text-slate-400 text-base font-semibold mt-1">نظرة عامة على إحصائيات المكتبة</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {cards.map((c) => (
          <Link
            key={c.key}
            to={c.to}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-md transition group"
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 overflow-hidden ${colorClasses[c.color]}`}>
              <img src={orgSeal} alt="" className="w-full h-full object-cover" />
            </div>
            <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{stats?.[c.key] ?? 0}</p>
            <p className="text-slate-500 dark:text-slate-400 text-base font-bold mt-1">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-extrabold text-xl text-slate-800 dark:text-slate-100">أحدث الكتاب المضافة</h2>
          <Link
            to="/books"
            className="text-base text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 hover:gap-1.5 transition-all"
          >
            عرض الكل
            <FiArrowLeft size={15} />
          </Link>
        </div>

        {stats?.recent_books?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-base">
              <thead>
                <tr className="text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700">
                  <th className="text-right font-extrabold py-2.5 px-3 whitespace-nowrap">اسم الكتاب</th>
                  <th className="hidden sm:table-cell text-right font-extrabold py-2.5 px-3 whitespace-nowrap">دار النشر</th>
                  <th className="hidden sm:table-cell text-right font-extrabold py-2.5 px-3 whitespace-nowrap">الفن</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_books.map((b) => (
                  <tr key={b.id} className="border-b border-slate-50 dark:border-slate-700/50 last:border-0">
                    <td className="py-3 px-3">
                      <Link to={`/books/${b.id}`} className="text-slate-700 dark:text-slate-200 font-extrabold hover:text-emerald-600 dark:hover:text-emerald-400">
                        {b.title}
                      </Link>
                    </td>
                    <td className="hidden sm:table-cell py-3 px-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">{b.publisher_name || "—"}</td>
                    <td className="hidden sm:table-cell py-3 px-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">{b.art_name || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="لا توجد كتاب بعد" message="ابدأ بإضافة أول كتاب في المكتبة." />
        )}
      </div>
    </div>
  );
}
