import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEdit2, FiTrash2, FiFile, FiBookOpen } from "react-icons/fi";
import api from "../../api/client";
import { useToast } from "../../context/ToastContext";
import PageHeader from "../../components/ui/PageHeader";
import { PageSpinner } from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import Pagination from "../../components/ui/Pagination";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

export default function BooksList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get("/books", { params: { page, limit: 10 } });
      setBooks(data.data);
      setPagination(data.pagination);
    } catch (err) {
      toast.error(err.response?.data?.message || "تعذّر جلب الكتاب");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function handleDelete() {
    setDeleting(true);
    try {
      await api.delete(`/books/${deleteTarget.id}`);
      toast.success("تم حذف الكتاب بنجاح");
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "تعذّر حذف الكتاب");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="تسجيل الكتاب"
        subtitle="إدارة بيانات الكتاب في المكتبة"
        onAdd={() => navigate("/books/new")}
        addLabel="إضافة كتاب"
      />

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {loading ? (
          <PageSpinner />
        ) : books.length === 0 ? (
          <EmptyState icon={FiBookOpen} title="لا توجد كتاب" message="لم يتم العثور على أي كتاب. جرّب إضافة كتاب جديد." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-base">
              <thead>
                <tr className="text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-700">
                  <th className="text-right font-bold py-3 px-1.5 whitespace-nowrap">الكتاب</th>
                  <th className="text-right font-bold py-3 px-1.5 whitespace-nowrap">المؤلف</th>
                  <th className="text-right font-bold py-3 px-1.5 whitespace-nowrap">دار النشر</th>
                  <th className="text-right font-bold py-3 px-1.5 whitespace-nowrap">الفن</th>
                  <th className="text-right font-bold py-3 px-1.5 whitespace-nowrap">عدد المجلدات</th>
                  <th className="text-right font-bold py-3 px-1.5 whitespace-nowrap">الرف رقم</th>
                  <th className="text-right font-bold py-3 px-1.5 whitespace-nowrap">PDF</th>
                  <th className="text-right font-bold py-3 px-1.5 whitespace-nowrap">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {books.map((b) => (
                  <tr key={b.id} className="border-b border-slate-50 dark:border-slate-700/50 last:border-0 hover:bg-slate-50/60 dark:hover:bg-slate-700/20">
                    <td className="py-2.5 px-1.5">
                      <Link
                        to={`/books/${b.id}`}
                        className="font-extrabold text-lg text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 line-clamp-2 min-w-[130px] inline-block"
                      >
                        {b.title}
                      </Link>
                    </td>
                    <td className="py-2.5 px-1.5 text-slate-500 dark:text-slate-400 max-w-[120px]">
                      {b.authors.map((a) => a.name).join("، ") || "—"}
                    </td>
                    <td className="py-2.5 px-1.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">{b.publisher_name || "—"}</td>
                    <td className="py-2.5 px-1.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">{b.art_name || "—"}</td>
                    <td className="py-2.5 px-1.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">{b.volume_count || "—"}</td>
                    <td className="py-2.5 px-1.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">{b.shelf_number || "—"}</td>
                    <td className="py-2.5 px-1.5">
                      <span className="inline-flex items-center gap-1 text-sm font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-full">
                        <FiFile size={12} />
                        {b.pdfs.length}
                      </span>
                    </td>
                    <td className="py-2.5 px-1.5">
                      <div className="flex items-center gap-0.5">
                        <button onClick={() => navigate(`/books/${b.id}`)} title="عرض" className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 transition">
                          <FiEye size={16} />
                        </button>
                        <button onClick={() => navigate(`/books/${b.id}/edit`)} title="تعديل" className="p-1.5 rounded-lg text-sky-600 hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-sky-900/30 transition">
                          <FiEdit2 size={16} />
                        </button>
                        <button onClick={() => setDeleteTarget(b)} title="حذف" className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 transition">
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && books.length > 0 && (
          <Pagination page={page} totalPages={pagination.totalPages} total={pagination.total} onChange={setPage} />
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="حذف الكتاب"
        message={`هل أنت متأكد من حذف كتاب "${deleteTarget?.title}"؟ سيتم حذف جميع ملفات PDF المرتبطة به.`}
      />
    </div>
  );
}
