import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Halaman login portal SMK Negeri 2 Batusangkar untuk akses pengguna terdaftar ke layanan internal sekolah, seo dikembangkan anla harpanda.",
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

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
