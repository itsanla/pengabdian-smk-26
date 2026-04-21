import Image from "next/image";
import HeroSection from "../../components/landing/HeroSection";
import TefaHybrid from "../../components/landing/TefaHybrid";
import ProfileSekolah from "../../components/landing/Profilesekolah";
import InfoSekolah from "../../components/landing/Infosekolah";
import Jurusans from "../../components/landing/Jurusan";
import Mitras from "../../components/landing/Mitra";
import Footer from "../../components/landing/Footer";

export default function Home() {
  return (
    <>
      <HeroSection />
      <TefaHybrid />
      <ProfileSekolah />
      <InfoSekolah />
      <Jurusans />
      <Mitras />
      <Footer />
    </>
  );
}
