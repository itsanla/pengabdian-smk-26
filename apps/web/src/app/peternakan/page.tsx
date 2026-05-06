import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PeternakanPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-school-primary mb-4">Coming Soon</h1>
        <p className="text-xl text-gray-600 mb-8">Produk Peternakan segera hadir</p>
        <Link 
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-school-primary text-white rounded-lg hover:bg-school-primary/90 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
