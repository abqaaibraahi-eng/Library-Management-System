import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiChevronDown, FiX, FiGrid, FiEdit3, FiBarChart2 } from "react-icons/fi";
import orgSeal from "../assets/al-fataah-seal.jpg";

const registrationLinks = [
  { to: "/arts", label: "تسجيل الفنون" },
  { to: "/authors", label: "تسجيل المؤلفين" },
  { to: "/publishers", label: "تسجيل دور النشر" },
  { to: "/books", label: "تسجيل الكتاب" },
];

const reportLinks = [
  { to: "/reports/all-books", label: "تقرير جميع الكتاب" },
  { to: "/reports/books-by-art", label: "تقرير الكتاب حسب الفنون" },
];

function NavGroup({ label, icon: Icon, links, defaultOpen, closeMobile }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 text-lg font-bold transition"
      >
        <span className="flex items-center gap-3">
          <Icon className="w-[21px] h-[21px]" />
          {label}
        </span>
        <FiChevronDown className={`transition-transform ${open ? "rotate-180" : ""}`} size={18} />
      </button>
      {open && (
        <div className="mt-1.5 mr-2 pr-4 border-r-2 border-slate-200 dark:border-slate-700 flex flex-col gap-1.5">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={closeMobile}
              className={({ isActive }) =>
                `px-3 py-2.5 rounded-lg text-base font-semibold leading-snug transition ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 font-extrabold dark:bg-emerald-900/30 dark:text-emerald-300"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/60"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed lg:sticky top-0 right-0 z-50 lg:z-auto h-screen w-80 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 flex flex-col transition-transform duration-200 ${
          open ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2.5">
            <img src={orgSeal} alt="مركز الفتاح للعلوم الشرعية" className="w-11 h-11 shrink-0" />
            <div>
              <h2 className="font-extrabold text-lg text-slate-800 dark:text-slate-100 leading-tight">نظام إدارة المكتبة</h2>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600">
            <FiX size={22} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-2">
          <NavLink
            to="/"
            end
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-xl text-lg font-bold transition ${
                isActive
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60"
              }`
            }
          >
            <FiGrid className="w-[21px] h-[21px]" />
            لوحة التحكم
          </NavLink>

          <NavGroup label="التسجيل" icon={FiEdit3} links={registrationLinks} defaultOpen closeMobile={onClose} />
          <NavGroup label="التقارير" icon={FiBarChart2} links={reportLinks} closeMobile={onClose} />
        </nav>

        <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-400 dark:text-slate-500 text-center">
          نظام إدارة المكتبة © {new Date().getFullYear()}
        </div>
      </aside>
    </>
  );
}
