"use client";

import {
  Menu,
  ChevronDown,
  BadgeCent,
  ClipboardList,
  Boxes,
  Tractor,
  Warehouse,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function DashboardSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const role = typeof window != "undefined" ? document.cookie
    .split("; ")
    .find((row) => row.startsWith("role="))
    ?.split("=")[1]: null

  const dashboardMenu = [
    {
      name: "Dashboard",
      icon: <ClipboardList className="w-5 h-5" />,
      href: "/dashboard/kepsek",
    },
    {
      name: "Penjualan",
      icon: <BadgeCent className="w-5 h-5" />,
      href: "/dashboard/produksi/penjualan",
    },
    {
      name: "Komoditas",
      icon: <Tractor className="w-5 h-5" />,
      childern: [
        {
          name: "Daftar Komoditas",
          href: "/dashboard/produksi/komoditas",
        },
        {
          name: "Jenis Komoditas",
          href: "/dashboard/produksi/jenis_komoditas",
        },
      ],
    },
    {
      name: "Produksi",
      icon: <Warehouse className="w-5 h-5" />,
      childern: [
        {
          name: "Daftar Produksi",
          href: "/dashboard/produksi/produksi",
        },
        {
          name: "Asal Produksi",
          href: "/dashboard/produksi/asal_produksi",
        },
      ],
    },
    {
      name: "Gudang",
      icon: <Boxes className="w-5 h-5" />,
      childern: [
        {
          name: "Daftar Barang",
          href: "/dashboard/gudang/barang",
        },
        {
          name: "Barang Masuk/Keluar",
          href: "/dashboard/gudang/transaksi",
        },
      ],
    },
    {
      name: "User",
      icon: <Users className="w-5 h-5" />,
      href: "/dashboard/user",
    },
  ];

  // Filter menu sesuai role
  const filteredMenu = dashboardMenu.filter((item) => {
    if (role === "guru" && item.href === "/dashboard/user") return false;
    if (role === "guru" && item.href === "/dashboard/kepsek") return false;
    if (role === "kepsek" && item.href === "/dashboard/user") return false;
    if (role === "siswa") return false; // semua di-hide, ditangani dari middleware
    return true;
  });

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        type="button"
        className="inline-flex p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
        <span className="sr-only">Open sidebar</span>
        <Menu className="w-6 h-6" />
      </button>

      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen bg-gray-800 transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}>
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <Link
            href="/"
            className="flex items-center mb-6 text-2xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            SMK NEGERI 2 Batusangkar
          </Link>
          <hr />
          <ul className="space-y-2 font-medium">
            {filteredMenu.map((item, i) =>
              item.childern ? (
                <li key={`nav-item-${i}`} className="relative">
                  <input type="checkbox" id={`dropdown-${i}`} className="peer hidden" />
                  <label
                    htmlFor={`dropdown-${i}`}
                    className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 cursor-pointer">
                    {item.icon}
                    <span className="flex-1 ms-3 text-left whitespace-nowrap">{item.name}</span>
                    <ChevronDown className="w-4 h-4 peer-checked:rotate-180 transition" />
                  </label>

                  <ul className="max-h-0 overflow-hidden transition-all duration-300 peer-checked:max-h-40 peer-checked:opacity-100 opacity-0 py-0 peer-checked:py-2 space-y-2">
                    {item.childern.map((child, j) => (
                      <li key={`anaknya-menu${j}`}>
                        <Link
                          href={child.href}
                          className={`flex items-center w-full p-2 rounded-lg pl-11 group transition duration-75 ${
                            pathname === child.href
                              ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                              : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}>
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={`nav-item-${i}`}>
                  <Link
                    href={item.href}
                    className={`flex items-center p-2 rounded-lg group transition duration-75 ${
                      pathname === item.href
                        ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                        : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}>
                    {item.icon}
                    <span className="ms-3">{item.name}</span>
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>
      </aside>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden"></div>
      )}
    </>
  );
}
