import React from 'react';

export const metadata = {
  title: 'Varietas Melon Premium - SMK NEGERI 2 Batusangkar',
  description: 'Koleksi varietas melon hidroponik premium dari program teaching factory (TEFA) SMK NEGERI 2 Batusangkar',
  keywords: 'melon, hidroponik, TEFA, teaching factory, SMK NEGERI 2 Batusangkar, varietas melon, melon premium',
  authors: [{ name: 'SMK NEGERI 2 Batusangkar' }],
  openGraph: {
    title: 'Varietas Melon Premium - Program TEFA SMK NEGERI 2 Batusangkar',
    description: 'Koleksi lengkap varietas melon hidroponik premium dari program teaching factory SMK NEGERI 2 Batusangkar',
    images: [
      {
        url: 'https://images.pexels.com/photos/2894272/pexels-photo-2894272.jpeg',
        width: 1200,
        height: 630,
        alt: 'Melon Premium SMK NEGERI 2 Batusangkar',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
};

export default function MelonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
      
      <footer className="bg-emerald-900 text-emerald-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold mb-2">TEFA SMK NEGERI 2 Batusangkar</h3>
              <p className="text-emerald-200 text-sm max-w-md">
                Program Teaching Factory untuk pengembangan varietas melon premium dengan teknologi hidroponik modern.
              </p>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-emerald-200 text-sm">
                &copy; {new Date().getFullYear()} SMK NEGERI 2 Batusangkar. All rights reserved.
              </p>
              <p className="text-emerald-300 text-xs mt-1">
                Agribisnis Tanaman - Program Unggulan
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
