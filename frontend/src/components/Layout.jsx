import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import orgSeal from "../assets/al-fataah-seal.jpg";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900" dir="rtl">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="relative flex-1 p-4 sm:p-6 max-w-[1400px] w-full mx-auto">
          <img
            src={orgSeal}
            alt=""
            className="pointer-events-none select-none fixed inset-0 m-auto w-[70vw] h-[70vw] max-w-[520px] max-h-[520px] object-contain opacity-[0.05] dark:opacity-[0.07] z-0"
          />
          <div className="relative z-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
