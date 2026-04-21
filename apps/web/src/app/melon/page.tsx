'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

// Melon data interfaces
interface MelonDetails {
  brix: string;
  visual: string[];
  bentuk: string;
  tekstur: string[];
  keunggulan: string[];
}

interface MelonProgram {
  id: string;
  title: string;
  description: string;
  image: string;
  features: string[];
  department: string;
  details: MelonDetails;
  harvestTime: string;
  idealStorage: string;
  isNew?: boolean;
}

// Gambar melon untuk digunakan
const melonImages = {
  greenigal: 'https://images.pexels.com/photos/2894272/pexels-photo-2894272.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  dalmatian: 'https://images.pexels.com/photos/5945565/pexels-photo-5945565.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  greeniesweet: 'https://images.pexels.com/photos/8105068/pexels-photo-8105068.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  aruni: 'https://images.pexels.com/photos/5946081/pexels-photo-5946081.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  elysia: 'https://images.pexels.com/photos/5947080/pexels-photo-5947080.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  midori: 'https://images.pexels.com/photos/5945928/pexels-photo-5945928.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  sunray: 'https://images.pexels.com/photos/5648396/pexels-photo-5648396.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  goldqueen: 'https://images.pexels.com/photos/6087662/pexels-photo-6087662.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  honeydew: 'https://images.pexels.com/photos/4022220/pexels-photo-4022220.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  sakura: 'https://images.pexels.com/photos/3029520/pexels-photo-3029520.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
};

// Data varietas melon
const initialMelonData: MelonProgram[] = [
  // Varietas baru ditambahkan di awal array
  {
    id: 'sakura',
    title: 'Melon Sakura',
    description: 'Varietas melon premium dengan daging buah berwarna merah muda, tekstur lembut dan rasa manis seperti buah persik dengan aroma floral yang khas.',
    image: melonImages.sakura,
    features: ['Daging Merah Muda', 'Aroma Floral', 'Tekstur Lembut', 'Brix: 14-16'],
    department: 'Agribisnis Tanaman',
    details: {
      brix: '14 - 16',
      visual: [
        'Kulit tipis berwarna krem dengan semburat merah muda',
        'Tangkai kokoh berbentuk T, panjang 18-22cm dari ujung ke ujung',
        'Permukaan halus dengan sedikit net putih',
        'Warna daging buah merah muda gradasi putih',
        'Tidak ada retakan pada permukaan buah',
        'Ukuran 900gr s/d 1800gr'
      ],
      bentuk: 'Bulat Sempurna dengan Simetris yang Baik',
      tekstur: [
        'Tekstur lembut seperti mentega',
        'Sangat juicy dengan kandungan air tinggi',
        'Biji kompak dan tidak mudah rontok',
        'Daging buah tidak berserat'
      ],
      keunggulan: [
        'Aroma floral yang khas',
        'Rasa manis dengan sentuhan rasa buah persik',
        'Daya tahan pascapanen 10-14 hari pada suhu ruang',
        'Cocok untuk jus premium dan hidangan penutup'
      ]
    },
    harvestTime: '60-65 hari setelah tanam',
    idealStorage: 'Suhu 12-15°C dengan kelembaban 85-90%'
  },
  {
    id: 'goldqueen',
    title: 'Melon Gold Queen',
    description: 'Melon eksotis dengan daging buah berwarna keemasan, rasa super manis dan tekstur renyah yang menghasilkan sensasi makan yang luar biasa.',
    image: melonImages.goldqueen,
    features: ['Daging Keemasan', 'Super Sweet', 'Aroma Eksotis', 'Brix: 15-17'],
    department: 'Agribisnis Tanaman',
    details: {
      brix: '15 - 17',
      visual: [
        'Kulit berwarna kuning keemasan saat matang',
        'Tangkai berbentuk T sempurna, panjang 20-22cm',
        'Net putih tipis yang elegan',
        'Warna daging buah kuning keemasan cerah',
        'Lingkaran biji yang kompak',
        'Ukuran 1000gr s/d 2200gr'
      ],
      bentuk: 'Bulat Oval dengan Simetris Sempurna',
      tekstur: [
        'Tekstur renyah dan padat',
        'Sensasi juicy yang tinggi',
        'Fiber minimal dengan daging buah yang tebal',
        'Biji menempel sempurna tidak mudah lepas'
      ],
      keunggulan: [
        'Tingkat kemanisan tertinggi dalam keluarga melon',
        'Aroma eksotis yang menggoda',
        'Daya tahan pascapanen 14-18 hari',
        'Cocok untuk hidangan premium dan buah potong'
      ]
    },
    harvestTime: '65-70 hari setelah tanam',
    idealStorage: 'Suhu 10-13°C dengan kelembaban 85-90%'
  },
  {
    id: 'honeydew',
    title: 'Melon Honeydew',
    description: 'Melon dengan daging hijau pucat dan rasa manis seperti madu, sangat juicy dan menyegarkan dengan aroma yang halus namun kaya.',
    image: melonImages.honeydew,
    features: ['Super Juicy', 'Honey Sweet', 'Kulit Halus', 'Brix: 14-16'],
    department: 'Agribisnis Tanaman',
    details: {
      brix: '14 - 16',
      visual: [
        'Kulit halus berwarna putih krem saat matang',
        'Tangkai kuat berbentuk T, panjang 19-21cm',
        'Permukaan licin tanpa net',
        'Warna daging hijau pucat sampai putih kehijauan',
        'Tampilan buah mengkilap',
        'Ukuran 1200gr s/d 2500gr'
      ],
      bentuk: 'Bulat Sempurna dengan Ujung Simetris',
      tekstur: [
        'Ultra juicy dengan kandungan air sangat tinggi',
        'Tekstur renyah namun lembut',
        'Daging buah tebal dengan ruang biji kecil',
        'Sensasi meleleh di mulut'
      ],
      keunggulan: [
        'Rasa manis seperti madu yang khas',
        'Kandungan air tertinggi dibanding varietas lain',
        'Daya tahan pascapanen 12-15 hari',
        'Ideal untuk smoothies dan minuman segar'
      ]
    },
    harvestTime: '62-68 hari setelah tanam',
    idealStorage: 'Suhu 10-14°C dengan kelembaban 90-95%'
  },
  {
    id: 'greenigal',
    title: 'Melon Greenigal',
    description: 'Melon premium dengan teknologi hidroponik, menghasilkan buah manis dengan net putih yang merata dan rasa yang luar biasa.',
    image: melonImages.greenigal,
    features: ['Net Putih 90%', 'Tangkai Huruf T', 'Buah Keras Merata', 'Brix: 12-15'],
    department: 'Agribisnis Tanaman',
    details: {
      brix: '12 - 15',
      visual: [
        'Net berwarna putih, persentase 90%',
        'Tangkai membentuk huruf T, panjang 20cm dari ujung ke ujung',
        'Buah keras merata diseluruh bagian',
        'Tidak ada spot gundul',
        'Tidak ada net berwarna kecoklatan/ hitam',
        'Ukuran 800gr s/d 2000gr'
      ],
      bentuk: 'Bulat Simetris',
      tekstur: [
        'Sedikit Crunchy',
        'Biji masih menempel sempurna tidak rontok'
      ],
      keunggulan: [
        'Daya simpan yang sangat baik',
        'Konsistensi rasa manis di seluruh bagian buah',
        'Tahan terhadap penyakit jamur dan bakteri',
        'Produktivitas tinggi per tanaman'
      ]
    },
    harvestTime: '58-63 hari setelah tanam',
    idealStorage: 'Suhu 13-15°C dengan kelembaban 85-90%'
  },
  {
    id: 'dalmatian',
    title: 'Melon Dalmatian',
    description: 'Varietas melon dengan ciri khas bintik hijau yang merata, rasa manis dan tekstur daging buah yang padat dan menyegarkan.',
    image: melonImages.dalmatian,
    features: ['Visual Halus', 'Bintik Hijau Merata', 'Buah Keras Merata', 'Brix: 12-15'],
    department: 'Agribisnis Tanaman',
    details: {
      brix: '12 - 15',
      visual: [
        'Visual halus, terkadang memiliki net dan kering/ berwarna putih',
        'Tangkai membentuk huruf T, panjang 20cm dari ujung ke ujung',
        'Bintik hijau merata seperti pola dalmatian',
        'Tidak ada retakan basah',
        'Buah Keras Merata',
        'Ukuran 800gr s/d 2000gr'
      ],
      bentuk: 'Bulat Simetris',
      tekstur: [
        'Tekstur Padat',
        'Biji masih menempel sempurna tidak rontok',
        'Daging buah sedikit berserat yang menambah kenikmatan'
      ],
      keunggulan: [
        'Visual yang unik dan menarik',
        'Rasa manis yang seimbang dengan sedikit rasa segar',
        'Cocok untuk hidangan salad dan buah potong',
        'Daya simpan 10-12 hari pada suhu ruang'
      ]
    },
    harvestTime: '60-65 hari setelah tanam',
    idealStorage: 'Suhu 12-15°C dengan kelembaban 80-85%'
  },
  {
    id: 'greeniesweet',
    title: 'Melon Greeniesweet',
    description: 'Melon manis dengan visual halus atau net tipis, menghasilkan buah yang lezat dengan tekstur daging yang padat dan rasa yang konsisten.',
    image: melonImages.greeniesweet,
    features: ['Visual Halus', 'Net Tipis', 'Buah Keras Merata', 'Brix: 12-15'],
    department: 'Agribisnis Tanaman',
    details: {
      brix: '12 - 15',
      visual: [
        'Visual halus/ memiliki net tipis dan kering',
        'Tangkai membentuk huruf T, panjang 20cm dari ujung ke ujung',
        'Tidak ada spot hijau',
        'Tidak ada retakan basah',
        'Buah keras merata',
        'Ukuran 800gr s/d 2000gr'
      ],
      bentuk: 'Bulat Simetris',
      tekstur: [
        'Tekstur Padat',
        'Biji masih menempel sempurna tidak rontok',
        'Daging buah tebal dengan kandungan air optimal'
      ],
      keunggulan: [
        'Rasa manis yang konsisten dari batch ke batch',
        'Cocok untuk berbagai pengolahan makanan',
        'Tahan terhadap transportasi jarak jauh',
        'Panen dapat dilakukan pada berbagai musim'
      ]
    },
    harvestTime: '58-63 hari setelah tanam',
    idealStorage: 'Suhu 10-15°C dengan kelembaban 80-90%'
  },
  {
    id: 'aruni',
    title: 'Melon Aruni',
    description: 'Varietas melon premium dengan visual halus, menghasilkan buah yang sempurna untuk berbagai hidangan dan memiliki daya simpan yang baik.',
    image: melonImages.aruni,
    features: ['Visual Halus', 'Net Tipis', 'Buah Keras Merata', 'Brix: 12-15'],
    department: 'Agribisnis Tanaman',
    details: {
      brix: '12 - 15',
      visual: [
        'Visual halus/ memiliki net tipis dan kering',
        'Tangkai membentuk huruf T, panjang 20cm dari ujung ke ujung',
        'Tidak ada spot hijau',
        'Tidak ada retakan basah',
        'Buah keras merata',
        'Ukuran 800gr s/d 2000gr'
      ],
      bentuk: 'Oval/ bulat dan Simetris',
      tekstur: [
        'Tekstur Padat',
        'Biji masih menempel sempurna tidak rontok',
        'Daging buah renyah dengan sedikit juice'
      ],
      keunggulan: [
        'Daya simpan yang sangat baik hingga 14 hari',
        'Ketahanan terhadap penyakit dan hama',
        'Warna daging buah yang menarik dan konsisten',
        'Produktivitas tinggi per tanaman'
      ]
    },
    harvestTime: '60-65 hari setelah tanam',
    idealStorage: 'Suhu 12-14°C dengan kelembaban 85-90%'
  },
  {
    id: 'elysia',
    title: 'Melon Elysia',
    description: 'Melon premium dengan net putih merata dan tekstur renyah, menawarkan pengalaman rasa manis yang sempurna dan aroma yang menggoda.',
    image: melonImages.elysia,
    features: ['Net Putih > 70%', 'Lonjong Simetris', 'Tekstur Crunchy', 'Brix: 13-15'],
    department: 'Agribisnis Tanaman',
    details: {
      brix: '13 - 15',
      visual: [
        'Net putih merata, diatas 70%',
        'Tangkai membentuk huruf T (total 20cm panjang dari ujung ke ujung)',
        'Tidak ada net Retak basah (berwarna cokelat/ hitam)',
        'Buah keras merata',
        'Ukuran 800gr s/d 2000gr'
      ],
      bentuk: 'Lonjong Simetris',
      tekstur: [
        'Tekstur Crunchy',
        'Biji masih menempel sempurna tidak rontok',
        'Daging buah tebal dengan warna oranye menarik'
      ],
      keunggulan: [
        'Aroma yang kuat dan menggoda',
        'Tampilan visual yang sangat menarik',
        'Rasa yang seimbang antara manis dan segar',
        'Cocok untuk konsumsi langsung dan sebagai bahan dessert'
      ]
    },
    harvestTime: '62-67 hari setelah tanam',
    idealStorage: 'Suhu 11-14°C dengan kelembaban 85-90%'
  },
  {
    id: 'midori',
    title: 'Melon Midori',
    description: 'Varietas melon premium dengan net putih merata, rasa manis dan tekstur renyah yang membuatnya menjadi pilihan favorit konsumen.',
    image: melonImages.midori,
    features: ['Net Putih > 70%', 'Lonjong Simetris', 'Tekstur Crunchy', 'Brix: 13-15'],
    department: 'Agribisnis Tanaman',
    details: {
      brix: '13 - 15',
      visual: [
        'Net putih merata, diatas 70%',
        'Tangkai membentuk huruf T, panjang 20cm dari ujung ke ujung',
        'Tidak ada net Retak basah (berwarna cokelat/ hitam)',
        'Buah keras merata',
        'Ukuran 800gr s/d 2000gr'
      ],
      bentuk: 'Lonjong Simetris',
      tekstur: [
        'Tekstur Crunchy',
        'Biji masih menempel sempurna tidak rontok',
        'Daging buah tebal dengan ruang biji yang kecil'
      ],
      keunggulan: [
        'Favorit konsumen berdasarkan survei pasar',
        'Konsistensi kualitas sepanjang tahun',
        'Ketahanan terhadap perubahan cuaca',
        'Daya simpan yang baik hingga 12 hari'
      ]
    },
    harvestTime: '60-65 hari setelah tanam',
    idealStorage: 'Suhu 12-15°C dengan kelembaban 85-90%'
  },
  {
    id: 'sunray',
    title: 'Melon Sunray',
    description: 'Melon spesial dengan warna hijau gelap dan semburat kuning, tekstur renyah dan rasa manis yang membuatnya cocok untuk berbagai sajian.',
    image: melonImages.sunray,
    features: ['Hijau Gelap', 'Semburat Kuning', 'Tekstur Crunchy', 'Brix: 13-15'],
    department: 'Agribisnis Tanaman',
    details: {
      brix: '13 - 15',
      visual: [
        'Berwarna Hijau gelap dan memiliki semburat kuning',
        'Tangkai membentuk huruf T, panjang 20cm dari ujung ke ujung',
        'Terkadang memiliki net berwarna putih',
        'Tidak ada net Retak basah (berwarna cokelat/ hitam)',
        'Buah keras merata',
        'Ukuran 800gr s/d 2000gr'
      ],
      bentuk: 'Lonjong Simetris',
      tekstur: [
        'Tekstur Crunchy',
        'Biji masih menempel sempurna tidak rontok',
        'Daging buah tebal dengan warna kuning cerah'
      ],
      keunggulan: [
        'Visual yang unik dan menarik',
        'Kombinasi rasa manis dengan sedikit asam segar',
        'Tahan terhadap penyakit tanaman',
        'Cocok untuk hidangan salad dan buah potong'
      ]
    },
    harvestTime: '63-68 hari setelah tanam',
    idealStorage: 'Suhu 12-15°C dengan kelembaban 85-90%'
  }
];

export default function MelonPage() {
  const [melons, setMelons] = useState<MelonProgram[]>([]);
  const [filteredMelons, setFilteredMelons] = useState<MelonProgram[]>([]);
  const [selectedMelon, setSelectedMelon] = useState<MelonProgram | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [filterOption, setFilterOption] = useState('all');
  
  // Load melon data on component mount
  useEffect(() => {
    // Check if there's data in localStorage (for demo)
    const storedMelons = localStorage.getItem('melonData');
    
    if (storedMelons) {
      setMelons(JSON.parse(storedMelons));
      setFilteredMelons(JSON.parse(storedMelons));
    } else {
      setMelons(initialMelonData);
      setFilteredMelons(initialMelonData);
    }
  }, []);
  
  // Handle search and filtering
  useEffect(() => {
    let result = [...melons];
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        melon => 
          melon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          melon.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (filterOption !== 'all') {
      // This is a placeholder for future filtering by category
      // e.g., filtering by Brix range or other characteristics
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'newest':
        // No change needed as we'll add new melons at the beginning
        break;
      case 'brix':
        // Sort by brix level (high to low)
        result.sort((a, b) => {
          const aBrix = parseFloat(a.details.brix.split('-')[1] || a.details.brix);
          const bBrix = parseFloat(b.details.brix.split('-')[1] || b.details.brix);
          return bBrix - aBrix;
        });
        break;
      case 'alphabetical':
        // Sort alphabetically by title
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    
    setFilteredMelons(result);
  }, [searchQuery, filterOption, sortOption, melons]);
  
  const handleMelonClick = (melon: MelonProgram) => {
    setSelectedMelon(melon);
    document.body.classList.add('overflow-hidden');
  };
  
  const closeModal = () => {
    setSelectedMelon(null);
    document.body.classList.remove('overflow-hidden');
  };
  
  // Demo function to add a new melon (for demonstration purposes)
  const addNewMelon = () => {
    const newMelon: MelonProgram = {
      id: `new-melon-${Date.now()}`,
      title: `Melon Baru - ${new Date().toLocaleDateString('id-ID')}`,
      description: 'Varietas melon baru yang ditambahkan ke koleksi. Hasil pengembangan terbaru dengan karakteristik unggulan.',
      image: 'https://images.pexels.com/photos/6157056/pexels-photo-6157056.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      features: ['Baru!', 'Hasil Pengembangan', 'Ultra Sweet', 'Brix: 16-18'],
      department: 'Agribisnis Tanaman',
      details: {
        brix: '16 - 18',
        visual: [
          'Kulit berwarna hijau cerah dengan semburat kuning',
          'Tangkai berbentuk T sempurna',
          'Net tipis berpola unik',
          'Daging buah berwarna oranye terang',
          'Ukuran 1200gr s/d 2200gr'
        ],
        bentuk: 'Bulat Sempurna',
        tekstur: [
          'Ultra crisp dan renyah',
          'Kandungan air optimal',
          'Struktur daging buah kompak'
        ],
        keunggulan: [
          'Tingkat kemanisan tertinggi',
          'Aroma yang sangat menggoda',
          'Daya simpan hingga 20 hari',
          'Hasil pengembangan terbaru TEFA SMK NEGERI 2 Batusangkar'
        ]
      },
      harvestTime: '55-60 hari setelah tanam',
      idealStorage: 'Suhu 10-12°C dengan kelembaban 90-95%',
      isNew: true // Flag untuk menandai melon baru
    };
    
    // Add new melon to the beginning of the array
    const updatedMelons = [newMelon, ...melons];
    setMelons(updatedMelons);
    
    // Update localStorage for demo purposes
    localStorage.setItem('melonData', JSON.stringify(updatedMelons));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white pb-20">
      {/* Hero Header */}
      <div className="relative bg-emerald-800 h-64 md:h-80">
        <div className="absolute inset-0 bg-emerald-800 z-0 opacity-90 pattern-grid-lg text-emerald-700"></div>
        
        <div className="container mx-auto px-4 h-full flex items-center justify-center relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Varietas Melon Premium
            </h1>
            <p className="text-emerald-100 max-w-3xl mx-auto text-lg">
              Koleksi lengkap varietas melon hidroponik premium dari program teaching factory SMK NEGERI 2 Batusangkar
            </p>
            
            <div className="mt-8">
              <Link 
                href="/"
                className="px-6 py-3 bg-white text-emerald-800 hover:bg-emerald-50 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center mx-auto w-fit"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Controls Section */}
      <div className="container mx-auto px-4 -mt-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Cari Varietas</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Cari nama atau deskripsi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {/* Sort */}
            <div>
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">Urutkan</label>
              <select
                id="sort"
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="newest">Terbaru Dulu</option>
                <option value="brix">Tingkat Kemanisan (Brix)</option>
                <option value="alphabetical">Abjad (A-Z)</option>
              </select>
            </div>
            
            {/* Action button */}
            <div className="flex items-end">
              <button
                onClick={addNewMelon}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md shadow-sm hover:shadow-md transition-all flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tambah Melon Baru (Demo)
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Melon Cards Grid */}
      <div className="container mx-auto px-4">
        <AnimatePresence>
          {filteredMelons.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredMelons.map((melon) => (
                <motion.div
                  key={melon.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border ${melon.isNew ? 'border-emerald-400' : 'border-gray-100'}`}
                >
                  {melon.isNew && (
                    <div className="absolute top-4 right-4 z-20">
                      <div className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm animate-pulse">
                        BARU
                      </div>
                    </div>
                  )}
                  
                  <div className="h-60 relative overflow-hidden">
                    <Image 
                      src={melon.image} 
                      alt={melon.title}
                      fill 
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-white/80 backdrop-blur-sm text-emerald-800 text-xs font-semibold py-1 px-3 rounded-full">
                          Brix: {melon.details.brix}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-emerald-800 mb-2">{melon.title}</h3>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-2">{melon.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {melon.features.slice(0, 2).map((feature, idx) => (
                        <span 
                          key={idx}
                          className="bg-emerald-50 text-emerald-700 text-xs px-2 py-1 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                      {melon.features.length > 2 && (
                        <span className="bg-emerald-50 text-emerald-700 text-xs px-2 py-1 rounded-full">
                          +{melon.features.length - 2} lainnya
                        </span>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleMelonClick(melon)}
                      className="w-full mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all text-sm font-medium"
                    >
                      Lihat Detail
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Tidak Ada Hasil</h3>
              <p className="text-gray-500">
                Tidak ditemukan varietas melon yang sesuai dengan kriteria pencarian Anda.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Melon Detail Modal */}
      {selectedMelon && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div 
            className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-80 sm:h-96">
              <Image 
                src={selectedMelon.image} 
                alt={selectedMelon.title}
                fill 
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/10"></div>
              
              <div className="absolute top-4 right-4">
                <button 
                  onClick={closeModal}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 rounded-full transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-emerald-500/90 text-white text-xs font-semibold px-3 py-1 rounded-full inline-block">
                    Melon Premium
                  </span>
                  {selectedMelon.isNew && (
                    <span className="bg-amber-500/90 text-white text-xs font-semibold px-3 py-1 rounded-full inline-block animate-pulse">
                      Baru
                    </span>
                  )}
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white">{selectedMelon.title}</h2>
              </div>
            </div>
            
            <div className="p-6 sm:p-8">
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-emerald-800 mb-3">Deskripsi</h3>
                <p className="text-gray-700">{selectedMelon.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-emerald-800 mb-3">Brix (Tingkat Kemanisan)</h3>
                    <div className="bg-emerald-50 p-4 rounded-lg">
                      <p className="text-gray-700 font-medium">{selectedMelon.details.brix}</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-emerald-800 mb-3">Bentuk</h3>
                    <div className="bg-emerald-50 p-4 rounded-lg">
                      <p className="text-gray-700 font-medium">{selectedMelon.details.bentuk}</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-emerald-800 mb-3">Tekstur</h3>
                    <div className="bg-emerald-50 p-4 rounded-lg">
                      <ul className="space-y-2">
                        {selectedMelon.details.tekstur.map((item, idx) => (
                          <li key={idx} className="flex items-start">
                            <div className="h-5 w-5 rounded-full bg-emerald-100 flex-shrink-0 flex items-center justify-center mt-1 mr-3">
                              <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                            </div>
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {selectedMelon.harvestTime && (
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold text-emerald-800 mb-3">Waktu Panen</h3>
                      <div className="bg-emerald-50 p-4 rounded-lg">
                        <p className="text-gray-700 font-medium">{selectedMelon.harvestTime}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-emerald-800 mb-3">Visual</h3>
                    <div className="bg-emerald-50 p-4 rounded-lg">
                      <ul className="space-y-2">
                        {selectedMelon.details.visual.map((item, idx) => (
                          <li key={idx} className="flex items-start">
                            <div className="h-5 w-5 rounded-full bg-emerald-100 flex-shrink-0 flex items-center justify-center mt-1 mr-3">
                              <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                            </div>
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {selectedMelon.details.keunggulan && (
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold text-emerald-800 mb-3">Keunggulan</h3>
                      <div className="bg-emerald-50 p-4 rounded-lg">
                        <ul className="space-y-2">
                          {selectedMelon.details.keunggulan.map((item, idx) => (
                            <li key={idx} className="flex items-start">
                              <div className="h-5 w-5 rounded-full bg-emerald-100 flex-shrink-0 flex items-center justify-center mt-1 mr-3">
                                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                              </div>
                              <span className="text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  {selectedMelon.idealStorage && (
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold text-emerald-800 mb-3">Penyimpanan Ideal</h3>
                      <div className="bg-emerald-50 p-4 rounded-lg">
                        <p className="text-gray-700 font-medium">{selectedMelon.idealStorage}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Bagian dari program TEFA</span>
                    <p className="text-emerald-800 font-medium">{selectedMelon.department}</p>
                  </div>
                  <button 
                    onClick={closeModal}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all w-full sm:w-auto"
                  >
                    Tutup Detail
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}