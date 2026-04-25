import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portal Siswa",
  description:
    "Portal siswa SMK Negeri 2 Batusangkar untuk akses informasi dan aktivitas belajar siswa yang telah login, seo dikembangkan anla harpanda.",
  authors: [
    { name: "SMK Negeri 2 Batusangkar" },
    { name: "Anla Harpanda", url: "https://anla.my.id" }
  ],
  creator: "Anla Harpanda",
  robots: {
    index: true,
    follow: true,
  },
};

export default function SiswaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
