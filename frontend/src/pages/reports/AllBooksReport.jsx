import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiEye, FiDownload, FiFile, FiBookOpen, FiUsers, FiHome, FiTag, FiLayers, FiMapPin } from "react-icons/fi";
import api, { fileUrl } from "../../api/client";
import { useToast } from "../../context/ToastContext";
import PageHeader from "../../components/ui/PageHeader";
import { PageSpinner } from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import Pagination from "../../components/ui/Pagination";

function formatSize(bytes) {
  if (!bytes) return "—";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} كيلوبايت`;
  return `${(kb / 1024).toFixed(1)} ميغابايت`;
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="text-slate-400 dark:text-slate-500 mt-0.5 shrink-0" size={17} />
      <div className="min-w-0">
        <p className="text-sm text-slate-400 dark:text-slate-500 leading-tight font-semibold">{label}</p>
        <p className="text-base text-slate-700 dark:text-slate-200 font-bold truncate">{value || "—"}</p>
      </div>
    </div>
  );
}

export default function AllBooksReport() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });
  const toast = useToast();

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get("/books", { params: { search, page, limit: 12 } });
      setBooks(data.data);
      setPagination(data.pagination);
    } catch (err) {
      toast.error(err.response?.data?.message || "تعذّر إنشاء التقرير");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const t = setTimeout(load, search ? 350 : 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div>
      <PageHeader
        title="تقرير جميع الكتاب"
        subtitle="عرض شامل لكل بيانات الكتاب المسجّلة في المكتبة"
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="ابحث باسم الكتاب، المؤلف، دار النشر أو الفن..."
      />

      {loading ? (
        <PageSpinner />
      ) : books.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <EmptyState icon={FiBookOpen} title="لا توجد بيانات" message="لا توجد كتاب مطابقة لمعايير البحث." />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {books.map((b) => (
            <div
              key={b.id}
              className="flex flex-col bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-md transition"
            >
              <Link
                to={`/books/${b.id}`}
                className="font-extrabold text-xl text-slate-800 dark:text-slate-100 leading-snug hover:text-emerald-600 dark:hover:text-emerald-400 line-clamp-2 mb-4"
              >
                {b.title}
              </Link>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <InfoItem icon={FiUsers} label="المؤلف" value={b.authors.map((a) => a.name).join("، ")} />
                <InfoItem icon={FiHome} label="دار النشر" value={b.publisher_name} />
                <InfoItem icon={FiTag} label="الفن" value={b.art_name} />
                <InfoItem icon={FiLayers} label="عدد المجلدات" value={b.volume_count} />
                <InfoItem icon={FiMapPin} label="الرف رقم" value={b.shelf_number} />
              </div>

              <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
                <p className="text-sm font-extrabold text-slate-400 dark:text-slate-500 mb-2">
                  ملفات PDF ({b.pdfs.length})
                </p>
                {b.pdfs.length === 0 ? (
                  <p className="text-sm font-semibold text-slate-400">لا توجد ملفات مرفقة</p>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    {b.pdfs.map((pdf) => (
                      <div
                        key={pdf.id}
                        className="flex items-center justify-between gap-2 bg-slate-50 dark:bg-slate-900/40 rounded-lg px-2.5 py-1.5"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <FiFile className="text-rose-500 dark:text-rose-400 shrink-0" size={15} />
                          <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 truncate">
                            {pdf.original_name}
                          </span>
                          <span className="text-sm text-slate-400 shrink-0">({formatSize(pdf.file_size)})</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <a
                            href={fileUrl(`/api/books/${b.id}/pdfs/${pdf.id}/view`)}
                            target="_blank"
                            rel="noreferrer"
                            title="قراءة"
                            className="p-1.5 rounded-md text-emerald-600 hover:bg-emerald-100 dark:text-emerald-400 dark:hover:bg-emerald-900/40 transition"
                          >
                            <FiEye size={15} />
                          </a>
                          <a
                            href={fileUrl(`/api/books/${b.id}/pdfs/${pdf.id}/download`)}
                            title="تحميل"
                            className="p-1.5 rounded-md text-sky-600 hover:bg-sky-100 dark:text-sky-400 dark:hover:bg-sky-900/40 transition"
                          >
                            <FiDownload size={15} />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && books.length > 0 && pagination.totalPages > 1 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 mt-4">
          <Pagination page={page} totalPages={pagination.totalPages} total={pagination.total} onChange={setPage} />
        </div>
      )}
    </div>
  );
}
