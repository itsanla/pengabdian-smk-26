import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Produk Peternakan - TEFA SMKN 2 Batusangkar',
  description: 'Produk peternakan dari program Teaching Factory SMKN 2 Batusangkar',
};

export default function PeternakanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
