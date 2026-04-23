"use client";

import dynamic from "next/dynamic";
import HeroSection from "../components/landing/HeroSection";
import Header from "../components/landing/Header";
import LazyLoad from "../components/landing/LazyLoad";
import {
  TefaSkeleton,
  ProfileSkeleton,
  SectionSkeleton,
  FooterSkeleton,
} from "../components/landing/Skeleton";

// Dynamic imports for below-fold sections — chunks won't load until needed
const TefaHybrid = dynamic(
  () => import("../components/landing/TefaHybrid"),
  { ssr: false }
);

const ProfileSekolah = dynamic(
  () => import("../components/landing/Profilesekolah"),
  { ssr: false }
);

const InfoSekolah = dynamic(
  () => import("../components/landing/Infosekolah"),
  { ssr: false }
);

const Jurusans = dynamic(
  () => import("../components/landing/Jurusan"),
  { ssr: false }
);

const Mitras = dynamic(
  () => import("../components/landing/Mitra"),
  { ssr: false }
);

const Footer = dynamic(
  () => import("../components/landing/Footer"),
  { ssr: false }
);

export default function Home() {
  return (
    <>
      {/* Header - fixed position, always on top */}
      <Header />

      {/* Hero loads immediately - above the fold */}
      <HeroSection />

      {/* TEFA section - first below-fold, pre-fetched 300px before viewport */}
      <LazyLoad fallback={<TefaSkeleton />} rootMargin="300px">
        <TefaHybrid />
      </LazyLoad>

      {/* Profile section */}
      <LazyLoad fallback={<ProfileSkeleton />} rootMargin="200px">
        <ProfileSekolah />
      </LazyLoad>

      {/* Info section */}
      <LazyLoad fallback={<SectionSkeleton />} rootMargin="200px">
        <InfoSekolah />
      </LazyLoad>

      {/* Jurusan section */}
      <LazyLoad fallback={<SectionSkeleton />} rootMargin="200px">
        <Jurusans />
      </LazyLoad>

      {/* Mitra section */}
      <LazyLoad fallback={<SectionSkeleton />} rootMargin="200px">
        <Mitras />
      </LazyLoad>

      {/* Footer */}
      <LazyLoad fallback={<FooterSkeleton />} rootMargin="100px">
        <Footer />
      </LazyLoad>
    </>
  );
}