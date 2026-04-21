"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import Link from "next/link";
import {
  Bird,
  ArrowLeft,
  Target,
  Users,
  Building,
  Award,
  CheckCircle,
  Egg,
  HeartPulse,
} from "lucide-react";

const AgribisnisTernakPage = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <main className="pt-24 bg-gradient-to-b from-white to-emerald-50">
      {/* Back Navigation */}
      <div className="container mx-auto px-4 pt-4">
        <Link
          href="/#jurusan"
          className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-800 font-medium transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Program Keahlian
        </Link>
      </div>

      {/* Hero Section */}
      <section ref={ref} className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row gap-8 items-center"
        >
          <div className="w-full md:w-1/2">
            <div className="bg-emerald-100 text-emerald-800 text-xs font-medium py-1 px-3 rounded-full inline-block mb-4">
              Program Keahlian
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
              Agribisnis <span className="text-emerald-600">Ternak Unggas</span>
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Program keahlian yang memfokuskan pada budidaya ternak Unggas dengan metode modern untuk memenuhi kebutuhan protein hewani berkualitas.
            </p>
          </div>
          <div className="w-full md:w-1/2 relative">
            <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden shadow-xl bg-emerald-600 p-4 flex items-center justify-center">
              <div className="absolute inset-0 opacity-20">
                {[...Array(8)].map((_, i) => (
                  <div 
                    key={i}
                    className="absolute rounded-full bg-white/30"
                    style={{
                      width: `${Math.random() * 40 + 10}px`,
                      height: `${Math.random() * 40 + 10}px`,
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animation: `float ${Math.random() * 6 + 3}s infinite ease-in-out`
                    }}
                  ></div>
                ))}
              </div>
              <div className="rounded-xl p-12 bg-white/20 backdrop-blur-sm">
                <Bird className="h-24 w-24 text-white" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Goals & Objectives */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800">
                Tujuan Program Keahlian
              </h2>
              <p className="text-gray-600 mt-3">
                Program Agribisnis Ternak Unggas memiliki tujuan yang dimonitoring, dievaluasi dan dikendalikan setiap
                kurun waktu 1 tahun, sebagai berikut:
              </p>
            </div>

            <div className="space-y-6">
              {[
                "Menghasilkan lulusan yang kompeten dan terampil dalam budidaya ternak dengan standar industri peternakan modern",
                "Menyediakan pendidikan dan pelatihan dalam manajemen pemeliharaan ternak dengan pendekatan berkelanjutan",
                "Membekali siswa dengan pengetahuan dan keterampilan reproduksi ternak untuk meningkatkan produktivitas",
                "Mengembangkan kemampuan dalam pengolahan hasil ternak menjadi produk bernilai tambah",
                "Membangun keterampilan penanganan kesehatan dan kesejahteraan hewan ternak",
                "Mengajarkan manajemen nutrisi ternak yang optimal untuk pertumbuhan dan produksi",
                "Memperkenalkan teknologi modern dalam budidaya ternak untuk efisiensi produksi",
                "Menerapkan pembelajaran berbasis proyek dan praktik langsung di lingkungan peternakan",
                "Menumbuhkan jiwa kewirausahaan dalam bidang peternakan yang berorientasi pasar",
                "Mendorong inovasi dan pengembangan produk peternakan berkualitas",
                "Menanamkan prinsip peternakan ramah lingkungan dan berkelanjutan",
                "Memfasilitasi kerjasama dengan industri peternakan untuk praktik kerja lapangan",
                "Mempersiapkan lulusan untuk melanjutkan ke pendidikan tinggi atau langsung bekerja di industri peternakan",
                "Menghasilkan produk ternak dan olahannya melalui unit produksi sekolah",
                "Membangun jejaring dengan pelaku usaha peternakan lokal dan nasional",
              ].map((goal, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100"
                >
                  <div className="bg-green-100 p-2 rounded-full flex-shrink-0">
                    <Target className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-700">{goal}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Focus Areas Section */}
      <section className="py-16 bg-gradient-to-b from-emerald-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Fokus Program</h2>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
              Program Agribisnis Ternak Unggas berfokus pada pengembangan berbagai aspek produksi dan manajemen peternakan modern.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Budidaya Ternak Ruminansia",
                description: "Pemeliharaan sapi, kambing, dan domba dengan teknologi peternakan modern untuk menghasilkan daging dan susu berkualitas",
                icon: <Bird className="h-8 w-8 text-emerald-600" />
              },
              {
                title: "Budidaya Ternak Unggas",
                description: "Teknik budidaya ayam dan itik untuk produksi telur dan daging dengan pendekatan ramah lingkungan",
                icon: <Egg className="h-8 w-8 text-emerald-600" />
              },
              {
                title: "Kesehatan Hewan",
                description: "Penanganan kesehatan ternak dan pencegahan penyakit untuk memastikan produktivitas dan kesejahteraan hewan",
                icon: <HeartPulse className="h-8 w-8 text-emerald-600" />
              },
              {
                title: "Teknologi Reproduksi",
                description: "Penerapan teknologi reproduksi ternak modern untuk meningkatkan kualitas genetik dan tingkat kelahiran",
                icon: <Award className="h-8 w-8 text-emerald-600" />
              },
              {
                title: "Pengolahan Hasil Ternak",
                description: "Pengolahan produk ternak menjadi berbagai produk bernilai tambah sesuai standar keamanan pangan",
                icon: <CheckCircle className="h-8 w-8 text-emerald-600" />
              },
              {
                title: "Kewirausahaan Peternakan",
                description: "Pengembangan kemampuan bisnis dan manajemen usaha peternakan yang berkelanjutan dan menguntungkan",
                icon: <Users className="h-8 w-8 text-emerald-600" />
              }
            ].map((focus, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                <div className="bg-emerald-50 p-3 inline-block rounded-lg mb-4">
                  {focus.icon}
                </div>
                <h3 className="text-xl font-bold text-emerald-700 mb-3">{focus.title}</h3>
                <p className="text-gray-600">{focus.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Process Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8 md:p-12 shadow-sm border border-emerald-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Proses Pembelajaran
            </h2>
            
            <div className="space-y-4">
              <p className="text-gray-700">
                Program Keahlian Agribisnis Ternak Unggas menerapkan pendekatan pembelajaran yang mengintegrasikan teori dan praktik di lingkungan nyata. Siswa akan belajar melalui:
              </p>
              
              <ul className="space-y-3 mt-4">
                <li className="flex items-start gap-3">
                  <div className="bg-emerald-100 p-1 rounded-full flex-shrink-0 mt-1">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                  </div>
                  <span className="text-gray-700">Praktik langsung di unit produksi peternakan sekolah</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-emerald-100 p-1 rounded-full flex-shrink-0 mt-1">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                  </div>
                  <span className="text-gray-700">Pembelajaran berbasis proyek nyata yang berorientasi pada kebutuhan industri</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-emerald-100 p-1 rounded-full flex-shrink-0 mt-1">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                  </div>
                  <span className="text-gray-700">Kolaborasi dengan pakar dari industri peternakan sebagai guru tamu</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-emerald-100 p-1 rounded-full flex-shrink-0 mt-1">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                  </div>
                  <span className="text-gray-700">Praktik kerja lapangan di perusahaan peternakan terkemuka</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-emerald-100 p-1 rounded-full flex-shrink-0 mt-1">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                  </div>
                  <span className="text-gray-700">Pengembangan produk peternakan melalui riset dan inovasi sederhana</span>
                </li>
              </ul>
              
              <p className="text-gray-700 mt-4">
                Dengan pendekatan pembelajaran ini, siswa tidak hanya memiliki pengetahuan teoritis yang kuat, tetapi juga keterampilan praktis yang siap diterapkan di dunia kerja maupun untuk berwirausaha.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AgribisnisTernakPage;
