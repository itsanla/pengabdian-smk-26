import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Produk Pertanian TEFA",
  description:
    "Jelajahi berbagai produk pertanian hasil produksi Teaching Factory (TEFA) SMK Negeri 2 Batusangkar. Produk unggulan meliputi melon premium, hasil pertanian, dan komoditas agribisnis berkualitas.",
  keywords: [
    "produk pertanian TEFA",
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
    canonical: "/pertanian",
  },
  openGraph: {
    title: "Produk Pertanian TEFA - SMK Negeri 2 Batusangkar",
    description:
      "Produk unggulan Teaching Factory SMK Negeri 2 Batusangkar: melon premium, hasil pertanian, dan komoditas agribisnis berkualitas.",
    url: "https://smk2batusangkar.tech/pertanian",
    images: [
      {
        url: "/image/melon_aruni.webp",
        width: 1200,
        height: 630,
        alt: "Produk Pertanian TEFA SMK Negeri 2 Batusangkar",
      },
    ],
    authors: ["Anla Harpanda"],
  },
};

export default function PertanianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
