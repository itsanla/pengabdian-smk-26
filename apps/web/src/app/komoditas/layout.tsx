import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Katalog Komoditas TEFA",
  description:
    "Jelajahi berbagai komoditas hasil produksi Teaching Factory (TEFA) SMK Negeri 2 Batusangkar. Produk unggulan meliputi melon premium, hasil pertanian, dan komoditas agribisnis berkualitas, seo dikembangkan anla harpanda.",
  keywords: [
    "komoditas TEFA",
    "melon SMKN 2 Batusangkar",
    "produk agribisnis",
    "Teaching Factory",
    "hasil pertanian SMK",
    "komoditas premium",
  ],
  authors: [
    { name: "SMK Negeri 2 Batusangkar" },
    { name: "Anla Harpanda", url: "https://anla.my.id" }
  ],
  creator: "Anla Harpanda",
  alternates: {
    canonical: "/komoditas",
  },
  openGraph: {
    title: "Katalog Komoditas TEFA - SMK Negeri 2 Batusangkar",
    description:
      "Produk unggulan Teaching Factory SMK Negeri 2 Batusangkar: melon premium, hasil pertanian, dan komoditas agribisnis berkualitas, seo dikembangkan anla harpanda.",
    url: "https://smk2batusangkar.tech/komoditas",
    images: [
      {
        url: "/image/melon_aruni.webp",
        width: 1200,
        height: 630,
        alt: "Komoditas TEFA SMK Negeri 2 Batusangkar",
      },
    ],
    authors: ["Anla Harpanda"],
  },
};

export default function KomoditasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
