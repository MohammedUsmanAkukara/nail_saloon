import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Sparkles,
  ShieldCheck,
  Heart,
  Gem,
  Clock,
  ArrowRight,
  MapPin,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react';
import Button from '../../components/common/Button';
import SectionHeading from '../../components/common/SectionHeading';
import ServiceCard from '../../components/services/ServiceCard';
import LocationCard from '../../components/locations/LocationCard';
import TeamCard from '../../components/common/TeamCard';
import TestimonialCard from '../../components/common/TestimonialCard';
import GalleryGrid from '../../components/gallery/GalleryGrid';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useSettings } from '../../context/SettingsContext';
import api from '../../services/api';

const Home = () => {
  const { settings } = useSettings();
  const [services, setServices] = useState([]);
  const [locations, setLocations] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [team, setTeam] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servRes, locRes, galRes, staffRes, testRes, blogRes] = await Promise.all([
          api.get('/services?featured=true'),
          api.get('/locations'),
          api.get('/gallery?featured=true'),
          api.get('/staff?featured=true'),
          api.get('/testimonials?featured=true'),
          api.get('/blog'),
        ]);

        if (servRes.data?.success) setServices(servRes.data.data);
        if (locRes.data?.success) setLocations(locRes.data.data);
        if (galRes.data?.success) setGallery(galRes.data.data);
        if (staffRes.data?.success) setTeam(staffRes.data.data);
        if (testRes.data?.success) setTestimonials(testRes.data.data);
        if (blogRes.data?.success) setBlogPosts(blogRes.data.data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load home page content:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="overflow-hidden">
      {/* SECTION C: EDITORIAL HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-8 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-6 lg:pr-8 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2">
              <span className="editorial-badge bg-[#F2DDE1] text-[#572A39]">
                <Sparkles className="w-3 h-3 text-[#D8BE9A]" />
                {settings.hero?.badgeText || 'NAIL SALON & SPA EXPERIENCE • MUMBAI & BEYOND'}
              </span>
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-normal leading-[1.08] tracking-tight text-[#252124]">
              {settings.hero?.headline ? (
                settings.hero.headline.split('\n').map((line, idx) => (
                  <span key={idx} className="block">
                    {line}
                  </span>
                ))
              ) : (
                <>
                  Your Nails. <br />
                  Your Art. <br />
                  <span className="italic text-[#572A39]">Your Moment.</span>
                </>
              )}
            </h1>

            <p className="text-base sm:text-lg text-[#252124]/75 font-light max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {settings.hero?.subheadline ||
                'Discover exceptional nail artistry, thoughtful care, and a little everyday luxury.'}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link to="/book" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  <Calendar className="w-4 h-4 mr-2" />
                  {settings.hero?.primaryCtaText || 'Book Your Appointment'}
                </Button>
              </Link>
              <Link to="/services" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  {settings.hero?.secondaryCtaText || 'Explore Our Services'}
                </Button>
              </Link>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-8 border-t border-[#F2DDE1] grid grid-cols-3 gap-4 text-center lg:text-left max-w-md mx-auto lg:mx-0">
              <div>
                <span className="font-serif text-2xl font-semibold text-[#572A39]">3</span>
                <p className="text-[11px] text-[#252124]/60 uppercase tracking-wider mt-0.5">
                  Boutique Studios
                </p>
              </div>
              <div>
                <span className="font-serif text-2xl font-semibold text-[#572A39]">15k+</span>
                <p className="text-[11px] text-[#252124]/60 uppercase tracking-wider mt-0.5">
                  Custom Art Sets
                </p>
              </div>
              <div>
                <span className="font-serif text-2xl font-semibold text-[#572A39]">4.9★</span>
                <p className="text-[11px] text-[#252124]/60 uppercase tracking-wider mt-0.5">
                  Client Rating
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Image Composition Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            {/* Primary Portrait Card */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] max-w-md mx-auto">
              <img
                src={
                  settings.hero?.heroImage ||
                  'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1200&q=80'
                }
                alt="Luxury Japanese Gel Extensions & Art"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#252124]/40 via-transparent to-transparent"></div>
            </div>

            {/* Floating Editorial Badge */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="absolute -bottom-6 -left-4 sm:left-4 bg-[#FAF7F2]/95 backdrop-blur-md p-4 rounded-xl border border-[#F2DDE1] shadow-xl max-w-[220px]"
            >
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-[#D8BE9A]" />
                <span className="text-[10px] tracking-widest uppercase font-semibold text-[#572A39]">
                  Editorial Standard
                </span>
              </div>
              <p className="text-xs text-[#252124]/80 font-light leading-snug">
                European hard gel sculpting &amp; Russian diamond e-file cuticle care.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SECTION D: BRAND INTRODUCTION (THE SOBO EXPERIENCE) */}
      <section className="py-24 bg-[#FAF7F2] border-t border-[#F2DDE1]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Image */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden shadow-lg border border-[#F2DDE1] aspect-[3/4]">
                <img
                  src="https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=900&q=80"
                  alt="Nail Salon & Spa Experience"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-8 -right-6 hidden sm:block w-36 h-36 rounded-full border-2 border-[#C98F9A] border-dashed p-2">
                <div className="w-full h-full rounded-full bg-[#572A39] text-[#FAF7F2] flex items-center justify-center text-center p-3 text-[10px] uppercase tracking-widest font-semibold leading-tight">
                  Handcrafted In Mumbai
                </div>
              </div>
            </div>

            {/* Right Story */}
            <div className="lg:col-span-7 space-y-6">
              <span className="editorial-badge bg-[#F2DDE1] text-[#572A39]">
                {settings.aboutSection?.eyebrow || 'THE SALON & SPA EXPERIENCE'}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#252124] leading-tight">
                {settings.aboutSection?.heading || 'Beauty in Every Detail.'}
              </h2>
              <p className="text-base text-[#252124]/80 font-light leading-relaxed">
                {settings.aboutSection?.story1 ||
                  'At Nail Salon & Spa, we view nail care not as routine maintenance, but as high fashion, personal identity, and quiet luxury.'}
              </p>
              <p className="text-base text-[#252124]/80 font-light leading-relaxed">
                {settings.aboutSection?.story2 ||
                  'Our master nail technicians combine cutting-edge Japanese and Russian dry manicure techniques with non-toxic, salon-grade gel systems that nourish natural nails.'}
              </p>

              <blockquote className="border-l-2 border-[#C98F9A] pl-4 italic font-serif text-lg text-[#572A39]">
                "{settings.aboutSection?.signatureQuote || 'Crafted for connoisseurs of meticulous perfection.'}"
              </blockquote>

              <div className="pt-4">
                <Link to="/about">
                  <Button variant="primary" size="md">
                    Discover Our Story
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION E: FEATURED SERVICES */}
      <section className="py-24 bg-white border-t border-[#F2DDE1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our Signature Treatments"
            title="Curated Nail Services & Rituals"
            subtitle="Every treatment includes dry Russian cuticle refinement, organic hydration therapy, and precision finish."
          />

          {loading ? (
            <LoadingSpinner text="Fetching treatments from our atelier..." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.slice(0, 6).map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          )}

          <div className="mt-14 text-center">
            <Link to="/services">
              <Button variant="secondary" size="lg">
                View Full Treatment Menu
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION F: SIGNATURE NAIL ART GALLERY */}
      <section className="py-24 bg-[#FAF7F2] border-t border-[#F2DDE1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Signature Nail Art Gallery"
            title="A Lookbook of Bespoke Creations"
            subtitle="Explore our signature repertoire spanning minimal negative space, micro French lines, and high-dimension 3D Korean glass art."
          />

          {loading ? (
            <LoadingSpinner text="Loading gallery..." />
          ) : (
            <GalleryGrid items={gallery} showFilters={true} />
          )}

          <div className="mt-12 text-center">
            <Link to="/gallery">
              <Button variant="primary" size="md">
                Explore Complete Lookbook
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION G: WHY CHOOSE US */}
      <section className="py-24 bg-[#572A39] text-[#FAF7F2] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeading
            eyebrow="Our Distinction"
            title="Why Discerning Clients Choose Us"
            subtitle="We adhere to medical-grade hygiene protocols, European hard gel chemistry, and calm, unhurried appointments."
            light={true}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-[#FAF7F2]/5 border border-[#FAF7F2]/10 p-8 rounded-2xl hover:bg-[#FAF7F2]/10 transition-colors">
              <Gem className="w-8 h-8 text-[#D8BE9A] mb-4" />
              <h3 className="font-serif text-2xl font-normal mb-2 text-white">
                Experienced Nail Artists
              </h3>
              <p className="text-sm text-[#FAF7F2]/75 font-light leading-relaxed">
                Our technicians hold advanced certifications in Japanese gel techniques, Russian hardware cuticle sculpting, and custom tip tailoring.
              </p>
            </div>

            <div className="bg-[#FAF7F2]/5 border border-[#FAF7F2]/10 p-8 rounded-2xl hover:bg-[#FAF7F2]/10 transition-colors">
              <ShieldCheck className="w-8 h-8 text-[#D8BE9A] mb-4" />
              <h3 className="font-serif text-2xl font-normal mb-2 text-white">
                Hygiene &amp; Autoclave Care
              </h3>
              <p className="text-sm text-[#FAF7F2]/75 font-light leading-relaxed">
                Hospital-grade autoclave sterilization for all stainless steel instruments, sealed in individual single-client sterilization pouches.
              </p>
            </div>

            <div className="bg-[#FAF7F2]/5 border border-[#FAF7F2]/10 p-8 rounded-2xl hover:bg-[#FAF7F2]/10 transition-colors">
              <Heart className="w-8 h-8 text-[#D8BE9A] mb-4" />
              <h3 className="font-serif text-2xl font-normal mb-2 text-white">
                Non-Toxic &amp; Cruelty-Free
              </h3>
              <p className="text-sm text-[#FAF7F2]/75 font-light leading-relaxed">
                We formulate and select strictly 10-Free gel polishes without formaldehyde, toluene, or harsh DBP for healthy, resilient natural nails.
              </p>
            </div>

            <div className="bg-[#FAF7F2]/5 border border-[#FAF7F2]/10 p-8 rounded-2xl hover:bg-[#FAF7F2]/10 transition-colors">
              <Sparkles className="w-8 h-8 text-[#D8BE9A] mb-4" />
              <h3 className="font-serif text-2xl font-normal mb-2 text-white">
                Bespoke Nail Artistry
              </h3>
              <p className="text-sm text-[#FAF7F2]/75 font-light leading-relaxed">
                No cookie-cutter stamps. Every set is hand-painted and customized to complement your wardrobe, jewelry, and personality.
              </p>
            </div>

            <div className="bg-[#FAF7F2]/5 border border-[#FAF7F2]/10 p-8 rounded-2xl hover:bg-[#FAF7F2]/10 transition-colors">
              <Clock className="w-8 h-8 text-[#D8BE9A] mb-4" />
              <h3 className="font-serif text-2xl font-normal mb-2 text-white">
                Unhurried Sanctuary
              </h3>
              <p className="text-sm text-[#FAF7F2]/75 font-light leading-relaxed">
                We reserve dedicated time blocks for each guest. Relax with herbal teas, curated jazz melodies, and plush velvet seating.
              </p>
            </div>

            <div className="bg-[#FAF7F2]/5 border border-[#FAF7F2]/10 p-8 rounded-2xl hover:bg-[#FAF7F2]/10 transition-colors">
              <MapPin className="w-8 h-8 text-[#D8BE9A] mb-4" />
              <h3 className="font-serif text-2xl font-normal mb-2 text-white">
                Multiple Studio Locations
              </h3>
              <p className="text-sm text-[#FAF7F2]/75 font-light leading-relaxed">
                Visit us across premier heritage and fashion addresses in Bandra West, Colaba, and Indiranagar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION I: HOW BOOKING WORKS */}
      <section className="py-24 bg-white border-t border-[#F2DDE1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Seamless Concierge"
            title="How Appointment Booking Works"
            subtitle="Reserving your time at Nail Salon & Spa takes less than two minutes."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="text-center p-8 bg-[#FAF7F2] rounded-2xl border border-[#F2DDE1]">
              <div className="w-12 h-12 rounded-full bg-[#572A39] text-[#FAF7F2] font-serif text-xl font-bold flex items-center justify-center mx-auto mb-5">
                1
              </div>
              <h3 className="font-serif text-2xl font-normal mb-2 text-[#252124]">
                Choose Your Services
              </h3>
              <p className="text-xs sm:text-sm text-[#252124]/70 font-light leading-relaxed">
                Select your desired gel extensions, dry Russian manicure, or custom nail art styling.
              </p>
            </div>

            <div className="text-center p-8 bg-[#FAF7F2] rounded-2xl border border-[#F2DDE1]">
              <div className="w-12 h-12 rounded-full bg-[#572A39] text-[#FAF7F2] font-serif text-xl font-bold flex items-center justify-center mx-auto mb-5">
                2
              </div>
              <h3 className="font-serif text-2xl font-normal mb-2 text-[#252124]">
                Select Studio &amp; Time
              </h3>
              <p className="text-xs sm:text-sm text-[#252124]/70 font-light leading-relaxed">
                Choose your preferred salon location and an open slot validated in real-time by our engine.
              </p>
            </div>

            <div className="text-center p-8 bg-[#FAF7F2] rounded-2xl border border-[#F2DDE1]">
              <div className="w-12 h-12 rounded-full bg-[#572A39] text-[#FAF7F2] font-serif text-xl font-bold flex items-center justify-center mx-auto mb-5">
                3
              </div>
              <h3 className="font-serif text-2xl font-normal mb-2 text-[#252124]">
                Receive Instant Confirmation
              </h3>
              <p className="text-xs sm:text-sm text-[#252124]/70 font-light leading-relaxed">
                Get an instant booking reference with SMS/WhatsApp concierge reminder details.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link to="/book">
              <Button variant="primary" size="lg">
                <Calendar className="w-4 h-4 mr-2" />
                Reserve Your Appointment Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION J: SALON LOCATIONS */}
      <section className="py-24 bg-[#FAF7F2] border-t border-[#F2DDE1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our Salons"
            title="Boutique Studios Designed for Quiet Luxury"
            subtitle="Find your nearest sanctuary in Mumbai or Bengaluru."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {locations.map((loc) => (
              <LocationCard key={loc._id} location={loc} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/locations">
              <Button variant="secondary" size="md">
                View All Salon Addresses &amp; Directions
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION K: CUSTOMER TESTIMONIALS */}
      <section className="py-24 bg-white border-t border-[#F2DDE1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Client Love"
            title="Endorsements From Our Clientele"
            subtitle="Discover what fashion editors, brides, and regular clients say about their salon experiences."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.slice(0, 3).map((item) => (
              <TestimonialCard key={item._id} testimonial={item} />
            ))}
          </div>

          <div className="mt-12 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/reviews">
              <Button variant="secondary" size="md">
                Read All Verified Client Reviews
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION L: MEET OUR ARTISTS */}
      <section className="py-24 bg-[#FAF7F2] border-t border-[#F2DDE1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our Masters"
            title="The Artists Behind Your Next Set"
            subtitle="Trained internationally in Tokyo, Seoul, and Milan, our technicians treat every fingernail as a bespoke canvas."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <TeamCard key={member._id} member={member} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/team">
              <Button variant="secondary" size="md">
                Meet The Full Team
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION M: GIFT CARDS PREVIEW */}
      <section className="py-20 bg-[#252124] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FAF7F2]/5 border border-white/10 rounded-2xl p-8 md:p-12">
            <div className="lg:col-span-8 space-y-4">
              <span className="editorial-badge bg-[#D8BE9A] text-[#252124]">
                ✨ The Gift of Indulgence
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-white">
                Gift Cards for Someone Special
              </h2>
              <p className="text-sm sm:text-base text-white/70 font-light max-w-xl leading-relaxed">
                Delight friends, brides-to-be, or loved ones with a bespoke afternoon of nail sculpting, champagne treatments, and relaxing spa pedicures.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <Link to="/gift-cards">
                <Button variant="champagne" size="lg" className="w-full">
                  Purchase A Gift Card
                </Button>
              </Link>
              <Link to="/gift-cards">
                <Button variant="secondary" size="md" className="w-full text-white border-white/30 hover:bg-white/10">
                  Check Card Balance
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION N: BEAUTY JOURNAL */}
      <section className="py-24 bg-white border-t border-[#F2DDE1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="The Atelier Journal"
            title="Stories, Techniques &amp; Trend Forecasts"
            subtitle="Curated articles on cuticle longevity, gel chemistry, and fashion week runway inspirations."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <div key={post._id} className="luxury-card overflow-hidden flex flex-col group">
                <div className="relative aspect-[16/10] overflow-hidden bg-[#F2DDE1]/30">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="editorial-badge bg-[#FAF7F2]/95 text-[#572A39] text-[10px]">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <span className="text-[11px] text-[#252124]/50 block mb-2 font-medium">
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}{' '}
                      • {post.readTime}
                    </span>
                    <h3 className="font-serif text-xl font-normal group-hover:text-[#572A39] transition-colors leading-snug mb-3">
                      {post.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#252124]/70 font-light line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-[#F2DDE1]/60 mt-4">
                    <Link
                      to={`/blog/${post.slug}`}
                      className="text-xs font-semibold text-[#572A39] hover:underline underline-offset-4 flex items-center gap-1"
                    >
                      Read Article
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/blog">
              <Button variant="secondary" size="md">
                Visit The Beauty Journal
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION Q: FINAL BOOKING CTA */}
      <section className="py-24 bg-[#FAF7F2] border-t border-[#F2DDE1] text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <span className="editorial-badge bg-[#F2DDE1] text-[#572A39]">
            RESERVE YOUR TIME
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[#252124]">
            Ready for Your Next <span className="italic text-[#572A39]">Nail Moment?</span>
          </h2>
          <p className="text-base sm:text-lg text-[#252124]/75 font-light max-w-xl mx-auto leading-relaxed">
            Step into our sanctuary for bespoke gel extensions, immaculate Russian cuticle refinement, and artisanal hospitality.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/book">
              <Button variant="primary" size="lg">
                <Calendar className="w-4 h-4 mr-2" />
                Book Your Appointment
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="secondary" size="lg">
                Inquire With Concierge
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
