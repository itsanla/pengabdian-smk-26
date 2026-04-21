import '../globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { Leaf } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Program Keahlian - SMK NEGERI 2 Batusangkar',
  description: 'Program keahlian unggulan di SMK NEGERI 2 Batusangkar',
};

export default function JurusanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={inter.className}>
      
      {children}
      
      {/* Simple Footer */}
      <footer className="bg-emerald-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-emerald-100/80 text-sm">
            &copy; {new Date().getFullYear()}Developed by{" "}
            <span className="group relative cursor-pointer text-emerald-300 font-medium hover:underline">
              Team Pengabdian PNP
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gradient-to-br from-emerald-700 to-emerald-900 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 shadow-lg transition-all duration-300 scale-95 group-hover:scale-100 pointer-events-none z-10 border border-emerald-600/50">
                <span className="block text-center font-bold text-emerald-300 mb-2 border-b border-emerald-600/30 pb-1">Tim Pengembang</span>
                Defni, S.Si., M.Kom.<br />
                Ainil Mardiah, S.Kom., M.Cs<br />
                Firman Ardiyansyah<br />
                Redho Septa Yudien<br />
                Baghaztra Van Ril<br />
                Pito Desri Pauzi<br />
                Azmi Ali
                <span className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-emerald-800"></span>
              </span>
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}
