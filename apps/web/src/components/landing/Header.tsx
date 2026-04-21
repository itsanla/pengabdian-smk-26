'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronDown, Leaf, BookOpen, ExternalLink, User, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Beranda', href: '#' },
    { 
      name: 'Tentang', 
      href: '#about',
      submenu: [
        { name: 'Profil Sekolah', href: '#profile' },
        { name: 'Visi & Misi', href: '#visi-misi' },
        { name: 'Fasilitas', href: '#fasilitas' }
      ]
    },
    { 
      name: 'TEFA', 
      href: '#tefa',
      submenu: [
        { name: 'Program TEFA', href: '#tefa' },
        { name: 'Hasil TEFA', href: '#hasil' }
      ]
    },
    { name: 'Jurusan', href: '#jurusan' },
    { name: 'Mitra', href: '#mitra' },
    { name: 'Kontak', href: '#kontak' },
  ];

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-sm shadow-lg py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-12 w-12 overflow-hidden">
              <div className={`absolute rounded-full h-12 w-12 flex items-center justify-center text-white font-bold transition-all duration-300 
                ${isScrolled ? 'bg-gradient-to-tr from-school-primary to-green-500' : 'bg-gradient-to-tr from-green-500 to-green-400'}
                group-hover:shadow-lg group-hover:scale-105 group-hover:shadow-green-500/30`}>
                <Leaf className="w-6 h-6 absolute opacity-30 animate-float" strokeWidth={1} />
                <span className="z-10 text-white">SMK2</span>
              </div>
            </div>
            <div className={`font-bold text-lg transition-all duration-300 ${isScrolled ? 'text-school-primary' : 'text-white'}`}>
              <span>SMK NEGERI 2 </span>
              <span className="text-school-accent">Batusangkar</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <div key={item.name} className="relative group">
                <div className="flex items-center">
                  <Link 
                    href={item.href}
                    className={`px-3 py-2 rounded-md font-medium hover:text-school-accent transition-all duration-300 flex items-center gap-1 ${
                      isScrolled ? 'text-gray-800' : 'text-white'
                    }`}
                    onMouseEnter={() => item.submenu && setActiveMenu(item.name)}
                    onClick={() => !item.submenu && setActiveMenu(null)}
                  >
                    {item.name}
                    {item.submenu && <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />}
                  </Link>
                </div>

                {/* Submenu with improved design */}
                {item.submenu && (
                  <AnimatePresence>
                    {activeMenu === item.name && (
                      <motion.div 
                        className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl overflow-hidden z-20"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        onMouseLeave={() => setActiveMenu(null)}
                      >
                        <div className="p-1">
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className="block px-4 py-2 text-gray-700 hover:bg-school-primary/10 hover:text-school-primary rounded-md transition-colors duration-200"
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                        {/* Decorative element */}
                        <div className="h-1 bg-gradient-to-r from-school-primary to-school-accent" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}

            {/* Action Buttons */}
            <div className="flex items-center ml-4 space-x-2">
              <button className={`p-2 rounded-full transition-colors ${isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/20'}`}>
                <Search className={`h-5 w-5 ${isScrolled ? 'text-gray-600' : 'text-white'}`} />
              </button>
              <Link href="/login" className="flex items-center gap-2 px-4 py-2 bg-school-accent text-white rounded-full hover:bg-school-accent/90 transition-all duration-300 shadow-md hover:shadow-lg">
                <User className="h-4 w-4" />
                <span className="font-medium">Masuk</span>
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-full ${isScrolled ? 'text-gray-800' : 'text-white'} focus:outline-none`}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t shadow-lg"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <div key={item.name} className="relative">
                    {item.submenu ? (
                      <>
                        <button
                          onClick={() => setActiveMenu(activeMenu === item.name ? null : item.name)}
                          className="flex items-center justify-between w-full px-3 py-2 rounded-md font-medium text-gray-800 hover:bg-gray-100"
                        >
                          <span>{item.name}</span>
                          <ChevronDown className={`h-4 w-4 transition-transform ${activeMenu === item.name ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {activeMenu === item.name && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pl-4 mt-1 border-l-2 border-school-primary/20"
                            >
                              {item.submenu.map((subItem) => (
                                <Link
                                  key={subItem.name}
                                  href={subItem.href}
                                  onClick={() => setIsMenuOpen(false)}
                                  className="block px-3 py-2 text-gray-600 hover:text-school-primary transition-colors duration-200"
                                >
                                  {subItem.name}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-3 py-2 rounded-md font-medium text-gray-800 hover:bg-gray-100 transition-colors duration-200"
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
                <Link href="/login" className="flex items-center justify-center gap-2 px-4 py-3 mt-2 bg-school-primary text-white rounded-md hover:bg-school-primary/90 transition-colors duration-200">
                  <User className="h-5 w-5" />
                  <span className="font-medium">Masuk / Daftar</span>
                </Link>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;