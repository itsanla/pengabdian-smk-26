import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/landing/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import AuthGuard from "@/components/common/AuthGuard";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "SMK Negeri 2 Batusangkar - Sekolah Menengah Kejuruan Unggulan di Tanah Datar",
    template: "%s | SMK Negeri 2 Batusangkar"
  },
  description: "SMK Negeri 2 Batusangkar adalah sekolah menengah kejuruan negeri terakreditasi B di Kecamatan Lima Kaum, Kabupaten Tanah Datar, Sumatera Barat. Menyediakan program keahlian Teknik Pengelasan, Teknik Kendaraan Ringan Otomotif, Agribisnis Tanaman Pangan dan Hortikultura, Agribisnis Ternak Unggas, dan Agribisnis Pengolahan Hasil Pertanian dengan program Teaching Factory (TEFA).",
  keywords: [
    "SMK Negeri 2 Batusangkar",
    "SMKN 2 Batusangkar",
    "SMK Tanah Datar",
    "Sekolah Kejuruan Batusangkar",
    "Teknik Pengelasan",
    "Teknik Otomotif",
    "Agribisnis",
    "Teaching Factory",
    "TEFA",
    "SMK Sumatera Barat",
    "Pendidikan Kejuruan",
    "Lima Kaum"
  ],
  authors: [{ name: "SMK Negeri 2 Batusangkar" }],
  creator: "SMK Negeri 2 Batusangkar",
  publisher: "SMK Negeri 2 Batusangkar",
  metadataBase: new URL("https://smk2batusangkar.tech"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://smk2batusangkar.tech",
    siteName: "SMK Negeri 2 Batusangkar",
    title: "SMK Negeri 2 Batusangkar - Sekolah Menengah Kejuruan Unggulan di Tanah Datar",
    description: "Sekolah menengah kejuruan negeri terakreditasi B dengan program keahlian Teknik, Agribisnis, dan Busana. Berlokasi di Jl. Raya Bukit Gombak, Kecamatan Lima Kaum, Kabupaten Tanah Datar, Sumatera Barat.",
    images: [
      {
        url: "/image/fotosama.webp",
        width: 1200,
        height: 630,
        alt: "SMK Negeri 2 Batusangkar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SMK Negeri 2 Batusangkar - Sekolah Menengah Kejuruan Unggulan",
    description: "Sekolah menengah kejuruan negeri terakreditasi B di Tanah Datar, Sumatera Barat dengan program Teaching Factory (TEFA).",
    images: ["/image/fotosama.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // google: "your-google-verification-code", // Tambahkan jika sudah punya Google Search Console
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthGuard>{children}</AuthGuard>
        <Toaster/>
        <SonnerToaster position="top-right" richColors />
      </body>
    </html>
  );
}
