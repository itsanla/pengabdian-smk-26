import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Dashboard internal SMK Negeri 2 Batusangkar untuk pengelolaan data operasional, produksi, dan administrasi sekolah.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
