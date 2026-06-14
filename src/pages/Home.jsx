import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeaturedRooms from '../components/FeaturedRooms';
import AvailabilityCalendar from '../components/AvailabilityCalendar';
import Highlights from '../components/Highlights';
import HowItWorks from '../components/HowItWorks';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeaturedRooms />
      <AvailabilityCalendar />
      <Highlights />
      <HowItWorks />
      <Contact />
      <Footer />
    </>
  );
}
